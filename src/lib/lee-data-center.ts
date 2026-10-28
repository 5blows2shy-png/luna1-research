import { initialDevelopmentInput, calculateDevelopment, type DevelopmentInput } from './development-model.ts';
import { irr, npv } from './applied-finance.ts';
export const leeTitle = 'Lee Data Center — Site Investment Case';
export const leeHref = '/recruiter/projects/lee-data-center';
export const leeDisclosure = 'Hypothetical development using a publicly listed Midlothian, Virginia parcel. Listing facts are broker-reported; no acquisition, entitlement or electric service is secured. All operating, construction and financing inputs are illustrative portfolio assumptions, not market quotes, lender terms, site feasibility findings or a real development proposal.';
export type LeeDebt = { leverage: number; interestRate: number; feeRate: number; amortizationStart: number; term: number; repayment: 'equal-principal' | 'annuity'; covenant: number; equityDiscountRate: number };
export function initialLeeDebt(): LeeDebt { return { leverage: .45, interestRate: .07, feeRate: .015, amortizationStart: 4, term: 7, repayment: 'equal-principal', covenant: 1.3, equityDiscountRate: .15 }; }
export function initialLeeProject(): DevelopmentInput {
  const a=initialDevelopmentInput();
  Object.assign(a,{startYear:2026,discountRate:.1,exitMultiple:14,sellingCost:.02,revenueRate:260,revenueGrowth:.025,otherRevenuePerMW:0,pue:1.35,powerPrice:.075,cashTaxRate:.25,workingCapitalRate:.05,maintenancePerMW:50000});
  a.phases[0]={name:'Phase 1',mw:10,availableYear:2,preLeasing:false,allocation:[.45,.55,0,0,0,0,0,0,0,0,0],lease:[0,0,.4,.65,.8,.9,.95,.95,.95,.95,.95],utilization:Array(11).fill(.8)};
  a.phases[1]={name:'Phase 2',mw:10,availableYear:4,preLeasing:false,allocation:[0,0,.4,.6,0,0,0,0,0,0,0],lease:[0,0,0,0,.4,.65,.8,.9,.95,.95,.95],utilization:Array(11).fill(.8)};
  const shares=[.04,.16,.2,.04,.07,.08,.12,.03,.03,.01,.04,.08,.03,.07,0];
  a.categories=a.categories.map((c,i)=>({...c,share:shares[i]}));
  const costs=[250000,900000,350000,1100000,400000,350000,1400000,250000,200000];
  a.costs=a.costs.map((c,i)=>({...c,amount:costs[i]}));
  return a;
}
function validateDebt(d:LeeDebt) {
  if(Object.values(d).some(v=>typeof v==='number'&&!Number.isFinite(v))) throw new Error('Enter finite financing assumptions.');
  if(d.leverage<0||d.leverage>.9||d.interestRate<0||d.interestRate>.3||d.feeRate<0||d.feeRate>.1||d.covenant<1||d.covenant>3||d.equityDiscountRate<0||d.equityDiscountRate>1) throw new Error('Check leverage (0–90%), interest (0–30%), fees (0–10%), covenant (1–3x) and equity discount rate (0–100%).');
  if(!Number.isInteger(d.term)||d.term<1||d.term>30||!Number.isInteger(d.amortizationStart)||d.amortizationStart<1||d.amortizationStart>10) throw new Error('Enter whole years: repayment start 1–10 and amortization term 1–30.');
  if(!['equal-principal','annuity'].includes(d.repayment)) throw new Error('Choose a supported repayment method.');
}
export function calculateLee(a:DevelopmentInput,d:LeeDebt) {
  validateDebt(d); const project=calculateDevelopment(a);
  const finalSpend=Math.max(...project.rows.filter(r=>r.Development_CapEx>0).map(r=>r.Year));
  if(d.leverage>0&&d.amortizationStart<=finalSpend) throw new Error('Amortization must start after the final construction draw.');
  const commitment=project.totalCapex*d.leverage,fees=commitment*d.feeRate;
  const payment=d.interestRate===0?commitment/d.term:commitment*d.interestRate/(1-(1+d.interestRate)**-d.term);
  let balance=0,cumulativeEquity=0;
  const rows=project.rows.map(r=>{
    const opening=balance,draw=r.Development_CapEx*d.leverage;
    const interest=(opening+draw*.5)*d.interestRate;
    let principal=r.Year>=d.amortizationStart&&r.Year<d.amortizationStart+d.term?Math.min(opening,d.repayment==='annuity'?Math.max(0,payment-interest):commitment/d.term):0;
    if(r.Year===d.amortizationStart+d.term-1) principal=opening;
    const beforeExit=Math.max(0,opening+draw-principal),exitRepayment=r.Year===project.exitYear?beforeExit:0;
    balance=beforeExit-exitRepayment;
    const debtService=interest+principal,cfads=r.Unlevered_FCF+r.Development_CapEx;
    const fee=r.Year===0?fees:0,equityCash=r.Total_Cash_Flow+draw-debtService-exitRepayment-fee;
    const dscr=r.MW_Available>0&&debtService>1e-8?cfads/debtService:null;
    cumulativeEquity+=equityCash;
    return {...r,Opening_Debt:opening,Debt_Draw:draw,Interest:interest,Principal:principal,Debt_Service:debtService,Exit_Debt_Repayment:exitRepayment,Ending_Debt:balance,CFADS:cfads,DSCR:dscr,Covenant_Breach:dscr!==null&&dscr<d.covenant,Financing_Fee:fee,Equity_Cash_Flow:equityCash,Equity_Contribution:Math.max(0,-equityCash),Equity_Distribution:Math.max(0,equityCash),Cumulative_Equity_Cash_Flow:cumulativeEquity,Debt_Service_Shortfall:r.MW_Available>0?Math.max(0,debtService-cfads):0};
  });
  const equityFlows=rows.slice(0,project.exitYear+1).map(r=>r.Equity_Cash_Flow);
  const contributed=rows.reduce((s,r)=>s+r.Equity_Contribution,0),distributed=rows.reduce((s,r)=>s+r.Equity_Distribution,0);
  const coverage=rows.map(r=>r.DSCR).filter((v):v is number=>v!==null);
  const operatingInterest=rows.filter(r=>r.MW_Available>0).reduce((s,r)=>s+r.Interest,0);
  const constructionInterest=rows.filter(r=>r.MW_Available===0).reduce((s,r)=>s+r.Interest,0);
  const exit=rows[project.exitYear];
  const totalUses=project.totalCapex+fees+constructionInterest;
  return {project,rows,commitment,fees,totalUses,constructionInterest,operatingInterest,initialFundingEquity:totalUses-commitment,contributed,distributed,equityIrr:irr(equityFlows),equityMoic:contributed>0?distributed/contributed:null,equityNpv:npv(d.equityDiscountRate,equityFlows),minimumDscr:coverage.length?Math.min(...coverage):null,breachYears:rows.filter(r=>r.Covenant_Breach).map(r=>r.Year),shortfall:rows.reduce((s,r)=>s+r.Debt_Service_Shortfall,0),exitDebt:exit.Exit_Debt_Repayment,exitEquity:exit.Net_Exit_Proceeds+exit.Working_Capital_Release-exit.Exit_Debt_Repayment,exitCoverage:exit.Exit_Debt_Repayment>0?(exit.Net_Exit_Proceeds+exit.Working_Capital_Release)/exit.Exit_Debt_Repayment:null};
}
export type LeeResult=ReturnType<typeof calculateLee>;
export function leeScenarios(a:DevelopmentInput,d:LeeDebt) {
  return (['Base','Upside','Downside'] as const).map(name=>{
    const p=structuredClone(a), debt={...d};
    if(name!=='Base') { const up=name==='Upside'; p.revenueRate=a.revenueRate!*(up?1.1:.9);p.powerPrice=a.powerPrice!*(up?.9:1.2);p.capexPerMW=a.capexPerMW!*(up?.95:1.1);p.exitMultiple=a.exitMultiple!+(up?2:-2);p.phases=p.phases.map(x=>({...x,lease:x.lease.map(v=>Math.min(1,v!*(up?1.1:.8)))}));debt.interestRate=d.interestRate+(up?-.01:.02); }
    try{return {name,model:calculateLee(p,debt),error:null};}catch(e){return {name,model:null,error:e instanceof Error?e.message:'Invalid scenario'};}
  });
}
export function leeSensitivities(a:DevelopmentInput,d:LeeDebt) {
  const cells:{Analysis:string;Row:number;Column:number;Value:number|null;Error:string|null}[]=[];
  for(const kind of ['Equity IRR · CapEx / lease-up','Minimum DSCR · rate / power','Equity MOIC · exit / lease-up']) for(const x of (kind.startsWith('Minimum')?[-.02,0,.02]:[.9,1,1.1])) for(const y of [.9,1,1.1]){
    const p=structuredClone(a),debt={...d};
    if(kind.startsWith('Minimum')){debt.interestRate=Math.max(0,d.interestRate+x);p.powerPrice=a.powerPrice!*y;}
    else {p.phases=p.phases.map(v=>({...v,lease:v.lease.map(n=>Math.min(1,n!*y))}));if(kind.startsWith('Equity IRR'))p.capexPerMW=a.capexPerMW!*x;else p.exitMultiple=a.exitMultiple!*x;}
    try{const m=calculateLee(p,debt);cells.push({Analysis:kind,Row:x,Column:y,Value:kind.startsWith('Minimum')?m.minimumDscr:kind.startsWith('Equity IRR')?m.equityIrr:m.equityMoic,Error:null});}catch(e){cells.push({Analysis:kind,Row:x,Column:y,Value:null,Error:e instanceof Error?e.message:'Invalid inputs'});}
  }return cells;
}
export function leeExport(a:DevelopmentInput,d:LeeDebt) {
  const scenarios=leeScenarios(a,d);
  return {title:leeTitle,disclosure:leeDisclosure,modelVersion:a.siteCosts?'Site Case 2.0':'1.0',assumptions:{project:a,debt:d},annual:scenarios.flatMap(s=>s.model?s.model.rows.map(r=>({...r,Scenario:s.name})):[]),returns:scenarios.flatMap(s=>s.model?[{Scenario:s.name,Equity_IRR:s.model.equityIrr,Equity_MOIC:s.model.equityMoic,Project_IRR:s.model.project.irr,Project_MOIC:s.model.project.moic,Equity_NPV:s.model.equityNpv,Minimum_DSCR:s.model.minimumDscr,Contributed_Equity:s.model.contributed,Distributed_Equity:s.model.distributed,Debt_Commitment:s.model.commitment,Covenant_Breach_Years:s.model.breachYears.length}]:[]),sensitivities:leeSensitivities(a,d),scenarioStatus:scenarios.map(s=>({Scenario:s.name,Error:s.error}))};
}
