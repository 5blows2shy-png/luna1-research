export type MoneyCents = number;
export type Confidence = "High" | "Medium" | "Low" | "Insufficient Data";
export type EvidenceKind = "Recorded" | "Calculated" | "Forecast" | "Recommendation";
export type Urgency = "Today" | "This Week" | "This Month" | "Monitor";

export type CashObligation = {
  id: string;
  label: string;
  amountCents: MoneyCents;
  dueDate: string;
  kind: "bill" | "payroll" | "tax" | "debt" | "inventory" | "operating";
};

export type Receivable = {
  id: string;
  customer: string;
  totalCents: MoneyCents;
  paidCents: MoneyCents;
  dueDate: string;
  expectedDate?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  supplier?: string;
  unitCostCents: MoneyCents | null;
  unitPriceCents?: MoneyCents | null;
  quantityOnHand: number;
  unitsSoldLast30Days: number;
  daysSinceLastSale: number | null;
  leadTimeDays?: number | null;
  minimumOrderQuantity?: number | null;
};

export type IntelligenceSettings = {
  asOfDate: string;
  minimumCashReserveCents: MoneyCents;
  taxReserveCents: MoneyCents;
  weeklyOperatingCostCents: MoneyCents;
  desiredRunwayWeeks: number;
  slowMovingDays: number;
  deadStockDays: number;
};

export type CashIntelligenceInput = {
  bankBalanceCents: MoneyCents;
  obligations: CashObligation[];
  receivables: Receivable[];
  inventory: InventoryItem[];
  settings: IntelligenceSettings;
};

export type InventoryClassification =
  | "Fast moving"
  | "Healthy"
  | "Slow moving"
  | "Dead stock"
  | "Overstocked"
  | "Stockout risk"
  | "Insufficient data";

export type DecisionRecommendation = {
  id: string;
  action: string;
  reason: string;
  evidence: string[];
  estimatedImpact: string;
  urgency: Urgency;
  confidence: Confidence;
  assumptions: string[];
  priorityScore: number;
  kind: EvidenceKind;
};

const DAY_MS = 86_400_000;
const FORECAST_WEEKS = 13;

function assertCents(value: number, field: string) {
  if (!Number.isSafeInteger(value)) throw new Error(`${field} must be an integer number of cents.`);
}

function dateValue(value: string) {
  const result = new Date(`${value}T00:00:00Z`).getTime();
  if (!Number.isFinite(result)) throw new Error(`Invalid date: ${value}`);
  return result;
}

function daysBetween(from: string, to: string) {
  return Math.floor((dateValue(to) - dateValue(from)) / DAY_MS);
}

function withinDays(asOfDate: string, dueDate: string, days: number) {
  const difference = daysBetween(asOfDate, dueDate);
  return difference >= 0 && difference <= days;
}

export function formatMoney(cents: MoneyCents) {
  assertCents(cents, "Money");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function openReceivableCents(receivable: Receivable) {
  assertCents(receivable.totalCents, "Receivable total");
  assertCents(receivable.paidCents, "Receivable paid amount");
  return Math.max(0, Math.max(0, receivable.totalCents) - Math.max(0, receivable.paidCents));
}

export function calculateSafeToSpend(input: CashIntelligenceInput) {
  assertCents(input.bankBalanceCents, "Bank balance");
  assertCents(input.settings.minimumCashReserveCents, "Minimum cash reserve");
  assertCents(input.settings.taxReserveCents, "Tax reserve");
  const upcomingObligationsCents = input.obligations
    .filter((item) => withinDays(input.settings.asOfDate, item.dueDate, 30))
    .reduce((sum, item) => {
      assertCents(item.amountCents, "Obligation amount");
      return sum + Math.max(0, item.amountCents);
    }, 0);
  const reservedCents = upcomingObligationsCents
    + Math.max(0, input.settings.minimumCashReserveCents)
    + Math.max(0, input.settings.taxReserveCents);
  return {
    bankBalanceCents: input.bankBalanceCents,
    upcomingObligationsCents,
    minimumCashReserveCents: input.settings.minimumCashReserveCents,
    taxReserveCents: input.settings.taxReserveCents,
    reservedCents,
    safeToSpendCents: Math.max(0, input.bankBalanceCents - reservedCents),
    shortfallCents: Math.max(0, reservedCents - input.bankBalanceCents),
    kind: "Calculated" as const,
  };
}

export function calculateCashRunway(input: CashIntelligenceInput) {
  const safe = calculateSafeToSpend(input);
  assertCents(input.settings.weeklyOperatingCostCents, "Weekly operating cost");
  const weeklyBurnCents = Math.max(0, input.settings.weeklyOperatingCostCents);
  if (!weeklyBurnCents) {
    return {
      runwayWeeks: null,
      weeklyBurnCents,
      availableAfterObligationsCents: safe.safeToSpendCents,
      confidence: "Insufficient Data" as const,
      explanation: "Weekly operating cost is required to estimate cash runway.",
      kind: "Forecast" as const,
    };
  }
  const runwayHundredths = Math.floor((safe.safeToSpendCents * 100) / weeklyBurnCents);
  return {
    runwayWeeks: runwayHundredths / 100,
    weeklyBurnCents,
    availableAfterObligationsCents: safe.safeToSpendCents,
    confidence: input.obligations.length ? "Medium" as const : "Low" as const,
    explanation: "Estimated safe-to-spend cash divided by recorded weekly operating cost.",
    kind: "Forecast" as const,
  };
}

export function classifyInventoryItem(
  item: InventoryItem,
  settings: Pick<IntelligenceSettings, "slowMovingDays" | "deadStockDays">,
): InventoryClassification {
  if (item.quantityOnHand < 0 || item.unitsSoldLast30Days < 0) return "Insufficient data";
  if (item.quantityOnHand === 0) return "Stockout risk";
  if (item.daysSinceLastSale === null) return "Insufficient data";
  if (item.daysSinceLastSale >= settings.deadStockDays) return "Dead stock";
  const dailyVelocity = item.unitsSoldLast30Days / 30;
  const daysOfSupply = dailyVelocity > 0 ? item.quantityOnHand / dailyVelocity : Number.POSITIVE_INFINITY;
  if (item.leadTimeDays && daysOfSupply <= item.leadTimeDays) return "Stockout risk";
  if (item.daysSinceLastSale >= settings.slowMovingDays) return "Slow moving";
  if (daysOfSupply > 120) return "Overstocked";
  if (daysOfSupply <= 30) return "Fast moving";
  return "Healthy";
}

export function calculateInventoryIntelligence(input: CashIntelligenceInput) {
  const byClassification = new Map<InventoryClassification, number>();
  const missingCostItems: string[] = [];
  const rows = input.inventory.map((item) => {
    const classification = classifyInventoryItem(item, input.settings);
    const quantity = Math.max(0, Math.floor(item.quantityOnHand));
    const costValueCents = item.unitCostCents === null
      ? null
      : Math.max(0, item.unitCostCents) * quantity;
    if (costValueCents === null) missingCostItems.push(item.name);
    else byClassification.set(classification, (byClassification.get(classification) ?? 0) + costValueCents);
    return { ...item, classification, costValueCents };
  });
  const totalCostCents = [...byClassification.values()].reduce((sum, value) => sum + value, 0);
  const slowMovingCents = byClassification.get("Slow moving") ?? 0;
  const deadStockCents = byClassification.get("Dead stock") ?? 0;
  const excessCents = byClassification.get("Overstocked") ?? 0;
  return {
    rows,
    totalCostCents,
    healthyCents: (byClassification.get("Healthy") ?? 0) + (byClassification.get("Fast moving") ?? 0) + (byClassification.get("Stockout risk") ?? 0),
    slowMovingCents,
    deadStockCents,
    excessCents,
    potentialRecoverableCashCents: slowMovingCents + deadStockCents + excessCents,
    missingCostItems,
    confidence: missingCostItems.length ? "Low" as const : "High" as const,
    kind: "Calculated" as const,
  };
}

type ForecastScenario = "Conservative" | "Expected" | "Optimistic";

const collectionRate: Record<ForecastScenario, number> = {
  Conservative: 7000,
  Expected: 9000,
  Optimistic: 10000,
};

export function buildThirteenWeekForecast(
  input: CashIntelligenceInput,
  scenario: ForecastScenario,
) {
  let endingCashCents = input.bankBalanceCents;
  return Array.from({ length: FORECAST_WEEKS }, (_, index) => {
    const startDay = index * 7;
    const endDay = startDay + 6;
    const receivableCents = input.receivables
      .filter((item) => {
        const expected = item.expectedDate ?? item.dueDate;
        const day = daysBetween(input.settings.asOfDate, expected);
        return day >= startDay && day <= endDay;
      })
      .reduce((sum, item) => sum + Math.round(openReceivableCents(item) * collectionRate[scenario] / 10_000), 0);
    const obligationCents = input.obligations
      .filter((item) => {
        const day = daysBetween(input.settings.asOfDate, item.dueDate);
        return day >= startDay && day <= endDay;
      })
      .reduce((sum, item) => sum + Math.max(0, item.amountCents), 0);
    const startingCashCents = endingCashCents;
    const operatingCents = Math.max(0, input.settings.weeklyOperatingCostCents);
    endingCashCents = startingCashCents + receivableCents - obligationCents - operatingCents;
    return {
      week: index + 1,
      startingCashCents,
      customerPaymentsCents: receivableCents,
      obligationsCents: obligationCents,
      operatingCents,
      endingCashCents,
      scenario,
      kind: "Forecast" as const,
    };
  });
}

export function evaluateInventoryPurchase(
  input: CashIntelligenceInput,
  purchaseAmountCents: MoneyCents,
) {
  assertCents(purchaseAmountCents, "Purchase amount");
  const safe = calculateSafeToSpend(input);
  const runway = calculateCashRunway(input);
  const cashAfterCents = input.bankBalanceCents - Math.max(0, purchaseAmountCents);
  const safeAfterCents = Math.max(0, safe.safeToSpendCents - Math.max(0, purchaseAmountCents));
  const runwayAfterWeeks = runway.weeklyBurnCents
    ? Math.floor((safeAfterCents * 100) / runway.weeklyBurnCents) / 100
    : null;
  const status = runwayAfterWeeks === null
    ? "Insufficient Data"
    : purchaseAmountCents > safe.safeToSpendCents
      ? "High Risk"
      : runwayAfterWeeks < input.settings.desiredRunwayWeeks
        ? "Caution"
        : "Safe";
  return {
    status,
    cashBeforeCents: input.bankBalanceCents,
    cashAfterCents,
    safeToSpendBeforeCents: safe.safeToSpendCents,
    runwayBeforeWeeks: runway.runwayWeeks,
    runwayAfterWeeks,
    kind: "Forecast" as const,
    explanation: "Compares the proposed purchase with recorded cash, 30-day obligations, reserves, and weekly operating cost.",
  };
}

export function buildRecommendations(input: CashIntelligenceInput): DecisionRecommendation[] {
  const safe = calculateSafeToSpend(input);
  const runway = calculateCashRunway(input);
  const inventory = calculateInventoryIntelligence(input);
  const overdue = input.receivables.filter(
    (item) => daysBetween(input.settings.asOfDate, item.dueDate) < 0 && openReceivableCents(item) > 0,
  );
  const overdueCents = overdue.reduce((sum, item) => sum + openReceivableCents(item), 0);
  const dueSoon = input.obligations.filter((item) => withinDays(input.settings.asOfDate, item.dueDate, 7));
  const dueSoonCents = dueSoon.reduce((sum, item) => sum + Math.max(0, item.amountCents), 0);
  const recommendations: DecisionRecommendation[] = [];

  if (overdueCents > 0) recommendations.push({
    id: "collect-overdue",
    action: `Follow up on ${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"}.`,
    reason: "Recorded customer balances are past due and could improve near-term cash availability.",
    evidence: [`Open overdue balance: ${formatMoney(overdueCents)}`, ...overdue.slice(0, 2).map((item) => `${item.customer}: ${formatMoney(openReceivableCents(item))}`)],
    estimatedImpact: `Potential cash recovery of up to ${formatMoney(overdueCents)}; collection timing is not guaranteed.`,
    urgency: "Today",
    confidence: "High",
    assumptions: ["Open balances and due dates are current.", "Collection is not assumed in safe-to-spend cash."],
    priorityScore: 95,
    kind: "Recommendation",
  });
  if (runway.runwayWeeks !== null && runway.runwayWeeks < input.settings.desiredRunwayWeeks) recommendations.push({
    id: "protect-runway",
    action: "Review discretionary spending before making new commitments.",
    reason: "Estimated runway is below the business's preferred minimum.",
    evidence: [`Estimated runway: ${runway.runwayWeeks.toFixed(1)} weeks`, `Preferred minimum: ${input.settings.desiredRunwayWeeks.toFixed(1)} weeks`, `Estimated safe-to-spend cash: ${formatMoney(safe.safeToSpendCents)}`],
    estimatedImpact: "Preserving cash may reduce the risk of falling below known obligations and reserves.",
    urgency: "This Week",
    confidence: runway.confidence,
    assumptions: [runway.explanation, "No unrecorded obligations are included."],
    priorityScore: 90,
    kind: "Recommendation",
  });
  if (dueSoonCents > 0) recommendations.push({
    id: "review-obligations",
    action: "Review this week's scheduled obligations and payment timing.",
    reason: `${dueSoon.length} recorded obligation${dueSoon.length === 1 ? " is" : "s are"} due within seven days.`,
    evidence: [`Due within seven days: ${formatMoney(dueSoonCents)}`, ...dueSoon.slice(0, 2).map((item) => `${item.label}: ${formatMoney(item.amountCents)}`)],
    estimatedImpact: `Protects visibility over ${formatMoney(dueSoonCents)} of near-term cash requirements.`,
    urgency: "This Week",
    confidence: "High",
    assumptions: ["Recorded due dates and unpaid amounts are current."],
    priorityScore: 85,
    kind: "Recommendation",
  });
  if (inventory.potentialRecoverableCashCents > 0) recommendations.push({
    id: "review-inventory",
    action: "Review slow-moving, dead, and excess inventory before reordering.",
    reason: "Some recorded inventory cost is tied up in items with weak recent movement or excess supply.",
    evidence: [`Estimated affected inventory cost: ${formatMoney(inventory.potentialRecoverableCashCents)}`, `Slow moving: ${formatMoney(inventory.slowMovingCents)}`, `Dead stock: ${formatMoney(inventory.deadStockCents)}`],
    estimatedImpact: `${formatMoney(inventory.potentialRecoverableCashCents)} is an estimated review opportunity, not guaranteed recoverable cash.`,
    urgency: "This Month",
    confidence: inventory.confidence,
    assumptions: [`Slow moving: ${input.settings.slowMovingDays}+ days; dead stock: ${input.settings.deadStockDays}+ days.`, "Unit costs and recent sales activity are accurate."],
    priorityScore: 75,
    kind: "Recommendation",
  });
  return recommendations.sort((left, right) => right.priorityScore - left.priorityScore).slice(0, 3);
}

export function buildCashFlowIntelligence(input: CashIntelligenceInput) {
  return {
    safeToSpend: calculateSafeToSpend(input),
    runway: calculateCashRunway(input),
    inventory: calculateInventoryIntelligence(input),
    overdueReceivableCents: input.receivables
      .filter((item) => daysBetween(input.settings.asOfDate, item.dueDate) < 0)
      .reduce((sum, item) => sum + openReceivableCents(item), 0),
    upcomingBillsCents: input.obligations
      .filter((item) => withinDays(input.settings.asOfDate, item.dueDate, 14))
      .reduce((sum, item) => sum + Math.max(0, item.amountCents), 0),
    recommendations: buildRecommendations(input),
    forecasts: {
      Conservative: buildThirteenWeekForecast(input, "Conservative"),
      Expected: buildThirteenWeekForecast(input, "Expected"),
      Optimistic: buildThirteenWeekForecast(input, "Optimistic"),
    },
  };
}
