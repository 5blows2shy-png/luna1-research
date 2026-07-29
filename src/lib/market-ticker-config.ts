import { watchlist } from "@/lib/watchlist-data";

export const portfolioTickerGroups = {
  "Active Positions": ["CASY", "PANW", "WELL"],
  Watchlist: watchlist.map((item) => item.ticker),
  "Long-Term Compounders": ["LLY", "AAPL", "COST", "PG", "AMZN"],
} as const;

export type PortfolioTickerGroup = keyof typeof portfolioTickerGroups;

export const portfolioTickerSymbols = Array.from(
  new Set(Object.values(portfolioTickerGroups).flat()),
);

const bucketPrecedence: PortfolioTickerGroup[] = ["Watchlist", "Long-Term Compounders", "Active Positions"];

export const portfolioBucketBySymbol = Object.fromEntries(
  bucketPrecedence.flatMap((bucket) =>
    portfolioTickerGroups[bucket].map((symbol) => [symbol, bucket]),
  ),
) as Record<string, PortfolioTickerGroup>;

export const researchRouteBySymbol: Record<string, string> = {
  ANET: "/research/anet",
  PDFS: "/research/pdfs",
  STRL: "/research/strl",
};
