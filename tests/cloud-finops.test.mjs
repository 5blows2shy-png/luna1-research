import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSpend, optimize, summarize, forecast, sum, scenarioNames } from '../src/lib/cloud-finops.ts';
const near=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
const history=generateSpend();
test('FinOps ledger has 480 unique service-month records and reconciles $1.2m without double counting shared spend',()=>{
 assert.equal(history.length,480);assert.equal(new Set(history.map(r=>`${r.Month}|${r.Workload}|${r.Service}`)).size,480);
 near(sum(history,r=>r.ActualCost),1104000);near(sum(history,r=>r.SharedCost),96000);
 for(let m=1;m<=12;m++) near(sum(history.filter(r=>Number(r.Month.slice(-2))===m),r=>r.SharedCost),8000);
 const base=summarize(history.map(r=>optimize(r,'Baseline')));near(base.spend,1200000);near(base.budget,1164000);near(base.savings,0);
});
test('Optimization waterfall conserves dollars, does not save on showback and keeps each active compute resource within its buffer',()=>{
 for(const s of scenarioNames) for(const r of history.map(r=>optimize(r,s))){
 near(r.Savings,r.IdleSavings+r.RightsizingSavings+r.StorageSavings+r.ReservationSavings);
 near(r.AllocatedCost+r.Savings,r.BaselineAllocatedCost);assert.ok(r.OptimizedDirectCost>=0);
 near(r.SharedCost,history.find(h=>h.Month===r.Month&&h.Workload===r.Workload&&h.Service===r.Service).SharedCost);
 if(r.RemainingCapacity>0) assert.ok(r.OptimizedUtilization<=(s==='Aggressive'?.80:.70)+1e-9);
 if(!r.ReservedEligible)near(r.ReservationSavings,0);
 }
 const totals=scenarioNames.map(s=>summarize(history.map(r=>optimize(r,s))));
 assert.ok(totals[0].spend>totals[1].spend&&totals[1].spend>totals[2].spend);
});
test('Forecast is twelve forward months and uses only the anchor month, with fixed shared overhead',()=>{
 const rows=history.map(r=>optimize(r,'Moderate')), f=forecast(rows,'2026-06',0);
 assert.equal(f.length,120);assert.equal(f[0].Month,'2026-07');assert.equal(f[11].Month,'2027-06');
 near(sum(f,r=>r.ForecastCost),sum(rows.filter(r=>r.Month==='2026-06'),r=>r.AllocatedCost)*12);
 assert.deepEqual(f,forecast(rows.filter(r=>r.Month<='2026-06'),'2026-06',0));
 assert.throws(()=>forecast(rows,'2027-01'));assert.throws(()=>forecast(rows,'2026-12',NaN));
});
test('Cost per workload uses one denominator per workload-month and respects filtered totals',()=>{
 const rows=history.map(r=>optimize(r,'Moderate'));
 near(sum(rows,r=>r.WorkloadUnits),sum(rows.filter(r=>r.Service==='Compute'),r=>r.WorkloadUnits));
 const total=summarize(rows);near(total.costPerUnit*total.units,total.spend);
 near(sum(['AWS','Azure'].map(p=>summarize(rows.filter(r=>r.Provider===p))),r=>r.spend),total.spend);
 const noRows=summarize([]);assert.ok(Object.values(noRows).every(Number.isFinite));
});
