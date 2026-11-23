import { dateRange, daysInMonth, providers, rightsize, type CostRow, type Dataset, type VM } from './model.ts';

export const demoThrough = '2026-11-21';
export const demoVMs: VM[] = Array.from({ length: 9 }, (_, i) => {
  const profile = i % 3, cpuAvg = [.12, .16, .42][profile], memoryAvg = [.18, .58, .40][profile];
  return { id: ['checkout-api', 'analytics-worker', 'customer-portal'][profile] + `-${providers[Math.floor(i / 3)].toLowerCase()}`,
    provider: providers[Math.floor(i / 3)], department: i === 8 ? '' : ['Engineering', 'Data', 'Customer Operations'][profile],
    vcpu: 16, ram: 64, cpuAvg, cpuP95: [.22, .28, .68][profile], cpuPeak: [.32, .36, .88][profile],
    memoryAvg, memoryP95: [.27, .72, .65][profile], memoryPeak: [.36, .9, .82][profile], days: i === 6 ? 14 : 30,
    coverage: i === 6 ? .83 : .99, minimumCpu: 4, minimumRam: 16, latency: 38, latencySlo: 100,
    memoryPressure: profile === 1, peakIops: profile === 2 ? 4400 : 1100, targetIops: 5000,
    cpuPrice: [52, 49, 31][Math.floor(i / 3)], ramPrice: [8, 8.5, 6][Math.floor(i / 3)], fixedPrice: 260,
    cpuTrend: Array.from({ length: i === 6 ? 14 : 30 }, (_, day) => cpuAvg + Math.sin(day * .7 + i) * .035),
    memoryTrend: Array.from({ length: i === 6 ? 14 : 30 }, (_, day) => memoryAvg + Math.sin(day * .3 + i) * .025), critical: profile === 0 };
});

export function demoDataset(): Dataset {
  const rows: CostRow[] = [];
  for (const date of dateRange('2026-06-01', demoThrough)) for (const [index, vm] of demoVMs.entries()) {
    const month = date.slice(0, 7), day = Number(date.slice(-2)), growth = 1 + (Number(month.slice(-2)) - 6) * .025;
    for (const [serviceIndex, category] of ['Compute', 'Storage', 'Networking', 'Databases'].entries()) {
      const normal = [rightsize(vm).current, 820 + index * 52, 410 + index * 18, 1280 + index * 40][serviceIndex] / daysInMonth(month);
      const multiplier = date === '2026-11-18' && category === 'Compute' && vm.provider === 'AWS' ? 5 :
        day >= 19 && month === '2026-11' && category === 'Storage' && vm.provider === 'Azure' ? 4.5 : 1;
      const billed = Math.round(normal * growth * (1 + Math.sin(day * .6 + index) * .04) * multiplier * 100) / 100;
      rows.push({ Date: date, ProviderName: vm.provider, ServiceCategory: category,
        ServiceName: `${vm.provider} ${category}`, ResourceId: vm.id, Department: index === 8 ? '' : vm.department,
        Project: index === 7 ? '' : ['Digital commerce', 'Data platform', 'Customer experience'][index % 3],
        Application: ['Checkout', 'Insights', 'Portal'][index % 3], CostCenter: index === 8 ? '' : `CC-${100 + index % 3}`,
        Customer: index % 3 === 2 ? 'Customer group A' : 'Internal',
        BilledCost: billed, EffectiveCost: Math.round(billed * (category === 'Compute' && vm.provider !== 'VMware' ? .91 : 1) * 100) / 100,
        BillingCurrency: 'USD', ConsumedQuantity: Math.round(([24, 1100 + index * 80, 35, 24][serviceIndex]) * multiplier * 100) / 100,
        ConsumedUnit: category === 'Storage' ? 'GB-day' : category === 'Networking' ? 'GB' : 'hours' });
    }
  }
  return { rows, start: '2026-06-01', through: demoThrough, source: 'demo', label: 'Demo · AWS, Azure & VMware' };
}

/** Independently specified planning budget, not actual spend multiplied by a factor. */
export function demoBudget(rows: CostRow[], month: string) {
  const resources = new Map<string, CostRow>();
  for (const row of rows.filter(r => r.Date.startsWith(month))) resources.set(`${row.ProviderName}|${row.ResourceId}|${row.ServiceCategory}`, row);
  return [...resources.values()].reduce((sum, r) => sum + ({ Compute: 1850, Storage: 1250, Networking: 650, Databases: 1750 }[r.ServiceCategory] ?? 0), 0);
}
