import { type DataCenterAssumptions, type DataCenterResult } from "@/lib/applied-finance";
import { coverageRatio, financeSensitivities, scenarioModels } from "@/lib/project-finance-report";
import { FinancialTable, Metrics, money, percent } from "./financial-display";
import styles from "./project.module.css";

export function SourcesUses({ model: m }: { model: DataCenterResult }) {
  return <>
    <p>Debt funds the assumed share of the development budget, including contingency. Sponsor equity is the balancing source and funds fees and construction interest; it is not a financing commitment. Operating working capital and recurring reinvestment are funded from operating cash or additional sponsor contributions.</p>
    <div className={styles.twoCol}>
      <FinancialTable caption="Uses · development and financing budget" headers={["Use", "USD"]} rows={[...m.uses.map(c => [c.name, money(c.amount)]), ["Total uses", money(m.totalUses)]]} />
      <div><FinancialTable caption="Sources · modeled funding commitments" headers={["Source", "USD", "All-in share"]} rows={[["Debt", money(m.debt), percent(m.debt / m.totalUses)], ["Sponsor equity", money(m.equity), percent(m.equity / m.totalUses)], ["Total sources", money(m.totalSources), "100.0%"]]} /><Metrics items={[["Funding gap / surplus", money(m.fundingGap)]]} /><p>Balanced by sponsor equity. A zero gap does not establish sponsor liquidity or lender approval.</p></div>
    </div>
  </>;
}
export function DebtSchedules({ model: m, assumptions: a }: { model: DataCenterResult; assumptions: DataCenterAssumptions }) {
  return <>
    <Metrics items={[["Minimum operating DSCR", coverageRatio(m.minDscr)], ["Average operating DSCR", coverageRatio(m.averageDscr)], ["Assumed coverage threshold", coverageRatio(a.dscrThreshold)], ["Periods below assumption", String(m.stressedYears.length)]]} />
    <p>DSCR = CFADS ÷ (cash interest + principal). The {coverageRatio(a.dscrThreshold)} threshold is a user assumption, not a lender covenant. Minimum and average include only operating years with debt service; the average is arithmetic. Construction coverage and debt-free years are N/A. Exit proceeds and working-capital release are excluded from CFADS and DSCR.</p>
    <FinancialTable caption="CFADS bridge · annual USD; tax expense includes the modeled interest deduction" headers={["Year", "Revenue", "Power + other OpEx", "EBITDA", "Cash taxes", "Δ working capital", "Maintenance CapEx", "CFADS"]} rows={m.rows.map(r => [r.year, money(r.revenue), money(r.power + r.costs), money(r.ebitda), money(r.cashTaxes), money(r.changeWorkingCapital), money(r.maintenanceCapex), money(r.cfads)])} />
    <FinancialTable caption="Debt service schedule · draws occur at time zero and subsequent construction year-ends" headers={["Year", "Beginning debt", "Debt draw", "Interest", "Principal", "Debt service", "Ending debt", "DSCR", "Coverage status"]} rows={[["0", money(0), money(m.initialDraw), money(0), money(0), money(0), money(m.initialDraw), "N/A", "Initial funding"], ...m.rows.map(r => [r.year, money(r.beginningDebt), money(r.debtDraw), money(r.interest), money(r.principal), money(r.debtService), money(r.endingDebt), coverageRatio(r.dscr), r.dscr === null ? r.operatingYear <= 0 ? "Sponsor-funded construction" : "No debt service" : r.dscr < 1 ? "Cash shortfall · <1.00x" : r.coverageStressed ? "Below assumed threshold" : "Meets assumption"])]} />
  </>;
}
export function ScenarioSchedule({ assumptions }: { assumptions: DataCenterAssumptions }) {
  return <>
    <p>Upside: utilization +10 points, capacity pricing +10%, CapEx / power / fixed costs / maintenance CapEx −10%, interest −1 point. Downside reverses those changes and adds one construction year. Utilization and interest are bounded at 0–100%; construction at five years. Inputs are illustrative overlays on the editable base case.</p>
    <FinancialTable caption="Scenario comparison · average annual operating EBITDA / CFADS, minimum operating DSCR, and life-of-project returns" headers={["Case", "Avg. EBITDA", "Avg. CFADS", "Min. DSCR", "NPV", "Project IRR", "Equity IRR"]} rows={scenarioModels(assumptions).map(({ name, model: m }) => {
      if (!m) return [name, "Invalid inputs", "—", "—", "—", "—", "—"];
      const operating = m.rows.filter(r => r.operatingYear > 0);
      return [name, money(operating.reduce((s,r) => s + r.ebitda,0) / operating.length), money(operating.reduce((s,r) => s + r.cfads,0) / operating.length), coverageRatio(m.minDscr), money(m.npv), percent(m.irr), percent(m.equityIrr)];
    })} />
  </>;
}
export function SensitivitySchedules({ assumptions, compact = false }: { assumptions: DataCenterAssumptions; compact?: boolean }) {
  const tables = financeSensitivities(assumptions);
  const coverage = <FinancialTable caption="Minimum operating DSCR vs. constant utilization / power cost" headers={["Utilization", "Power −20%", "Base power", "Power +20%"]} rows={tables.coverage.map(r => [percent(r.utilization), ...r.values.map(coverageRatio)])} />;
  const npv = <FinancialTable caption="NPV vs. capacity pricing / power cost · base utilization ramp retained" headers={["Revenue price", "Power −20%", "Base power", "Power +20%"]} rows={tables.npv.map(r => [percent(r.revenue), ...r.values.map(v => v === null ? "N/A" : money(v))])} />;
  return <>
    <p>Sensitivities use base assumptions independently of the selected scenario. Utilization rows replace the entire ramp with a constant level. Construction cost scales all development CapEx; fees, contingency, and debt funding recalculate. N/A means no conventional IRR or no debt-service period.</p>
    <FinancialTable caption="Equity IRR vs. constant utilization / construction cost" headers={["Utilization", "Cost −10%", "Base cost", "Cost +10%"]} rows={tables.equity.map(r => [percent(r.utilization), ...r.values.map(percent)])} />
    {!compact && <details><summary>Debt coverage and NPV sensitivities</summary>{coverage}{npv}</details>}
  </>;
}
export function FinanceAssessment({ model: m, assumptions: a }: { model: DataCenterResult; assumptions: DataCenterAssumptions }) {
  return <div className={styles.twoCol}>
    <div><h3>Project economics</h3><p>NPV of {money(m.npv)} at {percent(a.discountRate)} is {m.npv >= 0 ? "nonnegative" : "negative"}. Project IRR is {percent(m.irr)} and equity IRR is {percent(m.equityIrr)}. N/A indicates that a conventional unique IRR is not available.</p>
    <h3>Debt capacity & coverage</h3><p>Modeled debt is {money(m.debt)}. {m.minDscr === null ? "No operating debt service is modeled." : `Minimum coverage is ${coverageRatio(m.minDscr)}, with ${m.stressedYears.length} operating periods below the assumed ${coverageRatio(a.dscrThreshold)} threshold.`} This tests the selected debt amount; it is not optimized debt sizing.</p><p>{m.operatingShortfall > 0 ? `Operating funding shortfalls after debt service total ${money(m.operatingShortfall)} before exit cash. Additional sponsor support or restructuring would be needed in those periods.` : "Operating CFADS covers modeled debt service in every operating period."}</p>
    <h3>Key return drivers</h3><p>Utilization, capacity pricing, delivered power cost, PUE, development cost, construction timing, and repayment profile.</p>
    <h3>Break-even conditions</h3><p>{m.breakEven === null || m.breakEven > 1 ? "First-year EBITDA break-even is not feasible at full utilization." : `First-year EBITDA break-even utilization is ${percent(m.breakEven)}.`} This excludes taxes, reinvestment, working capital, debt service, and recovery of invested capital.</p></div>
    <div><h3>Key credit risks</h3><p>Uncontracted demand, customer concentration, grid delays, energy-price exposure, construction overruns, refinancing or balloon risk, and sponsor liquidity. The model assumes scheduled payments continue; it does not simulate default remedies.</p>
    <h3>Downside protection</h3><p>The budget includes {money(m.contingency)} of assumed contingency. Contracted revenue, power hedges, completion guarantees, liquidity reserves, and covenant protections are diligence requirements, not protections asserted to exist.</p>
    <h3>What could change the investment case?</h3><p>Executed contracts, independently verified CapEx, a monthly draw schedule, tax diligence, replacement costs, asset-sale evidence, and lender terms could change cash generation and debt capacity.</p>
    <h3>Project finance assessment</h3><p>{m.minDscr === null ? "No operating debt service is modeled; credit coverage cannot be assessed." : m.minDscr < 1 ? "Modeled operating cash does not cover all scheduled debt payments." : m.stressedYears.length ? "Debt service is covered, but the assumed coverage buffer is not maintained throughout the operating schedule." : "The selected structure meets the modeled coverage assumption."} {m.npv < 0 ? "Project economics also fall below the assumed required return." : "Nonnegative project NPV alone does not establish financeability."} No financing recommendation is made.</p></div>
  </div>;
}
