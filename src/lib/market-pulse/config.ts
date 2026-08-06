import type { MarketPulseQuote } from "@/lib/market-pulse/types";

export type MarketPulseInstrument = Pick<MarketPulseQuote, "id" | "symbol" | "label" | "assetClass">;

export const marketPulseInstruments: readonly MarketPulseInstrument[] = [
  { id: "sp500-etf", symbol: "SPY", label: "S&P 500 ETF", assetClass: "equity" },
  { id: "russell-2000", symbol: "RUT", label: "Russell 2000", assetClass: "index" },
  { id: "us-10-year", symbol: "US10Y", label: "U.S. 10-Year Treasury", assetClass: "treasury" },
  { id: "wti-crude", symbol: "WTI", label: "WTI Crude Oil", assetClass: "commodity" },
  { id: "natural-gas", symbol: "NATGAS", label: "Natural Gas", assetClass: "commodity" },
  { id: "gold", symbol: "GOLD", label: "Gold", assetClass: "commodity" },
  { id: "nvidia", symbol: "NVDA", label: "NVIDIA", assetClass: "equity" },
  { id: "broadcom", symbol: "AVGO", label: "Broadcom", assetClass: "equity" },
] as const;
