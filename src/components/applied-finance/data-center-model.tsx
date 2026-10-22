"use client";
import { useState, useSyncExternalStore } from "react";
import { dataCenterModel, defaultDataCenter, scenarioAssumptions, validateDataCenter, type DataCenterAssumptions, type Scenario } from "@/lib/applied-finance";
import { FinancialTable, Metrics, money, percent, ProjectSection, TrendChart } from "./financial-display";
import { SourcesUses, DebtSchedules, ScenarioSchedule, SensitivitySchedules, FinanceAssessment } from "./project-finance-schedules";
import { ProjectFinanceWorkSample } from "./project-finance-work-sample";
import { coverageRatio, financeScenarios } from "@/lib/project-finance-report";
import styles from "./project.module.css";
type NumericKey = Exclude<keyof DataCenterAssumptions, "capex" | "utilization" | "amortization">;
const fields: { key: NumericKey; label: string; step: number; scale?: number; min?: number; max?: number }[] = [
  { key: "constructionYears", label: "Construction / delay (years)", step: 1, max: 5 },
  { key: "capacityMW", label: "IT capacity (MW)", step: .1, min: .1 },
  { key: "powerPrice", label: "Power cost ($/kWh)", step: .01 },
  { key: "pue", label: "Power usage effectiveness (PUE)", step: .05, min: 1, max: 3 },
  { key: "revenuePerKWMonth", label: "Capacity revenue ($/kW/month)", step: 10 },
  { key: "operatingExpenses", label: "Other operating expenses ($/year)", step: 10000 },
  { key: "maintenance", label: "Maintenance ($/year)", step: 10000 },
  { key: "staffing", label: "Staffing ($/year)", step: 10000 },
  { key: "cooling", label: "Cooling service, excluding power ($/year)", step: 10000 },
  { key: "network", label: "Network ($/year)", step: 10000 },
  { key: "facility", label: "Property / facility ($/year)", step: 10000 },
  { key: "growth", label: "Revenue price growth (%/year)", step: .5, scale: 100, max: 30 },
  { key: "discountRate", label: "Project discount rate (%)", step: .5, scale: 100, max: 100 },
  { key: "debtPercent", label: "Debt / development budget (%)", step: 5, scale: 100, max: 100 },
  { key: "interestRate", label: "Debt interest rate (%)", step: .5, scale: 100, max: 100 },
  { key: "life", label: "Operating useful life (years)", step: 1, min: 5, max: 30 },
  { key: "taxRate", label: "Cash tax rate (%) · assumption", step: 1, scale: 100, max: 100 },
  { key: "workingCapitalPercent", label: "Working capital / revenue (%)", step: 1, scale: 100, max: 100 },
  { key: "maintenanceCapex", label: "Maintenance CapEx ($/year)", step: 10000 },
  { key: "depreciablePercent", label: "Depreciable development cost (%)", step: 5, scale: 100, max: 100 },
  { key: "debtTerm", label: "Debt term after construction (years)", step: 1, min: 1, max: 30 },
  { key: "graceYears", label: "Operating principal grace (years)", step: 1, max: 29 },
  { key: "financingFeePercent", label: "Financing fees / debt (%)", step: .5, scale: 100, max: 100 },
  { key: "contingencyPercent", label: "Contingency / development CapEx (%)", step: 1, scale: 100, max: 100 },
  { key: "dscrThreshold", label: "DSCR threshold (x) · assumption, not covenant", step: .05, min: 1, max: 3 },
  { key: "terminalValue", label: "Terminal disposal proceeds ($)", step: 100000 },
];
const inputValue = (v: number) => Number.isFinite(v) ? Number(v.toFixed(6)) : "";
const parsed = (v: string) => v.trim() === "" ? NaN : Number(v);
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function DataCenterModel() {
  // Keep server-rendered controls disabled until their change handlers are attached.
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [assumptions, setAssumptions] = useState<DataCenterAssumptions>(defaultDataCenter);
  const [presentation, setPresentation] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("Base");
  const error = validateDataCenter(assumptions);
  const selected = scenarioAssumptions(assumptions, scenario);
  const selectedError = error || validateDataCenter(selected);
  const model = selectedError ? null : dataCenterModel(selected);
  const total = assumptions.capex.reduce((s, c) => s + c.amount, 0);
  const update = (key: NumericKey, value: number) => setAssumptions(a => ({ ...a, [key]: value }));
  return <fieldset disabled={!ready} aria-label="Interactive project finance model" className={styles.modelContainer}>
    <div className={styles.modeControls}>
      <button type="button" aria-pressed={presentation} disabled={!model} onClick={() => setPresentation(v => !v)}>{presentation ? "Return to editable model" : "Open recruiting work sample · 8 screens"}</button>
      {presentation && <button type="button" onClick={() => window.print()}>Print / save PDF preview</button>}
      <p>Work sample and model share the current scenario and assumptions. Download the completed PDF case study and formula-based Excel model in Evidence. Downloads contain the starting base case; on-page edits are session-only.</p>
    </div>
    {presentation && model ? <ProjectFinanceWorkSample assumptions={selected} model={model} base={assumptions} scenario={scenario} /> : <>
    <ProjectSection id="assumptions-model" title="Editable project assumptions">
      <p className={styles.meta}>User assumption · HYPOTHETICAL PROJECT FINANCE CASE STUDY · USD</p>
      <p>Starting development CapEx: $50 million, before contingency, financing fees, and construction interest. Edit the base inputs below; changes remain in this page session. Scenario overlays are explicit teaching assumptions. No public operating data is connected.</p>
      <button type="button" onClick={() => { setAssumptions(defaultDataCenter); setScenario("Base"); }}>Reset assumptions</button>
      <div className={styles.fields}>{fields.map(f => <label key={f.key}>{f.label}<input type="number" min={f.min ?? 0} max={f.max ?? 1e10} step={f.step} value={inputValue(assumptions[f.key] * (f.scale ?? 1))} onChange={e => update(f.key, parsed(e.target.value) / (f.scale ?? 1))} /></label>)}</div>
      <p>Calculated equity share of development budget: {percent(1 - assumptions.debtPercent)}. All-in sources additionally include sponsor-funded fees and construction interest.</p>
      <label htmlFor="debt-amortization">Debt amortization</label><select id="debt-amortization" value={assumptions.amortization} onChange={e => setAssumptions(a => ({ ...a, amortization: e.target.value as DataCenterAssumptions["amortization"] }))}><option value="equal-principal">Equal principal</option><option value="annuity">Level debt service / annuity</option><option value="balloon">Interest-only / balloon at maturity</option></select>
      <h3>Utilization ramp · user assumptions</h3>
      <p>Year 1 means the first operating year after construction. Year 5 utilization continues through the remaining useful life.</p>
      <div className={styles.fields}>{assumptions.utilization.map((value, i) => <label key={i}>Operating year {i + 1} utilization (%)<input type="number" min={0} max={100} step={1} value={inputValue(value * 100)} onChange={e => setAssumptions(a => ({ ...a, utilization: a.utilization.map((v, n) => n === i ? parsed(e.target.value) / 100 : v) }))} /></label>)}</div>
      <details><summary>CapEx breakdown · edit categories and amounts</summary>
        <label>Total project cost ($) · rescales category amounts<input type="number" min={1} max={1e10} step={1000000} value={inputValue(total)} onChange={e => { const value = parsed(e.target.value); setAssumptions(a => ({ ...a, capex: a.capex.map((c, i) => ({ ...c, amount: total > 0 && Number.isFinite(total) ? c.amount * value / total : i === 0 ? value : 0 })) })); }} /></label>
        {assumptions.capex.map((c, i) => <div className={styles.capexRow} key={i}><label>Category {i + 1}<input value={c.name} maxLength={80} onChange={e => setAssumptions(a => ({ ...a, capex: a.capex.map((item, n) => n === i ? { ...item, name: e.target.value } : item) }))} /></label><label>Amount {i + 1} ($)<input type="number" min={0} max={1e10} step={100000} value={inputValue(c.amount)} onChange={e => setAssumptions(a => ({ ...a, capex: a.capex.map((item, n) => n === i ? { ...item, amount: parsed(e.target.value) } : item) }))} /></label><button type="button" aria-label={`Remove ${c.name || `category ${i + 1}`}`} onClick={() => setAssumptions(a => ({ ...a, capex: a.capex.filter((_, n) => n !== i) }))}>Remove</button></div>)}
        <button type="button" onClick={() => setAssumptions(a => ({ ...a, capex: [...a.capex, { name: "New category", amount: 0 }] }))}>Add category</button>
      </details>
      <details><summary>Calculation methodology & limitations</summary>
        <p>Development CapEx plus contingency is spent in equal installments at time zero and subsequent construction year-ends, with debt drawn proportionately. Construction interest is paid by the sponsor on opening debt balances. Fees are paid at time zero. Sources & uses balances the total construction-period funding budget; operating deficits are additional sponsor funding needs.</p>
        <p>Debt term starts after construction. Operating grace defers principal only; interest remains payable. Equal-principal, level-payment annuity, and balloon repayment are supported. All remaining principal is repaid at maturity; debt term cannot exceed useful life.</p>
        <p>EBITDA = revenue − power − fixed operating expenses. Straight-line depreciation applies to the assumed depreciable share of development cost over operating life. Unlevered cash taxes = max(EBITDA − depreciation, 0) × assumed tax rate. Equity cash taxes also deduct interest. No loss carryforwards, interest deduction limits, or depreciation on recurring maintenance CapEx are modeled.</p>
        <p>Working capital equals the selected share of annual revenue. CFADS = EBITDA − equity cash taxes − increase in working capital − maintenance CapEx. Project cash flow uses unlevered taxes; equity cash flow subtracts debt service and includes staged debt draws and financing fees. Initial and subsequent development spending is deducted separately.</p>
        <p>Terminal disposal proceeds are taxed on gains over residual book value, without loss relief; working capital is released at exit. Both are excluded from CFADS, DSCR, and operating payback. IRR is unavailable for nonconventional cash-flow patterns. NPV uses annual, end-period unlevered cash flows and the assumed project discount rate.</p>
        <p>Fixed operating costs and power prices stay flat; capacity pricing grows. No reserve account, cash sweep, refinancing, default waterfall, or decommissioning cost is modeled. These are simplifying assumptions, not tax advice or lender terms.</p>
      </details>
      {selectedError && <p className={styles.error} role="alert">{selectedError} Outputs are withheld until inputs are valid.</p>}
    </ProjectSection>
    {model && <>
      <ProjectSection id="analysis" title="Project finance model outputs">
        <div className={styles.controls} aria-label="Scenario">{financeScenarios.map(s => <button type="button" key={s} aria-pressed={scenario === s} onClick={() => setScenario(s)}>{s} case</button>)}</div>
        <p aria-live="polite" className={styles.meta}>{scenario} case · model output · hypothetical</p>
        <Metrics items={[["Total project uses", money(model.totalUses)], ["Project NPV", money(model.npv)], ["Project IRR · after tax", percent(model.irr)], ["Equity IRR · after tax", percent(model.equityIrr)], ["Minimum operating DSCR", coverageRatio(model.minDscr)], ["Average operating DSCR", coverageRatio(model.averageDscr)], ["Debt funding", money(model.debt)], ["Operating payback", model.payback === null ? "Not recovered" : `${model.payback.toFixed(1)} years`]]} />
        <h3>Sources & uses / capital structure</h3><SourcesUses model={model} />
        <h3>Operating & power economics</h3>
        <p>IT load = IT capacity × utilization. Facility load = IT load × PUE. Electricity = facility MW × 8,760 hours × 1,000 kWh/MWh. Power expense = electricity × $/kWh. Cooling electricity is included in PUE; cooling service expense excludes electricity.</p>
        <FinancialTable caption={`${scenario} case · annual operating and power schedule`} headers={["Year", "Utilization", "IT MW", "Facility MW", "Electricity kWh", "Power expense", "Revenue", "Other OpEx", "EBITDA"]} rows={model.rows.map(r => [r.year, percent(r.utilization), r.itMW.toFixed(2), r.facilityMW.toFixed(2), Math.round(r.kwh).toLocaleString("en-US"), money(r.power), money(r.revenue), money(r.costs), money(r.ebitda)])} />
      </ProjectSection>
      <ProjectSection id="debt-service" title="Debt service / CFADS / DSCR"><DebtSchedules model={model} assumptions={selected} /></ProjectSection>
      <ProjectSection id="model" title="Cash flow & investment returns">
        <TrendChart title={`${scenario} case · annual project and equity cash flows`} labels={["Y0", ...model.rows.map(r => `Y${r.year}`)]} series={[{ name: "Project free cash flow", values: model.projectFlows, color: "var(--project-accent)" }, { name: "Equity cash flow", values: model.equityFlows, color: "var(--project-chart-secondary)" }]} />
        <FinancialTable caption="Annual returns bridge · project cash uses unlevered taxes; equity cash uses levered taxes and financing flows" headers={["Year", "Project FCF", "CFADS", "Development spend", "Debt draw", "Fees", "Debt service", "Exit cash¹", "Equity cash flow"]} rows={[["0 · initial funding", money(-model.initialCapex), "—", money(model.initialCapex), money(model.initialDraw), money(model.financingFees), "—", "—", money(model.initialEquityCash)], ...model.rows.map(r => [r.year, money(r.fcf), money(r.cfads), money(r.constructionCapex), money(r.debtDraw), "—", money(r.debtService), money(r.terminal - r.disposalTax + r.workingCapitalRelease), money(r.equityCash)])]} />
        <p>¹ Exit cash includes after-tax disposal proceeds and working-capital release. Neither is counted as debt-service coverage.</p>
        <h3>Scenario analysis</h3><ScenarioSchedule assumptions={assumptions} />
        <h3>Returns & credit sensitivity</h3><SensitivitySchedules assumptions={assumptions} />
      </ProjectSection>
      <ProjectSection id="findings" title="Project finance assessment"><FinanceAssessment model={model} assumptions={selected} /></ProjectSection>
    </>}
    </>}
  </fieldset>;
}
