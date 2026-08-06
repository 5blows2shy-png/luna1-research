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

export function createEquityMarketInstrument(symbol: string): MarketInstrument {
  return { symbol, providerSymbol: symbol, name: symbol, kind: "equity", researchRoute: researchRouteBySymbol[symbol] };
}
