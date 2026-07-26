import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const component = fs.readFileSync(
  "src/components/transaction-intelligence-workspace.tsx",
  "utf8",
);
const logic = fs.readFileSync(
  "src/lib/transaction-intelligence.ts",
  "utf8",
);

test("workspace preserves the prototype tab order", () => {
  let previous = -1;
  for (const tab of [
    "Home",
    "Client Request Portal",
    "Nonprofit Back Office",
    "Upload & Clean Transactions",
    "Bank Statement PDF Parser",
    "Bank-to-QuickBooks Reconciliation",
    "Journal Entry Assistant",
    "Monthly Close Board Packet",
  ]) {
    const position = component.indexOf(`"${tab}"`);
    assert.ok(position > previous, tab);
    previous = position;
  }
});

test("transaction workflow keeps sample processing, review, and exports", () => {
  for (const capability of [
    "parseCsv",
    "cleanTransactions",
    "suggested_category",
    "Possible duplicate",
    "reconcile",
    "suggestJournalEntry",
    "workbookXml",
    "sampleTransactions",
  ])
    assert.ok(logic.includes(capability), capability);

  for (const control of [
    "Use sample data",
    "Use paired sample data",
    "Download Excel Review File",
    "Download Reconciliation Workbook",
    "Suggest Draft Journal Entry",
    "Download Monthly Close Board Packet",
  ])
    assert.ok(component.includes(control), control);
});

test("workspace remains review-first and hides the internal legacy name", () => {
  assert.match(component, /review only/i);
  assert.match(component, /do not approve, post, or modify accounting records/i);
  assert.doesNotMatch(component + logic, /new project 3/i);
  assert.doesNotMatch(component + logic, /Point 11/i);
});
