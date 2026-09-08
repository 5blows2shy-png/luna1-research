import "server-only";

import {
  getFmpResource,
  type FmpDataResponse,
  type FmpResource,
} from "@/lib/fmp-market-service";

/**
 * Provider records intentionally remain open-ended: FMP adds fields by plan
 * and endpoint. Keeping the transport typed without inventing fields lets
 * callers distinguish reported data from unavailable or subscription-limited
 * responses safely.
 */
export type FmpRecord = Record<string, unknown>;
export type FmpResult = FmpDataResponse<FmpRecord[]>;
export type FmpQuery = Record<string, string | number | undefined>;

type ResourceOptions = { ttlMs?: number };

async function resource(
  name: FmpResource,
  query: FmpQuery = {},
  options?: ResourceOptions,
): Promise<FmpResult> {
  return getFmpResource<FmpRecord>(name, query, options);
}

export function getCompanyProfiles(symbol: string, options?: ResourceOptions) {
  return resource("profile", { symbol }, options);
}

export function getHistoricalPrices(
  symbol: string,
  query: Partial<Pick<FmpQuery, "from" | "to" | "timeseries">> = {},
  options?: ResourceOptions,
) {
  return resource("historical-price-full", { symbol, ...query }, options);
}

export function getFinancialStatements(
  symbol: string,
  statement: "income-statement" | "balance-sheet-statement" | "cash-flow-statement",
  query: Partial<Pick<FmpQuery, "period" | "limit" | "from" | "to">> = {},
  options?: ResourceOptions,
) {
  return resource(statement, { symbol, ...query }, options);
}

export function getEarningsCalendar(query: FmpQuery = {}, options?: ResourceOptions) {
  return resource("earning-calendar", query, options);
}

export function getAnalystEstimates(symbol: string, options?: ResourceOptions) {
  return resource("analyst-estimates", { symbol }, options);
}

export function getPriceTargets(symbol: string, options?: ResourceOptions) {
  return resource("price-target", { symbol }, options);
}

export function getDividends(symbol: string, options?: ResourceOptions) {
  return resource("dividends", { symbol }, options);
}

export function getInsiderTransactions(symbol: string, options?: ResourceOptions) {
  return resource("insider-trading", { symbol }, options);
}

export function getInstitutionalOwnership(symbol: string, options?: ResourceOptions) {
  return resource("institutional-ownership", { symbol }, options);
}

export function getSecFilings(symbol: string, options?: ResourceOptions) {
  return resource("sec-filings", { symbol }, options);
}

export function getEarningsCallTranscript(
  symbol: string,
  year?: number,
  quarter?: number,
  options?: ResourceOptions,
) {
  return resource("earning-call-transcript", { symbol, year, quarter }, options);
}

export function getEtfHoldings(symbol: string, options?: ResourceOptions) {
  return resource("etf-holdings", { symbol }, options);
}

export function getEconomicIndicators(
  name: string,
  options?: ResourceOptions,
) {
  return resource("economic-indicators", { name }, options);
}

export function getMarketPerformance(options?: ResourceOptions) {
  return resource("market-performance", {}, options);
}

export function getSectorPerformance(options?: ResourceOptions) {
  return resource("sector-performance", {}, options);
}

export function getComparableCompanies(symbol: string, options?: ResourceOptions) {
  return resource("stock-peers", { symbol }, options);
}

export function getDcfInputs(symbol: string, options?: ResourceOptions) {
  return resource("dcf", { symbol }, options);
}
