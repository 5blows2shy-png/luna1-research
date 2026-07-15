import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const player = readFileSync(new URL("../src/components/commercial/luna-commercial.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/app/commercial/page.tsx", import.meta.url), "utf8");

test("commercial stays at 25 seconds and exposes accessible controls", () => {
  assert.match(player, /const DURATION = 25/);
  for (const label of ["Play commercial", "Restart commercial", "Mute commercial"]) assert.match(player, new RegExp(label));
  assert.match(player, /useReducedMotion/);
  assert.match(player, /kind="captions"/);
});

test("commercial sharing metadata uses the dedicated poster", () => {
  assert.match(page, /commercial-poster\.png/);
  assert.match(page, /width: 1200, height: 630/);
});
