"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LunaBooksCashIntelligence } from "@/components/luna-books-cash-intelligence";
import {
  buildBoardPacketAnalysis,
  cleanTransactions,
  downloadFile,
  downloadPdfReport,
  excelSheetToRows,
  parseCsv,
  reconcile,
  sampleTransactions,
  type BoardPacketSource,
  type TransactionRow,
  workbookXml,
} from "@/lib/transaction-intelligence";
import {
  buildAccountingRecords,
  buildFocusSummary,
  businessFocusOptions,
  closeReadiness,
  resolveAccountingRecord,
  starterChartOfAccounts,
  type AccountingRecord,
  type BusinessFocus,
  type ClassificationAuditEvent,
} from "@/lib/klyro-accounting-workflow";

const tabs = [
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
] as const;
type Tab = (typeof tabs)[number];

const boardFileDefinitions = [
  {
    key: "transactions",
    label: "Cleaned Transactions",
    required: true,
    purpose: "Cash activity, category concentration, trends, and transaction-level review.",
  },
  {
    key: "budget",
    label: "Budget vs Actual",
    required: false,
    purpose: "Plan-versus-performance context and questions about meaningful variances.",
  },
  {
    key: "profit_loss",
    label: "Profit and Loss / Statement of Activities",
    required: false,
    purpose: "Revenue, expense, margin, and operating-result context.",
  },
  {
    key: "balance_sheet",
    label: "Balance Sheet / Statement of Financial Position",
    required: false,
    purpose: "Liquidity, obligations, assets, and financial-position context.",
  },
  {
    key: "reconciliation",
    label: "Reconciliation Exceptions",
    required: false,
    purpose: "Unresolved differences that can prevent a clean monthly close.",
  },
  {
    key: "journal_entries",
    label: "Suggested Journal Entries",
    required: false,
    purpose: "Proposed adjustments that still require support, review, and approval.",
  },
] as const;

type BoardFileKey = (typeof boardFileDefinitions)[number]["key"];

const boardSampleFiles: Record<BoardFileKey, TransactionRow[]> = {
  transactions: sampleTransactions,
  budget: [
    { account: "Contributions Revenue", budget: 6200, actual: 6500, variance: 300 },
    { account: "Payroll", budget: 2400, actual: 2200, variance: 200 },
    { account: "Operations", budget: 900, actual: 807.63, variance: 92.37 },
  ],
  profit_loss: [
    { line_item: "Total revenue", current_period: 6500 },
    { line_item: "Total operating expenses", current_period: 3247.63 },
    { line_item: "Net operating result", current_period: 3252.37 },
  ],
  balance_sheet: [
    { line_item: "Cash and cash equivalents", ending_balance: 18450 },
    { line_item: "Total liabilities", ending_balance: 4200 },
    { line_item: "Net assets / equity", ending_balance: 14250 },
  ],
  reconciliation: [
    { description: "Outstanding July deposit", amount: 1500, status: "Needs review", owner: "Finance" },
  ],
  journal_entries: [
    { description: "Accrue software subscription", debit_account: "Software Expense", credit_account: "Accounts Payable", debit_amount: 85, credit_amount: 85, review_required: "Yes" },
  ],
};

function Alert({ kind = "info", children }: { kind?: "info" | "warning" | "success"; children: React.ReactNode }) {
  return <div className={`ti-alert ti-alert--${kind}`}>{children}</div>;
}

function DataTable({ rows, editable = false, onChange }: {
  rows: TransactionRow[];
  editable?: boolean;
  onChange?: (rows: TransactionRow[]) => void;
}) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  if (!rows.length) return <div className="ti-empty">No records to display.</div>;
  return (
    <div className="ti-table-wrap">
      <table className="ti-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header.replaceAll("_", " ")}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${headers[0]}`}>
              {headers.map((header) => (
                <td key={header}>
                  {editable ? (
                    <input
                      aria-label={`${header} row ${rowIndex + 1}`}
                      value={String(row[header] ?? "")}
                      onChange={(event) => {
                        const next = rows.map((item, index) => index === rowIndex ? { ...item, [header]: event.target.value } : item);
                        onChange?.(next);
                      }}
                    />
                  ) : typeof row[header] === "boolean" ? String(row[header]) : String(row[header] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, caption, children }: { title: string; caption?: string; children?: React.ReactNode }) {
  return (
    <section className="ti-section">
      <header><h2>{title}</h2>{caption && <p>{caption}</p>}</header>
      {children}
    </section>
  );
}

async function loadFile(file: File): Promise<{ rows: TransactionRow[]; note: string }> {
  if (file.name.toLowerCase().endsWith(".csv")) return { rows: parseCsv(await file.text()), note: `Loaded ${file.name} as CSV.` };
  if (/\.(xlsx|xls|xlsm|xlsb|ods)$/i.test(file.name)) {
    const XLSX = await import("@e965/xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), {
      cellDates: true,
      type: "array",
    });
    if (!workbook.SheetNames.length)
      throw new Error("The Excel workbook does not contain a readable worksheet.");
    const rows = workbook.SheetNames.flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return [];
      const sheetData = XLSX.utils.sheet_to_json<
        Array<string | number | boolean | Date | null>
      >(sheet, { defval: null, header: 1, raw: true });
      return excelSheetToRows(sheetData).map((row) => ({
        source_sheet: sheetName,
        ...row,
      }));
    });
    return {
      rows,
      note: `Loaded ${file.name} from ${workbook.SheetNames.length} worksheet(s): ${workbook.SheetNames.join(", ")}.`,
    };
  }
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const lines: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items.map((item) => "str" in item ? item.str : "").join(" ");
      lines.push(text);
    }
    const transactions = lines.flatMap((text, pageIndex) => {
      const matches = [...text.matchAll(/(\d{1,2}[-/]\d{1,2}(?:[-/]\d{2,4})?)\s+(.+?)\s+(\(?-?\$?[\d,]+\.\d{2}\)?-?)\s+(\$?[\d,]+\.\d{2})/g)];
      return matches.map((match) => ({
        account_name: "",
        account_number: "",
        date: match[1],
        description: match[2].trim(),
        amount: match[3],
        balance: match[4],
        source_page: pageIndex + 1,
      }));
    });
    const rows = transactions.length
      ? transactions
      : lines.map((text, pageIndex) => ({
          source_page: pageIndex + 1,
          extracted_text: text.trim() || "No machine-readable text detected",
          review_status: "Manual review required",
        }));
    return {
      rows,
      note: transactions.length
        ? `Best-effort PDF transaction extraction completed across ${pdf.numPages} page(s). Manual review is required.`
        : `No transaction table was detected, so page-level PDF text from ${pdf.numPages} page(s) was preserved for the summary, narrative, review workflow, and exports. Manual review is required.`,
    };
  }
  throw new Error(
    "This file type is not supported. Upload CSV, PDF, XLSX, XLS, XLSM, XLSB, or ODS.",
  );
}

function UploadControl({
  label,
  onRows,
  accept = ".csv,.pdf,.xlsx,.xls,.xlsm,.xlsb,.ods",
}: {
  label: string;
  onRows: (rows: TransactionRow[], note: string) => void;
  accept?: string;
}) {
  const [error, setError] = useState("");
  return (
    <div className="ti-upload">
      <label>{label}<input type="file" accept={accept} onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const result = await loadFile(file);
          onRows(result.rows, result.note);
          setError("");
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "This file could not be processed.");
        }
      }} /></label>
      <small>CSV, PDF, XLSX, XLS, XLSM, XLSB, and ODS supported</small>
      {error && <Alert kind="warning">{error}</Alert>}
    </div>
  );
}

function HomeTab({ onSelectTab }: { onSelectTab: (tab: Tab) => void }) {
  const featuredWorkflows = [
    {
      tab: "Decision Board" as const,
      label: "01 · Tell Klyro",
      title: "Decision Board",
      description: "Choose the financial question that matters most. Klyro uses it to prioritize analysis without changing accounting classifications.",
      outcome: "Sets the question your completed books should answer",
    },
    {
      tab: "Transactions" as const,
      label: "02 · Add activity",
      title: "Upload & Clean Transactions",
      description: "Bring in CSV, PDF, Excel, and OpenDocument files; normalize columns and amounts; review categories and duplicates; then carry clean data into downstream workflows.",
      outcome: "Produces a review-ready transaction register",
    },
    {
      tab: "Journal Entries" as const,
      label: "03 · Review accounting",
      title: "Journal Entry Assistant",
      description: "Turn cleaned transaction activity into balanced journal-entry suggestions with account, debit, credit, memo, and review-status fields for accountant approval.",
      outcome: "Produces a controlled journal-entry review file",
    },
    {
      tab: "Monthly Close" as const,
      label: "04 · Close the month",
      title: "Monthly Close Board Packet",
      description: "Connect every imported source to a detailed financial summary, board narrative, management questions, review register, source coverage, and full Excel or PDF export.",
      outcome: "Produces a board-ready close review packet",
    },
    {
      tab: "Decision Board" as const,
      label: "05 · Answer the focus",
      title: "Business Answers",
      description: "Connect cleaned records, accounting entries, calculations, and your selected Business Focus into a transparent owner summary.",
      outcome: "Separates recorded facts, calculations, forecasts, and recommendations",
    },
  ];
  const workspaceTools = tabs.filter((tab) => tab !== "Overview");
  const portalModules = [
    ["Overview", "Available", "A connected view of imported activity, close status, and review priorities."],
    ["Transactions", "Available", "Import, normalize, categorize, flag duplicates, and export transaction records."],
    ["Banking", "Preview", "Parse bank statements and prepare bank activity for structured review."],
    ["Receipts", "Planned", "Collect receipts and connect supporting documents to transaction records."],
    ["Invoices", "Planned", "Create and monitor customer invoices within the business record."],
    ["Reconcile", "Preview", "Compare bank activity with accounting exports and organize exceptions."],
    ["Chart of Accounts", "Preview", "Review suggested account mappings before accounting approval."],
    ["Reports", "Preview", "Build close summaries, board packets, and controlled Excel or PDF exports."],
    ["Financial Health", "Preview", "Translate imported records into trends, concentrations, and management questions."],
    ["Accountant Review", "Preview", "Consolidate exceptions, suggested entries, and follow-up items for review."],
    ["Integrations", "Planned", "Connect QuickBooks Online and other approved financial-data sources."],
    ["Business Settings", "Planned", "Manage business profiles, team access, permissions, and security controls."],
  ] as const;
  return (
    <>
      <div className="ti-home-hero">
        <span>Coastal Heating &amp; Air LLC · Fictional demo business</span>
        <h2>Klyro Books</h2>
        <p className="ti-product-mission">The financial decision operating system for small business.</p>
        <div className="ti-why-statement">
          <span>Why Klyro exists</span>
          <h3>Businesses generate more data, but owners still struggle to turn it into decisions.</h3>
          <p>Klyro connects financial activity to organized accounting records, then turns those completed records into clear answers about cash, hiring, equipment, inventory, expenses, financing, and financial health.</p>
        </div>
        <p>Klyro is designed to give your business one secure place to organize transactions, maintain financial records and understand its financial performance.</p>
        <p>Upload financial files, categorize transactions, identify duplicates or unusual activity, reconcile accounts, prepare accounting records, and generate detailed close summaries from one connected review workspace.</p>
        <Alert kind="warning">Klyro is in development. Authentication, encrypted document storage, controlled accountant invitations, invoicing, and direct QuickBooks Online synchronization are planned—not currently production-ready.</Alert>
        <Link className="button" href="/login">Preview secure portal login <span>→</span></Link>
      </div>
      <Section title="How Is My Business Doing?" caption="Deterministic fictional demonstration values—not connected financial records.">
        <div className="ti-health-grid">
          {[
            ["Cash available", "$48,300", "$45,900", "↑", "Recorded", "Cash currently available across the demo operating accounts."],
            ["Monthly revenue", "$74,500", "$71,200", "↑", "Recorded", "Revenue recognized in the current demo month."],
            ["Monthly expenses", "$63,900", "$59,700", "↑", "Recorded", "Operating expenses increased faster than revenue."],
            ["Free cash flow", "$8,300", "$11,500", "↓", "Calculated", "Cash generated after recurring operating needs."],
            ["Operating margin", "14.2%", "16.1%", "↓", "Calculated", "The share of revenue remaining after operating expenses."],
            ["Cash runway", "2.8 months", "3.1 months", "↓", "Forecast", "Estimated coverage if current operating costs continue."],
            ["Accounts receivable", "$21,700", "$17,500", "↑ 24%", "Recorded", "Customer invoices awaiting collection."],
            ["Accounts payable", "$12,400", "$11,900", "↑", "Recorded", "Supplier bills and obligations still due."],
          ].map(([label, value, previous, direction, kind, why]) => <article key={label}>
            <span>{label}</span><strong>{value}</strong><b data-direction={String(direction).startsWith("↑") ? "up" : "down"}>{direction}</b>
            <small>{kind} · Previous {previous}</small><p>{why}</p>
          </article>)}
        </div>
      </Section>
      <Section title="What Needs Attention?" caption="Klyro connects the current position to the decisions that deserve review.">
        <div className="ti-attention-callout"><span>Receivables increased 24%</span><h3>More revenue is waiting to become cash.</h3><p>Collections slowed while payroll and operating expenses continued. This reduces near-term flexibility for equipment and hiring decisions.</p></div>
      </Section>
      <Section title="Your Next 3 Moves" caption="A deliberately limited 30–90 day action plan.">
        <div className="ti-next-moves">
          <article><span>01 · Next 7 days</span><h3>Collect receivables</h3><p>Prioritize the oldest customer balances and confirm expected payment dates.</p><small>Recommendation · High confidence</small></article>
          <article><span>02 · Next 30 days</span><h3>Delay the cash equipment purchase</h3><p>Compare financing with a cash purchase after collections improve.</p><small>Recommendation · Moderate confidence</small></article>
          <article><span>03 · Next 30–90 days</span><h3>Reevaluate hiring</h3><p>Model the full payroll burden after confirming revenue stability and collections.</p><small>Recommendation · Moderate confidence</small></article>
        </div>
      </Section>
      <Section title="Klyro Primary Workflow" caption="Tell Klyro the question, add financial activity once, resolve only unclear treatment, close the month, and review the answer.">
        <div className="ti-featured-workflows">
          {featuredWorkflows.map((workflow) => (
            <article key={workflow.title}>
              <span>{workflow.label}</span>
              <h3>{workflow.title}</h3>
              <p>{workflow.description}</p>
              <small>{workflow.outcome}</small>
              <button className="ti-button" onClick={() => onSelectTab(workflow.tab)}>
                Open {workflow.title}
              </button>
            </article>
          ))}
        </div>
      </Section>
      <Section title="All Klyro Portal Tools" caption="Every workflow remains available inside this connected business portal.">
        <div className="ti-workflow-launcher">
          {workspaceTools.map((tab, index) => (
            <button key={tab} onClick={() => onSelectTab(tab)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{tab}</b>
              <small>Open tool →</small>
            </button>
          ))}
        </div>
      </Section>
      <div className="ti-product-flow" aria-label="Klyro portal and Luna1 product hierarchy">
        <article><span>01 · Records</span><h3>Klyro</h3><b>Transactions and accounting records</b><p>Accounting, bookkeeping and financial records—including receipts, reconciliation, statements, and accountant review.</p></article>
        <span aria-hidden="true">↓</span>
        <article><span>02 · Outlook</span><h3>Klyro Forecast</h3><b>Budgets, projections and scenarios</b><p>Budgets, cash flow and future decisions built from finalized Klyro data.</p></article>
        <span aria-hidden="true">↓</span>
        <article><span>03 · Decisions</span><h3>Klyro Business</h3><b>Owner decisions and financial health</b><p>Run and understand your company through its profile, team, permissions, activity, and connected Klyro products.</p></article>
      </div>
      <Section title="Customer Portal" caption="One business profile, organized into connected financial workflows.">
        <div className="ti-portal-grid">
          {portalModules.map(([name, status, description]) => (
            <article key={name}>
              <div><h3>{name}</h3><span data-status={status.toLowerCase()}>{status}</span></div>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="How The Service Works">
        <DataTable rows={[
          { Step: "1. Collect", "Client-friendly explanation": "Request the bank, payroll, vendor, grant, and receipt files needed for cleanup." },
          { Step: "2. Clean", "Client-friendly explanation": "Standardize exports, flag review items, and suggest categories." },
          { Step: "3. Review", "Client-friendly explanation": "Prepare plain-English notes showing what appears complete and what still needs review." },
          { Step: "4. Report", "Client-friendly explanation": "Create cleanup files, reconciliation notes, and board-ready monthly close packets." },
        ]} />
        <Alert>Finance cleanup, reconciliation, journal entry, and board packet tools operate as one review-first workspace.</Alert>
      </Section>
      <LunaBooksCashIntelligence />
    </>
  );
}

function CleanTab({ parser = false, onCleaned }: { parser?: boolean; onCleaned: (rows: TransactionRow[]) => void }) {
  const [raw, setRaw] = useState<TransactionRow[]>([]);
  const [cleaned, setCleaned] = useState<TransactionRow[]>([]);
  const [note, setNote] = useState("");
  const process = (rows: TransactionRow[], message: string) => {
    const result = cleanTransactions(rows);
    setRaw(rows);
    setCleaned(result);
    setNote(message);
    onCleaned(result);
  };
  const flagged = cleaned.filter((row) => Boolean(row.is_flagged));
  return (
    <>
      <p>{parser ? "Upload a bank statement file to extract transaction activity." : "Upload a QuickBooks, bank CSV export, or bank statement PDF to clean transactions before review."}</p>
      <Alert kind="warning">PDF extraction is best-effort and may require manual review because bank statement formats vary.</Alert>
      <div className="ti-action-row">
        <UploadControl label={parser ? "Upload bank statement PDF, CSV, or Excel" : "Upload PDF, CSV, or Excel"} onRows={process} />
        <button className="ti-button" onClick={() => process(sampleTransactions, "Loaded Klyro sample_transactions.csv demonstration data.")}>Use sample data</button>
      </div>
      {note && <Alert kind="success">{note}</Alert>}
      {!cleaned.length ? <Alert>{parser ? "Upload a PDF bank statement to begin." : "Upload a CSV or PDF file to begin, or use sample data."}</Alert> : (
        <>
          {parser && <Section title="Raw Extraction Preview"><DataTable rows={raw} /></Section>}
          <Section title="Detected Columns"><DataTable rows={[{ date: "date", description: "description", amount: "amount", category: "category", memo: "memo" }]} /></Section>
          <div className="ti-metrics">
            <div><span>Transactions</span><strong>{cleaned.length}</strong></div>
            <div><span>Flagged</span><strong>{flagged.length}</strong></div>
            <div><span>Needs category review</span><strong>{cleaned.filter((row) => ["Needs Review", "Uncategorized"].includes(String(row.suggested_category))).length}</strong></div>
          </div>
          <Section title="Cleaned Data"><DataTable rows={cleaned} /></Section>
          <Section title="Flagged Transactions"><DataTable rows={flagged} /></Section>
          <div className="ti-action-row">
            <button className="ti-button" onClick={() => downloadFile("qbo_cleanup_review.xml", workbookXml({ "Cleaned Transactions": cleaned, "Flagged Transactions": flagged }), "application/vnd.ms-excel")}>Download Excel Review File</button>
            <button className="ti-button" onClick={() => void downloadPdfReport("qbo_cleanup_review.pdf", {
              title: "Transaction Cleanup Review",
              subtitle: `${cleaned.length} transactions processed; ${flagged.length} items require review.`,
              sections: [
                { title: "Cleaned Transactions", rows: cleaned, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
                { title: "Flagged Transactions", rows: flagged, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
              ],
            })}>Download PDF Review</button>
          </div>
        </>
      )}
    </>
  );
}

function ReconciliationTab() {
  const [bank, setBank] = useState<TransactionRow[]>([]);
  const [qbo, setQbo] = useState<TransactionRow[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const results = useMemo(() => bank.length && qbo.length ? reconcile(bank, qbo) : null, [bank, qbo]);
  return (
    <>
      <p>Upload bank and QuickBooks files to create suggested reconciliation matches.</p>
      <Alert kind="warning">Matches are suggested matches only. This app does not connect to or modify QuickBooks.</Alert>
      <Alert kind="warning">CSV exports are the most reliable source for reconciliation matching.</Alert>
      <div className="ti-upload-grid">
        <UploadControl label="Bank statement transactions file" onRows={(rows, note) => { setBank(rows); setNotes((items) => [...items, note]); }} />
        <UploadControl label="QuickBooks transactions file" onRows={(rows, note) => { setQbo(rows); setNotes((items) => [...items, note]); }} />
      </div>
      <button className="ti-button" onClick={() => { setBank(sampleTransactions); setQbo(sampleTransactions.map((row) => ({ ...row, description: `${row.description} QBO` }))); setNotes(["Loaded paired Klyro sample data."]); }}>Use paired sample data</button>
      {notes.map((note) => <Alert kind="success" key={note}>{note}</Alert>)}
      {!results ? <Alert>Upload both files or use paired sample data to run reconciliation.</Alert> : (
        <>
          <div className="ti-metrics ti-metrics--six">
            {[["Bank txns", results.bank.length], ["QBO txns", results.qbo.length], ["Matched", results.matched.length], ["Bank only", results.bankOnly.length], ["QBO only", results.qboOnly.length], ["Needs review", results.needsReview.length]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <Section title="Matched Transactions" caption="Suggested matches only."><DataTable rows={results.matched} /></Section>
          <Section title="Bank Only / Missing in QuickBooks"><DataTable rows={results.bankOnly} /></Section>
          <Section title="QuickBooks Only / Missing from Bank"><DataTable rows={results.qboOnly} /></Section>
          <Section title="Possible Duplicates"><DataTable rows={results.possibleDuplicates} /></Section>
          <Section title="Needs Review"><DataTable rows={results.needsReview} /></Section>
          <div className="ti-action-row">
            <button className="ti-button" onClick={() => downloadFile("bank_to_qbo_reconciliation.xml", workbookXml({ "Matched Transactions": results.matched, "Bank Only": results.bankOnly, "QuickBooks Only": results.qboOnly, "Possible Duplicates": results.possibleDuplicates, "Needs Review": results.needsReview }), "application/vnd.ms-excel")}>Download Reconciliation Workbook</button>
            <button className="ti-button" onClick={() => void downloadPdfReport("bank_to_qbo_reconciliation.pdf", {
              title: "Bank-to-QuickBooks Reconciliation Review",
              subtitle: "Suggested matches only. Accounting review is required before use.",
              sections: [
                { title: "Matched Transactions", rows: results.matched, columns: ["bank_date", "bank_description", "bank_amount", "qbo_date", "qbo_description", "match_confidence"] },
                { title: "Bank Only", rows: results.bankOnly, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
                { title: "QuickBooks Only", rows: results.qboOnly, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
                { title: "Possible Duplicates", rows: results.possibleDuplicates, columns: ["date", "description", "amount", "review_flag"] },
                { title: "Needs Review", rows: results.needsReview, columns: ["bank_date", "bank_description", "bank_amount", "qbo_date", "qbo_description", "match_confidence"] },
              ],
            })}>Download Reconciliation PDF</button>
          </div>
        </>
      )}
    </>
  );
}

function BusinessFocusTab({ focus, secondary, onFocus, onSecondary }: { focus: BusinessFocus; secondary: BusinessFocus[]; onFocus: (focus: BusinessFocus) => void; onSecondary: (focus: BusinessFocus) => void }) {
  return (
    <>
      <Section title="Decision Board" caption="Your primary focus prioritizes questions, metrics, and recommendations. It never changes accounting classification.">
        <h3>What are you trying to understand or accomplish right now?</h3>
        <div className="ti-focus-grid" role="radiogroup" aria-label="Primary business focus">
          {businessFocusOptions.map((option) => (
            <label key={option} data-selected={focus === option}>
              <input checked={focus === option} name="business-focus" onChange={() => onFocus(option)} type="radio" />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <Alert kind="success">Primary focus saved for this local business workspace: <b>{focus}</b>.</Alert>
        <h3>Additional focuses <small>(optional)</small></h3>
        <div className="ti-secondary-focuses">
          {businessFocusOptions.filter((option) => option !== focus).map((option) => <label key={option}><input checked={secondary.includes(option)} onChange={() => onSecondary(option)} type="checkbox" />{option}</label>)}
        </div>
      </Section>
    </>
  );
}

function AccountingEntryDetails({ record }: { record: AccountingRecord }) {
  return (
    <details className="ti-accounting-details">
      <summary>View Accounting Entry</summary>
      <dl>
        <div><dt>Debit</dt><dd>{record.debitAccount || "Pending account selection"}</dd></div>
        <div><dt>Credit</dt><dd>{record.creditAccount || "Pending account selection"}</dd></div>
        <div><dt>Amount</dt><dd>{Math.abs(record.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</dd></div>
        <div><dt>Source transaction</dt><dd>{record.sourceTransactionId}</dd></div>
        <div><dt>Supporting document</dt><dd>{record.sourceDocument || "Missing"}</dd></div>
        <div><dt>Reason / rule</dt><dd>{record.ruleUsed || record.reason}</dd></div>
      </dl>
    </details>
  );
}

function JournalTab({
  records,
  onResolve,
}: {
  records: AccountingRecord[];
  onResolve: (record: AccountingRecord, account: string) => void;
}) {
  const ready = records.filter((record) => record.status === "Ready to Post");
  const unclear = records.filter((record) => record.status === "Needs Input");
  const exceptions = records.filter((record) => !["Ready to Post", "Needs Input"].includes(record.status));
  const exportRows = records.map((record) => ({
    source_transaction: record.sourceTransactionId,
    date: record.date,
    vendor: record.vendor,
    amount: record.amount,
    status: record.status,
    confidence: record.confidence,
    debit_account: record.debitAccount || "Pending",
    credit_account: record.creditAccount || "Pending",
    debit_amount: record.debitAmount,
    credit_amount: record.creditAmount,
    supporting_document: record.sourceDocument || "Missing",
    reason: record.reason,
  }));
  return (
    <>
      <Alert kind="warning">Proposed entries are review records only. Klyro never auto-posts from weak confidence and does not modify QuickBooks.</Alert>
      {!records.length && <Alert>Import transactions in Upload &amp; Clean. Proposed accounting entries will appear here automatically—no second upload is required.</Alert>}
      <div className="ti-metrics">
        <div><span>Imported transactions</span><strong>{records.length}</strong></div>
        <div><span>Ready to post</span><strong>{ready.length}</strong></div>
        <div><span>Needs your input</span><strong>{unclear.length}</strong></div>
        <div><span>Duplicate / transfer review</span><strong>{exceptions.length}</strong></div>
      </div>
      <Section title="Ready to Post" caption="Clear proposed entries supported by an accounting mapping or approved rule.">
        <div className="ti-accounting-cards">
          {ready.map((record) => <article key={record.id}>
            <div><span data-confidence={record.confidence.toLowerCase()}>{record.confidence} confidence</span><b>{record.status}</b></div>
            <h3>{record.vendor}</h3><strong>{Math.abs(record.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>
            <p>Recorded as <b>{record.finalAccount}</b> {record.amount < 0 ? "paid from" : "received into"} Operating Checking.</p>
            <small>{record.reason}</small>
            <AccountingEntryDetails record={record} />
          </article>)}
          {!ready.length && <Alert>No entries are ready yet.</Alert>}
        </div>
      </Section>
      <Section title="Needs Your Input" caption="Klyro found more than one plausible treatment and did not finalize the entry.">
        <div className="ti-accounting-cards ti-accounting-cards--needs-input">
          {unclear.map((record) => <article id={record.sourceTransactionId} key={record.id}>
            <div><span data-confidence="needs-input">Needs Input</span><b>{record.vendor}</b></div>
            <h3>{Math.abs(record.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
            <p>What was this purchase for?</p>
            <div className="ti-account-options">
              {record.suggestions.map((suggestion) => <button key={suggestion.account} onClick={() => onResolve(record, suggestion.account)}><b>{suggestion.account}</b><span>{suggestion.confidence}% evidence fit</span></button>)}
              <select aria-label={`Choose another account for ${record.vendor}`} defaultValue="" onChange={(event) => event.target.value && onResolve(record, event.target.value)}>
                <option disabled value="">Choose another account</option>
                {starterChartOfAccounts.map((account) => <option key={account.code} value={account.name}>{account.code} · {account.name}</option>)}
              </select>
            </div>
            <details><summary>Why these suggestions?</summary><p>{record.reason}</p></details>
          </article>)}
          {!unclear.length && <Alert kind="success">No transactions currently need an account choice.</Alert>}
        </div>
      </Section>
      {exceptions.length > 0 && <Section title="Exception Review" caption="Duplicates and transfers require separate review before an accounting entry can be approved."><DataTable rows={exceptions.map((record) => ({ source_transaction: record.sourceTransactionId, vendor: record.vendor, amount: record.amount, status: record.status, reason: record.reason }))} /></Section>}
      <Section title="Chart of Accounts" caption="A compact starter structure. Additions require owner, bookkeeper, or accountant review.">
        <DataTable rows={starterChartOfAccounts} />
        <Alert>When imported activity needs a missing account, Klyro recommends it for approval instead of silently expanding the chart.</Alert>
      </Section>
      {records.length > 0 && <div className="ti-action-row"><button className="ti-button" onClick={() => downloadFile("proposed_journal_entries.xml", workbookXml({ "Proposed Journal Entries": exportRows }), "application/vnd.ms-excel")}>Download Journal Review</button><button className="ti-button" onClick={() => void downloadPdfReport("proposed_journal_entries.pdf", { title: "Proposed Journal Entry Review", subtitle: "Review-only accounting proposals linked to source transactions.", sections: [{ title: "Proposed Entries", rows: exportRows }] })}>Download Journal Review PDF</button></div>}
    </>
  );
}

function BoardPacketTab({ cleaned, records, onNavigate }: { cleaned: TransactionRow[]; records: AccountingRecord[]; onNavigate: (tab: Tab) => void }) {
  const subtabs = ["Upload Files", "Summary", "Board Narrative", "Review Items", "Export Packet"] as const;
  const [subtab, setSubtab] = useState<(typeof subtabs)[number]>("Upload Files");
  const [fileData, setFileData] = useState<
    Record<BoardFileKey, { rows: TransactionRow[]; note: string }>
  >(() =>
    Object.fromEntries(
      boardFileDefinitions.map((file) => [
        file.key,
        {
          rows: file.key === "transactions" ? cleaned : [],
          note:
            file.key === "transactions" && cleaned.length
              ? "Using transactions prepared in this workspace."
              : "",
        },
      ]),
    ) as Record<BoardFileKey, { rows: TransactionRow[]; note: string }>,
  );
  const [metadata, setMetadata] = useState({ month: "July", year: 2026, preparedDate: "2026-07-26", organization: "Organization Name", preparedBy: "Finance Team", threshold: 1000 });
  const workflowClose = useMemo(() => closeReadiness(records), [records]);
  const sources = useMemo<BoardPacketSource[]>(
    () =>
      boardFileDefinitions.map((file) => ({
        ...file,
        rows: file.key === "transactions" && cleaned.length
          ? cleaned
          : file.key === "journal_entries" && records.length
            ? records.map((record) => ({
                source_transaction: record.sourceTransactionId,
                description: record.vendor,
                amount: record.amount,
                debit_account: record.debitAccount || "Pending",
                credit_account: record.creditAccount || "Pending",
                status: record.status,
                confidence: record.confidence,
                review_required: record.status === "Ready to Post" ? "No" : "Yes",
              }))
            : fileData[file.key].rows,
        note: file.key === "transactions" && cleaned.length
          ? "Automatically linked from Upload & Clean Transactions."
          : file.key === "journal_entries" && records.length
            ? "Automatically linked from Journal Entry Assistant."
            : fileData[file.key].note,
      })),
    [cleaned, fileData, records],
  );
  const analysis = useMemo(
    () => buildBoardPacketAnalysis(sources, metadata.threshold),
    [metadata.threshold, sources],
  );
  const hasEvidence = analysis.loadedSourceCount > 0;
  const currency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  const importRows = (key: BoardFileKey, rows: TransactionRow[], note: string) =>
    setFileData((current) => ({ ...current, [key]: { rows, note } }));
  const loadSamplePacket = () =>
    setFileData(
      Object.fromEntries(
        boardFileDefinitions.map((file) => [
          file.key,
          {
            rows: boardSampleFiles[file.key],
            note: `Loaded Klyro sample ${file.label.toLowerCase()} data.`,
          },
        ]),
      ) as Record<BoardFileKey, { rows: TransactionRow[]; note: string }>,
    );
  const importedSheets = Object.fromEntries(
    sources
      .filter((source) => source.rows.length)
      .map((source) => [source.label, source.rows]),
  );
  const packetSheets = {
    "Executive Summary": analysis.executiveSummary,
    "File Coverage": analysis.sourceCoverage,
    "Category Breakdown": analysis.categoryBreakdown,
    "Activity Trend": analysis.activityTrend,
    "Largest Cash Movements": analysis.topMovements,
    "Review Register": analysis.reviewRegister,
    "Board Narrative": analysis.boardNarrative,
    "Management Questions": analysis.managementQuestions,
    ...importedSheets,
  };
  const pdfSections = [
    { title: "Executive Summary", rows: analysis.executiveSummary, columns: ["topic", "detailed_summary"] },
    { title: "Imported File Coverage", rows: analysis.sourceCoverage, columns: ["file", "status", "rows_imported", "contribution"] },
    { title: "Category Breakdown", rows: analysis.categoryBreakdown, columns: ["category", "transactions", "money_in", "money_out", "share_of_outflow"] },
    { title: "Activity Trend", rows: analysis.activityTrend },
    { title: "Largest Cash Movements", rows: analysis.topMovements, columns: ["date", "description", "amount", "direction", "category", "review_status"] },
    { title: "Consolidated Review Register", rows: analysis.reviewRegister, columns: ["priority", "source", "review_item", "description", "amount", "suggested_follow_up"] },
    { title: "Board Narrative", rows: analysis.boardNarrative, columns: ["board_lens", "interpretation", "evidence"] },
    { title: "Questions for Management", rows: analysis.managementQuestions, columns: ["question", "reason"] },
    ...sources
      .filter((source) => source.rows.length)
      .map((source) => ({ title: `Imported: ${source.label}`, rows: source.rows })),
  ];
  return (
    <>
      <Alert kind="warning">This board packet is generated from uploaded files and is for review only. It does not replace accounting review, management approval, treasurer review, or board oversight.</Alert>
      <Alert>Every imported file now feeds the shared Summary, Board Narrative, Review Items, and full Excel/PDF exports. Conclusions remain limited to the evidence actually loaded.</Alert>
      <Section title={`${metadata.month.toUpperCase()} CLOSE`} caption="Transactions flow here automatically from Upload & Clean and Journal Entry Assistant.">
        <div className="ti-close-readiness">
          <div><span>Close Readiness</span><strong>{workflowClose.readiness}%</strong><small>Ready entries earn four points each; duplicate, transfer, and missing-document exceptions reduce the transparent score.</small></div>
          <div className="ti-metrics">
            <div><span>Transactions imported</span><strong>{workflowClose.transactionsImported}</strong></div>
            <div><span>Categorized</span><strong>{workflowClose.categorized}</strong></div>
            <div><span>Ready journal entries</span><strong>{workflowClose.ready}</strong></div>
            <div><span>Needs user input</span><strong>{workflowClose.needsInput}</strong></div>
            <div><span>Missing documents</span><strong>{workflowClose.missingDocuments}</strong></div>
            <div><span>Possible duplicates</span><strong>{workflowClose.duplicates}</strong></div>
          </div>
        </div>
        {(workflowClose.needsInput > 0 || workflowClose.duplicates > 0 || workflowClose.transfers > 0) && <button className="ti-button" onClick={() => onNavigate("Journal Entries")}>Review exact accounting issues →</button>}
      </Section>
      <div className="ti-form-grid ti-form-grid--board">
        <label>Reporting month<select value={metadata.month} onChange={(event) => setMetadata({ ...metadata, month: event.target.value })}>{["January","February","March","April","May","June","July","August","September","October","November","December"].map((month) => <option key={month}>{month}</option>)}</select></label>
        <label>Reporting year<input type="number" value={metadata.year} onChange={(event) => setMetadata({ ...metadata, year: Number(event.target.value) })} /></label>
        <label>Prepared date<input type="date" value={metadata.preparedDate} onChange={(event) => setMetadata({ ...metadata, preparedDate: event.target.value })} /></label>
        <label>Organization name<input value={metadata.organization} onChange={(event) => setMetadata({ ...metadata, organization: event.target.value })} /></label>
        <label>Prepared by<input value={metadata.preparedBy} onChange={(event) => setMetadata({ ...metadata, preparedBy: event.target.value })} /></label>
        <label>Large transaction threshold<input type="number" value={metadata.threshold} onChange={(event) => setMetadata({ ...metadata, threshold: Number(event.target.value) })} /></label>
      </div>
      <div className="ti-subtabs">{subtabs.map((item) => <button aria-pressed={subtab === item} key={item} onClick={() => setSubtab(item)}>{item}</button>)}</div>
      {subtab === "Upload Files" && (
        <>
          <Section title="Close File Center" caption="Import any supported CSV, PDF, XLSX, XLS, XLSM, XLSB, or ODS file. Each loaded source flows through the entire board packet.">
            <div className="ti-metrics">
              <div><span>File categories loaded</span><strong>{analysis.loadedSourceCount}/{analysis.totalSourceCount}</strong></div>
              <div><span>Total imported rows</span><strong>{analysis.totalImportedRows}</strong></div>
              <div><span>Detected period start</span><strong>{analysis.periodStart}</strong></div>
              <div><span>Detected period end</span><strong>{analysis.periodEnd}</strong></div>
            </div>
            <button className="ti-button" onClick={loadSamplePacket}>Use complete sample close packet</button>
          </Section>
          <div className="ti-upload-grid">
            {boardFileDefinitions.map((file) => {
              const loaded = sources.find((source) => source.key === file.key) ?? { rows: [], note: "" };
              const isAutomaticallyLinked = (file.key === "transactions" && cleaned.length > 0) || (file.key === "journal_entries" && records.length > 0);
              return (
                <Section key={file.key} title={file.label} caption={`${file.required ? "Required foundation. " : "Recommended context. "}${file.purpose}`}>
                  <UploadControl label={`Upload ${file.label}`} onRows={(rows, note) => importRows(file.key, rows, note)} />
                  <Alert kind={loaded.rows.length ? "success" : file.required ? "warning" : "info"}>
                    {loaded.rows.length ? `${loaded.rows.length} row(s) linked to all packet tabs. ${loaded.note}` : `${file.required ? "Required" : "Not loaded"}. No evidence from this file is included yet.`}
                  </Alert>
                  {loaded.rows.length > 0 && !isAutomaticallyLinked && <button className="ti-button" onClick={() => importRows(file.key, [], "")}>Remove imported file</button>}
                </Section>
              );
            })}
          </div>
        </>
      )}
      {subtab === "Summary" && (
        <>
          <Section title="Detailed Close Summary" caption="A connected view derived from every file currently imported.">
            {!hasEvidence && <Alert kind="warning">Import at least one close file or use the complete sample packet to begin.</Alert>}
            <div className="ti-metrics">
              <div><span>Indicative review readiness</span><strong>{analysis.readiness}%</strong></div>
              <div><span>Money coming in</span><strong>{currency(analysis.incoming)}</strong></div>
              <div><span>Money going out</span><strong>{currency(analysis.outgoing)}</strong></div>
              <div><span>Net change</span><strong>{currency(analysis.netChange)}</strong></div>
              <div><span>Transactions</span><strong>{analysis.transactions.length}</strong></div>
              <div><span>Consolidated review items</span><strong>{analysis.reviewRegister.length}</strong></div>
              <div><span>File categories loaded</span><strong>{analysis.loadedSourceCount}/{analysis.totalSourceCount}</strong></div>
              <div><span>Total imported rows</span><strong>{analysis.totalImportedRows}</strong></div>
            </div>
            <Alert>Readiness is an indicative review score based on file coverage and automated flags. It is not an accounting opinion, certification, or approval.</Alert>
          </Section>
          <Section title="Executive Summary" caption="Plain-English observations tied to imported evidence.">
            {analysis.executiveSummary.map((item) => <div key={String(item.topic)}><h3>{item.topic}</h3><p>{item.detailed_summary}</p></div>)}
          </Section>
          <Section title="Imported File Coverage" caption="What each source contributes—and what remains absent."><DataTable rows={analysis.sourceCoverage} /></Section>
          <Section title="Category and Spending Concentration" caption="Detected inflows and outflows grouped from imported transactions."><DataTable rows={analysis.categoryBreakdown} /></Section>
          <Section title="Period Activity Trend"><DataTable rows={analysis.activityTrend} /></Section>
          <Section title="Largest Cash Movements" caption="The ten largest imported transactions by absolute value."><DataTable rows={analysis.topMovements} /></Section>
        </>
      )}
      {subtab === "Board Narrative" && (
        <>
          <Section title="Board Narrative" caption="How a board may read the imported evidence, with limitations stated explicitly.">
            {!hasEvidence ? <Alert kind="warning">Import close files before generating the board narrative.</Alert> : analysis.boardNarrative.map((item) => <div key={String(item.board_lens)}><h3>{item.board_lens}</h3><p>{item.interpretation}</p><small>Evidence: {item.evidence}</small></div>)}
          </Section>
          <Section title="Questions for Management" caption="Questions suggested by missing files, material movements, and unresolved review items."><DataTable rows={analysis.managementQuestions} /></Section>
          <Section title="Board Reading Guide"><DataTable rows={[
            { term: "Indicative review readiness", meaning: "A transparent workflow score based on imported coverage and unresolved flags—not an audit or close approval." },
            { term: "Net change", meaning: "Imported cash inflows minus imported cash outflows for the detected period." },
            { term: "Reconciliation exception", meaning: "A difference between records that requires investigation and support." },
            { term: "Concentration", meaning: "A category or transaction representing a meaningful share of imported activity." },
          ]} /></Section>
        </>
      )}
      {subtab === "Review Items" && (
        <>
          {!hasEvidence && <Alert kind="warning">Import close files before reviewing detailed exceptions.</Alert>}
          <Section title="Consolidated Review Register" caption="Transaction flags, imported reconciliation exceptions, and journal-entry approvals in one queue."><DataTable rows={analysis.reviewRegister} /></Section>
          <Section title="Flagged Transactions"><DataTable rows={analysis.flagged} /></Section>
          <Section title="Uncategorized Transactions"><DataTable rows={analysis.uncategorized} /></Section>
          <Section title="Possible Duplicates"><DataTable rows={analysis.duplicates} /></Section>
          <Section title="Large Transactions" caption={`Absolute amount at or above ${currency(metadata.threshold)}.`}><DataTable rows={analysis.large} /></Section>
        </>
      )}
      {subtab === "Export Packet" && (
        <Section title="Full Board Packet Export" caption="Exports include analysis, board narrative, review register, source coverage, and every imported source table.">
          {!hasEvidence ? <Alert kind="warning">Import at least one close file before exporting the packet.</Alert> : <>
            <Alert>PDF and Excel exports are review files only and require accounting and management approval before board use.</Alert>
            <DataTable rows={analysis.sourceCoverage} />
            <div className="ti-action-row">
              <button className="ti-button" onClick={() => downloadFile("monthly_close_board_packet.xml", workbookXml(packetSheets), "application/vnd.ms-excel")}>Download Full Board Packet Excel</button>
              <button className="ti-button" onClick={() => void downloadPdfReport("monthly_close_board_packet.pdf", {
                title: "Monthly Close Board Packet",
                subtitle: `${metadata.organization} - ${metadata.month} ${metadata.year} - Prepared by ${metadata.preparedBy} on ${metadata.preparedDate}`,
                sections: pdfSections,
              })}>Download Full Board Packet PDF</button>
            </div>
          </>}
        </Section>
      )}
    </>
  );
}

function SummaryBoard({ focus, records, onNavigate }: { focus: BusinessFocus; records: AccountingRecord[]; onNavigate: (tab: Tab) => void }) {
  const summary = useMemo(() => buildFocusSummary(focus, records), [focus, records]);
  return (
    <>
      <Section title="Your Question" caption="Business Focus determines what Klyro prioritizes; accounting treatment remains independent.">
        <div className="ti-summary-question"><span>{focus}</span><h3>{summary.question}</h3></div>
      </Section>
      <Section title="Current Position" caption="Every value is labeled by evidence type.">
        <div className="ti-metrics">
          {summary.currentPosition.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.kind}</small></div>)}
        </div>
      </Section>
      <div className="ti-summary-grid">
        <Section title="What Klyro Found"><p>{summary.finding}</p></Section>
        <Section title="Potential Impact"><span className="ti-evidence-kind">Forecast</span><p>{summary.potentialImpact}</p></Section>
        <Section title="What Deserves Attention"><span className="ti-evidence-kind">Recommendation</span><ul>{summary.attention.map((item) => <li key={item}>{item}</li>)}</ul></Section>
        <Section title="Why"><p>{summary.why}</p></Section>
        <Section title="Confidence"><strong className="ti-summary-confidence">{summary.confidence}</strong></Section>
        <Section title="Assumptions"><ul>{summary.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></Section>
      </div>
      {!records.length && <button className="ti-button" onClick={() => onNavigate("Transactions")}>Import financial activity →</button>}
      {records.some((record) => record.status !== "Ready to Post") && <button className="ti-button" onClick={() => onNavigate("Journal Entries")}>Resolve accounting review items →</button>}
      <Alert>Recorded facts come from imported activity. Calculations are deterministic. Forecasts and recommendations remain conditional and never constitute accounting approval.</Alert>
    </>
  );
}

function DecisionScenario() {
  return <Section title="Equipment + Hiring Decision" caption="A deterministic demo scenario using the fictional Coastal Heating & Air data.">
    <div className="ti-decision-options">
      <article data-decision="wait"><span>Wait</span><h3>Preserve flexibility</h3><p>Collect receivables first, then reassess both decisions with stronger cash coverage.</p><b>Recommended now</b></article>
      <article data-decision="finance"><span>Finance</span><h3>Finance the equipment</h3><p>Spread equipment cost over time while delaying the hire until revenue stability is confirmed.</p><b>Review terms</b></article>
      <article data-decision="cash"><span>Cash</span><h3>Pay cash</h3><p>Fastest ownership path, but it reduces runway and leaves less capacity for payroll volatility.</p><b>High risk</b></article>
    </div>
    <Alert>Recommendation · Moderate confidence. Assumes $48,300 available cash, current collections timing, and no unrecorded obligations.</Alert>
  </Section>;
}

function FinancialsTab() {
  const statements = [
    { Statement: "Profit & Loss", "Accounting view": "Revenue 74,500 · Expenses 63,900 · Operating profit 10,600", "Owner view": "The business earned $10,600 before taxes and owner distributions.", Confidence: "Moderate" },
    { Statement: "Balance Sheet", "Accounting view": "Cash 48,300 · A/R 21,700 · A/P 12,400 · Debt 18,600", "Owner view": "Cash is positive, but more customer money is tied up in unpaid invoices.", Confidence: "Moderate" },
    { Statement: "Cash Flow Statement", "Accounting view": "Operating cash 8,300 · Investing cash (0) · Financing cash (1,200)", "Owner view": "Operations generated cash, while debt payments reduced the ending balance.", Confidence: "Moderate" },
  ];
  return <>
    <Alert kind="warning">Fictional demo statements. These previews are not generated from a complete ledger and are not suitable for filing, lending, or accounting reliance.</Alert>
    <Section title="Financial Statements" caption="Accounting terminology and owner-friendly meaning appear together."><DataTable rows={statements} /></Section>
    <Section title="Data Confidence"><DataTable rows={[
      { Area: "Bank activity", Confidence: "High", Reason: "Demo transaction register is present." },
      { Area: "Revenue and expenses", Confidence: "Moderate", Reason: "Demo classifications require final review." },
      { Area: "Tax treatment", Confidence: "Insufficient", Reason: "No tax records or approved tax assumptions are present." },
    ]} /></Section>
  </>;
}

function PreviewModule({ title, description, rows }: { title: string; description: string; rows: TransactionRow[] }) {
  return <><Alert kind="warning">Demo preview only. This area is not connected to production authentication or storage.</Alert><Section title={title} caption={description}><DataTable rows={rows} /></Section></>;
}

export function TransactionIntelligenceWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [cleaned, setCleaned] = useState<TransactionRow[]>([]);
  const [focus, setFocus] = useState<BusinessFocus>("Improve Cash Flow");
  const [secondaryFocuses, setSecondaryFocuses] = useState<BusinessFocus[]>(["Buy Equipment", "Hire an Employee"]);
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<ClassificationAuditEvent[]>([]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = window.localStorage.getItem("klyro-business-focus");
      if (businessFocusOptions.includes(saved as BusinessFocus)) setFocus(saved as BusinessFocus);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);
  const updateFocus = (next: BusinessFocus) => {
    setFocus(next);
    window.localStorage.setItem("klyro-business-focus", next);
  };
  const updateSecondaryFocus = (next: BusinessFocus) => {
    setSecondaryFocuses((current) => current.includes(next) ? current.filter((item) => item !== next) : [...current, next]);
  };
  const updateCleaned = (rows: TransactionRow[]) => {
    setCleaned(rows);
    setRecords(buildAccountingRecords(rows));
  };
  const resolveRecord = (record: AccountingRecord, account: string) => {
    const resolved = resolveAccountingRecord(record, account);
    setRecords((current) => current.map((item) => item.id === record.id ? resolved.record : item));
    setAuditEvents((current) => [...current, resolved.event]);
  };
  return (
    <div className="ti-workspace">
      <header className="ti-banner">
        <div><span>In Development · Demo Preview · Not for operational use</span><h1>Klyro Books</h1></div>
        <p>The financial decision operating system for small business.</p>
      </header>
      <div className="ti-development-warning" role="alert"><strong>Development demonstration only.</strong> Klyro Books is not production-ready and must not be used as a system of record or relied on for bookkeeping, posting, filing, lending, tax, payroll, or business decisions. All values shown are fictional or user-supplied preview data and require qualified professional review.</div>
      <div className="ti-review-banner">Clean messy books, organize client requests, and prepare finance review files. Tools are for review only and do not approve, post, or modify accounting records.</div>
      <Alert kind="warning">PDF extraction is best-effort and may require manual review. This workspace prepares review files only and does not replace accounting approval.</Alert>
      <nav className="ti-tabs" aria-label="Klyro workspace">
        {tabs.map((tab) => <button key={tab} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </nav>
      <main className="ti-panel">
        {activeTab === "Overview" && <HomeTab onSelectTab={setActiveTab} />}
        {activeTab === "Decision Board" && <><BusinessFocusTab focus={focus} secondary={secondaryFocuses} onFocus={updateFocus} onSecondary={updateSecondaryFocus} /><DecisionScenario /><SummaryBoard focus={focus} records={records} onNavigate={setActiveTab} /></>}
        {activeTab === "Transactions" && <><CleanTab onCleaned={updateCleaned} /><Section title="Reconciliation"><ReconciliationTab /></Section></>}
        {activeTab === "Journal Entries" && <JournalTab records={records} onResolve={resolveRecord} />}
        {activeTab === "Cash Flow" && <LunaBooksCashIntelligence />}
        {activeTab === "Financials" && <FinancialsTab />}
        {activeTab === "Monthly Close" && <BoardPacketTab cleaned={cleaned} records={records} onNavigate={setActiveTab} />}
        {activeTab === "Accountant" && <PreviewModule title="Accountant View" description="Review accounting exceptions and role boundaries." rows={[{ Role: "Owner", Access: "Manage business, books, members, and approvals" }, { Role: "Bookkeeper", Access: "Write and review books" }, { Role: "Accountant", Access: "Review books without silent posting" }]} />}
        {activeTab === "Documents" && <PreviewModule title="Documents" description="Receipts, bills, invoices, and supporting evidence remain linked to source transactions." rows={[{ Document: "Vendor receipt", Status: "Sample linked", Use: "Accounting recommendation evidence" }, { Document: "Customer invoice", Status: "Sample missing", Use: "Receivables and collection analysis" }]} />}
        {activeTab === "Settings" && <PreviewModule title="Business Settings" description="Fictional local demo profile." rows={[{ Business: "Coastal Heating & Air LLC", Industry: "HVAC services", Entity: "LLC", Currency: "USD" }, { "Primary focus": focus, "Additional focuses": secondaryFocuses.join(", "), Storage: "Local demo only" }]} />}
      </main>
      <footer className="ti-workspace-footer">
        <span>Sample data available · No brokerage or QuickBooks connection</span>
        <span>Accounting review required before use · {auditEvents.length} local classification change(s) retained</span>
      </footer>
    </div>
  );
}
