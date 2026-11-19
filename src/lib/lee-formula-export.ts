import { leeScenarios, leeDisclosure, type LeeDebt } from './lee-data-center.ts';
import type { DevelopmentInput } from './development-model.ts';

type Formula = { readonly formula: string };
type Cell = string | number | Formula;
const fx = (formula: string): Formula => ({ formula: `=${formula}` });
const columns = Array.from({ length: 11 }, (_, i) => String.fromCharCode(66 + i));

/** Formula construction is private: user text is never interpreted as an expression. */
export function leeFormulaGrid(a: DevelopmentInput, d: LeeDebt, kind: 'annual' | 'returns') {
  const rows: Cell[][] = [
    [`LUNA1 Research | Lee Data Center | ${kind === 'annual' ? 'Annual financial model' : 'Investment returns'} | USD`],
    ['Illustrative site case. Each scenario is independent; inputs reflect the current browser model.'],
    [kind === 'annual' ? 'INPUT rows are phase operating snapshots or financing assumptions. FORMULA rows recalculate from those cells.' : 'INPUT cash flows and debt data are current-model snapshots. Return formulas recalculate from these supporting rows.'],
    ['Change rent, lease-up, power, construction timing or exit year on the website and export again; use the full XLSX for driver-level modeling.'],
    ['Open this CSV directly in Excel, then Save As .xlsx to preserve formulas. Import tools may treat formulas as text. Do not sort individual rows.'],
    ['Year 0 is undiscounted; Years 1–10 use annual end-period discounting. IRR is unavailable for nonconventional cash flows.'],
    [leeDisclosure], [],
  ];
  const outputs: { scenario: string; cells: Record<string, string> }[] = [];
  const add = (label: string, values: Cell[]) => { rows.push([label, ...values]); return rows.length; };
  for (const scenario of leeScenarios(a, d)) {
    add(scenario.name, []);
    if (!scenario.model) { add('Unavailable scenario', [scenario.error ?? 'Invalid inputs']); add('', []); continue; }
    const m = scenario.model;
    const rate = d.interestRate + (scenario.name === 'Upside' ? -.01 : scenario.name === 'Downside' ? .02 : 0);
    const r: Record<string, number> = {};
    const input = (key: string, label: string, values: number[]) => { r[key] = add(`INPUT | ${label}`, values); };
    const calc = (key: string, label: string, formula: (c: string, y: number) => string) => { r[key] = add(`FORMULA | ${label}`, columns.map((c, y) => fx(formula(c, y)))); };
    const ref = (key: string, c = 'B') => `${c}${r[key]}`;
    const fixed = (key: string) => `$B$${r[key]}`;
    const span = (key: string) => `B${r[key]}:L${r[key]}`;
    r.year = add('Year', Array.from({ length: 11 }, (_, i) => i));
    input('discount', 'Equity discount rate', [d.equityDiscountRate]);
    input('covenant', 'DSCR covenant (x)', [d.covenant]);
    input('projectDiscount', 'Project discount rate', [a.discountRate!]);
    if (kind === 'annual') {
      input('leverage', 'Debt / development CapEx', [d.leverage]);
      input('interestRate', 'Interest rate', [rate]);
      input('feeRate', 'Financing fee / commitment', [d.feeRate]);
      input('start', 'Amortization start year (after last draw)', [d.amortizationStart]);
      input('term', 'Amortization term (years)', [d.term]);
      input('annuity', 'Repayment: 1 = annuity; 0 = equal principal', [d.repayment === 'annuity' ? 1 : 0]);
      input('taxRate', 'Simplified tax / positive phase EBITDA', [a.cashTaxRate!]);
      input('wcRate', 'Working capital / revenue', [a.workingCapitalRate!]);
      input('maintenanceRate', 'Maintenance CapEx / available MW', [a.maintenancePerMW!]);
      input('exitYear', 'Exit year (refresh source snapshots to change)', [a.exitYear!]);
      input('multiple', 'Exit EBITDA multiple', [a.exitMultiple! + (scenario.name === 'Upside' ? 2 : scenario.name === 'Downside' ? -2 : 0)]);
      input('selling', 'Selling costs / gross exit value', [a.sellingCost!]);
      for (let phase = 1; phase <= 2; phase++) {
        const source = m.project.phaseRows.filter(p => p.Phase_ID === phase);
        for (const key of ['Revenue', 'Power_Cost', 'Other_Opex'] as const) input(`${key}${phase}`, `Phase ${phase} ${key} snapshot`, source.map(p => p[key]));
        calc(`ebitda${phase}`, `Phase ${phase} EBITDA`, c => `${ref(`Revenue${phase}`, c)}-${ref(`Power_Cost${phase}`, c)}-${ref(`Other_Opex${phase}`, c)}`);
      }
      input('available', 'Available capacity (MW) snapshot', m.rows.map(p => p.MW_Available));
      input('capex', 'Development CapEx snapshot', m.rows.map(p => p.Development_CapEx));
      calc('revenue', 'Revenue', c => `${ref('Revenue1', c)}+${ref('Revenue2', c)}`);
      calc('opex', 'Operating expenses', c => `${ref('Power_Cost1', c)}+${ref('Power_Cost2', c)}+${ref('Other_Opex1', c)}+${ref('Other_Opex2', c)}`);
      calc('ebitda', 'EBITDA', c => `${ref('revenue', c)}-${ref('opex', c)}`);
      calc('tax', 'Cash taxes (phase losses do not offset profits)', c => `(MAX(0,${ref('ebitda1', c)})+MAX(0,${ref('ebitda2', c)}))*${fixed('taxRate')}`);
      calc('maintenance', 'Maintenance CapEx', c => `${ref('available', c)}*${fixed('maintenanceRate')}`);
      calc('wc', 'Working capital', c => `${ref('revenue', c)}*${fixed('wcRate')}`);
      calc('deltaWc', 'Change in working capital', (c, y) => `IF(${ref('year', c)}>${fixed('exitYear')},0,${ref('wc', c)}${y ? `-${ref('wc', columns[y - 1])}` : ''})`);
      calc('cfads', 'CFADS (excludes development and sale proceeds)', c => `${ref('ebitda', c)}-${ref('tax', c)}-${ref('maintenance', c)}-${ref('deltaWc', c)}`);
      calc('ufcf', 'Unlevered free cash flow', c => `${ref('cfads', c)}-${ref('capex', c)}`);
      calc('grossExit', 'Gross exit value', c => `IF(${ref('year', c)}=${fixed('exitYear')},MAX(0,${ref('ebitda', c)})*${fixed('multiple')},0)`);
      calc('exitCosts', 'Selling costs', c => `${ref('grossExit', c)}*${fixed('selling')}`);
      calc('wcRelease', 'Working capital release at exit', c => `IF(${ref('year', c)}=${fixed('exitYear')},${ref('wc', c)},0)`);
      calc('projectFlow', 'Project cash flow', c => `${ref('ufcf', c)}+${ref('grossExit', c)}-${ref('exitCosts', c)}+${ref('wcRelease', c)}`);
      r.commitment = add('FORMULA | Debt commitment', [fx(`SUM(${span('capex')})*${fixed('leverage')}`)]);
      r.payment = add('FORMULA | Level annual payment (annuity method)', [fx(`IF(${fixed('interestRate')}=0,${fixed('commitment')}/${fixed('term')},-PMT(${fixed('interestRate')},${fixed('term')},${fixed('commitment')}))`)]);
      // Forward row references permit a readable debt roll-forward without circularity.
      const openingRow = rows.length + 1;
      r.closing = openingRow + 6;
      calc('opening', 'Opening debt', (_, y) => y ? ref('closing', columns[y - 1]) : '0');
      calc('draw', 'Debt draw', c => `${ref('capex', c)}*${fixed('leverage')}`);
      calc('interest', 'Interest (half-year convention on draws)', c => `(${ref('opening', c)}+${ref('draw', c)}*0.5)*${fixed('interestRate')}`);
      calc('principal', 'Scheduled principal', c => `IF(${ref('year', c)}=${fixed('start')}+${fixed('term')}-1,${ref('opening', c)},IF(AND(${ref('year', c)}>=${fixed('start')},${ref('year', c)}<${fixed('start')}+${fixed('term')}),MIN(${ref('opening', c)},IF(${fixed('annuity')}=1,MAX(0,${fixed('payment')}-${ref('interest', c)}),${fixed('commitment')}/${fixed('term')})),0))`);
      calc('service', 'Debt service (interest + scheduled principal)', c => `${ref('interest', c)}+${ref('principal', c)}`);
      calc('balloon', 'Exit debt payoff (excluded from DSCR)', c => `IF(${ref('year', c)}=${fixed('exitYear')},MAX(0,${ref('opening', c)}+${ref('draw', c)}-${ref('principal', c)}),0)`);
      calc('closing', 'Closing debt', c => `MAX(0,${ref('opening', c)}+${ref('draw', c)}-${ref('principal', c)})-${ref('balloon', c)}`);
      calc('fee', 'Financing fee', c => `IF(${ref('year', c)}=0,${fixed('commitment')}*${fixed('feeRate')},0)`);
      calc('equityFlow', 'Equity cash flow', c => `${ref('projectFlow', c)}+${ref('draw', c)}-${ref('service', c)}-${ref('balloon', c)}-${ref('fee', c)}`);
      calc('debtCheck', 'Debt balance check (zero)', c => `${ref('opening', c)}+${ref('draw', c)}-${ref('principal', c)}-${ref('balloon', c)}-${ref('closing', c)}`);
    } else {
      for (const [key, label, source] of [
        ['projectFlow', 'Project cash flow', 'Total_Cash_Flow'], ['equityFlow', 'Equity cash flow', 'Equity_Cash_Flow'],
        ['cfads', 'CFADS', 'CFADS'], ['service', 'Debt service (excludes exit payoff)', 'Debt_Service'],
        ['available', 'Available capacity (MW)', 'MW_Available'], ['draw', 'Debt draw', 'Debt_Draw'],
      ] as const) input(key, `${label} snapshot`, m.rows.map(p => p[source]));
    }
    calc('dscr', 'DSCR (x)', c => `IF(AND(${ref('available', c)}>0,${ref('service', c)}>0.00000001),${ref('cfads', c)}/${ref('service', c)},"n.a.")`);
    calc('breach', 'Covenant breach (1 = breach)', c => `IF(ISNUMBER(${ref('dscr', c)}),IF(${ref('dscr', c)}<${fixed('covenant')},1,0),0)`);
    for (const prefix of ['equity', 'project']) {
      const flow = `${prefix}Flow`;
      calc(`${prefix}In`, `${prefix} contributions`, c => `MAX(0,-${ref(flow, c)})`);
      calc(`${prefix}Out`, `${prefix} distributions`, c => `MAX(0,${ref(flow, c)})`);
      calc(`${prefix}Pv`, `${prefix} discounted cash flow`, c => `${ref(flow, c)}/(1+${fixed(prefix === 'equity' ? 'discount' : 'projectDiscount')})^${ref('year', c)}`);
      calc(`${prefix}Reversal`, `${prefix} negative flow after positive flow (IRR eligibility)`, c => `IF(AND(${ref(flow, c)}<0,COUNTIF($B$${r[flow]}:${ref(flow, c)},">0")>0),1,0)`);
    }
    const cells: Record<string, string> = {};
    const summary = (key: string, formula: string) => { const row = add(key, [fx(formula)]); cells[key] = `B${row}`; };
    add(`${scenario.name} | Returns summary`, []);
    for (const prefix of ['equity', 'project']) {
      summary(`${prefix} IRR`, `IF(AND(SUM(${span(`${prefix}In`)})>0,SUM(${span(`${prefix}Out`)})>0,SUM(${span(`${prefix}Reversal`)})=0),IFERROR(IRR(${span(`${prefix}Flow`)}),"n.a."),"n.a.")`);
      summary(`${prefix} MOIC`, `IF(SUM(${span(`${prefix}In`)})>0,SUM(${span(`${prefix}Out`)})/SUM(${span(`${prefix}In`)}),"n.a.")`);
      summary(`${prefix} NPV`, `SUM(${span(`${prefix}Pv`)})`);
    }
    summary('Minimum DSCR', `IF(COUNT(${span('dscr')})>0,MIN(${span('dscr')}),"n.a.")`);
    summary('Covenant breach years', `SUM(${span('breach')})`);
    summary('Contributed equity', `SUM(${span('equityIn')})`);
    summary('Distributed equity', `SUM(${span('equityOut')})`);
    summary('Debt commitment', `SUM(${span('draw')})`);
    outputs.push({ scenario: scenario.name, cells });
    add('', []);
  }
  return { rows, outputs };
}

export function leeFormulaCSV(a: DevelopmentInput, d: LeeDebt, kind: 'annual' | 'returns') {
  return leeFormulaGrid(a, d, kind).rows.map(row => Array.from({ length: 12 }, (_, i) => {
    const value = row[i] ?? '';
    let text = typeof value === 'object' ? value.formula : String(value);
    if (typeof value === 'string' && /^\s*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n');
}
