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
    "excelSheetToRows",
    "cleanTransactions",
    "suggested_category",
    "Possible duplicate",
    "reconcile",
    "suggestJournalEntry",
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
    "Suggest Draft Journal Entry",
    "Download Monthly Close Board Packet",
    "Download Board Packet PDF",
  ])
    assert.ok(component.includes(control), control);
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
    "LUNA1 ACCOUNTING & TRANSACTION INTELLIGENCE",
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
