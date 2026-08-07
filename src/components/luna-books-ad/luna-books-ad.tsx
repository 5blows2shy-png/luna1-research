"use client";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  Check,
  ReceiptText,
  TrendingDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatAdCurrency,
  harborSupplyDemo as demo,
  LUNA_BOOKS_AD_DURATION,
  lunaBooksAdScenes,
} from "@/data/luna-books-ad";
import styles from "./luna-books-ad.module.css";

const money = formatAdCurrency;

function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`${styles.metric} ${emphasis ? styles.emphasis : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function AppFrame({ children, section }: { children: React.ReactNode; section: string }) {
  return <div className={styles.appFrame}>
    <header><div className={styles.miniMark}>K</div><b>Klyro</b><span>{demo.businessName}</span><small>{demo.dataLabel}</small></header>
    <div className={styles.appBody}><aside><i/><i/><i/><i/></aside><section><div className={styles.appTitle}><span>Overview / {section}</span><div><i/> QuickBooks <b>Connected</b></div></div>{children}</section></div>
  </div>;
}

function HookScene() {
  return <div className={`${styles.scene} ${styles.hookScene}`}><div className={styles.hookBalance}><span>Bank balance</span><strong>{money(demo.bankBalance)}</strong><p>But how much can you actually spend?</p></div><div className={styles.hookAnswer}><span>Estimated safe to spend</span><strong>{money(demo.safeToSpend)}</strong></div><h2>Your balance isn&apos;t the whole story.</h2></div>;
}

function ClarityScene() {
  return <div className={styles.scene}><AppFrame section="Cash clarity"><div className={styles.sceneHeading}><span>Cash position</span><h2>Klyro looks beyond your balance.</h2></div><div className={styles.metricGrid}><Metric label="Bank balance" value={money(demo.bankBalance)}/><Metric label="Upcoming obligations" value={`−${money(demo.upcomingObligations)}`}/><Metric label="Estimated safe to spend" value={money(demo.safeToSpend)} emphasis/><Metric label="Cash runway" value={`${demo.cashRunwayWeeks} weeks`}/></div><p className={styles.estimationNote}>Estimates based on the fictional books shown in this demo.</p></AppFrame></div>;
}

function AttentionScene() {
  const insights = [
    [ReceiptText, `${money(demo.overdueInvoice)} customer invoice overdue`, "Collection deserves attention today."],
    [CalendarClock, `${money(demo.supplierPayment)} supplier payment due next week`, "Included in upcoming obligations."],
    [TrendingDown, "Product B reorder may reduce cash runway", "Review the potential impact before committing."],
  ] as const;
  return <div className={styles.scene}><AppFrame section="Business insights"><div className={styles.sceneHeading}><span>Today&apos;s focus</span><h2>What needs your attention?</h2></div><div className={styles.insightList}>{insights.map(([Icon, title, copy], index)=><article key={title}><div><Icon/><span>0{index + 1}</span></div><h3>{title}</h3><p>{copy}</p><ArrowRight/></article>)}</div></AppFrame></div>;
}

function InventoryScene() {
  return <div className={styles.scene}><AppFrame section="Inventory"><div className={styles.inventoryLayout}><div><span className={styles.kicker}>Cash tied up in inventory</span><strong className={styles.heroNumber}>{money(demo.cashTiedUpInInventory)}</strong><h2>Your cash may be sitting on a shelf.</h2></div><div className={styles.inventoryStack}><Metric label="Slow moving" value={money(demo.slowMovingInventory)} emphasis/><Metric label="Dead stock" value={money(demo.deadStock)}/><Metric label="Excess" value={money(demo.excessInventory)}/><article><Boxes/><div><span>Slow-moving product</span><b>{demo.slowMovingProduct}</b></div></article></div></div></AppFrame></div>;
}

function PurchaseScene() {
  return <div className={styles.scene}><AppFrame section="Purchase decision"><div className={styles.purchaseLayout}><div className={styles.purchaseForm}><span className={styles.kicker}>Can I afford this?</span><label>Purchase type<div>Inventory order</div></label><label>Planned amount<div>{money(demo.plannedPurchase)}</div></label><button type="button">Check potential impact</button></div><div className={styles.purchaseResult}><AlertTriangle/><span>Illustrative result</span><h2>Caution</h2><div><Metric label="Runway before" value={`${demo.cashRunwayWeeks} weeks`}/><ArrowRight/><Metric label="Runway after" value={`${demo.runwayAfterPurchaseWeeks} weeks`} emphasis/></div><p>See the potential impact before you spend. Forecasts are estimates, not guarantees.</p></div></div></AppFrame></div>;
}

function ForecastScene() {
  const max = Math.max(...demo.forecast);
  const min = Math.min(...demo.forecast);
  const points = demo.forecast.map((value, index) => `${30 + index * 70},${250 - ((value - 12_000) / (max - 12_000)) * 180}`).join(" ");
  const lowIndex = demo.forecast.findIndex((value) => value === min);
  return <div className={styles.scene}><AppFrame section="13-week forecast"><div className={styles.sceneHeading}><span>Expected cash position</span><h2>See what may be coming next.</h2></div><div className={styles.forecast}><svg viewBox="0 0 900 280" role="img" aria-label="Illustrative 13-week cash forecast with a low point in week eleven"><defs><linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#73a9d1" stopOpacity=".26"/><stop offset="1" stopColor="#73a9d1" stopOpacity="0"/></linearGradient></defs><path d={`M ${points} L 870 270 L 30 270 Z`} fill="url(#forecast-fill)"/><polyline points={points} fill="none" stroke="#73a9d1" strokeWidth="4"/><line x1={30 + lowIndex * 70} x2={30 + lowIndex * 70} y1="35" y2="258" stroke="#d79163" strokeDasharray="6 7"/><circle cx={30 + lowIndex * 70} cy={250 - ((min - 12_000) / (max - 12_000)) * 180} r="8" fill="#d79163"/></svg><div className={styles.weekLabels}><span>Week 1</span><span>Week 7</span><span>Week 13</span></div><aside><span>Potential low-cash period</span><b>Week 11 · {money(min)}</b></aside></div></AppFrame></div>;
}

function CloseScene() {
  return <div className={`${styles.scene} ${styles.closeScene}`}><div className={styles.brandLockup}><div className={styles.brandMark}><span/><span/><span/></div><span>Financial decision support</span><h1>Klyro</h1><h2>Know your numbers.<br/>Know your next move.</h2><p>Built for small-business owners.</p><div className={styles.qbMoment}><Check/> <span><b>QuickBooks</b> Connected</span><small>Already use QuickBooks? Keep it.</small></div><div className={styles.adCta}>See Klyro in action <ArrowRight/></div><small>Illustrative estimates · Not financial advice</small></div></div>;
}

const sceneComponents = [HookScene, ClarityScene, AttentionScene, InventoryScene, PurchaseScene, ForecastScene, CloseScene] as const;

export function KlyroAd() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const startedAt = useRef(0);
  const Scene = sceneComponents[sceneIndex];

  useEffect(() => {
    startedAt.current = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = ((now - startedAt.current) / 1000) % LUNA_BOOKS_AD_DURATION;
      const nextIndex = lunaBooksAdScenes.findIndex((scene) => elapsed >= scene.start && elapsed < scene.start + scene.duration);
      setSceneIndex(Math.max(0, nextIndex));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div className={styles.experience}>
    <div className={styles.stage} aria-label="Klyro 60-second advertisement" aria-live="polite"><Scene/><div className={styles.safeArea} aria-hidden="true"/></div>
  </div>;
}
