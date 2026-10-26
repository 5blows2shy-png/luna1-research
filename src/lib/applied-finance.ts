/** Hypothetical annual-period project finance model. All currencies are USD. */
export type CapexItem = { name: string; amount: number };
export type DataCenterAssumptions = {
  capex: CapexItem[];
  constructionYears: number;
  capacityMW: number;
  powerPrice: number;
  pue: number;
  revenuePerKWMonth: number;
  operatingExpenses: number;
  maintenance: number;
  staffing: number;
  cooling: number;
  network: number;
  facility: number;
  growth: number;
  discountRate: number;
  debtPercent: number;
  interestRate: number;
  life: number;
  terminalValue: number;
  utilization: number[];
  taxRate: number;
  workingCapitalPercent: number;
  maintenanceCapex: number;
  depreciablePercent: number;
  debtTerm: number;
  graceYears: number;
  amortization: "equal-principal" | "annuity" | "balloon";
  financingFeePercent: number;
  contingencyPercent: number;
  dscrThreshold: number;
};
export const defaultDataCenter: DataCenterAssumptions = {
  capex: [
    { name: "Land / Site", amount: 3000000 }, { name: "Building", amount: 8000000 },
    { name: "Electrical Infrastructure", amount: 10000000 }, { name: "UPS / Power Distribution", amount: 4000000 },
    { name: "Generators", amount: 4000000 }, { name: "Cooling", amount: 6000000 },
    { name: "Network Infrastructure", amount: 3000000 }, { name: "Racks", amount: 2000000 },
    { name: "Security", amount: 1000000 }, { name: "Construction", amount: 6000000 },
    { name: "Engineering", amount: 2000000 }, { name: "Other", amount: 1000000 },
  ],
  constructionYears: 1, capacityMW: 5, powerPrice: .08, pue: 1.4,
  revenuePerKWMonth: 250, operatingExpenses: 400000, maintenance: 300000,
  staffing: 750000, cooling: 150000, network: 200000, facility: 250000,
  growth: .02, discountRate: .10, debtPercent: .4, interestRate: .07, life: 15,
  taxRate: .25, workingCapitalPercent: .05, maintenanceCapex: 250000, depreciablePercent: .8,
  debtTerm: 10, graceYears: 1, amortization: "equal-principal",
  financingFeePercent: .02, contingencyPercent: .05, dscrThreshold: 1.2,
  terminalValue: 0, utilization: [.4, .55, .7, .82, .9],
};
export function npv(rate: number, cashFlows: number[]): number {
  if (!Number.isFinite(rate) || rate <= -1 || cashFlows.some(v => !Number.isFinite(v))) throw new Error("Invalid NPV inputs");
  return cashFlows.reduce((sum, value, year) => sum + value / (1 + rate) ** year, 0);
}
/** Unique IRR only for conventional outflows followed by inflows; otherwise unavailable. */
export function irr(cashFlows: number[]): number | null {
  const signs = cashFlows.filter(v => v !== 0).map(Math.sign);
  if (cashFlows.some(v => !Number.isFinite(v)) || signs[0] !== -1 || !signs.includes(1) || signs.slice(signs.indexOf(1)).includes(-1)) return null;
  let low = -.9999, high = 1;
  while (npv(high, cashFlows) > 0 && high < 1e6) high *= 2;
  if (!(npv(low, cashFlows) > 0 && npv(high, cashFlows) < 0)) return null;
  for (let i = 0; i < 160; i++) {
    const mid = (low + high) / 2;
    if (npv(mid, cashFlows) > 0) low = mid; else high = mid;
  }
  return (low + high) / 2;
}
/** Undiscounted fractional-year recovery, excluding any terminal disposal proceeds. */
export function payback(cashFlows: number[]): number | null {
  let balance = cashFlows[0];
  if (balance >= 0) return 0;
  for (let i = 1; i < cashFlows.length; i++) {
    const previous = balance;
    balance += cashFlows[i];
    if (balance >= 0 && cashFlows[i] > 0) return i - 1 + -previous / cashFlows[i];
  }
  return null;
}
export function validateDataCenter(a: DataCenterAssumptions): string | null {
  const values = [a.taxRate, a.workingCapitalPercent, a.maintenanceCapex, a.depreciablePercent, a.debtTerm, a.graceYears, a.financingFeePercent, a.contingencyPercent, a.dscrThreshold, a.capacityMW, a.powerPrice, a.pue, a.revenuePerKWMonth, a.operatingExpenses, a.maintenance, a.staffing, a.cooling, a.network, a.facility, a.growth, a.discountRate, a.debtPercent, a.interestRate, a.life, a.constructionYears, a.terminalValue, ...a.utilization, ...a.capex.map(c => c.amount)];
  if (values.some(v => !Number.isFinite(v) || v < 0)) return "Enter finite, nonnegative assumptions.";
  if (a.capacityMW <= 0 || a.pue < 1 || a.pue > 3 || a.discountRate > 1 || a.debtPercent > 1 || a.interestRate > 1 || a.growth > .3 || a.utilization.length !== 5 || a.utilization.some(v => v > 1)) return "Check capacity, PUE (1–3), rates, and utilization (0–100%). Revenue growth must be 0–30%.";
  if (!Number.isInteger(a.life) || a.life < 5 || a.life > 30 || !Number.isInteger(a.constructionYears) || a.constructionYears > 5) return "Use 5–30 whole operating years and 0–5 whole construction years.";
  if ([a.taxRate, a.workingCapitalPercent, a.depreciablePercent, a.financingFeePercent, a.contingencyPercent].some(v => v > 1) || a.dscrThreshold < 1 || a.dscrThreshold > 3) return "Use tax, working capital, depreciation, fee, and contingency percentages of 0–100%, and an assumed DSCR threshold of 1–3x.";
  if (!Number.isInteger(a.debtTerm) || a.debtTerm < 1 || a.debtTerm > a.life || !Number.isInteger(a.graceYears) || a.graceYears < 0 || a.graceYears >= a.debtTerm) return "Debt term must be 1–useful life whole years; operating grace must be shorter than the debt term.";
  if (!["equal-principal", "annuity", "balloon"].includes(a.amortization)) return "Choose a supported amortization method.";
  if (!a.capex.length || a.capex.some(c => !c.name.trim()) || a.capex.reduce((s, c) => s + c.amount, 0) <= 0) return "Name each CapEx category and enter a positive total project cost.";
  if (values.some(v => v > 1e12)) return "Assumptions exceed the supported model range.";
  return null;
}
export function dataCenterModel(a: DataCenterAssumptions) {
  const error = validateDataCenter(a);
  if (error) throw new Error(error);
  const capex = a.capex.reduce((sum, c) => sum + c.amount, 0);
  const contingency = capex * a.contingencyPercent;
  const developmentCost = capex + contingency;
  // Leverage applies to the development budget; fees and construction interest are sponsor-funded.
  const debt = developmentCost * a.debtPercent;
  const financingFees = debt * a.financingFeePercent;
  const constructionInterest = a.constructionYears ? debt * a.interestRate * (a.constructionYears + 1) / 2 : 0;
  const totalUses = developmentCost + financingFees + constructionInterest;
  const equity = totalUses - debt;
  const uses = [...a.capex, { name: "Contingency", amount: contingency }, { name: "Financing fees", amount: financingFees }, { name: "Construction interest", amount: constructionInterest }];
  const fixedCosts = a.operatingExpenses + a.maintenance + a.staffing + a.cooling + a.network + a.facility;
  const installments = Math.max(1, a.constructionYears);
  const initialCapex = developmentCost / installments;
  const initialDraw = debt / installments;
  const initialEquityCash = -initialCapex - financingFees + initialDraw;
  const projectFlows = [-initialCapex];
  const equityFlows = [initialEquityCash];
  const recoveryFlows = [-initialCapex];
  const amortizingYears = a.debtTerm - a.graceYears;
  const annuity = a.interestRate === 0 ? debt / amortizingYears : debt * a.interestRate / (1 - (1 + a.interestRate) ** -amortizingYears);
  let balance = initialDraw;
  let workingCapital = 0;
  const rows = Array.from({ length: a.constructionYears + a.life }, (_, index) => {
    const year = index + 1;
    const operatingYear = year - a.constructionYears;
    const active = operatingYear > 0;
    const finalYear = operatingYear === a.life;
    const utilization = active ? a.utilization[Math.min(operatingYear - 1, 4)] : 0;
    const itMW = a.capacityMW * utilization;
    const facilityMW = itMW * a.pue;
    const kwh = facilityMW * 8760 * 1000;
    const power = kwh * a.powerPrice;
    const revenue = active ? a.capacityMW * 1000 * utilization * a.revenuePerKWMonth * 12 * (1 + a.growth) ** (operatingYear - 1) : 0;
    const costs = active ? fixedCosts : 0;
    const ebitda = revenue - power - costs;
    const depreciation = active ? developmentCost * a.depreciablePercent / a.life : 0;
    const beginningDebt = balance;
    const interest = beginningDebt * a.interestRate;
    // Further draws occur at construction year-end; interest is on the opening balance.
    const debtDraw = year < a.constructionYears ? debt / installments : 0;
    const constructionCapex = year < a.constructionYears ? developmentCost / installments : 0;
    let principal = 0;
    if (active && operatingYear > a.graceYears && operatingYear <= a.debtTerm) {
      principal = a.amortization === "balloon" ? (operatingYear === a.debtTerm ? beginningDebt : 0)
        : a.amortization === "annuity" ? annuity - interest : debt / amortizingYears;
      principal = Math.max(0, Math.min(beginningDebt, principal));
      if (operatingYear === a.debtTerm) principal = beginningDebt;
    }
    balance = Math.max(0, beginningDebt + debtDraw - principal);
    const debtService = interest + principal;
    const unleveredTaxes = active ? Math.max(0, ebitda - depreciation) * a.taxRate : 0;
    const cashTaxes = active ? Math.max(0, ebitda - depreciation - interest) * a.taxRate : 0;
    const endingWorkingCapital = active ? revenue * a.workingCapitalPercent : 0;
    const changeWorkingCapital = endingWorkingCapital - workingCapital;
    workingCapital = endingWorkingCapital;
    const maintenanceCapex = active ? a.maintenanceCapex : 0;
    const cfads = ebitda - cashTaxes - changeWorkingCapital - maintenanceCapex;
    const terminal = finalYear ? a.terminalValue : 0;
    const residualBookValue = developmentCost * (1 - a.depreciablePercent);
    const disposalTax = finalYear ? Math.max(0, terminal - residualBookValue) * a.taxRate : 0;
    const workingCapitalRelease = finalYear ? workingCapital : 0;
    const exitCash = terminal - disposalTax + workingCapitalRelease;
    const coreProjectCash = ebitda - unleveredTaxes - changeWorkingCapital - maintenanceCapex - constructionCapex;
    const fcf = coreProjectCash + exitCash;
    const equityCash = cfads - debtService - constructionCapex + debtDraw + exitCash;
    const dscr = active && debtService > 1e-7 ? cfads / debtService : null;
    projectFlows.push(fcf); equityFlows.push(equityCash); recoveryFlows.push(coreProjectCash);
    return { year, operatingYear, utilization, itMW, facilityMW, kwh, power, revenue, costs,
      ebitda, operatingCash: ebitda, depreciation, unleveredTaxes, cashTaxes,
      changeWorkingCapital, workingCapital: endingWorkingCapital, workingCapitalRelease,
      maintenanceCapex, constructionCapex, cfads, beginningDebt, debtDraw, interest, principal,
      debtService, endingDebt: balance, dscr, coverageStressed: dscr !== null && dscr < a.dscrThreshold,
      terminal, disposalTax, fcf, equityCash, margin: revenue ? ebitda / revenue : null };
  });
  const coverage = rows.flatMap(r => r.dscr === null ? [] : [r.dscr]);
  const fullRevenue = a.capacityMW * 1000 * a.revenuePerKWMonth * 12;
  const fullPower = a.capacityMW * a.pue * 8760 * 1000 * a.powerPrice;
  return { capex, contingency, developmentCost, financingFees, constructionInterest, totalUses,
    totalSources: debt + equity, fundingGap: debt + equity - totalUses, uses,
    fixedCosts, debt, equity, initialCapex, initialDraw, initialEquityCash, rows, projectFlows, equityFlows,
    npv: npv(a.discountRate, projectFlows), irr: irr(projectFlows), equityIrr: irr(equityFlows), payback: payback(recoveryFlows),
    minDscr: coverage.length ? Math.min(...coverage) : null,
    averageDscr: coverage.length ? coverage.reduce((s, v) => s + v, 0) / coverage.length : null,
    stressedYears: rows.filter(r => r.coverageStressed).map(r => r.year),
    operatingShortfall: rows.filter(r => r.operatingYear > 0).reduce((s, r) => s + Math.max(0, r.debtService - r.cfads), 0),
    breakEven: fullRevenue > fullPower ? fixedCosts / (fullRevenue - fullPower) : null,
  };
}
export type DataCenterResult = ReturnType<typeof dataCenterModel>;
export type Scenario = "Base" | "Upside" | "Downside";
export function scenarioAssumptions(a: DataCenterAssumptions, scenario: Scenario): DataCenterAssumptions {
  if (scenario === "Base") return a;
  const bull = scenario === "Upside";
  const cost = bull ? .9 : 1.1;
  return { ...a, capex: a.capex.map(c => ({ ...c, amount: c.amount * cost })),
    maintenanceCapex: a.maintenanceCapex * cost, powerPrice: a.powerPrice * cost, revenuePerKWMonth: a.revenuePerKWMonth * (bull ? 1.1 : .9),
    operatingExpenses: a.operatingExpenses * cost, maintenance: a.maintenance * cost, staffing: a.staffing * cost,
    cooling: a.cooling * cost, network: a.network * cost, facility: a.facility * cost,
    utilization: a.utilization.map(v => Math.max(0, Math.min(1, v + (bull ? .1 : -.1)))),
    interestRate: Math.max(0, Math.min(1, a.interestRate + (bull ? -.01 : .01))),
    constructionYears: Math.min(5, a.constructionYears + (bull ? 0 : 1)),
  };
}
export type NonprofitMonth = {
  month: string; revenueBudget: number; revenueActual: number; revenueForecast: number;
  programBudget: number; programActual: number; adminBudget: number; adminActual: number;
  expenseForecast: number; restrictedInflows: number; restrictedUsage: number;
};
/** Entirely fictional cash-basis teaching dataset, not employer records. */
export const nonprofitMonths: NonprofitMonth[] = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  revenueBudget: 160000 + i * 2000, revenueActual: 155000 + i * 3200,
  revenueForecast: 158000 + i * 2500, programBudget: 120000,
  programActual: i === 0 ? 134500 : 115000 + i * 1700,
  adminBudget: 25000, adminActual: 24000 + i * 200, expenseForecast: 148000 + i * 1200,
  restrictedInflows: 45000 + i * 1000, restrictedUsage: 42000 + i * 1200,
}));
export function variance(actual: number, budget: number) {
  return { amount: actual - budget, percent: budget === 0 ? null : (actual - budget) / Math.abs(budget) };
}
export function nonprofitSummary(start: number, end: number) {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > 12 || start >= end) throw new Error("Invalid reporting period");
  const before = nonprofitMonths.slice(0, start);
  const months = nonprofitMonths.slice(start, end);
  const sum = (rows: NonprofitMonth[], fn: (m: NonprofitMonth) => number) => rows.reduce((s, m) => s + fn(m), 0);
  const expense = (m: NonprofitMonth) => m.programActual + m.adminActual;
  const beginningCash = 300000 + sum(before, m => m.revenueActual - expense(m));
  const beginningRestricted = 180000 + sum(before, m => m.restrictedInflows - m.restrictedUsage);
  const revenue = sum(months, m => m.revenueActual);
  const expenses = sum(months, expense);
  const inflows = sum(months, m => m.restrictedInflows);
  const usage = sum(months, m => m.restrictedUsage);
  const endingCash = beginningCash + revenue - expenses;
  const endingRestricted = beginningRestricted + inflows - usage;
  const revenueBudget = sum(months, m => m.revenueBudget);
  const expenseBudget = sum(months, m => m.programBudget + m.adminBudget);
  const forecastRevenue = sum(months, m => m.revenueForecast);
  const forecastExpenses = sum(months, m => m.expenseForecast);
  return { months, revenue, expenses, surplus: revenue - expenses, beginningCash, endingCash,
    revenueBudget, expenseBudget, forecastRevenue, forecastExpenses,
    budgetVariance: revenue - expenses - (revenueBudget - expenseBudget),
    forecastVariance: revenue - expenses - (forecastRevenue - forecastExpenses),
    restricted: { beginning: beginningRestricted, inflows, usage, ending: endingRestricted },
    unrestricted: { beginning: beginningCash - beginningRestricted, inflows: revenue - inflows, usage: expenses - usage, ending: endingCash - endingRestricted },
    programBudget: sum(months, m => m.programBudget), programActual: sum(months, m => m.programActual),
  };
}
