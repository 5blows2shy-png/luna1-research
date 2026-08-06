"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMarketSession } from "@/lib/market/market-session";
import type { MarketPulseQuote, MarketPulseResponse } from "@/lib/market-pulse/types";

const empty: MarketPulseResponse = { quotes: [], updatedAt: null, provider: "Financial Modeling Prep", status: "unavailable" };

function mergeQuotes(current: MarketPulseQuote[], incoming: MarketPulseQuote[]) {
  const previous = new Map(current.map((quote) => [quote.id, quote]));
  return incoming.map((quote) => quote.price !== null ? quote : previous.get(quote.id)?.price !== null ? { ...previous.get(quote.id)!, stale: true, error: quote.error } : quote);
}

export function useMarketPulse(paused: boolean) {
  const [data, setData] = useState<MarketPulseResponse>(empty);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (paused || inFlight.current || document.visibilityState === "hidden") return;
    inFlight.current = true;
    controller.current = new AbortController();
    try {
      const response = await fetch("/api/market-pulse", { signal: controller.current.signal });
      const payload = await response.json() as Partial<MarketPulseResponse>;
      setData((current) => {
        const quotes = mergeQuotes(current.quotes, payload.quotes ?? []);
        const hasValues = quotes.some(({ price }) => price !== null);
        return { quotes, updatedAt: payload.updatedAt ?? current.updatedAt, provider: "Financial Modeling Prep", status: payload.status === "ok" ? "ok" : hasValues ? "partial" : "unavailable", message: payload.message };
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setData((current) => ({ ...current, status: current.quotes.some(({ price }) => price !== null) ? "partial" : "unavailable", message: "Update unavailable; last verified values retained." }));
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [paused]);

  useEffect(() => {
    if (paused) { controller.current?.abort(); return; }
    void refresh();
    const interval = getMarketSession().session === "regular" ? 20_000 : 90_000;
    const timer = window.setInterval(() => void refresh(), interval);
    const onVisibilityChange = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisibilityChange); controller.current?.abort(); inFlight.current = false; };
  }, [paused, refresh]);

  return { ...data, loading, refresh };
}
