import "server-only";
import type { MarketQuote, MarketQuotesResponse } from "@/lib/market-data";
import type { MarketInstrument } from "@/lib/market-ticker-config";

type FmpQuote = { symbol?: unknown; name?: unknown; price?: unknown; change?: unknown; changePercentage?: unknown; currency?: unknown; timestamp?: unknown };
type CacheEntry = { response: MarketQuotesResponse; expiresAt: number };
const state = globalThis as typeof globalThis & { luna1MarketCache?: Map<string, CacheEntry>; luna1LastMarketResponses?: Map<string, MarketQuotesResponse> };
const cache = (state.luna1MarketCache ??= new Map());
const lastResponses = (state.luna1LastMarketResponses ??= new Map());

function unavailable(instrument: MarketInstrument): MarketQuote {
  return { symbol: instrument.symbol, name: instrument.name, price: null, change: null, changePercent: null, currency: instrument.kind === "treasury" ? "%" : "USD", marketStatus: "unknown", timestamp: null, dataType: "unavailable" };
}

function isOpen(kind: MarketInstrument["kind"], now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = value("weekday");
  const minutes = Number(value("hour")) * 60 + Number(value("minute"));
  if (weekday === "Sat" || weekday === "Sun") return false;
  return kind === "commodity" ? minutes >= 18 || minutes < 17 * 60 : minutes >= 9 * 60 + 30 && minutes < 16 * 60;
}

function finiteNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalize(instrument: MarketInstrument, quote?: FmpQuote): MarketQuote {
  const price = finiteNumber(quote?.price);
  if (!quote || price === null) return unavailable(instrument);
  const change = finiteNumber(quote.change);
  const changePercent = finiteNumber(quote.changePercentage);
  const timestamp = finiteNumber(quote.timestamp);
  const open = isOpen(instrument.kind);
  return {
    symbol: instrument.symbol,
    name: instrument.name,
    price,
    change,
    changePercent,
    currency: instrument.kind === "treasury" ? "%" : typeof quote.currency === "string" && quote.currency ? quote.currency : "USD",
    marketStatus: open ? "open" : "closed",
    timestamp: timestamp === null ? null : new Date(timestamp * 1000).toISOString(),
    dataType: open ? "delayed" : "previous-close",
  };
}

async function fmp<T>(path: string, apiKey: string): Promise<T> {
  const url = new URL(`https://financialmodelingprep.com/stable/${path}`);
  const response = await fetch(url, { headers: { apikey: apiKey }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (response.status === 429) throw new Error("RATE_LIMITED");
  if (response.status === 401 || response.status === 403) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error(`Market provider returned ${response.status}`);
  const payload: unknown = await response.json();
  const first = Array.isArray(payload) && payload.length && typeof payload[0] === "object" && payload[0] !== null ? payload[0] as Record<string, unknown> : null;
  if (process.env.NODE_ENV === "development") {
    console.info("[market-data] FMP response", { status: response.status, shape: Array.isArray(payload) ? "array" : typeof payload, count: Array.isArray(payload) ? payload.length : null, fields: first ? Object.keys(first) : [] });
  }
  if (!Array.isArray(payload)) {
    const errorMessage = typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>)["Error Message"] : null;
    if (typeof errorMessage === "string" && /api key/i.test(errorMessage)) throw new Error("UNAUTHORIZED");
    throw new Error("INVALID_RESPONSE");
  }
  return payload as T;
}

export async function getMarketQuotes(instruments: MarketInstrument[]): Promise<MarketQuotesResponse> {
  const key = instruments.map(({ symbol }) => symbol).join(",");
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.response;
  const apiKey = process.env.MARKET_DATA_API_KEY;
  if (!apiKey) return { quotes: instruments.map(unavailable), updatedAt: null, provider: null, status: "unavailable", message: "Market data unavailable. Add a server-side market data connection to enable current quotes." };

  try {
    const quoteResults = await Promise.allSettled(instruments.map(({ providerSymbol }) => fmp<FmpQuote[]>(`quote?symbol=${encodeURIComponent(providerSymbol)}`, apiKey)));
    const allQuotes = quoteResults.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    if (!allQuotes.length) {
      const failure = quoteResults.find((result): result is PromiseRejectedResult => result.status === "rejected");
      throw failure?.reason instanceof Error ? failure.reason : new Error("INVALID_RESPONSE");
    }
    const bySymbol = new Map(allQuotes.map((quote) => [quote.symbol, quote]));
    const quotes = instruments.map((instrument) => normalize(instrument, bySymbol.get(instrument.providerSymbol)));
    const updatedAt = new Date().toISOString();
    const response: MarketQuotesResponse = { quotes, updatedAt, provider: "Financial Modeling Prep", status: quotes.every(({ dataType }) => dataType === "unavailable") ? "unavailable" : quotes.some(({ dataType }) => dataType === "unavailable") ? "partial" : "ok" };
    const anyOpen = quotes.some(({ marketStatus }) => marketStatus === "open");
    cache.set(key, { response, expiresAt: now + (anyOpen ? 60_000 : 15 * 60_000) });
    lastResponses.set(key, response);
    return response;
  } catch (error) {
    const last = lastResponses.get(key);
    if (last) return { ...last, status: "partial", message: "Refresh failed; showing the last verified market response." };
    const rateLimited = error instanceof Error && error.message === "RATE_LIMITED";
    const unauthorized = error instanceof Error && error.message === "UNAUTHORIZED";
    return { quotes: instruments.map(unavailable), updatedAt: null, provider: "Financial Modeling Prep", status: rateLimited ? "rate-limited" : unauthorized ? "unauthorized" : "unavailable", message: rateLimited ? "Quote refresh limit reached. Try again shortly." : "Market data is temporarily unavailable." };
  }
}
