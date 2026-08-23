import type { DemoBusiness } from "./types";

export const DEMO_BUSINESS_ID = "00000000-0000-4000-8000-000000000001";
export const DEMO_SEED_VERSION = 1;

const months = Array.from({ length: 12 }, (_, index) => `2025-${String(index + 9).padStart(2, "0")}-15`);

export function createHarborSupplyDemo(): DemoBusiness {
  const base = months.flatMap((date, index) => [
    { id: `sale-${index}`, date, description: `Harbor retail sales ${index + 1}`, amountCents: 5_200_000 + index * 80_000, kind: "REVENUE", category: "Sales" },
    { id: `cogs-${index}`, date, description: `Wholesale inventory ${index + 1}`, amountCents: -(2_650_000 + index * 55_000), kind: "COGS", category: "Cost of goods sold" },
    { id: `rent-${index}`, date, description: "Harbor warehouse rent", amountCents: -620_000, kind: "EXPENSE", category: "Rent" },
  ]);
  return {
    id: DEMO_BUSINESS_ID, name: "Harbor Supply Co.", industry: "Local Retail / Distribution",
    accountingMethod: "ACCRUAL", fiscalYear: "CALENDAR", isDemo: true, seedVersion: DEMO_SEED_VERSION,
    metrics: { operatingCashCents: 4_285_000, upcomingObligationsCents: 1_830_000, safeToSpendCents: 2_455_000, cashRunwayWeeks: 6.4, monthlyRevenueCents: 7_160_000, cogsCents: 3_620_000, grossProfitCents: 3_540_000, operatingExpensesCents: 2_210_000, netIncomeCents: 1_330_000, overdueReceivablesCents: 1_460_000, inventoryCostCents: 8_250_000, healthyInventoryCents: 6_030_000, slowInventoryCents: 1_340_000, deadInventoryCents: 580_000, excessInventoryCents: 300_000 },
    transactions: [...base,
      { id: "home-depot-1", date: "2026-07-03", description: "HOME DEPOT #6672", amountCents: -48_225, kind: "EXPENSE", category: "Repairs", receiptMissing: true },
      { id: "home-depot-2", date: "2026-07-04", description: "HOMEDEPOT.COM", amountCents: -48_225, kind: "EXPENSE", category: null },
      { id: "home-depot-3", date: "2026-07-06", description: "HD SUPPLY 6672", amountCents: -31_990, kind: "EXPENSE", category: null },
      { id: "duplicate-1", date: "2026-07-08", description: "NORTHSTAR FREIGHT", amountCents: -88_400, kind: "EXPENSE", category: "Freight" },
      { id: "duplicate-2", date: "2026-07-08", description: "NORTHSTAR FREIGHT", amountCents: -88_400, kind: "EXPENSE", category: "Freight", duplicateOf: "duplicate-1" },
      { id: "refund", date: "2026-07-10", description: "Customer refund", amountCents: -12_500, kind: "REFUND", category: "Sales returns" },
      { id: "transfer", date: "2026-07-12", description: "Transfer savings to operating", amountCents: 250_000, kind: "TRANSFER", category: "Transfer" },
      { id: "card-payment", date: "2026-07-14", description: "Credit card payment", amountCents: -175_000, kind: "CREDIT_CARD_PAYMENT", category: "Transfer" },
      { id: "loan-payment", date: "2026-07-15", description: "Equipment loan payment", amountCents: -92_000, kind: "LOAN_PAYMENT", category: "Loan payment" },
      { id: "owner-contribution", date: "2026-07-16", description: "Owner contribution", amountCents: 500_000, kind: "OWNER_CONTRIBUTION", category: "Equity" },
      { id: "owner-draw", date: "2026-07-18", description: "Owner draw", amountCents: -180_000, kind: "OWNER_DRAW", category: "Equity" },
      { id: "unusual", date: "2026-07-20", description: "Emergency refrigeration replacement", amountCents: -960_000, kind: "EXPENSE", category: "Equipment", receiptMissing: true },
    ],
    customers: [{ id: "customer-1", name: "Bayside Market" }, { id: "customer-2", name: "North Point Cafe" }],
    vendors: [{ id: "vendor-1", name: "Coastal Wholesale" }, { id: "vendor-2", name: "Northstar Freight" }],
    invoices: [{ id: "invoice-overdue", customerId: "customer-1", totalCents: 1_820_000, paidCents: 360_000, dueDate: "2026-07-01" }],
    bills: [{ id: "supplier-due", vendorId: "vendor-1", totalCents: 1_240_000, dueDate: "2026-08-13" }],
    inventory: [{ sku: "HS-101", status: "HEALTHY", costCents: 6_030_000 }, { sku: "HS-204", status: "SLOW", costCents: 1_340_000 }, { sku: "HS-088", status: "DEAD", costCents: 580_000 }, { sku: "HS-330", status: "EXCESS", costCents: 300_000 }, { sku: "HS-410", status: "STOCKOUT_RISK", costCents: 0 }],
  };
}

export function validateDemoFinancials(demo: DemoBusiness) {
  const m = demo.metrics;
  return m.operatingCashCents - m.upcomingObligationsCents === m.safeToSpendCents && m.monthlyRevenueCents - m.cogsCents === m.grossProfitCents && m.grossProfitCents - m.operatingExpensesCents === m.netIncomeCents && m.healthyInventoryCents + m.slowInventoryCents + m.deadInventoryCents + m.excessInventoryCents === m.inventoryCostCents;
}
