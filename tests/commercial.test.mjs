import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync(new URL("../src/components/commercial/luna-commercial.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

test("commercial feature stays under 30 seconds and exposes accessible controls", () => {
  assert.match(player, /commercialCuts\[cut\]\.duration/);
  for (const label of ["Play commercial", "Restart commercial", "Mute commercial", "Skip intro", "Enter fullscreen", "Commercial timeline"]) assert.match(player, new RegExp(label));
  assert.match(player, /useReducedMotion/);
  assert.match(player, /kind="captions"/);
});

test("commercial source is preserved without a public page or homepage embed", () => {
  assert.equal(existsSync(new URL("../src/app/commercial/page.tsx", import.meta.url)), false);
  assert.doesNotMatch(home, /LunaCommercial|href="\/commercial"|home-commercial/);
});
