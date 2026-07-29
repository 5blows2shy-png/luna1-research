export type TransactionRow = Record<string, string | number | boolean>;

export const sampleTransactions: TransactionRow[] = [
  { date: "2025-07-01", description: "Intuit QuickBooks", amount: -85, category: "", memo: "Monthly subscription" },
  { date: "2025-07-02", description: "SDGE", amount: -240.55, category: "", memo: "Utility bill" },
  { date: "2025-07-02", description: "SDGE", amount: -240.55, category: "", memo: "Duplicate utility bill" },
  { date: "2025-07-05", description: "Donation Deposit", amount: 1500, category: "", memo: "Donor contribution" },
  { date: "2025-07-06", description: "Amazon", amount: -312.21, category: "", memo: "Office supplies maybe" },
  { date: "2025-07-10", description: "Gusto Payroll", amount: -2200, category: "", memo: "Payroll processing" },
  { date: "2025-07-12", description: "Office Depot", amount: -144.87, category: "", memo: "Office supplies" },
  { date: "2025-07-15", description: "Bank Service Charge", amount: -25, category: "", memo: "Monthly bank fee" },
  { date: "2025-07-20", description: "Grant Deposit", amount: 5000, category: "", memo: "Restricted grant funds" },
  { date: "2025-07-25", description: "", amount: 100, category: "", memo: "Missing description test" },
];

const categoryRules: Array<[string, string[]]> = [
  ["Software & Subscriptions", ["intuit", "quickbooks"]],
  ["Utilities", ["sdge"]],
  ["Contributions Revenue", ["donation"]],
  ["Grant Revenue", ["grant"]],
  ["Needs Review", ["amazon"]],
  ["Payroll", ["gusto", "payroll", "adp"]],
  ["Office Supplies", ["office depot"]],
  ["Bank Fees", ["bank service charge"]],
];

export const journalAccounts: Record<string, string> = {
  "Software & Subscriptions": "Software Expense",
  Utilities: "Utilities Expense",
  Payroll: "Payroll Expense",
  "Office Supplies": "Office Supplies Expense",
  "Bank Fees": "Bank Fees Expense",
  Insurance: "Insurance Expense",
  "Repairs and Maintenance": "Repairs and Maintenance Expense",
  "Contributions Revenue": "Contributions Revenue",
  "Grant Revenue": "Grant Revenue",
  "Membership Revenue": "Membership Revenue",
  "Merchandise Revenue": "Gift Shop Revenue",
  "Needs Review": "Uncategorized / Suspense",
  Uncategorized: "Uncategorized / Suspense",
};

const normalizeColumn = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

export function moneyToNumber(value: unknown): number | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const negative = text.startsWith("-") || text.endsWith("-") || (text.includes("(") && text.includes(")"));
  const parsed = Number(text.replace(/[$,()]/g, "").replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(parsed)) return null;
  return negative ? -Math.abs(parsed) : parsed;
}

export function parseCsv(text: string): TransactionRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  const [headers = [], ...data] = rows;
  const normalized = headers.map(normalizeColumn);
  return data.map((values) =>
    Object.fromEntries(normalized.map((header, index) => [header || `column_${index + 1}`, values[index]?.trim() ?? ""])),
  );
}

export function excelSheetToRows(
  sheet: unknown[][],
): TransactionRow[] {
  const [headerRow = [], ...dataRows] = sheet;
  const headers = headerRow.map((value, index) => {
    const header = normalizeColumn(String(value ?? ""));
    return header || `column_${index + 1}`;
  });

  return dataRows
    .filter((row) => row.some((value) => value !== null && String(value).trim()))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => {
          const value = row[index];
          return [
            header,
            value instanceof Date
              ? value.toISOString().slice(0, 10)
              : typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                ? value
                : value == null
                  ? ""
                  : String(value),
          ];
        }),
      ),
    );
}

function pick(row: TransactionRow, names: string[]) {
  const key = names.find((name) => Object.hasOwn(row, name));
  return key ? row[key] : "";
}

function suggestCategory(description: string) {
  const text = description.toLowerCase();
  for (const [category, keywords] of categoryRules)
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  return description ? "Uncategorized" : "Needs Review";
}

export function cleanTransactions(rows: TransactionRow[]): TransactionRow[] {
  const normalized = rows.map((source) =>
    Object.fromEntries(Object.entries(source).map(([key, value]) => [normalizeColumn(key), typeof value === "string" ? value.trim() : value])),
  );
  const signatures = new Map<string, number>();
  for (const row of normalized) {
    const signature = `${pick(row, ["date", "transaction_date", "posted_date"])}|${pick(row, ["description", "vendor", "payee", "name", "details"])}|${pick(row, ["amount", "transaction_amount", "total"])}`;
    signatures.set(signature, (signatures.get(signature) ?? 0) + 1);
  }
  return normalized.map((row) => {
    const date = String(pick(row, ["date", "transaction_date", "posted_date"]));
    const description = String(pick(row, ["description", "vendor", "payee", "name", "details"]));
    const withdrawal = moneyToNumber(pick(row, ["withdrawals", "withdrawal", "debits", "debit", "payments"])) ?? 0;
    const deposit = moneyToNumber(pick(row, ["deposits", "deposit", "credits", "credit"])) ?? 0;
    const amount = moneyToNumber(pick(row, ["amount", "transaction_amount", "total"])) ?? deposit - withdrawal;
    const suggestedCategory = suggestCategory(description);
    const signature = `${date}|${description}|${pick(row, ["amount", "transaction_amount", "total"])}`;
    const reasons: string[] = [];
    if (!description) reasons.push("Missing description");
    if (!Number.isFinite(amount)) reasons.push("Missing amount");
    else if (Math.abs(amount) > 1000) reasons.push("Amount over $1,000");
    if ((signatures.get(signature) ?? 0) > 1) reasons.push("Possible duplicate");
    if (["Needs Review", "Uncategorized"].includes(suggestedCategory)) reasons.push("Uncategorized or needs review");
    return {
      ...row,
      date,
      description,
      amount,
      clean_vendor: description.replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      suggested_category: suggestedCategory,
      review_flag: reasons.join("; "),
      is_flagged: reasons.length > 0,
    };
  });
}

const similarity = (left: string, right: string) => {
  const a = new Set(left.toLowerCase().split(/\W+/).filter(Boolean));
  const b = new Set(right.toLowerCase().split(/\W+/).filter(Boolean));
  const overlap = [...a].filter((word) => b.has(word)).length;
  return a.size + b.size ? (2 * overlap) / (a.size + b.size) : 0;
};

export function reconcile(bankRows: TransactionRow[], qboRows: TransactionRow[]) {
  const bank = cleanTransactions(bankRows);
  const qbo = cleanTransactions(qboRows);
  const used = new Set<number>();
  const matched: TransactionRow[] = [];
  const needsReview: TransactionRow[] = [];
  const bankOnly: TransactionRow[] = [];
  bank.forEach((bankRow, bankIndex) => {
    let bestIndex = -1;
    let bestScore = 0;
    qbo.forEach((qboRow, qboIndex) => {
      if (used.has(qboIndex) || Number(bankRow.amount) !== Number(qboRow.amount)) return;
      const bankDate = new Date(String(bankRow.date));
      const qboDate = new Date(String(qboRow.date));
      const days = Math.abs(bankDate.getTime() - qboDate.getTime()) / 86400000;
      if (!Number.isFinite(days) || days > 3) return;
      const score = Math.round(80 - days * 3 + similarity(String(bankRow.description), String(qboRow.description)) * 20);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = qboIndex;
      }
    });
    if (bestIndex < 0) bankOnly.push({ ...bankRow, source_row: bankIndex + 2 });
    else {
      used.add(bestIndex);
      const result = {
        match_status: "Suggested match only",
        match_confidence: bestScore,
        bank_source_row: bankIndex + 2,
        qbo_source_row: bestIndex + 2,
        bank_date: bankRow.date,
        qbo_date: qbo[bestIndex].date,
        bank_description: bankRow.description,
        qbo_description: qbo[bestIndex].description,
        bank_amount: bankRow.amount,
        qbo_amount: qbo[bestIndex].amount,
      };
      (bestScore >= 75 ? matched : needsReview).push(result);
    }
  });
  const qboOnly = qbo.filter((_, index) => !used.has(index));
  const possibleDuplicates = [...bank, ...qbo].filter((row) => Boolean(row.review_flag?.toString().includes("Possible duplicate")));
  return { bank, qbo, matched, needsReview, bankOnly, qboOnly, possibleDuplicates };
}

export function suggestJournalEntry(row: TransactionRow, bankAccount = "Checking Account"): TransactionRow {
  const amount = moneyToNumber(row.amount) ?? 0;
  const category = String(row.suggested_category || row.category || "Uncategorized");
  const mapped = journalAccounts[category] ?? "Uncategorized / Suspense";
  const review = mapped === "Uncategorized / Suspense" || amount === 0;
  return {
    transaction_date: String(row.date ?? ""),
    description: String(row.description ?? ""),
    suggested_category: category,
    debit_account: amount < 0 ? mapped : bankAccount,
    credit_account: amount < 0 ? bankAccount : mapped,
    debit_amount: Math.abs(amount),
    credit_amount: Math.abs(amount),
    memo: String(row.memo ?? ""),
    confidence_score: review ? 55 : 85,
    review_required: review ? "Yes" : "No",
  };
}

const escapeXml = (value: unknown) =>
  String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function workbookXml(sheets: Record<string, TransactionRow[]>) {
  const worksheets = Object.entries(sheets).map(([name, rows]) => {
    const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    const xmlRows = [
      `<Row>${headers.map((header) => `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`).join("")}</Row>`,
      ...rows.map((row) => `<Row>${headers.map((header) => {
        const value = row[header];
        const type = typeof value === "number" ? "Number" : "String";
        return `<Cell><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
      }).join("")}</Row>`),
    ].join("");
    return `<Worksheet ss:Name="${escapeXml(name.slice(0, 31))}"><Table>${xmlRows}</Table></Worksheet>`;
  }).join("");
  return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">${worksheets}</Workbook>`;
}

export type PdfReportSection = {
  title: string;
  rows: TransactionRow[];
  columns?: string[];
};

const pdfText = (value: unknown) =>
  String(value ?? "")
    .replaceAll(/[^\x20-\x7E]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

export async function buildPdfReport({
  title,
  subtitle,
  sections,
}: {
  title: string;
  subtitle?: string;
  sections: PdfReportSection[];
}) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 792;
  const pageHeight = 612;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  const colors = {
    ink: rgb(0.09, 0.12, 0.17),
    muted: rgb(0.38, 0.43, 0.5),
    line: rgb(0.78, 0.81, 0.85),
    paper: rgb(1, 1, 1),
    accent: rgb(0.84, 0.63, 0.2),
    header: rgb(0.055, 0.075, 0.11),
    headerText: rgb(0.94, 0.96, 0.98),
    rowAlt: rgb(0.965, 0.972, 0.98),
  };
  let page = document.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 92;

  const drawFrame = () => {
    page.drawRectangle({
      x: 0,
      y: pageHeight - 64,
      width: pageWidth,
      height: 64,
      color: colors.header,
    });
    page.drawText("LUNA1 ACCOUNTING & TRANSACTION INTELLIGENCE", {
      x: margin,
      y: pageHeight - 34,
      size: 10,
      font: bold,
      color: colors.accent,
    });
    page.drawText("IN DEVELOPMENT - REVIEW WORKSPACE", {
      x: pageWidth - margin - 193,
      y: pageHeight - 34,
      size: 8,
      font: bold,
      color: colors.headerText,
    });
    page.drawLine({
      start: { x: margin, y: 25 },
      end: { x: pageWidth - margin, y: 25 },
      thickness: 0.5,
      color: colors.line,
    });
    page.drawText(
      "For accounting review only. This report does not approve or post accounting records.",
      { x: margin, y: 12, size: 7, font: regular, color: colors.muted },
    );
  };

  const nextPage = () => {
    page = document.addPage([pageWidth, pageHeight]);
    drawFrame();
    y = pageHeight - 92;
  };

  const clipped = (value: unknown, width: number, size = 7.5) => {
    const text = pdfText(value);
    if (regular.widthOfTextAtSize(text, size) <= width) return text;
    let output = text;
    while (
      output.length > 1 &&
      regular.widthOfTextAtSize(`${output}...`, size) > width
    )
      output = output.slice(0, -1);
    return `${output}...`;
  };

  const drawTableHeader = (columns: string[], widths: number[]) => {
    page.drawRectangle({
      x: margin,
      y: y - 18,
      width: contentWidth,
      height: 18,
      color: colors.header,
    });
    let x = margin;
    columns.forEach((column, index) => {
      page.drawText(clipped(column.replaceAll("_", " ").toUpperCase(), widths[index] - 8, 6.5), {
        x: x + 4,
        y: y - 12,
        size: 6.5,
        font: bold,
        color: colors.headerText,
      });
      x += widths[index];
    });
    y -= 18;
  };

  drawFrame();
  page.drawText(pdfText(title), {
    x: margin,
    y,
    size: 20,
    font: bold,
    color: colors.ink,
  });
  y -= 24;
  if (subtitle) {
    page.drawText(clipped(subtitle, contentWidth, 9), {
      x: margin,
      y,
      size: 9,
      font: regular,
      color: colors.muted,
    });
    y -= 24;
  }

  for (const section of sections) {
    if (y < 90) nextPage();
    page.drawText(pdfText(section.title), {
      x: margin,
      y,
      size: 12,
      font: bold,
      color: colors.ink,
    });
    y -= 17;
    if (!section.rows.length) {
      page.drawText("No items in this section.", {
        x: margin,
        y,
        size: 8,
        font: regular,
        color: colors.muted,
      });
      y -= 22;
      continue;
    }
    const columns =
      section.columns?.filter((column) =>
        section.rows.some((row) => Object.hasOwn(row, column)),
      ) ?? [...new Set(section.rows.flatMap((row) => Object.keys(row)))].slice(0, 7);
    const width = contentWidth / Math.max(columns.length, 1);
    const widths = columns.map(() => width);
    drawTableHeader(columns, widths);
    section.rows.forEach((row, rowIndex) => {
      if (y < 52) {
        nextPage();
        page.drawText(pdfText(section.title), {
          x: margin,
          y,
          size: 10,
          font: bold,
          color: colors.ink,
        });
        y -= 15;
        drawTableHeader(columns, widths);
      }
      if (rowIndex % 2 === 1)
        page.drawRectangle({
          x: margin,
          y: y - 19,
          width: contentWidth,
          height: 19,
          color: colors.rowAlt,
        });
      let x = margin;
      columns.forEach((column, index) => {
        page.drawText(clipped(row[column], widths[index] - 8), {
          x: x + 4,
          y: y - 13,
          size: 7.5,
          font: regular,
          color: colors.ink,
        });
        x += widths[index];
      });
      page.drawLine({
        start: { x: margin, y: y - 19 },
        end: { x: pageWidth - margin, y: y - 19 },
        thickness: 0.35,
        color: colors.line,
      });
      y -= 19;
    });
    y -= 18;
  }

  const pages = document.getPages();
  pages.forEach((reportPage, index) => {
    reportPage.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: pageWidth - margin - 50,
      y: 12,
      size: 7,
      font: regular,
      color: colors.muted,
    });
  });
  document.setTitle(pdfText(title));
  document.setAuthor("Luna1 Research");
  document.setSubject("Accounting and Transaction Intelligence review report");
  return document.save();
}

export async function downloadPdfReport(
  name: string,
  report: Parameters<typeof buildPdfReport>[0],
) {
  const bytes = await buildPdfReport(report);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([bytes as BlobPart], { type: "application/pdf" }),
  );
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadFile(name: string, content: string, type = "text/csv") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function toCsv(rows: TransactionRow[]) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const quote = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [headers.map(quote).join(","), ...rows.map((row) => headers.map((header) => quote(row[header])).join(","))].join("\n");
}
