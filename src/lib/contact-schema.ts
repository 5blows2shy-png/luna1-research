import {z} from "zod";

export const contactSchema=z.object({
  name:z.string().trim().min(2,"Enter your name.").max(80,"Name must be 80 characters or fewer."),
  email:z.string().trim().email("Enter a valid email address.").max(254,"Email must be 254 characters or fewer."),
  subject:z.string().trim().min(3,"Enter a subject.").max(120,"Subject must be 120 characters or fewer.").refine((value)=>!/[\r\n]/.test(value),"Subject cannot contain line breaks."),
  organization:z.string().trim().max(120,"Organization must be 120 characters or fewer.").optional(),
  message:z.string().trim().min(20,"Message must be at least 20 characters.").max(3000,"Message must be 3,000 characters or fewer."),
  website:z.string().max(200).optional(),
});

export type ContactInput=z.infer<typeof contactSchema>;
