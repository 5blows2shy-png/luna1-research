import "server-only";

export type FmpResource =
  | "profile" | "historical-price-full" | "income-statement" | "balance-sheet-statement" | "cash-flow-statement"
  | "earning-calendar" | "analyst-estimates" | "price-target" | "dividends" | "insider-trading" | "institutional-ownership"
  | "sec-filings" | "stock-news" | "earning-call-transcript" | "etf-holdings" | "economic-indicators" | "market-performance" | "sector-performance"
  | "stock-peers" | "dcf";

export type FmpDataStatus = "ok" | "unavailable" | "rate-limited" | "unauthorized" | "subscription-restricted" | "stale";
export type FmpDataResponse<T> = { status: FmpDataStatus; data: T; provider: "Financial Modeling Prep"; asOf: string | null; message?: string };
export type CompanyProfile = { symbol?: string; companyName?: string; industry?: string; sector?: string; exchange?: string; website?: string; description?: string; beta?: number; marketCap?: number };
export type HistoricalPrice = { date?: string; open?: number; high?: number; low?: number; close?: number; adjClose?: number; volume?: number };
export type FinancialStatement = { date?: string; calendarYear?: string; period?: string; revenue?: number; netIncome?: number; totalAssets?: number; totalLiabilities?: number; operatingCashFlow?: number; freeCashFlow?: number };
export type EarningsRecord = { date?: string; symbol?: string; eps?: number; epsEstimated?: number; revenue?: number; revenueEstimated?: number; fiscalDateEnding?: string };
export type NewsRecord = { symbol?: string; publishedDate?: string; title?: string; image?: string; site?: string; text?: string; url?: string };
type CacheEntry = { value: FmpDataResponse<unknown>; expiresAt: number };
const globalState = globalThis as typeof globalThis & { luna1FmpResourceCache?: Map<string, CacheEntry> };
const cache = (globalState.luna1FmpResourceCache ??= new Map());

const paths: Record<FmpResource, string> = {
  profile: "profile",
  "historical-price-full": "historical-price-full",
  "income-statement": "income-statement",
  "balance-sheet-statement": "balance-sheet-statement",
  "cash-flow-statement": "cash-flow-statement",
  "earning-calendar": "earning-calendar",
  "analyst-estimates": "analyst-estimates",
  "price-target": "price-target",
  dividends: "dividends",
  "insider-trading": "insider-trading",
  "institutional-ownership": "institutional-ownership/latest",
  "sec-filings": "sec-filings-8-k",
  "stock-news": "stock-news",
  "earning-call-transcript": "earning_call_transcript",
  "etf-holdings": "etf-holder",
  "economic-indicators": "economic-indicators",
  "market-performance": "market-performance",
  "sector-performance": "sector-performance",
  "stock-peers": "stock-peers",
  dcf: "discounted-cash-flow",
};

function safePayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.historical)) return record.historical;
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.results)) return record.results;
    if (Object.keys(record).length) return [record];
  }
  return [];
}

export async function getFmpResource<T = Record<string, unknown>>(resource: FmpResource, params: Record<string, string | number | undefined> = {}, options: { ttlMs?: number } = {}): Promise<FmpDataResponse<T[]>> {
  const apiKey = process.env.MARKET_DATA_API_KEY?.trim();
  const query = Object.entries(params).filter(([, value]) => value !== undefined && value !== "").map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join("&");
  const key = `${resource}?${query}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.value as FmpDataResponse<T[]>;
  if (!apiKey) return { status: "unavailable", data: [], provider: "Financial Modeling Prep", asOf: null, message: "Market data connection is not configured." };
  try {
    const url = `https://financialmodelingprep.com/stable/${paths[resource]}${query ? `?${query}` : ""}`;
    const response = await fetch(url, { headers: { apikey: apiKey }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
    if (response.status === 401 || response.status === 403) return { status: "unauthorized", data: [], provider: "Financial Modeling Prep", asOf: null, message: "The configured FMP plan rejected this request." };
    if (response.status === 429) return { status: "rate-limited", data: [], provider: "Financial Modeling Prep", asOf: null, message: "FMP request limit reached. Try again shortly." };
    if (!response.ok) return { status: response.status === 404 ? "subscription-restricted" : "unavailable", data: [], provider: "Financial Modeling Prep", asOf: null, message: `FMP returned HTTP ${response.status}.` };
    const data = safePayload(await response.json()) as T[];
    const value: FmpDataResponse<T[]> = { status: "ok", data, provider: "Financial Modeling Prep", asOf: new Date().toISOString() };
    cache.set(key, { value, expiresAt: now + (options.ttlMs ?? 5 * 60_000) });
    return value;
  } catch {
    return { status: "unavailable", data: [], provider: "Financial Modeling Prep", asOf: null, message: "FMP is temporarily unavailable; no data was fabricated." };
  }
}

export function getMarketNews(params: { symbol?: string; page?: number; limit?: number } = {}) {
  return getFmpResource("stock-news", params, { ttlMs: 5 * 60_000 });
}

export const getCompanyProfile = (symbol: string) => getFmpResource<CompanyProfile>("profile", { symbol }, { ttlMs: 24 * 60 * 60_000 });
export const getHistoricalPrices = (symbol: string, from?: string, to?: string) => getFmpResource<HistoricalPrice>("historical-price-full", { symbol, from, to }, { ttlMs: 15 * 60_000 });
export const getIncomeStatements = (symbol: string, limit = 8) => getFmpResource<FinancialStatement>("income-statement", { symbol, limit }, { ttlMs: 6 * 60 * 60_000 });
export const getBalanceSheets = (symbol: string, limit = 8) => getFmpResource<FinancialStatement>("balance-sheet-statement", { symbol, limit }, { ttlMs: 6 * 60 * 60_000 });
export const getCashFlowStatements = (symbol: string, limit = 8) => getFmpResource<FinancialStatement>("cash-flow-statement", { symbol, limit }, { ttlMs: 6 * 60 * 60_000 });
export const getEarningsCalendar = (from?: string, to?: string) => getFmpResource<EarningsRecord>("earning-calendar", { from, to }, { ttlMs: 15 * 60_000 });
export const getCompanyNews = (symbol?: string, limit = 20) => getFmpResource<NewsRecord>("stock-news", { symbol, limit }, { ttlMs: 5 * 60_000 });
