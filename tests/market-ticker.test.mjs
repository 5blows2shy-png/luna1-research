import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("market credentials remain server-side and unavailable data is explicit", async () => {
  const [route, service, client] = await Promise.all([read("src/app/api/market-quotes/route.ts"), read("src/lib/market-data-service.ts"), read("src/components/portfolio-market-board.tsx")]);
  assert.match(service, /process\.env\.MARKET_DATA_API_KEY/);
  assert.doesNotMatch(client, /MARKET_DATA_API_KEY|api\.twelvedata\.com/);
  assert.match(service, /Market data unavailable/);
  assert.match(route, /supportedMarketInstruments\.has/);
});

test("global market pulse includes the requested direct instruments", async () => {
  const [config, component, wrapper, layout] = await Promise.all([read("src/lib/market-ticker-config.ts"), read("src/components/market-pulse.tsx"), read("src/components/route-aware-market-pulse.tsx"), read("src/app/layout.tsx")]);
  for (const ticker of ["SPX", "COMP", "DJIA", "RUT", "US10Y", "WTI", "NATGAS", "GOLD", "NVDA", "AVGO", "EQIX", "DLR", "VRT", "ANET", "BE", "V", "MA", "ICE", "CME", "SPGI", "MSCI"]) assert.ok(config.includes(`symbol: "${ticker}"`) || config.includes(`"${ticker}"`));
  assert.match(component, /Luna1 Market Pulse/);
  assert.match(component, /Market data may be delayed/);
  assert.match(component, /ArrowRight/);
  assert.match(wrapper, /<MarketPulse \/>/);
  assert.match(layout, /<Navbar\/><RouteAwareMarketPulse\/>/);
});

test("market service uses secure normalized FMP endpoints and adaptive caching", async () => {
  const [service, config, watchlist] = await Promise.all([read("src/lib/market-data-service.ts"), read("src/lib/market-ticker-config.ts"), read("src/lib/watchlist-data.ts")]);
  assert.match(service, /process\.env\.MARKET_DATA_API_KEY/);
  assert.match(service, /financialmodelingprep\.com\/stable/);
  assert.match(service, /quote\?symbol=/);
  assert.doesNotMatch(service, /batch-index-quotes|batch-commodity-quotes|treasury-rates|api\.twelvedata\.com/);
  assert.match(config, /providerSymbol: "\^TNX"/);
  assert.match(service, /Array\.isArray\(payload\)/);
  assert.match(service, /\["Error Message"\]/);
  assert.match(service, /finiteNumber/);
  assert.match(service, /changePercentage/);
  assert.match(service, /Promise\.allSettled/);
  for (const ticker of ["BE", "WELL", "AIPO"]) assert.match(`${config}\n${watchlist}`, new RegExp(`"${ticker}"`));
  assert.match(service, /60_000/);
  assert.match(service, /15 \* 60_000/);
});

test("market quote route validates, rate limits, and sanitizes its public contract", async () => {
  const [route, hook] = await Promise.all([read("src/app/api/market-quotes/route.ts"), read("src/hooks/use-market-quotes.ts")]);
  assert.match(route, /process\.env\.MARKET_DATA_API_KEY/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_MARKET_DATA_API_KEY/);
  assert.match(route, /Market data connection is not configured\./);
  assert.match(route, /supportedMarketInstruments\.has/);
  assert.match(route, /MAX_SYMBOLS = 24/);
  assert.match(route, /RATE_LIMIT = 60/);
  assert.match(route, /unavailableSymbols/);
  assert.match(route, /lastUpdated/);
  assert.match(route, /Retry-After/);
  assert.match(hook, /AbortController/);
  assert.match(hook, /inFlight\.current/);
  assert.match(hook, /visibilitychange/);
});

test("portfolio sections share a deduplicated quote provider", async () => {
  const [page, provider, display, hook, config] = await Promise.all([read("src/app/portfolios/page.tsx"), read("src/components/market/market-quotes-provider.tsx"), read("src/components/market/quote-display.tsx"), read("src/hooks/use-market-quotes.ts"), read("src/lib/market-ticker-config.ts")]);
  assert.match(page, /<MarketQuotesProvider symbols=\{allPortfolioSymbols\}>/);
  assert.match(page, /<QuoteDisplay symbol=\{position\.ticker\}/);
  assert.match(page, /<QuoteDisplay symbol=\{item\.ticker\}/);
  for (const symbol of ["AAPL", "COST", "VOO", "QQQM", "IAU", "SLV", "SGOV"]) assert.match(`${page}\n${config}`, new RegExp(`"${symbol}"`));
  assert.match(provider, /new Set/);
  assert.match(provider, /\.sort\(\)/);
  assert.match(display, /Previous Close|dataTypeLabels/);
  assert.match(display, /Quote unavailable/);
  assert.match(hook, /quotesBySymbol/);
});

test("portfolio ticker exposes every Luna1 portfolio bucket", async () => {
  const config = await read("src/lib/market-ticker-config.ts");
  for (const bucket of ["Active Positions", "Watchlist", "Long-Term Compounders"]) assert.ok(config.includes(bucket));
  for (const ticker of ["CASY", "ANET", "WELL", "LLY", "AAPL", "COST", "PG", "AMZN", "AIPO"]) assert.match(config, new RegExp(`["]${ticker}["]`));
  assert.doesNotMatch(config, /"PANW"/);
});

test("ticker includes integrity, refresh, cache, and accessibility safeguards", async () => {
  const [service, hook, component] = await Promise.all([read("src/lib/market-data-service.ts"), read("src/hooks/use-market-quotes.ts"), read("src/components/portfolio-market-board.tsx")]);
  assert.match(service, /response\.status === 429/);
  assert.match(service, /quotes\.some\(\(\{ dataType \}\) => dataType === "unavailable"\)/);
  assert.match(service, /60_000/);
  assert.match(service, /15 \* 60_000/);
  assert.match(hook, /document\.visibilityState === "visible"/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /Market data may be delayed/);
});
