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
  provider: "Twelve Data" | null;
  status: "ok" | "partial" | "unavailable" | "rate-limited";
  message?: string;
};
