import type { MarketPulseQuote } from "@/lib/market-pulse/types";
import { portfolioTickerGroups, type PortfolioTickerGroup } from "@/lib/market-ticker-config";

export type MarketPulseInstrument = Pick<MarketPulseQuote, "id" | "symbol" | "label" | "assetClass"> & { portfolioGroup?: PortfolioTickerGroup };

const coreMarketInstruments: readonly MarketPulseInstrument[] = [
  { id: "sp500-etf", symbol: "SPY", label: "S&P 500 ETF", assetClass: "equity" },
  { id: "russell-2000", symbol: "RUT", label: "Russell 2000", assetClass: "index" },
  { id: "us-10-year", symbol: "US10Y", label: "U.S. 10-Year Treasury", assetClass: "treasury" },
  { id: "gold", symbol: "GOLD", label: "Gold", assetClass: "commodity" },
  { id: "nvidia", symbol: "NVDA", label: "NVIDIA", assetClass: "equity" },
] as const;

const reliablePortfolioSymbols = new Set(["AAPL", "COST", "AMZN"]);
const portfolioInstruments = Object.entries(portfolioTickerGroups).flatMap(([group, symbols]) => symbols.filter((symbol) => reliablePortfolioSymbols.has(symbol)).map((symbol) => ({
  id: `portfolio-${symbol.toLowerCase()}`,
  symbol,
  label: group,
  assetClass: "equity" as const,
  portfolioGroup: group as PortfolioTickerGroup,
})));

export const marketPulseInstruments: readonly MarketPulseInstrument[] = Array.from(
  new Map([...coreMarketInstruments, ...portfolioInstruments].map((instrument) => [instrument.symbol, instrument])).values(),
);
