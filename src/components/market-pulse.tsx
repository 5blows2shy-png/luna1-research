"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useMarketQuotes } from "@/hooks/use-market-quotes";
import type { MarketQuote } from "@/lib/market-data";
import { MarketCountdown } from "@/components/market/market-countdown";
import { MarketStatusBadge } from "@/components/market/market-status-badge";
import { dataTypeLabels, formatEasternTime, formatQuoteChange, formatQuoteNumber } from "@/lib/market/quote-formatting";
import { marketPulseInstruments, marketPulseSymbols } from "@/lib/market-ticker-config";

const instrumentBySymbol = new Map(marketPulseInstruments.map((instrument) => [instrument.symbol, instrument]));
function QuoteShell({ quote, children }: { quote: MarketQuote; children: ReactNode }) {
  const route = instrumentBySymbol.get(quote.symbol)?.researchRoute;
  const className = `market-pulse-quote ${quote.change != null && quote.change > 0 ? "up" : quote.change != null && quote.change < 0 ? "down" : "neutral"}`;
  return route ? <Link className={className} href={route} data-market-pulse-item>{children}</Link> : <div className={className} tabIndex={0} role="group" data-market-pulse-item>{children}</div>;
}

function QuoteContent({ quote }: { quote: MarketQuote }) {
  const change = formatQuoteChange(quote.changePercent);
  return <>
    <span className="market-pulse-identity"><b>{quote.symbol}</b><small>{quote.name}</small></span>
    <span className="market-pulse-values">
      <b>{quote.currency === "%" ? `${formatQuoteNumber(quote.price, 3)}%` : `${quote.currency === "USD" ? "$" : ""}${formatQuoteNumber(quote.price)}`}</b>
      <small>{quote.changePercent === null ? "Change unavailable" : `${change.prefix}${change.text}%`}</small>
    </span>
    <span className="market-pulse-status"><small>{dataTypeLabels[quote.dataType]}</small><time dateTime={quote.timestamp ?? undefined}>{formatEasternTime(quote.timestamp)}</time></span>
  </>;
}

export function MarketPulse() {
  const [paused, setPaused] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const market = useMarketQuotes(marketPulseSymbols);
  const { quotes, status, message, loading, updatedAt, provider, sessionInfo, hasValidQuote, updateUnavailable, stale } = market;
  const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
  const visibleQuotes = marketPulseSymbols.map((symbol) => bySymbol.get(symbol)).filter((quote): quote is MarketQuote => Boolean(quote));

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
        <div><h2 id="market-pulse-title">Luna1 Market Pulse</h2><MarketStatusBadge session={sessionInfo.session} unavailable={!hasValidQuote && !loading} delayed={updateUnavailable || stale} /><MarketCountdown now={sessionInfo.now} info={sessionInfo} /></div>
        <div className="market-pulse-controls">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button>
          <details>
            <summary aria-label="Market data disclosure">i</summary>
            <p>Market data may be delayed and is provided for informational and educational purposes. Luna1 does not guarantee its accuracy or completeness.</p>
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
          {!visibleQuotes.length && <div className="market-pulse-unavailable">{loading ? "Loading market data…" : message || "Market data unavailable"}</div>}
        </div>
      </div>
      <div className="market-pulse-meta"><span>{updateUnavailable && hasValidQuote ? "Update unavailable · Last verified quotes shown" : status === "partial" ? "Some instruments unavailable" : message || `Data via ${provider ?? "market provider"}`}</span><time dateTime={updatedAt ?? undefined}>Last updated {formatEasternTime(updatedAt)}</time></div>
    </section>
  );
}
