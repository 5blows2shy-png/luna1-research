"use client";

import { useMemo, useState } from "react";
import {
  cleanTransactions,
  downloadFile,
  downloadPdfReport,
  excelSheetToRows,
  journalAccounts,
  parseCsv,
  reconcile,
  sampleTransactions,
  suggestJournalEntry,
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
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = firstSheetName
      ? workbook.Sheets[firstSheetName]
      : undefined;
    if (!firstSheet)
      throw new Error("The Excel workbook does not contain a readable worksheet.");
    const sheetData = XLSX.utils.sheet_to_json<
      Array<string | number | boolean | Date | null>
    >(firstSheet, { defval: null, header: 1, raw: true });
    return {
      rows: excelSheetToRows(sheetData),
      note: `Loaded ${file.name} from worksheet “${firstSheetName}”.`,
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
    return { rows: transactions, note: `Best-effort PDF text extraction completed across ${pdf.numPages} page(s). Manual review is required.` };
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

function HomeTab() {
  return (
    <>
      <div className="ti-home-hero">
        <span>Luna1 Accounting &amp; Transaction Intelligence</span>
        <h2>Clean messy books before they slow the business down.</h2>
        <p>Luna1 Accounting &amp; Transaction Intelligence helps small businesses, nonprofits, churches, ministries, and creative teams clean up disorganized transactions, missing documents, unreconciled bank activity, and board reporting gaps.</p>
        <p>The client-facing promise is simple: send the files, see what is missing, clean the books, and leave every review item organized for follow-up.</p>
      </div>
      <div className="ti-service-grid">
        {[
          ["Offer 1", "Messy Books Cleanup", "Clean transaction exports, flag duplicates, find uncategorized items, prepare review files, and organize what still needs a decision."],
          ["Offer 2", "Client Request Portal", "Track missing bank statements, receipts, payroll reports, invoices, and reminders so cleanup work does not get stuck in email."],
          ["Offer 3", "Nonprofit Back Office", "Organize board packets, finance checklists, grant deadlines, vendor files, compliance reminders, and monthly close review items."],
        ].map(([label, title, copy]) => <article key={title}><span>{label}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
      <Section title="How The Service Works">
        <DataTable rows={[
          { Step: "1. Collect", "Client-friendly explanation": "Request the bank, payroll, vendor, grant, and receipt files needed for cleanup." },
          { Step: "2. Clean", "Client-friendly explanation": "Standardize exports, flag review items, and suggest categories." },
          { Step: "3. Review", "Client-friendly explanation": "Prepare plain-English notes showing what appears complete and what still needs review." },
          { Step: "4. Report", "Client-friendly explanation": "Create cleanup files, reconciliation notes, and board-ready monthly close packets." },
        ]} />
        <Alert>Finance cleanup, reconciliation, journal entry, and board packet tools operate as one review-first workspace.</Alert>
      </Section>
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
        <button className="ti-button" onClick={() => process(sampleTransactions, "Loaded Luna1 sample_transactions.csv demonstration data.")}>Use sample data</button>
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
      <button className="ti-button" onClick={() => { setBank(sampleTransactions); setQbo(sampleTransactions.map((row) => ({ ...row, description: `${row.description} QBO` }))); setNotes(["Loaded paired Luna1 sample data."]); }}>Use paired sample data</button>
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
  const [boardRows, setBoardRows] = useState<TransactionRow[]>(cleaned);
  const [metadata, setMetadata] = useState({ month: "July", year: 2026, preparedDate: "2026-07-26", organization: "Organization Name", preparedBy: "Finance Team", threshold: 1000 });
  const flagged = boardRows.filter((row) => Boolean(row.is_flagged));
  const duplicates = flagged.filter((row) => String(row.review_flag).includes("duplicate"));
  const uncategorized = boardRows.filter((row) => ["Needs Review", "Uncategorized"].includes(String(row.suggested_category)));
  const large = boardRows.filter((row) => Math.abs(Number(row.amount)) >= metadata.threshold);
  const incoming = boardRows.reduce((sum, row) => sum + Math.max(0, Number(row.amount) || 0), 0);
  const outgoing = boardRows.reduce((sum, row) => sum + Math.abs(Math.min(0, Number(row.amount) || 0)), 0);
  const readiness = boardRows.length ? Math.max(30, 100 - flagged.length * 5) : 0;
  return (
    <>
      <Alert kind="warning">This board packet is generated from uploaded files and is for review only. It does not replace accounting review, management approval, treasurer review, or board oversight.</Alert>
      <Alert>Board packet summary is based only on the files uploaded.</Alert>
      <div className="ti-form-grid ti-form-grid--board">
        <label>Reporting month<select value={metadata.month} onChange={(event) => setMetadata({ ...metadata, month: event.target.value })}>{["January","February","March","April","May","June","July","August","September","October","November","December"].map((month) => <option key={month}>{month}</option>)}</select></label>
        <label>Reporting year<input type="number" value={metadata.year} onChange={(event) => setMetadata({ ...metadata, year: Number(event.target.value) })} /></label>
        <label>Prepared date<input type="date" value={metadata.preparedDate} onChange={(event) => setMetadata({ ...metadata, preparedDate: event.target.value })} /></label>
        <label>Organization name<input value={metadata.organization} onChange={(event) => setMetadata({ ...metadata, organization: event.target.value })} /></label>
        <label>Prepared by<input value={metadata.preparedBy} onChange={(event) => setMetadata({ ...metadata, preparedBy: event.target.value })} /></label>
        <label>Large transaction threshold<input type="number" value={metadata.threshold} onChange={(event) => setMetadata({ ...metadata, threshold: Number(event.target.value) })} /></label>
      </div>
      <div className="ti-subtabs">{subtabs.map((item) => <button aria-pressed={subtab === item} key={item} onClick={() => setSubtab(item)}>{item}</button>)}</div>
      {subtab === "Upload Files" && <Section title="Upload Files" caption="Upload the cleaned transactions file first. The other reports are optional."><UploadControl label="Cleaned Transactions PDF or CSV" onRows={(rows) => setBoardRows(cleanTransactions(rows))} /><button className="ti-button" onClick={() => setBoardRows(cleanTransactions(sampleTransactions))}>Use sample cleaned transactions</button>{["Budget vs Actual", "Profit and Loss / Statement of Activities", "Balance Sheet / Statement of Financial Position", "Reconciliation Exceptions", "Suggested Journal Entries"].map((label) => <UploadControl key={label} label={`${label} PDF or CSV`} onRows={() => undefined} />)}</Section>}
      {subtab === "Summary" && <><Section title="Summary" caption="A high-level board packet view using every file currently uploaded.">{!boardRows.length && <Alert kind="warning">Cleaned Transactions is required for the Summary tab.</Alert>}<div className="ti-metrics"><div><span>Board Packet Readiness</span><strong>{readiness}%</strong></div><div><span>Money coming in</span><strong>{incoming.toFixed(2)}</strong></div><div><span>Money going out</span><strong>{outgoing.toFixed(2)}</strong></div><div><span>Net change</span><strong>{(incoming - outgoing).toFixed(2)}</strong></div><div><span>Transactions</span><strong>{boardRows.length}</strong></div><div><span>Needs review</span><strong>{flagged.length}</strong></div><div><span>Uncategorized</span><strong>{uncategorized.length}</strong></div><div><span>Possible duplicates</span><strong>{duplicates.length}</strong></div></div></Section><Section title="Plain-English Summary"><p>{boardRows.length ? `${metadata.organization} recorded ${boardRows.length} transactions in ${metadata.month} ${metadata.year}, with ${flagged.length} item(s) requiring review before board use.` : "Upload Cleaned Transactions to prepare the summary."}</p></Section><Section title="Key Highlights"><p>Money coming in: ${incoming.toFixed(2)} · Money going out: ${outgoing.toFixed(2)} · Net change: ${(incoming - outgoing).toFixed(2)}</p></Section><Section title="Things That Need Review"><p>{flagged.length} flagged · {uncategorized.length} uncategorized · {duplicates.length} possible duplicate(s).</p></Section><Section title="Missing Files"><p>Budget vs Actual, Profit and Loss, Balance Sheet, Reconciliation Exceptions, Suggested Journal Entries</p></Section><Section title="Data Loaded Checklist"><DataTable rows={[{ File: "Cleaned Transactions", Status: boardRows.length ? "Loaded" : "Missing" }, { File: "Budget vs Actual", Status: "Optional / not loaded" }, { File: "Profit and Loss", Status: "Optional / not loaded" }, { File: "Balance Sheet", Status: "Optional / not loaded" }]} /></Section></>}
      {subtab === "Board Narrative" && <Section title="Board Narrative" caption="Simple, cautious language for non-finance board members.">{!boardRows.length ? <Alert kind="warning">Upload Cleaned Transactions before creating the board narrative.</Alert> : <><h3>What happened this month?</h3><p>{metadata.organization} had ${incoming.toFixed(2)} coming in and ${outgoing.toFixed(2)} going out, producing a net change of ${(incoming - outgoing).toFixed(2)}.</p><h3>Why it matters</h3><DataTable rows={[{ Topic: "Cash activity", Explanation: "Incoming and outgoing activity should be compared with the approved budget and expected operating cycle." }, { Topic: "Review items", Explanation: `${flagged.length} transaction(s) need follow-up before the close is considered complete.` }]} /><h3>Questions for management</h3><DataTable rows={[{ Question: "Are the large and uncategorized transactions supported and approved?" }, { Question: "Are all required monthly close files available?" }]} /><h3>Simple finance glossary</h3><DataTable rows={[{ Term: "Net change", Meaning: "Money coming in minus money going out." }, { Term: "Reconciliation", Meaning: "Comparing two records and resolving differences." }]} /></>}</Section>}
      {subtab === "Review Items" && <>{!boardRows.length ? <Alert kind="warning">Upload Cleaned Transactions before reviewing detailed tables.</Alert> : <><Section title="Flagged Transactions"><DataTable rows={flagged} /></Section><Section title="Uncategorized Transactions"><DataTable rows={uncategorized} /></Section><Section title="Possible Duplicates"><DataTable rows={duplicates} /></Section><Section title="Large Transactions"><DataTable rows={large} /></Section></>}</>}
      {subtab === "Export Packet" && <Section title="Export Packet" caption="Download the monthly close packet in Excel or PDF format for review.">{!boardRows.length ? <Alert kind="warning">Upload Cleaned Transactions before exporting the board packet.</Alert> : <><Alert>PDF and Excel exports are review files only and require accounting and management approval before board use.</Alert><div className="ti-action-row"><button className="ti-button" onClick={() => downloadFile("monthly_close_board_packet.xml", workbookXml({ Summary: [{ organization: metadata.organization, period: `${metadata.month} ${metadata.year}`, readiness, money_in: incoming, money_out: outgoing, net_change: incoming - outgoing }], "Cleaned Transactions": boardRows, "Flagged Transactions": flagged, "Uncategorized Review": uncategorized, "Possible Duplicates": duplicates, "Large Transactions": large }), "application/vnd.ms-excel")}>Download Monthly Close Board Packet</button><button className="ti-button" onClick={() => void downloadPdfReport("monthly_close_board_packet.pdf", {
        title: "Monthly Close Board Packet",
        subtitle: `${metadata.organization} - ${metadata.month} ${metadata.year} - Prepared by ${metadata.preparedBy}`,
        sections: [
          { title: "Close Summary", rows: [{ organization: metadata.organization, period: `${metadata.month} ${metadata.year}`, readiness: `${readiness}%`, money_in: incoming.toFixed(2), money_out: outgoing.toFixed(2), net_change: (incoming - outgoing).toFixed(2), needs_review: flagged.length }] },
          { title: "Cleaned Transactions", rows: boardRows, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
          { title: "Flagged Transactions", rows: flagged, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
          { title: "Uncategorized Review", rows: uncategorized, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
          { title: "Possible Duplicates", rows: duplicates, columns: ["date", "description", "amount", "review_flag"] },
          { title: "Large Transactions", rows: large, columns: ["date", "description", "amount", "suggested_category", "review_flag"] },
        ],
      })}>Download Board Packet PDF</button></div></>}</Section>}
    </>
  );
}

export function TransactionIntelligenceWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [cleaned, setCleaned] = useState<TransactionRow[]>([]);
  return (
    <div className="ti-workspace">
      <header className="ti-banner">
        <div><span>In Development · Review Workspace</span><h1>Luna1 Accounting &amp; Transaction Intelligence</h1></div>
        <p>Upload, organize, reconcile, analyze, and export financial transaction data through structured accounting controls.</p>
      </header>
      <div className="ti-review-banner">Clean messy books, organize client requests, and prepare finance review files. Tools are for review only and do not approve, post, or modify accounting records.</div>
      <Alert kind="warning">PDF extraction is best-effort and may require manual review. This workspace prepares review files only and does not replace accounting approval.</Alert>
      <nav className="ti-tabs" aria-label="Transaction Intelligence workspace">
        {tabs.map((tab) => <button key={tab} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </nav>
      <main className="ti-panel">
        {activeTab === "Home" && <HomeTab />}
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
