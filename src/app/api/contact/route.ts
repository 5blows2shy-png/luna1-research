import {contactSchema} from "@/lib/contact-schema";
import {Resend} from "resend";

const attempts=new Map<string,{count:number;reset:number}>();

export async function POST(request:Request){
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return Response.json({error:"Content-Type must be application/json"},{status:415});
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()??"local";
  const now=Date.now();const entry=attempts.get(ip);
  if(entry&&entry.reset>now&&entry.count>=5)return Response.json({error:"Rate limit exceeded"},{status:429,headers:{"Retry-After":String(Math.ceil((entry.reset-now)/1000))}});
  attempts.set(ip,{count:entry&&entry.reset>now?entry.count+1:1,reset:entry&&entry.reset>now?entry.reset:now+60_000});
  const parsed=contactSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return Response.json({error:"Invalid request"},{status:400});
  const key=process.env.RESEND_API_KEY;const destination=process.env.CONTACT_DESTINATION;
  if(key&&destination){const resend=new Resend(key);await resend.emails.send({from:"Luna1 Research <onboarding@resend.dev>",to:destination,subject:`Professional inquiry: ${parsed.data.reason}`,text:`Name: ${parsed.data.name}\nOrganization: ${parsed.data.organization}\nRole: ${parsed.data.role??""}\nLinkedIn: ${parsed.data.linkedin??""}\n\n${parsed.data.message}`})}
  return Response.json({ok:true,demo:!key||!destination,message:"Thank you. Your request has been recorded."});
}
