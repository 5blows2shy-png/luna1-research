export const THESIS_ROLES = [
  "Portfolio Manager",
  "Research Analyst",
  "Risk Analyst",
  "Corporate Strategy",
  "Infrastructure / Project Finance",
  "Observer",
] as const;

export type ThesisRole = (typeof THESIS_ROLES)[number];
export type ThesisStatus = "Supported" | "Monitor" | "Challenged";

export type LunaAssumptions = {
  revenue: number;
  revenueGrowth: number;
  volumeGrowth: number;
  pricing: number;
  productMix: number;
  grossMargin: number;
  operatingMargin: number;
  taxRate: number;
  capex: number;
  workingCapital: number;
  freeCashFlow: number;
  shareCount: number;
  netDebt: number;
  valuationMultiple: number;
  discountRate: number;
  terminalGrowthRate: number;
  fairValue: number;
  downsideValue: number;
  confidence: number;
};

export type AnalystAssumptions = LunaAssumptions;

export type PortfolioInputs = {
  holdingPeriod: number;
  requiredReturn: number;
  maximumDownside: number;
  bullProbability: number;
  baseProbability: number;
  bearProbability: number;
  proposedPosition: number;
  maximumPosition: number;
  bullValue: number;
  baseValue: number;
  bearValue: number;
  thesisBreak: string;
  catalyst: string;
  risk: string;
  confidence: number;
};

export type RiskInputs = {
  scores: Record<string, number>;
  failureMode: string;
  maximumLoss: number;
  invalidationSignal: string;
  monitoringFrequency: string;
  marginOfSafety: number;
};

export type ProjectInputs = {
  capacity: number;
  installedCostPerMw: number;
  constructionYears: number;
  contractYears: number;
  utilization: number;
  revenuePerMw: number;
  servicePrice: number;
  operatingExpense: number;
  maintenanceExpense: number;
  financingCost: number;
  debtPercentage: number;
  taxRate: number;
  residualValue: number;
  customerDeposit: number;
  workingCapital: number;
  completionProbability: number;
};

export const RISK_FACTORS = [
  "Financial leverage",
  "Customer concentration",
  "Execution risk",
  "Margin risk",
  "Liquidity risk",
  "Regulatory risk",
  "Technology risk",
  "Valuation risk",
  "Forecast uncertainty",
  "Capital-allocation risk",
] as const;

export const defaultLunaAssumptions: LunaAssumptions = {
  revenue: 1_000,
  revenueGrowth: 14,
  volumeGrowth: 9,
  pricing: 3,
  productMix: 2,
  grossMargin: 58,
  operatingMargin: 24,
  taxRate: 21,
  capex: 70,
  workingCapital: 25,
  freeCashFlow: 125,
  shareCount: 100,
  netDebt: 100,
  valuationMultiple: 22,
  discountRate: 9,
  terminalGrowthRate: 3,
  fairValue: 26.5,
  downsideValue: 17.5,
  confidence: 65,
};

export const defaultPortfolioInputs: PortfolioInputs = {
  holdingPeriod: 3,
  requiredReturn: 12,
  maximumDownside: 20,
  bullProbability: 25,
  baseProbability: 50,
  bearProbability: 25,
  proposedPosition: 3,
  maximumPosition: 5,
  bullValue: 34,
  baseValue: 26.5,
  bearValue: 17.5,
  thesisBreak: "Free-cash-flow conversion remains below 70% for two quarters.",
  catalyst: "Evidence that the primary operating catalyst is accelerating.",
  risk: "Execution misses reduce margin and cash-flow conversion.",
  confidence: 65,
};

export const defaultRiskInputs: RiskInputs = {
  scores: Object.fromEntries(RISK_FACTORS.map((factor) => [factor, 3])),
  failureMode: "Execution delays prevent expected operating leverage.",
  maximumLoss: 20,
  invalidationSignal: "Two consecutive quarters below the base-case revenue range.",
  monitoringFrequency: "Quarterly",
  marginOfSafety: 20,
};

export const defaultProjectInputs: ProjectInputs = {
  capacity: 100,
  installedCostPerMw: 1.2,
  constructionYears: 2,
  contractYears: 10,
  utilization: 75,
  revenuePerMw: 0.18,
  servicePrice: 1,
  operatingExpense: 4,
  maintenanceExpense: 2,
  financingCost: 7,
  debtPercentage: 60,
  taxRate: 21,
  residualValue: 10,
  customerDeposit: 5,
  workingCapital: 3,
  completionProbability: 85,
};

const safeDivide = (numerator: number, denominator: number) =>
  denominator === 0 ? 0 : numerator / denominator;
const round = (value: number, digits = 2) =>
  Number.isFinite(value) ? Number(value.toFixed(digits)) : 0;

export function calculateAnalystScenario(
  inputs: AnalystAssumptions,
  base = defaultLunaAssumptions,
) {
  const projectedRevenue =
    inputs.revenue *
    (1 + (inputs.revenueGrowth + inputs.volumeGrowth + inputs.pricing + inputs.productMix) / 100);
  const operatingIncome = projectedRevenue * (inputs.operatingMargin / 100);
  const afterTaxOperatingIncome = operatingIncome * (1 - inputs.taxRate / 100);
  const freeCashFlow =
    afterTaxOperatingIncome - inputs.capex - inputs.workingCapital;
  const enterpriseValue = freeCashFlow * inputs.valuationMultiple;
  const equityValue = enterpriseValue - inputs.netDebt;
  const fairValue = safeDivide(equityValue, inputs.shareCount);
  const differences = (
    Object.keys(inputs) as Array<keyof AnalystAssumptions>
  ).map((key) => ({
    key,
    luna: base[key],
    user: inputs[key],
    difference: inputs[key] - base[key],
    materiality: Math.abs(safeDivide(inputs[key] - base[key], base[key] || 1)),
  }));
  const mostSensitive = [...differences].sort(
    (a, b) => b.materiality - a.materiality,
  )[0];
  const scenarioValues = {
    bull: fairValue * 1.2,
    base: fairValue,
    bear: fairValue * 0.72,
  };
  return {
    projectedRevenue: round(projectedRevenue),
    grossProfit: round(projectedRevenue * (inputs.grossMargin / 100)),
    operatingIncome: round(operatingIncome),
    freeCashFlow: round(freeCashFlow),
    enterpriseValue: round(enterpriseValue),
    equityValue: round(equityValue),
    fairValue: round(fairValue),
    scenarioValues: Object.fromEntries(
      Object.entries(scenarioValues).map(([key, value]) => [key, round(value)]),
    ) as Record<keyof typeof scenarioValues, number>,
    differences: differences.sort((a, b) => b.materiality - a.materiality),
    mostSensitive,
    thesisStatus:
      fairValue < base.downsideValue
        ? ("Challenged" as const)
        : fairValue < base.fairValue * 0.9
          ? ("Monitor" as const)
          : ("Supported" as const),
  };
}

export function calculatePortfolioAnalysis(
  inputs: PortfolioInputs,
  referenceValue: number,
) {
  const probabilityTotal =
    inputs.bullProbability + inputs.baseProbability + inputs.bearProbability;
  const expectedValue =
    (inputs.bullValue * inputs.bullProbability +
      inputs.baseValue * inputs.baseProbability +
      inputs.bearValue * inputs.bearProbability) /
    (probabilityTotal || 100);
  const expectedReturn = safeDivide(expectedValue - referenceValue, referenceValue) * 100;
  const downside = Math.max(
    0,
    safeDivide(referenceValue - inputs.bearValue, referenceValue) * 100,
  );
  const annualizedReturn =
    (Math.pow(Math.max(expectedValue / referenceValue, 0), 1 / Math.max(inputs.holdingPeriod, 1)) -
      1) *
    100;
  const riskAdjustedReturn = annualizedReturn - downside * (inputs.bearProbability / 100);
  let decision = "Investigate Further";
  if (probabilityTotal !== 100) decision = "Insufficient Evidence";
  else if (expectedReturn < 0 || downside > inputs.maximumDownside * 1.5) decision = "Avoid";
  else if (downside > inputs.maximumDownside) decision = "High Risk";
  else if (annualizedReturn < inputs.requiredReturn) decision = "Watchlist";
  else if (inputs.confidence < 55) decision = "Small Initial Position";
  else if (inputs.confidence >= 75 && riskAdjustedReturn >= inputs.requiredReturn)
    decision = "Standard Position Candidate";
  else decision = "Small Initial Position";
  return {
    probabilityTotal,
    expectedValue: round(expectedValue),
    expectedReturn: round(expectedReturn),
    annualizedReturn: round(annualizedReturn),
    riskAdjustedReturn: round(riskAdjustedReturn),
    downside: round(downside),
    decision,
    positionWarning:
      inputs.proposedPosition > inputs.maximumPosition
        ? `Proposed size exceeds the stated maximum by ${round(inputs.proposedPosition - inputs.maximumPosition)} percentage points.`
        : downside > inputs.maximumDownside
          ? "Bear-case loss exceeds the stated downside tolerance."
          : "Proposed size remains within the stated maximum; sizing still requires independent judgment.",
  };
}

export function calculateRiskAnalysis(inputs: RiskInputs) {
  const entries = Object.entries(inputs.scores);
  const total = entries.reduce((sum, [, score]) => sum + score, 0);
  const weightedScore = safeDivide(total, entries.length);
  const ranked = [...entries].sort((a, b) => b[1] - a[1]);
  const topScore = ranked[0]?.[1] ?? 0;
  const concentration = safeDivide(
    ranked.filter(([, score]) => score === topScore).length,
    entries.length,
  );
  return {
    weightedScore: round(weightedScore),
    principalDriver: ranked[0]?.[0] ?? "Not available",
    concentration: round(concentration * 100),
    status:
      weightedScore >= 4
        ? ("Challenged" as const)
        : weightedScore >= 3
          ? ("Monitor" as const)
          : ("Supported" as const),
    ranked,
  };
}

function npv(rate: number, cashFlows: number[]) {
  return cashFlows.reduce(
    (total, cashFlow, index) => total + cashFlow / Math.pow(1 + rate, index),
    0,
  );
}

export function calculateIrr(cashFlows: number[]) {
  if (!cashFlows.some((value) => value < 0) || !cashFlows.some((value) => value > 0))
    return null;
  let low = -0.99;
  let high = 10;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const mid = (low + high) / 2;
    if (npv(mid, cashFlows) > 0) low = mid;
    else high = mid;
  }
  return round(((low + high) / 2) * 100);
}

export function calculateProjectEconomics(inputs: ProjectInputs) {
  const installedCost = inputs.capacity * inputs.installedCostPerMw;
  const initialEquity =
    installedCost * (1 - inputs.debtPercentage / 100) +
    inputs.workingCapital -
    inputs.customerDeposit;
  const revenue =
    inputs.capacity *
    inputs.revenuePerMw *
    (inputs.utilization / 100) *
    inputs.servicePrice;
  const ebitda = revenue - inputs.operatingExpense - inputs.maintenanceExpense;
  const debt = installedCost * (inputs.debtPercentage / 100);
  const interest = debt * (inputs.financingCost / 100);
  const operatingCashFlow = Math.max(0, (ebitda - interest) * (1 - inputs.taxRate / 100));
  const annualDebtService =
    inputs.contractYears > 0 ? debt / inputs.contractYears + interest : 0;
  const requiredRevenue = inputs.operatingExpense + inputs.maintenanceExpense + interest;
  const breakEvenUtilization =
    safeDivide(
      requiredRevenue,
      inputs.capacity * inputs.revenuePerMw * inputs.servicePrice,
    ) * 100;
  const completionWeight = inputs.completionProbability / 100;
  const cashFlows = [
    -initialEquity,
    ...Array.from({ length: Math.max(1, Math.round(inputs.contractYears)) }, (_, index) =>
      operatingCashFlow +
      (index === Math.round(inputs.contractYears) - 1 ? inputs.residualValue : 0),
    ),
  ];
  const projectNpv = npv(inputs.financingCost / 100, cashFlows) * completionWeight;
  const payback = safeDivide(initialEquity, operatingCashFlow);
  return {
    installedCost: round(installedCost),
    revenue: round(revenue),
    ebitda: round(ebitda),
    operatingCashFlow: round(operatingCashFlow),
    paybackPeriod: round(payback),
    breakEvenUtilization: round(breakEvenUtilization),
    npv: round(projectNpv),
    irr: calculateIrr(cashFlows),
    debtServiceCoverage: round(safeDivide(operatingCashFlow, annualDebtService)),
    scenarios: {
      upside: round(projectNpv * 1.2),
      base: round(projectNpv),
      downside: round(projectNpv * 0.7),
    },
    largestSensitivity:
      breakEvenUtilization > inputs.utilization
        ? "Utilization rate"
        : inputs.debtPercentage >= 70
          ? "Financing structure"
          : "Installed cost per megawatt",
  };
}

export function buildCommitteeQuestions(args: {
  role: ThesisRole;
  company: string;
  catalyst: string;
  risk: string;
  mostSensitive: string;
  thesisStatus: ThesisStatus;
}) {
  return [
    `What company-reported evidence from ${args.company} would validate the ${args.mostSensitive.toLowerCase()} assumption?`,
    `Which quarterly metric would show that ${args.risk.toLowerCase()} is becoming more likely?`,
    `What evidence would move the thesis from ${args.thesisStatus.toLowerCase()} to supported?`,
    `Does the expected return remain sufficient if ${args.catalyst.toLowerCase()} is delayed by two quarters?`,
    `Which disclosure is still missing for a ${args.role.toLowerCase()} decision?`,
  ];
}
