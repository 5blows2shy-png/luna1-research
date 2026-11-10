export const bnyCaseStudy = {
  ticker: "BNY",
  companyName: "The Bank of New York Mellon Corporation",
  title: "Financial Infrastructure, Valuation & Optionality",
  subtitle:
    "A case study in identifying a financial toll booth with durable infrastructure economics and emerging digital-finance optionality.",
  updated: "2026-11-10",
  framing:
    "The existing business must justify the investment first. Optionality may improve the upside case, but should not rescue the base case.",
  whyLooked:
    "I was looking for businesses that function as financial infrastructure — companies that earn fees from activity flowing through the financial system rather than depending solely on directional market bets. BNY stood out because its custody, servicing, clearing, collateral, and payment infrastructure can be evaluated on its own economics, while digital assets and tokenization may provide an additional long-term growth path.",
  sources: [
    {
      label: "BNY Investor Relations",
      url: "https://www.bny.com/corporate/global/en/investor-relations/overview.html",
      note: "Primary source hub for filings, earnings releases, presentations, and capital-return disclosures.",
    },
    {
      label: "BNY SEC filings",
      url: "https://www.sec.gov/edgar/browse/?CIK=1390777&owner=exclude&action=getcompany",
      note: "Use the applicable filed annual and quarterly reports before adding reported financial figures.",
    },
  ],
  steps: [
    {
      number: "01",
      title: "Understand the business",
      question: "What does BNY actually get paid to do?",
      body: "The first lens is institutional activity: custody, asset servicing, clearing, collateral, payments, Pershing, fund administration, and investment services. The working premise is that these are financial-market infrastructure functions, so the analysis should begin with fee pools, client workflows, and service intensity rather than a conventional consumer-bank narrative.",
      checks: ["Fee mix and recurring characteristics", "Client workflow and activity dependence", "Assets under custody / administration and assets under management", "Net interest income as a separate, rate-sensitive contributor"],
    },
    {
      number: "02",
      title: "Identify the moat",
      question: "Why cannot customers easily replace BNY?",
      body: "The toll-booth question is whether scale, trust, regulatory infrastructure, operational complexity, global network reach, and embedded client workflows create meaningful switching costs. The test is not whether BNY is the only provider; it is whether institutional activity can be moved without material operational, control, and continuity cost.",
      checks: ["Institutional trust and control environment", "Operational and regulatory complexity", "Embedded workflows and switching friction", "Scale of the asset and transaction base serviced"],
    },
    {
      number: "03",
      title: "Test quality of economics",
      question: "Can the franchise compound without balance-sheet expansion doing all the work?",
      body: "The review separates fee revenue, recurring client activity, operating leverage, returns on tangible common equity, margins, earnings growth, and capital returns. No reported values are displayed until they are verified from a dated primary source.",
      checks: ["Fee-revenue growth", "Expense growth versus revenue growth", "ROE and ROTCE", "Dividend and repurchase discipline"],
    },
    {
      number: "04",
      title: "Apply valuation discipline",
      question: "What am I paying for the existing business before giving credit to optionality?",
      body: "The valuation work compares trailing and forward earnings context, historical and peer multiple context, earnings growth, returns on capital, and capital return. It is deliberately separate from any digital-finance narrative.",
      checks: ["Multiple versus business quality", "Earnings and capital-return durability", "Valuation-compression risk", "Peer comparison by business model, not ticker similarity"],
    },
    {
      number: "05",
      title: "Evaluate optionality",
      question: "Does emerging digital infrastructure add an upside leg?",
      body: "Digital-asset custody, tokenized deposits and securities, settlement, collateral, stablecoin infrastructure, and institutional digital assets are examined as possible future fee pools. Optionality should improve the upside case, not rescue the base case.",
      checks: ["Evidence of institutional adoption", "Incremental fee-pool relevance", "Operational and regulatory fit", "Whether optionality is already reflected in valuation"],
    },
  ],
  kpis: [
    "Assets under custody / administration",
    "Assets under management",
    "Fee-revenue growth",
    "Net interest income",
    "Operating margin and expense growth",
    "EPS growth",
    "ROE and ROTCE",
    "Capital returned to shareholders",
    "Share repurchases and dividend growth",
    "Institutional client activity",
    "Digital-asset and tokenization developments",
    "Valuation",
  ],
  invalidations: [
    "Fee compression or loss of institutional market share",
    "Weak asset-servicing growth or poor operating leverage",
    "Sustained decline in ROTCE or deteriorating capital returns",
    "Regulatory-capital pressure, cyber incident, or operational failure",
    "Structural margin compression",
    "Digital-infrastructure opportunity fails to materialize",
    "Valuation becomes excessive relative to the base business",
  ],
} as const;
