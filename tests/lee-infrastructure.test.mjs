import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initialExpansionProject } from '../src/lib/lee-expansion.ts';
import { calculateLee, initialLeeDebt } from '../src/lib/lee-data-center.ts';
import { infrastructureComparison, initialInfrastructureAssumptions, leePowerSensitivity } from '../src/lib/lee-infrastructure.ts';
const a=initialExpansionProject(),d=initialLeeDebt(),p=initialInfrastructureAssumptions();
const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-7*Math.max(1,Math.abs(y)),`${x} != ${y}`);

test('sourcing options use identical provisioned demand and reconcile TCO components',()=>{
 const model=infrastructureComparison(a,p);
 for(let year=0;year<=10;year++){
  const rows=model.annual.filter(r=>r.Year===year);
  assert.equal(new Set(rows.map(r=>r.vCPU_Hours)).size,1);
  for(const r of rows){
   close(r.Total_Cost,r.Facility_CapEx+r.Hardware_CapEx+r.Power_Cost+r.Colocation_Rent+r.Facility_Opex+r.Maintenance_CapEx+r.Cloud_Compute+r.Cloud_Storage+r.Cloud_Egress+r.Support+r.Setup_Cost);
   close(r.Discounted_Cost,r.Total_Cost/(1+a.discountRate)**year);
  }
 }
 for(const result of model.results){const rows=model.annual.filter(r=>r.Option===result.Option);close(result.Total_Cost,rows.reduce((s,r)=>s+r.Total_Cost,0));close(result.Present_Value_Cost,rows.reduce((s,r)=>s+r.Discounted_Cost,0));}
 const owned=model.results.find(r=>r.Option==='Owned infrastructure');close(owned.Facility_CapEx,145492000);
 assert.ok(model.annual.filter(r=>r.Option==='Cloud').every(r=>r.Hardware_CapEx===0&&r.Power_Cost===0&&r.Facility_CapEx===0));
 const physical=model.annual.filter(r=>r.Option==='Owned infrastructure'),colo=model.annual.filter(r=>r.Option==='Colocation');
 physical.forEach((r,i)=>{close(r.Hardware_CapEx,colo[i].Hardware_CapEx);close(r.Power_Cost,colo[i].Power_Cost);});
});
test('hardware cohorts refresh after five years and peak provisioned capacity is retained',()=>{
 const model=infrastructureComparison(a,p),rows=model.annual.filter(r=>r.Option==='Colocation');
 assert.equal(rows[2].Added_Servers,4000);assert.equal(rows[7].Refreshed_Servers,4000);
 assert.ok(rows.slice(0,7).every(r=>r.Refreshed_Servers===0));
 const lower=structuredClone(a);lower.phases=lower.phases.map(phase=>({...phase,lease:phase.lease.map((v,y)=>y>=8?.2:v)}));
 const decline=infrastructureComparison(lower,p).annual.filter(r=>r.Option==='Colocation');
 assert.equal(decline[10].Provisioned_Servers,decline[7].Provisioned_Servers);
 const early=infrastructureComparison({...a,exitYear:6},p);assert.equal(early.annual.length,21);assert.ok(early.annual.every(r=>r.Refreshed_Servers===0));
});
test('sourcing prices affect their own cost components without changing Lee investment returns',()=>{
 const original=calculateLee(a,d),base=infrastructureComparison(a,p);
 const high=infrastructureComparison(a,{...p,cloudVcpuHour:p.cloudVcpuHour*2});
 assert.ok(high.results[0].Present_Value_Cost>base.results[0].Present_Value_Cost);
 close(high.results[1].Present_Value_Cost,base.results[1].Present_Value_Cost);close(high.results[2].Present_Value_Cost,base.results[2].Present_Value_Cost);
 const noDiscount=infrastructureComparison({...a,discountRate:0},p);noDiscount.results.forEach(r=>close(r.Present_Value_Cost,r.Total_Cost));
 close(calculateLee(a,d).equityIrr,original.equityIrr);
 for(const change of [{serverKW:0},{refreshYears:0},{refreshYears:2.5},{cloudVcpuHour:NaN},{coloPue:.8},{hardwareSupport:2}])assert.throws(()=>infrastructureComparison(a,{...p,...change}));
});
test('power sensitivity current point reconciles and higher rates lower EBITDA and credit coverage',()=>{
 const base=calculateLee(a,d),rows=leePowerSensitivity(a,d),current=rows.find(r=>r.Is_Current);
 close(current.Equity_IRR,base.equityIrr);close(current.Equity_NPV,base.equityNpv);close(current.Minimum_DSCR,base.minimumDscr);
 assert.equal(current.Breach_Years,6);
 for(let i=1;i<rows.length;i++){
  const prev=rows[i-1],now=rows[i];assert.equal(now.Status,'Calculated');
  close(now.Exit_Power_Cost-prev.Exit_Power_Cost,(now.Power_Price-prev.Power_Price)*now.Exit_Facility_kWh);
  close(prev.Exit_EBITDA-now.Exit_EBITDA,now.Exit_Power_Cost-prev.Exit_Power_Cost);
  assert.ok(now.Equity_NPV<prev.Equity_NPV);assert.ok(now.Minimum_DSCR<=prev.Minimum_DSCR);
 }
 const custom=leePowerSensitivity({...a,powerPrice:.0825},d);assert.equal(custom.length,6);assert.equal(custom.filter(r=>r.Is_Current).length,1);
 const failed=leePowerSensitivity({...a,powerPrice:10},d).find(r=>r.Is_Current);assert.notEqual(failed.Status,'Calculated');assert.equal(failed.Equity_NPV,null);
});
test('Power BI report embeds the 10 MW model and both shared analysis engines',()=>{
 const root='reports/lee-data-center/';const data=JSON.parse(fs.readFileSync(root+'data/model.json','utf8'));
 assert.equal(data.assumptions.project.phases.reduce((s,p)=>s+p.mw,0),10);
 close(data.annual.filter(r=>r.Scenario==='Base').reduce((s,r)=>s+r.Development_CapEx,0),145492000);
 close(data.returns[0].Equity_IRR,calculateLee(a,d).equityIrr);
 assert.deepEqual(JSON.parse(fs.readFileSync(root+'data/power-pricing.json','utf8')),leePowerSensitivity(a,d));
 const sourcing=JSON.parse(fs.readFileSync(root+'data/infrastructure.json','utf8'));assert.deepEqual(sourcing.annual,infrastructureComparison(a,p).annual);
 const bim=JSON.parse(fs.readFileSync(root+'Lee.SemanticModel/model.bim','utf8'));
 assert.deepEqual(bim.model.tables.map(t=>t.name),['Results','Annual','Sourcing','SourcingAnnual','Power']);
 const dataTables=[data.returns,data.annual,sourcing.results,sourcing.annual,leePowerSensitivity(a,d)];
 bim.model.tables.forEach((table,index)=>{
  const rows=table.partitions[0].source.expression.slice(1,-1).map(line=>JSON.parse(line.trim().replace(/^\{/, '[').replace(/\},?$/,']')));
  assert.deepEqual(rows,dataTables[index].map(r=>table.columns.map(c=>r[c.name])));
 });
 assert.match(bim.model.tables.find(t=>t.name==='Annual').measures.find(m=>m.name==='Ending Debt').expression,/HASONEVALUE\(Annual\[Year\]\)/);
 assert.equal(bim.model.relationships.length,1,'Sourcing and power are independent Base analyses');
 const pages=JSON.parse(fs.readFileSync(root+'Lee.Report/definition/pages/pages.json','utf8'));assert.equal(pages.pageOrder.length,5);
 for(const page of pages.pageOrder){const title=fs.readFileSync(`${root}Lee.Report/definition/pages/${page}/visuals/title/visual.json`,'utf8');assert.match(title,/10 MW/);assert.doesNotMatch(title,/HOUSTON/);}
});
