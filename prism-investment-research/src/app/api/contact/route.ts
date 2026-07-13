// TODO: Connect this endpoint to a privacy-safe form service such as Formspree,
// Resend, Basin, Netlify Forms, or a Vercel serverless handler. Do not add a
// provider or expose private contact details without explicit authorization.
export async function POST(){return Response.json({ok:true,message:"Thank you. Your request has been recorded.",demo:true},{status:200})}
