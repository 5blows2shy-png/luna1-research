import test from 'node:test';
import assert from 'node:assert/strict';
import { initialExpansionProject, expansionExport } from '../src/lib/lee-expansion.ts';
import { initialLeeDebt, calculateLee, leeScenarios, initialLeeProject } from '../src/lib/lee-data-center.ts';

test('10 MW expansion is incremental and leaves the original campus case intact', () => {
  const project = initialExpansionProject();
  assert.equal(project.phases.reduce((n,p)=>n+p.mw,0),10);
  assert.equal(project.capexPerMW*10,134_400_000);
  assert.equal(project.costs.reduce((n,c)=>n+c.amount,0),2_600_000);
  assert.equal(initialLeeProject().phases.reduce((n,p)=>n+p.mw,0),20);
});

test('expansion exports funded construction, downside results and explicit sources', () => {
  const data = expansionExport();
  const base = data.annual.filter(row=>row.Scenario==='Base');
  assert.equal(base.reduce((n,r)=>n+r.Development_CapEx,0),145_492_000);
  assert.equal(base.reduce((n,r)=>n+r.Debt_Draw,0),65_471_400);
  assert.equal(base[10].Ending_Debt,0);
  assert.ok(data.returns[2].Equity_IRR<data.returns[0].Equity_IRR);
  assert.ok(data.returns[0].Minimum_DSCR<1.3);
  assert.equal(data.sources.length,8);
  assert.ok(data.sources.every(source=>source.url.startsWith('https://')&&source.application));
});

const close=(a,b)=>assert.ok(Math.abs(a-b)<.01,`${a} != ${b}`);
test('parcel acquisition is paid once, separate from non-land construction and exit value',()=>{
 const a=initialExpansionProject(),d=initialLeeDebt(),m=calculateLee(a,d);
 close(a.siteCosts.reduce((s,v)=>s+v,0),11_092_000);
 close(m.rows[0].Development_CapEx,5*13_440_000*.45+10_244_000);
 close(m.rows[1].Development_CapEx,5*13_440_000*.55+848_000);
 close(m.project.capex.reduce((s,r)=>s+r.Development_CapEx,0),145_492_000);
 close(m.project.rows[10].Gross_Exit_Value,m.project.rows[10].EBITDA*14);
 const higher=structuredClone(a);higher.siteCosts[0]+=1_000_000;
 assert.ok(calculateLee(higher,d).equityIrr<m.equityIrr);
 const cases=leeScenarios(a,d);close(cases[1].model.project.totalCapex,134_400_000*.95+11_092_000);
 close(cases[2].model.project.totalCapex,134_400_000*1.1+11_092_000);
});
test('invalid site schedule does not silently understate funding',()=>{
 for(const siteCosts of [[1],Array(11).fill(-1),Array(11).fill(NaN)])assert.throws(()=>calculateLee({...initialExpansionProject(),siteCosts},initialLeeDebt()));
 const a=initialExpansionProject();a.exitYear=6;a.siteCosts[8]=1;assert.throws(()=>calculateLee(a,initialLeeDebt()));
});
