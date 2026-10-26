import "server-only";
import type { Catalyst, ChallengeArtifact, ChallengeFinancial, ChallengeRisk, ChallengeStage, InvestmentView, NotebookEntry } from "@/lib/research-challenge-publication";

export const challengeProfile = {
  title: "CFA Institute Research Challenge", season: "2026–2027", institution: "San Diego State University", selection: "Selected Team Member",
  category: "Equity Research · Valuation · Investment Analysis", href: "/recruiter/research-challenge",
  role: "Equity Research Team Member — Company & Strategic Analysis",
  dates: "Oct 2026 – Present",
  summary: "Selected to represent SDSU in the 2026–2027 CFA Institute Research Challenge, conducting fundamental equity research on WD-40 Company (NASDAQ: WDFC).",
  reusableDescription: "Selected to represent SDSU in the 2026–2027 CFA Institute Research Challenge, conducting fundamental equity research on WD-40 Company (NASDAQ: WDFC).",
  responsibilities: [
    "Responsible for analyzing WD-40's business model, product portfolio, geographic revenue exposure, distribution channels, management strategy, and competitive positioning.",
    "Leading the company overview and business mapping workstream, including research into corporate governance, ESG considerations, and business risks to support the team's investment thesis.",
  ],
};
/** Server-only editorial records. Nothing is public without explicit publication approval. */
export const researchChallenge: {
  stage: ChallengeStage;
  company: { name: string; ticker: string; confirmed: boolean; approvedForPublicUse: boolean } | null;
  notebook: NotebookEntry[]; artifacts: ChallengeArtifact[]; catalysts: Catalyst[]; risks: ChallengeRisk[]; financials: ChallengeFinancial[]; investmentView: InvestmentView | null;
} = { stage: "Research In Progress", company: { name: "WD-40 Company", ticker: "NASDAQ: WDFC", confirmed: true, approvedForPublicUse: true }, notebook: [], artifacts: [], catalysts: [], risks: [], financials: [], investmentView: null };
