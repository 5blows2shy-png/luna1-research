"use client";

import { useState, type KeyboardEvent } from "react";
import { MistakeJournal } from "@/components/mistake-journal";
import { PageHeader, SectionHeading } from "@/components/site";

type ActivePosition = { ticker: string; company: string; entryPrice: number; thesis: string; risk: string; exitRule: string; status: string };
type Holding = { ticker: string; company: string; thesis: string; allocation: string; type: string; horizon: string };
type WatchItem = { ticker: string; company: string; status: string; setup: string };

const activePositions: ActivePosition[] = [
  {ticker:"CASY",company:"Casey's General Stores Inc.",entryPrice:824.00,thesis:"Casey’s is a high-quality retail compounder built around convenience stores, fuel, prepared food, and an efficient distribution network. Management plans to add at least 400 stores over fiscal 2027–2029 through acquisitions and new construction, expanding a system that already serves nearly 3,000 locations. The company can improve acquired stores by connecting them to Casey’s purchasing, distribution, prepared-food, and loyalty infrastructure, while the successful CEFCO integration demonstrates management’s ability to execute this strategy. My thesis remains intact while new locations produce profitable growth, prepared-food sales expand, and EBITDA and returns on invested capital continue improving.",risk:"Medium",exitRule:"Exit if profitable store growth, prepared-food expansion, EBITDA, or returns on invested capital materially deteriorate.",status:"Monitoring"},
  {ticker:"PANW",company:"Palo Alto Networks Inc.",entryPrice:272.54,thesis:"Palo Alto Networks is a cybersecurity leader benefiting from enterprise demand for integrated security platforms and AI-related security products. Fiscal Q3 2026 revenue grew 31% to approximately $3.0 billion, while remaining performance obligations increased 36% to $18.4 billion, providing strong visibility into future contracted revenue. Its platformization strategy, recurring revenue base, and high customer switching costs support durable growth as companies consolidate multiple security tools onto fewer strategic vendors. My thesis remains intact while recurring security revenue, customer commitments, free cash flow, and the Stage 2 price trend continue advancing.",risk:"Medium",exitRule:"Exit if recurring security revenue, customer commitments, free cash flow, or the Stage 2 price trend materially deteriorate.",status:"Monitoring"},
  {ticker:"WELL",company:"Welltower Inc.",entryPrice:237.21,thesis:"Welltower is a healthcare real estate compounder benefiting from rising senior-housing demand, limited new supply, and improving property-level economics. In Q1 2026, normalized FFO per share grew 23% year over year to $1.47, while its senior housing operating portfolio produced 22.1% same-store NOI growth and 370 basis points of occupancy improvement. Revenue per occupied room increased 5%, expenses per occupied room rose only 0.4%, and operating margins expanded by 320 basis points, demonstrating meaningful operating leverage. My thesis remains intact while occupancy, normalized FFO, same-store NOI, and returns from new investment activity continue growing.",risk:"Medium",exitRule:"Exit if occupancy, normalized FFO, same-store NOI, or returns from new investment activity materially deteriorate.",status:"Monitoring"},
];

const coreAllocation: Holding[] = [
  {ticker:"VOO",company:"Vanguard S&P 500 ETF",thesis:"Provides broad exposure to large U.S. companies and serves as the portfolio’s core equity foundation. The position is designed to capture long-term economic growth while reducing single-stock risk.",allocation:"30%",type:"Core equity ETF",horizon:"Long term"},
  {ticker:"QQQM",company:"Invesco NASDAQ-100 ETF",thesis:"Provides concentrated exposure to large-cap growth and technology leaders with strong earnings and innovation potential. It complements VOO by increasing participation in secular growth themes such as AI, cloud computing, and digital services.",allocation:"50%",type:"Growth equity ETF",horizon:"Long term"},
  {ticker:"IAU",company:"iShares Gold Trust",thesis:"Provides a strategic allocation to gold as a hedge against inflation, currency weakness, geopolitical uncertainty, and financial-system stress. It is intended to improve diversification because gold may behave differently from stocks and bonds during periods of market instability.",allocation:"10%",type:"Real asset",horizon:"Strategic allocation"},
  {ticker:"SLV",company:"iShares Silver Trust",thesis:"Provides exposure to silver’s dual role as both a precious metal and an industrial commodity. The thesis is supported by potential demand from electrification, solar energy, electronics, and monetary-hedge buying, while recognizing silver’s higher volatility.",allocation:"9%",type:"Real asset",horizon:"Strategic allocation"},
  {ticker:"SGOV",company:"iShares 0-3 Month Treasury Bond ETF",thesis:"Provides short-duration Treasury exposure, capital preservation, and liquidity for future opportunities. It serves as a cash-reserve position that may generate income while limiting interest-rate and credit risk.",allocation:"1%",type:"Treasury ETF",horizon:"Capital reserve"},
];

const compounders: Holding[] = [
  {ticker:"LLY",company:"Eli Lilly and Company",thesis:"Eli Lilly combines a strong pharmaceutical pipeline with leadership in diabetes, obesity, and other high-growth therapeutic markets. The long-term thesis depends on continued innovation, successful drug launches, manufacturing expansion, and durable demand for its major treatments.",allocation:"25%",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"AAPL",company:"Apple Inc.",thesis:"Apple benefits from a powerful global brand, a loyal installed base, recurring services revenue, and a tightly integrated hardware and software ecosystem. Its long-term value creation is supported by pricing power, strong free cash flow, share repurchases, and continued expansion into services and new product categories.",allocation:"20%",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"COST",company:"Costco Wholesale Corporation",thesis:"Costco’s membership model creates recurring revenue, customer loyalty, and a durable cost advantage built on high sales volume and limited product markups. Long-term growth can come from new warehouses, membership-fee increases, international expansion, and continued gains in traffic and renewal rates.",allocation:"20%",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"PG",company:"The Procter & Gamble Company",thesis:"Procter & Gamble owns a diversified portfolio of essential consumer brands with recurring demand, global distribution, and significant pricing power. The company is positioned as a defensive compounder supported by steady cash flow, productivity improvements, dividends, and consistent capital returns.",allocation:"15%",type:"Long-term compounder",horizon:"5+ years"},
  {ticker:"AMZN",company:"Amazon.com Inc.",thesis:"Amazon combines leadership in e-commerce, cloud computing, digital advertising, logistics, and subscription services. The long-term thesis is driven by AWS growth, expanding operating margins, greater efficiency in fulfillment, and continued monetization of its large customer ecosystem.",allocation:"20%",type:"Long-term compounder",horizon:"5+ years"},
];

const watchlist: WatchItem[] = [
  ["AIPO","Defiance AI & Power Infrastructure ETF","Watchlist","Monitoring"],["GLW","Corning Incorporated","Watchlist","Monitoring"],["STRL","Sterling Infrastructure Inc.","Watchlist","Monitoring"],["ALAB","Astera Labs Inc.","Watchlist","Monitoring"],["JBL","Jabil Inc.","Watchlist","Monitoring"],["RY","Royal Bank of Canada","Watchlist","Monitoring"],["PANW","Palo Alto Networks Inc.","Watchlist","Monitoring"],["PDFS","PDF Solutions Inc.","Watchlist","Monitoring"],["ANET","Arista Networks Inc.","Watchlist","Monitoring"],["WWD","Woodward Inc.","Watchlist","Monitoring"],["AMAT","Applied Materials Inc.","Watchlist","Monitoring"],["GS","The Goldman Sachs Group Inc.","Watchlist","Monitoring"],
].map(([ticker, company, status, setup]) => ({ticker, company, status, setup}));

const tabs = ["Overview", "Active Positions", "Watchlist", "Long-Term Compounders", "Mistake Journal"] as const;
type PortfolioTab = typeof tabs[number];

function HoldingsTable({ title, items }: { title: string; items: Holding[] }) {
  return <div className="holding-group"><span className="eyebrow">{title}</span><div className="table-wrap"><table><caption>Illustrative model allocation · educational use only</caption><thead><tr><th>Ticker</th><th>Fund / company</th><th>Investment thesis</th><th>Current allocation</th><th>Holding type</th><th>Time horizon</th></tr></thead><tbody>{items.map((item) => <tr key={item.ticker}><td><b>{item.ticker}</b></td><td>{item.company}</td><td className="portfolio-copy">{item.thesis}</td><td><b>{item.allocation}</b></td><td>{item.type}</td><td>{item.horizon}</td></tr>)}</tbody></table></div></div>;
}

function Overview() {
  return <div className="portfolio-overview"><div className="placeholder-banner">Portfolio information is manually entered and may be delayed or illustrative. Past results do not predict future performance.</div><div className="portfolio-overview-grid"><article><span className="eyebrow">Active positions</span><strong>{activePositions.length}</strong><p>Each position is governed by a written thesis, risk assessment, and exit rule.</p></article><article><span className="eyebrow">Long-term holdings</span><strong>{coreAllocation.length + compounders.length}</strong><p>Core asset allocation and concentrated long-term compounders are reviewed separately.</p></article><article><span className="eyebrow">Research watchlist</span><strong>{watchlist.length}</strong><p>Candidates remain in research until evidence, valuation, and structure align.</p></article><article><span className="eyebrow">Decision reviews</span><strong>1</strong><p>Post-investment reviews translate execution errors into explicit process changes.</p></article></div></div>;
}

export default function Portfolios() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("Overview");

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex]);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
  }

  return <>
    <PageHeader kicker="Portfolio Dashboard" title="Conviction made accountable." description="Positions, performance, and decision reviews are organized around evidence, explicit risk, and repeatable process."/>
    <section>
      <div className="tabs portfolio-tabs" role="tablist" aria-label="Portfolio Dashboard sections" onKeyDown={handleTabKeyDown}>
        {tabs.map((tab) => <button id={`tab-${tab.toLowerCase().replaceAll(" ", "-")}`} key={tab} role="tab" aria-selected={activeTab === tab} aria-controls="portfolio-tab-panel" tabIndex={activeTab === tab ? 0 : -1} className={activeTab === tab ? "selected" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>
      <div id="portfolio-tab-panel" className="portfolio-tab-panel" role="tabpanel" aria-labelledby={`tab-${activeTab.toLowerCase().replaceAll(" ", "-")}`}>
        {activeTab === "Overview" && <Overview/>}
        {activeTab === "Active Positions" && <div className="table-wrap"><table><caption>Active positions and manually entered entry prices</caption><thead><tr><th>Ticker / Company</th><th>Entry price</th><th>Position thesis</th><th>Risk</th><th>Exit rule</th><th>Status</th></tr></thead><tbody>{activePositions.map((position) => <tr key={position.ticker}><td><b className="portfolio-ticker">{position.ticker}</b><small className="company-under">{position.company}</small></td><td>${position.entryPrice.toFixed(2)}</td><td className="portfolio-copy">{position.thesis}</td><td>{position.risk}</td><td className="portfolio-copy">{position.exitRule}</td><td><span className="status">{position.status}</span></td></tr>)}</tbody></table></div>}
        {activeTab === "Long-Term Compounders" && <div className="holdings-stack"><HoldingsTable title="Portfolio 1 · Core Asset Allocation" items={coreAllocation}/><HoldingsTable title="Portfolio 2 · Long-Term Compounders" items={compounders}/></div>}
        {activeTab === "Watchlist" && <div className="table-wrap"><table><caption>Research watchlist · scores, catalysts, risks, and notes are placeholders</caption><thead><tr><th>Ticker</th><th>Company name</th><th>LUNA Score</th><th>Research status</th><th>Watchlist notes</th><th>Setup status</th><th>Catalyst</th><th>Risk</th></tr></thead><tbody>{watchlist.map((item) => <tr key={item.ticker}><td><b>{item.ticker}</b></td><td>{item.company}</td><td className="placeholder-cell">Score placeholder</td><td><span className="status">{item.status}</span></td><td className="placeholder-cell">Notes placeholder</td><td>{item.setup}</td><td className="placeholder-cell">Catalyst placeholder</td><td className="placeholder-cell">Risk placeholder</td></tr>)}</tbody></table></div>}
        {activeTab === "Mistake Journal" && <MistakeJournal/>}
      </div>
    </section>
    <section><SectionHeading eyebrow="Portfolio rules" title="The process travels with the position."/><div className="category-grid"><div className="category-card"><span>01</span><h3>Initial thesis</h3><p>Write the business change and expected evidence before entry.</p></div><div className="category-card"><span>02</span><h3>Add level</h3><p>Increase exposure only when the company and stock confirm the thesis.</p></div><div className="category-card"><span>03</span><h3>Risk rule</h3><p>Define what would disprove the thesis, not only a percentage stop.</p></div><div className="category-card"><span>04</span><h3>Exit rule</h3><p>Respond to failed structure, material deterioration, or invalidation.</p></div></div></section>
  </>;
}
