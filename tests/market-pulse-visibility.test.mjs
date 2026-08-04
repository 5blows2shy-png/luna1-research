import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Luna Books alone suppresses the global market ticker", async () => {
  const [layout, routeAwarePulse] = await Promise.all([
    readFile("src/app/layout.tsx", "utf8"),
    readFile("src/components/route-aware-market-pulse.tsx", "utf8"),
  ]);

  assert.match(layout, /<RouteAwareMarketPulse\s*\/>/);
  assert.match(routeAwarePulse, /pathname === "\/transaction-intelligence"/);
  assert.match(routeAwarePulse, /pathname\.startsWith\("\/transaction-intelligence\/"\)/);
  assert.match(routeAwarePulse, /return isLunaBooks \? null : <MarketPulse \/>/);
});
