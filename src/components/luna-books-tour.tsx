"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  FileBarChart,
  Landmark,
  PackageSearch,
  Pause,
  Play,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { lunaBooksDemo as demo, tutorialScenes, type DemoValueKind, type ForecastScenario } from "@/lib/luna-books-demo";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ValueTag({ kind, children }: { kind?: DemoValueKind; children?: string }) {
  const label = kind ?? (children as DemoValueKind);
  return <span className={`lbt-value-tag lbt-value-tag--${label.toLowerCase()}`}>{label}</span>;
}

function Metric({ label, value, kind = "Recorded", emphasis = false }: { label: string; value: string; kind?: DemoValueKind; emphasis?: boolean }) {
  return <article className={`lbt-metric${emphasis ? " is-emphasis" : ""}`}><div><span>{label}</span><ValueTag kind={kind} /></div><strong>{value}</strong></article>;
}

function RecommendationCard({ item, rank }: { item: (typeof demo.recommendations)[number]; rank?: number }) {
  return <article className="lbt-recommendation">{rank && <b className="lbt-rank">0{rank}</b>}<div><ValueTag kind="Recommendation" /><h3>{item.action}</h3><p>{item.why}</p><dl><div><dt>Evidence</dt><dd>{item.evidence}</dd></div><div><dt>Estimated impact</dt><dd>{item.impact}</dd></div><div><dt>Urgency</dt><dd>{item.urgency}</dd></div><div><dt>Confidence</dt><dd>{item.confidence}</dd></div></dl></div></article>;
}

function WelcomeScene() {
  return <div className="lbt-dashboard-grid"><div className="lbt-metric-grid"><Metric label="Bank balance" value={money.format(demo.cash.balance)} /><Metric label="Safe to spend" value={money.format(demo.cash.safeToSpend)} kind="Calculated" emphasis /><Metric label="Cash runway" value={`${demo.cash.runwayWeeks} weeks`} kind="Calculated" /><Metric label="Overdue invoices" value={money.format(14_600)} kind="Calculated" /></div><div className="lbt-attention"><span>Needs attention</span><h3>Three decisions could strengthen near-term cash</h3>{demo.recommendations.map((item, index) => <div key={item.action}><b>0{index + 1}</b><p>{item.action}<small>{item.impact}</small></p><ArrowRight aria-hidden /></div>)}</div></div>;
}

function ProfileScene() {
  const items = [["Business name", demo.meta.company], ["Industry", demo.meta.industry], ["Accounting method", demo.meta.accountingMethod], ["Fiscal year", demo.meta.fiscalYear], ["Connected accounts", `${demo.meta.connectedAccounts} demo accounts`], ["Team members", `${demo.meta.teamMembers} active members`]];
  return <div className="lbt-profile"><div className="lbt-company-mark"><Building2 aria-hidden /><span>HS</span></div><div><span className="lbt-kicker">Business workspace</span><h3>{demo.meta.company}</h3><p>Fictional recording profile · No production customer records</p></div><dl>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="lbt-security-note"><ShieldCheck aria-hidden /><div><b>Private demo workspace</b><span>Connections and members shown here are fictional and read-only.</span></div></div></div>;
}

function TransactionsScene() {
  return <div><div className="lbt-toolbar"><span>August activity</span><span>4 transactions · 3 review signals</span></div><div className="lbt-table-wrap"><table className="lbt-table"><thead><tr><th>Date</th><th>Vendor</th><th>Amount</th><th>Category</th><th>Signal</th></tr></thead><tbody>{demo.transactions.map((row, index) => <tr key={`${row.date}-${row.vendor}`} className={index === 0 ? "is-selected" : ""}><td>{row.date}</td><td>{row.vendor}</td><td>{money.format(row.amount)}</td><td><span>{row.category}</span><small>{row.state}</small></td><td><b>{row.signal}</b></td></tr>)}</tbody></table></div><aside className="lbt-explanation"><div><ValueTag>Recorded</ValueTag><p>Coastal Office Supply · {money.format(486.2)}</p></div><div><ValueTag>Calculated</ValueTag><p>Vendor and prior approval history matched.</p></div><div><ValueTag>Recommendation</ValueTag><p>Categorized as Office Supplies based on vendor history and prior approved transactions.</p></div></aside></div>;
}

function CashScene({ runway = false }: { runway?: boolean }) {
  if (runway) return <div className="lbt-runway"><div className="lbt-runway-number"><span>Estimated cash runway</span><strong>{demo.cash.runwayWeeks}</strong><b>weeks</b><ValueTag>Calculated</ValueTag></div><div className="lbt-runway-track"><i style={{ width: "64%" }} /><span style={{ left: "60%" }}>Preferred reserve · 6 weeks</span></div><dl>{[["Current cash", money.format(demo.cash.balance)], ["Upcoming bills", money.format(14_100)], ["Payroll", money.format(4_200)], ["Recurring expenses", money.format(5_650)], ["Expected receivables", money.format(14_600)], ["Inventory purchases", money.format(8_200)]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p className="lbt-caveat">Estimate based on current recorded information. Timing and actual results may vary.</p></div>;
  return <div><div className="lbt-cash-equation"><Metric label="Bank balance" value={money.format(demo.cash.balance)} /><span>−</span><Metric label="Reserved obligations" value={money.format(demo.cash.reservedObligations)} kind="Calculated" /><span>=</span><Metric label="Estimated safe to spend" value={money.format(demo.cash.safeToSpend)} kind="Calculated" emphasis /></div><div className="lbt-obligations"><span>Included upcoming obligations</span>{demo.cash.obligations.map(item => <div key={item.label}><p>{item.label}<small>{item.timing}</small></p><strong>{money.format(item.amount)}</strong></div>)}</div></div>;
}

function ReceivablesScene() {
  return <div className="lbt-two-column"><div><div className="lbt-metric-grid"><Metric label="Overdue invoices" value="3 invoices" kind="Calculated" /><Metric label="Total outstanding" value={money.format(14_600)} kind="Calculated" /></div><div className="lbt-list">{demo.receivables.map((item, index) => <div className={index === 0 ? "is-selected" : ""} key={item.customer}><span>{item.customer}<small>{item.daysOverdue} days overdue</small></span><strong>{money.format(item.amount)}<small>{item.priority}</small></strong></div>)}</div></div><RecommendationCard item={demo.recommendations[0]} /></div>;
}

function BillsScene() {
  return <div className="lbt-bill"><div className="lbt-bill-icon"><ReceiptText aria-hidden /></div><ValueTag>Recorded</ValueTag><span>Supplier payment</span><h3>Northstar Wholesale</h3><strong>{money.format(12_400)}</strong><p>Due next week</p><div className="lbt-security-note"><Check aria-hidden /><div><b>Already included</b><span>This obligation is already included in Luna’s cash outlook.</span></div></div><button disabled>Schedule payment</button><small>Disabled in demo mode · No payment can be initiated</small></div>;
}

function InventoryScene() {
  const parts = [["Healthy", demo.inventory.healthy, "healthy"], ["Slow moving", demo.inventory.slowMoving, "slow"], ["Dead stock", demo.inventory.deadStock, "dead"], ["Excess", demo.inventory.excess, "excess"]] as const;
  return <div className="lbt-inventory"><div><Metric label="Total inventory cost" value={money.format(demo.inventory.total)} /><div className="lbt-inventory-bar">{parts.map(([label,value,tone]) => <i key={label} className={tone} style={{ width: `${value / demo.inventory.total * 100}%` }} title={`${label}: ${money.format(value)}`} />)}</div><div className="lbt-legend">{parts.map(([label,value,tone]) => <div key={label}><i className={tone}/><span>{label}<small>{money.format(value)}</small></span></div>)}</div><Metric label="Estimated recoverable cash" value={money.format(demo.inventory.recoverableCash)} kind="Calculated" emphasis /></div><aside><PackageSearch aria-hidden /><ValueTag>Calculated</ValueTag><h3>{demo.inventory.highlightedSku}</h3><p>{demo.inventory.reason}</p><b>Cash tied up in inventory</b><strong>{money.format(4_560)}</strong></aside></div>;
}

function AffordScene() {
  const a = demo.affordability;
  return <div className="lbt-afford"><div className="lbt-purchase"><span>Decision scenario</span><h3>Inventory purchase</h3><strong>{money.format(a.purchase)}</strong><small>Deterministic demo input</small></div><div className="lbt-before-after">{[["Cash", money.format(a.cashBefore), money.format(a.cashAfter)], ["Runway", `${a.runwayBefore} weeks`, `${a.runwayAfter} weeks`]].map(([label,before,after]) => <div key={label}><span>{label}</span><p><small>Before</small><b>{before}</b></p><ArrowRight aria-hidden /><p><small>After</small><b>{after}</b></p></div>)}<div><span>Estimated margin</span><strong>{a.estimatedMargin}%</strong></div><div><span>Expected payback</span><strong>{a.payback}</strong></div></div><aside><b>{a.risk}</b><h3>Reserve pressure increases</h3><p>This purchase may reduce cash runway below the business’s preferred reserve.</p><ValueTag>Recommendation</ValueTag></aside></div>;
}

function ForecastScene() {
  const [scenario, setScenario] = useState<ForecastScenario>("Expected");
  const chart = demo.forecast[scenario].map((cash, index) => ({ week: `W${index + 1}`, cash }));
  return <div><div className="lbt-forecast-head"><div className="lbt-segmented" role="group" aria-label="Forecast scenario">{(["Expected", "Conservative", "Optimistic"] as const).map(item => <button aria-pressed={scenario === item} key={item} onClick={() => setScenario(item)}>{item}</button>)}</div><div><span>Starting cash</span><strong>{money.format(chart[0].cash)}</strong><span>Week 13 ending cash</span><strong>{money.format(chart.at(-1)?.cash ?? 0)}</strong></div></div><div className="lbt-chart" aria-label={`${scenario} 13-week cash forecast`}><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}><defs><linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#70a89c" stopOpacity={.35}/><stop offset="100%" stopColor="#70a89c" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#2e383b" vertical={false}/><XAxis dataKey="week" tick={{ fill: "#8e999d", fontSize: 10 }} axisLine={false} tickLine={false}/><YAxis tickFormatter={v => `$${Math.round(v/1000)}k`} tick={{ fill: "#8e999d", fontSize: 10 }} axisLine={false} tickLine={false}/><Tooltip formatter={(value) => money.format(Number(value))}/><Area type="monotone" dataKey="cash" stroke="#7ab2a4" strokeWidth={2} fill="url(#cashFill)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><div className="lbt-flow-row">{["Customer receipts", "Operating expenses", "Payroll", "Supplier payments", "Inventory purchases"].map(x => <span key={x}>{x}</span>)}</div><p className="lbt-caveat">Calculated estimate · Forecasts depend on timing and assumptions and are not guarantees.</p></div>;
}

function ActionsScene() { return <div className="lbt-actions">{demo.recommendations.map((item,index) => <RecommendationCard key={item.action} item={item} rank={index+1}/>)}</div>; }

function ReportsScene() {
  return <div className="lbt-reports"><div className="lbt-report-list">{["Profit & Loss", "Balance Sheet", "Cash Flow", "Financial Health Report"].map((name,index) => <div key={name}><FileBarChart aria-hidden /><span>{name}<small>{index === 3 ? "Luna summary" : "Through July 31, 2026"}</small></span><b>View</b></div>)}</div><div className="lbt-connection"><Landmark aria-hidden /><span>QuickBooks</span><h3>Connected</h3><p>Demo connection status only. No OAuth token is loaded.</p><ValueTag>Recorded</ValueTag></div><div className="lbt-connection"><Users aria-hidden /><span>Accountant access</span><h3>Invitation preview</h3><p>Financial reports · Review and comment · No admin access</p><button disabled>Send invitation</button><small>Disabled in demo mode</small></div><div className="lbt-final"><CircleDollarSign aria-hidden /><span>LUNA BOOKS</span><h3>Know your numbers.<br/>Know what needs attention.<br/>Know your next move.</h3><p>Run and understand your business.</p></div></div>;
}

function SceneContent({ id }: { id: string }) {
  if (id === "welcome") return <WelcomeScene />;
  if (id === "profile") return <ProfileScene />;
  if (id === "transactions") return <TransactionsScene />;
  if (id === "cash") return <CashScene />;
  if (id === "runway") return <CashScene runway />;
  if (id === "receivables") return <ReceivablesScene />;
  if (id === "bills") return <BillsScene />;
  if (id === "inventory") return <InventoryScene />;
  if (id === "afford") return <AffordScene />;
  if (id === "forecast") return <ForecastScene />;
  if (id === "actions") return <ActionsScene />;
  return <ReportsScene />;
}

export function LunaBooksTour() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scene = tutorialScenes[index];
  const progress = ((index + 1) / tutorialScenes.length) * 100;
  const titleId = `tour-scene-${scene.id}`;
  const exitHref = "/transaction-intelligence";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex(current => Math.min(current + 1, tutorialScenes.length - 1));
      if (event.key === "ArrowLeft") setIndex(current => Math.max(current - 1, 0));
      if (event.key === "Escape") router.push(exitHref);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  useEffect(() => {
    if (!isPlaying) return;
    if (index === tutorialScenes.length - 1) {
      const finalTimer = window.setTimeout(() => setIsPlaying(false), scene.durationSeconds * 1000);
      return () => window.clearTimeout(finalTimer);
    }
    const timer = window.setTimeout(() => setIndex(current => current + 1), scene.durationSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [index, isPlaying, scene.durationSeconds]);

  const sectionLabel = useMemo(() => `${String(index + 1).padStart(2, "0")} / ${tutorialScenes.length}`, [index]);

  return <div className="lbt-shell" data-demo-mode="isolated" data-testid="luna-books-tour">
    <header className="lbt-topbar"><div className="lbt-brand"><span className="lbt-logo">L</span><div><b>LUNA BOOKS</b><small>{demo.meta.company}</small></div></div><div className="lbt-demo-badge"><ShieldCheck aria-hidden /> Safe demo data</div><a href={exitHref} aria-label="Exit tour"><X aria-hidden /> Exit Tour</a></header>
    <div className="lbt-layout">
      <nav className="lbt-nav" aria-label="Tutorial scenes">{tutorialScenes.map((item,itemIndex) => <button key={item.id} aria-current={itemIndex === index ? "step" : undefined} onClick={() => { setIndex(itemIndex); setIsPlaying(false); }}><span>{String(itemIndex + 1).padStart(2,"0")}</span>{item.navLabel}</button>)}</nav>
      <main className="lbt-main" aria-labelledby={titleId}>
        <div className="lbt-context"><div><span>{scene.navLabel} · {demo.meta.lastUpdated}</span><h1 id={titleId}>{scene.title}</h1><p>{scene.message}</p></div><div><span>{sectionLabel}</span><small>Approx. {scene.durationSeconds}s</small></div></div>
        <section className="lbt-stage" key={scene.id} aria-live="polite"><SceneContent id={scene.id}/></section>
      </main>
    </div>
    <footer className="lbt-controls"><div className="lbt-progress" aria-label={`Scene ${index + 1} of ${tutorialScenes.length}`}><i style={{width:`${progress}%`}}/><span className={isPlaying ? "is-playing" : ""} key={`${scene.id}-${isPlaying}`} style={{ "--scene-duration": `${scene.durationSeconds}s` } as React.CSSProperties}/></div><div><button onClick={() => { setIndex(current => Math.max(current-1,0)); setIsPlaying(false); }} disabled={index === 0}><ArrowLeft aria-hidden /> Previous</button><button onClick={() => { setIndex(0); setIsPlaying(false); }}><RefreshCw aria-hidden /> Restart</button><button className="lbt-autoplay" aria-pressed={isPlaying} onClick={() => setIsPlaying(current => !current)}>{isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}{isPlaying ? "Pause" : "Auto Play"}</button><a href={exitHref}><X aria-hidden /> Exit</a><button className="is-primary" onClick={() => { setIndex(current => Math.min(current+1,tutorialScenes.length-1)); setIsPlaying(false); }} disabled={index === tutorialScenes.length-1}>Next <ArrowRight aria-hidden /></button></div></footer>
  </div>;
}
