import { irr, npv } from "./applied-finance.ts";

export const developmentDisclosure = "For modeling practice only. The $12 million per MW assumption is illustrative and is not an estimate of any specific LightEdge, customer, facility, or real-world project.";
export const developmentConfidentiality = "This hypothetical case study was developed for educational and portfolio purposes. All financial assumptions are illustrative or derived from appropriately cited public sources. It does not use confidential employer, customer, facility, pricing, capacity, or internal financial information.";
export const developmentTitle = "10-Year Data Center Investment & Development Model";
export const developmentSlug = "ten-year-data-center-development";
export const developmentHref = `/recruiter/projects/${developmentSlug}`;
export const modelYears = Array.from({ length: 11 }, (_, i) => i);
export type Input = number | null;
export type PhaseInput = { name: string; mw: Input; availableYear: Input; preLeasing: boolean; allocation: Input[]; lease: Input[]; utilization: Input[] };
export type CostInput = { name: string; basis: "fixed" | "per-utilized-mw" | "revenue-share"; amount: Input };
export type DevelopmentInput = {
  startYear: Input; capexPerMW: Input; discountRate: Input; exitYear: Input; exitMultiple: Input; sellingCost: Input;
  revenueRate: Input; revenueUnit: "kw-month" | "kw-year" | "mw-month" | "mw-year"; revenueBasis: "leased" | "utilized";
  revenueGrowth: Input; otherRevenuePerMW: Input; pue: Input; powerPrice: Input; cashTaxRate: Input; workingCapitalRate: Input; maintenancePerMW: Input;
  phases: PhaseInput[]; categories: { name: string; share: Input }[]; costs: CostInput[];
};
export const capexCategoryNames = ["Land / Site", "Building / Shell", "Electrical Infrastructure", "Utility Interconnection", "UPS", "Generators", "Cooling Infrastructure", "Networking", "Racks / White Space", "Security", "Engineering", "Construction", "Development Costs", "Contingency", "Other / Unallocated"];
export function initialDevelopmentInput(): DevelopmentInput {
  return {
    startYear: 2026, capexPerMW: 12_000_000, discountRate: null, exitYear: 10, exitMultiple: null, sellingCost: null,
    revenueRate: null, revenueUnit: "kw-month", revenueBasis: "leased", revenueGrowth: null, otherRevenuePerMW: null,
    pue: null, powerPrice: null, cashTaxRate: null, workingCapitalRate: null, maintenancePerMW: null,
    phases: [1, 2].map(n => ({ name: `Phase ${n}`, mw: 10, availableYear: null, preLeasing: false, allocation: modelYears.map(() => null), lease: modelYears.map(() => null), utilization: modelYears.map(() => null) })),
    categories: capexCategoryNames.map((name, i) => ({ name, share: i === 14 ? 1 : 0 })),
    costs: ["Cooling service (excludes electricity)", "Facility operations", "Maintenance service", "Staffing", "Network / Connectivity", "Insurance", "Property / Facility costs", "Security", "Other operating costs"].map(name => ({ name, basis: "fixed", amount: null })),
  };
}
export type DevelopmentScenario = { name: "Base" | "Upside" | "Downside"; costFactor: number; delay: number; leaseFactor: number; revenueFactor: number; opexFactor: number; powerFactor: number; pueFactor: number; exitFactor: number; exitShift: number };
export function initialDevelopmentScenarios(): DevelopmentScenario[] {
  return (["Base", "Upside", "Downside"] as const).map(name => ({ name, costFactor: 1, delay: 0, leaseFactor: 1, revenueFactor: 1, opexFactor: 1, powerFactor: 1, pueFactor: 1, exitFactor: 1, exitShift: 0 }));
}
const finite = (v: Input): v is number => typeof v === "number" && Number.isFinite(v);
export function validateDevelopment(a: DevelopmentInput): string[] {
  const issues: string[] = [];
  const required: [string, Input, number, number][] = [
    ["Start year", a.startYear, 1900, 2200], ["CapEx per MW", a.capexPerMW, 1, 1e9], ["Discount rate", a.discountRate, 0, 1],
    ["Exit year", a.exitYear, 1, 10], ["Exit EBITDA multiple", a.exitMultiple, 0, 100], ["Selling cost", a.sellingCost, 0, 1],
    ["Revenue rate", a.revenueRate, 0, 1e9], ["Revenue escalation", a.revenueGrowth, -.5, 1], ["Other annual revenue per leased MW", a.otherRevenuePerMW, 0, 1e9],
    ["PUE", a.pue, 1, 3], ["Power price", a.powerPrice, 0, 100], ["Effective cash tax rate", a.cashTaxRate, 0, 1],
    ["Working capital share", a.workingCapitalRate, 0, 1], ["Maintenance CapEx per available MW", a.maintenancePerMW, 0, 1e9],
  ];
  for (const [label, value, min, max] of required) if (!finite(value) || value < min || value > max) issues.push(`${label}: enter a value from ${min} to ${max}.`);
  if (finite(a.startYear) && !Number.isInteger(a.startYear)) issues.push("Start year must be a whole year.");
  if (finite(a.exitYear) && !Number.isInteger(a.exitYear)) issues.push("Exit year must be a whole year.");
  if (!["kw-month", "kw-year", "mw-month", "mw-year"].includes(a.revenueUnit) || !["leased", "utilized"].includes(a.revenueBasis)) issues.push("Select a supported revenue unit and basis.");
  if (a.phases.length !== 2) issues.push("Exactly two phases are required.");
  for (const p of a.phases) {
    if (!p.name.trim() || !finite(p.mw) || p.mw <= 0 || p.mw > 1000) issues.push("Each phase needs a name and capacity greater than zero, up to 1,000 MW.");
    if (!finite(p.availableYear) || !Number.isInteger(p.availableYear) || p.availableYear < 1 || p.availableYear > 10 || (finite(a.exitYear) && p.availableYear > a.exitYear)) issues.push(`${p.name}: enter an availability year from 1 to exit year.`);
    if (p.allocation.length !== 11 || p.lease.length !== 11 || p.utilization.length !== 11) { issues.push(`${p.name}: all schedules need Year 0–10.`); continue; }
    for (const [label, series] of [["CapEx", p.allocation], ["Lease", p.lease], ["Utilization", p.utilization]] as const) if (series.some(v => !finite(v) || v < 0 || v > 1)) issues.push(`${p.name}: complete all ${label} percentages (0–100%).`);
    if (p.allocation.every(finite) && Math.abs(p.allocation.reduce<number>((s, v) => s + v!, 0) - 1) > 1e-8) issues.push(`${p.name}: CapEx allocation must equal 100%.`);
    if (finite(p.availableYear)) {
      if (p.allocation.some((v, y) => y >= p.availableYear! && (v ?? 0) > 0)) issues.push(`${p.name}: development spending must precede the first available year.`);
      if (!p.preLeasing && p.lease.some((v, y) => y < p.availableYear! && (v ?? 0) > 0)) issues.push(`${p.name}: leasing before availability requires explicit pre-leasing.`);
    }
  }
  if (!a.categories.length || a.categories.some(c => !c.name.trim() || !finite(c.share) || c.share < 0 || c.share > 1) || Math.abs(a.categories.reduce((s, c) => s + (c.share ?? 0), 0) - 1) > 1e-8) issues.push("Named CapEx category shares must total 100%.");
  if (a.costs.some(c => !c.name.trim() || !finite(c.amount) || c.amount < 0 || c.amount > (c.basis === "revenue-share" ? 1 : 1e9) || !["fixed", "per-utilized-mw", "revenue-share"].includes(c.basis))) issues.push("Complete each named operating cost; percentage costs must be 0–100%. Enter zero explicitly to exclude a cost.");
  return issues;
}
export function applyDevelopmentScenario(a: DevelopmentInput, s: DevelopmentScenario): DevelopmentInput {
  const factors = [s.costFactor, s.leaseFactor, s.revenueFactor, s.opexFactor, s.powerFactor, s.pueFactor, s.exitFactor];
  if (factors.some(v => !Number.isFinite(v) || v < 0 || v > 10) || !Number.isInteger(s.delay) || s.delay < 0 || s.delay > 10 || !Number.isInteger(s.exitShift) || Math.abs(s.exitShift) > 9) throw new Error("Scenario factors must be 0–10x; construction delay 0–10 whole years; exit shift −9 to +9 whole years.");
  if (a.phases.some(p => p.allocation.some((v, y) => (v ?? 0) > 0 && y + s.delay > 10))) throw new Error("Scenario construction spending falls outside the ten-year horizon.");
  const scale = (v: Input, k: number) => v === null ? null : v * k;
  return { ...a, capexPerMW: scale(a.capexPerMW, s.costFactor), revenueRate: scale(a.revenueRate, s.revenueFactor), otherRevenuePerMW: scale(a.otherRevenuePerMW, s.revenueFactor), powerPrice: scale(a.powerPrice, s.powerFactor), pue: scale(a.pue, s.pueFactor), exitMultiple: scale(a.exitMultiple, s.exitFactor), exitYear: a.exitYear === null ? null : a.exitYear + s.exitShift,
    maintenancePerMW: scale(a.maintenancePerMW, s.opexFactor), costs: a.costs.map(c => ({ ...c, amount: scale(c.amount, s.opexFactor) })),
    phases: a.phases.map(p => ({ ...p, availableYear: p.availableYear === null ? null : p.availableYear + s.delay,
      allocation: modelYears.map(y => y < s.delay ? 0 : p.allocation[y - s.delay]),
      lease: modelYears.map(y => y < s.delay ? 0 : p.lease[y - s.delay] === null ? null : Math.min(1, p.lease[y - s.delay]! * s.leaseFactor)),
      utilization: modelYears.map(y => y < s.delay ? 0 : p.utilization[y - s.delay]),
    })),
  };
}
export type PhaseYear = {
  Year: number; Calendar_Year: number; Phase: string; Phase_ID: number; MW_Total: number; MW_Under_Construction: number; MW_Completed: number; MW_Available: number; MW_Leased: number; MW_Utilized: number; Lease_Rate: number; Utilization_Pct: number; MW_Remaining: number;
  Revenue: number; Revenue_Growth: number | null; Revenue_Per_Available_MW: number | null; Revenue_Per_Utilized_MW: number | null;
  IT_Energy_kWh: number; Facility_Energy_kWh: number; PUE: number; Power_Cost: number; Other_Opex: number; Total_Opex: number; EBITDA: number; EBITDA_Margin: number | null;
  Cash_Taxes: number; Development_CapEx: number; Cumulative_CapEx: number; Remaining_Development_Spend: number; CapEx_Per_MW: number; Maintenance_CapEx: number; Working_Capital: number; Change_In_Working_Capital: number; Unlevered_FCF: number;
  Gross_Exit_Value: number; Exit_Costs: number; Net_Exit_Proceeds: number; Working_Capital_Release: number; Total_Cash_Flow: number;
};
export type DevelopmentYear = Omit<PhaseYear, "Phase" | "Phase_ID"> & { Cumulative_Cash_Flow: number };
export function operatingPayback(flows: number[]): number | null {
  let cumulative = 0, invested = false;
  const balances = flows.map(f => (cumulative += f));
  for (let y = 0; y < flows.length; y++) {
    if (balances[y] < 0) invested = true;
    if (invested && y > 0 && balances[y - 1] < 0 && balances[y] >= 0 && balances.slice(y).every(v => v >= 0)) return y - 1 - balances[y - 1] / flows[y];
  }
  return null;
}
export function calculateDevelopment(a: DevelopmentInput) {
  const errors = validateDevelopment(a);
  if (errors.length) throw new Error(errors.join(" "));
  const totalMW = a.phases.reduce((s, p) => s + p.mw!, 0), exitYear = a.exitYear!;
  const rateFactor = { "kw-month": 12000, "kw-year": 1000, "mw-month": 12, "mw-year": 1 }[a.revenueUnit];
  const operatingExpenses: { Year: number; Phase_ID: number; Phase: string; Category: string; Amount: number }[] = [];
  const capex: { Year: number; Calendar_Year: number; Phase_ID: number; Phase: string; Category: string; Development_CapEx: number }[] = [];
  const phaseRows: PhaseYear[] = a.phases.flatMap((p, phaseIndex) => {
    let previousWC = 0, cumulativeCapex = 0, previousRevenue = 0;
    const phaseCapex = p.mw! * a.capexPerMW!;
    const firstSpend = p.allocation.findIndex(v => v! > 0);
    return modelYears.map(y => {
      const within = y <= exitYear, open = within && y >= p.availableYear!;
      const available = open ? p.mw! : 0, lease = within ? p.lease[y]! : 0;
      const leased = within && (open || p.preLeasing) ? p.mw! * lease : 0;
      const used = open ? leased * p.utilization[y]! : 0;
      const billed = open ? a.revenueBasis === "leased" ? leased : used : 0;
      const revenue = (billed * a.revenueRate! * rateFactor + (open ? leased : 0) * a.otherRevenuePerMW!) * (1 + a.revenueGrowth!) ** Math.max(0, y - 1);
      const itEnergy = used * 1000 * 8760, facilityEnergy = itEnergy * a.pue!, power = facilityEnergy * a.powerPrice!;
      const otherCosts = a.costs.map(c => ({ Year: y, Phase_ID: phaseIndex + 1, Phase: p.name, Category: c.name, Amount: !open ? 0 : c.basis === "fixed" ? c.amount! * p.mw! / totalMW : c.basis === "per-utilized-mw" ? c.amount! * used : c.amount! * revenue }));
      operatingExpenses.push({ Year: y, Phase_ID: phaseIndex + 1, Phase: p.name, Category: "Power", Amount: power }, ...otherCosts);
      const otherOpex = otherCosts.reduce((s, c) => s + c.Amount, 0), opex = power + otherOpex, ebitda = revenue - opex;
      const development = within ? phaseCapex * p.allocation[y]! : 0;
      cumulativeCapex += development;
      capex.push(...a.categories.map(c => ({ Year: y, Calendar_Year: a.startYear! + y, Phase_ID: phaseIndex + 1, Phase: p.name, Category: c.name, Development_CapEx: development * c.share! })));
      const cashTaxes = Math.max(0, ebitda) * a.cashTaxRate!, wc = revenue * a.workingCapitalRate!;
      const deltaWC = within ? wc - previousWC : 0;
      const maintenance = available * a.maintenancePerMW!, ufcf = ebitda - cashTaxes - development - maintenance - deltaWC;
      const grossExit = y === exitYear ? Math.max(0, ebitda) * a.exitMultiple! : 0, exitCosts = grossExit * a.sellingCost!;
      const wcRelease = y === exitYear ? wc : 0, exit = grossExit - exitCosts;
      const row: PhaseYear = { Year: y, Calendar_Year: a.startYear! + y, Phase: p.name, Phase_ID: phaseIndex + 1, MW_Total: p.mw!, MW_Under_Construction: within && y >= firstSpend && y < p.availableYear! ? p.mw! : 0, MW_Completed: within && y >= p.availableYear! ? p.mw! : 0, MW_Available: available, MW_Leased: leased, MW_Utilized: used, Lease_Rate: lease, Utilization_Pct: available ? used / available : 0, MW_Remaining: available - (open ? leased : 0), Revenue: revenue, Revenue_Growth: previousRevenue > 0 && within ? revenue / previousRevenue - 1 : null, Revenue_Per_Available_MW: available ? revenue / available : null, Revenue_Per_Utilized_MW: used ? revenue / used : null, IT_Energy_kWh: itEnergy, Facility_Energy_kWh: facilityEnergy, PUE: a.pue!, Power_Cost: power, Other_Opex: otherOpex, Total_Opex: opex, EBITDA: ebitda, EBITDA_Margin: revenue ? ebitda / revenue : null, Cash_Taxes: cashTaxes, Development_CapEx: development, Cumulative_CapEx: cumulativeCapex, Remaining_Development_Spend: Math.max(0, phaseCapex - cumulativeCapex), CapEx_Per_MW: a.capexPerMW!, Maintenance_CapEx: maintenance, Working_Capital: wc, Change_In_Working_Capital: deltaWC, Unlevered_FCF: ufcf, Gross_Exit_Value: grossExit, Exit_Costs: exitCosts, Net_Exit_Proceeds: exit, Working_Capital_Release: wcRelease, Total_Cash_Flow: ufcf + exit + wcRelease };
      previousWC = wc; previousRevenue = revenue;
      return row;
    });
  });
  const exitParts = phaseRows.filter(r => r.Year === exitYear);
  const consolidatedExitEBITDA = exitParts.reduce((s, r) => s + r.EBITDA, 0);
  if (consolidatedExitEBITDA <= 0 && a.exitMultiple! > 0) throw new Error("Exit EBITDA is not positive. A positive EBITDA multiple is not a supported valuation; enter a zero multiple explicitly to model no sale proceeds.");
  const positiveEBITDA = exitParts.reduce((s, r) => s + Math.max(0, r.EBITDA), 0);
  for (const r of exitParts) {
    r.Gross_Exit_Value = positiveEBITDA ? Math.max(0, consolidatedExitEBITDA) * a.exitMultiple! * Math.max(0, r.EBITDA) / positiveEBITDA : 0;
    r.Exit_Costs = r.Gross_Exit_Value * a.sellingCost!;
    r.Net_Exit_Proceeds = r.Gross_Exit_Value - r.Exit_Costs;
    r.Total_Cash_Flow = r.Unlevered_FCF + r.Net_Exit_Proceeds + r.Working_Capital_Release;
  }
  let cumulative = 0;
  const rows: DevelopmentYear[] = modelYears.map(y => {
    const parts = phaseRows.filter(r => r.Year === y);
    const { Phase: _phase, Phase_ID: _id, ...first } = parts[0];
    void _phase; void _id;
    const result = { ...first, Cumulative_Cash_Flow: 0 };
    for (const key of Object.keys(first) as (keyof typeof first)[]) if (typeof first[key] === "number" && !["Year", "Calendar_Year", "PUE", "CapEx_Per_MW"].includes(key)) (result as Record<string, number | null>)[key] = parts.reduce((s, r) => s + (r[key] ?? 0), 0);
    result.Lease_Rate = totalMW ? result.MW_Leased / totalMW : 0;
    result.Utilization_Pct = result.MW_Available ? result.MW_Utilized / result.MW_Available : 0;
    result.EBITDA_Margin = result.Revenue ? result.EBITDA / result.Revenue : null;
    result.Revenue_Per_Available_MW = result.MW_Available ? result.Revenue / result.MW_Available : null;
    result.Revenue_Per_Utilized_MW = result.MW_Utilized ? result.Revenue / result.MW_Utilized : null;
    const prior = phaseRows.filter(r => r.Year === y - 1).reduce((s, r) => s + r.Revenue, 0);
    result.Revenue_Growth = prior > 0 && y <= exitYear ? result.Revenue / prior - 1 : null;
    cumulative += result.Total_Cash_Flow; result.Cumulative_Cash_Flow = cumulative;
    return result;
  });
  const flows = rows.slice(0, exitYear + 1).map(r => r.Total_Cash_Flow);
  const invested = -flows.reduce((s, f) => s + Math.min(0, f), 0), realized = flows.reduce((s, f) => s + Math.max(0, f), 0);
  const projectNPV = npv(a.discountRate!, flows), pvDevelopment = rows.reduce((s, r) => s + r.Development_CapEx / (1 + a.discountRate!) ** r.Year, 0);
  const exitSlope = Math.max(0, consolidatedExitEBITDA) * (1 - a.sellingCost!) / (1 + a.discountRate!) ** exitYear;
  const exitBreakEven = exitSlope > 0 ? a.exitMultiple! - projectNPV / exitSlope : null;
  const capexBreakEven = pvDevelopment > 0 ? a.capexPerMW! * (1 + projectNPV / pvDevelopment) : null;
  return { rows, phaseRows, operatingExpenses, capex, totalMW, totalCapex: totalMW * a.capexPerMW!, exitYear, npv: projectNPV, irr: irr(flows), moic: invested > 0 ? realized / invested : null, invested, realized, payback: operatingPayback(rows.slice(0, exitYear + 1).map(r => r.Unlevered_FCF)), exitValue: rows[exitYear].Net_Exit_Proceeds, breakEvenExitMultiple: exitBreakEven !== null && exitBreakEven >= 0 ? exitBreakEven : null, breakEvenCapexPerMW: capexBreakEven !== null && capexBreakEven >= 0 ? capexBreakEven : null };
}
export type DevelopmentResult = ReturnType<typeof calculateDevelopment>;
export function evaluateDevelopment(a: DevelopmentInput, scenario: DevelopmentScenario) {
  try { const inputs = applyDevelopmentScenario(a, scenario); return { name: scenario.name, inputs, result: calculateDevelopment(inputs), error: null }; }
  catch (e) { return { name: scenario.name, inputs: null, result: null, error: e instanceof Error ? e.message : "Invalid model inputs" }; }
}
export type SensitivityCell = { Metric: "IRR" | "NPV" | "MOIC"; Row_Driver: string; Column_Driver: string; Row_Value: number; Column_Value: number; Value: number | null; Status: string };
export function developmentSensitivities(a: DevelopmentInput): SensitivityCell[] {
  return (["IRR", "NPV", "MOIC"] as const).flatMap(metric => [.9, 1, 1.1].flatMap(row => [.9, 1, 1.1].map(column => {
    const s = initialDevelopmentScenarios()[0];
    if (metric === "IRR") { s.costFactor = row; s.leaseFactor = column; }
    if (metric === "NPV") { s.costFactor = row; s.exitFactor = column; }
    if (metric === "MOIC") { s.leaseFactor = row; s.exitFactor = column; }
    const evaluated = evaluateDevelopment(a, s), m = evaluated.result;
    return { Metric: metric, Row_Driver: metric === "MOIC" ? "Lease_Ramp_Factor" : "Construction_Cost_Factor", Column_Driver: metric === "IRR" ? "Lease_Ramp_Factor" : "Exit_Multiple_Factor", Row_Value: row, Column_Value: column, Value: m ? metric === "IRR" ? m.irr : metric === "NPV" ? m.npv : m.moic : null, Status: evaluated.error ?? (metric === "IRR" && m?.irr === null ? "Nonconventional or unavailable IRR" : "Calculated") };
  })));
}
