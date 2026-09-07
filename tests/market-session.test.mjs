import assert from "node:assert/strict";
import test from "node:test";
import { formatMarketCountdown, getMarketSession } from "../src/lib/market/market-session.ts";
import { dataTypeLabels } from "../src/lib/market/quote-formatting.ts";
import { mergeVerifiedQuotes } from "../src/lib/market/merge-quotes.ts";

const at = (iso) => getMarketSession(new Date(iso));

test("US equity session boundaries use America/New_York", () => {
  assert.equal(at("2026-08-03T13:29:00Z").session, "pre-market");
  assert.equal(at("2026-08-03T13:30:00Z").session, "regular");
  assert.equal(at("2026-08-03T20:00:00Z").session, "after-hours");
  assert.equal(at("2026-08-04T00:00:00Z").session, "closed");
  assert.equal(at("2026-08-08T16:00:00Z").session, "closed");
  assert.equal(at("2026-08-09T16:00:00Z").session, "closed");
});

test("Friday evening countdown targets Monday regular open", () => {
  const now = new Date("2026-08-08T00:01:00Z");
  const info = getMarketSession(now);
  assert.equal(info.nextOpen?.toISOString(), "2026-08-10T13:30:00.000Z");
  assert.match(formatMarketCountdown(now, info) ?? "", /^Opens Monday in /);
});

test("previous-close is labeled explicitly", () => {
  assert.equal(dataTypeLabels["previous-close"], "Previous Close");
});

test("a failed refresh retains the last verified quote", () => {
  const verified = { symbol: "AAPL", name: "Apple Inc.", price: 308.91, change: -24.52, changePercent: -7.35, currency: "USD", marketStatus: "closed", timestamp: "2026-07-31T13:30:00.000Z", dataType: "previous-close" };
  const merged = mergeVerifiedQuotes(["AAPL"], [verified], []);
  assert.deepEqual(merged, [verified]);
});
