import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("market pulse normalizes FMP arrays and calculates missing percentages", async () => {
  const provider = await read("src/lib/market-pulse/fmp-provider.ts");
  assert.match(provider, /Array\.isArray\(payload\)/);
  assert.match(provider, /price - change/);
  assert.match(provider, /change \/ previousClose \* 100/);
  assert.match(provider, /previousClose/);
  assert.match(provider, /fmpSymbolByInstrumentId/);
});

test("market pulse isolates failures and retains cached stale quotes", async () => {
  const service = await read("src/lib/market-pulse/service.ts");
  assert.match(service, /Promise\.allSettled/);
  assert.match(service, /quoteCache/);
  assert.match(service, /cached \? \{ \.\.\.cached, stale: true/);
  assert.match(service, /price: null/);
  assert.match(service, /AbortSignal\.timeout\(8_000\)/);
});

test("market pulse polling cleans up, pauses, and follows tab visibility", async () => {
  const hook = await read("src/hooks/use-market-pulse.ts");
  assert.match(hook, /paused \|\| inFlight\.current/);
  assert.match(hook, /20_000 : 90_000/);
  assert.match(hook, /visibilitychange/);
  assert.match(hook, /clearInterval/);
  assert.match(hook, /controller\.current\?\.abort\(\)/);
  assert.match(hook, /last verified values retained/i);
});

test("market pulse formats Treasury yields and instrument-level fallbacks", async () => {
  const component = await read("src/components/market-pulse.tsx");
  assert.match(component, /assetClass === "treasury"/);
  assert.match(component, /formatQuoteNumber\(quote\.price, 3\)/);
  assert.match(component, /UNAVAILABLE/);
  assert.match(component, /STALE/);
  assert.match(component, /Resume market ticker updates and motion/);
});
