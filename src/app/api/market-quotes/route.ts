import { getMarketQuotes } from "@/lib/market-data-service";
import type { MarketDataType, MarketQuotesApiResponse } from "@/lib/market-data";
import { supportedMarketInstruments } from "@/lib/market-ticker-config";

export const runtime = "nodejs";
const MAX_SYMBOLS = 24;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 60;
type RateEntry = { count: number; resetsAt: number };
const globalRateState = globalThis as typeof globalThis & { luna1MarketRouteRates?: Map<string, RateEntry> };
const requestRates = (globalRateState.luna1MarketRouteRates ??= new Map());

function clientKey(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "anonymous";
}

function isRateLimited(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const current = requestRates.get(key);
  if (!current || current.resetsAt <= now) {
    requestRates.set(key, { count: 1, resetsAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function safeError(status: MarketQuotesApiResponse["status"], message: string): MarketQuotesApiResponse {
  return { status, lastUpdated: null, quotes: [], unavailableSymbols: [], message };
}

export async function GET(request: Request) {
  if (isRateLimited(request)) {
    return Response.json(safeError("rate-limited", "Quote refresh limit reached. Try again shortly."), { status: 429, headers: { "Retry-After": "60" } });
  }
  if (!process.env.MARKET_DATA_API_KEY?.trim()) {
    return Response.json({ status: "unavailable", message: "Market data connection is not configured." }, { status: 503 });
  }

  const raw = new URL(request.url).searchParams.get("symbols");
  const requested = raw?.split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean) ?? [];
  const malformed = requested.some((symbol) => !/^[A-Z0-9]{1,10}$/.test(symbol));
  const unsupported = requested.filter((symbol) => !supportedMarketInstruments.has(symbol));
  if (!requested.length || malformed || unsupported.length || requested.length > MAX_SYMBOLS) {
    return Response.json(safeError("unavailable", "One or more requested market symbols are unsupported."), { status: 400 });
  }

  const symbols = Array.from(new Set(requested));
  const response = await getMarketQuotes(symbols.map((symbol) => supportedMarketInstruments.get(symbol)!));
  const available = response.quotes.filter(({ dataType }) => dataType !== "unavailable");
  const unavailableSymbols = response.quotes.filter(({ dataType }) => dataType === "unavailable").map(({ symbol }) => symbol);
  const dataType: MarketDataType | undefined = available.some(({ dataType: type }) => type === "real-time") ? "real-time" : available.some(({ dataType: type }) => type === "delayed") ? "delayed" : available.length ? "previous-close" : undefined;
  const payload: MarketQuotesApiResponse = {
    status: response.status === "ok" ? "success" : response.status === "partial" ? "partial" : response.status === "rate-limited" ? "rate-limited" : "unavailable",
    ...(dataType && { dataType }),
    lastUpdated: response.updatedAt,
    quotes: available.map(({ symbol, price, change, changePercent, currency, marketStatus, timestamp }) => ({ symbol, price, change, changePercent, currency, marketStatus, timestamp })),
    unavailableSymbols,
    provider: "Financial Modeling Prep",
    ...(response.message && { message: response.message }),
  };
  const httpStatus = response.status === "rate-limited" ? 429 : response.status === "unavailable" || response.status === "unauthorized" ? 503 : 200;
  const headers = new Headers();
  headers.set("Cache-Control", httpStatus >= 400 ? "private, no-store" : "public, max-age=30, stale-while-revalidate=60");
  if (httpStatus < 400) {
    headers.set("CDN-Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    headers.set("Vercel-CDN-Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  }
  if (httpStatus === 429) headers.set("Retry-After", "60");
  return Response.json(payload, { status: httpStatus, headers });
}
