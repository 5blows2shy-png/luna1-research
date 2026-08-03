"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMarketQuotes } from "@/hooks/use-market-quotes";

type MarketQuotesContextValue = ReturnType<typeof useMarketQuotes>;
const MarketQuotesContext = createContext<MarketQuotesContextValue | null>(null);

export function MarketQuotesProvider({ symbols, children }: { symbols: readonly string[]; children: ReactNode }) {
  const normalizedSymbols = useMemo(() => Array.from(new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter((symbol) => /^[A-Z0-9]{1,10}$/.test(symbol)))).sort(), [symbols]);
  const market = useMarketQuotes(normalizedSymbols);
  return <MarketQuotesContext.Provider value={market}>{children}</MarketQuotesContext.Provider>;
}

export function useMarketQuotesContext() {
  const context = useContext(MarketQuotesContext);
  if (!context) throw new Error("Market quote components must be rendered inside MarketQuotesProvider.");
  return context;
}
