/** Deterministic educational simulation. No provider pricing or employer data. */
export const finopsDisclosure = 'All financial figures, cloud-resource assumptions, workloads, budgets, utilization rates and savings estimates are simulated for educational and portfolio purposes only. They do not represent actual LightEdge Solutions, AWS, Microsoft Azure, customer or employer financial or operating data.';
export const finopsTitle = 'Enterprise Cloud Cost Optimization & FinOps Dashboard';
export const finopsHref = '/recruiter/projects/cloud-finops';
export const departments = ['Infrastructure', 'Engineering', 'Data', 'Security', 'Corporate IT'] as const;
export const scenarioNames = ['Baseline', 'Moderate', 'Aggressive'] as const;
export type Scenario = typeof scenarioNames[number];
export const policies = {
  Baseline: { rightsizing: 0, utilizationCeiling: .70, idleRemoval: 0, storage: 0, coverage: 0, discount: 0 },
  Moderate: { rightsizing: .20, utilizationCeiling: .70, idleRemoval: .75, storage: .15, coverage: .50, discount: .22 },
  Aggressive: { rightsizing: .35, utilizationCeiling: .80, idleRemoval: 1, storage: .30, coverage: .80, discount: .30 },
} satisfies Record<Scenario, Record<string, number>>;
export type SpendRow = {
  Month: string; Provider: string; Department: string; CostCenter: string; Workload: string; Service: string; Region: string;
  UsageQuantity: number; UsageUnit: string; Utilization: number; CapacityUnits: number; UsedCapacity: number;
  WorkloadUnits: number; OnDemandCost: number; Budget: number; ActualCost: number; SharedCost: number;
  ReservedEligible: boolean; RightsizingOpportunity: boolean; Idle: boolean; StorageOpportunity: boolean;
};
export type ScenarioRow = SpendRow & { Scenario: Scenario; OptimizedDirectCost: number; AllocatedCost: number; BaselineAllocatedCost: number; Savings: number; IdleSavings: number; RightsizingSavings: number; StorageSavings: number; ReservationSavings: number; RemainingCapacity: number; OptimizedUtilization: number; ReservedCostBasis: number; EligibleCostBasis: number; CapacityBuffer: number };
export const sum = <T,>(rows: T[], value: (row: T) => number) => rows.reduce((total, row) => total + value(row), 0);
export function generateSpend(): SpendRow[] {
  const rows: SpendRow[] = [];
  for (let month = 1; month <= 12; month++) for (let w = 0; w < 10; w++) {
    const provider = w % 2 ? 'Azure' : 'AWS';
    for (const [s, service] of ['Compute', 'Database', 'Storage', 'Network'].entries()) {
      const idle = w === 3 && service === 'Compute';
      const utilization = idle ? 0 : .34 + (w % 4) * .07 + month * .004;
      const capacity = service === 'Compute' ? 100 + w * 10 : 0;
      const raw = [3000, 1900, 1200, 700][s] * (1 + w * .04) * (1 + (month - 1) * .012) * (month === 9 && w === 4 ? 1.25 : 1);
      rows.push({ Month: `2026-${String(month).padStart(2, '0')}`, Provider: provider, Department: departments[Math.floor(w / 2)], CostCenter: `CC-${100 + Math.floor(w / 2)}`, Workload: `${departments[Math.floor(w / 2)]} ${w % 2 ? 'sandbox' : 'production'}`, Service: service, Region: provider === 'AWS' ? 'us-east-1' : 'eastus', UsageQuantity: service === 'Storage' ? 12000 + 100 * w : service === 'Network' ? 4000 + 100 * w : 720 * (10 + w), UsageUnit: service === 'Storage' ? 'GB-month' : service === 'Network' ? 'GB transferred' : 'instance-hours', Utilization: utilization, CapacityUnits: capacity, UsedCapacity: capacity * utilization, WorkloadUnits: service === 'Compute' ? (10000 + w * 1100) * (1 + month * .01) : 0, OnDemandCost: raw, ActualCost: raw, Budget: [3000, 1900, 1200, 700][s] * (1 + w * .04) * (1 + (month - 1) * .004), SharedCost: 0, ReservedEligible: w % 2 === 0 && ['Compute', 'Database'].includes(service), RightsizingOpportunity: service === 'Compute' && !idle && utilization < .55, Idle: idle, StorageOpportunity: service === 'Storage' });
    }
  }
  const scale = 1104000 / sum(rows, r => r.ActualCost);
  const budgetScale = 1164000 / sum(rows, r => r.Budget);
  for (const row of rows) { row.ActualCost *= scale; row.OnDemandCost = row.ActualCost; row.Budget *= budgetScale; }
  for (let month = 1; month <= 12; month++) {
    const group = rows.filter(r => Number(r.Month.slice(-2)) === month);
    const total = sum(group, r => r.ActualCost);
    for (const row of group) { row.SharedCost = 8000 * row.ActualCost / total; }
  }
  return rows;
}
export function optimize(row: SpendRow, scenario: Scenario): ScenarioRow {
  const p = policies[scenario];
  const idleSavings = row.Idle ? row.ActualCost * p.idleRemoval : 0;
  const reduction = row.RightsizingOpportunity ? Math.min(p.rightsizing, Math.max(0, 1 - row.Utilization / p.utilizationCeiling)) : 0;
  const rightsizingSavings = (row.ActualCost - idleSavings) * reduction;
  const storageSavings = row.StorageOpportunity ? (row.ActualCost - idleSavings - rightsizingSavings) * p.storage : 0;
  const remainingCost = row.ActualCost - idleSavings - rightsizingSavings - storageSavings;
  const eligible = row.ReservedEligible ? remainingCost : 0;
  const reservedBasis = eligible * p.coverage;
  const reservationSavings = reservedBasis * p.discount;
  const optimizedDirectCost = remainingCost - reservationSavings;
  const remainingCapacity = row.CapacityUnits * (row.Idle ? 1 - p.idleRemoval : 1 - reduction);
  const optimizedUtilization = remainingCapacity > 0 ? row.UsedCapacity / remainingCapacity : 0;
  return { ...row, Scenario: scenario, OptimizedDirectCost: optimizedDirectCost, AllocatedCost: optimizedDirectCost + row.SharedCost, BaselineAllocatedCost: row.ActualCost + row.SharedCost, Savings: row.ActualCost - optimizedDirectCost, IdleSavings: idleSavings, RightsizingSavings: rightsizingSavings, StorageSavings: storageSavings, ReservationSavings: reservationSavings, RemainingCapacity: remainingCapacity, OptimizedUtilization: optimizedUtilization, ReservedCostBasis: reservedBasis, EligibleCostBasis: eligible, CapacityBuffer: 1 - optimizedUtilization };
}
export function summarize(rows: ScenarioRow[]) {
  const spend = sum(rows, r => r.AllocatedCost), baseline = sum(rows, r => r.BaselineAllocatedCost), budget = sum(rows, r => r.Budget);
  const capacity = sum(rows, r => r.RemainingCapacity), units = sum(rows, r => r.WorkloadUnits);
  const utilization = capacity ? sum(rows, r => r.UsedCapacity) / capacity : 0;
  const eligible = sum(rows, r => r.EligibleCostBasis);
  return { spend, baseline, budget, variance: spend - budget, variancePercent: budget ? (spend - budget) / budget : 0, savings: baseline - spend, savingsPercent: baseline ? (baseline - spend) / baseline : 0, utilization, buffer: 1 - utilization, minimumBuffer: Math.min(1, ...rows.filter(r => r.RemainingCapacity > 0).map(r => r.CapacityBuffer)), coverage: eligible ? sum(rows, r => r.ReservedCostBasis) / eligible : 0, costPerUnit: units ? spend / units : 0, units };
}
export type ForecastRow = { Month: string; Provider: string; Department: string; Workload: string; Scenario: Scenario; ForecastCost: number; ForecastBudget: number };
/** Forward 12 months, anchored to selected month's exit cost; no future observations used. */
export function forecast(rows: ScenarioRow[], asOf = '2026-12', growth = .012): ForecastRow[] {
  if (!/^2026-(0[1-9]|1[0-2])$/.test(asOf)) throw new Error('Choose a month in the simulated history.');
  if (!Number.isFinite(growth) || growth < -.1 || growth > .1) throw new Error('Monthly growth must be between -10% and 10%.');
  const groups = new Map<string, ScenarioRow[]>();
  for (const row of rows.filter(r => r.Month === asOf)) {
    const key = `${row.Provider}|${row.Workload}|${row.Scenario}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return Array.from(groups.values()).flatMap(group => Array.from({ length: 12 }, (_, index) => {
    const first = group[0], step = index + 1, date = new Date(`${asOf}-01T00:00:00Z`); date.setUTCMonth(date.getUTCMonth() + step);
    return { Month: date.toISOString().slice(0, 7), Provider: first.Provider, Department: first.Department, Workload: first.Workload, Scenario: first.Scenario, ForecastCost: sum(group, r => r.OptimizedDirectCost) * (1 + growth) ** step + sum(group, r => r.SharedCost), ForecastBudget: sum(group, r => r.Budget) * 1.004 ** step };
  }));
}
export function finopsData() { const history = generateSpend(); const facts = scenarioNames.flatMap(s => history.map(r => optimize(r, s))); return { history, facts, forecast: forecast(facts), policies }; }
