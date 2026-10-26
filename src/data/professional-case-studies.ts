export type ProfessionalCaseStudy = {
  slug: string; number: string; category: string; title: string; summary: string;
  context: string; role: string; scope: string;
  challenge: string; approach: { title: string; detail: string }[];
  findings: { title: string; detail: string }[];
  outcome: string; limitations: string; competencies: string[];
  evidence: { title: string; href: string; description: string }[];
};

export const professionalCaseStudies: ProfessionalCaseStudy[] = [
  {
    slug: "financial-operations", number: "01", category: "Financial operations",
    title: "From reconciled records to management reporting",
    summary: "Connecting transaction accuracy, restricted-fund visibility and variance analysis in a nonprofit finance workflow.",
    context: "Nonprofit accounting and management reporting",
    role: "Executive & Finance Assistant · Coronado Historical Association",
    scope: "Professional responsibilities are drawn from the existing profile. Numerical findings come from an independent synthetic portfolio model, not employer results.",
    challenge: "Management needs reliable reporting and a clear view of spendable cash. A bank balance alone cannot explain budget performance or distinguish restricted resources from funds available for general operations. The analytical task is to connect reconciled records, supporting documentation and fund tracking to a decision-ready reporting pack.",
    approach: [
      { title: "Establish the accounting foundation", detail: "The professional role includes QuickBooks Online accrual accounting support, journal entries, deposits, bank and credit-card reconciliations, and supporting records. These responsibilities provide the context for a reporting workflow grounded in traceable transactions." },
      { title: "Build the management view", detail: "The independent work sample organizes a fictional 12-month dataset into budget, actual and forecast comparisons. Monthly, quarterly and YTD views use the same underlying schedules, keeping the reporting basis consistent across periods." },
      { title: "Reconcile cash and funds", detail: "Opening cash, collections and payments bridge to closing cash. Restricted and unrestricted schedules reconcile to that total, with restricted activity treated as a subset rather than an additional cash flow." },
    ],
    findings: [
      { title: "$53,700 below the planned surplus", detail: "In the synthetic full-year case, revenue is $19,200 above budget while expenses are $72,900 above budget. The $258,300 surplus therefore falls short of the $312,000 plan." },
      { title: "$355,500 of unrestricted closing cash", detail: "The model ends with $558,300 of total cash, including $202,800 restricted. Reporting only total cash would obscure the distinction between cash on hand and general-purpose availability." },
      { title: "Explain the variance before assigning a cause", detail: "January program expenses exceed budget by $14,500, or 12.1%. The dataset supports the amount and timing; it does not substantiate a staffing, vendor or event explanation." },
    ],
    outcome: "The completed deliverable is an interactive reporting dashboard, an editable Excel workbook and a three-page management case study. Together they demonstrate how to turn accounting schedules into a focused conversation about performance, cash availability and follow-up actions.",
    limitations: "The professional role uses accrual accounting; the public work sample deliberately uses simplified cash-basis synthetic data. It excludes receivables, payables and noncash items. No employer savings, close-time improvement or management adoption is claimed for this model.",
    competencies: ["Reconciliation", "Financial reporting", "Variance analysis", "Fund tracking", "Management communication"],
    evidence: [
      { title: "Interactive nonprofit FP&A dashboard", href: "/recruiter/projects/nonprofit-fpa-dashboard", description: "Completed synthetic work sample with period controls, cash bridges and methodology." },
      { title: "Excel reporting workbook", href: "/downloads/nonprofit-fpa-workbook.xlsx", description: "Editable inputs, formula-based monthly schedules and reconciliation checks." },
      { title: "Management case study · PDF", href: "/downloads/nonprofit-fpa-case-study.pdf", description: "Three-page report documenting the numerical findings and limitations." },
      { title: "Professional experience record", href: "/recruiter#experience", description: "Source for the stated role and accounting responsibilities; self-reported professional profile." },
    ],
  },
  {
    slug: "infrastructure-operations", number: "02", category: "Infrastructure operations",
    title: "Connecting operating discipline to infrastructure economics",
    summary: "Translating mission-critical operating experience into a structured assessment of capacity, power costs, funding and debt coverage.",
    context: "Data-center operations and independent project-finance analysis",
    role: "Data Center Operations Technician · LightEdge Solutions",
    scope: "An experience-based operating perspective paired with a hypothetical capital project. This is not a reconstruction of an employer incident or investment.",
    challenge: "Infrastructure decisions combine service reliability, physical capacity and long-lived capital commitments. A technically viable expansion still needs sufficient demand and cash generation to support its funding structure. The case connects those operating questions to an explicit financial model.",
    approach: [
      { title: "Start with operating controls", detail: "The existing professional profile records operational issue analysis, coordination in uptime-sensitive environments, change controls, incident documentation and audit-ready records. These establish the relevance of controlled execution and traceable decisions without disclosing facility architecture or customer information." },
      { title: "Translate physical drivers into financial assumptions", detail: "The independent model connects IT capacity and utilization to revenue, and IT load, PUE and electricity pricing to power expense. Development categories include electrical infrastructure, UPS, generators, cooling, racks and network infrastructure." },
      { title: "Separate project economics from repayment capacity", detail: "Sources and uses reconcile construction funding. Annual operating and debt schedules then calculate CFADS, DSCR, project returns and equity cash flows. Base, upside and downside scenarios expose different operating and financing outcomes." },
    ],
    findings: [
      { title: "$54.39 million of modeled total uses", detail: "The starting case combines $50 million of development CapEx with contingency, financing fees and construction interest. Modeled funding is $21 million of debt and $33.39 million of construction-period sponsor equity." },
      { title: "Early coverage constrains the case", detail: "Base-case minimum operating DSCR is approximately 0.87x, below the assumed 1.20x screening threshold. Operating funding shortfalls total approximately $539,403 before exit cash; balancing construction sources and uses does not eliminate later liquidity needs." },
      { title: "Operating success and investment value require separate tests", detail: "At the assumed 10% discount rate, base-case project NPV is approximately negative $12.18 million. Utilization, capacity pricing, power costs, construction timing and repayment terms each warrant explicit scrutiny." },
    ],
    outcome: "The completed public work sample includes an editable model, annual financing schedules, sensitivity analysis, an Excel workbook and an eight-page presentation. It demonstrates a bridge from operating knowledge to capital planning and lender-style cash-coverage questions.",
    limitations: "All project inputs are hypothetical. No employer uptime result, incident resolution, cost saving or capital approval is attributed to this model. Annual timing, simplified taxes and scheduled debt payments omit reserves, refinancing and a default waterfall. The coverage threshold is an assumption, not a lender covenant.",
    competencies: ["Operating controls", "Capacity and power economics", "Capital planning", "Risk assessment", "Project finance"],
    evidence: [
      { title: "Interactive infrastructure model", href: "/recruiter/projects/data-center-investment-model", description: "Editable operating assumptions, sources and uses, debt schedules and scenario analysis." },
      { title: "Project-finance Excel workbook", href: "/downloads/data-center-project-finance.xlsx", description: "Formula-based cash flows, returns and native sensitivity tables." },
      { title: "Infrastructure presentation · PDF", href: "/downloads/data-center-project-finance.pdf", description: "Eight-page starting-case presentation with risks and methodology." },
      { title: "Professional experience record", href: "/recruiter#experience", description: "Source for the stated operating responsibilities; self-reported professional profile." },
    ],
  },
  {
    slug: "investment-research", number: "03", category: "Investment research",
    title: "Business quality versus the price paid: Costco",
    summary: "A case study of thesis construction, competitive analysis and valuation discipline using an existing dated qualitative investment memo.",
    context: "COST qualitative equity research · memo dated July 28, 2026",
    role: "Shy Lee · Author of the existing Costco research memo",
    scope: "A completed presentation of the research process and its limitations. The underlying memo remains a dated draft; this page does not update its market data or recommendation.",
    challenge: "A strong business does not automatically offer an attractive investment at every price. The memo asks how Costco’s membership model, customer proposition and expansion opportunities should be weighed against valuation risk and the expectations already embedded in the share price.",
    approach: [
      { title: "Connect the business model to earnings quality", detail: "The draft examines membership fees, renewal behavior, merchandise pricing, inventory turnover and working-capital dynamics. Its central analytical lens is how recurring membership economics interact with the low-price retail proposition." },
      { title: "Organize the growth thesis", detail: "The memo groups its thesis around membership, international expansion, warehouse maturation and digital opportunities. It considers direct warehouse-club competitors alongside a broader retail comparison set rather than treating every retailer as an equivalent business." },
      { title: "Write the counterargument alongside the thesis", detail: "The risk discussion addresses valuation compression, slower member growth, cost inflation and concentration. The conclusion acknowledges the tension between business quality and a demanding purchase price instead of relying solely on favorable operating characteristics." },
    ],
    findings: [
      { title: "A thesis with observable drivers", detail: "The document identifies membership trends, comparable sales, new-warehouse performance and international economics as areas to monitor. These provide a structure for revisiting the thesis as evidence changes." },
      { title: "Valuation remains a distinct analytical task", detail: "The draft explicitly notes that its DCF needs work, including separating maintenance and growth CapEx. The linked document therefore supports qualitative research capability, not a claim of a completed valuation model." },
      { title: "Source verification is part of completion", detail: "The memo lists Costco’s FY2025 10-K, FY2026 earnings calls, monthly sales releases and late-July market data. This case study summarizes the memo; it does not independently verify each numerical claim or refresh those dated figures." },
    ],
    outcome: "The existing written memo demonstrates business analysis, thesis organization, catalyst identification and risk communication. This case makes that research process reviewable and identifies the remaining valuation and source-audit work without claiming investment performance or a fund decision.",
    limitations: "The linked July 28, 2026 draft contains a dated investment opinion and numerical estimates. It is preserved as historical portfolio evidence, not presented as current market guidance. No executed position, investment-committee approval, return attribution or completed DCF is established by the document. Educational research only; not personalized investment advice.",
    competencies: ["Business analysis", "Competitive assessment", "Thesis development", "Valuation discipline", "Risk communication"],
    evidence: [
      { title: "Costco qualitative investment memo · PDF", href: "/downloads/shy-lee-costco-qualitative-investment-memo.pdf", description: "Primary evidence for this case: existing authored draft dated July 28, 2026. Includes its own source list and stated valuation limitations." },
      { title: "Related Casey’s operating analysis · PDF", href: "/downloads/shy-lee-caseys-operations-supply-chain-analysis.pdf", description: "Separate company-analysis sample; supporting breadth, not a source for the Costco thesis." },
      { title: "Luna1 research library", href: "/research", description: "Explore the broader published research collection and each report’s own evidence and disclosures." },
    ],
  },
];

export function caseStudyHref(slug: string) { return `/recruiter/case-studies/${slug}`; }
