import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("market credentials remain server-side and unavailable data is explicit", async () => {
  const [route, service, client] = await Promise.all([read("src/app/api/market-quotes/route.ts"), read("src/lib/market-data-service.ts"), read("src/components/portfolio-market-board.tsx")]);
  assert.match(service, /process\.env\.MARKET_DATA_API_KEY/);
  assert.doesNotMatch(client, /MARKET_DATA_API_KEY|api\.twelvedata\.com/);
  assert.match(service, /Market data unavailable/);
  assert.match(route, /portfolioTickerSymbols\.includes/);
});

test("portfolio ticker exposes every Luna1 portfolio bucket", async () => {
  const config = await read("src/lib/market-ticker-config.ts");
  for (const bucket of ["Active Positions", "Watchlist", "Long-Term Compounders"]) assert.ok(config.includes(bucket));
  for (const ticker of ["CASY", "PANW", "WELL", "LLY", "AAPL", "COST", "PG", "AMZN"]) assert.match(config, new RegExp(`["]${ticker}["]`));
});

test("ticker includes integrity, refresh, cache, and accessibility safeguards", async () => {
  const [service, hook, component] = await Promise.all([read("src/lib/market-data-service.ts"), read("src/hooks/use-market-quotes.ts"), read("src/components/portfolio-market-board.tsx")]);
  assert.match(service, /providerResponse\.status === 429/);
  assert.match(service, /quotes\.some\(\(quote\) => quote\.dataType === "unavailable"\)/);
  assert.match(service, /60_000/);
  assert.match(service, /15 \* 60_000/);
  assert.match(hook, /document\.visibilityState === "visible"/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /Market data may be delayed/);
});
