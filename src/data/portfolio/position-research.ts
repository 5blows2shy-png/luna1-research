export type PositionResearchSource = {
  id: string;
  title: string;
  publisher: string;
  date: string;
  period: string;
  url: string;
};

export type PositionResearchMetric = {
  label: string;
  value: string;
  numericValue: number;
  type: "Reported" | "Calculated" | "Company-defined";
  sourceId: string;
  note: string;
};

export type PositionResearchSeries = {
  label: string;
  periods: string[];
  values: number[];
  sourceId: string;
  note: string;
};

export type PositionResearchRecord = {
  ticker: "CASY" | "WELL";
  company: string;
  lastUpdated: string;
  classification: string;
  lunaClassification: string;
  topics: string[];
  headline: string;
  thesis: string[];
  metrics: PositionResearchMetric[];
  marginSeries: PositionResearchSeries[];
  operatingHeadline: string;
  operatingEvidence: Array<{ label: string; value: string; note: string; sourceId: string }>;
  insight: string[];
  advantages: Array<[string, string]>;
  drivers: string[];
  monitoring: Array<[string, string]>;
  sources: PositionResearchSource[];
};

export const positionResearch: Record<"CASY" | "WELL", PositionResearchRecord> = {
  CASY: {
    ticker: "CASY",
    company: "Casey's General Stores, Inc.",
    lastUpdated: "Fiscal 2026",
    classification: "Retail Compounder",
    lunaClassification: "Store-Density / Margin-Expansion Compounder",
    topics: ["Consumer Staples", "Convenience Retail", "Prepared Food", "Store Density"],
    headline: "A scaled retail network with multiple paths to store-level productivity.",
    thesis: [
      "Casey's combines convenience retail, fuel, prepared food, and a self-distribution network across 2,944 stores as of April 30, 2026. The research case rests on turning store additions and acquired locations into higher inside sales, prepared-food penetration, and stronger store-level economics.",
      "Fiscal 2026 evidence supports the operating direction: inside same-store sales increased 4.2%, fiscal-year inside margin reached 42.2%, and EBITDA increased 23.6% to approximately $1.48 billion. The next test is whether those gains remain durable as acquisition integration and store expansion continue.",
    ],
    metrics: [
      { label: "Inside margin", value: "42.2%", numericValue: 42.2, type: "Reported", sourceId: "fy26-results", note: "Fiscal 2026 inside gross margin; 41.5% in fiscal 2025." },
      { label: "Prepared-food margin", value: "58.6%", numericValue: 58.6, type: "Reported", sourceId: "fy26-results", note: "Fiscal 2026 prepared food and dispensed beverage margin." },
      { label: "EBITDA growth", value: "23.6%", numericValue: 23.6, type: "Company-defined", sourceId: "fy26-results", note: "Fiscal 2026 EBITDA growth; EBITDA is a non-GAAP measure reconciled by Casey's." },
      { label: "Store operating margin", value: "9.6%", numericValue: 9.6, type: "Calculated", sourceId: "fy26-10k", note: "Luna1 calculation using average operating income divided by average retail sales for fiscal 2026." },
    ],
    marginSeries: [
      { label: "Consolidated Gross Margin", periods: ["FY23", "FY24", "FY25", "FY26"], values: [20.35, 22.53, 23.54, 24.61], sourceId: "financials", note: "Company investor-relations financial fundamentals; fuel revenue makes this measure different from inside margin." },
      { label: "Average Store Operating Margin", periods: ["FY24", "FY25", "FY26"], values: [8.28, 8.93, 9.63], sourceId: "fy26-10k", note: "Calculated from reported average store operating income and average retail sales; excludes company costs not attributable to a store." },
    ],
    operatingHeadline: "The margin mix matters more than fuel revenue alone.",
    operatingEvidence: [
      { label: "Stores", value: "2,944", note: "Reported at April 30, 2026.", sourceId: "fy26-10k" },
      { label: "Inside gross profit", value: "$2.68B", note: "Reported for fiscal 2026.", sourceId: "fy26-results" },
      { label: "EBITDA", value: "$1.48B", note: "Company-defined non-GAAP measure for fiscal 2026.", sourceId: "fy26-results" },
      { label: "Diluted EPS", value: "$19.16", note: "Reported fiscal 2026 diluted earnings per share.", sourceId: "fy26-results" },
    ],
    insight: [
      "Casey's reported margin progression is strongest inside the store, where prepared food and product mix carry better economics than fuel revenue. A higher-quality earnings mix should therefore be tested through inside gross profit and store operating income, not revenue growth alone.",
      "The acquisition thesis is not proven by store count. It is proven when acquired locations connect to Casey's purchasing, distribution, kitchen, loyalty, and merchandising system without weakening capital returns.",
    ],
    advantages: [
      ["Distribution density", "Three distribution centers and a self-distributed fuel network support purchasing and logistics across the store base."],
      ["Prepared-food capability", "Full-service kitchens and proprietary food offerings create a differentiated, higher-margin inside-store revenue stream."],
      ["Small-market positioning", "Approximately 71% of stores operate in communities with fewer than 20,000 people, where national-chain density may be lower."],
      ["Loyalty data", "Nearly 10.5 million Casey's Rewards members provide a growing channel for engagement, promotion, and customer insight."],
    ],
    drivers: ["Profitable new-store growth", "Acquisition integration", "Prepared-food same-store sales", "Inside-margin durability", "Labor productivity", "Loyalty engagement"],
    monitoring: [
      ["Inside same-store sales", "Does traffic and product mix continue to support growth after a strong fiscal 2026?"],
      ["Prepared-food margin", "Can Casey's preserve high food margins while expanding the offering?"],
      ["Store operating income", "Are new and acquired stores improving unit economics rather than only increasing scale?"],
      ["Capital returns", "Does store expansion translate into improving returns after acquisition and remodeling costs?"],
    ],
    sources: [
      { id: "fy26-results", title: "Fourth Quarter and Fiscal Year 2026 Results", publisher: "Casey's General Stores, Inc.", date: "June 9, 2026", period: "Year ended April 30, 2026", url: "https://investor.caseys.com/news-releases/news-release-details/caseys-announces-fourth-quarter-and-fiscal-year-results-1" },
      { id: "fy26-10k", title: "Annual Report on Form 10-K", publisher: "Casey's General Stores, Inc. / U.S. SEC", date: "June 22, 2026", period: "Year ended April 30, 2026", url: "https://www.sec.gov/Archives/edgar/data/726958/000072695826000046/casy-20260430.htm" },
      { id: "financials", title: "Financial Fundamentals - Income Statement", publisher: "Casey's General Stores, Inc.", date: "Updated for fiscal 2026", period: "Fiscal 2023 through fiscal 2026", url: "https://investor.caseys.com/financials/financial-fundamentals/income-statement" },
    ],
  },
  WELL: {
    ticker: "WELL",
    company: "Welltower Inc.",
    lastUpdated: "Q2 2026",
    classification: "Real-Asset Compounder",
    lunaClassification: "Occupancy Recovery / Operating-Leverage Compounder",
    topics: ["Real Estate", "Healthcare REIT", "Senior Housing", "Capital Allocation"],
    headline: "Occupancy and pricing are converting into property-level operating leverage.",
    thesis: [
      "Welltower owns and invests in senior and wellness housing across the United States, United Kingdom, and Canada. The research case is driven by demographic demand, constrained new supply, occupancy recovery, pricing, and capital allocation into assets where operating improvement can compound per-share cash flow.",
      "Second-quarter 2026 evidence remained constructive: normalized FFO per share increased 25% year over year to $1.60, total same-store NOI increased 15.5%, and Seniors Housing Operating same-store NOI increased 20.5%. These are company-defined supplemental measures and should be read with Welltower's reconciliations and portfolio-composition disclosures.",
    ],
    metrics: [
      { label: "Normalized FFO growth", value: "25.0%", numericValue: 25, type: "Company-defined", sourceId: "q2-results", note: "Year-over-year growth in Q2 2026 normalized FFO per diluted share." },
      { label: "Total SSNOI growth", value: "15.5%", numericValue: 15.5, type: "Company-defined", sourceId: "q2-results", note: "Q2 2026 total portfolio same-store NOI growth." },
      { label: "SHO SSNOI growth", value: "20.5%", numericValue: 20.5, type: "Company-defined", sourceId: "q2-results", note: "Q2 2026 Seniors Housing Operating same-store NOI growth." },
      { label: "Net debt / EBITDA", value: "2.99x", numericValue: 2.99, type: "Company-defined", sourceId: "q2-results", note: "Reported Net Debt to Adjusted EBITDA at June 30, 2026." },
    ],
    marginSeries: [
      { label: "SHO Same-Store NOI Margin", periods: ["Q4 24", "Q1 25", "Q2 25", "Q3 25", "Q4 25"], values: [27.3, 28.6, 29.8, 29.7, 30.0], sourceId: "q4-supplement", note: "Company-defined same-store NOI margin on Welltower's pro rata basis." },
      { label: "Normalized FFO per Share", periods: ["Q4 25", "Q1 26", "Q2 26"], values: [1.45, 1.47, 1.60], sourceId: "q2-results", note: "Company-reported normalized FFO per diluted share; values are dollars, not percentages." },
      { label: "SHO Organic Revenue Growth", periods: ["Q4 25", "Q1 26", "Q2 26"], values: [9.6, 9.5, 9.2], sourceId: "q2-results", note: "Company-reported year-over-year same-store revenue growth." },
    ],
    operatingHeadline: "Property-level growth is being amplified by occupancy and expense discipline.",
    operatingEvidence: [
      { label: "Normalized FFO / share", value: "$1.60", note: "Reported for Q2 2026; +25.0% year over year.", sourceId: "q2-results" },
      { label: "Total SSNOI", value: "$800.5M", note: "Company-defined Q2 2026 pro rata same-store NOI.", sourceId: "q2-results" },
      { label: "SHO RevPOR growth", value: "5.2%", note: "Q2 2026 year-over-year same-store revenue per occupied room growth.", sourceId: "q2-results" },
      { label: "Available liquidity", value: "$9.5B", note: "Reported at June 30, 2026, inclusive of specified sources.", sourceId: "q2-results" },
    ],
    insight: [
      "For a senior-housing operating portfolio, the key margin bridge is occupancy plus revenue per occupied room relative to expense per occupied room. Same-store NOI growth should be evaluated alongside those operating components and the changing asset pool.",
      "Welltower's external growth is material, so per-share FFO, leverage, acquisition yields, and post-acquisition operating results matter more than gross investment volume by itself.",
    ],
    advantages: [
      ["Scale and sourcing", "A large portfolio and operator network can broaden acquisition sourcing and operating comparisons."],
      ["Operating data", "Property-level information can support asset selection, operator transitions, pricing, and capital allocation."],
      ["Balance-sheet access", "Liquidity and capital-market access can matter when attractive real-estate opportunities emerge."],
      ["Demographic demand", "Aging populations support the demand backdrop, while local supply and affordability still determine property economics."],
    ],
    drivers: ["Senior-housing occupancy", "Revenue per occupied room", "Expense per occupied room", "Same-store NOI", "Accretive investment", "Per-share FFO growth"],
    monitoring: [
      ["Occupancy", "Is occupancy still rising without requiring uneconomic discounting or elevated costs?"],
      ["NOI margin", "Does property-level margin expansion persist as the portfolio composition changes?"],
      ["Normalized FFO / share", "Are operating gains and investments compounding on a per-share basis?"],
      ["Leverage and liquidity", "Does external growth preserve balance-sheet flexibility and acceptable funding costs?"],
    ],
    sources: [
      { id: "q2-results", title: "Second Quarter 2026 Results", publisher: "Welltower Inc.", date: "July 27, 2026", period: "Quarter ended June 30, 2026", url: "https://welltower.com/investors/press-release-details/?id=808" },
      { id: "q2-10q", title: "Quarterly Report on Form 10-Q", publisher: "Welltower Inc. / U.S. SEC", date: "July 28, 2026", period: "Quarter ended June 30, 2026", url: "https://www.sec.gov/Archives/edgar/data/766704/000076670426000030/well-20260630.htm" },
      { id: "q4-supplement", title: "Fourth Quarter 2025 Supplemental Report", publisher: "Welltower Inc.", date: "February 10, 2026", period: "Quarter ended December 31, 2025", url: "https://welltower.com/wp-content/uploads/2026/02/4Q25-Supplement-99.2-FINAL.pdf" },
    ],
  },
};
