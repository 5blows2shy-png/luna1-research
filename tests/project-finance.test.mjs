import test from 'node:test';
import assert from 'node:assert/strict';
import { dataCenterModel, defaultDataCenter, validateDataCenter, npv } from '../src/lib/applied-finance.ts';
import { financeSensitivities, projectFinanceExport, scenarioModels } from '../src/lib/project-finance-report.ts';
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
const simple={...defaultDataCenter,capex:[{name:'Development',amount:100}],constructionYears:2,capacityMW:1,pue:1,powerPrice:0,revenuePerKWMonth:.01,operatingExpenses:0,maintenance:0,staffing:0,cooling:0,network:0,facility:0,growth:0,utilization:[1,1,1,1,1],life:5,taxRate:.2,workingCapitalPercent:.1,maintenanceCapex:5,depreciablePercent:1,debtPercent:.6,interestRate:.1,debtTerm:4,graceYears:1,amortization:'equal-principal',financingFeePercent:.1,contingencyPercent:0,terminalValue:0};
test('staged funding reconciles sources, uses, debt draws, and sponsor contributions',()=>{
 const m=dataCenterModel(simple);
 near(m.capex,100);near(m.debt,60);near(m.financingFees,6);near(m.constructionInterest,9);near(m.totalUses,115);near(m.equity,55);near(m.fundingGap,0);
 near(m.initialCapex,50);near(m.initialDraw,30);near(m.initialEquityCash,-26);
 near(m.rows[0].debtDraw,30);near(m.rows[0].interest,3);near(m.rows[0].equityCash,-23);
 near(m.rows[1].interest,6);near(m.rows[1].equityCash,-6);
 near(-m.equityFlows.slice(0,3).reduce((s,v)=>s+v,0),m.equity);
 near(m.initialDraw+m.rows.reduce((s,r)=>s+r.debtDraw,0),m.debt);
 near(m.initialCapex+m.rows.reduce((s,r)=>s+r.constructionCapex,0),m.developmentCost);
 for(const r of m.rows) near(r.beginningDebt+r.debtDraw-r.principal,r.endingDebt);
 near(m.rows.reduce((s,r)=>s+r.principal,0),m.debt);near(m.rows.at(-1).endingDebt,0);
});
test('CFADS, levered taxes, working capital and DSCR match a hand-calculated year',()=>{
 const m=dataCenterModel(simple);const r=m.rows[2];
 near(r.revenue,120);near(r.ebitda,120);near(r.depreciation,20);
 near(r.unleveredTaxes,20);near(r.cashTaxes,18.8);near(r.changeWorkingCapital,12);
 near(r.cfads,84.2);near(r.debtService,6);near(r.dscr,84.2/6);
 near(r.fcf,83);near(r.equityCash,78.2);
 assert.equal(m.rows[0].dscr,null);assert.equal(m.rows[1].dscr,null);
 const ratios=m.rows.filter(r=>r.dscr!==null).map(r=>r.dscr);
 near(m.minDscr,Math.min(...ratios));near(m.averageDscr,ratios.reduce((s,v)=>s+v,0)/ratios.length);
});
test('equal-principal, annuity, balloon, and zero-interest schedules amortize exactly',()=>{
 for(const amortization of ['equal-principal','annuity','balloon']) for(const constructionYears of [0,1,3]) for(const interestRate of [0,.1]) {
   const a={...simple,amortization,constructionYears,interestRate};const m=dataCenterModel(a);
   const rows=m.rows.filter(r=>r.operatingYear>0&&r.operatingYear<=a.debtTerm);
   near(rows[0].principal,0);
   near(rows.reduce((s,r)=>s+r.principal,0),m.debt);
   if(amortization==='equal-principal') rows.slice(1).forEach(r=>near(r.principal,20));
   if(amortization==='annuity') rows.slice(1).forEach(r=>near(r.debtService,rows[1].debtService));
   if(amortization==='balloon') { rows.slice(0,-1).forEach(r=>near(r.principal,0));near(rows.at(-1).principal,60); }
   assert.ok(m.rows.every(r=>r.endingDebt>=0));near(m.rows.at(-1).endingDebt,0);
 }
 const m=dataCenterModel({...simple,constructionYears:0,debtTerm:2,graceYears:0,amortization:'annuity'});
 near(m.rows[0].debtService,34.57142857142857);
});
test('exit cash does not inflate CFADS, DSCR, or payback; taxes follow residual book value',()=>{
 const base=dataCenterModel(simple),exit=dataCenterModel({...simple,terminalValue:100});
 const last=exit.rows.at(-1);
 near(last.disposalTax,20);near(last.workingCapitalRelease,12);
 near(last.cfads,base.rows.at(-1).cfads);near(exit.minDscr,base.minDscr);
 near(last.fcf-base.rows.at(-1).fcf,80);near(exit.payback,base.payback);
 near(base.rows.reduce((s,r)=>s+r.changeWorkingCapital,0),last.workingCapitalRelease);
 const partial=dataCenterModel({...simple,depreciablePercent:.5,terminalValue:60});near(partial.rows.at(-1).disposalTax,2);
});
test('financing affects equity but not unlevered project NPV and IRR',()=>{
 const a=dataCenterModel(simple),b=dataCenterModel({...simple,debtPercent:.9,interestRate:.2,financingFeePercent:.2});
 near(a.npv,b.npv);near(a.irr,b.irr);assert.notEqual(a.equityIrr,b.equityIrr);
 near(a.npv,npv(simple.discountRate,a.projectFlows));
});
test('coverage identifies shortfalls and zero-debt coverage remains unavailable',()=>{
 const m=dataCenterModel({...simple,revenuePerKWMonth:.0001});
 assert.ok(m.minDscr<1);assert.ok(m.stressedYears.length);assert.ok(m.operatingShortfall>0);
 const noDebt=dataCenterModel({...simple,debtPercent:0});assert.equal(noDebt.minDscr,null);assert.equal(noDebt.averageDscr,null);assert.deepEqual(noDebt.stressedYears,[]);
 const highThreshold=dataCenterModel({...simple,dscrThreshold:3});assert.ok(highThreshold.stressedYears.length>=dataCenterModel(simple).stressedYears.length);
});
test('invalid financing and tax assumptions are rejected before calculation',()=>{
 for(const patch of [{debtTerm:6},{debtTerm:0},{graceYears:4},{graceYears:1.5},{taxRate:1.1},{workingCapitalPercent:NaN},{financingFeePercent:-.1},{contingencyPercent:Infinity},{amortization:'unsupported'},{dscrThreshold:.9}]) {
   assert.ok(validateDataCenter({...simple,...patch}));assert.throws(()=>dataCenterModel({...simple,...patch}));
 }
});
test('scenario, sensitivity, and export schedules derive from the same model',()=>{
 const scenarios=scenarioModels(defaultDataCenter);assert.deepEqual(scenarios.map(s=>s.name),['Base','Upside','Downside']);
 assert.ok(scenarios[1].model.npv>scenarios[0].model.npv);assert.ok(scenarios[2].model.npv<scenarios[0].model.npv);
 const tables=financeSensitivities(defaultDataCenter);
 assert.ok(tables.coverage[2].values[0]>tables.coverage[0].values[2]);
 near(tables.npv[1].values[1],scenarios[0].model.npv);
 const m=dataCenterModel(simple), exported=JSON.parse(JSON.stringify(projectFinanceExport(simple,m)));
 near(exported.sources.reduce((s,r)=>s+r.amount,0),exported.uses.reduce((s,r)=>s+r.amount,0));
 near(exported.annualSchedule[2].cfads,84.2);assert.equal(exported.status,'Completed');
});
