export type PositionStatus = "Active Position" | "Monitoring";

export type ActivePosition = {
  ticker: string;
  company: string;
  sector: string;
  industry: string;
  positionType: string;
  thesis: string;
  keyFundamentals: string[];
  competitiveAdvantage: string;
  growthDrivers: string[];
  watching: string[];
  thesisInvalidation: string;
  status: PositionStatus;
  whatChanged: string;
  researchHref?: string;
  previewMetrics?: Array<{ label: string; value: string }>;
};

export const activePositions: ActivePosition[] = [
  {
    ticker: "CASY",
    company: "Casey's General Stores Inc.",
    sector: "Consumer Staples",
    industry: "Convenience retail",
    positionType: "Retail compounder",
    thesis:
      "Casey’s is a high-quality retail compounder built around convenience stores, fuel, prepared food, and an efficient distribution network. The thesis depends on profitable store growth, prepared-food expansion, disciplined integration, and improving returns on invested capital.",
    keyFundamentals: [
      "Store expansion and acquisition integration",
      "Prepared-food sales and margin progression",
      "EBITDA growth and returns on invested capital",
    ],
    competitiveAdvantage:
      "A dense distribution network, purchasing scale, prepared-food capabilities, and loyalty infrastructure can improve the economics of acquired stores.",
    growthDrivers: ["New stores", "Acquisitions", "Prepared food", "Loyalty engagement"],
    watching: ["Store-level profitability", "Food margins", "Integration execution"],
    thesisInvalidation:
      "The thesis would weaken if profitable store growth, prepared-food expansion, EBITDA, or returns on invested capital materially deteriorate.",
    status: "Monitoring",
    whatChanged:
      "No thesis-breaking change is documented. Store growth, prepared-food performance, EBITDA, and returns on invested capital remain the monitoring priorities.",
  },
  {
    ticker: "ANET",
    company: "Arista Networks Inc.",
    sector: "Technology",
    industry: "Cloud and AI networking",
    positionType: "Network-infrastructure compounder",
    thesis:
      "Arista Networks is a leading AI and cloud-networking business combining strong growth, profitability, and institutional-quality execution. The thesis depends on sustained Ethernet adoption, disciplined product execution, and durable demand from cloud and AI infrastructure customers.",
    keyFundamentals: [
      "AI and cloud-networking demand",
      "Revenue growth and operating profitability",
      "Customer and product diversification",
    ],
    competitiveAdvantage:
      "Arista's software-led networking architecture, operating-system consistency, and position with large cloud customers support product performance and customer retention.",
    growthDrivers: [
      "Ethernet-based AI networks",
      "Cloud capital spending",
      "Campus networking",
      "Product adoption",
    ],
    watching: [
      "Customer concentration",
      "Competitive wins and losses",
      "Growth durability",
      "Valuation discipline",
    ],
    thesisInvalidation:
      "The thesis would weaken if AI and cloud-networking demand materially slows, competitive losses impair growth, or execution no longer supports the company's profitability and product position.",
    status: "Monitoring",
    whatChanged:
      "ANET moved from the Watchlist into Active Positions. The thesis remains centered on Ethernet-based AI and cloud-networking demand, execution quality, and product adoption; customer concentration, competition, valuation, and growth durability remain under review.",
  },
  {
    ticker: "WELL",
    company: "Welltower Inc.",
    sector: "Real Estate",
    industry: "Healthcare REIT",
    positionType: "Real-asset compounder",
    thesis:
      "Welltower is a healthcare real estate compounder benefiting from rising senior-housing demand, limited new supply, and improving property-level economics. The thesis depends on occupancy gains, same-store NOI growth, normalized FFO growth, and attractive returns from new investment.",
    keyFundamentals: [
      "Senior-housing occupancy",
      "Same-store net operating income",
      "Normalized FFO and investment returns",
    ],
    competitiveAdvantage:
      "Scale, operator relationships, data, and access to capital support sourcing and operating improvements across senior-housing assets.",
    growthDrivers: ["Occupancy recovery", "Limited supply", "Operating leverage", "New investment"],
    watching: ["Occupancy", "Same-store NOI", "Normalized FFO"],
    thesisInvalidation:
      "The thesis would weaken if occupancy, normalized FFO, same-store NOI, or returns from new investment activity materially deteriorate.",
    status: "Monitoring",
    whatChanged:
      "No thesis-breaking change is documented. Occupancy, normalized FFO, same-store NOI, and returns on new investment activity remain the monitoring priorities.",
  },
  {
    ticker: "KRYS",
    company: "Krystal Biotech, Inc.",
    sector: "Healthcare",
    industry: "Biotechnology / Gene Therapy",
    positionType: "Growth Compounder / Commercial-Stage Biotechnology",
    thesis:
      "Krystal Biotech is transitioning from a development-stage biotechnology company into a profitable commercial genetic-medicine platform led by VYJUVEK. The core thesis is that VYJUVEK cash generation can fund additional programs and, if the HSV-1 platform produces further approvals, support an evolution from a single-product company into a multi-product platform.",
    keyFundamentals: [
      "Approximately 95% reported Q2 2026 gross margin",
      "Approximately 49% calculated Q2 2026 operating margin",
      "$119.2M Q2 2026 VYJUVEK net product revenue",
    ],
    competitiveAdvantage:
      "A proprietary redosable HSV-1 platform, regulatory validation, in-house commercial-scale manufacturing, and rare-disease economics provide the foundation for platform expansion.",
    growthDrivers: [
      "VYJUVEK adoption",
      "International expansion",
      "Pipeline clinical progress",
      "Potential additional approvals",
    ],
    watching: [
      "VYJUVEK revenue growth",
      "Gross and operating margins",
      "Pipeline evidence",
      "Internal R&D funding",
    ],
    thesisInvalidation:
      "The investment thesis would materially weaken if VYJUVEK growth deteriorates significantly, gross margins compress structurally, safety or regulatory problems emerge, competition materially reduces the product's commercial opportunity, or the broader pipeline repeatedly fails to demonstrate that the HSV-1 platform can produce additional commercially viable therapies.",
    status: "Active Position",
    whatChanged:
      "Q2 2026 results reinforced the commercial engine: VYJUVEK net product revenue reached $119.2 million, increased 24% year over year, and carried a company-reported 95% gross margin.",
    researchHref: "/portfolio/positions/krys",
    previewMetrics: [
      { label: "Gross margin", value: "~95%" },
      { label: "Operating margin", value: "~49%" },
      { label: "ROIC", value: "~20%" },
      { label: "VYJUVEK Q2 revenue", value: "$119.2M" },
    ],
  },
];

export const krysSources = {
  fy2025Release: {
    id: "fy2025-release",
    title: "Fourth Quarter and Full Year 2025 Financial and Operating Results",
    publisher: "Krystal Biotech, Inc.",
    date: "February 17, 2026",
    period: "Fiscal year ended December 31, 2025",
    url: "https://ir.krystalbio.com/node/11136/pdf",
  },
  q2Release: {
    id: "q2-release",
    title: "Second Quarter 2026 Financial and Operating Results",
    publisher: "Krystal Biotech, Inc.",
    date: "August 3, 2026",
    period: "Quarter ended June 30, 2026",
    url: "https://ir.krystalbio.com/news-releases/news-release-details/krystal-biotech-announces-second-quarter-2026-financial-and",
  },
  q2Filing: {
    id: "q2-filing",
    title: "Quarterly Report on Form 10-Q",
    publisher: "Krystal Biotech, Inc. / U.S. SEC",
    date: "August 3, 2026",
    period: "Quarter ended June 30, 2026",
    url: "https://www.sec.gov/Archives/edgar/data/1711279/000171127926000057/krys-20260630.htm",
  },
  q1Release: {
    id: "q1-release",
    title: "First Quarter 2026 Financial and Operating Results",
    publisher: "Krystal Biotech, Inc.",
    date: "May 4, 2026",
    period: "Quarter ended March 31, 2026",
    url: "https://ir.krystalbio.com/node/11306",
  },
  q1Filing: {
    id: "q1-filing",
    title: "Quarterly Report on Form 10-Q",
    publisher: "Krystal Biotech, Inc. / U.S. SEC",
    date: "May 4, 2026",
    period: "Quarter ended March 31, 2026",
    url: "https://www.sec.gov/Archives/edgar/data/1711279/000171127926000043/krys-20260331.htm",
  },
} as const;

export const krysMetrics = [
  {
    label: "Gross Margin",
    value: "~95%",
    numericValue: 95,
    type: "Reported",
    sourceId: "q2-release",
    note: "Company-reported VYJUVEK gross margin for Q2 2026.",
  },
  {
    label: "Operating Margin",
    value: "~49%",
    numericValue: 49,
    type: "Calculated",
    sourceId: "q2-filing",
    note: "Luna1 calculation: product revenue less cost of goods sold, R&D, and SG&A, divided by product revenue.",
  },
  {
    label: "EBITDA Margin",
    value: "~50%",
    numericValue: 50,
    type: "Calculated",
    sourceId: "q2-filing",
    note: "Approximate manually entered research ratio derived from the Q2 filing; not a company-reported metric.",
  },
  {
    label: "Net Margin",
    value: "~46%",
    numericValue: 46,
    type: "Calculated",
    sourceId: "q2-release",
    note: "Luna1 calculation using $54.8M net income and $119.2M product revenue for Q2 2026.",
  },
  {
    label: "Return on Invested Capital",
    value: "~20%",
    numericValue: 20,
    type: "Research observation",
    sourceId: "q2-filing",
    note: "Approximate manually entered trailing research ratio; methodology should be reproduced before investment use.",
  },
  {
    label: "Return on Equity",
    value: "~20%",
    numericValue: 20,
    type: "Research observation",
    sourceId: "q2-filing",
    note: "Approximate manually entered trailing research ratio; not company-reported or real-time data.",
  },
] as const;

export const krysMarginSeries = [
  {
    label: "Gross Margin",
    values: [90.25, 92.83, 92.45, 90.93, 94.21, 92.39, 93.26, 93.46],
    sourceId: "q2-filing",
    note: "Calculated quarterly series; latest company-reported VYJUVEK gross margin was approximately 95%.",
  },
  {
    label: "Operating Margin",
    values: [41.67, 45.4, 41.02, 40.93, 42.3, 41.33, 46.14, 49],
    sourceId: "q2-filing",
    note: "Calculated quarterly series based on reported financial statements.",
  },
  {
    label: "EBITDA Margin",
    values: [43.44, 47.14, 42.88, 42.53, 43.95, 42.98, 47.62, 50.31],
    sourceId: "q2-filing",
    note: "Approximate manually entered quarterly research series; not company-reported.",
  },
  {
    label: "ROIC",
    values: [6.33, 10.26, 13.78, 15.49, 19.52, 18.8, 19.77, 20],
    sourceId: "q2-filing",
    note: "Approximate manually entered trailing research series; methodology should be reproduced before use.",
  },
] as const;

export const krysMoat = [
  ["Proprietary Gene-Delivery Platform", "Engineered HSV-1 vectors are designed to deliver therapeutic genes directly to targeted tissues."],
  ["Redosable Gene Therapy", "VYJUVEK demonstrates repeat administration, differentiating the platform from many one-time gene therapies."],
  ["Regulatory Validation", "VYJUVEK approval in the United States, Europe, Japan, and the United Kingdom validates the first commercial application."],
  ["In-House Manufacturing", "Two commercial-scale CGMP facilities provide control over production, quality, capacity, and unit economics."],
  ["Rare-Disease Economics", "A serious rare genetic disease with limited alternatives supports attractive product economics, subject to reimbursement risk."],
  ["Platform Optionality", "Programs across eye, lung, skin, and oncology indications test whether the platform can support multiple products."],
] as const;

export const krysFlywheel = [
  "VYJUVEK Adoption",
  "High-Margin Revenue",
  "Free Cash Flow / Cash Generation",
  "Internally Funded R&D",
  "Additional Clinical Programs",
  "Potential New Product Approvals",
  "Larger Revenue Base",
  "Additional Cash Generation",
  "Internally Funded Innovation",
] as const;

export const krysMonitoring = [
  ["VYJUVEK Revenue Growth", "Is product growth continuing as the revenue base becomes larger?"],
  ["U.S. Product Growth", "Does domestic demand remain healthy as international sales become more important?"],
  ["Gross Margin", "Can approximately 94%–95% gross margins remain sustainable?"],
  ["Operating Margin", "Does operating leverage continue while pipeline investment increases?"],
  ["Pipeline Progress", "Are additional HSV-1 programs progressing through clinical development?"],
  ["Cash Generation", "Can VYJUVEK increasingly finance R&D internally?"],
  ["Competition", "How are competing treatments and alternative gene-therapy technologies developing?"],
  ["Regulatory Risk", "What safety, manufacturing, clinical, or regulatory developments could alter the thesis?"],
] as const;
