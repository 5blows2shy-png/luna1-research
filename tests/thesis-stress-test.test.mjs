import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateAnalystScenario,
  calculateIrr,
  calculatePortfolioAnalysis,
  calculateProjectEconomics,
  calculateRiskAnalysis,
  defaultLunaAssumptions,
  defaultPortfolioInputs,
  defaultProjectInputs,
  defaultRiskInputs,
} from "../src/lib/thesis-stress-test.ts";

test("portfolio analysis validates probabilities and is deterministic", () => {
  const first = calculatePortfolioAnalysis(
    defaultPortfolioInputs,
    defaultLunaAssumptions.fairValue,
  );
  const second = calculatePortfolioAnalysis(
    defaultPortfolioInputs,
    defaultLunaAssumptions.fairValue,
  );
  assert.deepEqual(first, second);
  assert.equal(first.probabilityTotal, 100);
  assert.equal(first.expectedValue, 26.13);
  const invalid = calculatePortfolioAnalysis(
    { ...defaultPortfolioInputs, bullProbability: 20 },
    defaultLunaAssumptions.fairValue,
  );
  assert.equal(invalid.decision, "Insufficient Evidence");
});

test("analyst fair value responds to operating assumptions", () => {
  const base = calculateAnalystScenario(defaultLunaAssumptions);
  const lowerMargin = calculateAnalystScenario({
    ...defaultLunaAssumptions,
    operatingMargin: defaultLunaAssumptions.operatingMargin - 5,
  });
  assert.ok(lowerMargin.freeCashFlow < base.freeCashFlow);
  assert.ok(lowerMargin.fairValue < base.fairValue);
  assert.equal(lowerMargin.mostSensitive.key, "operatingMargin");
});

test("risk analysis ranks the highest selected risk", () => {
  const analysis = calculateRiskAnalysis({
    ...defaultRiskInputs,
    scores: { ...defaultRiskInputs.scores, "Execution risk": 5 },
  });
  assert.equal(analysis.principalDriver, "Execution risk");
  assert.ok(analysis.weightedScore > 3);
});

test("IRR and project break-even calculations are repeatable", () => {
  assert.equal(calculateIrr([-100, 60, 60]), 13.07);
  const analysis = calculateProjectEconomics(defaultProjectInputs);
  assert.ok(analysis.breakEvenUtilization > 0);
  assert.ok(Number.isFinite(analysis.npv));
  assert.deepEqual(analysis, calculateProjectEconomics(defaultProjectInputs));
});
