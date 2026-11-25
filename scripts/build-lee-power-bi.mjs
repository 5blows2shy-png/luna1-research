import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { initialLeeDebt, leeExport, leeDisclosure } from '../src/lib/lee-data-center.ts';
import { initialExpansionProject } from '../src/lib/lee-expansion.ts';
import { infrastructureComparison, initialInfrastructureAssumptions, infrastructureDisclosure, infrastructureSources, leePowerSensitivity } from '../src/lib/lee-infrastructure.ts';
import { rowsToCSV } from '../src/lib/development-export.ts';
const root='reports/lee-data-center';fs.mkdirSync(root,{recursive:true});
const project=initialExpansionProject(), debt=initialLeeDebt();
const data={...leeExport(project,debt),reportAsOf:'2026-11-24',inputBasis:'10 MW Virginia site case; October 28 underwriting assumptions retained'};
const sourcing=infrastructureComparison(project,initialInfrastructureAssumptions());
const power=leePowerSensitivity(project,debt);
// Rebuild only generated report pages; never retain stale visuals from an earlier release.
fs.rmSync(path.join(root,'Lee.Report/definition/pages'),{recursive:true,force:true});
function write(p,obj){const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof obj==='string'?obj.replaceAll('\r\n','\n'):JSON.stringify(obj,null,2)+'\n');}
const schema=(part,version='1.0.0')=>`https://developer.microsoft.com/json-schemas/fabric/item/${part}/${version}/schema.json`;
// PBIP uses the desktop project schema, separate from report definitions.
write('Lee Data Center.pbip',{$schema:'https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json',version:'1.0',artifacts:[{report:{path:'Lee.Report'}}],settings:{enableAutoRecovery:true}});
write('Lee.Report/definition.pbir',{$schema:schema('report/definitionProperties','2.0.0'),version:'4.0',datasetReference:{byPath:{path:'../Lee.SemanticModel'}}});
write('Lee.SemanticModel/definition.pbism',{$schema:schema('semanticModel/definitionProperties'),version:'1.0',settings:{}});
write('data/model.json',data);
write('data/infrastructure.json',{...sourcing,sources:infrastructureSources});
write('data/power-pricing.json',power);
for(const [name,rows] of [['infrastructure-annual',sourcing.annual],['infrastructure-results',sourcing.results],['power-pricing',power]])write(`data/${name}.csv`,rowsToCSV(rows));
for(const key of ['annual','returns','sensitivities'])write(`data/${key}.csv`,rowsToCSV(data[key].map(r=>({...r,Disclosure:leeDisclosure}))));
const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
function table(name,rows,measures=[]){const columns=Object.keys(rows[0]);const kind=k=>typeof rows.find(r=>r[k]!==null)?.[k];const mType=k=>kind(k)==='string'?'text':kind(k)==='boolean'?'logical':'number';const literal=v=>v===null?'null':typeof v==='string'?quote(v):String(v);return {name,columns:columns.map(k=>({name:k,dataType:kind(k)==='string'?'string':kind(k)==='boolean'?'boolean':'double',sourceColumn:k,summarizeBy:'none'})),partitions:[{name,mode:'import',source:{type:'m',expression:[`#table(type table [${columns.map(k=>'#'+quote(k)+' = nullable '+mType(k)).join(', ')}], {`,...rows.map((r,i)=>'  {'+columns.map(k=>literal(r[k])).join(', ')+'}'+(i<rows.length-1?',':'')),'})']}}],measures};}
const scenarioMeasure=expression=>`IF(NOT(ISFILTERED(Results[Scenario])),CALCULATE(${expression},Results[Scenario]="Base"),IF(HASONEVALUE(Results[Scenario]),${expression},BLANK()))`;
const returnMetrics=[['Equity IRR','Equity_IRR','0.0%'],['Equity MOIC','Equity_MOIC','0.00"x"'],['Minimum DSCR','Minimum_DSCR','0.00"x"'],['Breach years','Covenant_Breach_Years','0'],['Equity NPV','Equity_NPV','$#,0;($#,0)']].map(([name,col,formatString])=>({name,expression:scenarioMeasure(`SELECTEDVALUE(Results[${col}])`),formatString}));
const annualMetrics=['Revenue','EBITDA','Power_Cost','CFADS','Debt_Service','Interest','Principal','Ending_Debt','Equity_Cash_Flow','Debt_Draw'].map(col=>({name:col.replaceAll('_',' '),expression:col==='Ending_Debt'?`IF(HASONEVALUE(Annual[Year]),${scenarioMeasure(`SUM(Annual[${col}])`)},BLANK())`:scenarioMeasure(`SUM(Annual[${col}])`),formatString:'$#,0;($#,0)'}));
write('Lee.SemanticModel/model.bim',{name:'Lee Data Center',compatibilityLevel:1600,model:{culture:'en-US',defaultPowerBIDataSourceVersion:'powerBI_V3',tables:[table('Results',data.returns,returnMetrics),table('Annual',data.annual,annualMetrics),
 table('Sourcing',sourcing.results,[['PV Cost','Present_Value_Cost'],['Total Cost','Total_Cost'],['Upfront Cost','Upfront_Cost']].map(([name,col])=>({name,expression:`IF(HASONEVALUE(Sourcing[Option]),SELECTEDVALUE(Sourcing[${col}]),BLANK())`,formatString:'$#,0;($#,0)'}))),
 table('SourcingAnnual',sourcing.annual,sourcing.results.map(r=>({name:r.Option+' Cost',expression:`CALCULATE(SUM(SourcingAnnual[Total_Cost]),SourcingAnnual[Option]="${r.Option}")`,formatString:'$#,0;($#,0)'}))),
 table('Power',power,[['Power Expense','Exit_Power_Cost','$#,0'],['Power EBITDA','Exit_EBITDA','$#,0'],['Power Equity IRR','Equity_IRR','0.0%'],['Power Minimum DSCR','Minimum_DSCR','0.00"x"'],['Power Equity NPV','Equity_NPV','$#,0;($#,0)'],['Power Breach Years','Breach_Years','0']].map(([name,col,formatString])=>({name,expression:`IF(HASONEVALUE(Power[Power_Price]),SELECTEDVALUE(Power[${col}]),BLANK())`,formatString}))) ],relationships:[{name:'Scenario relationship',fromTable:'Annual',fromColumn:'Scenario',toTable:'Results',toColumn:'Scenario',crossFilteringBehavior:'oneDirection'}]}});
write('Lee.Report/StaticResources/RegisteredResources/Luna1.json',{name:'Luna1',dataColors:['#D0BC97','#9AAFBD','#B97D65','#B7C3A6','#EEE8DC'],background:'#101315',foreground:'#F1EDE4',tableAccent:'#D0BC97',visualStyles:{'*':{'*':{background:[{show:true,color:{solid:{color:'#181D20'}},transparency:0}],title:[{show:true,fontColor:{solid:{color:'#F1EDE4'}},fontSize:12,fontFamily:'Segoe UI'}],labels:[{color:{solid:{color:'#F1EDE4'}}}]}}}});
fs.copyFileSync('public/brand/luna1-logo-horizontal.png',path.join(root,'Lee.Report/StaticResources/RegisteredResources/Luna1.png'));
write('Lee.Report/definition/report.json',{$schema:schema('report/definition/report','3.0.0'),themeCollection:{customTheme:{name:'Luna1',reportVersionAtImport:{visual:'2.1.0',page:'2.0.0',report:'3.0.0'},type:'RegisteredResources'}},resourcePackages:[{name:'RegisteredResources',type:'RegisteredResources',items:[{name:'Luna1',path:'Luna1.json',type:'CustomTheme'},{name:'Luna1.png',path:'Luna1.png',type:'Image'}]}]});
write('Lee.Report/definition/version.json',{$schema:schema('report/definition/versionMetadata'),version:'2.0.0'});
const pages=['overview','operations','credit','sourcing','power'];
write('Lee.Report/definition/pages/pages.json',{$schema:schema('report/definition/pagesMetadata'),pageOrder:pages,activePageName:pages[0]});
const expr=value=>({expr:{Literal:{Value:typeof value==='string'?`'${value.replaceAll("'","''")}'`:String(value)}}});
const field=(table,name,measure=true)=>({field:{[measure?'Measure':'Column']:{Expression:{SourceRef:{Entity:table}},Property:name}},queryRef:`${table}.${name}`,displayName:name});
function visual(page,name,type,x,y,width,height,query,title,objects){write(`Lee.Report/definition/pages/${page}/visuals/${name}/visual.json`,{$schema:schema('report/definition/visualContainer','2.1.0'),name,position:{x,y,z:1,width,height,tabOrder:y+x},visual:{visualType:type,...(query?{query:{queryState:Object.fromEntries(Object.entries(query).map(([k,v])=>[k,{projections:v}]))}}:{}),...(objects?{objects}:{}),visualContainerObjects:{...(type==='image'?{background:[{properties:{show:expr(true),color:{solid:{color:expr('#F1EDE4')}},transparency:expr(0)}}]}:{}),title:[{properties:{show:expr(Boolean(title)),text:expr(title),fontColor:{solid:{color:expr('#F1EDE4')}},fontSize:expr(12)}}]}}});}
for(const [i,page] of pages.entries()){
 const name=['01 Investment overview','02 Operating economics','03 Credit review','04 Infrastructure sourcing','05 Power pricing'][i];
 write(`Lee.Report/definition/pages/${page}/page.json`,{$schema:schema('report/definition/page','2.0.0'),name:page,displayName:name,displayOption:'FitToPage',height:900,width:1440,objects:{background:[{properties:{color:{solid:{color:expr('#101315')}},transparency:expr(0)}}]}});
 visual(page,'title','textbox',32,20,1050,90,null,'',{general:[{properties:{paragraphs:[{textRuns:[{value:`LEE DATA CENTER  /  10 MW  /  MIDLOTHIAN, VIRGINIA\n${name}`,textStyle:{fontFamily:'Segoe UI',fontSize:'22pt',color:'#D0BC97'}}]}]}}]});
 visual(page,'logo','image',1190,20,210,70,null,'',{general:[{properties:{imageUrl:{expr:{ResourcePackageItem:{PackageName:'RegisteredResources',PackageType:1,ItemName:'Luna1.png'}}}}}]});
 if(i<3)visual(page,'scenario','slicer',32,120,280,100,{Values:[field('Results','Scenario',false)]},'Scenario (Base when unfiltered)',{selection:[{properties:{singleSelect:expr(true)}}]});
 visual(page,'disclosure','textbox',32,825,1376,65,null,'',{general:[{properties:{paragraphs:[{textRuns:[{value:'LUNA1 RESEARCH  •  Hypothetical portfolio model. All inputs illustrative. No site, utility capacity, lender commitment or personalized investment advice. Investment cards default to Base when unfiltered; choose one scenario. Sourcing and power pages: independent Base assumptions. No live synchronization with browser edits.',textStyle:{fontSize:'10pt',color:'#C3C0B8'}}]}]}}]});
 if(page==='overview'){
  ['Equity IRR','Equity MOIC','Minimum DSCR','Breach years'].forEach((m,j)=>visual(page,'kpi'+j,'card',336+j*267,120,247,100,{Values:[field('Results',m)]},m));
  visual(page,'cashflow','lineChart',32,250,860,370,{Category:[field('Annual','Year',false)],Y:[field('Annual','Equity Cash Flow')]},'Equity cash flow by year');
  visual(page,'returns','tableEx',920,250,488,370,{Values:[field('Results','Scenario',false),field('Results','Equity IRR'),field('Results','Equity MOIC'),field('Results','Minimum DSCR')]},'Scenario investment screen (cards default to Base)');
  visual(page,'decision','textbox',32,645,1376,155,null,'',{general:[{properties:{paragraphs:[{textRuns:[{value:'CREDIT FIRST, EXIT SECOND\nThe starter base case breaches the 1.30x DSCR hurdle. Attractive terminal equity returns do not remove interim debt-service risk. Review cash support, phased draw timing and amortization before underwriting.',textStyle:{fontSize:'16pt',color:'#F1EDE4'}}]}]}}]});
 }else if(page==='operations'){
  visual(page,'profit','lineChart',32,250,870,330,{Category:[field('Annual','Year',false)],Y:[field('Annual','Revenue'),field('Annual','EBITDA')]},'Revenue and EBITDA');
  visual(page,'power','columnChart',930,250,478,330,{Category:[field('Annual','Year',false)],Y:[field('Annual','Power Cost')]},'Power cost');
  visual(page,'operatingtable','tableEx',32,600,1376,205,{Values:[field('Annual','Year',false),field('Annual','Revenue'),field('Annual','EBITDA'),field('Annual','Power Cost'),field('Annual','CFADS')]},'Annual operating cash');
 }else if(page==='credit'){
  visual(page,'coverage','lineChart',32,250,870,330,{Category:[field('Annual','Year',false)],Y:[field('Annual','CFADS'),field('Annual','Debt Service')]},'CFADS versus scheduled debt service');
  visual(page,'balance','columnChart',930,250,478,330,{Category:[field('Annual','Year',false)],Y:[field('Annual','Ending Debt')]},'Year-end debt balance');
  visual(page,'debttable','tableEx',32,600,1376,205,{Values:[field('Annual','Year',false),field('Annual','Debt Draw'),field('Annual','Interest'),field('Annual','Principal'),field('Annual','Ending Debt')]},'Annual debt roll-forward');

 }else if(page==='sourcing'){
  visual(page,'scope','textbox',32,115,1376,110,null,'',{general:[{properties:{paragraphs:[{textRuns:[{value:'ENTERPRISE COST VIEW | Same phased capacity; no tenant rent, financing, taxes or residual value. Analyst pricing and performance proxy, not comparable vendor quotes. Default inputs only.',textStyle:{fontSize:'14pt',color:'#F1EDE4'}}]}]}}]});
  visual(page,'tco','columnChart',32,245,670,340,{Category:[field('Sourcing','Option',false)],Y:[field('Sourcing','PV Cost')]},'Present value of sourcing costs — lower is less costly');
  visual(page,'sourcingflows','lineChart',730,245,678,340,{Category:[field('SourcingAnnual','Year',false)],Y:sourcing.results.map(r=>field('SourcingAnnual',r.Option+' Cost'))},'Annual cash costs — shared demand schedule');
  visual(page,'sourcingtable','tableEx',32,610,1376,195,{Values:[field('Sourcing','Option',false),field('Sourcing','Total Cost'),field('Sourcing','PV Cost'),field('Sourcing','Upfront Cost')]},'Cloud / colocation / owned infrastructure');
 }else if(page==='power'){
  visual(page,'scope','textbox',32,115,1376,110,null,'',{general:[{properties:{paragraphs:[{textRuns:[{value:'BASE INVESTMENT CASE | Electricity $0.05–$0.15/kWh; PUE 1.35. No tenant power reimbursement. Each price reruns annual cash flow, debt coverage and exit value. Stress rates are not tariff quotes.',textStyle:{fontSize:'14pt',color:'#F1EDE4'}}]}]}}]});
  visual(page,'powereconomics','lineChart',32,245,670,330,{Category:[field('Power','Power_Price',false)],Y:[field('Power','Power Expense'),field('Power','Power EBITDA')]},'Year 10 electricity cost and EBITDA vs $/kWh');
  visual(page,'powercredit','lineChart',730,245,678,330,{Category:[field('Power','Power_Price',false)],Y:[field('Power','Power Minimum DSCR')]},'Minimum operating DSCR by power price');
  visual(page,'powertable','tableEx',32,600,1376,205,{Values:[field('Power','Power_Price',false),field('Power','Power Equity IRR'),field('Power','Power Equity NPV'),field('Power','Power Minimum DSCR'),field('Power','Power Breach Years')]},'Price sensitivity — no operating or financing changes');
 }
}
write('README.md',`# Lee Data Center — 10 MW Virginia site case

Report refreshed November 24, 2026. The October 28, 2026 underwriting assumptions remain unchanged. This replaces the earlier 20 MW Houston teaching snapshot.

${leeDisclosure}

## Open and review
Extract the entire archive and open Lee Data Center.pbip in Power BI Desktop on Windows with project support enabled. The model imports embedded Power Query tables; no credentials, absolute local paths or external source are required. Investment cards and annual charts default to Base when the scenario field is unfiltered. Select one scenario to change them; multiple selected scenarios return blank rather than summing ratios. The scenario comparison table evaluates each row independently. The two additional pages use independent default Base inputs and do not respond to the investment scenario slicer.

Five report pages: investment overview, operating economics, credit review, infrastructure sourcing, and power pricing. Luna1 branding and financial disclosure appear on every page. PBIR schema and model reconciliation checks are separate from native Power BI Desktop rendering, DAX execution and refresh, which remain unverified. This is an editable PBIP project, not a verified PBIX or hosted report.

## Current 10 MW model
Two 5 MW phases. Site acquisition/enabling allowances of $11.092 million plus $134.4 million non-land development = $145.492 million CapEx. Base debt commitment: $65.4714 million. Base equity IRR: ${(data.returns[0].Equity_IRR*100).toFixed(4)}%; equity MOIC: ${data.returns[0].Equity_MOIC.toFixed(6)}x; minimum DSCR: ${data.returns[0].Minimum_DSCR.toFixed(6)}x. ${data.returns[0].Covenant_Breach_Years} covenant breach years. ${data.annual.length} annual rows and ${data.returns.length} scenario return rows.

## Decision perspectives
${infrastructureDisclosure}

Sourcing uses open/leased MW converted to server equivalents, with peak installed capacity retained in all options. Cloud uses the same provisioned vCPU-hours (no elasticity/spot/commitment savings), plus storage, egress and support. Colocation includes capacity rental excluding power, metered power and common physical IT hardware/support. Owned includes the full facility development/operation/maintenance plus the same physical IT hardware/support. Cohorts refresh every five years. Physical hardware includes local storage and network allocation; colo rent includes facility connectivity/operations. Annual escalation applies to cloud, colo capacity and hardware; the owned-facility cost assumptions remain those in the Lee model. No terminal property or hardware recovery is credited. Workload performance equivalence, SLA parity and vendor price quotes require diligence. Sources and editable defaults are recorded in data/infrastructure.json. Cost is positive: lower PV cost is less costly under the assumptions, not a sourcing recommendation.

Power-price analysis reruns the Base investment model at each tariff stress with no revenue pass-through, demand reduction or financing change. Electricity = utilized IT MW × 1,000 × 8,760 × PUE. CFADS excludes sale proceeds and development; operating DSCR excludes the exit balloon. Annual cash taxes are a simplified proxy on positive phase EBITDA, without an interest tax shield or loss carryforwards.

## Refresh and reproduce
From the repository run node scripts/build-lee-power-bi.mjs, node --test tests/lee-infrastructure.test.mjs and node scripts/validate-lee-power-bi.mjs. The current inputs come from initialExpansionProject(), not initialLeeProject(). All five semantic-model tables are regenerated from the shared website engines.

CSV and JSON files are audit snapshots. Editing them alone does not update embedded model.bim partitions. Browser controls do not synchronize with the report. For browser-edited investment cases, use the VALUES-ONLY annual and returns CSV exports, not the formula CSVs, and replace the Annual and Results Power Query sources while preserving types, column names and the Results-to-Annual scenario relationship. For edited sourcing or power cases, replace the corresponding table sources as well. Keep Sourcing results and SourcingAnnual detail from the same assumptions. Do not sum ratios or stock balances across periods; Ending Debt requires one Year in context. Sourcing/Power tables intentionally have no relationship to Results.

## References
${infrastructureSources.map(s=>s.title+': '+s.url+' — '+s.use).join('\n')}
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report
`);
fs.mkdirSync('public/downloads',{recursive:true});const zip=path.resolve('public/downloads/lee-data-center-power-bi.zip');if(fs.existsSync(zip))fs.unlinkSync(zip);execFileSync('/usr/bin/zip',['-qr',zip,'Lee Data Center.pbip','Lee.Report','Lee.SemanticModel','data','README.md'],{cwd:root});console.log(zip);
