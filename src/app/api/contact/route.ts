import {contactSchema} from "@/lib/contact-schema";
import {Resend} from "resend";

const RATE_LIMIT=5;
const RATE_WINDOW_MS=60_000;
const MAX_TRACKED_CLIENTS=500;
const CONTACT_FROM="Klyro <contact@luna1research.com>";
type RateLimitEntry={count:number;reset:number};
const globalRateLimit=globalThis as typeof globalThis&{contactRateLimits?:Map<string,RateLimitEntry>};
const attempts=globalRateLimit.contactRateLimits??=new Map<string,RateLimitEntry>();

function clientIdentifier(request:Request){
  return request.headers.get("x-real-ip")??request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()??"unknown";
}

function enforceRateLimit(identifier:string,now=Date.now()){
  for(const[key,value]of attempts){if(value.reset<=now)attempts.delete(key)}
  if(attempts.size>=MAX_TRACKED_CLIENTS&&!attempts.has(identifier)){const oldest=attempts.keys().next().value;if(oldest)attempts.delete(oldest)}
  const current=attempts.get(identifier);
  if(current&&current.reset>now&&current.count>=RATE_LIMIT)return Math.ceil((current.reset-now)/1000);
  attempts.set(identifier,{count:current&&current.reset>now?current.count+1:1,reset:current&&current.reset>now?current.reset:now+RATE_WINDOW_MS});
  return null;
}

function sanitizeProviderError(message:string){
  return message
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,"[email]")
    .replace(/\bre_[A-Z0-9_-]+\b/gi,"[key]");
}

export async function POST(request:Request){
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return Response.json({error:"Content-Type must be application/json."},{status:415});
  const parsed=contactSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return Response.json({error:"Please check the form fields and try again."},{status:400});
  if(parsed.data.website)return Response.json({ok:true,message:"Thank you. Your message has been sent."});

  const retryAfter=enforceRateLimit(clientIdentifier(request));
  if(retryAfter)return Response.json({error:"Too many messages have been submitted. Please wait a minute and try again."},{status:429,headers:{"Retry-After":String(retryAfter)}});

  const key=process.env.RESEND_API_KEY;
  const destination=process.env.CONTACT_DESTINATION;
  if(!key||!destination)return Response.json({error:"Contact delivery is temporarily unavailable. Please try again later."},{status:503});

  try{
    const resend=new Resend(key);
    const{error}=await resend.emails.send({
      from:CONTACT_FROM,
      to:destination,
      replyTo:parsed.data.email,
      subject:`Klyro inquiry: ${parsed.data.subject}`,
      text:`Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nOrganization: ${parsed.data.organization||"Not provided"}\nSubject: ${parsed.data.subject}\n\n${parsed.data.message}`,
    });
    if(error){
      const reason=
        error.name==="invalid_api_key"
          ?"invalid_api_key"
          :error.message.includes("own email address")
            ?"testing_domain_restriction"
            :error.message.includes("domain is not verified")
              ?"unverified_domain"
              :error.name;
      console.error(`Contact email delivery rejected: ${reason}. ${sanitizeProviderError(error.message)}`);
      return Response.json({error:"Your message could not be sent right now. Please try again later."},{status:502});
    }
    return Response.json({ok:true,message:"Thank you. Your message has been sent."});
  }catch{
    console.error("Contact email delivery failed.");
    return Response.json({error:"Your message could not be sent right now. Please try again later."},{status:502});
  }
}
