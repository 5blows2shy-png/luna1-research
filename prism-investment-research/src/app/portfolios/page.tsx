"use client";
import { useState } from "react";
import { PageHeader, SectionHeading } from "@/components/site";

type ActivePosition={ticker:string;company:string;thesis:string;risk:string;exitRule:string;status:string};
type Holding={ticker:string;company:string;type:string;horizon:string};
type WatchItem={ticker:string;company:string;status:string;setup:string};

const activePositions:ActivePosition[]=[
  {ticker:"PANW",company:"Palo Alto Networks Inc.",thesis:"Platform consolidation and durable next-generation security demand.",risk:"Medium",exitRule:"Exit if operating evidence or technical structure materially invalidates the thesis.",status:"Monitoring"},
  {ticker:"PDFS",company:"PDF Solutions Inc.",thesis:"Semiconductor analytics adoption and potential revenue acceleration.",risk:"High",exitRule:"Exit on failed technical structure or material deterioration in the revenue thesis.",status:"Monitoring"},
];
const coreAllocation:Holding[]=[
  {ticker:"VOO",company:"Vanguard S&P 500 ETF",type:"Core equity ETF",horizon:"Long term"},
  {ticker:"QQQM",company:"Invesco NASDAQ-100 ETF",type:"Growth equity ETF",horizon:"Long term"},
  {ticker:"IAU",company:"iShares Gold Trust",type:"Real asset",horizon:"Strategic allocation"},
  {ticker:"SLV",company:"iShares Silver Trust",type:"Real asset",horizon:"Strategic allocation"},
  {ticker:"SGOV",company:"iShares 0-3 Month Treasury Bond ETF",type:"Treasury ETF",horizon:"Capital reserve"},
];
const compounders:Holding[]=[
  {ticker:"LLY",company:"Eli Lilly and Company",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"AAPL",company:"Apple Inc.",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"COST",company:"Costco Wholesale Corporation",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"PG",company:"The Procter & Gamble Company",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"AMZN",company:"Amazon.com Inc.",type:"Long-term compounder",horizon:"5+ years"},
];
const watchlist:WatchItem[]=[
  ["ROAD","Construction Partners Inc.","Active research","Near Buy"],["EVR","Evercore Inc.","Research queue","Early Stage"],["VICR","Vicor Corporation","Monitoring","Waiting for Earnings"],["VIAV","Viavi Solutions Inc.","Monitoring","Early Stage"],["ROK","Rockwell Automation Inc.","Research queue","Monitoring Pullback"],["ADPT","Adaptive Biotechnologies Corporation","Monitoring","Early Stage"],["AMKR","Amkor Technology Inc.","Research queue","Monitoring Pullback"],["TECH","Bio-Techne Corporation","Monitoring","Waiting for Earnings"],["ATRO","Astronics Corporation","Active research","Near Buy"],["MRCY","Mercury Systems Inc.","Monitoring","Extended"],["AYI","Acuity Inc.","Research queue","Monitoring Pullback"],["RY","Royal Bank of Canada","Monitoring","Early Stage"],["HOOD","Robinhood Markets Inc.","Monitoring","Extended"],["HLT","Hilton Worldwide Holdings Inc.","Research queue","Waiting for Earnings"],["ANET","Arista Networks Inc.","Active research","Monitoring Pullback"],["AGX","Argan Inc.","Research queue","Near Buy"],["CRDO","Credo Technology Group Holding Ltd.","Monitoring","Extended"],
].map(([ticker,company,status,setup])=>({ticker,company,status,setup}));
const tabs=["Active Trading Portfolio","Long-Term Holdings","Watchlist"];

function HoldingsTable({title,items}:{title:string;items:Holding[]}){return <div className="holding-group"><span className="eyebrow">{title}</span><div className="table-wrap"><table><thead><tr><th>Ticker</th><th>Fund / company</th><th>Investment thesis</th><th>Current allocation</th><th>Average cost</th><th>Holding type</th><th>Time horizon</th></tr></thead><tbody>{items.map(x=><tr key={x.ticker}><td><b>{x.ticker}</b></td><td>{x.company}</td><td className="placeholder-cell">Thesis placeholder</td><td className="placeholder-cell">Allocation placeholder</td><td className="placeholder-cell">Average cost placeholder</td><td>{x.type}</td><td>{x.horizon}</td></tr>)}</tbody></table></div></div>}

export default function Portfolios(){const[activeTab,setActiveTab]=useState("Active Trading Portfolio");return <><PageHeader kicker="Portfolios" title="Conviction made accountable." description="Positions are organized by thesis, entry, risk, and explicit exit rules. All portfolio values are manually updated illustrative placeholders and are not connected to live market data."/><section><div className="tabs" role="tablist" aria-label="Portfolio categories">{tabs.map(tab=><button key={tab} role="tab" aria-selected={activeTab===tab} className={activeTab===tab?"selected":""} onClick={()=>setActiveTab(tab)}>{tab}</button>)}</div>
  {activeTab==="Active Trading Portfolio"&&<div className="table-wrap"><table><caption>Manually updated sample values · no live pricing</caption><thead><tr><th>Ticker / Company</th><th>Shares</th><th>Entry price</th><th>Current price</th><th>Cost basis</th><th>Unrealized return</th><th>Position thesis</th><th>Risk</th><th>Exit rule</th><th>Status</th></tr></thead><tbody>{activePositions.map(p=><tr key={p.ticker}><td><b className="portfolio-ticker">{p.ticker}</b><small className="company-under">{p.company}</small></td><td className="placeholder-cell">Shares placeholder</td><td className="placeholder-cell">Entry placeholder</td><td className="placeholder-cell">Current price placeholder</td><td className="placeholder-cell">Cost basis placeholder</td><td className="placeholder-cell">Return placeholder</td><td className="portfolio-copy">{p.thesis}</td><td>{p.risk}</td><td className="portfolio-copy">{p.exitRule}</td><td><span className="status">{p.status}</span></td></tr>)}</tbody></table></div>}
  {activeTab==="Long-Term Holdings"&&<div className="holdings-stack"><HoldingsTable title="Portfolio 1 · Core Asset Allocation" items={coreAllocation}/><HoldingsTable title="Portfolio 2 · Long-Term Compounders" items={compounders}/></div>}
  {activeTab==="Watchlist"&&<div className="table-wrap"><table><caption>Research watchlist · scores, catalysts, risks, and notes are placeholders</caption><thead><tr><th>Ticker</th><th>Company name</th><th>LUNA Score</th><th>Research status</th><th>Watchlist notes</th><th>Setup status</th><th>Catalyst</th><th>Risk</th></tr></thead><tbody>{watchlist.map(x=><tr key={x.ticker}><td><b>{x.ticker}</b></td><td>{x.company}</td><td className="placeholder-cell">Score placeholder</td><td><span className="status">{x.status}</span></td><td className="placeholder-cell">Notes placeholder</td><td>{x.setup}</td><td className="placeholder-cell">Catalyst placeholder</td><td className="placeholder-cell">Risk placeholder</td></tr>)}</tbody></table></div>}
  </section><section><SectionHeading eyebrow="Portfolio rules" title="The process travels with the position."/><div className="category-grid"><div className="category-card"><span>01</span><h3>Initial thesis</h3><p>Write the business change and expected evidence before entry.</p></div><div className="category-card"><span>02</span><h3>Add level</h3><p>Increase exposure only when the company and stock confirm the thesis.</p></div><div className="category-card"><span>03</span><h3>Risk rule</h3><p>Define what would disprove the thesis, not only a percentage stop.</p></div><div className="category-card"><span>04</span><h3>Exit rule</h3><p>Respond to failed structure, material deterioration, or invalidation.</p></div></div></section></>}
