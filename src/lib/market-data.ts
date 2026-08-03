export type MarketDataType =
  | "real-time"
  | "delayed"
  | "previous-close"
  | "demo"
  | "unavailable";

export type MarketQuote = {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketStatus: "open" | "closed" | "unknown";
  timestamp: string | null;
  dataType: MarketDataType;
};

export type MarketQuotesResponse = {
  quotes: MarketQuote[];
  updatedAt: string | null;
  provider: "Financial Modeling Prep" | null;
  status: "ok" | "partial" | "unavailable" | "rate-limited" | "unauthorized";
  message?: string;
};

export type MarketQuotesApiResponse = {
  status: "success" | "partial" | "unavailable" | "rate-limited";
  dataType?: Exclude<MarketDataType, "demo" | "unavailable">;
  lastUpdated: string | null;
  quotes: Array<Omit<MarketQuote, "name" | "dataType">>;
  unavailableSymbols: string[];
  provider?: "Financial Modeling Prep";
  message?: string;
};
