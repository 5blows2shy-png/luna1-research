import test from 'node:test';
import assert from 'node:assert/strict';
import { initialDevelopmentInput, initialDevelopmentScenarios, calculateDevelopment, validateDevelopment, applyDevelopmentScenario, evaluateDevelopment, developmentSensitivities, operatingPayback, developmentDisclosure } from '../src/lib/development-model.ts';
import { developmentExport, rowsToCSV } from '../src/lib/development-export.ts';
import { publicPowerBIUrl } from '../src/lib/power-bi.ts';
import { isPublicResearch, publicChallengeArtifacts } from '../src/lib/research-challenge-publication.ts';

const near = (a,b,t=1e-7) => assert.ok(Math.abs(a-b)<t, `${a} != ${b}`);
function fixture() {
  const a=initialDevelopmentInput();
  Object.assign(a,{capexPerMW:100,discountRate:.1,exitYear:10,exitMultiple:2,sellingCost:.1,revenueRate:100,revenueUnit:'mw-year',revenueGrowth:0,otherRevenuePerMW:0,pue:1,powerPrice:0,cashTaxRate:0,workingCapitalRate:.1,maintenancePerMW:1});
  a.costs.forEach(c=>c.amount=0);
  a.phases.forEach((p,i)=>{p.mw=1;p.availableYear=i?3:1;p.allocation=Array(11).fill(0);if(i){p.allocation[1]=.3;p.allocation[2]=.7;}else p.allocation[0]=1;p.lease=Array.from({length:11},(_,y)=>y>=p.availableYear?1:0);p.utilization=Array(11).fill(.5);});
  return a;
}
test('supplied 20 MW / $240M scope does not fabricate unknown operating inputs',()=>{
  const a=initialDevelopmentInput();assert.equal(a.phases.reduce((s,p)=>s+p.mw,0)*a.capexPerMW,240e6);
  assert.equal(a.revenueRate,null);assert.equal(a.exitMultiple,null);assert.ok(a.phases.every(p=>p.allocation.every(v=>v===null)));
  assert.ok(validateDevelopment(a).length);assert.throws(()=>calculateDevelopment(a));assert.throws(()=>developmentExport(a,initialDevelopmentScenarios()));
});
test('independent construction timing and annual cash flows reconcile by hand',()=>{
  const a=fixture(),r=calculateDevelopment(a);
  assert.deepEqual(r.rows.map(y=>y.Development_CapEx),[100,30,70,0,0,0,0,0,0,0,0]);
  assert.equal(r.rows[1].MW_Available,1);assert.equal(r.rows[2].MW_Under_Construction,1);assert.equal(r.rows[3].MW_Available,2);
  assert.deepEqual(r.rows.map(y=>y.Unlevered_FCF),[-100,59,29,188,198,198,198,198,198,198,198]);
  assert.equal(r.rows[10].Gross_Exit_Value,400);assert.equal(r.exitValue,360);assert.equal(r.rows[10].Working_Capital_Release,20);assert.equal(r.rows[10].Total_Cash_Flow,578);
  near(r.npv,[-100,59,29,188,198,198,198,198,198,198,578].reduce((s,f,y)=>s+f/1.1**y,0));
  assert.equal(r.invested,100);assert.equal(r.realized,2042);near(r.moic,20.42);
  assert.equal(r.totalCapex,200);assert.equal(r.rows[10].Remaining_Development_Spend,0);
  for(const row of r.rows)for(const key of ['Revenue','EBITDA','Development_CapEx','Unlevered_FCF','Total_Cash_Flow','Net_Exit_Proceeds'])near(row[key],r.phaseRows.filter(p=>p.Year===row.Year).reduce((s,p)=>s+p[key],0));
  near(r.capex.reduce((s,c)=>s+c.Development_CapEx,0),200);
});
test('revenue unit conversions, utilization and physical power are consistent',()=>{
  const a=fixture(),base=calculateDevelopment(a);
  for(const [unit,factor]of [['kw-month',12000],['kw-year',1000],['mw-month',12],['mw-year',1]])near(calculateDevelopment({...a,revenueUnit:unit,revenueRate:100/factor}).npv,base.npv);
  const utilized=calculateDevelopment({...a,revenueBasis:'utilized'});near(utilized.rows[3].Revenue,100);
  const power=calculateDevelopment({...a,pue:1.4,powerPrice:.01,revenueRate:1e6});near(power.rows[1].IT_Energy_kWh,4380000);near(power.rows[1].Facility_Energy_kWh,6132000);near(power.rows[1].Power_Cost,61320);
});
test('preleasing is explicit and never generates early revenue or energy',()=>{
  const a=fixture();a.phases[1].lease[1]=.8;assert.ok(validateDevelopment(a).some(x=>x.includes('pre-leasing')));
  a.phases[1].preLeasing=true;const r=calculateDevelopment(a).phaseRows.find(r=>r.Phase_ID===2&&r.Year===1);
  assert.equal(r.MW_Leased,.8);assert.equal(r.MW_Available,0);assert.equal(r.Revenue,0);assert.equal(r.Facility_Energy_kWh,0);
});
test('cost bases and cash tax proxy remain unlevered',()=>{
  const a=fixture();a.revenueRate=1000;a.cashTaxRate=.25;a.costs[0]={name:'Fixed',basis:'fixed',amount:100};a.costs[1]={name:'Variable',basis:'per-utilized-mw',amount:20};a.costs[2]={name:'Share',basis:'revenue-share',amount:.1};
  const r=calculateDevelopment(a).rows[1];near(r.Total_Opex,160);near(r.EBITDA,840);near(r.Cash_Taxes,210);near(r.Unlevered_FCF,499);
  assert.equal('Debt' in r,false);
});
test('consolidated exit EBITDA, rather than sum of positive phase EBITDA, drives value',()=>{
  const a=fixture();a.costs[0].amount=40;a.phases[1].lease.fill(0);const r=calculateDevelopment(a);
  near(r.rows[10].EBITDA,60);near(r.rows[10].Gross_Exit_Value,120);near(r.exitValue,108);
  a.costs[0].amount=400;assert.throws(()=>calculateDevelopment(a),/Exit EBITDA/);a.exitMultiple=0;assert.equal(calculateDevelopment(a).exitValue,0);
});
test('early exit stops operations, releases working capital once and cannot hide construction spend',()=>{
  const a=fixture();a.exitYear=5;const r=calculateDevelopment(a);assert.equal(r.rows[5].Working_Capital_Release,20);
  for(const row of r.rows.slice(6))for(const key of ['Revenue','Unlevered_FCF','Total_Cash_Flow','Working_Capital_Release'])assert.equal(row[key],0);
  a.exitYear=2;assert.ok(validateDevelopment(a).length);assert.throws(()=>calculateDevelopment(a));
});
test('incomplete, nonfinite and impossible allocations do not produce outputs',()=>{
  for(const mutate of [a=>a.phases[0].allocation[0]=.5,a=>a.phases[0].allocation[1]=.1,a=>a.phases[0].utilization[4]=null,a=>a.pue=.9,a=>a.revenueRate=Infinity,a=>a.exitYear=3.5,a=>a.categories[0].share=.1,a=>a.phases[1].mw=-2,a=>a.costs[0].amount=null]){const a=fixture();mutate(a);assert.ok(validateDevelopment(a).length);assert.throws(()=>calculateDevelopment(a));}
});
test('neutral scenarios match base and delay never silently truncates investment',()=>{
  const a=fixture(),snapshot=JSON.stringify(a),base=calculateDevelopment(a);for(const s of initialDevelopmentScenarios())near(evaluateDevelopment(a,s).result.npv,base.npv);
  const scenario={...initialDevelopmentScenarios()[2],delay:2,leaseFactor:.8};const adjusted=applyDevelopmentScenario(a,scenario);assert.equal(adjusted.phases[0].availableYear,3);assert.equal(adjusted.phases[0].allocation[2],1);assert.equal(adjusted.phases[1].lease[5],.8);assert.equal(JSON.stringify(a),snapshot);
  assert.equal(evaluateDevelopment(a,{...scenario,delay:10}).result,null);
});
test('three sensitivity matrices have reconciling center cells and valid break-even roots',()=>{
  const a=fixture(),r=calculateDevelopment(a),cells=developmentSensitivities(a);assert.equal(cells.length,27);
  for(const metric of ['IRR','NPV','MOIC'])near(cells.find(c=>c.Metric===metric&&c.Row_Value===1&&c.Column_Value===1).Value,r[metric.toLowerCase()]);
  assert.ok(r.breakEvenCapexPerMW>0);near(calculateDevelopment({...a,capexPerMW:r.breakEvenCapexPerMW}).npv,0,1e-6);
  const expensive={...a,capexPerMW:2000};const e=calculateDevelopment(expensive);assert.ok(e.breakEvenExitMultiple>0);near(calculateDevelopment({...expensive,exitMultiple:e.breakEvenExitMultiple}).npv,0,1e-6);
});
test('payback handles deferred first investment and later deficits; nonconventional IRR is withheld',()=>{
  assert.equal(operatingPayback([0,0,-100,50,100]),3.5);assert.equal(operatingPayback([-100,150,-100,0]),null);
  const a=fixture();a.phases[1].allocation.fill(0);a.phases[1].allocation[2]=1;a.phases[1].mw=20;assert.equal(calculateDevelopment(a).irr,null);
});
test('Power BI exports contain disclosures, consistent fact grains, invalid scenario states and safe CSV',()=>{
  const a=fixture(),scenarios=initialDevelopmentScenarios();scenarios[2].delay=10;const out=developmentExport(a,scenarios);
  assert.equal(out.disclosure,developmentDisclosure);assert.equal(out.tables.FACT_FINANCIALS.length,44);assert.equal(out.tables.FACT_RETURNS.length,2);assert.equal(out.tables.FACT_SENSITIVITY.length,27);
  assert.equal(out.tables.Scenario_Status[2].Status,'Invalid assumptions');
  near(out.tables.FACT_CAPEX.filter(r=>r.Scenario==='Base').reduce((s,r)=>s+r.Development_CapEx,0),calculateDevelopment(a).totalCapex);
  const csv=rowsToCSV([{Name:'=HYPERLINK("bad")',Value:-10,Other:null}]);assert.ok(csv.includes("'=HYPERLINK"));assert.ok(csv.includes('"-10"'));assert.ok(csv.endsWith('""'));
});
test('Power BI accepts only approved-domain public report URL shapes',()=>{
  assert.equal(publicPowerBIUrl('https://app.powerbi.com/view?r=abc_123'),'https://app.powerbi.com/view?r=abc_123');
  for(const bad of ['javascript:alert(1)','https://app.powerbi.com.evil.test/view?r=x','https://user:pass@app.powerbi.com/view?r=x','http://app.powerbi.com/view?r=x','https://app.powerbi.com/view?r=x&access_token=secret','https://app.powerbi.com/reportEmbed?reportId=x','https://app.powerbi.com/view?r='])assert.equal(publicPowerBIUrl(bad),null);
});
test('Research Challenge evidence requires explicit public approval, publication, availability and a safe URL',()=>{
  const a={title:'Approved model',category:'DCF',description:'Reviewed',approvedForPublicUse:true,publication:'published',status:'available',url:'/downloads/model.xlsx',fileName:'model.xlsx',fileFormat:'XLSX',fileSize:null,version:'1'};
  const variants=[a,{...a,approvedForPublicUse:false},{...a,publication:'draft'},{...a,status:'in-progress'},{...a,url:'javascript:alert(1)'}];assert.deepEqual(publicChallengeArtifacts(variants),[a]);
  assert.equal(isPublicResearch({approvedForPublicUse:true,publication:'draft'}),false);assert.equal(isPublicResearch({approvedForPublicUse:false,publication:'published'}),false);
});
