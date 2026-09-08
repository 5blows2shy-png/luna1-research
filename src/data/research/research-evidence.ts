import type {
  CompletenessRecord,
  EstimateRecord,
  ForecastAssumption,
  ForecastScenario,
  OperatingComponent,
  ResearchSource,
  ThesisMonitoring,
  ValuationFramework,
} from "./research-types";

export const RESEARCH_UPDATED_DATE = "Updated July 28, 2026";
const ACCESSED_DATE = "July 28, 2026";
const NOT_DISCLOSED = "Not publicly disclosed.";
const REQUIRES_VERIFICATION =
  "Requires verification from the cited primary-source record.";

type EvidenceProfile = {
  exchange: string;
  investorRelations: string;
  latestFiling: string;
  latestEvidence: string;
  operatingComponents: OperatingComponent[];
  estimates: EstimateRecord[];
  forecastScenarios: ForecastScenario[];
  forecastAssumptions: ForecastAssumption[];
  valuationFramework: ValuationFramework;
  thesisMonitoring: ThesisMonitoring;
  sources: ResearchSource[];
  completeness: CompletenessRecord[];
};
type ComponentSeed = {
  name: string;
  metric: string;
  unit: string;
  sourceUrl: string;
  revenue: string;
  margin: string;
  cashFlow: string;
  uncertainty: string;
  interpretation: string;
};

function component(seed: ComponentSeed): OperatingComponent {
  return {
    name: seed.name,
    historicalEvidence: seed.metric,
    reportedMetric: seed.metric,
    unit: seed.unit,
    sourceUrl: seed.sourceUrl,
    revenueRelationship: seed.revenue,
    marginRelationship: seed.margin,
    cashFlowRelationship: seed.cashFlow,
    uncertainty: seed.uncertainty,
    interpretation: seed.interpretation,
    evidenceLabel: "Reported",
  };
}

function pendingValuation(method: string, rationale: string): ValuationFramework {
  return {
    method,
    rationale,
    valuationDate: "July 28, 2026",
    sharePriceDate: "No market-price source connected",
    shareCount: REQUIRES_VERIFICATION,
    netDebtOrCash: REQUIRES_VERIFICATION,
    forecastPeriod: "Not published; operating forecast remains incomplete",
    discountRate: "Not published",
    terminalAssumption: "Not published",
    scenarioRange: "Not published",
    majorSensitivities: "Growth duration, margins, capital intensity, and valuation multiple",
    calculationSource:
      "No valuation output is published until reported inputs and market data are verified.",
    limitations:
      "The site has no licensed real-time market-data feed. This framework is not a price target.",
  };
}

function monitoring(
  coreThesis: string,
  supportingEvidence: string,
  challengingEvidence: string,
  keyQuarterlyMetric: string,
  keyAnnualMetric: string,
  primaryValuationDriver: string,
  primaryDownsideRisk: string,
  upcomingCatalyst: string,
  nextEarningsDate = "Not officially verified",
): ThesisMonitoring {
  return {
    coreThesis,
    supportingEvidence,
    challengingEvidence,
    keyQuarterlyMetric,
    keyAnnualMetric,
    primaryValuationDriver,
    primaryDownsideRisk,
    upcomingCatalyst,
    nextEarningsDate,
    status: "Under Review",
    lastReviewed: "July 28, 2026",
  };
}

function completeness(
  isEtf = false,
  evidenceNote = "Current primary-source evidence is present; multi-period model work remains incomplete.",
): CompletenessRecord[] {
  return [
    ["Executive summary", "Complete", "Company purpose and research question are stated."],
    ["Business overview", "Partial", evidenceNote],
    ["Segment data", isEtf ? "Not Applicable" : "Complete", isEtf ? "ETF exposures replace operating segments." : "Latest disclosed segment or single-reportable-segment values are sourced to the annual filing."],
    ["Five-year financial history", isEtf ? "Not Applicable" : "Complete", isEtf ? "An ETF does not report operating-company financial statements." : "Five fiscal-year rows cite filed annual reports; non-applicable or undisclosed measures are labeled explicitly."],
    ["Operating-component build", "Partial", "Company-relevant drivers and source links are present; undisclosed metrics are labeled."],
    ["Estimate section", "Partial", "Only management-guidance-derived or calculated estimates are shown."],
    ["Forecast section", "Partial", "No unsupported analyst point forecast is published."],
    ["Valuation", "Partial", "Method and required inputs are documented; market-dependent output is withheld."],
    ["Bull case", "Partial", "Scenario requires verified forecast inputs."],
    ["Base case", "Partial", "Scenario requires verified forecast inputs."],
    ["Bear case", "Partial", "Scenario requires verified forecast inputs."],
    ["Catalysts", "Partial", "Catalyst categories are present; dated event verification remains ongoing."],
    ["Risks", "Partial", "Risk categories are present; filing-specific citations remain ongoing."],
    ["Earnings update", "Partial", "Latest cited release is linked; full quarterly history is incomplete."],
    ["Source list", "Partial", "Primary sources are listed; a five-year source archive remains incomplete."],
    ["Performance tracking", "Missing", "No verified publication price and benchmark series are connected."],
    ["Thesis-monitoring indicators", "Complete", "Quarterly and annual monitoring fields are defined."],
  ].map(([section, status, note]) => ({
    section,
    status: status as CompletenessRecord["status"],
    note,
  }));
}

function source(
  label: string,
  publisher: string,
  publicationDate: string,
  reportingPeriod: string,
  type: ResearchSource["type"],
  href: string,
  relevantSection: string,
): ResearchSource {
  return {
    label,
    publisher,
    publicationDate,
    reportingPeriod,
    type,
    href,
    relevantSection,
    accessedDate: ACCESSED_DATE,
  };
}

function driverForecast(reason: string): ForecastScenario[] {
  return [
    {
      period: "Next fiscal year",
      metric: "Revenue and cash-flow direction",
      baseCase:
        "Scenario Assumption — positive operating conversion continues, but growth moderates from the strongest recent period.",
      bullCase:
        "Scenario Assumption — demand, mix, and execution remain above the recent reported trend, supporting stronger cash conversion.",
      bearCase:
        "Scenario Assumption — demand timing, pricing, mix, or execution weakens enough to pressure revenue and cash conversion.",
      operatingDriverBuild: reason,
      managementGuidanceDifference:
        "This is a Luna1 directional scenario, not management guidance and not an external consensus estimate.",
      mainSensitivity: "Conversion of the cited operating drivers into reported revenue and cash flow",
      principalRisk: "The operating evidence may not persist through the next fiscal year",
      sourceUrl: null,
    },
  ];
}

function assumption(
  name: string,
  sourceUrl: string,
  managementEvidence: string,
): ForecastAssumption {
  return {
    assumption: name,
    historicalBasis: "Current reported period and prior-year comparison",
    managementEvidence,
    interpretation:
      "Directionally relevant, but insufficient by itself for a point forecast.",
    baseCase: "Recent reported momentum moderates toward a normalized pace.",
    bullCase: "Demand and operating conversion remain above the recent trend.",
    bearCase: "Demand, pricing, mix, or execution falls below the recent trend.",
    sourceUrl,
    lastUpdated: "July 28, 2026",
  };
}

const urls = {
  GLW: {
    ir: "https://investor.corning.com/investor-relations/default.aspx",
    latest:
      "https://investor.corning.com/news-and-events/news/news-details/2026/Cornings-Strong-Second-Quarter-2026-Financial-Results1-Demonstrate-Progress-on-Recently-Upgraded-Springboard-Plan/default.aspx",
    filing:
      "https://investor.corning.com/investor-relations/financials/sec-filings/default.aspx",
  },
  AIPO: {
    ir: "https://www.defianceetfs.com/aipo/",
    latest: "https://www.defianceetfs.com/fund-documents/",
    filing:
      "https://www.sec.gov/Archives/edgar/data/1924868/000183988225008082/aipo-497k_021025.htm",
  },
  JBL: {
    ir: "https://investors.jabil.com/",
    latest:
      "https://investors.jabil.com/news/news-details/2026/Jabil-Posts-Third-Quarter-Results/default.aspx",
    filing: "https://investors.jabil.com/financials/sec-filings/default.aspx",
  },
  ALAB: {
    ir: "https://investor.asteralabs.com/",
    latest:
      "https://www.sec.gov/Archives/edgar/data/1736297/000173629726000017/alab-20260505.htm",
    filing:
      "https://www.sec.gov/Archives/edgar/data/1736297/000173629726000020/alab-20260331.htm",
  },
  RY: {
    ir: "https://www.rbc.com/investor-relations/index.html",
    latest: "https://www.rbc.com/newsroom/news/article.html?article=126103",
    filing: "https://www.rbc.com/investor-relations/financial-information.html",
  },
  PANW: {
    ir: "https://investors.paloaltonetworks.com/",
    latest:
      "https://investors.paloaltonetworks.com/news-releases/news-release-details/palo-alto-networks-reports-fiscal-third-quarter-2026-financial",
    filing:
      "https://www.sec.gov/Archives/edgar/data/1327567/000132756726000012/panw-20260602.htm",
  },
  ANET: {
    ir: "https://investors.arista.com/",
    latest:
      "https://investors.arista.com/Communications/Press-Releases-and-Events/Press-Release-Detail/2026/Arista-Networks-Inc--Reports-First-Quarter-2026-Financial-Results/default.aspx",
    filing: "https://investors.arista.com/Financial-Information/SEC-Filings",
  },
  DLR: {
    ir: "https://investor.digitalrealty.com/",
    latest:
      "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-second-quarter-2026-results",
    filing: "https://investor.digitalrealty.com/financials/sec-filings",
  },
  STRL: {
    ir: "https://www.strlco.com/investor-relations/",
    latest:
      "https://www.strlco.com/news/sterling-reports-record-first-quarter-results-and-raises-full-year-2026-guidance/",
    filing: "https://www.strlco.com/investor-relations/financials/",
  },
} as const;

function profile(input: Omit<EvidenceProfile, "completeness"> & { isEtf?: boolean }): EvidenceProfile {
  return {
    ...input,
    completeness: completeness(input.isEtf),
  };
}

export const researchEvidenceByTicker: Record<string, EvidenceProfile> = {
  GLW: profile({
    exchange: "NYSE",
    investorRelations: urls.GLW.ir,
    latestFiling: urls.GLW.filing,
    latestEvidence:
      "Corning's official Q2 2026 release is the latest verified operating update. Historical source dates remain attached to their original documents.",
    operatingComponents: [
      component({
        name: "Optical Communications demand",
        metric: "Q1 2026 Optical Communications sales grew 36% year over year.",
        unit: "Year-over-year sales growth",
        sourceUrl:
          "https://investor.corning.com/investor-relations/financials/quarterly-results/default.aspx",
        revenue: "Fiber, cable, and connectivity volumes affect segment sales.",
        margin: "Utilization, mix, and pricing influence segment profitability.",
        cashFlow: "Capacity additions and working capital can delay cash conversion.",
        uncertainty: "Hyperscaler deployment timing and customer concentration.",
        interpretation: "Optical demand is the clearest near-term operating proof point.",
      }),
      component({
        name: "Solar ramp",
        metric: "Q1 2026 Solar sales grew 80% year over year; Q2 included planned maintenance expense.",
        unit: "Sales growth and disclosed expense",
        sourceUrl: urls.GLW.latest,
        revenue: "Polysilicon and module ramps add revenue.",
        margin: "Ramp utilization and maintenance affect contribution margin.",
        cashFlow: "Throughput upgrades require capital and working capital.",
        uncertainty: "Ramp timing and sustainable demand.",
        interpretation: "Track revenue growth together with segment profit and cash generation.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from optical volumes, hyperscaler agreements, solar throughput, utilization, and segment margins.",
    ),
    forecastAssumptions: [
      assumption(
        "Optical and solar demand conversion",
        urls.GLW.latest,
        "Management disclosed current-quarter performance and forward outlook; no Luna1 point forecast is substituted for that guidance.",
      ),
    ],
    valuationFramework: pendingValuation(
      "Segment-informed DCF and normalized earnings multiple",
      "Corning combines businesses with different cycles and capital intensity, so segment economics should precede a consolidated valuation.",
    ),
    thesisMonitoring: monitoring(
      "Optical connectivity and materials-science demand can improve Corning's mix, margins, and cash generation.",
      "Official results show strong optical growth and expanded hyperscaler commitments.",
      "Solar ramp costs, cyclicality, and capital intensity can weaken conversion.",
      "Optical Communications sales growth and margin",
      "Adjusted free cash flow",
      "Normalized segment margin",
      "Capacity is added ahead of realized demand",
      "Conversion of long-term hyperscaler agreements",
    ),
    sources: [
      source("Q2 2026 financial results", "Corning Incorporated", "July 27, 2026", "Quarter ended June 30, 2026", "Earnings release", urls.GLW.latest, "Results, outlook, and segment reporting"),
      source("SEC filings", "Corning Incorporated", "Ongoing archive", "Multiple periods", "Investor relations", urls.GLW.filing, "Company filing archive"),
    ],
  }),
  AIPO: profile({
    isEtf: true,
    exchange: "Nasdaq",
    investorRelations: urls.AIPO.ir,
    latestFiling: urls.AIPO.filing,
    latestEvidence:
      "The fund page, prospectus, holdings, index methodology, and shareholder reports are the relevant primary records; operating-company forecasts are not applicable.",
    operatingComponents: [
      component({
        name: "Holdings and concentration",
        metric: "Fund holdings are published by the sponsor and change over time.",
        unit: "Portfolio weight",
        sourceUrl: urls.AIPO.ir,
        revenue: "Underlying issuer revenue, not ETF revenue, drives economic exposure.",
        margin: "Underlying issuer margins determine portfolio earnings quality.",
        cashFlow: "Fund cash flow primarily reflects subscriptions, redemptions, fees, and distributions.",
        uncertainty: "Holdings, concentration, and rebalance changes.",
        interpretation: "Evaluate the actual holdings rather than relying on the theme name.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Operating-company financial forecasting is not applicable; analyze weighted holdings, fees, concentration, and benchmark behavior.",
    ),
    forecastAssumptions: [
      assumption(
        "Underlying exposure",
        urls.AIPO.ir,
        "Sponsor holdings and methodology documents define exposure; weights must be dated when used.",
      ),
    ],
    valuationFramework: pendingValuation(
      "Weighted underlying valuation and premium/discount review",
      "An ETF is valued through its net asset value, fees, liquidity, concentration, and weighted underlying holdings.",
    ),
    thesisMonitoring: monitoring(
      "AIPO may provide diversified exposure to AI and power infrastructure.",
      "The sponsor publishes holdings, index methodology, and fund documents.",
      "Thematic concentration and underlying valuations can overwhelm diversification benefits.",
      "Holdings concentration",
      "Expense ratio and benchmark-relative return",
      "Weighted underlying valuation",
      "Concentration and thematic re-rating",
      "Index rebalance and updated holdings",
    ),
    sources: [
      source("AIPO fund page", "Defiance ETFs", "Continuously updated", "Current fund information", "Investor relations", urls.AIPO.ir, "Fund objective, holdings, and disclosures"),
      source("AIPO summary prospectus", "SEC / Defiance ETFs", "February 10, 2025", "Prospectus filing", "SEC filing", urls.AIPO.filing, "Investment objective, fees, and principal risks"),
      source("Fund documents", "Defiance ETFs", "Continuously updated", "Multiple periods", "Investor relations", urls.AIPO.latest, "Prospectus, holdings, index methodology, and reports"),
    ],
  }),
  JBL: profile({
    exchange: "NYSE",
    investorRelations: urls.JBL.ir,
    latestFiling: urls.JBL.filing,
    latestEvidence:
      "Jabil's official fiscal Q3 2026 release reported preliminary unaudited results and raised fiscal-year guidance.",
    operatingComponents: [
      component({
        name: "Net revenue and mix",
        metric: "Fiscal Q3 2026 net revenue was $8.8 billion.",
        unit: "USD",
        sourceUrl: urls.JBL.latest,
        revenue: "Program volumes and mix determine consolidated revenue.",
        margin: "Higher-value infrastructure programs can improve a thin consolidated margin.",
        cashFlow: "Inventory, receivables, contract assets, and payables drive conversion.",
        uncertainty: "Customer demand, program ramps, and supply-chain timing.",
        interpretation: "Revenue quality should be judged alongside core margin and working capital.",
      }),
      component({
        name: "Cash conversion",
        metric: "Nine-month fiscal 2026 operating cash flow was $1.269 billion; company-defined adjusted free cash flow was $991 million.",
        unit: "USD",
        sourceUrl: urls.JBL.latest,
        revenue: "Growth increases working-capital requirements.",
        margin: "Program profitability determines cash generation before working capital.",
        cashFlow: "Inventory and customer-funding terms are central.",
        uncertainty: "Timing of large customer ramps and supplier payments.",
        interpretation: "Free cash flow must be reconciled to the company's non-GAAP definition.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from program revenue, AI-infrastructure mix, core operating margin, working capital, capital expenditure, and share count.",
    ),
    forecastAssumptions: [
      assumption("Fiscal 2026 management outlook", urls.JBL.latest, "Management guided to $35 billion revenue, 5.8% core operating margin, $12.70 core EPS, and more than $1.4 billion adjusted free cash flow."),
    ],
    valuationFramework: pendingValuation(
      "Normalized earnings and free-cash-flow yield",
      "Jabil's manufacturing economics are best assessed through normalized margin, cash conversion, customer concentration, and capital intensity.",
    ),
    thesisMonitoring: monitoring(
      "Higher-value infrastructure demand may support improved margins and durable cash generation.",
      "Fiscal Q3 results exceeded company expectations and management raised fiscal 2026 guidance.",
      "Customer concentration, inventory growth, and low absolute margins amplify execution risk.",
      "Core operating margin and adjusted free cash flow",
      "Free cash flow conversion",
      "Normalized core margin",
      "Large-program demand or working-capital reversal",
      "Fiscal Q4 results and fiscal 2027 framework",
    ),
    sources: [
      source("Fiscal Q3 2026 results", "Jabil Inc.", "June 17, 2026", "Quarter ended May 31, 2026", "Earnings release", urls.JBL.latest, "Results, cash flow, and guidance"),
      source("SEC filings", "Jabil Inc.", "Ongoing archive", "Multiple periods", "Investor relations", urls.JBL.filing, "Company filing archive"),
    ],
  }),
  ALAB: profile({
    exchange: "Nasdaq",
    investorRelations: urls.ALAB.ir,
    latestFiling: urls.ALAB.filing,
    latestEvidence:
      "Astera Labs' March 31, 2026 Form 10-Q and May 5, 2026 results filing are the latest verified records used here.",
    operatingComponents: [
      component({
        name: "Connectivity product demand",
        metric: NOT_DISCLOSED,
        unit: "Units and average selling price",
        sourceUrl: urls.ALAB.filing,
        revenue: "Product units, content per system, and mix drive revenue.",
        margin: "Product mix, foundry cost, and launch costs affect gross margin.",
        cashFlow: "Inventory and receivables influence conversion.",
        uncertainty: "Customer concentration and platform adoption.",
        interpretation: "Do not infer unit volume where the company has not disclosed it.",
      }),
      component({
        name: "Customer concentration",
        metric: "Reported in the Form 10-Q; exact concentration should be read from the filing before use in a model.",
        unit: "Percent of revenue",
        sourceUrl: urls.ALAB.filing,
        revenue: "Large customer programs can accelerate or delay revenue.",
        margin: "Concentration can affect pricing and mix.",
        cashFlow: "Customer payment timing affects receivables.",
        uncertainty: "Design-win duration and customer-specific ramps.",
        interpretation: "Treat concentration as both evidence of adoption and a source of forecast error.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from disclosed product ramps, customer concentration, units where disclosed, product mix, gross margin, and operating expense.",
    ),
    forecastAssumptions: [
      assumption("Rack-scale connectivity adoption", urls.ALAB.filing, "The Form 10-Q provides reported revenue, concentration, risks, and operating expenses; undisclosed units are not estimated."),
    ],
    valuationFramework: pendingValuation(
      "Revenue-growth and free-cash-flow scenarios",
      "A high-growth semiconductor supplier requires explicit growth-duration, concentration, gross-margin, and dilution assumptions.",
    ),
    thesisMonitoring: monitoring(
      "Connectivity bottlenecks in AI systems may support durable demand for Astera Labs products.",
      "The company has current SEC filings and reported product-platform growth.",
      "Customer concentration, premium expectations, and product-cycle risk remain material.",
      "Revenue growth and gross margin",
      "Customer concentration and free cash flow",
      "Growth duration",
      "Customer or product-platform concentration",
      "Next officially announced earnings release",
    ),
    sources: [
      source("Q1 2026 Form 10-Q", "Astera Labs, Inc. / SEC", "May 5, 2026", "Quarter ended March 31, 2026", "Quarterly report", urls.ALAB.filing, "Financial statements, concentration, risks, and MD&A"),
      source("Q1 2026 results Form 8-K", "Astera Labs, Inc. / SEC", "May 5, 2026", "Quarter ended March 31, 2026", "SEC filing", urls.ALAB.latest, "Results release filing"),
    ],
  }),
  RY: profile({
    exchange: "TSX / NYSE",
    investorRelations: urls.RY.ir,
    latestFiling: urls.RY.filing,
    latestEvidence:
      "RBC's Q2 2026 release and shareholder-report archive provide the current reported evidence. Amounts are in Canadian dollars unless identified otherwise.",
    operatingComponents: [
      component({
        name: "Net interest income and fee revenue",
        metric: "Q2 2026 revenue was C$17.453 billion, including C$8.506 billion net interest income and C$8.947 billion non-interest income.",
        unit: "CAD",
        sourceUrl: urls.RY.latest,
        revenue: "Balances, spreads, markets activity, and fee assets drive revenue.",
        margin: "Funding costs, compensation, and operating leverage affect returns.",
        cashFlow: "Bank cash flow is not interpreted like industrial free cash flow.",
        uncertainty: "Credit, market activity, and rate sensitivity.",
        interpretation: "Evaluate revenue with provisions, capital, and return on equity.",
      }),
      component({
        name: "Credit and capital",
        metric: "Q2 2026 total PCL was C$0.9 billion and CET1 ratio was 13.5%.",
        unit: "CAD and regulatory ratio",
        sourceUrl: urls.RY.latest,
        revenue: "Credit does not create revenue but affects sustainable earning power.",
        margin: "Provision expense directly affects pre-tax income.",
        cashFlow: "Capital ratios govern distributions and balance-sheet growth.",
        uncertainty: "Future credit migration and regulatory requirements.",
        interpretation: "ROE must be assessed with credit normalization and capital sufficiency.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from average balances, net interest margin, fee assets, provisions, expenses, tax, and regulatory capital.",
    ),
    forecastAssumptions: [
      assumption("Credit normalization and operating leverage", urls.RY.latest, "RBC reported Q2 provisions, revenue growth, ROE, and CET1; no independent Luna1 point forecast is published."),
    ],
    valuationFramework: pendingValuation(
      "Price-to-book and residual-income framework",
      "A bank's valuation should connect sustainable ROE, cost of equity, credit losses, and required regulatory capital.",
    ),
    thesisMonitoring: monitoring(
      "RBC's diversified franchise may support premium through-cycle returns with controlled credit and capital.",
      "Q2 2026 reported net income grew 25% year over year and CET1 remained above regulatory requirements.",
      "Credit normalization, housing exposure, funding costs, and capital-markets volatility remain risks.",
      "PCL ratio, ROE, and CET1",
      "Return on equity through the credit cycle",
      "Sustainable ROE relative to cost of equity",
      "Credit losses exceed normalization assumptions",
      "Fiscal Q3 2026 results",
      "August 27, 2026",
    ),
    sources: [
      source("Q2 2026 earnings release", "Royal Bank of Canada", "May 28, 2026", "Quarter ended April 30, 2026", "Earnings release", urls.RY.latest, "Reported results, credit, capital, and segment commentary"),
      source("Financial information archive", "Royal Bank of Canada", "Ongoing archive", "Multiple periods", "Investor relations", urls.RY.filing, "Quarterly and annual reports"),
    ],
  }),
  PANW: profile({
    exchange: "Nasdaq",
    investorRelations: urls.PANW.ir,
    latestFiling: urls.PANW.filing,
    latestEvidence:
      "Palo Alto Networks' fiscal Q3 2026 release separates GAAP and non-GAAP results and identifies acquisition contributions.",
    operatingComponents: [
      component({
        name: "Next-Generation Security ARR",
        metric: "Fiscal Q3 2026 NGS ARR was $8.1 billion, up 60%; $1.6 billion came from CyberArk and Chronosphere.",
        unit: "USD annual recurring revenue",
        sourceUrl: urls.PANW.latest,
        revenue: "Recurring commitments support future subscription revenue.",
        margin: "Platform mix and acquired businesses affect operating leverage.",
        cashFlow: "Billing terms and collections affect deferred revenue and cash generation.",
        uncertainty: "Organic versus acquired growth and platform discounting.",
        interpretation: "Separate organic performance from acquisition contribution.",
      }),
      component({
        name: "Remaining performance obligations",
        metric: "Fiscal Q3 2026 RPO was $18.4 billion, up 36%; $1.8 billion came from acquired businesses.",
        unit: "USD contracted obligations",
        sourceUrl: urls.PANW.latest,
        revenue: "RPO provides visibility but converts over varying periods.",
        margin: "Contract mix and delivery costs shape future margins.",
        cashFlow: "Billings and contract timing affect cash conversion.",
        uncertainty: "Timing, renewal, and acquired-business comparability.",
        interpretation: "RPO is a visibility measure, not current-period revenue.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from organic NGS ARR, RPO conversion, platform adoption, operating margin, stock compensation, acquisitions, and free cash flow.",
    ),
    forecastAssumptions: [
      assumption("Organic recurring growth", urls.PANW.latest, "Management reported NGS ARR and RPO including explicit acquisition contributions."),
    ],
    valuationFramework: pendingValuation(
      "Free-cash-flow and growth-duration scenarios",
      "Recurring revenue and cash generation are relevant, but acquisition effects and stock-based compensation must be explicit.",
    ),
    thesisMonitoring: monitoring(
      "Cybersecurity consolidation and AI security demand may sustain platform growth and cash generation.",
      "Fiscal Q3 2026 revenue, NGS ARR, RPO, and adjusted free cash flow increased.",
      "GAAP operating loss, acquisition integration, stock compensation, and organic-growth comparability challenge the thesis.",
      "Organic NGS ARR and RPO growth",
      "Adjusted free cash flow less dilution",
      "Duration of organic recurring growth",
      "Integration or competitive pressure reduces organic growth",
      "Fiscal Q4 2026 results",
    ),
    sources: [
      source("Fiscal Q3 2026 financial results", "Palo Alto Networks", "June 2, 2026", "Quarter ended April 30, 2026", "Earnings release", urls.PANW.latest, "GAAP and non-GAAP results, ARR, RPO, and cash flow"),
      source("Fiscal Q3 2026 Form 8-K", "Palo Alto Networks / SEC", "June 2, 2026", "Quarter ended April 30, 2026", "SEC filing", urls.PANW.filing, "Filed earnings-release reference"),
    ],
  }),
  ANET: profile({
    exchange: "NYSE",
    investorRelations: urls.ANET.ir,
    latestFiling: urls.ANET.filing,
    latestEvidence:
      "Arista's official Q1 2026 release provides reported revenue, GAAP and non-GAAP margins, EPS, cash flow, and management outlook.",
    operatingComponents: [
      component({
        name: "Cloud and AI networking demand",
        metric: "Q1 2026 revenue was $2.709 billion, up 35.1% year over year.",
        unit: "USD",
        sourceUrl: urls.ANET.latest,
        revenue: "Switching, routing, campus, and services demand determine revenue.",
        margin: "Product mix and supply-chain costs influence gross margin.",
        cashFlow: "Collections and inventory affect operating cash flow.",
        uncertainty: "Cloud-customer concentration and deployment timing.",
        interpretation: "Growth is strong, but customer and product concentration must be monitored.",
      }),
      component({
        name: "Operating leverage",
        metric: "Q1 2026 GAAP operating margin was 42.7%; non-GAAP operating margin was 47.8%.",
        unit: "Operating margin",
        sourceUrl: urls.ANET.latest,
        revenue: "Scale supports operating leverage.",
        margin: "Mix, pricing, and investment pace determine durability.",
        cashFlow: "High margin can support cash generation, subject to working capital.",
        uncertainty: "Sustainability through product and customer cycles.",
        interpretation: "Keep GAAP and non-GAAP margin evidence separate.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from cloud-titan demand, AI-networking adoption, enterprise mix, product and service margin, inventory, and operating expenses.",
    ),
    forecastAssumptions: [
      assumption("Q2 2026 management outlook", urls.ANET.latest, "Management guided to approximately $2.8 billion revenue and 46%–47% non-GAAP operating margin."),
    ],
    valuationFramework: pendingValuation(
      "Growth-duration DCF and normalized earnings multiple",
      "Arista's high margins and growth require explicit assumptions for customer concentration, competitive intensity, and reinvestment.",
    ),
    thesisMonitoring: monitoring(
      "Ethernet-based AI and cloud networking demand may support durable growth and high margins.",
      "Q1 2026 revenue grew 35.1% and GAAP operating margin was 42.7%.",
      "Cloud-customer concentration, supply-chain shifts, and high embedded expectations remain risks.",
      "Revenue growth and GAAP operating margin",
      "Cash flow from operations and customer concentration",
      "Growth duration",
      "A major customer slows or insources networking",
      "Q2 2026 results",
    ),
    sources: [
      source("Q1 2026 financial results", "Arista Networks, Inc.", "May 5, 2026", "Quarter ended March 31, 2026", "Earnings release", urls.ANET.latest, "Results, margins, cash flow, and outlook"),
      source("SEC filings", "Arista Networks, Inc.", "Ongoing archive", "Multiple periods", "Investor relations", urls.ANET.filing, "Company filing archive"),
    ],
  }),
  DLR: profile({
    exchange: "NYSE",
    investorRelations: urls.DLR.ir,
    latestFiling: urls.DLR.filing,
    latestEvidence:
      "Digital Realty's Q2 2026 release is the latest verified quarter and separates reported FFO, Core FFO, bookings, and backlog.",
    operatingComponents: [
      component({
        name: "Bookings and backlog",
        metric: "Q2 2026 bookings were $307 million of annualized GAAP base rent at 100% share; quarter-end backlog was $1.9 billion at 100% share.",
        unit: "Annualized GAAP base rent",
        sourceUrl: urls.DLR.latest,
        revenue: "Signed leases convert after contractual commencement.",
        margin: "Lease economics, energy, and operating costs determine NOI.",
        cashFlow: "Development spending precedes lease commencement and rent collection.",
        uncertainty: "Commencement timing, customer credit, and Digital Realty's ownership share.",
        interpretation: "Use the company's share and commencement schedule, not gross bookings alone.",
      }),
      component({
        name: "Renewal pricing",
        metric: "Q2 2026 cash-basis renewal rent increased 25.4%.",
        unit: "Cash renewal spread",
        sourceUrl: urls.DLR.latest,
        revenue: "Renewal spreads affect same-capital growth.",
        margin: "Higher rent can expand NOI if operating costs remain controlled.",
        cashFlow: "Cash-basis spreads are directly relevant to property cash flow.",
        uncertainty: "Mix and sustainability of unusually strong renewals.",
        interpretation: "Separate renewal economics from new-development leasing.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from signed backlog commencement, occupancy, renewal spreads, same-capital NOI, developments, financing, and share issuance.",
    ),
    forecastAssumptions: [
      assumption("2026 Core FFO outlook", urls.DLR.latest, "Management raised Core FFO per-share outlook excluding net promote to $8.15–$8.20."),
    ],
    valuationFramework: pendingValuation(
      "Price/AFFO and net asset value",
      "A data-center REIT should be valued on per-share cash flow, property economics, development value, leverage, and cost of capital.",
    ),
    thesisMonitoring: monitoring(
      "Data-center demand, lease pricing, and development execution may drive per-share cash-flow growth.",
      "Q2 2026 backlog reached a reported record and management raised Core FFO outlook.",
      "Capital intensity, financing needs, long commencement lags, and customer concentration can dilute returns.",
      "Bookings at Digital Realty's share and backlog commencement",
      "Core FFO per share excluding one-time items",
      "AFFO per share and NAV",
      "Capital costs outpace development returns",
      "Backlog commencement and development delivery",
    ),
    sources: [
      source("Q2 2026 financial results", "Digital Realty Trust, Inc.", "July 23, 2026", "Quarter ended June 30, 2026", "Earnings release", urls.DLR.latest, "Results, bookings, backlog, renewals, and outlook"),
      source("SEC filings", "Digital Realty Trust, Inc.", "Ongoing archive", "Multiple periods", "Investor relations", urls.DLR.filing, "Company filing archive"),
    ],
  }),
  STRL: profile({
    exchange: "Nasdaq",
    investorRelations: urls.STRL.ir,
    latestFiling: urls.STRL.filing,
    latestEvidence:
      "Sterling's official Q1 2026 release and filing archive are the latest primary sources used for the operating review.",
    operatingComponents: [
      component({
        name: "Backlog and project mix",
        metric: "Current backlog and segment mix require direct extraction from the Q1 release before use in a model.",
        unit: "USD and project mix",
        sourceUrl: urls.STRL.latest,
        revenue: "Project awards and conversion timing drive revenue.",
        margin: "Project selection, execution, and segment mix affect margin.",
        cashFlow: "Billing terms, retainage, and working capital affect conversion.",
        uncertainty: "Customer concentration, labor, weather, and project timing.",
        interpretation: "Backlog quality and cash conversion matter more than backlog size alone.",
      }),
      component({
        name: "Data-center and advanced-manufacturing demand",
        metric: NOT_DISCLOSED,
        unit: "Project revenue by end market",
        sourceUrl: urls.STRL.latest,
        revenue: "Site-development activity supports E-Infrastructure revenue.",
        margin: "Project selectivity and execution determine profitability.",
        cashFlow: "Large projects can require working capital before collections.",
        uncertainty: "Customer timing and construction-cycle conditions.",
        interpretation: "Do not infer end-market revenue not separately disclosed.",
      }),
    ],
    estimates: [],
    forecastScenarios: driverForecast(
      "Build from backlog conversion, segment mix, project awards, margins, working capital, and capital allocation.",
    ),
    forecastAssumptions: [
      assumption("Full-year 2026 company guidance", urls.STRL.latest, "Management raised full-year guidance in the official Q1 release; figures must be read directly from the release before model entry."),
    ],
    valuationFramework: pendingValuation(
      "Normalized earnings and free-cash-flow scenarios",
      "Project mix, backlog conversion, execution, and working-capital intensity should drive the valuation framework.",
    ),
    thesisMonitoring: monitoring(
      "Infrastructure and data-center project demand may support growth if project selection and execution remain disciplined.",
      "Management reported record Q1 results and raised full-year 2026 guidance.",
      "Project execution, labor, customer concentration, and working-capital needs remain material.",
      "Backlog conversion and segment margin",
      "Operating cash flow conversion",
      "Normalized segment margin",
      "Project execution or customer timing deteriorates",
      "Next officially announced earnings release",
    ),
    sources: [
      source("Q1 2026 results", "Sterling Infrastructure, Inc.", "May 5, 2026", "Quarter ended March 31, 2026", "Earnings release", urls.STRL.latest, "Results and full-year guidance"),
      source("Financials and filings", "Sterling Infrastructure, Inc.", "Ongoing archive", "Multiple periods", "Investor relations", urls.STRL.filing, "Quarterly reports and filings"),
    ],
  }),
};
