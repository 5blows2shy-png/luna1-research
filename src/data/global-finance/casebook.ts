export type FinanceCase = {
  slug: string;
  title: string;
  discipline: string;
  problem: string;
  data: string;
  analysis: string;
  model: string;
  findings: string;
  limitations: string;
  tools: string[];
  href: string;
  action: string;
  status: string;
};
export const financeCases: FinanceCase[] = [
  {
    slug: "treasury",
    title: "When currency moves through earnings",
    discipline: "Global Treasury Case",
    problem:
      "How does a currency move affect a multinational with different revenue and expense exposures?",
    data: "Fictional, editable USD revenue, expense, debt, cash, and exposure assumptions.",
    analysis:
      "Translation sensitivities and annual interest repricing; working-capital cash bridge.",
    model:
      "Revenue × exposure × currency move, less expense translation and financing changes.",
    findings:
      "A positive currency move can increase revenue while local costs offset part of the operating benefit. Review the calculated scenario for numerical results.",
    limitations:
      "No hedge book, tax, maturity schedule, or actual company forecast.",
    tools: ["TypeScript", "SVG charts"],
    href: "/research/global-finance/treasury",
    action: "Open interactive model",
    status: "Interactive educational case",
  },
  {
    slug: "fpa",
    title: "Northstar: consolidate the operating story",
    discipline: "Global FP&A Case",
    problem: "Separate regional operating performance from USD translation.",
    data: "Fictional Q2 2026 budgets and actuals for United States, Germany, Mexico, and Japan; Q2 2025 revenue bases.",
    analysis:
      "Budget variance bridge, constant-currency growth, profitability, headcount, CapEx, and a next-quarter revenue scenario.",
    model:
      "Regional local values × corresponding period-average FX; additive consolidation.",
    findings:
      "The operating variance and FX variance reconcile exactly to the total revenue variance. The live case calculates each contribution.",
    limitations:
      "No intercompany eliminations, seasonality, tax, or profit forecast.",
    tools: ["TypeScript", "CSV export", "SVG / CSS charts"],
    href: "/research/global-finance/fpa",
    action: "Open case and download inputs",
    status: "Fictional case study",
  },
  {
    slug: "equity",
    title: "Corning: geography is not currency",
    discipline: "Global Equity Research",
    problem:
      "Understand geographic sales without inferring invoicing currencies or mixing financial bases.",
    data: "Corning FY2025 Form 10-K, Note 18. Primary-source link, units, period, and basis are displayed in the dossier.",
    analysis:
      "Regional sales chart and calculated shares with explicit missing-data states.",
    model: "Each disclosed region divided by the geographic-table total.",
    findings:
      "Regional shares describe customer geography; they do not measure FX exposure.",
    limitations:
      "The geographic table uses segment reporting; currency exposure and other unverified profile fields remain unavailable.",
    tools: ["SEC Filings", "TypeScript", "CSS charts"],
    href: "/research/companies/glw#global-exposure",
    action: "Open sourced company profile",
    status: "Dated source-backed example",
  },
  {
    slug: "capital-flows",
    title: "AI capacity across borders",
    discipline: "Capital Flow Case",
    problem:
      "Which capital needs and bottlenecks connect international supply chains?",
    data: "Luna1-authored qualitative framework; regional and company evidence review remains pending.",
    analysis:
      "Connect regions, industries, capital needs, bottlenecks, and existing company research.",
    model: "Conceptual value chain; no financial amounts or return estimates.",
    findings:
      "The chain frames diligence questions; it does not establish investment attractiveness.",
    limitations:
      "Not measured trade flows. No directional evidence assessment is published.",
    tools: ["TypeScript", "HTML / CSS diagram"],
    href: "/research/capital-flows#capital-flow-compute",
    action: "Open existing Capital Flow Map",
    status: "Research framework",
  },
];
