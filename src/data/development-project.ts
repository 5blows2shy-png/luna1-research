import type { ProjectArtifact } from "./applied-finance-projects";
export const developmentDashboard: { embedUrl: string | null; approvedForPublicUse: boolean } = { embedUrl: null, approvedForPublicUse: false };
export const developmentArtifacts: ProjectArtifact[] = [
  ["Excel Financial Model", "Excel Workbook", "XLSX"],
  ["Power BI Dashboard", "Power BI Dashboard", "URL"],
  ["PDF Investment Case", "PDF Case Study", "PDF"],
  ["Power BI PDF Export", "PDF Case Study", "PDF"],
].map(([title, type, fileFormat]) => ({ title, type: type as ProjectArtifact["type"], fileFormat: fileFormat as ProjectArtifact["fileFormat"], description: "A reviewed public artifact can be attached here when available.", status: "in-progress", date: null, url: null, fileName: "", fileSize: null, version: "Not yet attached" }));
export const powerBIPages = [
  { title: "Executive overview", detail: "Capacity, illustrative CapEx, horizon, NPV, IRR and MOIC. Revenue / EBITDA trend, annual unlevered FCF, capacity utilization and CapEx by phase. Single-select scenario." },
  { title: "Development", detail: "Stacked annual CapEx by phase, category breakdown, construction / available timeline, and cumulative investment." },
  { title: "Capacity & lease-up", detail: "Available versus leased MW, utilization trend, independent phase ramps, and the capacity-to-unleased bridge." },
  { title: "Operating performance", detail: "Revenue, EBITDA, margin and power KPIs; revenue / EBITDA combo chart, expense breakdown, facility energy, PUE and power cost per utilized MW." },
  { title: "Investment returns", detail: "NPV, IRR, MOIC, payback and exit value; annual and cumulative cash flow, plus a cash-realization bridge." },
  { title: "Scenario & sensitivity", detail: "Base / upside / downside comparisons, construction-cost / lease-ramp IRR heatmap and construction-cost / exit-multiple NPV heatmap. Highlight power and terminal-value risk." },
];
