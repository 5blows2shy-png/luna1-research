import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const data = readFileSync("src/lib/luna-books-demo.ts", "utf8");
const component = readFileSync("src/components/luna-books-tour.tsx", "utf8");
const page = readFileSync("src/app/demo/luna-books-tour/page.tsx", "utf8");
const lunaBooksPage = readFileSync("src/app/klyro/page.tsx", "utf8");
const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
const css = readFileSync("src/app/luxury.css", "utf8");

test("demo route is public, indexable, and contains no production gate", () => {
  assert.doesNotMatch(page, /LUNA_BOOKS_DEMO_ENABLED|notFound\(\)/);
  assert.match(page, /index: true/); assert.match(page, /follow: true/);
});

test("the existing Luna Books experience links to the public test drive", () => {
  assert.match(lunaBooksPage, /href="\/demo\/luna-books-tour"/);
  assert.match(lunaBooksPage, /Safe public demo/);
  assert.match(sitemap, /"\/demo\/luna-books-tour"/);
});

test("deterministic calculations are internally consistent", () => {
  for (const pattern of [/const cashBalance = 42_850/, /const reservedObligations = 18_300/, /safeToSpend: cashBalance - reservedObligations/, /total: 82_500/, /healthy: 60_300/, /slowMoving: 13_400/, /deadStock: 5_800/, /excess: 3_000/, /recoverableCash: 12_100/, /cashAfter: cashBalance - 12_000/]) assert.match(data, pattern);
});

test("tour has the required twelve-scene sequence", () => {
  const ids = [...data.matchAll(/\{ id: "([^"]+)", navLabel:/g)].map(match => match[1]);
  assert.deepEqual(ids, ["welcome", "profile", "transactions", "cash", "runway", "receivables", "bills", "inventory", "afford", "forecast", "actions", "reports"]);
});

test("controls include previous, next, restart, autoplay, exit, and keyboard behavior", () => {
  for (const text of ["Previous", "Next", "Restart", "Auto Play", "Exit Tour"]) assert.match(component, new RegExp(text));
  for (const key of ["ArrowRight", "ArrowLeft", "Escape"]) assert.match(component, new RegExp(`event\\.key === "${key}"`));
  assert.match(component, /setIndex\(0\)/);
});

test("demo has no writes or live integration triggers", () => {
  assert.doesNotMatch(component, /fetch\(|axios|supabase|service_role|sendInvoice|initiatePayment/i);
  assert.match(component, /disabled>Schedule payment/); assert.match(component, /disabled>Send invitation/);
  assert.match(component, /data-demo-mode="isolated"/);
});

test("responsive and reduced-motion styles exist", () => {
  assert.match(css, /@media\(max-width:1000px\)/); assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/); assert.match(css, /\.lbt-stage\{animation:none\}/);
});

test("recording animation uses the original Luna1 prism palette", () => {
  for (const color of ["#669bc1", "#9b7bb7", "#d0845b"]) assert.match(css, new RegExp(color));
  assert.match(css, /lbt-scene-timer/); assert.match(css, /lbt-prism-scan/);
});
