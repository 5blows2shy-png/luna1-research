import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const service = fs.readFileSync("src/lib/fmp-market-service.ts", "utf8");
const route = fs.readFileSync("src/app/api/market-data/route.ts", "utf8");
const news = fs.readFileSync("src/app/api/market-news/route.ts", "utf8");

test("FMP resource service remains server-only and key-free in client code", () => {
  assert.match(service, /import ["']server-only["']/);
  assert.match(service, /process\.env\.MARKET_DATA_API_KEY/);
  assert.doesNotMatch(service, /NEXT_PUBLIC_MARKET_DATA_API_KEY/);
});

test("FMP resource catalog covers the requested research families", () => {
  for (const resource of ["profile", "historical-price-full", "income-statement", "earning-calendar", "analyst-estimates", "price-target", "dividends", "insider-trading", "institutional-ownership", "sec-filings", "earning-call-transcript", "etf-holdings", "economic-indicators", "market-performance", "sector-performance", "stock-peers", "dcf"]) assert.match(service, new RegExp(`\\"${resource}\\"`));
});

test("market data and news routes preserve rate limits and explicit provider states", () => {
  assert.match(route, /rate-limited/);
  assert.match(route, /subscription-restricted/);
  assert.match(route, /getFmpResource/);
  assert.match(news, /getMarketNews/);
  assert.match(news, /headlines: \[\]/);
});
