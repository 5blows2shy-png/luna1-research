"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useMarketPulse } from "@/hooks/use-market-pulse";
import { useMarketSession } from "@/hooks/use-market-session";
import type { MarketPulseQuote } from "@/lib/market-pulse/types";
import { MarketCountdown } from "@/components/market/market-countdown";
import { MarketStatusBadge } from "@/components/market/market-status-badge";
import { formatEasternTime, formatQuoteChange, formatQuoteNumber } from "@/lib/market/quote-formatting";
import { marketPulseInstruments } from "@/lib/market-pulse/config";
import { researchRouteBySymbol } from "@/lib/market-ticker-config";

function QuoteShell({ quote, children }: { quote: MarketPulseQuote; children: ReactNode }) {
  const route = researchRouteBySymbol[quote.symbol];
  const className = `market-pulse-quote ${quote.change != null && quote.change > 0 ? "up" : quote.change != null && quote.change < 0 ? "down" : "neutral"}`;
  return route ? <Link className={className} href={route} data-market-pulse-item>{children}</Link> : <div className={className} tabIndex={0} role="group" data-market-pulse-item>{children}</div>;
}

function QuoteContent({ quote }: { quote: MarketPulseQuote }) {
  const change = formatQuoteChange(quote.change);
  const percent = formatQuoteChange(quote.changePercent);
  const usesCurrency = quote.assetClass === "equity" || quote.assetClass === "commodity";
  const price = quote.assetClass === "treasury" ? `${formatQuoteNumber(quote.price, 3)}%` : `${quote.assetClass === "equity" || quote.assetClass === "commodity" ? "$" : ""}${formatQuoteNumber(quote.price, quote.assetClass === "commodity" ? 2 : 2)}`;
  const state = quote.stale ? "STALE" : quote.delayed ? "DELAYED" : "REAL-TIME";
  return <>
    <span className="market-pulse-identity"><b>{quote.symbol}</b><small>{quote.label}</small></span>
    <span className="market-pulse-values">
      <b>{quote.price === null ? "—" : price}</b>
      <small>{quote.change === null ? "Change unavailable" : `${change.prefix}${usesCurrency ? "$" : ""}${change.text}${quote.changePercent === null ? "" : ` · ${percent.prefix}${percent.text}%`}`}</small>
    </span>
    <span className="market-pulse-status"><small>{quote.price === null ? "UNAVAILABLE" : `${state} · ${quote.marketStatus.toUpperCase()}`}</small><time dateTime={quote.asOf ?? undefined}>{quote.asOf ? formatEasternTime(quote.asOf) : quote.error ?? "No verified update"}</time></span>
  </>;
}

export function MarketPulse() {
  const [paused, setPaused] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const market = useMarketPulse(paused);
  const sessionInfo = useMarketSession();
  const { quotes, status, message, loading, updatedAt, provider } = market;
  const byId = new Map(quotes.map((quote) => [quote.id, quote]));
  const visibleQuotes = marketPulseInstruments.map((instrument) => byId.get(instrument.id) ?? { ...instrument, price: null, change: null, changePercent: null, previousClose: null, marketStatus: "unknown" as const, asOf: null, delayed: true, stale: false, error: loading ? "Loading…" : "Quote unavailable" });
  const hasValidQuote = visibleQuotes.some(({ price }) => price !== null);
  const hasStaleQuote = visibleQuotes.some(({ stale }) => stale);

  const navigateItems = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const items = Array.from(viewport.current?.querySelectorAll<HTMLElement>("[data-market-pulse-item]") ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (current < 0) return;
    event.preventDefault();
    items[(current + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <section className="market-pulse" aria-labelledby="market-pulse-title">
      <div className="market-pulse-header">
        <div><h2 id="market-pulse-title">Klyro Market Pulse</h2><MarketStatusBadge session={sessionInfo.session} unavailable={!hasValidQuote && !loading} delayed={hasStaleQuote || status === "partial"} /><MarketCountdown now={sessionInfo.now} info={sessionInfo} /></div>
        <div className="market-pulse-controls">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Resume market ticker updates and motion" : "Pause market ticker updates and motion"}>{paused ? "Resume" : "Pause"}</button>
          <details>
            <summary aria-label="Market data disclosure">i</summary>
            <p>Market data may be delayed and is provided for informational and educational purposes. Klyro does not guarantee its accuracy or completeness.</p>
          </details>
        </div>
      </div>
      <div ref={viewport} className="market-pulse-viewport" onKeyDown={navigateItems} aria-live="polite">
        <div className={`market-pulse-track${paused ? " paused" : ""}`}>
          {visibleQuotes.map((quote) => (
            <QuoteShell quote={quote} key={quote.symbol}>
              <QuoteContent quote={quote} />
            </QuoteShell>
          ))}
        </div>
      </div>
      <div className="market-pulse-meta"><span>{paused ? "Updates paused · Current values preserved" : hasStaleQuote ? "Update unavailable · Stale verified values shown" : status === "partial" ? "Some instruments unavailable" : message || `Data via ${provider}`}</span><time dateTime={updatedAt ?? undefined}>{updatedAt ? `Last updated ${formatEasternTime(updatedAt)}` : "No verified update"}</time></div>
    </section>
  );
}
