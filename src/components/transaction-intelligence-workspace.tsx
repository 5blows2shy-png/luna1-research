"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LunaBooksCashIntelligence } from "@/components/luna-books-cash-intelligence";
import {
  buildBoardPacketAnalysis,
  cleanTransactions,
  downloadFile,
  downloadPdfReport,
  excelSheetToRows,
  journalAccounts,
  parseCsv,
  reconcile,
  sampleTransactions,
  suggestJournalEntry,
  type BoardPacketSource,
  type TransactionRow,
  workbookXml,
} from "@/lib/transaction-intelligence";

const tabs = [
  "Home",
  "Client Request Portal",
  "Nonprofit Back Office",
  "Upload & Clean Transactions",
  "Bank Statement PDF Parser",
  "Bank-to-QuickBooks Reconciliation",
  "Journal Entry Assistant",
  "Monthly Close Board Packet",
] as const;
type Tab = (typeof tabs)[number];

const requestRows = [
  { Client: "Sample Client", Request: "April bank statement", "File type": "Bank statement", Status: "Waiting on client", "Due date": "2026-05-10", Reminder: "Send follow-up email" },
  { Client: "Sample Client", Request: "Payroll summary", "File type": "Payroll report", Status: "Received", "Due date": "2026-05-10", Reminder: "No reminder needed" },
  { Client: "Sample Client", Request: "Missing receipt for Amazon purchase", "File type": "Receipt", Status: "Needs review", "Due date": "2026-05-12", Reminder: "Ask for receipt or business purpose" },
];
const nonprofitRows = [
  { Area: "Board docs", Item: "Monthly close packet", Owner: "Finance", Status: "In progress", "Due date": "2026-05-15" },
  { Area: "Finance checklist", Item: "Review uncategorized transactions", Owner: "Bookkeeper", Status: "Needs review", "Due date": "2026-05-08" },
  { Area: "Grant deadline", Item: "Grant report backup", Owner: "Program manager", Status: "Waiting on documents", "Due date": "2026-05-20" },
  { Area: "Compliance", Item: "Insurance certificate renewal", Owner: "Operations", Status: "Pending", "Due date": "2026-06-01" },
];

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
      tab: "Upload & Clean Transactions" as const,
      label: "01 · Start here",
      title: "Upload & Clean Transactions",
      description: "Bring in CSV, PDF, Excel, and OpenDocument files; normalize columns and amounts; review categories and duplicates; then carry clean data into downstream workflows.",
      outcome: "Produces a review-ready transaction register",
    },
    {
      tab: "Journal Entry Assistant" as const,
      label: "02 · Prepare accounting",
      title: "Journal Entry Assistant",
      description: "Turn cleaned transaction activity into balanced journal-entry suggestions with account, debit, credit, memo, and review-status fields for accountant approval.",
      outcome: "Produces a controlled journal-entry review file",
    },
    {
      tab: "Monthly Close Board Packet" as const,
      label: "03 · Understand the month",
      title: "Monthly Close Board Packet",
      description: "Connect every imported source to a detailed financial summary, board narrative, management questions, review register, source coverage, and full Excel or PDF export.",
      outcome: "Produces a board-ready close review packet",
    },
  ];
  const workspaceTools = tabs.filter((tab) => tab !== "Home");
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
        <span>Your Klyro Portal</span>
        <h2>Accounting, bookkeeping and financial records.</h2>
        <p>Klyro is designed to give your business one secure place to organize transactions, maintain financial records and understand its financial performance.</p>
        <p>Upload financial files, categorize transactions, identify duplicates or unusual activity, reconcile accounts, prepare accounting records, and generate detailed close summaries from one connected review workspace.</p>
        <Alert kind="warning">Klyro is in development. Authentication, encrypted document storage, controlled accountant invitations, invoicing, and direct QuickBooks Online synchronization are planned—not currently production-ready.</Alert>
        <Link className="button" href="/login">Preview secure portal login <span>→</span></Link>
      </div>
      <Section title="Klyro Workflow Highlights" caption="Move from imported files to accounting review and a detailed view of business performance.">
        <div className="ti-featured-workflows">
          {featuredWorkflows.map((workflow) => (
            <article key={workflow.tab}>
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
      <div className="ti-product-flow" aria-label="Klyro product hierarchy">
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

function TrackerTab({ nonprofit = false }: { nonprofit?: boolean }) {
  const [rows, setRows] = useState<TransactionRow[]>(nonprofit ? nonprofitRows : requestRows);
  return (
    <>
      <Section title={nonprofit ? "Small Nonprofit Back-Office SaaS" : "Bookkeeper Client-Request Portal"} caption={nonprofit ? "MVP: Notion/Airtable dashboard sold as a service." : "MVP: Google Form + Airtable + email reminders first."}>
        <p>{nonprofit ? "This workflow is designed for museums, churches, ministries, and nonprofits that need simple operating visibility without a heavy finance system." : "Track the documents a bookkeeper needs from each client before cleanup work can move forward."}</p>
        <DataTable rows={rows} editable onChange={setRows} />
        <button className="ti-button" onClick={() => setRows([...rows, Object.fromEntries(Object.keys(rows[0] ?? { Item: "" }).map((key) => [key, ""]))])}>Add row</button>
      </Section>
      <Section title={nonprofit ? "Dashboard Modules" : "Suggested Google Form Fields"}>
        <DataTable rows={nonprofit ? [
          { Module: "Board packet center", "What it organizes": "Monthly financial summaries, review notes, and board questions." },
          { Module: "Finance close checklist", "What it organizes": "Bank review, duplicates, categories, large transactions, and journal entries." },
          { Module: "Grant deadline tracker", "What it organizes": "Reports, due dates, restricted funds notes, and backup documents." },
          { Module: "Vendor file cabinet", "What it organizes": "W-9s, contracts, invoices, renewals, and insurance documents." },
          { Module: "Compliance reminders", "What it organizes": "Filings, insurance, board approvals, policy reviews, and annual tasks." },
        ] : [
          { Field: "Client name", Purpose: "Connect the upload to the right cleanup client." },
          { Field: "Document month", Purpose: "Match the file to the close period." },
          { Field: "Document type", Purpose: "Bank statement, receipt, invoice, payroll, tax notice, or other." },
          { Field: "Upload file", Purpose: "Collect the source document for cleanup." },
          { Field: "Notes", Purpose: "Explain unusual transactions or missing files." },
        ]} />
      </Section>
      {!nonprofit && <Section title="Reminder Email Template"><pre className="ti-code">Subject: Missing bookkeeping documents for this month&apos;s cleanup{"\n\n"}Hi [Client Name],{"\n\n"}I am cleaning up your books for [Month]. I still need the following items:{"\n\n"}- [Missing item 1]{"\n"}- [Missing item 2]{"\n\n"}Please upload them using the request form. If an item is unavailable, reply with a note so I can mark it for review.</pre></Section>}
      <Alert>Future path: secure client access, uploads, request statuses, reminders, and role-based dashboards.</Alert>
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

function JournalTab({ cleaned }: { cleaned: TransactionRow[] }) {
  const [subtab, setSubtab] = useState<"Manual Entry" | "CSV Upload">("Manual Entry");
  const [manual, setManual] = useState<TransactionRow>({ date: "2026-07-26", amount: 0, suggested_category: "Software & Subscriptions", description: "", bank_account_name: "Checking Account", memo: "" });
  const [entry, setEntry] = useState<TransactionRow[]>([]);
  const [uploaded, setUploaded] = useState<TransactionRow[]>([]);
  const rows = uploaded.length ? cleanTransactions(uploaded) : cleaned;
  return (
    <>
      <Alert kind="warning">Draft journal entries are suggestions only and must be reviewed before posting.</Alert>
      <div className="ti-subtabs">{(["Manual Entry", "CSV Upload"] as const).map((item) => <button aria-pressed={subtab === item} key={item} onClick={() => setSubtab(item)}>{item}</button>)}</div>
      {subtab === "Manual Entry" ? (
        <>
          <div className="ti-form-grid">
            <label>transaction_date<input type="date" value={String(manual.date)} onChange={(event) => setManual({ ...manual, date: event.target.value })} /></label>
            <label>amount<input type="number" step=".01" value={Number(manual.amount)} onChange={(event) => setManual({ ...manual, amount: Number(event.target.value) })} /></label>
            <label>suggested_category<select value={String(manual.suggested_category)} onChange={(event) => setManual({ ...manual, suggested_category: event.target.value })}>{Object.keys(journalAccounts).map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="wide">description<input value={String(manual.description)} onChange={(event) => setManual({ ...manual, description: event.target.value })} /></label>
            <label>bank_account_name<input value={String(manual.bank_account_name)} onChange={(event) => setManual({ ...manual, bank_account_name: event.target.value })} /></label>
            <label>memo<textarea value={String(manual.memo)} onChange={(event) => setManual({ ...manual, memo: event.target.value })} /></label>
          </div>
          <button className="ti-button" onClick={() => setEntry([suggestJournalEntry(manual, String(manual.bank_account_name))])}>Suggest Draft Journal Entry</button>
          {entry.length > 0 && <><Section title="Draft Journal Entry Suggestion"><DataTable rows={entry} /></Section><Alert>Review required before posting. This app does not post to QuickBooks.</Alert><div className="ti-action-row"><button className="ti-button" onClick={() => downloadFile("draft_journal_entry.xml", workbookXml({ "Draft Journal Entry": entry }), "application/vnd.ms-excel")}>Download Draft Journal Entry</button><button className="ti-button" onClick={() => void downloadPdfReport("draft_journal_entry.pdf", { title: "Draft Journal Entry Review", subtitle: "Draft suggestion only. Review and approval are required before posting.", sections: [{ title: "Draft Journal Entry", rows: entry, columns: ["transaction_date", "description", "debit_account", "credit_account", "debit_amount", "credit_amount", "review_required"] }] })}>Download Journal Entry PDF</button></div></>}
        </>
      ) : (
        <>
          <UploadControl label="Upload cleaned transactions file" onRows={(newRows) => setUploaded(newRows)} />
          {!rows.length ? <Alert>Upload a cleaned transactions file or process sample data in Upload &amp; Clean Transactions.</Alert> : (
            <>
              <Section title="Select Rows That Need Draft Journal Entry Suggestions"><DataTable rows={rows} /></Section>
              <button className="ti-button" onClick={() => setEntry(rows.map((row) => suggestJournalEntry(row)))}>Suggest All Draft Journal Entries</button>
              {entry.length > 0 && <><Section title="Draft Journal Entry Suggestions"><DataTable rows={entry} /></Section><div className="ti-metrics"><div><span>Total debits</span><strong>{entry.reduce((sum, row) => sum + Number(row.debit_amount), 0).toFixed(2)}</strong></div><div><span>Total credits</span><strong>{entry.reduce((sum, row) => sum + Number(row.credit_amount), 0).toFixed(2)}</strong></div></div><div className="ti-action-row"><button className="ti-button" onClick={() => downloadFile("draft_journal_entries.xml", workbookXml({ "Draft Journal Entries": entry }), "application/vnd.ms-excel")}>Download Draft Journal Entries</button><button className="ti-button" onClick={() => void downloadPdfReport("draft_journal_entries.pdf", { title: "Draft Journal Entry Review", subtitle: "Draft suggestions only. Review and approval are required before posting.", sections: [{ title: "Draft Journal Entries", rows: entry, columns: ["transaction_date", "description", "debit_account", "credit_account", "debit_amount", "credit_amount", "review_required"] }] })}>Download Journal Entries PDF</button></div></>}
            </>
          )}
        </>
      )}
    </>
  );
}

function BoardPacketTab({ cleaned }: { cleaned: TransactionRow[] }) {
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
  const sources = useMemo<BoardPacketSource[]>(
    () =>
      boardFileDefinitions.map((file) => ({
        ...file,
        rows: fileData[file.key].rows,
        note: fileData[file.key].note,
      })),
    [fileData],
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
              const loaded = fileData[file.key];
              return (
                <Section key={file.key} title={file.label} caption={`${file.required ? "Required foundation. " : "Recommended context. "}${file.purpose}`}>
                  <UploadControl label={`Upload ${file.label}`} onRows={(rows, note) => importRows(file.key, rows, note)} />
                  <Alert kind={loaded.rows.length ? "success" : file.required ? "warning" : "info"}>
                    {loaded.rows.length ? `${loaded.rows.length} row(s) linked to all packet tabs. ${loaded.note}` : `${file.required ? "Required" : "Not loaded"}. No evidence from this file is included yet.`}
                  </Alert>
                  {loaded.rows.length > 0 && <button className="ti-button" onClick={() => importRows(file.key, [], "")}>Remove imported file</button>}
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

export function TransactionIntelligenceWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [cleaned, setCleaned] = useState<TransactionRow[]>([]);
  return (
    <div className="ti-workspace">
      <header className="ti-banner">
        <div><span>In Development · Review Workspace</span><h1>Klyro</h1></div>
        <p>Accounting, bookkeeping and financial records—organized so finalized data can support Klyro Forecast and Klyro Business decisions.</p>
      </header>
      <div className="ti-review-banner">Clean messy books, organize client requests, and prepare finance review files. Tools are for review only and do not approve, post, or modify accounting records.</div>
      <Alert kind="warning">PDF extraction is best-effort and may require manual review. This workspace prepares review files only and does not replace accounting approval.</Alert>
      <nav className="ti-tabs" aria-label="Klyro workspace">
        {tabs.map((tab) => <button key={tab} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </nav>
      <main className="ti-panel">
        {activeTab === "Home" && <HomeTab onSelectTab={setActiveTab} />}
        {activeTab === "Client Request Portal" && <TrackerTab />}
        {activeTab === "Nonprofit Back Office" && <TrackerTab nonprofit />}
        {activeTab === "Upload & Clean Transactions" && <CleanTab onCleaned={setCleaned} />}
        {activeTab === "Bank Statement PDF Parser" && <CleanTab parser onCleaned={setCleaned} />}
        {activeTab === "Bank-to-QuickBooks Reconciliation" && <ReconciliationTab />}
        {activeTab === "Journal Entry Assistant" && <JournalTab cleaned={cleaned} />}
        {activeTab === "Monthly Close Board Packet" && <BoardPacketTab cleaned={cleaned} />}
      </main>
      <footer className="ti-workspace-footer">
        <span>Sample data available · No brokerage or QuickBooks connection</span>
        <span>Accounting review required before use</span>
      </footer>
    </div>
  );
}
