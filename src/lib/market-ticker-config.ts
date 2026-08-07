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

export type PortfolioTickerGroup = "Active Positions" | "Watchlist" | "Long-Term Compounders";
export type PortfolioTickerGroups = Record<PortfolioTickerGroup, readonly string[]>;

export const portfolioTickerGroups: PortfolioTickerGroups = {
  "Active Positions": ["CASY", "ANET", "WELL"],
  Watchlist: ["GLW", "STRL", "ALAB", "JBL", "RY", "DLR"],
  "Long-Term Compounders": ["VOO", "QQQM", "IAU", "AIPO", "SGOV", "LLY", "AAPL", "COST", "AMZN"],
};

export const portfolioTickerSymbols = Array.from(new Set(Object.values(portfolioTickerGroups).flat()));

export function createEquityMarketInstrument(symbol: string): MarketInstrument {
  return { symbol, providerSymbol: symbol, name: symbol, kind: "equity", researchRoute: researchRouteBySymbol[symbol] };
}
