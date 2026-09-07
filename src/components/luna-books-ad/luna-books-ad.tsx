"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleAlert,
  FileText,
  GitCompareArrows,
  ListChecks,
  Users,
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
    <div className={styles.appBody}><aside><i/><i/><i/><i/></aside><section><div className={styles.appTitle}><span>Workspace / {section}</span><div><i/> Development demo <b>Review only</b></div></div>{children}</section></div>
  </div>;
}

function HookScene() {
  return <div className={`${styles.scene} ${styles.hookScene}`}><div className={styles.hookBalance}><span>Bank balance</span><strong>{money(demo.bankBalance)}</strong><p>But how much can you actually spend?</p></div><div className={styles.hookAnswer}><span>Estimated safe to spend</span><strong>{money(demo.safeToSpend)}</strong></div><h2>Your balance isn&apos;t the whole story.</h2></div>;
}

function ImportScene() {
  return <div className={styles.scene}><AppFrame section="Upload & clean"><div className={styles.sceneHeading}><span>One connected review workspace</span><h2>Bring in the books—together.</h2></div><div className={styles.metricGrid}><Metric label="Files imported" value="3" emphasis/><Metric label="Rows linked" value={String(demo.importedRows)}/><Metric label="Document formats" value="CSV · PDF"/><Metric label="Workbooks" value="Excel · ODS"/></div><div className={styles.estimationNote}>Multi-file batch upload · CSV · PDF · XLSX · XLS · XLSM · XLSB · ODS · Every row retains its source file.</div></AppFrame></div>;
}

function DecisionScene() {
  const decisions = [
    [ListChecks, "What should I focus on?", "Prioritize the question your completed books should answer."],
    [GitCompareArrows, "What needs review?", "Surface duplicates, unusual activity, and missing support."],
    [CircleAlert, "What could change?", "Separate recorded facts from forecasts and recommendations."],
  ] as const;
  return <div className={styles.scene}><AppFrame section="Decision Board"><div className={styles.sceneHeading}><span>Start with the decision</span><h2>Tell Klyro what matters now.</h2></div><div className={styles.insightList}>{decisions.map(([Icon, title, copy], index)=><article key={title}><div><Icon/><span>0{index + 1}</span></div><h3>{title}</h3><p>{copy}</p><ArrowRight/></article>)}</div></AppFrame></div>;
}

function AccountingScene() {
  return <div className={styles.scene}><AppFrame section="Accounting review"><div className={styles.purchaseLayout}><div className={styles.purchaseForm}><span className={styles.kicker}>Clean transaction register</span><Metric label="Imported transactions" value={String(demo.importedRows)} emphasis/><Metric label="Possible duplicates" value={String(demo.duplicateReviewCount)}/><p className={styles.estimationNote}>Normalized amounts, suggested categories, and source-file traceability remain linked.</p></div><div className={styles.purchaseResult}><BookOpenCheck/><span>Journal Entry Assistant</span><h2>Review first</h2><div><Metric label="Ready for review" value={String(demo.journalEntriesReady)}/><ArrowRight/><Metric label="Needs input" value={String(demo.journalEntriesNeedReview)} emphasis/></div><p>Balanced entry suggestions include accounts, debits, credits, memos, and review status. Accountant approval remains required.</p></div></div></AppFrame></div>;
}

function CashScene() {
  const max = Math.max(...demo.forecast);
  const min = Math.min(...demo.forecast);
  const points = demo.forecast.map((value, index) => `${30 + index * 70},${250 - ((value - 12_000) / (max - 12_000)) * 180}`).join(" ");
  const lowIndex = demo.forecast.findIndex((value) => value === min);
  return <div className={styles.scene}><AppFrame section="Cash flow & financials"><div className={styles.sceneHeading}><span>Expected cash position</span><h2>Understand today. Look 13 weeks ahead.</h2></div><div className={styles.forecast}><svg viewBox="0 0 900 280" role="img" aria-label="Illustrative 13-week cash outlook with a potential low point in week eleven"><defs><linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#73a9d1" stopOpacity=".26"/><stop offset="1" stopColor="#73a9d1" stopOpacity="0"/></linearGradient></defs><path d={`M ${points} L 870 270 L 30 270 Z`} fill="url(#forecast-fill)"/><polyline points={points} fill="none" stroke="#73a9d1" strokeWidth="4"/><line x1={30 + lowIndex * 70} x2={30 + lowIndex * 70} y1="35" y2="258" stroke="#d79163" strokeDasharray="6 7"/><circle cx={30 + lowIndex * 70} cy={250 - ((min - 12_000) / (max - 12_000)) * 180} r="8" fill="#d79163"/></svg><div className={styles.weekLabels}><span>Week 1</span><span>Week 7</span><span>Week 13</span></div><aside><span>Potential low-cash period</span><b>Week 11 · {money(min)}</b></aside></div><div className={styles.estimationNote}>Cash-flow intelligence · Profit & loss preview · Balance-sheet preview · Forecasts are conditional estimates.</div></AppFrame></div>;
}

function CloseScene() {
  return <div className={styles.scene}><AppFrame section="Monthly Close"><div className={styles.inventoryLayout}><div><span className={styles.kicker}>Monthly Close Board Packet</span><strong className={styles.heroNumber}>{demo.closeReadiness}%</strong><h2>Move from imported files to a clearer close.</h2></div><div className={styles.inventoryStack}><Metric label="Source categories" value="6" emphasis/><Metric label="Review items" value={String(demo.closeReviewItems)}/><Metric label="Exports" value="Excel · PDF"/><article><FileText/><div><span>Packet includes</span><b>Detailed summary · Board narrative · Review register</b></div></article><article><Users/><div><span>Controlled review</span><b>Accountant and document review remain in the workflow</b></div></article></div></div></AppFrame></div>;
}

function BrandScene() {
  return <div className={`${styles.scene} ${styles.closeScene}`}><div className={styles.brandLockup}><div className={styles.brandMark}><span/><span/><span/></div><span>Financial decision support</span><h1>Klyro</h1><h2>From source files to<br/>better-informed next moves.</h2><p>Built for small-business owners and the professionals who support them.</p><div className={styles.qbMoment}><Check/> <span><b>Connected workflow</b></span><small>Import · Review · Decide · Close</small></div><div className={styles.adCta}>See Klyro in action <ArrowRight/></div><small>Development demo · Illustrative estimates · Review only · Not financial advice</small></div></div>;
}

const sceneComponents = [HookScene, ImportScene, DecisionScene, AccountingScene, CashScene, CloseScene, BrandScene] as const;

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
    <div className={styles.stage} aria-label="Klyro 60-second development advertisement" aria-live="polite"><Scene/><div className={styles.safeArea} aria-hidden="true"/></div>
  </div>;
}
