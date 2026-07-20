export type WatchlistItem = {
  ticker: string;
  company: string;
  score: number | null;
  researchStatus: string;
  setupStatus: string;
  note: string;
  catalyst: string;
  risk: string;
};

export const watchlist: WatchlistItem[] = [
  {
    ticker: "AIPO",
    company: "Defiance AI & Power Infrastructure ETF",
    score: 82,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Diversified thematic exposure to the AI-compute, power, grid, nuclear, and infrastructure buildout without relying on a single operating company.",
    catalyst:
      "Continued data-center, power-generation, grid-modernization, and AI-infrastructure investment.",
    risk: "Thematic concentration, elevated underlying valuations, volatility, and fund expenses.",
  },
  {
    ticker: "GLW",
    company: "Corning Incorporated",
    score: 91,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Corning provides picks-and-shovels exposure to AI data-center fiber, optical connectivity, and advanced-material demand.",
    catalyst:
      "Accelerating hyperscaler demand for fiber, optical connectivity, and next-generation data-center networks.",
    risk: "Elevated expectations, cyclical end markets, and execution risk after strong price appreciation.",
  },
  {
    ticker: "STRL",
    company: "Sterling Infrastructure Inc.",
    score: 89,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Sterling Infrastructure is positioned around data centers, advanced manufacturing, transportation, and mission-critical construction demand.",
    catalyst:
      "Backlog conversion and sustained spending on data centers and essential infrastructure.",
    risk: "Project execution, labor availability, customer concentration, and construction-cycle volatility.",
  },
  {
    ticker: "ALAB",
    company: "Astera Labs Inc.",
    score: 88,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Astera Labs offers focused exposure to connectivity bottlenecks within increasingly complex rack-scale AI systems.",
    catalyst:
      "Broader adoption of its connectivity platform across next-generation AI infrastructure.",
    risk: "Premium valuation, customer concentration, semiconductor cycles, and competitive product risk.",
  },
  {
    ticker: "JBL",
    company: "Jabil Inc.",
    score: 87,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Jabil is an underappreciated AI-infrastructure manufacturing and systems-integration business with improving margins and cash generation.",
    catalyst:
      "Rising AI-related manufacturing demand, stronger margins, and continued guidance expansion.",
    risk: "Thin manufacturing margins, large-customer dependence, and supply-chain execution risk.",
  },
  {
    ticker: "RY",
    company: "Royal Bank of Canada",
    score: 84,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Royal Bank of Canada combines banking leadership with wealth management and capital-markets exposure as a steadier financial-sector compounder.",
    catalyst:
      "Earnings growth, integration benefits, wealth-management expansion, and capital returns.",
    risk: "Canadian credit deterioration, housing weakness, regulation, and capital-market cyclicality.",
  },
  {
    ticker: "PANW",
    company: "Palo Alto Networks Inc.",
    score: 86,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Palo Alto Networks remains a leading cybersecurity consolidator as customers shift toward broader platform-based security spending.",
    catalyst:
      "Platformization, recurring cybersecurity demand, and adoption of next-generation security products.",
    risk: "Premium valuation, intense competition, integration complexity, and slower billings growth.",
  },
  {
    ticker: "PDFS",
    company: "PDF Solutions Inc.",
    score: 85,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "PDF Solutions is a smaller semiconductor data-and-analytics platform leveraged to manufacturing complexity and yield optimization.",
    catalyst:
      "Wider adoption of AI-driven semiconductor manufacturing analytics and data products.",
    risk: "Smaller scale, customer concentration, dilution, and uneven contract timing.",
  },
  {
    ticker: "ANET",
    company: "Arista Networks Inc.",
    score: 95,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Arista Networks is a leading AI and cloud-networking business combining strong growth, profitability, and institutional-quality execution.",
    catalyst:
      "Accelerating Ethernet-based AI networking and adoption of next-generation high-speed products.",
    risk: "Hyperscaler concentration, competition, premium valuation, and growth deceleration.",
  },
  {
    ticker: "WWD",
    company: "Woodward Inc.",
    score: 83,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Woodward offers differentiated exposure to aerospace and industrial control systems supported by aftermarket and defense demand.",
    catalyst:
      "Commercial aerospace production, defense spending, and aftermarket growth.",
    risk: "Aerospace-cycle disruption, supplier constraints, program execution, and customer concentration.",
  },
  {
    ticker: "AMAT",
    company: "Applied Materials Inc.",
    score: 88,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Applied Materials is a broad semiconductor-equipment leader positioned for advanced logic, memory, packaging, and AI-driven wafer-fab spending.",
    catalyst:
      "Semiconductor capital-spending recovery and accelerating advanced-packaging demand.",
    risk: "China restrictions, cyclical equipment spending, customer concentration, and margin pressure.",
  },
  {
    ticker: "GS",
    company: "The Goldman Sachs Group Inc.",
    score: 84,
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Goldman Sachs provides exposure to investment banking, trading, asset management, and a potential recovery in global deal activity.",
    catalyst:
      "Stronger M&A, underwriting, trading, and capital-markets volumes.",
    risk: "Market volatility, regulation, credit exposure, and renewed weakness in transaction activity.",
  },
  {
    ticker: "DLR",
    company: "Digital Realty Trust Inc.",
    score: null,
    researchStatus: "Initial Research",
    setupStatus: "Monitoring",
    note: "Digital Realty is being studied through both a REIT valuation framework and an operating perspective shaped by exposure to mission-critical data-center environments.",
    catalyst:
      "Leasing, development, interconnection, and demand for cloud and AI infrastructure.",
    risk: "Capital intensity, financing conditions, leverage, development execution, and customer concentration.",
  },
];
