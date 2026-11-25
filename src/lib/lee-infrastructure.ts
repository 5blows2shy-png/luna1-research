import { calculateLee, type LeeDebt } from './lee-data-center.ts';
import { calculateDevelopment, type DevelopmentInput } from './development-model.ts';

export const infrastructureDisclosure = 'Illustrative enterprise sourcing comparison, not the landlord investment case. All options serve the same phased provisioned-capacity proxy. No workload benchmark or vendor quote establishes equivalent performance. Costs exclude taxes, financing, application licenses, common application staff and residual value; no tenant rent or sale proceeds offset owned infrastructure costs.';
export const infrastructureSources = [
  { title: 'AWS EC2 On-Demand pricing components', url: 'https://aws.amazon.com/ec2/pricing/on-demand/', use: 'Compute and data transfer are separate pricing dimensions. No AWS SKU price is used as an observed quote.' },
  { title: 'Microsoft Azure pricing calculator', url: 'https://azure.microsoft.com/en-us/pricing/calculator/', use: 'Obtain a region-, configuration- and contract-specific estimate before relying on cloud cost assumptions.' },
  { title: 'EIA electricity prices by state and sector', url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a', use: 'Regional context only. State averages are not the parcel tariff. The power allowance and stress prices remain analyst assumptions.' },
] as const;
export type InfrastructureAssumptions = {
  serverKW: number; vcpuPerServer: number; ramPerVcpu: number; serverCost: number; refreshYears: number;
  storageGBPerServer: number; cloudVcpuHour: number; cloudStorageGBMonth: number; egressGBPerServerMonth: number;
  cloudEgressGB: number; cloudSupport: number; coloKWMonth: number; coloPue: number; hardwareSupport: number;
  escalation: number; cloudSetup: number; physicalSetup: number;
};
export function initialInfrastructureAssumptions(): InfrastructureAssumptions {
  return { serverKW: .5, vcpuPerServer: 64, ramPerVcpu: 4, serverCost: 12000, refreshYears: 5,
    storageGBPerServer: 2000, cloudVcpuHour: .045, cloudStorageGBMonth: .023, egressGBPerServerMonth: 500,
    cloudEgressGB: .05, cloudSupport: .05, coloKWMonth: 125, coloPue: 1.35, hardwareSupport: .10,
    escalation: .025, cloudSetup: 2_000_000, physicalSetup: 750_000 };
}
export const infrastructureOptions = ['Cloud', 'Colocation', 'Owned infrastructure'] as const;
export type InfrastructureOption = typeof infrastructureOptions[number];
export function infrastructureComparison(a: DevelopmentInput, p: InfrastructureAssumptions) {
  for (const [key, value] of Object.entries(p)) if (!Number.isFinite(value) || value < 0) throw new Error(`${key}: enter a finite nonnegative assumption.`);
  if (p.serverKW <= 0 || p.vcpuPerServer < 1 || p.ramPerVcpu <= 0 || p.coloPue < 1 || p.coloPue > 3 || p.cloudSupport > 1 || p.hardwareSupport > 1 || p.escalation > .3 || !Number.isInteger(p.refreshYears) || p.refreshYears < 1 || p.refreshYears > 20) throw new Error('Check positive server capacity, PUE (1–3), support rates (0–100%), escalation (0–30%) and whole-year refresh cycle (1–20).');
  const project = calculateDevelopment(a);
  let servers = 0;
  const cohorts: { year: number; count: number }[] = [];
  const schedule = project.rows.slice(0, project.exitYear + 1).map(row => {
    // Open/leased capacity is the common provisioned workload proxy, not idle/preleased capacity.
    const desired = Math.ceil(project.phaseRows.filter(r => r.Year === row.Year && r.MW_Available > 0).reduce((s, r) => s + r.MW_Leased, 0) * 1000 / p.serverKW);
    const additions = Math.max(0, desired - servers); servers += additions;
    if (additions > 0) cohorts.push({ year: row.Year, count: additions });
    const refresh = cohorts.reduce((n, c) => n + (row.Year > c.year && (row.Year - c.year) % p.refreshYears === 0 ? c.count : 0), 0);
    const factor = (1 + p.escalation) ** row.Year;
    const provisionedKW = servers * p.serverKW;
    const vcpuHours = servers * p.vcpuPerServer * 8760;
    const hardware = (additions + refresh) * p.serverCost * factor;
    const support = servers * p.serverCost * p.hardwareSupport * factor;
    const compute = vcpuHours * p.cloudVcpuHour * factor;
    const storage = servers * p.storageGBPerServer * 12 * p.cloudStorageGBMonth * factor;
    const egress = servers * p.egressGBPerServerMonth * 12 * p.cloudEgressGB * factor;
    return { row, additions, refresh, servers, factor, provisionedKW, vcpuHours, hardware, support, compute, storage, egress };
  });
  const annual = infrastructureOptions.flatMap(option => schedule.map(s => {
    const cloud = option === 'Cloud', owned = option === 'Owned infrastructure';
    const facility = owned ? s.row.Development_CapEx : 0;
    const hardware = cloud ? 0 : s.hardware;
    const power = cloud ? 0 : s.row.IT_Energy_kWh * (owned ? a.pue! : p.coloPue) * a.powerPrice!;
    const rent = option === 'Colocation' ? s.provisionedKW * 12 * p.coloKWMonth * s.factor : 0;
    const facilityOpex = owned ? s.row.Other_Opex : 0;
    const maintenance = owned ? s.row.Maintenance_CapEx : 0;
    const compute = cloud ? s.compute : 0, storage = cloud ? s.storage : 0, egress = cloud ? s.egress : 0;
    const support = cloud ? (compute + storage + egress) * p.cloudSupport : s.support;
    const setup = s.row.Year === 0 ? cloud ? p.cloudSetup : p.physicalSetup : 0;
    const cost = facility + hardware + power + rent + facilityOpex + maintenance + compute + storage + egress + support + setup;
    return { Option: option, Year: s.row.Year, Calendar_Year: s.row.Calendar_Year, Provisioned_Servers: s.servers,
      Added_Servers: s.additions, Refreshed_Servers: cloud ? 0 : s.refresh, Provisioned_kW: s.provisionedKW, Utilized_MW: s.row.MW_Utilized,
      vCPU_Hours: s.vcpuHours, Facility_CapEx: facility, Hardware_CapEx: hardware, Power_Cost: power, Colocation_Rent: rent,
      Facility_Opex: facilityOpex, Maintenance_CapEx: maintenance, Cloud_Compute: compute, Cloud_Storage: storage,
      Cloud_Egress: egress, Support: support, Setup_Cost: setup, Total_Cost: cost, Discounted_Cost: cost / (1 + a.discountRate!) ** s.row.Year };
  }));
  const results = infrastructureOptions.map(option => {
    const group = annual.filter(r => r.Option === option);
    const sum = (key: keyof typeof group[number]) => group.reduce((s, r) => s + Number(r[key]), 0);
    const discountedHours = group.reduce((s, r) => s + r.vCPU_Hours / (1 + a.discountRate!) ** r.Year, 0);
    return { Option: option, Total_Cost: sum('Total_Cost'), Present_Value_Cost: sum('Discounted_Cost'),
      Upfront_Cost: group[0].Total_Cost, Hardware_CapEx: sum('Hardware_CapEx'), Facility_CapEx: sum('Facility_CapEx'),
      Power_Cost: sum('Power_Cost'), PV_Cost_Per_vCPU_Hour: discountedHours > 0 ? sum('Discounted_Cost') / discountedHours : null,
      Exit_Year_Annual_Cost: group.at(-1)!.Total_Cost };
  });
  return { assumptions: p, disclosure: infrastructureDisclosure, annual, results, horizon: project.exitYear, discountRate: a.discountRate! };
}

/** Price-only stress: no revenue pass-through, volume, leverage or timing changes. */
export function leePowerSensitivity(a: DevelopmentInput, d: LeeDebt) {
  const rates = [...new Set([.05, .075, .10, .125, .15, a.powerPrice!])].sort((x, y) => x - y);
  return rates.map(rate => {
    try {
      const m = calculateLee({ ...a, powerPrice: rate }, d), exit = m.rows[m.project.exitYear];
      return { Power_Price: rate, Is_Current: Math.abs(rate - a.powerPrice!) < 1e-10, Exit_Year: m.project.exitYear,
        Exit_Facility_kWh: exit.Facility_Energy_kWh, Exit_Power_Cost: exit.Power_Cost, Exit_EBITDA: exit.EBITDA,
        Equity_IRR: m.equityIrr, Equity_NPV: m.equityNpv, Minimum_DSCR: m.minimumDscr,
        Breach_Years: m.breachYears.length, Debt_Service_Shortfall: m.shortfall, Status: 'Calculated' };
    } catch (error) {
      return { Power_Price: rate, Is_Current: Math.abs(rate - a.powerPrice!) < 1e-10, Exit_Year: a.exitYear!,
        Exit_Facility_kWh: null, Exit_Power_Cost: null, Exit_EBITDA: null, Equity_IRR: null, Equity_NPV: null,
        Minimum_DSCR: null, Breach_Years: null, Debt_Service_Shortfall: null, Status: error instanceof Error ? error.message : 'Invalid inputs' };
    }
  });
}
