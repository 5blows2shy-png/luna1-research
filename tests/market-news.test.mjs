import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("market headlines use a server-side FMP route below Market Pulse", async () => {
  const [service, route, component, layout] = await Promise.all([read("src/lib/market-news.ts"), read("src/app/api/market-news/route.ts"), read("src/components/market-headlines.tsx"), read("src/app/layout.tsx")]);
  assert.match(service, /process\.env\.MARKET_DATA_API_KEY/);
  assert.match(service, /financialmodelingprep\.com\/stable\/news\/stock-latest/);
  assert.match(route, /getMarketNews/);
  assert.match(component, /visibilitychange/);
  assert.match(component, /Market headlines unavailable/);
  assert.match(layout, /<MarketPulse\/><MarketHeadlines\/>/);
});
