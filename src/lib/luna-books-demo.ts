export type DemoValueKind = "Recorded" | "Calculated" | "Recommendation";
export type ForecastScenario = "Expected" | "Conservative" | "Optimistic";

export type TutorialScene = {
  id: string;
  navLabel: string;
  title: string;
  message: string;
  durationSeconds: number;
};

const cashBalance = 42_850;
const reservedObligations = 18_300;

export const lunaBooksDemo = Object.freeze({
  meta: {
    id: "harbor-supply-demo-v1",
    mode: "isolated-demo",
    company: "Harbor Supply Co.",
    industry: "Local retail / distribution",
    accountingMethod: "Accrual",
    fiscalYear: "January–December",
    connectedAccounts: 3,
    teamMembers: 2,
    lastUpdated: "August 6, 2026 · 9:00 AM",
  },
  cash: {
    balance: cashBalance,
    reservedObligations,
    safeToSpend: cashBalance - reservedObligations,
    runwayWeeks: 6.4,
    reservePreferenceWeeks: 6,
    obligations: [
      { label: "Northstar Wholesale", amount: 12_400, timing: "Due next week" },
      { label: "Payroll reserve", amount: 4_200, timing: "Due in 9 days" },
      { label: "Rent and utilities", amount: 1_700, timing: "Due in 12 days" },
    ],
  },
  transactions: [
    { date: "Aug 05", vendor: "Coastal Office Supply", amount: -486.2, category: "Office Supplies", state: "Suggested", signal: "Receipt matched" },
    { date: "Aug 04", vendor: "Northstar Wholesale", amount: -7_240, category: "Inventory Purchases", state: "Recorded", signal: "Vendor history" },
    { date: "Aug 03", vendor: "Harbor Fuel & Fleet", amount: -318.44, category: "Vehicle Expense", state: "Review", signal: "Unusual amount" },
    { date: "Aug 03", vendor: "Northstar Wholesale", amount: -7_240, category: "Inventory Purchases", state: "Review", signal: "Possible duplicate" },
  ],
  receivables: [
    { customer: "Seaport Café", amount: 6_800, daysOverdue: 31, priority: "Follow up first" },
    { customer: "Bayview Market", amount: 4_900, daysOverdue: 18, priority: "Follow up this week" },
    { customer: "Pier 8 Goods", amount: 2_900, daysOverdue: 9, priority: "Monitor" },
  ],
  inventory: {
    total: 82_500,
    healthy: 60_300,
    slowMoving: 13_400,
    deadStock: 5_800,
    excess: 3_000,
    recoverableCash: 12_100,
    highlightedSku: "Dockside Lantern — Product B",
    reason: "Only 4 units sold in 90 days; 38 units remain on hand.",
  },
  affordability: {
    purchase: 12_000,
    cashBefore: cashBalance,
    cashAfter: cashBalance - 12_000,
    runwayBefore: 6.4,
    runwayAfter: 4.8,
    estimatedMargin: 32,
    payback: "10–12 weeks",
    risk: "CAUTION",
  },
  recommendations: [
    { action: "Collect Seaport Café invoice", why: "It is the oldest and largest overdue invoice.", evidence: "$6,800 · 31 days overdue", impact: "+$6,800 potential cash", urgency: "This week", confidence: "High" },
    { action: "Delay Product B reorder", why: "Existing units are selling slowly.", evidence: "38 units on hand · 4 sold in 90 days", impact: "$4,200 cash preserved", urgency: "Before next PO", confidence: "High" },
    { action: "Reorder Product C", why: "Current sales pace points to a near-term stockout.", evidence: "12 days of supply remaining", impact: "$3,600 revenue protected", urgency: "Within 3 days", confidence: "Medium" },
  ],
  forecast: {
    Expected: [42_850, 37_900, 44_100, 38_600, 33_900, 39_800, 35_200, 41_400, 37_100, 34_600, 40_900, 38_200, 43_700],
    Conservative: [42_850, 36_300, 38_700, 32_100, 27_400, 29_900, 24_700, 28_800, 23_600, 20_900, 24_100, 21_600, 25_300],
    Optimistic: [42_850, 40_200, 48_500, 44_100, 41_300, 49_200, 46_800, 54_100, 50_600, 49_400, 57_200, 55_900, 62_400],
  } satisfies Record<ForecastScenario, readonly number[]>,
});

export const tutorialScenes: readonly TutorialScene[] = Object.freeze([
  { id: "welcome", navLabel: "Dashboard", title: "Welcome to Luna Books", message: "Your books tell you what happened. Luna helps you understand what needs attention next.", durationSeconds: 17 },
  { id: "profile", navLabel: "Business Profile", title: "One private workspace for each business", message: "Review the business setup, connected accounts, and permission-based team access.", durationSeconds: 16 },
  { id: "transactions", navLabel: "Transactions", title: "Turn transaction activity into a review queue", message: "Luna organizes imports, category suggestions, duplicates, unusual activity, and receipt matches.", durationSeconds: 22 },
  { id: "cash", navLabel: "Cash Position", title: "Bank balance is not safe-to-spend cash", message: "Luna subtracts known upcoming obligations to estimate what is available.", durationSeconds: 20 },
  { id: "runway", navLabel: "Cash Runway", title: "See how long current cash may support the business", message: "Runway is an estimate based on current cash, bills, payroll, recurring expenses, receivables, and inventory plans.", durationSeconds: 18 },
  { id: "receivables", navLabel: "Receivables", title: "Prioritize the collections that matter most", message: "Luna highlights a suggested next action without contacting a customer automatically.", durationSeconds: 20 },
  { id: "bills", navLabel: "Bills", title: "See obligations before they pressure cash", message: "The supplier payment due next week is already included in Luna’s cash outlook.", durationSeconds: 16 },
  { id: "inventory", navLabel: "Inventory", title: "Understand cash tied up in inventory", message: "Inventory is grouped by movement so potential recoverable cash is easier to see.", durationSeconds: 21 },
  { id: "afford", navLabel: "Can I Afford This?", title: "Test a decision before committing cash", message: "Based on the information entered, this purchase may reduce runway below the preferred reserve.", durationSeconds: 22 },
  { id: "forecast", navLabel: "13-Week Forecast", title: "Look ahead across the next 13 weeks", message: "Compare expected, conservative, and optimistic estimates. Forecasts are not guarantees.", durationSeconds: 22 },
  { id: "actions", navLabel: "Recommended Actions", title: "Focus on the top three decisions", message: "Each recommendation traces back to structured records and calculations—not invented financial numbers.", durationSeconds: 22 },
  { id: "reports", navLabel: "Reports & Access", title: "Reports, QuickBooks, and accountant access", message: "Review financial reports, connection status, and a permission-based invitation preview—without sending anything.", durationSeconds: 24 },
]);

export function sumAmounts<T extends { amount: number }>(rows: readonly T[]) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

export function getNextSceneIndex(index: number) {
  return Math.min(index + 1, tutorialScenes.length - 1);
}

export function getPreviousSceneIndex(index: number) {
  return Math.max(index - 1, 0);
}
