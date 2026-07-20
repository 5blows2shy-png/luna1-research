import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const requiredTickers = [
  "GLW",
  "AIPO",
  "JBL",
  "ALAB",
  "RY",
  "PANW",
  "PDFS",
  "ANET",
  "WWD",
  "AMAT",
  "GS",
  "DLR",
];
const coverageSource = fs.readFileSync(
  "src/data/research/research-companies.ts",
  "utf8",
);
const pageSource = fs.readFileSync(
  "src/components/research/company-research-page.tsx",
  "utf8",
);

test("every requested Watchlist ticker has a typed research record", () => {
  for (const ticker of requiredTickers)
    assert.match(coverageSource, new RegExp(`ticker: "${ticker}"`));
  assert.match(
    coverageSource,
    /ticker: "STRL"/,
    "the existing STRL Watchlist record should remain covered",
  );
  assert.equal(
    new Set(
      [...coverageSource.matchAll(/ticker: "([A-Z]+)"/g)].map(
        (match) => match[1],
      ),
    ).size,
    13,
  );
});

test("research pages use neutral placeholders and block unfinished downloads", () => {
  assert.match(coverageSource, /researchStatus: "Initial Research"/);
  assert.match(coverageSource, /thesisStatus: "Under Review"/);
  assert.match(coverageSource, /lastUpdated: "Date to be confirmed"/);
  assert.match(coverageSource, /status: "in-progress"/);
  assert.match(coverageSource, /url: null/);
  assert.doesNotMatch(coverageSource, /priceTarget|currentPrice|analystRating/);
  assert.match(pageSource, /disabled/);
  assert.match(pageSource, /DATA_PENDING/);
});

test("specialized ETF, bank, investment-bank, and REIT frameworks are present", () => {
  for (const phrase of [
    "Weighted underlying valuation",
    "Dividend discount model",
    "Residual income model",
    "Price-to-tangible-book",
    "Price/AFFO",
    "Net asset value",
    "Common Equity Tier 1 ratio",
    "Return on tangible equity",
  ]) {
    assert.ok(coverageSource.includes(phrase), `missing ${phrase}`);
  }
  assert.match(coverageSource, /facility associated with Digital Realty/);
  assert.doesNotMatch(
    coverageSource,
    /Digital Realty employee|employed directly by Digital Realty/,
  );
});

test("the reusable page exposes the complete research workflow", () => {
  for (const label of [
    "Executive summary",
    "Investment thesis",
    "Business overview",
    "Segment analysis",
    "Historical financials",
    "Revenue build",
    "Forecast model",
    "Valuation",
    "Comparable companies",
    "Catalysts",
    "Risks",
    "Earnings history",
    "Research notes",
    "Sources and disclosures",
  ]) {
    assert.ok(pageSource.includes(label), `missing section ${label}`);
  }
});

test("document branding uses one guarded Luna1 configuration", () => {
  const brand = JSON.parse(fs.readFileSync("src/config/brand.json", "utf8"));
  assert.equal(brand.logoPath, "/brand/luna1-logo-horizontal.svg");
  assert.equal(brand.logoRasterPath, "/brand/luna1-logo-horizontal.png");
  assert.ok(fs.existsSync(path.join("public", brand.logoPath)));
  assert.ok(fs.existsSync(path.join("public", brand.logoRasterPath)));
  const pdfGenerator = fs.readFileSync(
    "scripts/generate_research_report.py",
    "utf8",
  );
  const modelGenerator = fs.readFileSync(
    "scripts/generate_valuation_model.mjs",
    "utf8",
  );
  for (const source of [pdfGenerator, modelGenerator]) {
    assert.match(source, /brand\.json/);
    assert.match(source, /reviewed/);
    assert.match(source, /Publication blocked/);
  }
  assert.match(modelGenerator, /extent/);
  assert.match(pdfGenerator, /preserveAspectRatio=True/);
});

test("Watchlist links, sitemap entries, and development log are updated", () => {
  const portfolio = fs.readFileSync("src/app/portfolios/page.tsx", "utf8");
  const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8");
  const log = fs.readFileSync("src/lib/development-log.ts", "utf8");
  assert.match(portfolio, /View Full Research/);
  assert.match(portfolio, /ResearchCoverageGrid/);
  assert.match(sitemap, /\/watchlist\/\$\{item\.slug\}/);
  assert.match(log, /Expanded Watchlist into Research Coverage Platform/);
  assert.match(log, /Introduced Industry-Specific Valuation Frameworks/);
});
