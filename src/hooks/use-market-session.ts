"use client";

import { useEffect, useState } from "react";
import { getMarketSession } from "@/lib/market/market-session";

export function useMarketSession() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, []);
  const current = now ?? new Date(0);
  return { now: current, ...getMarketSession(current) };
}
