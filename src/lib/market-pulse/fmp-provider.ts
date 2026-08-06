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

export function normalizeFmpTreasury(instrument: MarketPulseInstrument, payload: unknown, now = new Date()): MarketPulseQuote {
  if (!Array.isArray(payload)) throw new Error("INVALID_RESPONSE");
  const rows = payload
    .filter((row): row is FmpQuote => typeof row === "object" && row !== null && finiteNumber((row as FmpQuote).year10) !== null)
    .sort((left, right) => String(right.date ?? "").localeCompare(String(left.date ?? "")));
  if (!rows.length) throw new Error("PRICE_UNAVAILABLE");
  const price = finiteNumber(rows[0].year10)!;
  const previousClose = rows[1] ? finiteNumber(rows[1].year10) : null;
  const change = previousClose === null ? null : price - previousClose;
  const changePercent = change === null || previousClose === null || previousClose === 0 ? null : change / previousClose * 100;
  const date = typeof rows[0].date === "string" ? rows[0].date : null;
  return { ...instrument, price, change, changePercent, previousClose, marketStatus: marketStatus(now), asOf: date ? new Date(`${date}T20:00:00Z`).toISOString() : now.toISOString(), delayed: true, stale: false };
}

async function requestFmp(path: string, apiKey: string, signal: AbortSignal) {
  const response = await fetch(`https://financialmodelingprep.com/stable/${path}`, { headers: { apikey: apiKey }, cache: "no-store", signal });
  if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
  if (response.status === 429) throw new Error("RATE_LIMITED");
  if (!response.ok) throw new Error(`PROVIDER_${response.status}`);
  return response.json() as Promise<unknown>;
}

export function createFmpMarketPulseProvider(apiKey: string): MarketPulseProvider {
  let commodityQuotes: Promise<unknown> | null = null;
  let treasuryRates: Promise<unknown> | null = null;
  return {
    name: "Financial Modeling Prep",
    async fetchQuote(instrument, signal) {
      const providerSymbol = fmpSymbolByInstrumentId[instrument.id];
      if (!providerSymbol) throw new Error("UNSUPPORTED_SYMBOL");
      if (instrument.assetClass === "treasury") {
        treasuryRates ??= requestFmp("treasury-rates", apiKey, signal);
        return normalizeFmpTreasury(instrument, await treasuryRates);
      }
      if (instrument.assetClass === "commodity") {
        commodityQuotes ??= requestFmp("batch-commodity-quotes", apiKey, signal);
        try {
          const payload = await commodityQuotes;
          const match = Array.isArray(payload) ? payload.find((quote) => typeof quote === "object" && quote !== null && (quote as FmpQuote).symbol === providerSymbol) : null;
          if (match) return normalizeFmpQuote(instrument, [match]);
        } catch {
          // Some FMP plans omit the batch endpoint; fall through to the documented symbol quote.
        }
      }
      const encoded = encodeURIComponent(providerSymbol);
      const fullQuote = await requestFmp(`quote?symbol=${encoded}`, apiKey, signal);
      try {
        return normalizeFmpQuote(instrument, fullQuote);
      } catch (error) {
        if (instrument.assetClass !== "equity") throw error;
        return normalizeFmpQuote(instrument, await requestFmp(`quote-short?symbol=${encoded}`, apiKey, signal));
      }
    },
  };
}
