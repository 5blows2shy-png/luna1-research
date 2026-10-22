import type { ResearchDocument } from "../data/research/research-types";
import { safeArtifactUrl } from "../data/applied-finance-projects.ts";
export const challengeStages = ["Selected", "Research In Progress", "Analysis Complete", "Report Complete", "Presentation Complete", "Competition Complete"] as const;
export type ChallengeStage = typeof challengeStages[number];
export type PublicApproval = { approvedForPublicUse: boolean; publication: "draft" | "published" };
export type NotebookEntry = PublicApproval & { category: string; title: string; date: string; body: string; sources: { label: string; url: string }[] };
export type ChallengeArtifact = PublicApproval & Omit<ResearchDocument, "fileFormat"> & { title: string; category: string; fileFormat: ResearchDocument["fileFormat"] | "PPTX" | "URL"; description: string };
export type Catalyst = PublicApproval & { title: string; description: string; timing: string; financialImpact: string; evidence: string; status: string };
export type ChallengeRisk = PublicApproval & { risk: string; whyItMatters: string; financialExposure: string; monitor: string; thesisImpact: string };
export type ChallengeFinancial = PublicApproval & { period: string; basis: "Historical" | "Forecast"; metric: string; value: number; unit: string; source: string };
export type InvestmentView = PublicApproval & { recommendation: string; targetPrice: number | null; currentPrice: number | null; priceDate: string; horizon: string; thesis: string; source: string };
export const isPublicResearch = (item: PublicApproval) => item.approvedForPublicUse === true && item.publication === "published";
export function publicChallengeArtifacts(artifacts: ChallengeArtifact[]) {
  return artifacts.filter(a => isPublicResearch(a) && a.status === "available" && safeArtifactUrl(a.url));
}
export const challengeNotebookCategories = ["Company Overview", "Business Model", "Revenue Drivers", "Industry", "Competitive Position", "Management", "Historical Financials", "Revenue Growth", "Margins", "Cash Flow", "Balance Sheet", "Capital Allocation", "Valuation", "Catalysts", "Risks", "Questions", "Sources", "Research Updates"];
export const challengeArtifactCategories = ["Research Notebook", "Company Analysis", "Industry Research", "Excel Valuation Model", "DCF", "Comparable Companies", "Financial Forecast", "Research Report", "Investment Memo", "Presentation Deck", "Final Competition Report", "Supporting Sources"];
