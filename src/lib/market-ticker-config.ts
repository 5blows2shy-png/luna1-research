import { watchlist } from "@/lib/watchlist-data";

export type MarketInstrument = {
  symbol: string;
  providerSymbol: string;
  name: string;
  kind: "equity" | "index" | "commodity" | "treasury";
  researchRoute?: string;
};

export const researchRouteBySymbol: Record<string, string> = {
  AIPO: "/watchlist/aipo",
  ANET: "/research/anet",
  BE: "/research/companies/be",
  PDFS: "/research/pdfs",
  STRL: "/research/strl",
};

export const portfolioTickerGroups = {
  "Active Positions": ["CASY", "ANET", "WELL"],
  Watchlist: watchlist.map((item) => item.ticker),
  "Long-Term Compounders": ["LLY", "AAPL", "COST", "PG", "AMZN", "AIPO"],
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
  portfolioInstruments.map((instrument) => [instrument.symbol, instrument]),
);
