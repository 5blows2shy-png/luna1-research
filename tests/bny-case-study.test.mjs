import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const read = (file) => fs.readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("BNY research case distinguishes the base business from optionality", async () => {
  const [page, data, component, sitemap] = await Promise.all([
    read("src/app/research/bny/page.tsx"),
    read("src/data/research/bny-case-study.ts"),
    read("src/components/research/bny-thought-process.tsx"),
    read("src/app/sitemap.ts"),
  ]);
  assert.match(data, /Financial Infrastructure, Valuation & Optionality/);
  assert.match(page, /title="BNY"/);
  assert.match(data, /existing business must justify the investment first/i);
  assert.match(data, /Optionality should improve the upside case, not rescue the base case/i);
  assert.match(component, /Editable research scenario/);
  assert.match(component, /Starter Position/);
  assert.match(page, /Thesis invalidation/);
  assert.match(page, /KPIs to monitor/);
  assert.match(data, /BNY Investor Relations/);
  assert.match(sitemap, /"\/research\/bny"/);
});
