import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const data = readFileSync(new URL("../src/data/luna-books-ad.ts", import.meta.url), "utf8");
const player = readFileSync(new URL("../src/components/luna-books-ad/luna-books-ad.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/components/luna-books-ad/luna-books-ad.module.css", import.meta.url), "utf8");
const route = readFileSync(new URL("../src/app/demo/luna-books-ad/page.tsx", import.meta.url), "utf8");

test("ad scenes form a deterministic 60-second sequence", () => {
  for (const timing of [
    'start: 0, duration: 5', 'start: 5, duration: 8', 'start: 13, duration: 8',
    'start: 21, duration: 9', 'start: 30, duration: 10', 'start: 40, duration: 10',
    'start: 50, duration: 10',
  ]) assert.match(data, new RegExp(timing));
  assert.match(data, /LUNA_BOOKS_AD_DURATION = 60/);
});

test("demo values are isolated, fictional, and mathematically consistent", () => {
  assert.match(data, /dataLabel: "Fictional demonstration data"/);
  assert.match(data, /bankBalance: 42_850/);
  assert.match(data, /upcomingObligations: 18_300/);
  assert.match(data, /safeToSpend: 24_550/);
  assert.equal(42_850 - 18_300, 24_550);
  assert.equal(13_400 + 5_800 + 3_000, 22_200);
  assert.match(data, /importedFiles: \["Bank activity\.csv", "July statements\.pdf", "General ledger\.xlsx"\]/);
  assert.match(data, /closeReadiness: 84/);
  assert.doesNotMatch(player, /fetch\(|axios|supabase|service.?role|POST|DELETE|PUT/);
});

test("Klyro player autoplays without recording controls and supports reduced motion", () => {
  assert.match(player, /export function KlyroAd/);
  assert.match(player, /% LUNA_BOOKS_AD_DURATION/);
  assert.doesNotMatch(player, /Start Ad|Previous Scene|Next Scene|Hide Controls|Advertisement recording controls/);
  assert.match(player, /requestAnimationFrame/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.match(styles, /aspect-ratio:16\/8\.6/);
  assert.match(route, /redirect\("\/klyro"\)/);
});

test("Klyro advertisement reflects the connected accounting workflow", () => {
  for (const capability of [
    "Bring in the books—together.",
    "Decision Board",
    "Journal Entry Assistant",
    "Possible duplicates",
    "Cash-flow intelligence",
    "Profit & loss preview",
    "Monthly Close Board Packet",
    "Board narrative",
    "Excel · PDF",
    "Accountant and document review",
  ]) assert.match(player, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(player, /Development demo/);
  assert.match(player, /Review only/);
});
