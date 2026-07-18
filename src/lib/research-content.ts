export const FINANCIAL_DISCLAIMER =
  "Luna1 Research is an educational and personal research project. Nothing presented on this website constitutes investment advice, a recommendation, or an offer to buy or sell securities.";

export type ResearchStatus = "Published" | "In Progress" | "Draft" | "Watching";

export type CompanyResearch = {
  ticker: string;
  slug: string;
  companyName: string;
  sector: string;
  industry: string;
  status: ResearchStatus;
  lastUpdated: string;
  summary: string;
  businessOverview: string;
  businessModel: string;
  revenueDrivers: string[];
  thesis: string[];
  risks: string[];
  catalysts: string[];
  competitiveAdvantages: string[];
  valuation: {
    methodology: string[];
    currentAssessment: string;
    assumptions: string;
  };
  keyMetrics: Array<{ label: string; value: string; note: string }>;
  earningsHistory: Array<{ period: string; revenue: string; eps: string }>;
  quarterlyUpdates: Array<{ period: string; note: string }>;
  pdfUrl?: string;
};

export type InvestmentTheme = {
  slug: string;
  title: string;
  status: ResearchStatus;
  lastUpdated: string;
  summary: string;
  thesis: string;
  valueChain: string[];
  beneficiaries: string[];
  risks: string[];
  monitoringQuestions: string[];
};

export type MacroContextItem = {
  title: string;
  summary: string;
  mostRecentNote: string;
  lastUpdated: string;
};

export type ResearchNote = {
  slug: string;
  title: string;
  category: "Company" | "Theme" | "Macro" | "Process";
  ticker?: string;
  theme?: string;
  status: "Draft" | "Published";
  date: string;
  summary: string;
  sourceLinks: Array<{ label: string; href: string }>;
};

const pendingMetrics = [
  "Revenue growth",
  "Earnings growth",
  "Operating margin",
  "Free cash flow",
].map((label) => ({
  label,
  value: "Data pending update",
  note: "Primary-source financial data has not yet been added.",
}));

export const companyResearch: CompanyResearch[] = [
  {
    ticker: "RY",
    slug: "ry",
    companyName: "Royal Bank of Canada",
    sector: "Financials",
    industry: "Diversified Banks",
    status: "Watching",
    lastUpdated: "Date to be confirmed",
    summary:
      "A diversified Canadian financial institution being studied for franchise durability, capital discipline, and sensitivity to the credit cycle.",
    businessOverview:
      "Royal Bank of Canada serves personal, commercial, wealth-management, insurance, and capital-markets clients. The research is focused on how diversification changes earnings resilience across market cycles.",
    businessModel:
      "The bank earns spread income, fees, advisory revenue, and trading income while managing credit, liquidity, and regulatory capital requirements.",
    revenueDrivers: [
      "Loan and deposit growth",
      "Net interest margin",
      "Wealth and asset-management fees",
      "Capital-markets activity",
    ],
    thesis: [
      "A scaled domestic franchise and diversified fee businesses may support durable through-cycle earnings.",
      "The research remains preliminary until credit quality, capital ratios, and segment returns are evaluated with current filings.",
    ],
    risks: [
      "Credit losses may rise in a weaker economic environment.",
      "Regulation, funding costs, and housing exposure can pressure returns.",
    ],
    catalysts: [
      "Improving credit trends and operating leverage.",
      "Evidence that acquired businesses strengthen returns without weakening capital discipline.",
    ],
    competitiveAdvantages: [
      "Scale and distribution across Canadian financial services.",
      "Diversified customer relationships and fee-generating businesses.",
    ],
    valuation: {
      methodology: [
        "Price-to-book",
        "Price-to-earnings",
        "Dividend sustainability",
      ],
      currentAssessment: "Valuation model in progress.",
      assumptions: "Data pending update.",
    },
    keyMetrics: pendingMetrics,
    earningsHistory: [],
    quarterlyUpdates: [],
  },
  {
    ticker: "GLW",
    slug: "glw",
    companyName: "Corning Incorporated",
    sector: "Information Technology",
    industry: "Electronic Components",
    status: "Watching",
    lastUpdated: "Date to be confirmed",
    summary:
      "A materials-science and specialty-glass company being studied as a potential bottleneck beneficiary across optical connectivity and advanced displays.",
    businessOverview:
      "Corning develops specialty glass, ceramics, and optical-communications products for communications networks, displays, mobile devices, vehicles, and life-sciences applications.",
    businessModel:
      "The company combines process expertise, long-duration customer programs, and capital-intensive manufacturing across several end markets.",
    revenueDrivers: [
      "Optical communications demand",
      "Display-glass volume and pricing",
      "Specialty-material adoption",
      "Automotive and life-sciences demand",
    ],
    thesis: [
      "Corning may benefit when network density and computing demand require more fiber, connectivity, and specialized material content.",
      "The thesis requires evidence that volume growth converts into sustained margin and free-cash-flow improvement.",
    ],
    risks: [
      "End-market cyclicality and customer concentration may create uneven results.",
      "High capital intensity can reduce returns if demand forecasts prove too optimistic.",
    ],
    catalysts: [
      "Accelerating optical-connectivity demand.",
      "Improved utilization, pricing, and operating leverage.",
    ],
    competitiveAdvantages: [
      "Deep materials-science and manufacturing expertise.",
      "Embedded customer relationships and qualification requirements.",
    ],
    valuation: {
      methodology: [
        "Earnings multiple",
        "Free-cash-flow yield",
        "Segment value",
      ],
      currentAssessment: "Valuation model in progress.",
      assumptions: "Data pending update.",
    },
    keyMetrics: pendingMetrics,
    earningsHistory: [],
    quarterlyUpdates: [],
  },
  {
    ticker: "BE",
    slug: "be",
    companyName: "Bloom Energy Corporation",
    sector: "Industrials",
    industry: "Electrical Equipment",
    status: "Watching",
    lastUpdated: "Date to be confirmed",
    summary:
      "A distributed-power company being studied for its potential role in serving power-constrained facilities and data-center demand.",
    businessOverview:
      "Bloom Energy develops solid-oxide energy systems intended to provide on-site power. The research focuses on customer economics, deployment speed, manufacturing scale, and financing quality.",
    businessModel:
      "Revenue may include equipment, installation, service, and financing-related arrangements, making contract quality and cash conversion important diligence areas.",
    revenueDrivers: [
      "Distributed power demand",
      "Data-center and commercial deployments",
      "Manufacturing capacity and utilization",
      "Service and recurring revenue",
    ],
    thesis: [
      "Power availability is becoming a constraint for large computing and industrial projects, which may increase the value of deployable on-site generation.",
      "The thesis remains conditional on profitable growth, cash conversion, reliable operations, and disciplined project economics.",
    ],
    risks: [
      "Project timing, customer concentration, financing needs, and policy changes may create volatility.",
      "Technology performance and total customer economics must remain competitive with alternatives.",
    ],
    catalysts: [
      "New customer commitments supported by clear project economics.",
      "Improving margins, working-capital discipline, and free-cash-flow conversion.",
    ],
    competitiveAdvantages: [
      "Potentially faster deployment than conventional grid expansion.",
      "Specialized solid-oxide technology and manufacturing knowledge.",
    ],
    valuation: {
      methodology: [
        "Scenario analysis",
        "Revenue and margin framework",
        "Cash-flow sensitivity",
      ],
      currentAssessment: "Valuation model in progress.",
      assumptions: "Data pending update.",
    },
    keyMetrics: pendingMetrics,
    earningsHistory: [],
    quarterlyUpdates: [],
  },
];

export const investmentThemes: InvestmentTheme[] = [
  {
    slug: "ai-data-center-buildout",
    title: "AI Data Center Buildout",
    status: "In Progress",
    lastUpdated: "Date to be confirmed",
    summary:
      "The physical infrastructure, power, cooling, networking, and component demands created by accelerated computing.",
    thesis:
      "AI infrastructure investment may reward essential bottleneck providers, but durable economics depend on capacity discipline, customer concentration, and returns on invested capital.",
    valueChain: [
      "Power generation",
      "Grid and electrical equipment",
      "Cooling",
      "Networking",
      "Compute",
      "Construction",
    ],
    beneficiaries: [
      "Mission-critical component suppliers",
      "Network infrastructure providers",
      "Power and cooling specialists",
    ],
    risks: [
      "Overbuilding",
      "Customer concentration",
      "Technology substitution",
      "Power and permitting delays",
    ],
    monitoringQuestions: [
      "Where is capacity genuinely constrained?",
      "Which suppliers convert demand into cash flow?",
      "Are customer commitments durable?",
    ],
  },
  {
    slug: "defense-spending",
    title: "Defense Spending",
    status: "Draft",
    lastUpdated: "Date to be confirmed",
    summary:
      "A study of modernization budgets, electronic systems, mission-critical components, and program execution.",
    thesis:
      "Sustained modernization can support select suppliers, while contract structure, program concentration, and execution determine whether revenue becomes attractive returns.",
    valueChain: [
      "Prime contractors",
      "Electronic systems",
      "Specialty components",
      "Software",
      "Maintenance",
    ],
    beneficiaries: [
      "Qualified component suppliers",
      "Secure communications providers",
      "Modernization contractors",
    ],
    risks: [
      "Budget changes",
      "Program delays",
      "Cost overruns",
      "Customer concentration",
    ],
    monitoringQuestions: [
      "Which programs have funded backlogs?",
      "Where are qualification barriers highest?",
      "Is execution improving?",
    ],
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    status: "Draft",
    lastUpdated: "Date to be confirmed",
    summary:
      "The infrastructure and software layers supporting enterprise computing, data storage, and application delivery.",
    thesis:
      "Cloud adoption can expand recurring revenue and utilization, but competitive intensity and customer optimization make incremental returns more important than headline growth.",
    valueChain: [
      "Semiconductors",
      "Servers",
      "Networking",
      "Cloud platforms",
      "Developer tools",
      "Applications",
    ],
    beneficiaries: [
      "Scaled platforms",
      "Infrastructure enablers",
      "Mission-critical software providers",
    ],
    risks: [
      "Pricing pressure",
      "Workload optimization",
      "Capital intensity",
      "Platform concentration",
    ],
    monitoringQuestions: [
      "Is workload growth reaccelerating?",
      "Where is pricing power durable?",
      "Which layers earn the highest incremental returns?",
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    status: "In Progress",
    lastUpdated: "Date to be confirmed",
    summary:
      "Enterprise security consolidation, recurring demand, and the economics of integrated platforms.",
    thesis:
      "Security remains mission critical, but platform durability must be evaluated through retention, product breadth, cash flow, and the cost of customer migration.",
    valueChain: [
      "Network security",
      "Endpoint",
      "Cloud security",
      "Identity",
      "Operations",
      "Data security",
    ],
    beneficiaries: [
      "Scaled security platforms",
      "Identity providers",
      "Specialized infrastructure security vendors",
    ],
    risks: [
      "Product displacement",
      "Bundling pressure",
      "Execution complexity",
      "Valuation compression",
    ],
    monitoringQuestions: [
      "Does consolidation improve customer outcomes?",
      "Are commitments translating into cash flow?",
      "How durable are switching costs?",
    ],
  },
  {
    slug: "robotics",
    title: "Robotics",
    status: "Draft",
    lastUpdated: "Date to be confirmed",
    summary:
      "Automation systems, enabling components, software, and deployment economics across industrial and service settings.",
    thesis:
      "Labor constraints and improving automation capabilities may expand adoption, while payback periods, reliability, and integration costs determine practical value.",
    valueChain: [
      "Sensors",
      "Motion control",
      "Compute",
      "Robotics platforms",
      "Software",
      "System integration",
    ],
    beneficiaries: [
      "Precision-component suppliers",
      "Automation platforms",
      "System integrators",
    ],
    risks: [
      "Slow adoption",
      "Integration costs",
      "Cyclical capital spending",
      "Commoditization",
    ],
    monitoringQuestions: [
      "Are deployments moving beyond pilots?",
      "What is the customer payback period?",
      "Where are integration bottlenecks?",
    ],
  },
];

export const macroContext: MacroContextItem[] = [
  [
    "Rates and Liquidity",
    "The cost and availability of capital influence valuation, financing, and risk appetite.",
  ],
  [
    "Earnings Breadth",
    "The distribution of estimate revisions helps distinguish broad operating strength from narrow index leadership.",
  ],
  [
    "Credit Conditions",
    "Lending standards, spreads, and loss trends frame balance-sheet risk and economic sensitivity.",
  ],
  [
    "Capital Spending",
    "Investment plans can reveal durable demand as well as the risk of excess capacity.",
  ],
  [
    "Market Structure",
    "Breadth, leadership, and technical health provide context without replacing fundamental work.",
  ],
].map(([title, summary]) => ({
  title,
  summary,
  mostRecentNote: "Research note in development.",
  lastUpdated: "Date to be confirmed",
}));

const researchNoteSeeds: Array<
  readonly [string, string, ResearchNote["category"], string?, string?]
> = [
  [
    "power-constraint",
    "Power constraints and the next data-center bottleneck",
    "Theme",
    undefined,
    "AI Data Center Buildout",
  ],
  [
    "ry-credit-cycle",
    "RY: framing credit-cycle questions",
    "Company",
    "RY",
    undefined,
  ],
  [
    "glw-optical-demand",
    "GLW: mapping optical-connectivity demand",
    "Company",
    "GLW",
    "AI Data Center Buildout",
  ],
  [
    "be-project-economics",
    "BE: questions for project economics",
    "Company",
    "BE",
    "AI Data Center Buildout",
  ],
  [
    "security-consolidation",
    "Security consolidation and platform economics",
    "Theme",
    undefined,
    "Cybersecurity",
  ],
  [
    "research-invalidation",
    "Writing clearer thesis-invalidation rules",
    "Process",
    undefined,
    undefined,
  ],
];

export const researchNotes: ResearchNote[] = researchNoteSeeds.map(
  ([slug, title, category, ticker, theme]) => ({
    slug,
    title,
    category: category as ResearchNote["category"],
    ticker,
    theme,
    status: "Draft" as const,
    date: "Date to be confirmed",
    summary:
      "Working note. Evidence, primary sources, and final conclusions are still being developed.",
    sourceLinks: [],
  }),
);
