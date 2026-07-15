import test from "node:test";
import assert from "node:assert/strict";
import { mistakeJournalEntries } from "../src/lib/mistake-journal-data.ts";
import {
  calculateMistakeJournalSummary,
  filterMistakeJournalEntries,
  initialMistakeJournalFilters,
} from "../src/lib/mistake-journal.ts";

test("journal filters match primary and secondary classifications", () => {
  const earlyExit = filterMistakeJournalEntries(mistakeJournalEntries, {
    ...initialMistakeJournalFilters,
    classification: "Early Exit",
  });
  const emotionalDecision = filterMistakeJournalEntries(mistakeJournalEntries, {
    ...initialMistakeJournalFilters,
    classification: "Emotional Decision",
  });
  const failedThesis = filterMistakeJournalEntries(mistakeJournalEntries, {
    ...initialMistakeJournalFilters,
    classification: "Failed Thesis",
  });

  assert.equal(earlyExit.length, 1);
  assert.equal(emotionalDecision.length, 1);
  assert.equal(failedThesis.length, 0);
});

test("journal filters combine outcome, quality, thesis status, and year", () => {
  const matches = filterMistakeJournalEntries(mistakeJournalEntries, {
    classification: "All",
    outcome: "Gain",
    thesisStatus: "Intact at Exit",
    entryQuality: "Moderate",
    exitQuality: "Poor",
    year: "2026",
  });
  const wrongYear = filterMistakeJournalEntries(mistakeJournalEntries, {
    ...initialMistakeJournalFilters,
    year: "2025",
  });

  assert.equal(matches[0]?.ticker, "JBL");
  assert.equal(wrongYear.length, 0);
});

test("journal summary calculates decision and process totals", () => {
  const summary = calculateMistakeJournalSummary(mistakeJournalEntries);

  assert.deepEqual(summary, {
    totalReviewedDecisions: 1,
    failedTheses: 0,
    earlyExits: 1,
    processViolations: 0,
    mostCommonMistake: "Early Exit",
    processChangesAdopted: 6,
  });
});
