import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/klyro/page.tsx", "utf8");
const component = readFileSync("src/components/klyro-tour-slideshow.tsx", "utf8");
const styles = readFileSync("src/app/luxury.css", "utf8");

test("Klyro ends with the reusable public demo slideshow", () => {
  assert.match(page, /<TransactionIntelligenceWorkspace \/>\s*<KlyroTourSlideshow \/>/);
  assert.match(component, /tutorialScenes\.map/);
  assert.match(component, /href="\/demo\/luna-books-tour"/);
});

test("slideshow supports manual and automatic navigation", () => {
  for (const label of ["Previous", "Next", "Play slideshow", "Pause"]) assert.match(component, new RegExp(label));
  assert.match(component, /6500/);
  assert.match(component, /aria-live="polite"/);
});

test("slideshow is responsive and respects reduced motion", () => {
  assert.match(styles, /\.klyro-tour-slideshow/);
  assert.match(styles, /@media\(max-width:700px\)/);
  assert.match(styles, /@media\(prefers-reduced-motion:reduce\)/);
});
