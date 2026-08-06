import "server-only";
import { getMarketSession } from "@/lib/market/market-session";
import type { MarketPulseInstrument } from "@/lib/market-pulse/config";
import type { MarketPulseQuote, MarketPulseStatus } from "@/lib/market-pulse/types";

export interface MarketPulseProvider {
  readonly name: "Financial Modeling Prep";
  fetchQuote(instrument: MarketPulseInstrument, signal: AbortSignal): Promise<MarketPulseQuote>;
}

export const fmpSymbolByInstrumentId: Readonly<Record<string, string>> = {
  "sp500-etf": "SPY",
  "russell-2000": "^RUT",
  "us-10-year": "^TNX",
  "wti-crude": "CLUSD",
  "natural-gas": "NGUSD",
  gold: "GCUSD",
  nvidia: "NVDA",
  broadcom: "AVGO",
};

type FmpQuote = Record<string, unknown>;

function finiteNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function marketStatus(now = new Date()): MarketPulseStatus {
  const session = getMarketSession(now).session;
  return session === "regular" ? "open" : session;
}

export function normalizeFmpQuote(instrument: MarketPulseInstrument, payload: unknown, now = new Date()): MarketPulseQuote {
  if (!Array.isArray(payload) || !payload.length || typeof payload[0] !== "object" || payload[0] === null) throw new Error("INVALID_RESPONSE");
  const raw = payload[0] as FmpQuote;
  const price = finiteNumber(raw.price);
  if (price === null) throw new Error("PRICE_UNAVAILABLE");
  const change = finiteNumber(raw.change);
  const suppliedClose = finiteNumber(raw.previousClose);
  const previousClose = suppliedClose ?? (change === null ? null : price - change);
  const suppliedPercent = finiteNumber(raw.changePercentage);
  const changePercent = suppliedPercent ?? (change !== null && previousClose !== null && previousClose !== 0 ? change / previousClose * 100 : null);
  const unixTimestamp = finiteNumber(raw.timestamp);
  const asOf = unixTimestamp === null ? now.toISOString() : new Date(unixTimestamp * 1000).toISOString();
  return { ...instrument, price, change, changePercent, previousClose, marketStatus: marketStatus(now), asOf, delayed: true, stale: false };
}

export function createFmpMarketPulseProvider(apiKey: string): MarketPulseProvider {
  return {
    name: "Financial Modeling Prep",
    async fetchQuote(instrument, signal) {
      const providerSymbol = fmpSymbolByInstrumentId[instrument.id];
      if (!providerSymbol) throw new Error("UNSUPPORTED_SYMBOL");
      const url = new URL("https://financialmodelingprep.com/stable/quote");
      url.searchParams.set("symbol", providerSymbol);
      const response = await fetch(url, { headers: { apikey: apiKey }, cache: "no-store", signal });
      if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
      if (response.status === 429) throw new Error("RATE_LIMITED");
      if (!response.ok) throw new Error(`PROVIDER_${response.status}`);
      return normalizeFmpQuote(instrument, await response.json());
    },
  };
}
