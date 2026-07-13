import {z} from "zod";
export const contactSchema=z.object({name:z.string().trim().min(2).max(80),organization:z.string().trim().min(2).max(120),role:z.string().trim().max(100).optional(),reason:z.enum(["Research discussion","Recruiting inquiry","Professional collaboration","Other"]),linkedin:z.string().url().max(240).optional().or(z.literal("")),message:z.string().trim().min(20).max(3000)});
export type ContactInput=z.infer<typeof contactSchema>;
