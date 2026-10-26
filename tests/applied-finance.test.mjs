import { readFileSync } from "node:fs";
import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDataCenter, dataCenterModel, npv, irr, payback, variance, nonprofitSummary, nonprofitMonths, scenarioAssumptions, validateDataCenter } from '../src/lib/applied-finance.ts';
import { financeProjects, safeArtifactUrl } from '../src/data/applied-finance-projects.ts';
const near = (a,b,tolerance=1e-7) => assert.ok(Math.abs(a-b)<tolerance, `${a} != ${b}`);
test('NPV and conventional IRR match hand-checkable cash flows', () => {
  near(npv(.1, [-100, 110]), 0); near(irr([-100,110]), .1);
  near(irr([-100,0,121]), .1); near(irr([-100,90]), -.1);
  assert.equal(irr([-100, 0, 0]), null); assert.equal(irr([-100,230,-132]), null);
  assert.equal(irr([0, 100]), null); assert.throws(() => npv(-1, [-100,110]));
  near(payback([-100, 0, 40, 80]), 2.75); assert.equal(payback([-100,20,20]), null);
});
test('power consumption applies utilization once and converts MW to kWh', () => {
  const a = { ...defaultDataCenter, constructionYears: 0, capacityMW: 1, pue: 1.5, utilization: [.5,.5,.5,.5,.5], powerPrice: .1 };
  const m = dataCenterModel(a);
  near(m.rows[0].itMW,.5); near(m.rows[0].facilityMW,.75);
  near(m.rows[0].kwh,6570000); near(m.rows[0].power,657000);
  near(m.capex,50000000);
  near(m.rows[0].fcf,m.rows[0].ebitda-m.rows[0].unleveredTaxes-m.rows[0].changeWorkingCapital-m.rows[0].maintenanceCapex);
});
test('debt changes equity returns but not unlevered NPV', () => {
  const allEquity = dataCenterModel({ ...defaultDataCenter, debtPercent: 0 });
  const financed = dataCenterModel(defaultDataCenter);
  near(allEquity.npv, financed.npv); near(allEquity.irr, financed.irr);
  assert.notEqual(allEquity.equityIrr, financed.equityIrr);
  near(financed.rows[0].equityCash,-financed.debt*defaultDataCenter.interestRate);
  const last = financed.rows.at(-1);
  near(last.equityCash,last.cfads-last.debtService+last.terminal-last.disposalTax+last.workingCapitalRelease);
});
test('construction delays operating cash flows and terminal is only at exit', () => {
  const m = dataCenterModel({ ...defaultDataCenter, constructionYears: 2, terminalValue: 1234567 });
  assert.equal(m.rows[0].revenue,0); assert.equal(m.rows[1].revenue,0);
  assert.ok(m.rows[2].revenue>0); assert.equal(m.rows.at(-1).terminal,1234567);
  assert.equal(m.rows.slice(0,-1).reduce((s,r)=>s+r.terminal,0),0);
  assert.equal(m.payback, dataCenterModel({ ...defaultDataCenter, constructionYears: 2 }).payback);
  assert.ok(dataCenterModel({ ...defaultDataCenter, constructionYears: 2 }).npv < dataCenterModel(defaultDataCenter).npv);
});
test('break-even zeros first-year operating cash; impossible economics stay explicit', () => {
  const m = dataCenterModel(defaultDataCenter);
  near(dataCenterModel({ ...defaultDataCenter, constructionYears:0, utilization:Array(5).fill(m.breakEven) }).rows[0].operatingCash,0);
  assert.equal(dataCenterModel({ ...defaultDataCenter, revenuePerKWMonth:0 }).breakEven,null);
});
test('scenario overlays change return drivers without mutating base and are bounded', () => {
  const snapshot=JSON.stringify(defaultDataCenter);
  const base=dataCenterModel(defaultDataCenter);
  assert.ok(dataCenterModel(scenarioAssumptions(defaultDataCenter,'Upside')).npv>base.npv);
  assert.ok(dataCenterModel(scenarioAssumptions(defaultDataCenter,'Downside')).npv<base.npv);
  assert.equal(JSON.stringify(defaultDataCenter),snapshot);
  const a=scenarioAssumptions({ ...defaultDataCenter, utilization:[0,0,1,1,1], constructionYears:5 },'Downside');
  assert.equal(a.constructionYears,5); assert.equal(a.utilization[0],0);
});
test('invalid and incomplete financial inputs withhold outputs', () => {
  for(const patch of [{ pue:.9 }, { capacityMW:0 }, { utilization:[.4] }, { life:4 }, { life:5.5 }, { discountRate:NaN }, { debtPercent:1.1 }, { capex:[] }, { capex:[{name:'',amount:100}] }, { powerPrice:Infinity }]) {
    assert.ok(validateDataCenter({ ...defaultDataCenter,...patch }));
    assert.throws(()=>dataCenterModel({ ...defaultDataCenter,...patch }));
  }
});
test('synthetic fund bridges reconcile for every monthly, quarterly and YTD window', () => {
  for(let start=0;start<12;start++) for(let end=start+1;end<=12;end++) {
    const s=nonprofitSummary(start,end);
    near(s.beginningCash+s.revenue-s.expenses,s.endingCash);
    near(s.restricted.ending+s.unrestricted.ending,s.endingCash);
    for(const f of [s.restricted,s.unrestricted]) near(f.beginning+f.inflows-f.usage,f.ending);
    if(start>0) near(s.beginningCash,nonprofitSummary(0,start).endingCash);
    near(s.budgetVariance,s.surplus-(s.revenueBudget-s.expenseBudget));
    near(s.forecastVariance,s.surplus-(s.forecastRevenue-s.forecastExpenses));
  }
  const jan=nonprofitSummary(0,1); assert.equal(jan.programActual-jan.programBudget,14500);
  near(variance(jan.programActual,jan.programBudget).percent,14500/120000);
  assert.equal(variance(20,0).percent,null);
  assert.throws(()=>nonprofitSummary(3,3));
  assert.equal(nonprofitSummary(0,3).revenue,nonprofitMonths.slice(0,3).reduce((s,m)=>s+m.revenueActual,0));
});
test('completed evidence includes real downloadable files; unsafe evidence URLs cannot publish', () => {
  for(const p of financeProjects) {
    assert.equal(p.status,'Completed'); assert.ok(p.sources.length);
    for(const a of p.artifacts) { assert.equal(a.status,'available'); assert.ok(a.url.startsWith('/downloads/')); assert.equal(a.date,'2026-10-12'); const bytes=readFileSync(new URL('../public'+a.url,import.meta.url)); assert.ok(bytes.length>1000); assert.equal(bytes.subarray(0,a.fileFormat==='PDF'?4:2).toString(),a.fileFormat==='PDF'?'%PDF':'PK'); }
  }
  for(const url of ['javascript:alert(1)','//evil.example','/\\evil.example','data:text/html,test','https://user:password@example.com','https://example.com/\nfoo']) assert.equal(safeArtifactUrl(url),null);
  assert.equal(safeArtifactUrl('/downloads/model.xlsx'),'/downloads/model.xlsx');
  assert.equal(safeArtifactUrl('https://example.com/report'),'https://example.com/report');
});
