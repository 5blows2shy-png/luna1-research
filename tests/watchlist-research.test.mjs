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
  "ANET",
  "DLR",
  "STRL",
];
const coverageSource = fs.readFileSync(
  "src/data/research/research-companies.ts",
  "utf8",
);
const pageSource = fs.readFileSync(
  "src/components/research/company-research-page.tsx",
  "utf8",
);
const financialSource = fs.readFileSync(
  "src/data/research/research-financials.ts",
  "utf8",
);

test("every requested Watchlist ticker has a typed research record", () => {
  for (const ticker of requiredTickers)
    assert.match(coverageSource, new RegExp(`ticker: "${ticker}"`));
  assert.equal(
    new Set(
      [...coverageSource.matchAll(/ticker: "([A-Z]+)"/g)].map(
        (match) => match[1],
      ),
    ).size,
    9,
  );
  for (const removed of ["AMAT", "WWD", "PDFS", "GS"])
    assert.doesNotMatch(coverageSource, new RegExp(`ticker: "${removed}"`));
});

test("research pages identify incomplete work and block unfinished downloads", () => {
  assert.match(coverageSource, /researchStatus: "Watchlist"/);
  assert.match(coverageSource, /thesisStatus: "Under Review"/);
  assert.match(coverageSource, /lastUpdated: RESEARCH_UPDATED_DATE/);
  assert.match(coverageSource, /status: "in-progress"/);
  assert.match(coverageSource, /url: null/);
  assert.doesNotMatch(coverageSource, /priceTarget|currentPrice|analystRating/);
  assert.match(pageSource, /disabled/);
  assert.doesNotMatch(pageSource, /DATA_PENDING|all values remain pending/);
  assert.match(financialSource, /historicalEvidenceByTicker/);
  assert.match(financialSource, /segmentEvidenceByTicker/);
  assert.match(financialSource, /SEC filed annual reports \/ XBRL company facts/);
});

test("specialized ETF, bank, and REIT frameworks are present", () => {
  for (const phrase of [
    "Weighted underlying valuation",
    "Dividend discount model",
    "Residual income model",
    "Price-to-tangible-book",
    "Price/AFFO",
    "Net asset value",
    "Common Equity Tier 1 ratio",
    "Return on equity",
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
    "Operating components",
    "Estimates",
    "Forecasts",
    "Valuation",
    "Comparable companies",
    "Catalysts",
    "Risks",
    "Earnings history",
    "Research notes",
    "Sources and disclosures",
    "Research completeness",
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
  assert.ok(
    portfolio.indexOf("<WatchlistTable") <
      portfolio.indexOf("<ResearchCoverageGrid"),
    "Research coverage must appear directly after the Watchlist",
  );
  assert.match(sitemap, /\/watchlist\/\$\{item\.slug\}/);
  assert.match(log, /Expanded Watchlist into Research Coverage Platform/);
  assert.match(log, /Introduced Industry-Specific Valuation Frameworks/);
});

test("research language, dates, evidence labels, and Bloom journal are explicit", () => {
  const evidence = fs.readFileSync(
    "src/data/research/research-evidence.ts",
    "utf8",
  );
  const journal = fs.readFileSync(
    "src/lib/bloom-analyst-journal.ts",
    "utf8",
  );
  const journalPage = fs.readFileSync(
    "src/app/analyst-journal/page.tsx",
    "utf8",
  );
  const allResearchSource = `${coverageSource}\n${pageSource}\n${evidence}`;
  assert.match(allResearchSource, /Updated July 28, 2026/);
  assert.doesNotMatch(
    allResearchSource,
    /A dated record of what changes\. Quarterly evidence will be added only when verified\./,
  );
  assert.doesNotMatch(
    allResearchSource,
    /Peer evidence requires sourced inputs\./,
  );
  for (const label of [
    "Reported",
    "Calculated",
    "Estimated",
    "Forecast",
    "Scenario Assumption",
  ])
    assert.ok(
      `${pageSource}\n${evidence}`.includes(label),
      `missing evidence label ${label}`,
    );
  assert.match(journal, /Questions for Project Economics/);
  assert.match(journal, /Q2 2026 results pending official verification/);
  assert.match(journal, /latestVerifiedPeriod: "Q1 2026"/);
  assert.doesNotMatch(journal, /BE BE/);
  const researchContent = fs.readFileSync(
    "src/lib/research-content.ts",
    "utf8",
  );
  assert.match(journalPage, /note\.pdfUrl/);
  assert.match(researchContent, /BE-Luna1-Analyst-Journal\.pdf/);
  assert.match(researchContent, /GLW-Luna1-Working-Note\.pdf/);
  assert.doesNotMatch(journalPage, /bloomAnalystJournal/);
  assert.ok(
    fs.statSync("public/reports/BE-Luna1-Analyst-Journal.pdf").size > 0,
    "Bloom Energy Analyst Journal PDF must be present and non-empty",
  );
  assert.ok(
    fs.statSync("public/reports/GLW-Luna1-Working-Note.pdf").size > 0,
    "GLW working-note PDF must be present and non-empty",
  );
});
