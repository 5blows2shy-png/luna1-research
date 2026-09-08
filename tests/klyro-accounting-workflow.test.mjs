import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { hasLunaBooksCapability } from "../src/lib/luna-books-access.ts";
import {
  buildAccountingRecords,
  buildFocusSummary,
  businessFocusOptions,
  closeReadiness,
  resolveAccountingRecord,
  starterChartOfAccounts,
} from "../src/lib/klyro-accounting-workflow.ts";

const clearRows = [
  { date: "2026-08-01", description: "Intuit QuickBooks", amount: -85, source_document: "receipt-1.pdf" },
  { date: "2026-08-02", description: "Donation Deposit", amount: 1500 },
];

test("focus options include owner cash, hiring, equipment, and inventory questions", () => {
  for (const focus of ["Improve Cash Flow", "Hire an Employee", "Buy Equipment", "Increase Profitability"])
    assert.ok(businessFocusOptions.includes(focus));
});

test("starter Chart of Accounts is compact and includes core asset, liability, revenue, and expense accounts", () => {
  assert.ok(starterChartOfAccounts.length <= 20);
  for (const account of ["Operating Checking", "Equipment", "Inventory", "Accounts Payable", "Payroll Expense"])
    assert.ok(starterChartOfAccounts.some((item) => item.name === account), account);
});

test("clear imports create balanced proposed journal entries and enter close automatically", () => {
  const records = buildAccountingRecords(clearRows);
  assert.equal(records.length, clearRows.length);
  assert.equal(records[0].status, "Ready to Post");
  assert.equal(records[0].debitAmount, records[0].creditAmount);
  assert.equal(records[0].sourceTransactionId.startsWith("txn-"), true);
  assert.equal(closeReadiness(records).transactionsImported, clearRows.length);
});

test("unclear transactions route to multiple-choice account selection without a finalized entry", () => {
  const [record] = buildAccountingRecords([{ date: "2026-08-03", description: "HOME DEPOT", amount: -2840, receipt: "tool-receipt.pdf" }]);
  assert.equal(record.status, "Needs Input");
  assert.equal(record.finalAccount, null);
  assert.equal(record.debitAccount, null);
  assert.deepEqual(record.suggestions.map((item) => item.account), ["Equipment", "Repairs & Maintenance Expense", "Office Supplies Expense", "Inventory"]);
  assert.match(record.reason, /Supporting document tool-receipt\.pdf/);
});

test("account selection creates balanced lines and preserves a classification audit event", () => {
  const [record] = buildAccountingRecords([{ date: "2026-08-03", description: "HOME DEPOT", amount: -2840 }]);
  const resolved = resolveAccountingRecord(record, "Equipment", "Owner", "2026-08-04T10:00:00.000Z");
  assert.equal(resolved.record.status, "Ready to Post");
  assert.equal(resolved.record.debitAccount, "Equipment");
  assert.equal(resolved.record.creditAccount, "Operating Checking");
  assert.equal(resolved.record.debitAmount, resolved.record.creditAmount);
  assert.equal(resolved.event.previousAccount, "Uncategorized / Suspense");
  assert.equal(resolved.event.actor, "Owner");
});

test("missing documents and low confidence remain visible", () => {
  const [record] = buildAccountingRecords([{ date: "2026-08-03", description: "New Merchant", amount: -1400 }]);
  assert.equal(record.confidence, "Needs Input");
  assert.match(record.reason, /No supporting document/);
  assert.equal(closeReadiness([record]).missingDocuments, 1);
});

test("approved recurring vendor rules create high-confidence entries", () => {
  const [record] = buildAccountingRecords(
    [{ date: "2026-08-03", description: "Verizon", amount: -183.72 }],
    { verizon: "Telephone & Internet Expense" },
  );
  assert.equal(record.status, "Ready to Post");
  assert.equal(record.confidence, "High");
  assert.match(record.ruleUsed, /Approved vendor rule/);
});

test("duplicates and transfers are detected and withheld from ready entries", () => {
  const records = buildAccountingRecords([
    { date: "2026-08-03", description: "SDGE", amount: -200 },
    { date: "2026-08-03", description: "SDGE", amount: -200 },
    { date: "2026-08-04", description: "Internal Transfer", amount: -500 },
  ]);
  assert.equal(records.filter((record) => record.status === "Possible Duplicate").length, 2);
  assert.equal(records.filter((record) => record.status === "Transfer Review").length, 1);
});

test("close counts and readiness improve after the user resolves unclear treatment", () => {
  const [unclear] = buildAccountingRecords([{ date: "2026-08-03", description: "HOME DEPOT", amount: -2840 }]);
  const before = closeReadiness([unclear]);
  const after = closeReadiness([resolveAccountingRecord(unclear, "Equipment").record]);
  assert.equal(before.needsInput, 1);
  assert.equal(after.ready, 1);
  assert.ok(after.readiness > before.readiness);
});

test("focus summaries prioritize hiring, equipment, cash flow, and inventory without inventing values", () => {
  const records = buildAccountingRecords(clearRows);
  assert.match(buildFocusSummary("Hire an Employee", records).question, /hire/i);
  assert.match(buildFocusSummary("Hire an Employee", records).potentialImpact, /Insufficient data/);
  assert.match(buildFocusSummary("Buy Equipment", records).question, /equipment/i);
  assert.match(buildFocusSummary("Improve Cash Flow", records).finding, /inflows/);
  assert.match(buildFocusSummary("Increase Profitability", records).why, /classified revenue/);
});

test("empty focus summaries explicitly report insufficient data", () => {
  assert.equal(buildFocusSummary("Improve Cash Flow", []).confidence, "Insufficient Data");
});

test("accounting permissions preserve owner/bookkeeper writes, accountant review, and tenant-scoped design", () => {
  assert.equal(hasLunaBooksCapability("owner", "write_books"), true);
  assert.equal(hasLunaBooksCapability("bookkeeper", "write_books"), true);
  assert.equal(hasLunaBooksCapability("accountant", "review_books"), true);
  assert.equal(hasLunaBooksCapability("accountant", "write_books"), false);
});

test("draft persistence migration preserves tenant keys, RLS, permissions, and append-only audit history", () => {
  const migration = fs.readFileSync("docs/klyro-accounting-workflow-migration.sql", "utf8");
  assert.match(migration, /source_transaction_id, business_id/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /luna_has_business_access\(business_id\)/);
  assert.match(migration, /luna_has_bookkeeping_access\(business_id\)/);
  assert.match(migration, /luna_record_audit_event/);
  assert.match(migration, /revoke all[\s\S]+from anon/);
});
