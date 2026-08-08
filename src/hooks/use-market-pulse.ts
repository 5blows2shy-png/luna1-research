"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMarketSession } from "@/lib/market/market-session";
import type { MarketPulseQuote, MarketPulseResponse } from "@/lib/market-pulse/types";

const empty: MarketPulseResponse = { quotes: [], updatedAt: null, provider: "Financial Modeling Prep", status: "unavailable" };
const STORAGE_KEY = "luna1-market-pulse-last-verified-v1";
const MAX_PERSISTED_AGE = 7 * 24 * 60 * 60 * 1000;

type PersistedMarketPulse = { savedAt: number; data: MarketPulseResponse };

function restorePersistedMarketPulse(): MarketPulseResponse | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<PersistedMarketPulse> | null;
    if (!parsed || typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > MAX_PERSISTED_AGE || !parsed.data || !Array.isArray(parsed.data.quotes)) return null;
    const quotes = parsed.data.quotes.filter((quote) => quote && typeof quote.id === "string" && typeof quote.symbol === "string" && typeof quote.price === "number" && Number.isFinite(quote.price));
    if (!quotes.length) return null;
    return { ...parsed.data, quotes: quotes.map((quote) => ({ ...quote, stale: true, error: "Awaiting the next verified update" })), status: "partial", message: "Previous close retained while the next update is unavailable." };
  } catch {
    return null;
  }
}

function mergeQuotes(current: MarketPulseQuote[], incoming: MarketPulseQuote[]) {
  const previous = new Map(current.map((quote) => [quote.id, quote]));
  return incoming.map((quote) => quote.price !== null ? quote : previous.get(quote.id)?.price !== null ? { ...previous.get(quote.id)!, stale: true, error: quote.error } : quote);
}

export function useMarketPulse(paused: boolean) {
  const [data, setData] = useState<MarketPulseResponse>(empty);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const restored = restorePersistedMarketPulse();
      if (restored) setData(restored);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!data.quotes.some(({ price }) => price !== null)) return;
    const verified = { ...data, quotes: data.quotes.filter(({ price }) => price !== null) };
    const updateTime = data.updatedAt ? Date.parse(data.updatedAt) : Number.NaN;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Number.isFinite(updateTime) ? updateTime : Date.now(), data: verified } satisfies PersistedMarketPulse));
  }, [data]);
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
