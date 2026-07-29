export type PlatformPillar = {
  number: string;
  title: string;
  href: string;
  purpose: string;
  evidence: string[];
};

export const professionalPositioning =
  "I combine operational experience, accounting knowledge, and investment analysis to understand how businesses create long-term value.";

export const platformPillars: PlatformPillar[] = [
  {
    number: "01",
    title: "Equity Research",
    href: "/research",
    purpose:
      "Source-aware company and industry work that moves from a research question to a documented conclusion.",
    evidence: [
      "Investment thesis",
      "Financial analysis",
      "Valuation and sensitivity",
      "Risks, catalysts, and updates",
    ],
  },
  {
    number: "02",
    title: "Valuation Lab",
    href: "/valuation-models",
    purpose:
      "Transparent valuation frameworks that make assumptions, scenarios, and the market’s implied expectations visible.",
    evidence: [
      "Discounted cash flow",
      "Comparable companies",
      "Revenue build",
      "Assumption tracking",
    ],
  },
  {
    number: "03",
    title: "Transaction Intelligence",
    href: "/transaction-intelligence",
    purpose:
      "An accounting-control workflow for cleaning, classifying, reconciling, reviewing, and exporting transaction records.",
    evidence: [
      "PDF, Excel, and CSV import",
      "Duplicate detection",
      "Reconciliation",
      "Exception review",
    ],
  },
  {
    number: "04",
    title: "Portfolio Lab",
    href: "/portfolio",
    purpose:
      "A decision record centered on thesis quality, valuation, risk, position role, and what changed after purchase.",
    evidence: [
      "Initial thesis",
      "Risk and exit criteria",
      "Thesis status",
      "Decision reviews",
    ],
  },
  {
    number: "05",
    title: "Analyst Journal",
    href: "/analyst-journal",
    purpose:
      "An ongoing notebook for company, industry, earnings, macro, process, and investment-learning observations.",
    evidence: [
      "Company updates",
      "Industry research",
      "Macro observations",
      "Investment lessons",
    ],
  },
  {
    number: "06",
    title: "Development Log",
    href: "/development-log",
    purpose:
      "A transparent record of what changed across Luna1, why it changed, and what the work demonstrated.",
    evidence: [
      "Research coverage",
      "Platform architecture",
      "Performance improvements",
      "Professional development",
    ],
  },
];

export const careerProgression = [
  {
    stage: "Military",
    contribution:
      "Built discipline, stewardship, and accountability for mission-critical resources.",
  },
  {
    stage: "Supply Chain",
    contribution:
      "Learned how inventory, logistics, and operating constraints affect outcomes.",
  },
  {
    stage: "Financial Accountability",
    contribution:
      "Supported expenditure tracking, reporting, and responsible use of resources.",
  },
  {
    stage: "Accounting",
    contribution:
      "Developed reconciliation, transaction-processing, documentation, and control awareness.",
  },
  {
    stage: "Data Center Operations",
    contribution:
      "Gained direct exposure to uptime, capacity, networking, infrastructure, and operational risk.",
  },
  {
    stage: "Finance",
    contribution:
      "Connected operating evidence to financial statements, budgets, forecasts, and capital decisions.",
  },
  {
    stage: "Investment Research",
    contribution:
      "Applied business, industry, valuation, and risk analysis to public companies.",
  },
  {
    stage: "Investment & Strategy",
    contribution:
      "Brings the full progression together in structured research and decision-making.",
  },
] as const;

export const coreStrengths = [
  {
    title: "Financial reasoning",
    description:
      "Connects revenue drivers, margins, cash flow, capital allocation, and valuation to the operating business.",
  },
  {
    title: "Accounting controls",
    description:
      "Understands reconciliations, transaction support, documentation, exceptions, and audit-ready workflows.",
  },
  {
    title: "Operational understanding",
    description:
      "Evaluates infrastructure, capacity, execution risk, and bottlenecks through direct operating experience.",
  },
  {
    title: "Investment process",
    description:
      "Documents the thesis, disconfirming evidence, risk, exit criteria, and the facts that change conviction.",
  },
  {
    title: "Continuous improvement",
    description:
      "Uses decision reviews and development records to turn mistakes and implementation lessons into better rules.",
  },
] as const;

export const primaryCoverage = [
  "Data Centers",
  "Digital Infrastructure",
  "Cloud Infrastructure",
  "Networking",
  "Semiconductors",
  "Financial Infrastructure",
  "Capital Markets",
  "Payment Networks",
] as const;

export const secondaryCoverage = [
  "Industrial Technology",
  "Enterprise Software",
  "Financial Services",
] as const;

export const researchReportStandard = [
  "Executive Summary",
  "Investment Thesis",
  "Business Description",
  "Industry Structure",
  "Financial Statements",
  "Forecast",
  "Valuation",
  "Sensitivity Analysis",
  "Risks",
  "Catalysts",
  "Sources",
  "Research Updates",
] as const;

export const analystJournalCategories = [
  {
    title: "Market Notes",
    description:
      "Observations on breadth, leadership, rates, and the market evidence affecting company-level work.",
  },
  {
    title: "Industry Research",
    description:
      "Value-chain, structure, bottleneck, competitive-position, and capital-intensity notes.",
  },
  {
    title: "Company Updates",
    description:
      "Changes in company evidence, thesis status, catalysts, risks, and research priorities.",
  },
  {
    title: "Earnings Notes",
    description:
      "Quarterly observations published only after company disclosures and source evidence are reviewed.",
  },
  {
    title: "Macro Observations",
    description:
      "Context for financial conditions and market structure without replacing bottom-up analysis.",
  },
  {
    title: "Investment Lessons",
    description:
      "Process observations translated into clearer research, portfolio, and risk-management rules.",
  },
  {
    title: "Books",
    description:
      "Reading notes will appear only when a complete, original analytical takeaway is ready to publish.",
  },
  {
    title: "Ideas",
    description:
      "Early questions and hypotheses that remain explicitly separate from completed research.",
  },
] as const;
