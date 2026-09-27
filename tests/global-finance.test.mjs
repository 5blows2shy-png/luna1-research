import test from "node:test";
import assert from "node:assert/strict";
import {
  convertCurrency,
  treasuryScenario,
  consolidateRegions,
} from "../src/lib/global-finance/models.ts";
import { northstarRegions } from "../src/data/global-finance/northstar.ts";
import { globalExposureByTicker } from "../src/data/global-finance/exposure.ts";
import { capitalFlowThemes } from "../src/data/research/capital-flows.ts";
import { financeCases } from "../src/data/global-finance/casebook.ts";
import { unavailableFxProvider } from "../src/lib/global-finance/providers.ts";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const fx = {
  base: "EUR",
  quote: "USD",
  rate: 1.05,
  date: "2026-06-30",
  source: "Fictional",
  kind: "Assumption",
};
const baseline = {
  revenue: 1000,
  expenses: 750,
  revenueExposure: 0.35,
  expenseExposure: 0.2,
  fxChange: 0.05,
  debt: 200,
  floatingShare: 0.5,
  interestRate: 0.04,
  rateChange: 0.01,
  cash: 100,
  workingCapitalRelease: 10,
};
test("FX conversion preserves original amount and metadata without mutation", () => {
  const original = Object.freeze({ amount: 100, currency: "EUR" });
  const result = convertCurrency(original, "USD", fx, fx.date);
  assert.equal(result.originalAmount, 100);
  assert.equal(result.originalCurrency, "EUR");
  assert.equal(result.convertedValue, 105);
  assert.equal(result.conversionDate, fx.date);
  assert.equal(result.source, "Fictional");
  assert.equal(
    convertCurrency({ amount: 12, currency: "USD" }, "USD", null, fx.date)
      .convertedValue,
    12,
  );
});
test("missing FX stays unavailable; mismatched currencies and dates are rejected", () => {
  assert.equal(
    convertCurrency({ amount: 100, currency: "EUR" }, "USD", null, fx.date),
    null,
  );
  for (const change of [
    { rate: 0 },
    { rate: -1 },
    { rate: NaN },
    { base: "JPY" },
    { quote: "GBP" },
    { date: "2026-07-01" },
  ])
    assert.throws(() =>
      convertCurrency(
        { amount: 100, currency: "EUR" },
        "USD",
        { ...fx, ...change },
        fx.date,
      ),
    );
});
test("unconnected adapter never invents recorded FX", async () => {
  assert.deepEqual(await unavailableFxProvider.getRate("EUR", "USD", fx.date), {
    status: "unavailable",
    quote: null,
    message:
      "Recorded FX data is not connected. Scenario rates are assumptions.",
  });
});
test("FX scenarios isolate revenue, expense, interest and working capital effects", () => {
  const r = treasuryScenario(baseline);
  near(r.revenueImpact, 17.5);
  near(r.expenseImpact, 7.5);
  near(r.operatingIncomeImpact, 10);
  near(r.interestExpense, 9);
  near(r.pretaxImpact, 9);
  near(r.cashPosition, 110);
  for (const move of [-0.1, -0.05, 0.05, 0.1])
    near(
      treasuryScenario({ ...baseline, fxChange: move }).operatingIncomeImpact,
      200 * move,
    );
  near(treasuryScenario({ ...baseline, rateChange: -0.01 }).interestExpense, 7);
  near(treasuryScenario({ ...baseline, floatingShare: 1 }).interestExpense, 10);
  near(
    treasuryScenario({ ...baseline, workingCapitalRelease: -120 }).cashPosition,
    -20,
  );
});
test("natural hedge and no exposure produce zero translation; invalid assumptions fail", () => {
  near(
    treasuryScenario({ ...baseline, revenue: 750 }).operatingIncomeImpact,
    750 * 0.15 * 0.05,
  );
  near(
    treasuryScenario({ ...baseline, revenueExposure: 0, expenseExposure: 0 })
      .operatingIncomeImpact,
    0,
  );
  near(
    treasuryScenario({ ...baseline, revenue: 750, revenueExposure: 0.2 })
      .operatingIncomeImpact,
    0,
  );
  for (const change of [
    { revenue: -1 },
    { revenueExposure: 1.1 },
    { expenseExposure: -0.1 },
    { fxChange: -1 },
    { interestRate: -1 },
    { rateChange: -0.05 },
    { cash: NaN },
  ])
    assert.throws(() => treasuryScenario({ ...baseline, ...change }));
});
test("Northstar consolidation matches independently calculated totals and variance bridge", () => {
  const r = consolidateRegions(northstarRegions);
  near(r.revenue, 239.46);
  near(r.budget, 244.4);
  near(r.variance, -4.94);
  near(r.operatingVariance, 3.72);
  near(r.fxVariance, -8.66);
  near(r.operatingVariance + r.fxVariance, r.variance);
  near(r.profit, 56.46);
  near(r.capex, 22.055);
  near(r.fxNeutralGrowth, 248.12 / 226 - 1);
  near(r.reportedGrowth, 239.46 / 226 - 1);
  const germany = r.rows.find((x) => x.region === "Germany");
  near(germany.localGrowth, 0.08);
  near(germany.reportedGrowth, 56.7 / 55 - 1);
  assert.equal(germany.headcountVariance, 5);
  near(consolidateRegions(northstarRegions, 0.05).forecast, 251.433);
});
test("FP&A rejects incompatible periods, missing rates, invalid forecasts and retains originals", () => {
  const original = structuredClone(northstarRegions);
  consolidateRegions(northstarRegions);
  assert.deepEqual(northstarRegions, original);
  for (const change of [
    { period: "Q3 2026" },
    { fxDate: "2026-07-31" },
    { actualRate: 0 },
    { budgetRate: NaN },
    { priorRevenue: 0 },
  ])
    assert.throws(() =>
      consolidateRegions(
        northstarRegions.map((r, i) => (i === 0 ? { ...r, ...change } : r)),
      ),
    );
  assert.throws(() => consolidateRegions([], 0));
  assert.throws(() => consolidateRegions(northstarRegions, -1));
  const zero = consolidateRegions(
    northstarRegions.map((r) => ({ ...r, actualRevenue: 0 })),
  );
  assert.equal(zero.rows[0].actualMargin, null);
});
test("company geography reconciles on source basis, retaining unavailable fields", () => {
  const glw = globalExposureByTicker.GLW;
  assert.equal(
    glw.geography.reduce((s, r) => s + (r.revenue ?? 0), 0),
    glw.totalRevenue,
  );
  assert.equal(
    glw.geography.find((r) => r.region === "Latin America").revenue,
    null,
  );
  assert.equal(glw.currencies, null);
  assert.match(glw.source.href, /sec.gov/);
  assert.match(glw.source.basis, /15,629/);
  assert.equal(globalExposureByTicker.UNKNOWN, undefined);
});
test("existing capital flow theme carries global geography and company research link", () => {
  const nodes = capitalFlowThemes.find((t) => t.id === "compute").geography;
  assert.equal(nodes.length, 6);
  for (const n of nodes) {
    assert.ok(
      n.region && n.country && n.industry && n.bottleneck && n.capitalNeed,
    );
  }
  assert.equal(nodes[0].company.href, "/research/companies/glw");
});
test("casebook artifacts are real phase-one routes with explicit limitations and actual tools", () => {
  assert.equal(financeCases.length, 4);
  for (const c of financeCases) {
    assert.ok(
      c.problem &&
        c.data &&
        c.analysis &&
        c.model &&
        c.findings &&
        c.limitations &&
        c.status,
    );
    assert.ok(c.href.startsWith("/research/"));
    assert.ok(c.tools.length);
    assert.ok(!c.tools.includes("Python"));
  }
});
