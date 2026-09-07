export type WatchlistItem = {
  ticker: string;
  company: string;
  researchHref?: string;
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
    researchStatus: "Watchlist",
    setupStatus: "Monitoring",
    note: "Astera Labs offers focused exposure to connectivity bottlenecks within increasingly complex rack-scale AI systems.",
    catalyst:
      "Broader adoption of its connectivity platform across next-generation AI infrastructure.",
    risk: "Premium valuation, customer concentration, semiconductor cycles, and competitive product risk.",
  },
  {
    ticker: "RY",
    company: "Royal Bank of Canada",
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
    researchStatus: "Initial Research",
    setupStatus: "Monitoring",
    note: "Digital Realty is being studied through both a REIT valuation framework and an operating perspective shaped by exposure to mission-critical data-center environments.",
    catalyst:
      "Leasing, development, interconnection, and demand for cloud and AI infrastructure.",
    risk: "Capital intensity, financing conditions, leverage, development execution, and customer concentration.",
  },
  {
    ticker: "BE",
    company: "Bloom Energy Corporation",
    researchHref: "/research/companies/be",
    researchStatus: "Active Research",
    setupStatus: "Monitoring",
    note: "Bloom Energy is being studied as an onsite-power provider for data centers and other facilities facing grid and interconnection constraints.",
    catalyst: "Evidence that deployments, manufacturing scale, and service economics convert demand into durable margins and cash flow.",
    risk: "Customer concentration, project timing, contract economics, working-capital requirements, and technology execution.",
  },
  {
    ticker: "VRT",
    company: "Vertiv Holdings Co.",
    researchHref: "/research/companies/vrt",
    researchStatus: "Initial Research",
    setupStatus: "Monitoring",
    note: "Vertiv is being studied for its exposure to power management, thermal management, and service requirements inside data-center infrastructure.",
    catalyst: "Sustained data-center capacity additions and increasing rack power density that require electrical and thermal infrastructure.",
    risk: "Customer capital-spending cycles, supply constraints, competition, execution, and expectations embedded in valuation.",
  },
];
