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
