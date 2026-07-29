import "server-only";
import type { MarketQuote, MarketQuotesResponse } from "@/lib/market-data";

type ProviderQuote = {
  symbol?: string;
  name?: string;
  currency?: string;
  close?: string;
  change?: string;
  percent_change?: string;
  timestamp?: number;
  is_market_open?: boolean;
  status?: string;
  code?: number;
  message?: string;
};

type CacheEntry = { response: MarketQuotesResponse; expiresAt: number };
const globalMarketCache = globalThis as typeof globalThis & {
  luna1MarketCache?: Map<string, CacheEntry>;
  luna1LastMarketResponse?: MarketQuotesResponse;
};
const cache = (globalMarketCache.luna1MarketCache ??= new Map());

function unavailable(symbol: string): MarketQuote {
  return { symbol, name: symbol, price: null, change: null, changePercent: null, currency: "USD", marketStatus: "unknown", timestamp: null, dataType: "unavailable" };
}

function normalize(symbol: string, quote?: ProviderQuote): MarketQuote {
  const price = Number(quote?.close);
  const change = Number(quote?.change);
  const changePercent = Number(quote?.percent_change);
  if (!quote || quote.status === "error" || !Number.isFinite(price)) return unavailable(symbol);
  return {
    symbol,
    name: quote.name || symbol,
    price,
    change: Number.isFinite(change) ? change : null,
    changePercent: Number.isFinite(changePercent) ? changePercent : null,
    currency: quote.currency || "USD",
    marketStatus: quote.is_market_open === true ? "open" : quote.is_market_open === false ? "closed" : "unknown",
    timestamp: quote.timestamp ? new Date(quote.timestamp * 1000).toISOString() : null,
    dataType: quote.is_market_open ? "delayed" : "previous-close",
  };
}

export async function getMarketQuotes(symbols: string[]): Promise<MarketQuotesResponse> {
  const key = symbols.join(",");
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.response;
  const apiKey = process.env.MARKET_DATA_API_KEY;
  if (!apiKey) return { quotes: symbols.map(unavailable), updatedAt: null, provider: null, status: "unavailable", message: "Market data unavailable. Add a server-side market data connection to enable current quotes." };

  try {
    const url = new URL("https://api.twelvedata.com/quote");
    url.searchParams.set("symbol", symbols.join(","));
    const providerResponse = await fetch(url, { headers: { Authorization: `apikey ${apiKey}` }, cache: "no-store", signal: AbortSignal.timeout(8_000) });
    if (providerResponse.status === 429) return { quotes: symbols.map(unavailable), updatedAt: globalMarketCache.luna1LastMarketResponse?.updatedAt ?? null, provider: "Twelve Data", status: "rate-limited", message: "Market-data rate limit reached. Quotes will refresh after the provider window resets." };
    if (!providerResponse.ok) throw new Error(`Market provider returned ${providerResponse.status}`);
    const payload = (await providerResponse.json()) as ProviderQuote | Record<string, ProviderQuote>;
    const singleResponse = payload as ProviderQuote;
    if (singleResponse.status === "error") throw new Error(singleResponse.message || "Market provider error");
    const quoteMap = symbols.length === 1 ? { [symbols[0]]: payload as ProviderQuote } : payload as Record<string, ProviderQuote>;
    const quotes = symbols.map((symbol) => normalize(symbol, quoteMap[symbol]));
    const updatedAt = new Date().toISOString();
    const response: MarketQuotesResponse = { quotes, updatedAt, provider: "Twelve Data", status: quotes.every((quote) => quote.dataType === "unavailable") ? "unavailable" : quotes.some((quote) => quote.dataType === "unavailable") ? "partial" : "ok" };
    const anyOpen = quotes.some((quote) => quote.marketStatus === "open");
    cache.set(key, { response, expiresAt: now + (anyOpen ? 60_000 : 15 * 60_000) });
    globalMarketCache.luna1LastMarketResponse = response;
    return response;
  } catch {
    const last = globalMarketCache.luna1LastMarketResponse;
    if (last) return { ...last, status: "partial", message: "Refresh failed; showing the last verified market response." };
    return { quotes: symbols.map(unavailable), updatedAt: null, provider: "Twelve Data", status: "unavailable", message: "Market data is temporarily unavailable." };
  }
}
