"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMarketSession } from "@/hooks/use-market-session";
import type { MarketQuote, MarketQuotesApiResponse, MarketQuotesResponse } from "@/lib/market-data";
import { isMarketDataStale, marketRefreshInterval } from "@/lib/market/market-session";
import { mergeVerifiedQuotes } from "@/lib/market/merge-quotes";

const empty: MarketQuotesResponse = { quotes: [], updatedAt: null, provider: null, status: "unavailable" };

export function useMarketQuotes(symbols: readonly string[]) {
  const [data, setData] = useState<MarketQuotesResponse>(empty);
  const [loading, setLoading] = useState(true);
  const [updateUnavailable, setUpdateUnavailable] = useState(false);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const symbolKey = Array.from(new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter((symbol) => /^[A-Z0-9]{1,10}$/.test(symbol)))).sort().join(",");
  const sessionInfo = useMarketSession();

  const refresh = useCallback(async () => {
    if (!symbolKey || inFlight.current) return;
    inFlight.current = true;
    controller.current = new AbortController();
    try {
      const response = await fetch(`/api/market-quotes?symbols=${encodeURIComponent(symbolKey)}`, { signal: controller.current.signal });
      const payload = await response.json() as Partial<MarketQuotesApiResponse>;
      const quoteBySymbol = new Map((payload.quotes ?? []).map((quote) => [quote.symbol, quote]));
      const unavailable = new Set(payload.unavailableSymbols ?? []);
      const status = payload.status ?? "unavailable";
      const requestedSymbols = symbolKey.split(",");
      setData((current) => {
        const hasIncoming = quoteBySymbol.size > 0;
        const hasPrevious = current.quotes.some(({ price }) => price !== null);
        if (!hasIncoming && hasPrevious) return { ...current, status: "partial", message: "Update unavailable; showing the last verified quotes." };
        const incomingQuotes: MarketQuote[] = requestedSymbols.flatMap((symbol) => {
          const quote = quoteBySymbol.get(symbol);
          return quote && !unavailable.has(symbol) ? [{ ...quote, name: symbol, dataType: payload.dataType ?? "previous-close" }] : [];
        });
        const quotes = mergeVerifiedQuotes(requestedSymbols, current.quotes, incomingQuotes);
        return { quotes, updatedAt: hasIncoming ? payload.lastUpdated ?? current.updatedAt : current.updatedAt, provider: status === "success" || status === "partial" ? "Financial Modeling Prep" : current.provider, status: status === "success" ? "ok" : hasIncoming ? status : "unavailable", message: payload.message };
      });
      setUpdateUnavailable(status !== "success");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setUpdateUnavailable(true);
        setData((current) => current.quotes.some(({ price }) => price !== null) ? { ...current, status: "partial", message: "Update unavailable; showing the last verified quotes." } : { ...current, status: "unavailable", message: "Market data is temporarily unavailable." });
      }
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [symbolKey]);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    return () => { window.clearTimeout(initial); controller.current?.abort(); inFlight.current = false; };
  }, [refresh]);

  const refreshDelay = marketRefreshInterval(sessionInfo.session);
  useEffect(() => {
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, refreshDelay);
    const handleVisibility = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", handleVisibility); };
  }, [refresh, refreshDelay]);
  const hasValidQuote = data.quotes.some(({ price }) => price !== null);
  const stale = data.quotes.some((quote) => quote.price !== null && isMarketDataStale(quote.timestamp ?? data.updatedAt, sessionInfo.session, quote.dataType, sessionInfo.now));
  const quotesBySymbol = Object.fromEntries(data.quotes.map((quote) => [quote.symbol.toUpperCase(), quote])) as Record<string, MarketQuote>;
  return { ...data, quotesBySymbol, loading, refresh, sessionInfo, hasValidQuote, updateUnavailable, stale };
}
