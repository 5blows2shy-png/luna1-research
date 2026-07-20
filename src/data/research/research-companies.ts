import type {
  CompanyResearchCoverage,
  HistoricalFinancialRecord,
  ResearchKind,
  ResearchSection,
  SegmentRecord,
} from "./research-types";
import { DATA_PENDING, RESEARCH_IN_PROGRESS } from "./research-disclosures";

type CoverageSeed = {
  ticker: string;
  companyName: string;
  kind?: ResearchKind;
  sector: string;
  industry: string;
  description: string;
  watchlistReason: string;
  investmentQuestion: string;
  monitoringReason: string;
  valuationQuestion: string;
  segments: string[];
  revenueDrivers: string[];
  valuationMethods?: string[];
  valuationFocus?: string[];
  specialSection?: CompanyResearchCoverage["specialSection"];
};

const historicalPeriods = [
  "Historical Year 1",
  "Historical Year 2",
  "Historical Year 3",
  "Historical Year 4",
  "Historical Year 5",
];

function pendingHistorical(period: string): HistoricalFinancialRecord {
  return {
    period,
    revenue: null,
    revenueGrowth: null,
    grossProfit: null,
    grossMargin: null,
    operatingIncome: null,
    operatingMargin: null,
    ebitda: null,
    ebitdaMargin: null,
    netIncome: null,
    dilutedEps: null,
    operatingCashFlow: null,
    capitalExpenditures: null,
    freeCashFlow: null,
    cash: null,
    debt: null,
    dilutedShares: null,
    sourceUrl: null,
  };
}

function pendingSegment(name: string): SegmentRecord {
  return {
    name,
    revenue: null,
    revenueGrowth: null,
    operatingIncome: null,
    operatingMargin: null,
    shareOfRevenue: null,
    driver: DATA_PENDING,
    sourceUrl: null,
  };
}

function diligenceCards(labels: string[]): ResearchSection[] {
  return labels.map((title) => ({
    title,
    detail: `${RESEARCH_IN_PROGRESS}. Evidence and source citations have not yet been entered.`,
  }));
}

function createCoverage(seed: CoverageSeed): CompanyResearchCoverage {
  const ticker = seed.ticker.toUpperCase();
  const kind = seed.kind ?? "operating-company";
  const isEtf = kind === "etf";
  const defaultValuation = [
    "Discounted cash flow",
    "Comparable-company analysis",
    "Historical trading range",
    "Scenario analysis",
    "Weighted valuation conclusion",
  ];

  return {
    ticker,
    slug: ticker.toLowerCase(),
    companyName: seed.companyName,
    kind,
    exchange: "Exchange pending verification",
    sector: seed.sector,
    industry: seed.industry,
    description: seed.description,
    watchlistReason: seed.watchlistReason,
    coreInvestmentQuestion: seed.investmentQuestion,
    primaryMonitoringReason: seed.monitoringReason,
    thesisSummary:
      "The thesis is under review. A conclusion will not be published until primary-source evidence, valuation assumptions, and risks have been documented.",
    keyValuationQuestion: seed.valuationQuestion,
    bullCase:
      "Illustrative Scenario - assumptions and supporting evidence are pending.",
    baseCase:
      "Illustrative Scenario - assumptions and supporting evidence are pending.",
    bearCase:
      "Illustrative Scenario - assumptions and supporting evidence are pending.",
    marketMayBeMissing:
      "Research in progress. No differentiated conclusion has been published.",
    thesisRequirements:
      "Required evidence will be defined after current filings and investor materials are reviewed.",
    thesisInvalidation:
      "Invalidation criteria are pending completion of the initial research record.",
    businessOverview: diligenceCards(
      isEtf
        ? [
            "Fund objective",
            "Index methodology",
            "Expense ratio and inception",
            "Holdings and concentration",
            "Sector and geographic exposure",
            "AI, power, and data-center exposure",
            "Risk analysis",
            "Appropriate investor profile",
          ]
        : [
            "Business model",
            "Revenue sources",
            "Customer base",
            "Geographic exposure",
            "Recurring versus transactional revenue",
            "Competitive advantages",
            "Capital intensity and cyclicality",
            "Industry structure",
          ],
    ),
    revenueDrivers: seed.revenueDrivers,
    segments: seed.segments.map(pendingSegment),
    historicalFinancials: historicalPeriods.map(pendingHistorical),
    forecasts: [
      "Current Year Estimate",
      "Forecast Year 1",
      "Forecast Year 2",
      "Forecast Year 3",
      "Forecast Year 4",
      "Forecast Year 5",
    ].map((period, index) => ({
      period,
      periodType: index === 0 ? "Estimate" : "Forecast",
      revenue: null,
      revenueGrowth: null,
      grossMargin: null,
      operatingMargin: null,
      ebitdaMargin: null,
      taxRate: null,
      eps: null,
      capitalExpenditures: null,
      freeCashFlow: null,
      shareCount: null,
      netDebt: null,
    })),
    valuationMethods:
      seed.valuationMethods ??
      (isEtf
        ? [
            "Weighted underlying valuation",
            "Historical premium or discount",
            "Growth-adjusted multiple comparison",
            "Concentration analysis",
            "Scenario-based return expectations",
          ]
        : defaultValuation),
    valuationFocus:
      seed.valuationFocus ??
      (isEtf
        ? [
            "Weighted portfolio P/E",
            "Weighted portfolio EV/EBITDA",
            "Weighted revenue growth",
            "Weighted earnings growth",
            "Performance versus benchmark",
          ]
        : [
            "Revenue forecast",
            "EBIT and tax rate",
            "NOPAT",
            "D&A, capital expenditures, and working capital",
            "Unlevered free cash flow",
            "WACC and terminal growth",
            "Enterprise-to-equity value bridge",
            "Diluted shares and implied value per share",
          ]),
    comparableCompanies: [],
    catalysts: diligenceCards([
      "Earnings",
      "Product cycle",
      "Industry demand",
      "Margin expansion",
      "Capital allocation",
      "Regulatory or macro catalyst",
      "Strategic partnerships",
      "M&A",
      "Customer adoption",
    ]),
    risks: diligenceCards([
      "Valuation risk",
      "Execution risk",
      "Cyclical risk",
      "Customer concentration",
      "Competitive risk",
      "Regulatory risk",
      "Balance-sheet risk",
      "Technology risk",
      "Macro risk",
      "Thesis-specific risk",
    ]),
    earningsHistory: [],
    researchNotes: [],
    sources: [],
    lastUpdated: "Date to be confirmed",
    researchStatus: "Initial Research",
    thesisStatus: "Under Review",
    valuationStatus: "Model in Progress",
    report: {
      status: "in-progress",
      url: null,
      fileName: `${ticker}-Luna1-Research-Report.pdf`,
      fileFormat: "PDF",
      fileSize: null,
      version: "Draft - not published",
    },
    model: {
      status: "in-progress",
      url: null,
      fileName: `${ticker}-Luna1-Valuation-Model.xlsx`,
      fileFormat: "XLSX",
      fileSize: null,
      version: "Draft - not published",
    },
    latestFiling: { label: "View Latest Filing", href: null },
    investorRelations: { label: "View Investor Relations", href: null },
    specialSection: seed.specialSection,
  };
}

const coverageSeeds: CoverageSeed[] = [
  {
    ticker: "GLW",
    companyName: "Corning Incorporated",
    sector: "Information Technology",
    industry: "Electronic Components and Materials Science",
    description:
      "Corning develops specialty glass, ceramics, and optical-communications products across communications, display, mobile, automotive, and life-science markets.",
    watchlistReason:
      "The company is being studied for its exposure to optical-connectivity demand and the physical infrastructure required by data-center networks.",
    investmentQuestion:
      "Can optical demand and segment execution produce durable margin and free-cash-flow improvement?",
    monitoringReason:
      "Monitor optical communications, utilization, pricing, segment margins, and capital intensity.",
    valuationQuestion:
      "What normalized earnings and cash-flow profile is supported across Corning's different cycles?",
    segments: [
      "Optical Communications",
      "Display Technologies",
      "Specialty Materials",
      "Environmental Technologies",
      "Life Sciences",
      "Hemlock and Emerging Growth Businesses",
    ],
    revenueDrivers: [
      "Segment growth",
      "Segment margins",
      "Data-center and fiber demand exposure",
      "Utilization and pricing",
    ],
  },
  {
    ticker: "AIPO",
    companyName: "Defiance AI & Power Infrastructure ETF",
    kind: "etf",
    sector: "Multi-sector",
    industry: "Thematic Exchange-Traded Fund",
    description:
      "A thematic exchange-traded fund intended to provide exposure to companies participating in artificial-intelligence and power-infrastructure investment.",
    watchlistReason:
      "The fund is being evaluated as a diversified way to study AI-compute, power, grid, and infrastructure exposure without relying on one issuer.",
    investmentQuestion:
      "Does the fund's underlying portfolio provide differentiated exposure after fees, concentration, and valuation are considered?",
    monitoringReason:
      "Monitor index methodology, holdings, concentration, expenses, underlying valuation, and benchmark-relative behavior.",
    valuationQuestion:
      "What valuation and growth profile is embedded in the weighted underlying holdings?",
    segments: [
      "AI Hardware",
      "Power Infrastructure",
      "Data Centers",
      "Utilities",
      "Grid and Electrical Equipment",
      "Other Holdings",
    ],
    revenueDrivers: [
      "Underlying holding weights",
      "Sector and industry exposure",
      "Geographic exposure",
      "Concentration risk",
      "Benchmark-relative performance",
    ],
  },
  {
    ticker: "JBL",
    companyName: "Jabil Inc.",
    sector: "Information Technology",
    industry: "Electronic Manufacturing Services",
    description:
      "Jabil provides manufacturing, engineering, supply-chain, and systems-integration services across diversified end markets.",
    watchlistReason:
      "The research focuses on infrastructure-related demand, mix, margins, customer concentration, and cash conversion.",
    investmentQuestion:
      "Can higher-value infrastructure programs improve the durability of margins and free cash flow?",
    monitoringReason:
      "Monitor segment mix, customer concentration, operating margins, and free-cash-flow conversion.",
    valuationQuestion:
      "What multiple is appropriate for the normalized margin and cash-conversion profile?",
    segments: [
      "Intelligent Infrastructure",
      "Connected Living and Digital Commerce",
      "Regulated Industries",
    ],
    revenueDrivers: [
      "Revenue by segment",
      "Customer concentration",
      "Operating margins",
      "Free-cash-flow conversion",
    ],
  },
  {
    ticker: "ALAB",
    companyName: "Astera Labs, Inc.",
    sector: "Information Technology",
    industry: "Semiconductors",
    description:
      "Astera Labs develops connectivity products intended to address data movement and memory-connectivity requirements in cloud and AI infrastructure.",
    watchlistReason:
      "The company is being studied as a potential beneficiary of connectivity bottlenecks inside increasingly complex AI systems.",
    investmentQuestion:
      "Can product breadth and hyperscaler adoption support durable growth without excessive concentration risk?",
    monitoringReason:
      "Monitor unit growth, average selling prices, customer concentration, and gross-margin progression.",
    valuationQuestion:
      "What growth duration and margin structure are required to support the current business expectations?",
    segments: [
      "Connectivity Products",
      "Memory Connectivity",
      "PCIe and CXL Products",
    ],
    revenueDrivers: [
      "Hyperscaler demand",
      "Customer concentration",
      "Unit growth",
      "Average selling price",
      "Gross-margin progression",
    ],
  },
  {
    ticker: "RY",
    companyName: "Royal Bank of Canada",
    kind: "bank",
    sector: "Financials",
    industry: "Diversified Banks",
    description:
      "Royal Bank of Canada provides personal and commercial banking, wealth management, insurance, and capital-markets services.",
    watchlistReason:
      "The bank is being studied for franchise durability, fee diversification, capital discipline, and through-cycle credit performance.",
    investmentQuestion:
      "Can diversified fee businesses and scale support attractive returns while credit and capital remain well controlled?",
    monitoringReason:
      "Monitor loan and deposit growth, net interest margin, provisions, capital ratios, and segment returns.",
    valuationQuestion:
      "What price-to-book and residual-income valuation is justified by sustainable ROE and capital generation?",
    segments: [
      "Canadian Personal and Commercial Banking",
      "Wealth Management",
      "Capital Markets",
      "Insurance",
      "U.S. and International Banking",
    ],
    revenueDrivers: [
      "Loan and deposit growth",
      "Net interest margin",
      "Fee revenue",
      "Provision for credit losses",
    ],
    valuationMethods: [
      "Dividend discount model",
      "Residual income model",
      "Price-to-book",
      "Price-to-tangible-book",
      "Price-to-earnings",
    ],
    valuationFocus: [
      "Return on equity",
      "Common Equity Tier 1 ratio",
      "Loan and deposit growth",
      "Net interest margin",
      "Credit-loss provisions",
      "Capital-markets earnings",
      "Wealth-management earnings",
    ],
  },
  {
    ticker: "PANW",
    companyName: "Palo Alto Networks, Inc.",
    sector: "Information Technology",
    industry: "Cybersecurity Software",
    description:
      "Palo Alto Networks develops network, cloud, security-operations, and related cybersecurity products and services.",
    watchlistReason:
      "The company is being studied for recurring security demand and the economics of consolidating customers onto broader platforms.",
    investmentQuestion:
      "Can platform adoption translate into durable recurring growth, cash generation, and customer retention?",
    monitoringReason:
      "Monitor recurring revenue, remaining obligations, customer growth, margins, and stock-based compensation.",
    valuationQuestion:
      "What growth and free-cash-flow duration are required to support the valuation?",
    segments: [
      "Next-Generation Security",
      "Subscription and Support",
      "Platformization",
    ],
    revenueDrivers: [
      "Remaining performance obligations",
      "Annual recurring revenue",
      "Customer growth",
      "Operating margin",
      "Stock-based compensation",
    ],
  },
  {
    ticker: "PDFS",
    companyName: "PDF Solutions, Inc.",
    sector: "Information Technology",
    industry: "Semiconductor Software and Analytics",
    description:
      "PDF Solutions provides analytics, software, and services used to improve semiconductor manufacturing performance and yield.",
    watchlistReason:
      "The company is being studied for its role in semiconductor manufacturing analytics and the potential mix shift toward recurring software revenue.",
    investmentQuestion:
      "Can recurring analytics revenue scale while customer concentration and contract timing remain manageable?",
    monitoringReason:
      "Monitor recurring software mix, semiconductor demand, customer concentration, and gross-margin development.",
    valuationQuestion:
      "How should recurring software economics be separated from services and project-based revenue?",
    segments: [
      "Analytics",
      "Integrated Yield Ramp",
      "Characterization Services",
    ],
    revenueDrivers: [
      "Recurring software revenue",
      "Semiconductor end-market demand",
      "Customer concentration",
      "Gross-margin development",
    ],
  },
  {
    ticker: "ANET",
    companyName: "Arista Networks, Inc.",
    sector: "Information Technology",
    industry: "Communications Equipment",
    description:
      "Arista Networks develops cloud-networking products and software for data-center, campus, routing, and AI-networking environments.",
    watchlistReason:
      "The company is being studied for Ethernet-based AI networking demand, execution quality, and customer concentration.",
    investmentQuestion:
      "Can AI and enterprise networking growth remain durable as customer and competitive risks evolve?",
    monitoringReason:
      "Monitor cloud-titan demand, enterprise adoption, product mix, and product and service margins.",
    valuationQuestion:
      "What growth duration and normalized margin justify the embedded expectations?",
    segments: [
      "Data-Center Switching",
      "Routing",
      "Campus Products",
      "Services",
    ],
    revenueDrivers: [
      "Cloud titan customers",
      "Enterprise customers",
      "AI networking demand",
      "Product and service margins",
    ],
  },
  {
    ticker: "WWD",
    companyName: "Woodward, Inc.",
    sector: "Industrials",
    industry: "Aerospace and Industrial Controls",
    description:
      "Woodward designs and manufactures control systems and components for aerospace and industrial applications.",
    watchlistReason:
      "The company is being studied for commercial aerospace, defense, industrial, and aftermarket exposure.",
    investmentQuestion:
      "Can backlog and aftermarket demand support durable organic growth and margin improvement?",
    monitoringReason:
      "Monitor backlog conversion, organic growth, segment margins, and aftermarket mix.",
    valuationQuestion:
      "What normalized aerospace and industrial earnings profile should anchor valuation?",
    segments: ["Aerospace", "Industrial"],
    revenueDrivers: [
      "Defense exposure",
      "Commercial aerospace exposure",
      "Backlog",
      "Organic growth",
      "Segment margins",
      "Aftermarket revenue",
    ],
  },
  {
    ticker: "AMAT",
    companyName: "Applied Materials, Inc.",
    sector: "Information Technology",
    industry: "Semiconductor Equipment",
    description:
      "Applied Materials supplies manufacturing equipment, services, and related technology to semiconductor and display producers.",
    watchlistReason:
      "The company is being studied for broad exposure to semiconductor capital intensity, advanced logic, memory, and packaging.",
    investmentQuestion:
      "Can process complexity and service revenue support durable returns through equipment cycles?",
    monitoringReason:
      "Monitor wafer-fabrication spending, end-market mix, China exposure, installed base, and services.",
    valuationQuestion:
      "What normalized cycle assumptions and service mix should anchor cash-flow valuation?",
    segments: [
      "Semiconductor Systems",
      "Applied Global Services",
      "Display and Adjacent Markets",
    ],
    revenueDrivers: [
      "Wafer-fabrication-equipment demand",
      "Foundry and logic exposure",
      "Memory exposure",
      "China exposure",
      "Service revenue and installed base",
    ],
  },
  {
    ticker: "GS",
    companyName: "The Goldman Sachs Group, Inc.",
    kind: "investment-bank",
    sector: "Financials",
    industry: "Capital Markets",
    description:
      "Goldman Sachs provides investment banking, markets, asset management, wealth management, and related financial services.",
    watchlistReason:
      "The firm is being studied for capital-markets operating leverage, franchise returns, capital generation, and asset-management economics.",
    investmentQuestion:
      "Can the franchise produce attractive through-cycle returns while managing regulatory capital and earnings volatility?",
    monitoringReason:
      "Monitor banking backlog, trading, assets under supervision, compensation, ROE, and capital return.",
    valuationQuestion:
      "What price-to-book and residual-income valuation is justified by sustainable return on tangible equity?",
    segments: [
      "Global Banking and Markets",
      "Asset and Wealth Management",
      "Platform Solutions",
    ],
    revenueDrivers: [
      "Investment-banking fees",
      "Trading revenue",
      "Assets under supervision",
      "Net interest income",
      "Compensation ratio",
      "Return on equity",
      "Book value per share",
    ],
    valuationMethods: [
      "Price-to-book",
      "Price-to-tangible-book",
      "Price-to-earnings",
      "Residual income",
    ],
    valuationFocus: [
      "Return on equity",
      "Return on tangible equity",
      "Assets under supervision",
      "Investment-banking backlog",
      "Trading revenue",
      "Compensation ratio",
      "Capital return",
      "Stress-test and regulatory capital considerations",
    ],
  },
  {
    ticker: "DLR",
    companyName: "Digital Realty Trust, Inc.",
    kind: "reit",
    sector: "Real Estate",
    industry: "Data Center REIT",
    description:
      "Digital Realty owns, operates, and develops data-center properties supporting cloud, network, enterprise, and digital-infrastructure customers.",
    watchlistReason:
      "The company connects public-market REIT analysis with direct professional exposure to mission-critical data-center operations.",
    investmentQuestion:
      "Can leasing, development, and interconnection demand create attractive per-share growth after capital and financing needs?",
    monitoringReason:
      "Monitor occupancy, leasing, development yields, AFFO, leverage, debt maturities, and capital intensity.",
    valuationQuestion:
      "What Price/AFFO and NAV framework is supported by property growth, leverage, and financing conditions?",
    segments: [
      "Rental Revenue",
      "Interconnection",
      "Development Pipeline",
      "Geographic Portfolio",
    ],
    revenueDrivers: [
      "Same-capital cash NOI growth",
      "Occupancy and leasing volume",
      "Development capacity and stabilized yield",
      "Hyperscale and AI infrastructure demand",
      "Capital expenditures",
      "AFFO per share",
      "Net debt and leverage",
      "Same-store cash NOI",
      "Occupancy and leasing spreads",
      "New and renewal leasing",
      "Development starts and completions",
      "Stabilized development yield",
      "Core FFO and adjusted funds from operations",
      "Dividends and payout ratio",
      "Interest coverage",
      "Secured and unsecured debt",
      "Debt maturities, interest rate, and maturity profile",
    ],
    valuationMethods: [
      "Price/AFFO",
      "Price/FFO",
      "EV/EBITDA",
      "Net asset value",
      "Dividend discount model",
      "Historical multiple range",
      "Bull, base, and bear scenarios",
    ],
    valuationFocus: [
      "Same-store cash NOI",
      "Occupancy and leasing spreads",
      "Development starts, completions, and stabilized yield",
      "Core FFO and AFFO per share",
      "Dividend payout ratio",
      "Net debt to EBITDA and interest coverage",
      "Debt maturities, interest rate, and maturity profile",
    ],
    specialSection: {
      title: "Why I Follow Digital Realty",
      body: "My interest in Digital Realty is both analytical and personal. My professional experience in data-center operations in the Phoenix market took place at a facility associated with Digital Realty. Working inside that environment gave me firsthand exposure to the physical infrastructure behind cloud computing, artificial intelligence, network connectivity, cooling, power management, uptime, and mission-critical operations. That experience is what originally drew me to Digital Realty as an investment research subject. It allows me to evaluate the company not only through its financial statements, but also through an operating perspective shaped by direct exposure to the data-center environment.",
    },
  },
  {
    ticker: "STRL",
    companyName: "Sterling Infrastructure, Inc.",
    sector: "Industrials",
    industry: "Infrastructure Construction",
    description:
      "Sterling Infrastructure provides infrastructure, transportation, and site-development services across selected U.S. markets.",
    watchlistReason:
      "This existing Watchlist record is preserved while research coverage is expanded around data-center and essential-infrastructure demand.",
    investmentQuestion:
      "Can backlog quality and execution support durable margins and cash generation across the construction cycle?",
    monitoringReason:
      "Monitor backlog conversion, project execution, customer concentration, labor availability, and cash conversion.",
    valuationQuestion:
      "What normalized margin and cash-flow profile is sustainable across infrastructure cycles?",
    segments: ["E-Infrastructure", "Transportation", "Building Solutions"],
    revenueDrivers: [
      "Backlog conversion",
      "Data-center and advanced-manufacturing demand",
      "Project execution",
      "Segment margins",
      "Cash conversion",
    ],
  },
];

export const researchCompanies = coverageSeeds.map(createCoverage);

export function getResearchCompany(ticker: string) {
  return researchCompanies.find(
    (company) => company.slug === ticker.toLowerCase(),
  );
}

export const requestedResearchTickers = [
  "GLW",
  "AIPO",
  "JBL",
  "ALAB",
  "RY",
  "PANW",
  "PDFS",
  "ANET",
  "WWD",
  "AMAT",
  "GS",
  "DLR",
] as const;
