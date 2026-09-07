import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import * as XLSX from "@e965/xlsx";

const component = fs.readFileSync(
  "src/components/transaction-intelligence-workspace.tsx",
  "utf8",
);
const logic = fs.readFileSync(
  "src/lib/transaction-intelligence.ts",
  "utf8",
);

test("workspace presents the connected owner accounting flow before specialist tools", () => {
  let previous = -1;
  for (const tab of [
    "Overview",
    "Decision Board",
    "Transactions",
    "Journal Entries",
    "Cash Flow",
    "Financials",
    "Monthly Close",
    "Accountant",
    "Documents",
    "Settings",
  ]) {
    const position = component.indexOf(`"${tab}"`);
    assert.ok(position > previous, tab);
    previous = position;
  }
});

test("transaction workflow keeps sample processing, review, and exports", () => {
  for (const capability of [
    "parseCsv",
    "excelSheetToRows",
    "cleanTransactions",
    "suggested_category",
    "Possible duplicate",
    "reconcile",
    "suggestJournalEntry",
    "buildBoardPacketAnalysis",
    "workbookXml",
    "buildPdfReport",
    "downloadPdfReport",
    "sampleTransactions",
  ])
    assert.ok(logic.includes(capability), capability);

  for (const control of [
    "Use sample data",
    "Use paired sample data",
    "Download Excel Review File",
    "Download PDF Review",
    "Download Reconciliation Workbook",
    "Download Reconciliation PDF",
    "Download Journal Review",
    "Use complete sample close packet",
    "Download Full Board Packet Excel",
    "Download Full Board Packet PDF",
  ])
    assert.ok(component.includes(control), control);
});

test("board packet connects every imported source to analysis and exports", () => {
  for (const source of [
    "Cleaned Transactions",
    "Budget vs Actual",
    "Profit and Loss / Statement of Activities",
    "Balance Sheet / Statement of Financial Position",
    "Reconciliation Exceptions",
    "Suggested Journal Entries",
  ])
    assert.ok(component.includes(source), source);

  for (const output of [
    "Detailed Close Summary",
    "Imported File Coverage",
    "Category and Spending Concentration",
    "Consolidated Review Register",
    "Questions for Management",
    "Full Board Packet Export",
  ])
    assert.ok(component.includes(output), output);

  for (const analysis of [
    "sourceCoverage",
    "categoryBreakdown",
    "activityTrend",
    "topMovements",
    "reviewRegister",
    "executiveSummary",
    "boardNarrative",
    "managementQuestions",
  ])
    assert.ok(logic.includes(analysis), analysis);
});

test("Klyro presents the connected product hierarchy and honest portal roadmap", () => {
  for (const product of ["Klyro", "Klyro Forecast", "Klyro Business"])
    assert.ok(component.includes(product), product);

  for (const portalModule of [
    "Overview",
    "Transactions",
    "Banking",
    "Receipts",
    "Invoices",
    "Reconcile",
    "Chart of Accounts",
    "Reports",
    "Financial Health",
    "Accountant Review",
    "Integrations",
    "Business Settings",
  ])
    assert.ok(component.includes(portalModule), portalModule);

  assert.match(component, /Authentication, encrypted document storage/);
  assert.match(component, /planned—not currently production-ready/);
});

test("Klyro portal home highlights the core close workflow and launches every tool", () => {
  for (const highlight of [
    "Klyro Primary Workflow",
    "Decision Board",
    "Upload & Clean Transactions",
    "Journal Entry Assistant",
    "Monthly Close Board Packet",
    "All Klyro Portal Tools",
  ])
    assert.ok(component.includes(highlight), highlight);

  assert.match(component, /onSelectTab\(workflow\.tab\)/);
  assert.match(component, /onSelectTab\(tab\)/);
  assert.match(component, /<HomeTab onSelectTab=\{setActiveTab\}/);
});

test("Klyro Books Phase 1 demo centers decisions and the fictional HVAC business", () => {
  for (const content of [
    "Klyro Books",
    "The financial decision operating system for small business.",
    "Coastal Heating & Air LLC",
    "Receivables increased 24%",
    "Your Next 3 Moves",
    "Collect receivables",
    "Delay the cash equipment purchase",
    "Reevaluate hiring",
  ]) assert.ok(component.includes(content), content);
});

test("live Klyro preview clearly prohibits operational reliance", () => {
  assert.match(component, /In Development · Demo Preview · Not for operational use/);
  assert.match(component, /must not be used as a system of record/);
  assert.match(component, /bookkeeping, posting, filing, lending, tax, payroll, or business decisions/);
  assert.match(component, /require qualified professional review/);
});

test("Client Request Portal is removed from the visible workspace", () => {
  assert.doesNotMatch(component, /Client Request Portal/);
  assert.doesNotMatch(component, /Bookkeeper Client-Request Portal/);
  assert.doesNotMatch(component, /Reminder Email Template/);
});

test("Klyro leads with the owner decision problem it exists to solve", () => {
  assert.match(component, /Businesses generate more data, but owners still struggle to turn it into decisions\./);
  assert.match(component, /connects financial activity to organized accounting records/);
  assert.match(component, /cash, hiring, equipment, inventory, expenses, financing, and financial health/);
});

test("Excel workbooks can be read from modern and legacy formats", () => {
  for (const bookType of ["xlsx", "xls", "xlsm", "xlsb", "ods"]) {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ["Date", "Description", "Amount"],
        ["2026-07-01", "Sample deposit", 1250],
      ]),
      "Transactions",
    );

    const file = XLSX.write(workbook, { bookType, type: "buffer" });
    const imported = XLSX.read(file, { type: "buffer" });
    const rows = XLSX.utils.sheet_to_json(
      imported.Sheets[imported.SheetNames[0]],
      { header: 1 },
    );

    assert.deepEqual(rows, [
      ["Date", "Description", "Amount"],
      ["2026-07-01", "Sample deposit", 1250],
    ]);
  }
});

test("upload control accepts every supported transaction file format", () => {
  for (const extension of [
    ".csv",
    ".pdf",
    ".xlsx",
    ".xls",
    ".xlsm",
    ".xlsb",
    ".ods",
  ])
    assert.ok(component.includes(extension), extension);
});

test("PDF imports configure the bundled PDF.js worker", () => {
  assert.match(component, /GlobalWorkerOptions\.workerSrc/);
  assert.match(component, /pdf\.worker\.min\.mjs/);
});

test("PDF exports preserve review-only labeling and page furniture", () => {
  for (const marker of [
    "KLYRO",
    "IN DEVELOPMENT - REVIEW WORKSPACE",
    "For accounting review only",
    "Page ${index + 1} of ${pages.length}",
  ])
    assert.ok(logic.includes(marker), marker);
});

test("workspace remains review-first and hides the internal legacy name", () => {
  assert.match(component, /review only/i);
  assert.match(component, /do not approve, post, or modify accounting records/i);
  assert.doesNotMatch(component + logic, /new project 3/i);
  assert.doesNotMatch(component + logic, /Point 11/i);
});
