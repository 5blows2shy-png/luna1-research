'use client';
import { useState } from 'react';
import { departments, forecast, generateSpend, optimize, policies, scenarioNames, sum, summarize, type Scenario, type ScenarioRow } from '@/lib/cloud-finops';
import { FinancialTable, Metrics, money, percent, TrendChart } from './financial-display';
import styles from './project.module.css';
const history = generateSpend();
const views = ['Executive overview', 'Cost allocation & showback', 'Optimization opportunities', 'Scenario analysis'] as const;
const monthlyLabels = Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}`);
const colors = ['var(--project-accent)', 'var(--project-chart-secondary)', 'var(--text)'];
function grouped(rows: ScenarioRow[], key: 'Department' | 'Provider' | 'Service' | 'Workload') {
  return [...new Set(rows.map(r => r[key]))].map(name => ({ name, rows: rows.filter(r => r[key] === name) }));
}
function SpendBars({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  const maximum = Math.max(1, ...items.map(item => item.value));
  return <figure style={{ margin: '24px 0' }}><figcaption>{title}</figcaption><svg className={styles.chart} viewBox={`0 0 620 ${items.length * 45 + 10}`} role="img" aria-label={`${title}. Exact amounts are in the accompanying table.`}>
    {items.map((item, i) => <g key={item.label}><text x="0" y={i * 45 + 24}>{item.label}</text><rect x="145" y={i * 45 + 8} width={item.value / maximum * 345} height="24" fill="var(--project-accent)"/><text x="505" y={i * 45 + 24}>{money(item.value)}</text></g>)}
  </svg></figure>;
}
export function FinopsDashboard() {
  const [view, setView] = useState<typeof views[number]>(views[0]);
  const [scenario, setScenario] = useState<Scenario>('Moderate');
  const [provider, setProvider] = useState('All');
  const [department, setDepartment] = useState('All');
  const [asOf, setAsOf] = useState('2026-12');
  const [growth, setGrowth] = useState(.012);
  const selected = history.filter(r => (provider === 'All' || r.Provider === provider) && (department === 'All' || r.Department === department));
  const rows = selected.map(r => optimize(r, scenario)), totals = summarize(rows);
  const future = forecast(rows, asOf, growth);
  const forecastTotal = sum(future, r => r.ForecastCost), forecastBudget = sum(future, r => r.ForecastBudget);
  const anchor = rows.filter(r => r.Month === asOf);
  const monthly = monthlyLabels.map(month => ({ month, ...summarize(rows.filter(r => r.Month === month)) }));
  const forwardMonths = [...new Set(future.map(r => r.Month))].sort();
  const opportunities = grouped(rows, 'Workload').map(g => ({ ...g, ...summarize(g.rows) })).sort((a, b) => b.savings - a.savings).slice(0, 10);
  return <div>
    <div className={styles.controls} aria-label="Dashboard views">{views.map(name => <button key={name} type="button" aria-pressed={view === name} onClick={() => setView(name)}>{name}</button>)}</div>
    <div className={styles.fields}>
      <label>Optimization scenario<select value={scenario} onChange={e => setScenario(e.target.value as Scenario)}>{scenarioNames.map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Cloud provider<select value={provider} onChange={e => setProvider(e.target.value)}>{['All', 'AWS', 'Azure'].map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Department<select value={department} onChange={e => setDepartment(e.target.value)}>{['All', ...departments].map(s => <option key={s}>{s}</option>)}</select></label>
    </div>
    <section aria-label={view}>
      <h2>{view}</h2><p>{scenario} scenario · {provider} providers · {department} departments · January–December 2026 simulated history. Filters apply to all views; forecast controls apply only to the forward period.</p>
      {view === views[0] && <>
        <Metrics items={[[scenario === 'Baseline' ? 'Annual actual spend' : 'Scenario annual spend', money(totals.spend)], ['Budget variance', money(totals.variance)], ['Next 12 months forecast', money(forecastTotal)], ['Identified annual savings', money(totals.savings)], ['Savings opportunity', percent(totals.savingsPercent)], ['Compute utilization', percent(totals.utilization)]]}/>
        <p>Baseline actual spend: {money(totals.baseline)}. Scenario values are modeled costs, not realized savings. Positive cost variance is unfavorable.</p>
        <TrendChart title="Monthly actual, scenario and budget" labels={monthlyLabels.map(x => x.slice(5))} series={[{ name: 'Actual', values: monthly.map(r => r.baseline), color: colors[0] }, { name: 'Scenario', values: monthly.map(r => r.spend), color: colors[1] }, { name: 'Budget', values: monthly.map(r => r.budget), color: colors[2] }]}/>
        <FinancialTable caption="Monthly cost reconciliation" headers={['Month', 'Actual', 'Scenario', 'Budget', 'Scenario variance', 'Variance %']} rows={monthly.map(r => [r.month, money(r.baseline), money(r.spend), money(r.budget), money(r.variance), percent(r.variancePercent)])}/>
        <p>Budget assumes slower consumption growth (0.4% monthly trend) than actuals (1.2%), with a simulated September Data production surge of 25%. The independent budget totals $1.164M across the company. These are designed variance drivers, not provider billing observations.</p>
        <div className={styles.fields}><label>Forecast as of<select value={asOf} onChange={e => setAsOf(e.target.value)}>{monthlyLabels.map(m => <option key={m}>{m}</option>)}</select></label><label>Monthly direct-cost growth: {percent(growth)}<input type="range" min="-5" max="5" step="0.1" value={growth * 100} onChange={e => setGrowth(Number(e.target.value) / 100)}/></label></div>
        <p>Annualized exit run rate: <strong>{money(sum(anchor, r => r.AllocatedCost) * 12)}</strong>. Forward budget: {money(forecastBudget)}. Forecast variance: <strong>{money(forecastTotal - forecastBudget)}</strong>. Forecast uses the selected month only, compounds direct cost, holds shared overhead constant and grows budget 0.4% monthly. It is a planning extrapolation, not a predictive model.</p>
        <TrendChart title="Rolling 12-month forecast" labels={forwardMonths} series={[{ name: 'Forecast', values: forwardMonths.map(m => sum(future.filter(r => r.Month === m), r => r.ForecastCost)), color: colors[0] }, { name: 'Budget', values: forwardMonths.map(m => sum(future.filter(r => r.Month === m), r => r.ForecastBudget)), color: colors[1] }]}/>
        <FinancialTable caption="Forward forecast and budget" headers={['Month', 'Forecast', 'Budget']} rows={forwardMonths.map(m => [m, money(sum(future.filter(r => r.Month === m), r => r.ForecastCost)), money(sum(future.filter(r => r.Month === m), r => r.ForecastBudget))])}/>
        <div className={styles.twoCol}>{(['Provider', 'Department', 'Service'] as const).map(key => <div key={key}><SpendBars title={`Scenario spend by ${key.toLowerCase()}`} items={grouped(rows, key).map(g => ({ label: g.name, value: sum(g.rows, r => r.AllocatedCost) }))}/><FinancialTable caption={`Spend by ${key.toLowerCase()}`} headers={[key, 'Actual', 'Scenario']} rows={grouped(rows, key).map(g => [g.name, money(sum(g.rows, r => r.BaselineAllocatedCost)), money(sum(g.rows, r => r.AllocatedCost))])}/></div>)}</div>
      </>}
      {view === views[1] && <>
        <p>Company → department → cost center → workload → cloud service. Shared platform overhead is $8,000 per month, allocated in proportion to baseline direct spend. Allocations are fixed before filtering, so filtered views never redistribute costs to the remaining departments.</p>
        <FinancialTable caption="Department showback" headers={['Department', 'Direct cost', 'Shared allocation', 'Total showback', 'Budget', 'Variance']} rows={grouped(rows, 'Department').map(g => [g.name, money(sum(g.rows, r => r.OptimizedDirectCost)), money(sum(g.rows, r => r.SharedCost)), money(summarize(g.rows).spend), money(summarize(g.rows).budget), money(summarize(g.rows).variance)])}/>
        <FinancialTable caption="Workload economics" headers={['Department / cost center', 'Workload', 'Showback cost', 'Workload units', 'Cost / unit']} rows={grouped(rows, 'Workload').map(g => { const t = summarize(g.rows); return [`${g.rows[0].Department} / ${g.rows[0].CostCenter}`, g.name, money(t.spend), t.units.toLocaleString('en-US', { maximumFractionDigits: 0 }), `$${t.costPerUnit.toFixed(3)}`]; })}/>
        <p>Workload units are simulated service-output units, counted once per workload-month on the Compute record. Provider usage units (instance-hours, GB-month and transferred GB) must not be added together.</p>
        {grouped(rows, 'Workload').map(g => <details key={g.name}><summary>{g.name} · service detail</summary><FinancialTable caption={`${g.name} service allocation`} headers={['Service', 'Direct', 'Shared', 'Allocated']} rows={grouped(g.rows, 'Service').map(s => [s.name, money(sum(s.rows, r => r.OptimizedDirectCost)), money(sum(s.rows, r => r.SharedCost)), money(sum(s.rows, r => r.AllocatedCost))])}/></details>)}
      </>}
      {view === views[2] && <>
        <p>Ranked annual opportunities under the selected policy. Savings are sequential: remove idle capacity, rightsize eligible compute, optimize storage, then discount eligible remaining compute/database spend. Showback itself creates no savings.</p>
        <FinancialTable caption="Top 10 cloud cost optimization opportunities" headers={['Workload', 'Annual savings', 'Compute utilization', 'Idle', 'Rightsizing', 'Storage', 'Reservations']} rows={opportunities.map(g => [g.name, money(g.savings), percent(g.utilization), money(sum(g.rows, r => r.IdleSavings)), money(sum(g.rows, r => r.RightsizingSavings)), money(sum(g.rows, r => r.StorageSavings)), money(sum(g.rows, r => r.ReservationSavings))])}/>
        <p>Production compute and database workloads are eligible for commitments; sandbox workloads remain on demand. The idle sandbox resource requires an owner sign-off and dependency review before removal. Storage changes require retention, retrieval-cost and latency checks.</p>
      </>}
      {view === views[3] && <>
        <FinancialTable caption="Three scenario investment screen" headers={['Scenario', 'Annual spend', 'Savings', 'Savings %', 'Eligible coverage', 'Compute utilization', 'Minimum buffer', 'Next 12 months']} rows={scenarioNames.map(s => { const records = selected.map(r => optimize(r, s)), t = summarize(records); return [s, money(t.spend), money(t.savings), percent(t.savingsPercent), percent(t.coverage), percent(t.utilization), percent(t.minimumBuffer), money(sum(forecast(records, asOf, growth), r => r.ForecastCost))]; })}/>
        <FinancialTable caption="Explicit optimization assumptions" headers={['Scenario', 'Rightsize cap', 'Utilization ceiling', 'Idle removal', 'Storage reduction', 'Eligible coverage', 'Discount']} rows={scenarioNames.map(s => {const p = policies[s]; return [s, percent(p.rightsizing), percent(p.utilizationCeiling), percent(p.idleRemoval), percent(p.storage), percent(p.coverage), percent(p.discount)];})}/>
        <p>Coverage is the share of eligible post-rightsizing on-demand cost committed, not the share of total company spend. Utilization is weighted by remaining compute capacity; minimum buffer is the lowest resource-month headroom. Shared costs do not fall in either scenario.</p>
        <h3>Management recommendation</h3><p>Adopt Moderate as a controlled pilot: it balances modeled savings with a 30% minimum compute headroom policy and 50% coverage of eligible spend. Baseline preserves flexibility but leaves waste; Aggressive increases savings while reducing headroom to a 20% policy floor and committing 80% of eligible spend. Higher commitments increase exposure to unused capacity if demand falls.</p>
        <p>In the first 30 days, confirm ownership, tags, peak loads and service dependencies. In days 31–60, remove confirmed idle resources and pilot rightsizing with rollback thresholds. Commit only the stable residual demand in days 61–90. Finance should reconcile actual invoices and track realized savings separately from forecasts.</p>
        <p>These are gross steady-state savings before implementation costs, commitment underuse, taxes and migration charges. Discounts are simulated effective rates, not AWS or Azure offers. The model assumes constant utilization under proportional demand/capacity growth; peak-demand engineering remains a prerequisite.</p>
      </>}
    </section>
  </div>;
}
