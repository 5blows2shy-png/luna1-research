import { watchlist } from "@/lib/watchlist-data";

export type MarketInstrument = {
  symbol: string;
  providerSymbol: string;
  name: string;
  kind: "equity" | "index" | "commodity" | "treasury";
  researchRoute?: string;
};

export const researchRouteBySymbol: Record<string, string> = {
  ANET: "/research/anet",
  BE: "/research/companies/be",
  PDFS: "/research/pdfs",
  STRL: "/research/strl",
};

export const marketPulseInstruments: readonly MarketInstrument[] = [
  { symbol: "SPX", providerSymbol: "^GSPC", name: "S&P 500", kind: "index" },
  { symbol: "COMP", providerSymbol: "^IXIC", name: "Nasdaq Composite", kind: "index" },
  { symbol: "DJIA", providerSymbol: "^DJI", name: "Dow Jones Industrial Average", kind: "index" },
  { symbol: "RUT", providerSymbol: "^RUT", name: "Russell 2000", kind: "index" },
  { symbol: "US10Y", providerSymbol: "^TNX", name: "U.S. 10-Year Treasury Yield", kind: "treasury" },
  { symbol: "WTI", providerSymbol: "CLUSD", name: "WTI Crude Oil", kind: "commodity" },
  { symbol: "NATGAS", providerSymbol: "NGUSD", name: "Natural Gas", kind: "commodity" },
  { symbol: "GOLD", providerSymbol: "GCUSD", name: "Gold", kind: "commodity" },
  ...["NVDA", "AVGO", "EQIX", "DLR", "VRT", "ANET", "BE", "V", "MA", "ICE", "CME", "SPGI", "MSCI"].map((symbol) => ({
    symbol,
    providerSymbol: symbol,
    name: symbol,
    kind: "equity" as const,
    researchRoute: researchRouteBySymbol[symbol],
  })),
] as const;

export const marketPulseSymbols = marketPulseInstruments.map(({ symbol }) => symbol);

export const portfolioTickerGroups = {
  "Active Positions": ["CASY", "PANW", "WELL"],
  Watchlist: watchlist.map((item) => item.ticker),
  "Long-Term Compounders": ["LLY", "AAPL", "COST", "PG", "AMZN"],
} as const;

export const portfolioFundSymbols = ["VOO", "QQQM", "IAU", "SLV", "SGOV"] as const;

export type PortfolioTickerGroup = keyof typeof portfolioTickerGroups;
export const portfolioTickerSymbols = Array.from(new Set([...Object.values(portfolioTickerGroups).flat(), ...portfolioFundSymbols]));
const bucketPrecedence: PortfolioTickerGroup[] = ["Watchlist", "Long-Term Compounders", "Active Positions"];
export const portfolioBucketBySymbol = Object.fromEntries(bucketPrecedence.flatMap((bucket) => portfolioTickerGroups[bucket].map((symbol) => [symbol, bucket]))) as Record<string, PortfolioTickerGroup>;

const portfolioInstruments: MarketInstrument[] = portfolioTickerSymbols.map((symbol) => ({
  symbol,
  providerSymbol: symbol,
  name: symbol,
  kind: "equity",
  researchRoute: researchRouteBySymbol[symbol],
}));

export const supportedMarketInstruments = new Map(
  [...portfolioInstruments, ...marketPulseInstruments].map((instrument) => [instrument.symbol, instrument]),
);
