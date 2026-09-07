import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCashFlowIntelligence,
  buildRecommendations,
  buildThirteenWeekForecast,
  calculateCashRunway,
  calculateInventoryIntelligence,
  calculateSafeToSpend,
  classifyInventoryItem,
  evaluateInventoryPurchase,
  openReceivableCents,
} from "../src/lib/luna-books-intelligence.ts";

const input = {
  bankBalanceCents: 4_000_000,
  obligations: [
    { id: "payroll", label: "Payroll", amountCents: 900_000, dueDate: "2026-08-10", kind: "payroll" },
    { id: "bill", label: "Supplier", amountCents: 500_000, dueDate: "2026-08-18", kind: "bill" },
  ],
  receivables: [
    { id: "old", customer: "Customer A", totalCents: 1_000_000, paidCents: 250_000, dueDate: "2026-07-31", expectedDate: "2026-08-12" },
    { id: "future", customer: "Customer B", totalCents: 600_000, paidCents: 0, dueDate: "2026-08-20" },
  ],
  inventory: [
    { id: "healthy", name: "Healthy", supplier: "Supplier", unitCostCents: 1_000, quantityOnHand: 50, unitsSoldLast30Days: 50, daysSinceLastSale: 2, leadTimeDays: 10 },
    { id: "slow", name: "Slow", supplier: "Supplier", unitCostCents: 2_000, quantityOnHand: 20, unitsSoldLast30Days: 2, daysSinceLastSale: 65, leadTimeDays: 10 },
    { id: "dead", name: "Dead", supplier: "Supplier", unitCostCents: 3_000, quantityOnHand: 10, unitsSoldLast30Days: 0, daysSinceLastSale: 100, leadTimeDays: 10 },
    { id: "missing", name: "Missing cost", quantityOnHand: 5, unitCostCents: null, unitsSoldLast30Days: 4, daysSinceLastSale: 3 },
  ],
  settings: {
    asOfDate: "2026-08-06",
    minimumCashReserveCents: 1_000_000,
    taxReserveCents: 200_000,
    weeklyOperatingCostCents: 300_000,
    desiredRunwayWeeks: 6,
    slowMovingDays: 60,
    deadStockDays: 90,
  },
};

test("safe-to-spend cash reserves obligations, taxes, and the minimum balance", () => {
  const result = calculateSafeToSpend(input);
  assert.equal(result.reservedCents, 2_600_000);
  assert.equal(result.safeToSpendCents, 1_400_000);
  assert.equal(result.shortfallCents, 0);
});

test("cash runway uses safe-to-spend cash and integer-cent weekly burn", () => {
  const result = calculateCashRunway(input);
  assert.equal(result.runwayWeeks, 4.66);
  assert.equal(result.kind, "Forecast");
});

test("empty operating-cost data produces an explicit insufficient-data result", () => {
  const result = calculateCashRunway({ ...input, settings: { ...input.settings, weeklyOperatingCostCents: 0 } });
  assert.equal(result.runwayWeeks, null);
  assert.equal(result.confidence, "Insufficient Data");
});

test("inventory value separates healthy, slow, dead, and missing-cost records", () => {
  const result = calculateInventoryIntelligence(input);
  assert.equal(result.totalCostCents, 120_000);
  assert.equal(result.slowMovingCents, 40_000);
  assert.equal(result.deadStockCents, 30_000);
  assert.deepEqual(result.missingCostItems, ["Missing cost"]);
  assert.equal(result.confidence, "Low");
});

test("inventory intelligence does not require supplier data and labels missing activity", () => {
  assert.equal(classifyInventoryItem({ id: "x", name: "X", unitCostCents: 100, quantityOnHand: 3, unitsSoldLast30Days: 0, daysSinceLastSale: null }, input.settings), "Insufficient data");
});

test("reorder affordability degrades from safe to caution and high risk", () => {
  assert.equal(evaluateInventoryPurchase(input, 100_000).status, "Caution");
  assert.equal(evaluateInventoryPurchase(input, 1_500_000).status, "High Risk");
});

test("partial payments reduce open receivables and refund values do not create AR", () => {
  assert.equal(openReceivableCents(input.receivables[0]), 750_000);
  assert.equal(openReceivableCents({ id: "refund", customer: "Customer", totalCents: -20_000, paidCents: 0, dueDate: "2026-08-01" }), 0);
});

test("overdue receivables and upcoming bills drive transparent recommendation priority", () => {
  const recommendations = buildRecommendations(input);
  assert.equal(recommendations[0].id, "collect-overdue");
  assert.equal(recommendations[0].urgency, "Today");
  assert.ok(recommendations[0].evidence.some((value) => value.includes("$7,500.00")));
  assert.ok(recommendations.length <= 3);
});

test("13-week scenarios preserve weekly cash arithmetic and collection assumptions", () => {
  const conservative = buildThirteenWeekForecast(input, "Conservative");
  const optimistic = buildThirteenWeekForecast(input, "Optimistic");
  assert.equal(conservative.length, 13);
  assert.equal(optimistic.length, 13);
  assert.ok(optimistic[0].endingCashCents >= conservative[0].endingCashCents);
  for (const week of optimistic) assert.equal(Number.isSafeInteger(week.endingCashCents), true);
});

test("empty business data returns zero values without fabricated recommendations", () => {
  const empty = {
    ...input,
    bankBalanceCents: 0,
    obligations: [],
    receivables: [],
    inventory: [],
    settings: { ...input.settings, weeklyOperatingCostCents: 0 },
  };
  const result = buildCashFlowIntelligence(empty);
  assert.equal(result.inventory.totalCostCents, 0);
  assert.equal(result.runway.runwayWeeks, null);
  assert.deepEqual(result.recommendations, []);
});

test("money fields reject unsafe fractional values", () => {
  assert.throws(() => calculateSafeToSpend({ ...input, bankBalanceCents: 1.5 }), /integer number of cents/);
});
