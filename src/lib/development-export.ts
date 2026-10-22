import { calculateDevelopment, developmentConfidentiality, developmentDisclosure, developmentSensitivities, developmentTitle, evaluateDevelopment, type DevelopmentInput, type DevelopmentScenario } from "./development-model.ts";

type FlatRow = Record<string, string | number | boolean | null>;
export function developmentExport(inputs: DevelopmentInput, scenarios: DevelopmentScenario[]) {
  const tables: Record<string, FlatRow[]> = {};
  const assumptionRows: FlatRow[] = [];
  function flatten(value: unknown, path: string) {
    if (typeof value === "object" && value !== null) for (const [key, child] of Object.entries(value)) flatten(child, path ? `${path}.${key}` : key);
    else assumptionRows.push({ Parameter: path, Value: value as string | number | boolean | null, Classification: path === "capexPerMW" && value === 12000000 ? "ILLUSTRATIVE ASSUMPTION" : "USER INPUT", Source: "User-entered hypothetical model; no market-data feed" });
  }
  flatten(inputs, "");
  tables.Project_Assumptions = assumptionRows;
  tables.Scenario_Assumptions = scenarios.map(s => Object.fromEntries(Object.entries(s).map(([key, value]) => [key, typeof value === "number" && !Number.isFinite(value) ? null : value])));
  tables.DIM_DATE = Array.from({ length: 11 }, (_, y) => ({ Year: y, Calendar_Year: inputs.startYear! + y, Period: y === 0 ? "Year 0 / Development" : `Year ${y}` }));
  tables.DIM_PHASE = inputs.phases.map((p, i) => ({ Phase_ID: i + 1, Phase: p.name, MW: p.mw }));
  tables.DIM_SCENARIO = scenarios.map(s => ({ Scenario: s.name }));
  for (const name of ["Yearly_Financials", "Development_CapEx", "Capacity_Leaseup", "Revenue", "Operating_Expenses", "Power_Economics", "Unlevered_FCF", "Investment_Returns", "Scenario_Results", "Sensitivity_Results", "FACT_FINANCIALS"]) tables[name] = [];
  const statuses: FlatRow[] = [];
  // An incomplete base input is never exported as calculated zeroes.
  calculateDevelopment(inputs);
  for (const scenario of scenarios) {
    const evaluation = evaluateDevelopment(inputs, scenario);
    const r = evaluation.result;
    statuses.push({ Scenario: scenario.name, Status: r ? "Calculated" : "Invalid assumptions", Detail: evaluation.error });
    if (!r) continue;
    const withScenario = (row: object): FlatRow => ({ ...row, Scenario: scenario.name });
    tables.Yearly_Financials.push(...r.rows.map(withScenario));
    tables.FACT_FINANCIALS.push(...r.phaseRows.map(withScenario));
    tables.Development_CapEx.push(...r.capex.map(withScenario));
    tables.Capacity_Leaseup.push(...r.phaseRows.map(p => withScenario({ Year: p.Year, Phase_ID: p.Phase_ID, MW_Under_Construction: p.MW_Under_Construction, MW_Completed: p.MW_Completed, MW_Available: p.MW_Available, MW_Leased: p.MW_Leased, MW_Utilized: p.MW_Utilized, Utilization_Pct: p.Utilization_Pct, Lease_Rate: p.Lease_Rate, MW_Remaining: p.MW_Remaining })));
    tables.Revenue.push(...r.phaseRows.map(p => withScenario({ Year: p.Year, Phase_ID: p.Phase_ID, Revenue: p.Revenue, Revenue_Growth: p.Revenue_Growth, Revenue_Per_Available_MW: p.Revenue_Per_Available_MW, Revenue_Per_Utilized_MW: p.Revenue_Per_Utilized_MW })));
    tables.Operating_Expenses.push(...r.operatingExpenses.map(withScenario));
    tables.Power_Economics.push(...r.phaseRows.map(p => withScenario({ Year: p.Year, Phase_ID: p.Phase_ID, MW_Utilized: p.MW_Utilized, IT_Energy_kWh: p.IT_Energy_kWh, Facility_Energy_kWh: p.Facility_Energy_kWh, PUE: p.PUE, Power_Cost: p.Power_Cost })));
    tables.Unlevered_FCF.push(...r.phaseRows.map(p => withScenario({ Year: p.Year, Phase_ID: p.Phase_ID, EBITDA: p.EBITDA, Cash_Taxes: p.Cash_Taxes, Development_CapEx: p.Development_CapEx, Maintenance_CapEx: p.Maintenance_CapEx, Change_In_Working_Capital: p.Change_In_Working_Capital, Unlevered_FCF: p.Unlevered_FCF, Net_Exit_Proceeds: p.Net_Exit_Proceeds, Working_Capital_Release: p.Working_Capital_Release, Total_Cash_Flow: p.Total_Cash_Flow })));
    const summary = withScenario({ Exit_Year: r.exitYear, Total_MW: r.totalMW, NPV: r.npv, IRR: r.irr, MOIC: r.moic, Payback: r.payback, Total_Invested_Capital: r.invested, Total_Value_Realized: r.realized, Exit_Value: r.exitValue, Total_CapEx: r.totalCapex, Revenue: r.rows[r.exitYear].Revenue, EBITDA: r.rows[r.exitYear].EBITDA, EBITDA_Margin: r.rows[r.exitYear].EBITDA_Margin, Unlevered_FCF: r.rows.reduce((s, y) => s + y.Unlevered_FCF, 0) });
    tables.Investment_Returns.push(summary); tables.Scenario_Results.push(summary);
  }
  tables.Scenario_Status = statuses;
  tables.Sensitivity_Results = developmentSensitivities(inputs).map(row => ({ ...row, Scenario: "Base" }));
  tables.FACT_CAPEX = tables.Development_CapEx;
  tables.FACT_CAPACITY = tables.Capacity_Leaseup;
  tables.FACT_RETURNS = tables.Investment_Returns;
  tables.FACT_SENSITIVITY = tables.Sensitivity_Results;
  return { schemaVersion: "1.0", title: developmentTitle, disclosure: developmentDisclosure, confidentiality: developmentConfidentiality, currency: "USD", horizon: "Year 0 plus ten annual periods; after-exit activity is zero", assumptions: inputs, tables };
}
/** Neutralize spreadsheet formula prefixes in text without altering numeric negatives. */
export function rowsToCSV(rows: FlatRow[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (value: FlatRow[string]) => {
    let text = value === null ? "" : String(value);
    if (typeof value === "string" && /^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return [keys.map(escape).join(","), ...rows.map(row => keys.map(key => escape(row[key] ?? null)).join(","))].join("\r\n");
}
