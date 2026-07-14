import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Luna1 Next.js application is deployable from the repository root", () => {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.dependencies.next, "16.2.10");
  assert.ok(fs.existsSync("src/app/layout.tsx"));
  assert.ok(fs.existsSync("src/app/page.tsx"));
  assert.ok(fs.existsSync("next.config.ts"));
  assert.ok(!fs.existsSync("prism-investment-research/package.json"));
});
