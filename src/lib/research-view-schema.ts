import { z } from "zod";
import { THESIS_ROLES } from "@/lib/thesis-stress-test";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .optional()
    .transform((value) => value || null);

export const researchViewSchema = z.object({
  professionalRole: z.enum(THESIS_ROLES),
  company: z.string().trim().min(1).max(160),
  thesisStance: z.enum(["Bullish", "Neutral", "Cautious"]),
  importantAssumption: z.string().trim().min(5).max(300),
  mainDisagreement: z.string().trim().min(10).max(1200),
  researchQuestion: z.string().trim().min(10).max(600),
  sourceUrl: z.string().trim().url().max(2000).refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "Source link must use HTTP or HTTPS."),
  name: optionalText(100),
  organization: optionalText(160),
  email: z
    .union([z.literal(""), z.string().trim().email().max(254)])
    .optional()
    .transform((value) => value || null),
  consent: z.literal("true"),
  website: z.string().max(200).optional(),
});

export type ResearchViewInput = z.infer<typeof researchViewSchema>;
