import "server-only";
import { marketPulseInstruments, type MarketPulseInstrument } from "@/lib/market-pulse/config";
import { createFmpMarketPulseProvider, type MarketPulseProvider } from "@/lib/market-pulse/fmp-provider";
import type { MarketPulseQuote, MarketPulseResponse } from "@/lib/market-pulse/types";

type CacheEntry = { quote: MarketPulseQuote; expiresAt: number };
const globalState = globalThis as typeof globalThis & { luna1PulseCache?: Map<string, CacheEntry> };
const quoteCache = (globalState.luna1PulseCache ??= new Map<string, CacheEntry>());

function unavailable(instrument: MarketPulseInstrument, error: string): MarketPulseQuote {
  return { ...instrument, price: null, change: null, changePercent: null, previousClose: null, marketStatus: "unknown", asOf: null, delayed: true, stale: false, error };
}

function safeError(error: unknown) {
  if (!(error instanceof Error)) return "Quote unavailable";
  if (error.message === "RATE_LIMITED") return "Provider rate limit reached";
  if (error.message === "UNAUTHORIZED") return "Provider authorization failed";
  if (error.message === "UNSUPPORTED_SYMBOL") return "Instrument is unsupported";
  return "Quote temporarily unavailable";
}

function cacheLifetime(quote: MarketPulseQuote) {
  return quote.marketStatus === "open" ? 20_000 : 90_000;
}

export async function getMarketPulse(provider?: MarketPulseProvider): Promise<MarketPulseResponse> {
  const apiKey = process.env.MARKET_DATA_API_KEY?.trim();
  const activeProvider = provider ?? (apiKey ? createFmpMarketPulseProvider(apiKey) : null);
  const now = Date.now();
  const results = await Promise.allSettled(marketPulseInstruments.map(async (instrument) => {
    const cached = quoteCache.get(instrument.id);
    if (cached && cached.expiresAt > now) return cached.quote;
    if (!activeProvider) throw new Error("NOT_CONFIGURED");
    const quote = await activeProvider.fetchQuote(instrument, AbortSignal.timeout(8_000));
    quoteCache.set(instrument.id, { quote, expiresAt: now + cacheLifetime(quote) });
    return quote;
  }));

  const quotes = results.map((result, index) => {
    if (result.status === "fulfilled") return result.value;
    const instrument = marketPulseInstruments[index];
    const cached = quoteCache.get(instrument.id)?.quote;
    const error = activeProvider ? safeError(result.reason) : "Market data connection is not configured";
    if (process.env.NODE_ENV === "development") console.warn("[market-pulse] quote unavailable", { id: instrument.id, reason: error });
    return cached ? { ...cached, stale: true, error } : unavailable(instrument, error);
  });
  const availableCount = quotes.filter(({ price }) => price !== null).length;
  const updatedAt = quotes.reduce<string | null>((latest, quote) => !quote.asOf || latest && latest >= quote.asOf ? latest : quote.asOf, null);
  return {
    quotes,
    updatedAt,
    provider: "Financial Modeling Prep",
    status: availableCount === quotes.length ? "ok" : availableCount ? "partial" : "unavailable",
    ...(activeProvider ? {} : { message: "Market data unavailable. Configure MARKET_DATA_API_KEY on the server." }),
  };
}
