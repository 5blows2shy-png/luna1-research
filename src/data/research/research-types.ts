export type ResearchStatus =
  | "Full Coverage"
  | "Initial Research"
  | "Monitoring"
  | "Model in Progress"
  | "Updated After Earnings"
  | "Watchlist"
  | "Insufficient Evidence";

export type ThesisStatus =
  | "Bullish"
  | "Constructive"
  | "Neutral"
  | "Watch"
  | "Under Review"
  | "Positive"
  | "Cautious";

export type EvidenceLabel =
  | "Reported"
  | "Calculated"
  | "Estimated"
  | "Forecast"
  | "Scenario Assumption";

export type ConfidenceLevel = "High" | "Moderate" | "Low";

export type CompletenessStatus =
  | "Complete"
  | "Partial"
  | "Missing"
  | "Not Disclosed"
  | "Not Applicable"
  | "Requires Verification";

export type DocumentStatus = "available" | "in-progress";
export type ResearchKind =
  | "operating-company"
  | "bank"
  | "investment-bank"
  | "reit"
  | "etf";

export type ResearchLink = {
  label: string;
  href: string | null;
};

export type ResearchSection = {
  title: string;
  detail: string;
};

export type SegmentRecord = {
  name: string;
  revenue: number | null;
  revenueGrowth: number | null;
  operatingIncome: number | null;
  operatingMargin: number | null;
  shareOfRevenue: number | null;
  driver: string;
  sourceUrl: string | null;
};

export type HistoricalFinancialRecord = {
  period: string;
  revenue: number | null;
  revenueGrowth: number | null;
  grossProfit: number | null;
  grossMargin: number | null;
  operatingIncome: number | null;
  operatingMargin: number | null;
  ebitda: number | null;
  ebitdaMargin: number | null;
  netIncome: number | null;
  dilutedEps: number | null;
  operatingCashFlow: number | null;
  capitalExpenditures: number | null;
  freeCashFlow: number | null;
  cash: number | null;
  debt: number | null;
  dilutedShares: number | null;
  sourceUrl: string | null;
};

export type ForecastRecord = {
  period: string;
  periodType: "Estimate" | "Forecast";
  revenue: number | null;
  revenueGrowth: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  ebitdaMargin: number | null;
  taxRate: number | null;
  eps: number | null;
  capitalExpenditures: number | null;
  freeCashFlow: number | null;
  shareCount: number | null;
  netDebt: number | null;
};

export type ComparableCompany = {
  company: string;
  ticker: string;
  marketCapitalization: number | null;
  enterpriseValue: number | null;
  revenueGrowth: number | null;
  ebitdaMargin: number | null;
  evRevenue: number | null;
  evEbitda: number | null;
  pe: number | null;
  freeCashFlowYield: number | null;
  priceToBook: number | null;
  sourceUrl: string | null;
};

export type EarningsRecord = {
  quarter: string;
  revenue: number | null;
  revenueGrowth: number | null;
  eps: number | null;
  epsGrowth: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  guidance: string | null;
  earningsReaction: string | null;
  analystNote: string | null;
  sourceUrl: string | null;
};

export type ResearchNote = {
  date: string | null;
  category:
    | "Earnings"
    | "Investor Day"
    | "Product"
    | "Industry"
    | "Valuation"
    | "Thesis"
    | "Portfolio Lesson";
  note: string;
  sourceUrl: string | null;
};

export type ResearchSource = {
  label: string;
  publisher?: string;
  publicationDate?: string;
  reportingPeriod?: string;
  relevantSection?: string;
  type:
    | "SEC filing"
    | "Annual report"
    | "Quarterly report"
    | "Earnings release"
    | "Investor presentation"
    | "Conference call"
    | "Investor relations"
    | "Industry report";
  href: string;
  accessedDate: string | null;
};

export type OperatingComponent = {
  name: string;
  historicalEvidence: string;
  reportedMetric: string;
  unit: string;
  sourceUrl: string | null;
  revenueRelationship: string;
  marginRelationship: string;
  cashFlowRelationship: string;
  uncertainty: string;
  interpretation: string;
  evidenceLabel: EvidenceLabel;
};

export type EstimateRecord = {
  name: string;
  value: string;
  calculationMethod: string;
  sourceInputs: string;
  reportingPeriod: string;
  confidence: ConfidenceLevel;
  limitations: string;
  managementGuidance: string;
  evidenceLabel: "Estimated" | "Calculated";
};

export type ForecastScenario = {
  period: string;
  metric: string;
  baseCase: string;
  bullCase: string;
  bearCase: string;
  operatingDriverBuild: string;
  managementGuidanceDifference: string;
  mainSensitivity: string;
  principalRisk: string;
  sourceUrl: string | null;
};

export type ForecastAssumption = {
  assumption: string;
  historicalBasis: string;
  managementEvidence: string;
  interpretation: string;
  baseCase: string;
  bullCase: string;
  bearCase: string;
  sourceUrl: string | null;
  lastUpdated: string;
};

export type ValuationFramework = {
  method: string;
  rationale: string;
  valuationDate: string;
  sharePriceDate: string;
  shareCount: string;
  netDebtOrCash: string;
  forecastPeriod: string;
  discountRate: string;
  terminalAssumption: string;
  scenarioRange: string;
  majorSensitivities: string;
  calculationSource: string;
  limitations: string;
};

export type ThesisMonitoring = {
  coreThesis: string;
  supportingEvidence: string;
  challengingEvidence: string;
  keyQuarterlyMetric: string;
  keyAnnualMetric: string;
  primaryValuationDriver: string;
  primaryDownsideRisk: string;
  upcomingCatalyst: string;
  nextEarningsDate: string;
  status: "Strengthening" | "Stable" | "Weakening" | "Broken" | "Under Review";
  lastReviewed: string;
};

export type CompletenessRecord = {
  section: string;
  status: CompletenessStatus;
  note: string;
};

export type ResearchDocument = {
  status: DocumentStatus;
  url: string | null;
  fileName: string;
  fileFormat: "PDF" | "XLSX";
  fileSize: string | null;
  version: string;
};

export type CompanyResearchCoverage = {
  ticker: string;
  slug: string;
  companyName: string;
  kind: ResearchKind;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  watchlistReason: string;
  coreInvestmentQuestion: string;
  primaryMonitoringReason: string;
  thesisSummary: string;
  keyValuationQuestion: string;
  bullCase: string;
  baseCase: string;
  bearCase: string;
  marketMayBeMissing: string;
  thesisRequirements: string;
  thesisInvalidation: string;
  businessOverview: ResearchSection[];
  revenueDrivers: string[];
  segments: SegmentRecord[];
  historicalFinancials: HistoricalFinancialRecord[];
  forecasts: ForecastRecord[];
  operatingComponents: OperatingComponent[];
  estimates: EstimateRecord[];
  forecastScenarios: ForecastScenario[];
  forecastAssumptions: ForecastAssumption[];
  valuationFramework: ValuationFramework;
  thesisMonitoring: ThesisMonitoring;
  completeness: CompletenessRecord[];
  valuationMethods: string[];
  valuationFocus: string[];
  comparableCompanies: ComparableCompany[];
  catalysts: ResearchSection[];
  risks: ResearchSection[];
  earningsHistory: EarningsRecord[];
  researchNotes: ResearchNote[];
  sources: ResearchSource[];
  lastUpdated: string;
  researchStatus: ResearchStatus;
  thesisStatus: ThesisStatus;
  valuationStatus: "Model in Progress" | "Valuation Updated";
  report: ResearchDocument;
  model: ResearchDocument;
  latestFiling: ResearchLink;
  investorRelations: ResearchLink;
  specialSection?: { title: string; body: string };
};
