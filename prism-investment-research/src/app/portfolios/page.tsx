"use client";
import { useState } from "react";
import { PageHeader, SectionHeading } from "@/components/site";

const positions = [
  ["CASY", "$388.00", "Compounder", "Core thesis intact", "Medium"],
  ["PANW", "$321.00", "Active growth", "Add on constructive reclaim", "Medium"],
];

const watchlist = ["PANW", "PDFS", "WWD", "AMAT", "GS", "ROAD", "EVR", "VICR", "VIAV", "ROK", "ADPT", "AMKR", "TECH", "ATRO", "MRCY", "AYI", "RY", "HOOD", "HLT", "ANET", "AGX", "CRDO"];
const tabs = ["Active Trading Portfolio", "Long-Term Compounders", "Watchlist", "Closed Positions"];

export default function Portfolios() {
  const [activeTab, setActiveTab] = useState("Active Trading Portfolio");
  return <>
    <PageHeader kicker="Portfolios" title="Conviction made accountable." description="Positions are organized by thesis, entry, risk, and explicit exit rules. All pricing below is illustrative sample data." />
    <section>
      <div className="tabs" role="tablist" aria-label="Portfolio categories">{tabs.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "selected" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
      {activeTab === "Active Trading Portfolio" && <div className="table-wrap"><table><caption>Illustrative positions · not connected to market data</caption><thead><tr><th>Ticker</th><th>Entry price</th><th>Position type</th><th>Add level</th><th>Risk</th><th>Status</th></tr></thead><tbody>{positions.map((p) => <tr key={p[0]}><td><b>{p[0]}</b></td><td>{p[1]}</td><td>{p[2]}</td><td>{p[3]}</td><td>{p[4]}</td><td><span className="status">Monitoring</span></td></tr>)}</tbody></table></div>}
      {activeTab === "Watchlist" && <div className="watchlist-panel"><div><span className="eyebrow">Current watchlist</span><p>Ticker symbols only · no live market data</p></div><div className="ticker-watchlist">{watchlist.map((ticker) => <span key={ticker}>{ticker}</span>)}</div></div>}
      {(activeTab === "Long-Term Compounders" || activeTab === "Closed Positions") && <div className="empty-portfolio"><span className="eyebrow">{activeTab}</span><h2>No positions listed.</h2><p>This portfolio section is ready for future entries.</p></div>}
    </section>
    <section><SectionHeading eyebrow="Portfolio rules" title="The process travels with the position."/><div className="category-grid"><div className="category-card"><span>01</span><h3>Initial thesis</h3><p>Write the business change and expected evidence before entry.</p></div><div className="category-card"><span>02</span><h3>Add level</h3><p>Increase exposure only when the company and stock confirm the thesis.</p></div><div className="category-card"><span>03</span><h3>Risk rule</h3><p>Define what would disprove the thesis, not only a percentage stop.</p></div><div className="category-card"><span>04</span><h3>Exit rule</h3><p>Respond to failed structure, material deterioration, or invalidation.</p></div></div></section>
  </>;
}
