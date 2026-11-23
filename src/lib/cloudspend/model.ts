/** CloudSpend uses an intentionally bounded FOCUS cost/usage subset, not a compliance claim. */
export const providers = ['AWS', 'Azure', 'VMware'] as const;
export type Provider = typeof providers[number];
export const dimensions = ['Department', 'Project', 'Application', 'CostCenter', 'Customer'] as const;
export type Dimension = typeof dimensions[number];
export type Basis = 'BilledCost' | 'EffectiveCost';
export type CostRow = Record<Dimension, string> & {
  Date: string; ProviderName: Provider; ServiceCategory: string; ServiceName: string;
  ResourceId: string; BilledCost: number; EffectiveCost: number; BillingCurrency: 'USD';
  ConsumedQuantity: number | null; ConsumedUnit: string;
};
export type Dataset = { rows: CostRow[]; through: string; start: string; source: 'demo' | 'import'; label: string };
export const total = (rows: CostRow[], basis: Basis) => rows.reduce((n, r) => n + r[basis], 0);
export function nextMonth(month: string, step = 1) {
  const date = new Date(`${month}-01T00:00:00Z`); date.setUTCMonth(date.getUTCMonth() + step); return date.toISOString().slice(0, 7);
}
export function daysInMonth(month: string) { return new Date(Date.parse(`${nextMonth(month)}-01T00:00:00Z`) - 86400000).getUTCDate(); }
export function dateRange(start: string, end: string) {
  const result: string[] = [];
  for (let time = Date.parse(`${start}T00:00:00Z`); time <= Date.parse(`${end}T00:00:00Z`); time += 86400000) result.push(new Date(time).toISOString().slice(0, 10));
  return result;
}
export function groupCosts(rows: CostRow[], field: keyof CostRow, basis: Basis) {
  const groups = new Map<string, number>();
  for (const row of rows) { const key = String(row[field] || 'Unallocated'); groups.set(key, (groups.get(key) ?? 0) + row[basis]); }
  const denominator = total(rows, basis);
  return [...groups].map(([name, cost]) => ({ name, cost, share: denominator > 0 ? cost / denominator : null })).sort((a, b) => b.cost - a.cost);
}
export function period(rows: CostRow[], month: string, lastDay = 31) { return rows.filter(r => r.Date.startsWith(month) && Number(r.Date.slice(-2)) <= lastDay); }
export function overview(dataset: Dataset, rows: CostRow[], month: string, basis: Basis) {
  const monthEnd = `${month}-${daysInMonth(month)}`;
  const end = dataset.through < monthEnd ? dataset.through : monthEnd;
  const elapsed = end.startsWith(month) ? Number(end.slice(-2)) : 0;
  const current = period(rows, month, elapsed), previousMonth = nextMonth(month, -1);
  const previous = period(rows, previousMonth);
  const comparable = period(rows, previousMonth, Math.min(elapsed, daysInMonth(previousMonth)));
  const actual = total(current, basis), previousCost = total(previous, basis), priorComparable = total(comparable, basis);
  const completePrior = dataset.start <= `${previousMonth}-01` && dataset.through >= `${previousMonth}-${daysInMonth(previousMonth)}`;
  const covered = dataset.start <= `${month}-01` && elapsed > 0;
  const monthEndForecast = covered ? actual / elapsed * daysInMonth(month) : null;
  return { current, previous, actual, previousCost: completePrior ? previousCost : null, previousMonth, elapsed, covered,
    monthEndForecast, change: completePrior && covered && priorComparable > 0 ? (actual - priorComparable) / priorComparable : null,
    partial: elapsed < daysInMonth(month) };
}
export function forecast(base: number | null, month: string, growth: number, savings: number) {
  if (!Number.isFinite(growth) || growth < -.2 || growth > .5 || !Number.isFinite(savings) || savings < 0 || savings > .5) throw new Error('Growth must be -20% to 50%; expected savings must be 0% to 50%.');
  return Array.from({ length: 3 }, (_, i) => {
    const gross = base === null ? null : base * (1 + growth) ** (i + 1);
    return { month: nextMonth(month, i + 1), gross, savings: gross === null ? null : Math.max(0, gross) * savings, net: gross === null ? null : gross - Math.max(0, gross) * savings };
  });
}
export type Anomaly = { id: string; date: string; provider: string; category: string; expected: number; actual: number; delta: number; percent: number; signal: string; usageChange: number | null };
/** Daily cost vs trailing seven calendar days; no future observations enter baseline. */
export function anomalies(dataset: Dataset, rows: CostRow[], month: string, basis: Basis): Anomaly[] {
  const groups = new Map<string, Map<string, CostRow[]>>();
  for (const row of rows) {
    const key = `${row.ProviderName}|${row.ServiceCategory}`;
    if (!groups.has(key)) groups.set(key, new Map());
    const group = groups.get(key)!; group.set(row.Date, [...(group.get(row.Date) ?? []), row]);
  }
  const results: Anomaly[] = [];
  for (const [key, days] of groups) for (const [date, current] of days) {
    if (!date.startsWith(month)) continue;
    const start = new Date(Date.parse(`${date}T00:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10);
    if (start < dataset.start) continue;
    const history = dateRange(start, new Date(Date.parse(`${date}T00:00:00Z`) - 86400000).toISOString().slice(0, 10));
    // Require observed records on all baseline days; missing billing is not treated as zero.
    if (history.some(d => !days.has(d))) continue;
    const historical = history.map(d => days.get(d)!);
    const costs = historical.map(group => total(group, basis));
    const expected = costs.reduce((a, b) => a + b, 0) / 7;
    const deviation = Math.sqrt(costs.reduce((s, c) => s + (c - expected) ** 2, 0) / 7);
    const actual = total(current, basis), delta = actual - expected;
    if (expected <= 0 || delta < Math.max(100, expected * .35, deviation * 3)) continue;
    const all = [...historical.flat(), ...current], units = new Set(all.map(r => r.ConsumedUnit));
    let usageChange: number | null = null;
    if (units.size === 1 && !units.has('') && all.every(r => r.ConsumedQuantity !== null)) {
      const baseline = historical.flat().reduce((s, r) => s + r.ConsumedQuantity!, 0) / 7;
      if (baseline > 0) usageChange = current.reduce((s, r) => s + r.ConsumedQuantity!, 0) / baseline - 1;
    }
    const [provider, category] = key.split('|');
    results.push({ id: `${key}|${date}|${basis}`, date, provider, category, expected, actual, delta, percent: delta / expected, usageChange,
      signal: category === 'Storage' && usageChange !== null && usageChange > .25 ? 'Storage usage and cost increase' : `${category} cost increase` });
  }
  return results.sort((a, b) => b.delta - a.delta);
}

export type VM = {
  id: string; provider: Provider; department: string; vcpu: number; ram: number; cpuAvg: number; cpuP95: number; cpuPeak: number;
  memoryAvg: number; memoryP95: number; memoryPeak: number; days: number; coverage: number; minimumCpu: number; minimumRam: number;
  latency: number; latencySlo: number; memoryPressure: boolean; peakIops: number; targetIops: number; cpuPrice: number; ramPrice: number;
  fixedPrice: number; cpuTrend: number[]; memoryTrend: number[]; critical: boolean;
};
export function rightsize(vm: VM) {
  const cpu = vm.vcpu / 2, ram = vm.ram / 2;
  const reasons: string[] = [];
  if (vm.days < 30 || vm.coverage < .95) reasons.push('Need 30 days with ≥95% telemetry coverage');
  if (vm.cpuPeak * 2 > .8 || vm.cpuP95 * 2 > .7) reasons.push('CPU peak or p95 exceeds target headroom');
  if (vm.memoryPeak * 2 > .8 || vm.memoryP95 * 2 > .7 || vm.memoryPressure) reasons.push('Memory demand or pressure blocks reduction');
  if (cpu < vm.minimumCpu || ram < vm.minimumRam) reasons.push('Below workload minimum CPU or RAM');
  if (vm.latency > vm.latencySlo || vm.peakIops > vm.targetIops * .8) reasons.push('Latency or storage I/O safeguard failed');
  const current = vm.vcpu * vm.cpuPrice + vm.ram * vm.ramPrice + vm.fixedPrice;
  const target = cpu * vm.cpuPrice + ram * vm.ramPrice + vm.fixedPrice;
  return { cpu, ram, current, target, eligible: reasons.length === 0, savings: reasons.length ? 0 : current - target, reasons,
    action: reasons.length ? 'Keep current size' : vm.critical ? 'Review in staging' : 'Candidate for controlled trial' };
}
