export const careerAreas = [
  "Global FP&A",
  "Treasury",
  "Strategic Finance",
  "Corporate Development",
  "Equity Research",
  "Infrastructure Finance",
  "Digital Infrastructure",
  "Capital Markets",
  "Finance Business Partner",
  "Global Rotational Programs",
];
export const professionalInterests = [
  {
    name: "United States",
    center: "Technical & operating foundation",
    description:
      "Build the technical and operational foundation within major multinational organizations.",
    x: 90,
    y: 122,
  },
  {
    name: "United Kingdom / London",
    center: "Capital markets & investment",
    description:
      "Capital markets, equity research, infrastructure finance, asset management, and multinational finance.",
    x: 250,
    y: 65,
  },
  {
    name: "Europe",
    center: "Cross-border corporate finance",
    description:
      "Cross-border corporate finance, industrials, technology, energy, and multinational operations.",
    x: 355,
    y: 105,
  },
  {
    name: "Middle East / Dubai & Abu Dhabi",
    center: "Infrastructure & capital projects",
    description:
      "Infrastructure investment, energy finance, sovereign capital, real estate, and large-scale capital projects.",
    x: 400,
    y: 200,
  },
  {
    name: "Singapore / Southeast Asia",
    center: "Asia-Pacific finance",
    description:
      "Asia-Pacific corporate finance, capital markets, technology, infrastructure, and regional investment.",
    x: 540,
    y: 250,
  },
];
export const globalBusinessFramework = [
  ["Revenue Geography", "Where does the company actually generate revenue?"],
  [
    "Currency Exposure",
    "How do FX movements affect revenue, margins, debt, and purchasing power?",
  ],
  [
    "Capital Allocation",
    "Where is management deploying capital internationally?",
  ],
  ["Regional Growth", "Which countries or business units are driving growth?"],
  [
    "Interest Rates",
    "How do different monetary environments affect financing and valuation?",
  ],
  [
    "Political & Regulatory Risk",
    "How can regulations, tariffs, taxes, or geopolitical events affect operations?",
  ],
  [
    "Supply Chain Exposure",
    "Where are suppliers, manufacturing capacity, logistics hubs, and critical dependencies?",
  ],
  [
    "Competitive Position",
    "Does the company maintain its moat across different geographic markets?",
  ],
  [
    "Infrastructure Requirements",
    "What power, technology, logistics, real estate, or data infrastructure supports growth?",
  ],
  [
    "Valuation",
    "How should international growth opportunities and risks affect valuation?",
  ],
];
export type CareerResearchCard = {
  company: string;
  headquarters: string | null;
  industry: string | null;
  geography: string | null;
  thesis: string | null;
  revenueGrowth: number | null;
  operatingMargin: number | null;
  roic: number | null;
  valuation: string | null;
  risk: string | null;
  report: string | null;
  source: string | null;
  asOf: string | null;
};
export const careerResearch: CareerResearchCard[] = [
  "Equinix",
  "Digital Realty",
  "Schneider Electric",
  "Eaton",
  "Vertiv",
  "ASML",
  "TSMC",
  "Novo Nordisk",
  "LVMH",
  "MercadoLibre",
].map((company) => ({
  company,
  headquarters: null,
  industry: null,
  geography: null,
  thesis: null,
  revenueGrowth: null,
  operatingMargin: null,
  roic: null,
  valuation: null,
  risk: null,
  report: null,
  source: null,
  asOf: null,
}));
export const competencies = [
  {
    category: "Financial Analysis",
    status: "Developing",
    skills: [
      "Financial statement analysis",
      "Financial modeling",
      "Valuation",
      "Forecasting",
      "Scenario analysis",
    ],
  },
  {
    category: "Corporate Finance",
    status: "Developing",
    skills: [
      "FP&A",
      "Budgeting",
      "Capital allocation",
      "Working capital",
      "Treasury concepts",
    ],
  },
  {
    category: "Markets",
    status: "Research Focus",
    skills: [
      "Equity research",
      "Macroeconomic analysis",
      "Interest rates",
      "FX",
      "Capital markets",
    ],
  },
  {
    category: "Technology",
    status: "Developing",
    skills: [
      "Excel",
      "Power BI",
      "Python",
      "Financial modeling tools",
      "Bloomberg",
    ],
  },
  {
    category: "Business Operations",
    status: "Professional Experience",
    skills: [
      "Mission-critical data center operations",
      "Infrastructure",
      "Logistics",
      "Inventory / accountability",
      "Accounting operations",
    ],
  },
];
export const developmentTimeline = [
  {
    year: "2026",
    status: "Building the foundation",
    items: [
      "Finance coursework",
      "Financial modeling",
      "Investment research",
      "Professional finance experience",
      "Global company research",
    ],
  },
  {
    year: "2027",
    status: "Planned · not completed",
    items: [
      "Finance degree completion",
      "Early-career finance / rotational opportunity",
      "CFA Level I pathway",
      "Expand international equity research",
    ],
  },
  {
    year: "2027–2029",
    status: "Career objectives",
    items: [
      "Develop corporate finance or investment expertise",
      "Pursue multinational assignments",
      "Target international rotations or internal transfers",
    ],
  },
  {
    year: "Long Term",
    status: "Aspirational direction",
    items: [
      "Build leadership experience across markets",
      "Global finance / investment leadership",
      "Regional or global financial responsibility",
    ],
  },
];
// Future adapters must provide source, date, units, and a verified availability status.
export const careerMarketWatch = [
  "Global equity indices",
  "U.S. 10-year yield",
  "European rates",
  "UK rates",
  "USD Index",
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "Oil",
  "Gold",
  "Regional market performance",
].map((name) => ({
  name,
  value: null,
  source: null,
  asOf: null,
  status: "Unavailable" as const,
}));
