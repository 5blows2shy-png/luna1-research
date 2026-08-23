export type MarketPulseStatus = "open" | "closed" | "pre-market" | "after-hours" | "unknown";

export type MarketPulseQuote = {
  id: string;
  symbol: string;
  label: string;
  assetClass: "equity" | "index" | "commodity" | "treasury";
  price: number | null;
  change: number | null;
  changePercent: number | null;
  previousClose: number | null;
  marketStatus: MarketPulseStatus;
  asOf: string | null;
  delayed: boolean;
  stale: boolean;
  error?: string;
};

export type MarketPulseResponse = {
  quotes: MarketPulseQuote[];
  updatedAt: string | null;
  provider: "Financial Modeling Prep";
  status: "ok" | "partial" | "unavailable";
  message?: string;
};
