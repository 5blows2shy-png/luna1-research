'use client';
import { useMemo, useState } from 'react';
import type { DevelopmentInput } from '@/lib/development-model';
import type { LeeDebt } from '@/lib/lee-data-center';
import { infrastructureComparison, initialInfrastructureAssumptions, infrastructureSources, leePowerSensitivity, type InfrastructureAssumptions } from '@/lib/lee-infrastructure';
import { rowsToCSV } from '@/lib/development-export';
import { FinancialTable, Metrics, TrendChart, money, percent } from './financial-display';
import { ValueBars } from './infographics';
import styles from './project.module.css';
const ratio = (n: number | null) => n === null ? 'N/A' : `${n.toFixed(2)}x`;
function csv(name: string, rows: Record<string, string | number | boolean | null>[]) { const url = URL.createObjectURL(new Blob([rowsToCSV(rows)], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }

export function LeeInfrastructure({ project }: { project: DevelopmentInput }) {
  const [inputs, setInputs] = useState(initialInfrastructureAssumptions);
  const analysis = useMemo(() => { try { return { data: infrastructureComparison(project, inputs), error: null }; } catch (e) { return { data: null, error: e instanceof Error ? e.message : 'Check assumptions' }; } }, [project, inputs]);
  const fields: { key: keyof InfrastructureAssumptions; label: string; max?: number; scale?: number; min?: number }[] = [
    { key: 'serverKW', label: 'Server design IT load (kW)', min: .01 }, { key: 'vcpuPerServer', label: 'Equivalent vCPUs per server', min: 1 },
    { key: 'serverCost', label: 'Server + local storage + network allocation ($)' }, { key: 'refreshYears', label: 'Hardware refresh cycle (years)', min: 1, max: 20 },
    { key: 'cloudVcpuHour', label: 'Cloud compute including 4 GB RAM / vCPU ($/hour)' }, { key: 'cloudStorageGBMonth', label: 'Cloud storage ($/GB/month)' },
    { key: 'storageGBPerServer', label: 'Usable storage per server (GB)' }, { key: 'egressGBPerServerMonth', label: 'Cloud egress per server (GB/month)' },
    { key: 'cloudEgressGB', label: 'Cloud egress ($/GB)' }, { key: 'cloudSupport', label: 'Cloud support (%)', scale: 100, max: 100 },
    { key: 'coloKWMonth', label: 'Colocation capacity charge excluding electricity ($/kW/month)' }, { key: 'coloPue', label: 'Colocation PUE', min: 1, max: 3 },
    { key: 'hardwareSupport', label: 'Annual IT support / hardware replacement value (%)', scale: 100, max: 100 },
    { key: 'escalation', label: 'Cloud, colo capacity and hardware escalation (%)', scale: 100, max: 30 },
    { key: 'cloudSetup', label: 'Cloud initial migration / setup ($)' }, { key: 'physicalSetup', label: 'Physical initial deployment / setup ($)' },
  ];
  return <section aria-labelledby="infrastructure-title"><span className={styles.meta}>Enterprise sourcing · same phased workload</span><h2 id="infrastructure-title">Cloud, colocation or owned infrastructure?</h2>
    <p>Compare the cash cost of serving Lee’s phased workload over Years 0–{project.exitYear}. This is the enterprise customer’s sourcing decision, separate from the landlord’s revenue, financing and equity-return model.</p>
    <details><summary>Edit infrastructure comparison assumptions</summary><p>All prices and performance mappings below are analyst assumptions, not provider quotes. The cloud unit price includes {inputs.ramPerVcpu} GB RAM per vCPU. Re-price compute and hardware if the required RAM, storage performance or redundancy changes.</p><div className={styles.fields}>{fields.map(f => <label key={f.key}>{f.label}<input type="number" min={f.min ?? 0} max={f.max ?? 1e9} step="any" value={Number.isFinite(inputs[f.key]) ? Number((inputs[f.key] * (f.scale ?? 1)).toFixed(6)) : ''} onChange={e => setInputs(old => ({ ...old, [f.key]: e.target.value === '' ? NaN : Number(e.target.value) / (f.scale ?? 1) }))}/></label>)}</div><button type="button" onClick={() => setInputs(initialInfrastructureAssumptions())}>Reset comparison assumptions</button></details>
    {analysis.error && <p role="alert">Outputs withheld: {analysis.error}</p>}
    {analysis.data && <>
      <p className={styles.note}>{analysis.data.disclosure}</p>
      <Metrics items={analysis.data.results.map(r => [`${r.Option} · PV cost`, money(r.Present_Value_Cost)])}/>
      <ValueBars title={`Present value of sourcing costs · ${percent(project.discountRate)} discount rate · lower is less costly under these assumptions`} items={analysis.data.results.map(r => ({ label: r.Option, value: r.Present_Value_Cost, display: money(r.Present_Value_Cost) }))}/>
      <TrendChart title="Annual infrastructure cash cost · USD" labels={analysis.data.annual.filter(r => r.Option === 'Cloud').map(r => `Y${r.Year}`)} series={analysis.data.results.map((r, i) => ({ name: r.Option, values: analysis.data!.annual.filter(a => a.Option === r.Option).map(a => a.Total_Cost), color: ['#d0bc97', '#9aafbd', '#b7c3a6'][i] }))}/>
      <FinancialTable caption="Infrastructure sourcing cost comparison" headers={['Option', 'Undiscounted TCO', 'PV cost', 'Year 0 cash cost', 'PV cost / provisioned vCPU-hour']} rows={analysis.data.results.map(r => [r.Option, money(r.Total_Cost), money(r.Present_Value_Cost), money(r.Upfront_Cost), r.PV_Cost_Per_vCPU_Hour === null ? 'N/A' : `$${r.PV_Cost_Per_vCPU_Hour.toFixed(4)}`])}/>
      <div className={styles.twoCol}><div><h3>Equal demand, different cost structures</h3><p>Open and leased MW convert to server equivalents using {inputs.serverKW} kW/server and {inputs.vcpuPerServer} vCPUs/server. Purchased/provisioned capacity never falls below its prior peak. Each option carries the same provisioned vCPU-hours; cloud autoscaling, spot and commitment discounts are not assumed. Actual utilized MW drive physical electricity consumption.</p><p>Colocation pays a capacity charge plus metered electricity at the entered site power price and colocation PUE. Capacity pricing assumes connectivity and facility operations are included. Owned infrastructure carries the entire parcel and facility, including unused capacity, plus Lee’s power, other operating and maintenance costs.</p></div><div><h3>Hardware, timing and decision limits</h3><p>Colocation and owned infrastructure buy the same hardware additions and refresh each cohort every {inputs.refreshYears} years. Local storage and network equipment are included in the hardware allowance. Cloud pays separately for compute, storage, egress and support. Physical IT support is additional to facility operations.</p><p>Cloud, colo capacity and hardware prices escalate at {percent(inputs.escalation)} annually; owned-facility operating costs and the flat power rate retain the Lee model’s assumptions. Zero terminal recovery is assumed for all physical assets. No cloud or colocation lead-time advantage is valued. Obtain workload benchmarks, SLA-equivalent vendor bids and a residual-value appraisal before selecting an option.</p></div></div>
      <FinancialTable collapsible caption="Annual TCO and demand audit" headers={['Option', 'Year', 'Provisioned servers', 'New / refreshed', 'Facility CapEx', 'Hardware CapEx', 'Electricity', 'Colo rent', 'Cloud compute + storage + egress', 'Operations + maintenance + support + setup', 'Total cost']} rows={analysis.data.annual.map(r => [r.Option, r.Year, r.Provisioned_Servers, `${r.Added_Servers} / ${r.Refreshed_Servers}`, money(r.Facility_CapEx), money(r.Hardware_CapEx), money(r.Power_Cost), money(r.Colocation_Rent), money(r.Cloud_Compute + r.Cloud_Storage + r.Cloud_Egress), money(r.Facility_Opex + r.Maintenance_CapEx + r.Support + r.Setup_Cost), money(r.Total_Cost)])}/>
      <button type="button" onClick={() => csv('lee-infrastructure-comparison.csv', analysis.data!.annual.map(r => ({ ...r, Disclosure: analysis.data!.disclosure })))}>Download comparison annual CSV</button>
      <button type="button" onClick={() => csv('lee-infrastructure-results.csv', analysis.data!.results)}>Download comparison summary CSV</button>
    </>}
    <details><summary>Pricing references and diligence</summary><ul>{infrastructureSources.map(s => <li key={s.url}><a href={s.url}>{s.title}</a><p>{s.use}</p></li>)}</ul><p>Reviewed November 24, 2026. Model prices are explicitly hypothetical.</p></details>
  </section>;
}

export function LeePowerPricing({ project, debt }: { project: DevelopmentInput; debt: LeeDebt }) {
  const rows = useMemo(() => leePowerSensitivity(project, debt), [project, debt]);
  const current = rows.find(r => r.Is_Current)!, valid = rows.filter(r => r.Status === 'Calculated');
  return <section aria-labelledby="power-pricing-title"><span className={styles.meta}>Unhedged electricity exposure</span><h2 id="power-pricing-title">What does a higher electricity price do to the investment?</h2>
    <p>Stress $0.05–$0.15/kWh, including your current input of ${project.powerPrice!.toFixed(4)}/kWh. The analysis reruns the same phased model, debt schedule, taxes and exit value. No tenant power reimbursement, hedging or demand reduction is assumed.</p>
    <Metrics items={[[`Year ${project.exitYear} facility energy`, `${((current.Exit_Facility_kWh ?? 0) / 1e6).toFixed(2)} million kWh`], ['Annual cost increase per +$0.01/kWh', current.Exit_Facility_kWh === null ? 'N/A' : money(current.Exit_Facility_kWh * .01)], ['Current minimum DSCR', ratio(current.Minimum_DSCR)]]}/>
    <TrendChart title={`Year ${project.exitYear} power cost and EBITDA · USD`} labels={valid.map(r => `$${r.Power_Price.toFixed(3)}`)} series={[{ name: 'Electricity expense', values: valid.map(r => r.Exit_Power_Cost!), color: '#b97d65' }, { name: 'EBITDA', values: valid.map(r => r.Exit_EBITDA!), color: '#d0bc97' }]}/>
    <FinancialTable caption="Power-price investment sensitivity" headers={['Power $/kWh', 'Exit-year power cost', 'Exit-year EBITDA', 'Equity IRR', 'Equity NPV', 'Minimum DSCR', 'Breach years', 'Cumulative service shortfall', 'Status']} rows={rows.map(r => [`$${r.Power_Price.toFixed(4)}${r.Is_Current ? ' · current' : ''}`, r.Exit_Power_Cost === null ? 'N/A' : money(r.Exit_Power_Cost), r.Exit_EBITDA === null ? 'N/A' : money(r.Exit_EBITDA), percent(r.Equity_IRR), r.Equity_NPV === null ? 'N/A' : money(r.Equity_NPV), ratio(r.Minimum_DSCR), r.Breach_Years ?? 'N/A', r.Debt_Service_Shortfall === null ? 'N/A' : money(r.Debt_Service_Shortfall), r.Status])}/>
    <p>Facility electricity = utilized IT MW × 1,000 × 8,760 × PUE. A one-cent increase reduces EBITDA by that energy volume × $0.01; equity value also changes through cash taxes, annual cash flow and EBITDA-based sale proceeds. Demand charges, taxes on utility bills, tariff escalation and outages are not separately modeled. These stress rates are not utility offers.</p>
    <button type="button" onClick={() => csv('lee-power-pricing-sensitivity.csv', rows)}>Download power sensitivity CSV</button>
  </section>;
}
