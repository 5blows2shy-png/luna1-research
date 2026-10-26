import { dataCenterModel, scenarioAssumptions, validateDataCenter, type DataCenterAssumptions, type DataCenterResult, type Scenario } from "./applied-finance.ts";

export const financeScenarios: Scenario[] = ["Base", "Upside", "Downside"];
export const coverageRatio = (value: number | null) => value === null ? "N/A" : `${value.toFixed(2)}x`;
export function scenarioModels(assumptions: DataCenterAssumptions) {
  return financeScenarios.map(name => {
    const inputs = scenarioAssumptions(assumptions, name);
    return { name, inputs, model: validateDataCenter(inputs) ? null : dataCenterModel(inputs) };
  });
}
export function financeSensitivities(a: DataCenterAssumptions) {
  const evaluate = (inputs: DataCenterAssumptions) => validateDataCenter(inputs) ? null : dataCenterModel(inputs);
  return {
    equity: [.7, .8, .9].map(utilization => ({ utilization, values: [.9, 1, 1.1].map(cost => evaluate({ ...a, utilization: Array(5).fill(utilization), capex: a.capex.map(c => ({ ...c, amount: c.amount * cost })) })?.equityIrr ?? null) })),
    coverage: [.7, .8, .9].map(utilization => ({ utilization, values: [.8, 1, 1.2].map(power => evaluate({ ...a, utilization: Array(5).fill(utilization), powerPrice: a.powerPrice * power })?.minDscr ?? null) })),
    npv: [.9, 1, 1.1].map(revenue => ({ revenue, values: [.8, 1, 1.2].map(power => evaluate({ ...a, revenuePerKWMonth: a.revenuePerKWMonth * revenue, powerPrice: a.powerPrice * power })?.npv ?? null) })),
  };
}
/** Shared serializable schedule contract for future workbook/PDF export adapters. */
export function projectFinanceExport(a: DataCenterAssumptions, m: DataCenterResult) {
  return {
    schemaVersion: 2,
    title: "Data Center Infrastructure Project Finance Case",
    classification: "HYPOTHETICAL PROJECT FINANCE CASE STUDY",
    status: "Completed",
    assumptions: a,
    sources: [{ name: "Debt", amount: m.debt }, { name: "Sponsor equity", amount: m.equity }],
    uses: m.uses,
    initialCashFlow: { year: 0, projectCash: -m.initialCapex, debtDraw: m.initialDraw, fees: m.financingFees, equityCash: m.initialEquityCash },
    annualSchedule: m.rows,
    returns: { npv: m.npv, projectIrr: m.irr, equityIrr: m.equityIrr, payback: m.payback, minimumDscr: m.minDscr, averageDscr: m.averageDscr },
    disclosures: "Hypothetical inputs; no employer data. Annual simplified tax and debt model; no lender commitment or personalized financial advice.",
  };
}
