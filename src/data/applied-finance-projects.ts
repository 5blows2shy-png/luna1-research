import { projectFinanceContext } from "./project-finance-context.ts";
import type { ResearchDocument } from "./research/research-types";

export type ProjectStatus = "In Development" | "Completed" | "Case Study";
export type ArtifactType = "Excel Workbook" | "Power BI Dashboard" | "PDF Case Study" | "PowerPoint" | "Screenshot" | "Financial Model" | "Research Memo" | "Data Source" | "Python Notebook" | "SQL Analysis";
/** Extends the research document contract; available evidence requires a reviewed URL. */
export type ProjectArtifact = Omit<ResearchDocument, "fileFormat"> & {
  title: string;
  type: ArtifactType;
  description: string;
  date: string | null;
  fileFormat: ResearchDocument["fileFormat"] | "PPTX" | "PNG" | "JPG" | "CSV" | "IPYNB" | "SQL" | "URL";
};
export type FinanceProject = {
  slug: string; number: string; title: string; category: string; status: ProjectStatus;
  summary: string; question: string; dataLabel: string; dataNote: string;
  connection: string; skills: string[]; capabilityTitles: string[];
  artifacts: ProjectArtifact[];
  sources: { title: string; url: string | null; provenance: "USER ASSUMPTION" | "PUBLIC DATA" | "SYNTHETIC DATA" }[];
};
function available(title: string, type: ArtifactType, fileFormat: ProjectArtifact["fileFormat"], fileName: string, description: string): ProjectArtifact {
  return { title, type, fileFormat, description, status: "available", date: "2026-10-12", url: `/downloads/${fileName}`, fileName, fileSize: null, version: "1.0 · Completed work sample" };
}
export const financeProjects: FinanceProject[] = [
  {
    slug: "nonprofit-fpa-dashboard", number: "01", title: "Nonprofit FP&A Dashboard",
    category: "FP&A · Financial Reporting · Data Visualization", status: "Completed",
    summary: "Transforming nonprofit financial data into budget, cash-flow, fund, and management insights.",
    question: "Where is performance diverging from plan, and how much cash is available for future operations?",
    dataLabel: "SYNTHETIC DATA",
    dataNote: "A fictional 12-month cash-basis teaching dataset. All revenue is collected and all expenses paid in-period; restricted and unrestricted fund balances equal cash in this simplified case. This is independent portfolio work, not an official employer project.",
    connection: "Inspired by applied nonprofit accounting and financial operations experience, including reconciliations, financial reporting, fund tracking, and accounting support.",
    skills: ["FP&A", "Budgeting", "Forecast Comparison", "Variance Analysis", "Financial Reporting", "Cash Flow Analysis", "Management Reporting", "Excel", "Nonprofit Finance"],
    capabilityTitles: ["FP&A / Strategic Finance", "Data & Analytics"],
    sources: [{ title: "Repository-owned fictional teaching dataset; no employer records", url: null, provenance: "SYNTHETIC DATA" }],
    artifacts: [available("Management case study", "PDF Case Study", "PDF", "nonprofit-fpa-case-study.pdf", "Three-page management report: budget and forecast variances, cash bridge, restricted funds, findings, and methodology."), available("Supporting Excel model", "Excel Workbook", "XLSX", "nonprofit-fpa-workbook.xlsx", "Editable synthetic inputs, monthly reporting formulas, reporting-period controls, cash and fund reconciliation, and trend chart.")],
  },
  {
    slug: "data-center-investment-model", number: "02", title: "Data Center Investment Model",
    category: "Infrastructure & Project Finance · Financial Modeling", status: "Completed",
    summary: "Hypothetical $50M data-center expansion analyzing operating economics, project financing, debt service, CFADS, DSCR, project and equity returns, and downside sensitivities.",
    question: "How is the expansion financed, what operating cash supports repayment, and how do project returns and debt coverage change in a downside case?",
    dataLabel: "HYPOTHETICAL PROJECT FINANCE CASE STUDY",
    dataNote: "Every starting input is an editable illustrative assumption, not an industry average. No LightEdge investment, pricing, capacity, customer information, facility architecture, or operating data is represented.",
    connection: "Combines hands-on exposure to mission-critical data center infrastructure with financial modeling and capital investment analysis. Operational concepts include UPS, PDU, generators, cooling, power, racks, network infrastructure, capacity, and reliability.",
    skills: ["Capital Budgeting", "Infrastructure Finance", "Financial Modeling", "NPV / IRR", "Sensitivity Analysis", "Scenario Analysis", "Cash Flow Forecasting", "Operational Finance", "Data Center Economics", "Excel", "Data Analysis", "Debt Financing", "Sources & Uses", "CFADS", "DSCR", "Debt Amortization", "Capital Structure", "Industry Research", "Risk Assessment", "Investment Banking Presentation Skills"],
    capabilityTitles: ["Financial Modeling", "Data & Analytics"],
    sources: [{ title: "Illustrative assumptions authored for this educational model; no external operating data", url: null, provenance: "USER ASSUMPTION" }, { title: `${projectFinanceContext.source.title} · sector context only · accessed ${projectFinanceContext.source.accessed}`, url: projectFinanceContext.source.url, provenance: "PUBLIC DATA" }],
    artifacts: [available("Excel Financial Model · Data Center Infrastructure Project Finance Case", "Excel Workbook", "XLSX", "data-center-project-finance.xlsx", "Formula-based model with one active scenario, sources & uses, operating and debt schedules, tax and working capital, CFADS, DSCR, project and equity returns, and native Excel sensitivity tables."), available("PDF Work Sample · Data Center Infrastructure Project Finance Case", "PDF Case Study", "PDF", "data-center-project-finance.pdf", "Eight-page recruiting presentation covering project economics, financing, debt repayment, sensitivities, and downside assessment. Starting base case; on-page edits are not included.")],
  },
];
export function safeArtifactUrl(url: string | null): string | null {
  if (!url || /[\\\s\u0000-\u001f]/.test(url)) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try { const parsed = new URL(url); return parsed.protocol === "https:" && !parsed.username && !parsed.password ? url : null; } catch { return null; }
}
export function projectHref(slug: string) { return `/recruiter/projects/${slug}`; }
