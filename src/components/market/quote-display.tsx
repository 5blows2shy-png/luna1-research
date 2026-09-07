"use client";

import type { MarketQuote } from "@/lib/market-data";
import { dataTypeLabels, formatQuoteChange, formatQuoteNumber } from "@/lib/market/quote-formatting";
import { useMarketQuotesContext } from "@/components/market/market-quotes-provider";

export type QuoteDisplayProps = { symbol: string; quote?: MarketQuote; compact?: boolean; showStatus?: boolean };
const sessionLabels = { regular: "LIVE", "pre-market": "PRE-MARKET", "after-hours": "AFTER HOURS", closed: "MARKET CLOSED" } as const;

export function QuoteDisplay({ symbol, quote, compact = false, showStatus = true }: QuoteDisplayProps) {
  const market = useMarketQuotesContext();
  const normalizedSymbol = symbol.trim().toUpperCase();
  const resolved = quote ?? market.quotesBySymbol[normalizedSymbol];
  if (market.loading && !resolved) return <span className={`quote-display quote-display--loading${compact ? " quote-display--compact" : ""}`} aria-label={`Loading ${normalizedSymbol} quote`}><i /><i /><i /></span>;
  if (!resolved || resolved.price === null) return <span className={`quote-display quote-display--unavailable${compact ? " quote-display--compact" : ""}`}><b>{normalizedSymbol}</b><small>Quote unavailable</small></span>;
  const change = formatQuoteChange(resolved.change);
  const percent = formatQuoteChange(resolved.changePercent);
  const label = resolved.dataType === "previous-close" ? dataTypeLabels[resolved.dataType] : sessionLabels[market.sessionInfo.session];
  return <span className={`quote-display quote-display--${change.direction}${compact ? " quote-display--compact" : ""}`} aria-label={`${normalizedSymbol} ${formatQuoteNumber(resolved.price)}, ${label}`}>
    <b className="quote-display-symbol">{normalizedSymbol}</b>
    <strong>{resolved.currency === "USD" ? "$" : ""}{formatQuoteNumber(resolved.price)}</strong>
    <span>{change.prefix}{resolved.currency === "USD" && resolved.change !== null ? "$" : ""}{change.text} <i>·</i> {percent.prefix}{percent.text}%</span>
    {showStatus ? <small>{label}</small> : null}
  </span>;
}
