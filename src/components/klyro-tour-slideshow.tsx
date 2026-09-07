"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, ShieldCheck } from "lucide-react";
import { lunaBooksDemo as demo, tutorialScenes } from "@/lib/luna-books-demo";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const slideFacts = [
  ["Safe to spend", money.format(demo.cash.safeToSpend)],
  ["Private workspace", demo.meta.company],
  ["Review signals", "Categories · Duplicates · Receipts"],
  ["Bank balance", money.format(demo.cash.balance)],
  ["Estimated runway", `${demo.cash.runwayWeeks} weeks`],
  ["Overdue invoices", money.format(14_600)],
  ["Supplier payment", money.format(12_400)],
  ["Inventory at cost", money.format(demo.inventory.total)],
  ["Purchase scenario", money.format(demo.affordability.purchase)],
  ["Planning horizon", "13 weeks"],
  ["Priority decisions", "Top 3 actions"],
  ["Connected workflow", "Reports · QuickBooks · Accountant"],
] as const;

export function KlyroTourSlideshow() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scene = tutorialScenes[index];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % tutorialScenes.length), 6500);
    return () => window.clearTimeout(timer);
  }, [index, isPlaying]);

  const move = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + tutorialScenes.length) % tutorialScenes.length);
    setIsPlaying(false);
  };

  return (
    <section className="klyro-tour-slideshow" aria-labelledby="klyro-tour-title">
      <header><div><span className="eyebrow">Interactive product tour</span><h2 id="klyro-tour-title">See Klyro through a small-business example.</h2><p>A guided look at the Luna Books accounting workflow using only deterministic, fictional Harbor Supply data.</p></div><div className="klyro-tour-safe"><ShieldCheck aria-hidden /> Safe demo data</div></header>
      <div className="klyro-tour-frame" aria-live="polite">
        <div className="klyro-tour-spectrum" aria-hidden />
        <div className="klyro-tour-count"><span>{String(index + 1).padStart(2, "0")}</span><small>/ {tutorialScenes.length}</small></div>
        <article key={scene.id}><span>{scene.navLabel}</span><h3>{scene.title}</h3><p>{scene.message}</p><div className="klyro-tour-fact"><small>{slideFacts[index][0]}</small><strong>{slideFacts[index][1]}</strong></div></article>
        <nav aria-label="Demo tour slides">{tutorialScenes.map((item, itemIndex) => <button aria-label={`Show slide ${itemIndex + 1}: ${item.navLabel}`} aria-current={itemIndex === index ? "step" : undefined} key={item.id} onClick={() => { setIndex(itemIndex); setIsPlaying(false); }} />)}</nav>
      </div>
      <footer><div><button onClick={() => move(-1)}><ArrowLeft aria-hidden /> Previous</button><button aria-pressed={isPlaying} onClick={() => setIsPlaying((current) => !current)}>{isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}{isPlaying ? "Pause" : "Play slideshow"}</button><button onClick={() => move(1)}>Next <ArrowRight aria-hidden /></button></div><Link href="/demo/luna-books-tour">Open the full interactive tour <span aria-hidden>→</span></Link></footer>
    </section>
  );
}
