"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useMarketQuotesContext } from "@/components/market/market-quotes-provider";
import type { MarketQuote } from "@/lib/market-data";
import { MarketCountdown } from "@/components/market/market-countdown";
import { MarketStatusBadge } from "@/components/market/market-status-badge";
import { dataTypeLabels, formatEasternTime, formatQuoteChange, formatQuoteNumber } from "@/lib/market/quote-formatting";
import { researchRouteBySymbol, type PortfolioTickerGroup, type PortfolioTickerGroups } from "@/lib/market-ticker-config";

const groups: PortfolioTickerGroup[] = ["Active Positions", "Watchlist", "Long-Term Compounders"];
function TickerItem({ quote, group, onSelect }: { quote: MarketQuote; group: PortfolioTickerGroup; onSelect: () => void }) {
  const change = formatQuoteChange(quote.change);
  const percent = formatQuoteChange(quote.changePercent);
  return <button className={`portfolio-quote ${change.direction}`} onClick={onSelect} aria-label={`${quote.symbol}, ${group}, ${dataTypeLabels[quote.dataType]}`}>
    <span className="portfolio-quote-top"><b>{quote.symbol}</b><small>{group}</small></span>
    <span className="portfolio-quote-price">{quote.price === null ? "Market data unavailable" : `${quote.currency === "USD" ? "$" : ""}${formatQuoteNumber(quote.price)}`}</span>
    <span className="portfolio-quote-change">{change.prefix}{change.text} · {percent.prefix}{percent.text}%</span>
    <small>{dataTypeLabels[quote.dataType]}</small>
  </button>;
}

function QuoteDetailPanel({ quote, group, onClose }: { quote: MarketQuote; group: PortfolioTickerGroup; onClose: () => void }) {
  const route = researchRouteBySymbol[quote.symbol];
  useEffect(() => { const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [onClose]);
  return <div className="quote-detail" role="dialog" aria-modal="true" aria-labelledby="quote-detail-title"><div><button autoFocus className="quote-detail-close" onClick={onClose} aria-label="Close quote details">×</button><span className="eyebrow">{group}</span><h2 id="quote-detail-title">{quote.symbol} · {quote.name}</h2><dl><div><dt>Latest price</dt><dd>{quote.price === null ? "Unavailable" : `$${formatQuoteNumber(quote.price)}`}</dd></div><div><dt>Daily change</dt><dd>{formatQuoteNumber(quote.change)} · {formatQuoteNumber(quote.changePercent)}%</dd></div><div><dt>Market status</dt><dd>{quote.marketStatus}</dd></div><div><dt>Data label</dt><dd>{dataTypeLabels[quote.dataType]}</dd></div><div><dt>Last updated</dt><dd>{formatEasternTime(quote.timestamp)}</dd></div><div><dt>Research coverage</dt><dd>{route ? "Available" : "Portfolio monitoring"}</dd></div></dl>{route && <Link className="button" href={route}>Open Luna1 research <span>→</span></Link>}</div></div>;
}

export function PortfolioMarketBoard({ portfolioGroups }: { portfolioGroups: PortfolioTickerGroups }) {
  const [selectedGroups, setSelectedGroups] = useState<PortfolioTickerGroup[]>(groups);
  const [customizing, setCustomizing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<MarketQuote | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const restore = window.setTimeout(() => {
      const saved = window.localStorage.getItem("luna1-portfolio-ticker-groups-v2");
      if (saved) { try { const parsed = JSON.parse(saved) as PortfolioTickerGroup[]; const valid = parsed.filter((group) => groups.includes(group)); if (valid.length) setSelectedGroups(valid); } catch { /* Ignore invalid visitor preferences. */ } }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);
  const symbols = useMemo(() => Array.from(new Set(selectedGroups.flatMap((group) => portfolioGroups[group]))), [portfolioGroups, selectedGroups]);
  const bucketBySymbol = useMemo(() => Object.fromEntries(groups.flatMap((group) => portfolioGroups[group].map((symbol) => [symbol, group]))), [portfolioGroups]) as Record<string, PortfolioTickerGroup>;
  const sharedMarket = useMarketQuotesContext();
  const market = useMemo(() => ({ ...sharedMarket, quotes: symbols.map((symbol) => sharedMarket.quotesBySymbol[symbol]).filter((quote): quote is MarketQuote => Boolean(quote)) }), [sharedMarket, symbols]);
  function toggleGroup(group: PortfolioTickerGroup) { setSelectedGroups((current) => { const next = current.includes(group) ? current.filter((item) => item !== group) : [...current, group]; const safe = next.length ? next : [group]; window.localStorage.setItem("luna1-portfolio-ticker-groups-v2", JSON.stringify(safe)); return safe; }); }
  function handleTrackKeys(event: KeyboardEvent<HTMLDivElement>) { if (!trackRef.current || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; const items = Array.from(trackRef.current.querySelectorAll<HTMLButtonElement>(".portfolio-quote")); const current = items.indexOf(document.activeElement as HTMLButtonElement); if (current < 0) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowRight" ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0); items[next]?.focus(); items[next]?.scrollIntoView({ behavior: paused ? "auto" : "smooth", inline: "center", block: "nearest" }); }
  return <aside className="portfolio-market-board" aria-label="Luna1 portfolio market ticker">
    <div className="portfolio-market-heading"><div><span className="eyebrow">Luna1 Portfolio Lab</span><h2>Portfolio Market Monitor</h2><div className="market-session-line"><MarketStatusBadge session={market.sessionInfo.session} unavailable={!market.hasValidQuote && !market.loading} delayed={market.updateUnavailable || market.stale} /><MarketCountdown now={market.sessionInfo.now} info={market.sessionInfo} /></div></div><div className="portfolio-market-actions"><button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button><button onClick={() => setCustomizing((value) => !value)} aria-expanded={customizing}>Customize Ticker</button><details><summary aria-label="Market data disclosure">ⓘ</summary><p>Market data may be delayed and is provided for informational and educational purposes. Luna1 does not guarantee its accuracy or completeness.</p></details></div></div>
    {customizing && <fieldset className="ticker-customize"><legend>Portfolio groups</legend>{groups.map((group) => <label key={group}><input type="checkbox" checked={selectedGroups.includes(group)} onChange={() => toggleGroup(group)}/>{group}</label>)}</fieldset>}
    <div className="portfolio-quote-viewport">
      <div ref={trackRef} className={`portfolio-quote-track${paused ? " paused" : ""}`} onKeyDown={handleTrackKeys}>{market.loading ? <p className="market-message">Loading market connection…</p> : market.quotes.map((quote) => <TickerItem key={quote.symbol} quote={quote} group={bucketBySymbol[quote.symbol]} onSelect={() => setSelectedQuote(quote)}/>)}</div>
    </div>
    <div className="portfolio-market-meta" role="status"><span>{market.updateUnavailable && market.hasValidQuote ? "Update unavailable · Last verified quotes shown" : market.message ?? `${market.provider ?? "Market data"} · ${market.status}`}</span><time dateTime={market.updatedAt ?? undefined}>{market.updatedAt ? `Last updated ${formatEasternTime(market.updatedAt)}` : "No verified update"}</time></div>
    {selectedQuote && <QuoteDetailPanel quote={selectedQuote} group={bucketBySymbol[selectedQuote.symbol]} onClose={() => setSelectedQuote(null)}/>}
  </aside>;
}
