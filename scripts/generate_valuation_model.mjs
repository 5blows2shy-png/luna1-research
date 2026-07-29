#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const brand = JSON.parse(
  await fs.readFile(path.join(repoRoot, "src/config/brand.json"), "utf8"),
);

function parseArguments() {
  const values = new Map();
  for (let index = 2; index < process.argv.length; index += 1) {
    const key = process.argv[index];
    if (key === "--qa") values.set("qa", true);
    else values.set(key.replace(/^--/, ""), process.argv[++index]);
  }
  if (!values.get("input") || !values.get("output")) {
    throw new Error("Usage: --input model.json --output model.xlsx [--qa]");
  }
  return values;
}

const argumentsMap = parseArguments();
const model = JSON.parse(await fs.readFile(argumentsMap.get("input"), "utf8"));
if (!argumentsMap.get("qa") && model.reviewed !== true) {
  throw new Error(
    "Publication blocked: input must set reviewed=true after source review.",
  );
}
for (const field of [
  "companyName",
  "ticker",
  "modelTitle",
  "lastUpdated",
  "version",
]) {
  if (!model[field]) throw new Error(`Missing required model field: ${field}`);
}

const workbook = Workbook.create();
workbook.comments.setSelf({ displayName: "Shy Lee" });
const isEtf = model.modelType === "etf";
const sheetNames = [
  "Summary",
  "Revenue Build",
  "Financial Statements",
  "Forecast",
  isEtf ? "ETF Valuation" : "DCF",
  "Comparable Companies",
  "Sensitivity",
  "Thesis and Risks",
  "Sources and Audit",
  "Checks",
];
const sheets = new Map(
  sheetNames.map((name) => [name, workbook.worksheets.add(name)]),
);
const logoBytes = await fs.readFile(
  path.join(repoRoot, "public", brand.logoRasterPath.replace(/^\//, "")),
);
const logoDataUrl = `data:image/png;base64,${logoBytes.toString("base64")}`;
const navy = brand.colors.ink;
const blue = brand.colors.blue;
const border = "#D6DAE1";
const paleBlue = "#EAF2FF";
const footerText = `${brand.name} | ${model.ticker} Valuation Model | Educational Use Only`;
const inputHeaders = [
  "Metric",
  "Historical 1",
  "Historical 2",
  "Current Estimate",
  "Forecast 1",
  "Forecast 2",
  "Forecast 3",
  "Source / Note",
];
const inputRows = [
  "Revenue",
  "Revenue Growth",
  "Operating Margin",
  "EBITDA",
  "EPS",
  "Capital Expenditures",
  "Free Cash Flow",
  "Net Debt",
  "Model Note",
].map((label) => [
  label,
  null,
  null,
  null,
  null,
  null,
  null,
  "Data pending - source required",
]);

function styleSheet(sheet, name) {
  sheet.showGridLines = false;
  sheet.getRange("A1:H1").merge();
  sheet.getRange("A1").values = [[`${model.ticker} | ${name}`]];
  sheet.getRange("A1:H1").format = {
    fill: navy,
    font: { bold: true, color: "#FFFFFF", size: 12 },
    rowHeight: 24,
    verticalAlignment: "center",
  };
  sheet.getRange("A3:H3").values = [inputHeaders];
  sheet.getRange("A3:H3").format = {
    fill: "#E5E7EB",
    font: { bold: true, color: navy },
    borders: { bottom: { style: "thin", color: border } },
  };
  sheet.getRange("A4:H12").values = inputRows;
  sheet.getRange("B4:G12").format.font = { color: "#0000FF" };
  sheet.getRange("B5:G5").format.numberFormat = "0.0%;[Red](0.0%);-";
  sheet.getRange("B6:G6").format.numberFormat = "0.0%;[Red](0.0%);-";
  sheet.getRange("B4:G12").format.borders = {
    preset: "inside",
    style: "thin",
    color: "#ECEEF2",
  };
  sheet.getRange("A4:A12").format.font = { color: navy };
  sheet.getRange("H4:H12").format = {
    fill: "#FFF7D6",
    font: { color: "#5F4A00" },
    wrapText: true,
  };
  sheet.getRange("A15:E15").merge();
  sheet.getRange("A15").values = [[footerText]];
  sheet.getRange("A15:E15").format = {
    font: { italic: true, color: "#6B7280", size: 8 },
    borders: { top: { style: "thin", color: border } },
    horizontalAlignment: "center",
  };
  sheet.getRange("A1:H15").format.font.name = "Arial";
  sheet.getRange("A1:A15").format.columnWidth = 24;
  sheet.getRange("B1:G15").format.columnWidth = 15;
  sheet.getRange("H1:H15").format.columnWidth = 30;
  sheet.freezePanes.freezeRows(3);
}

for (const [name, sheet] of sheets) {
  if (name !== "Summary") styleSheet(sheet, name);
}

const summary = sheets.get("Summary");
summary.showGridLines = false;
summary.images.add({
  dataUrl: logoDataUrl,
  anchor: { from: { row: 0, col: 0 }, extent: { widthPx: 220, heightPx: 76 } },
});
summary.getRange("A1:F3").merge();
summary.getRange("A5:F5").merge();
summary.getRange("A5").values = [[`${model.companyName} (${model.ticker})`]];
summary.getRange("A6:F6").merge();
summary.getRange("A6").values = [[model.modelTitle]];
summary.getRange("A8:B14").values = [
  ["Prepared by", brand.analyst],
  ["Last Updated", model.lastUpdated],
  ["Version", model.version],
  ["Website", brand.websiteLabel],
  ["Model Type", isEtf ? "ETF research model" : "Integrated valuation model"],
  [
    "Publication Status",
    argumentsMap.get("qa") ? "DRAFT QA - NOT FOR PUBLICATION" : "Reviewed",
  ],
  ["Model Status", "Inputs pending source review"],
];
summary.getRange("A5:F5").format = {
  font: { bold: true, color: navy, size: 22 },
  rowHeight: 34,
};
summary.getRange("A6:F6").format = {
  font: { color: blue, size: 14 },
  rowHeight: 26,
};
summary.getRange("A8:A14").format = {
  fill: navy,
  font: { bold: true, color: "#FFFFFF" },
};
summary.getRange("B8:B14").format = { fill: paleBlue, font: { color: navy } };
summary.getRange("A16:F18").merge();
summary.getRange("A16").values = [[brand.disclosure]];
summary.getRange("A16:F18").format = {
  fill: "#F4F5F7",
  font: { color: "#4B5563", size: 9 },
  wrapText: true,
  verticalAlignment: "center",
};
summary.getRange("A20:F20").merge();
summary.getRange("A20").values = [[footerText]];
summary.getRange("A20:F20").format = {
  font: { italic: true, color: "#6B7280", size: 8 },
  borders: { top: { style: "thin", color: border } },
  horizontalAlignment: "center",
};
summary.getRange("A1:F20").format.font.name = "Arial";
summary.getRange("A1:A20").format.columnWidth = 23;
summary.getRange("B1:F20").format.columnWidth = 12;

const valuationSheet = sheets.get(isEtf ? "ETF Valuation" : "DCF");
valuationSheet.getRange("A3:H14").clear({ applyTo: "all" });
valuationSheet.getRange("A5:H5").values = [inputHeaders];
valuationSheet.getRange("A5:H5").format = {
  fill: "#E5E7EB",
  font: { bold: true, color: navy },
  borders: { bottom: { style: "thin", color: border } },
};
valuationSheet.getRange("A6:H14").values = inputRows;
valuationSheet.getRange("B6:G14").format.font = { color: "#0000FF" };
valuationSheet.getRange("B7:G8").format.numberFormat = "0.0%;[Red](0.0%);-";
valuationSheet.getRange("B6:G14").format.borders = {
  preset: "inside",
  style: "thin",
  color: "#ECEEF2",
};
valuationSheet.getRange("H6:H14").format = {
  fill: "#FFF7D6",
  font: { color: "#5F4A00" },
  wrapText: true,
};
valuationSheet.images.add({
  dataUrl: logoDataUrl,
  anchor: { from: { row: 1, col: 0 }, extent: { widthPx: 125, heightPx: 43 } },
});
valuationSheet.getRange("B2:E3").merge();
valuationSheet.getRange("B2").values = [
  ["Primary Valuation Output - Data Pending"],
];
valuationSheet.getRange("B2:E3").format = {
  fill: paleBlue,
  font: { bold: true, color: navy },
  horizontalAlignment: "center",
};
valuationSheet.freezePanes.freezeRows(4);

const checks = sheets.get("Checks");
checks.getRange("A4:F8").values = [
  ["Check", "Actual", "Expected", "Difference", "Status", "Notes"],
  [
    "Source completeness",
    0,
    1,
    -1,
    "PENDING",
    "Verified inputs have not been entered",
  ],
  [
    "Formula error scan",
    0,
    0,
    0,
    "OK",
    "No calculation formulas are active in this input scaffold",
  ],
  ["Valuation output", 0, 1, -1, "PENDING", "Model remains unpublished"],
  [
    "Overall model status",
    null,
    null,
    null,
    "PENDING",
    "Do not publish until all checks show OK",
  ],
];
checks.getRange("A4:F4").format = {
  fill: navy,
  font: { bold: true, color: "#FFFFFF" },
};
checks.getRange("E5:E8").conditionalFormats.add("containsText", {
  text: "PENDING",
  format: { fill: "#FFF7D6", font: { color: "#8A5B00", bold: true } },
});

const outputPath = path.resolve(argumentsMap.get("output"));
await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const inspection = await workbook.inspect({
  kind: "table",
  range: "Summary!A5:H20",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 8,
});
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(inspection.ndjson);
console.log(errors.ndjson);

if (argumentsMap.get("preview")) {
  const preview = await workbook.render({
    sheetName: "Summary",
    range: "A1:H20",
    scale: 1.5,
    format: "png",
  });
  await fs.writeFile(
    path.resolve(argumentsMap.get("preview")),
    new Uint8Array(await preview.arrayBuffer()),
  );
}
