"use client";

import { useCallback, useEffect, useState } from "react";
import type { MarketQuotesResponse } from "@/lib/market-data";

const empty: MarketQuotesResponse = { quotes: [], updatedAt: null, provider: null, status: "unavailable" };

export function useMarketQuotes(symbols: string[]) {
  const [data, setData] = useState<MarketQuotesResponse>(empty);
  const [loading, setLoading] = useState(true);
  const symbolKey = symbols.join(",");
  const refresh = useCallback(async () => {
    if (!symbolKey) return;
    try {
      const response = await fetch(`/api/market-quotes?symbols=${encodeURIComponent(symbolKey)}`);
      const payload = await response.json() as MarketQuotesResponse;
      setData(payload);
    } catch {
      setData((current) => ({ ...current, status: "unavailable", message: "Market data is temporarily unavailable." }));
    } finally { setLoading(false); }
  }, [symbolKey]);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 60_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [refresh]);
  return { ...data, loading, refresh };
}
