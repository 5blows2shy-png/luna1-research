import {
  cleanTransactions,
  journalAccounts,
  moneyToNumber,
  type TransactionRow,
} from "./transaction-intelligence.ts";

export const businessFocusOptions = [
  "Improve Cash Flow",
  "Hire an Employee",
  "Buy Equipment",
  "Pay Down Debt",
  "Take an Owner Distribution",
  "Increase Profitability",
  "Expand the Business",
  "Build Cash Reserves",
  "Understand My Business",
  "Custom Goal",
] as const;

export type BusinessFocus = (typeof businessFocusOptions)[number];
export type AccountingConfidence = "High" | "Medium" | "Low" | "Needs Input";
export type AccountingStatus = "Ready to Post" | "Needs Input" | "Possible Duplicate" | "Transfer Review";

export type ChartAccount = {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
};

export const starterChartOfAccounts: ChartAccount[] = [
  { code: "1000", name: "Operating Checking", type: "Asset" },
  { code: "1100", name: "Accounts Receivable", type: "Asset" },
  { code: "1200", name: "Inventory", type: "Asset" },
  { code: "1500", name: "Equipment", type: "Asset" },
  { code: "2000", name: "Accounts Payable", type: "Liability" },
  { code: "4000", name: "Sales Revenue", type: "Revenue" },
  { code: "4100", name: "Contributions Revenue", type: "Revenue" },
  { code: "4200", name: "Grant Revenue", type: "Revenue" },
  { code: "5000", name: "Payroll Expense", type: "Expense" },
  { code: "5100", name: "Office Supplies Expense", type: "Expense" },
  { code: "5200", name: "Software Expense", type: "Expense" },
  { code: "5300", name: "Telephone & Internet Expense", type: "Expense" },
  { code: "5400", name: "Utilities Expense", type: "Expense" },
  { code: "5500", name: "Repairs & Maintenance Expense", type: "Expense" },
  { code: "5600", name: "Bank Fees Expense", type: "Expense" },
  { code: "5999", name: "Uncategorized / Suspense", type: "Expense" },
];

export type AccountSuggestion = {
  account: string;
  confidence: number;
};

export type AccountingRecord = {
  id: string;
  sourceTransactionId: string;
  sourceDocument: string | null;
  date: string;
  vendor: string;
  amount: number;
  proposedAccount: string;
  finalAccount: string | null;
  confidence: AccountingConfidence;
  confidenceScore: number;
  status: AccountingStatus;
  reason: string;
  suggestions: AccountSuggestion[];
  debitAccount: string | null;
  creditAccount: string | null;
  debitAmount: number;
  creditAmount: number;
  approvedBy: string | null;
  approvedAt: string | null;
  previousClassification: string | null;
  ruleUsed: string | null;
  original: TransactionRow;
};

export type ClassificationAuditEvent = {
  transactionId: string;
  previousAccount: string | null;
  finalAccount: string;
  actor: string;
  occurredAt: string;
  reason: string;
};

const accountByCategory: Record<string, string> = {
  ...journalAccounts,
  Utilities: "Utilities Expense",
  "Repairs and Maintenance": "Repairs & Maintenance Expense",
};

const ambiguousSuggestions: Record<string, AccountSuggestion[]> = {
  amazon: [
    { account: "Office Supplies Expense", confidence: 42 },
    { account: "Equipment", confidence: 31 },
    { account: "Inventory", confidence: 19 },
    { account: "Software Expense", confidence: 8 },
  ],
  "home depot": [
    { account: "Equipment", confidence: 61 },
    { account: "Repairs & Maintenance Expense", confidence: 24 },
    { account: "Office Supplies Expense", confidence: 11 },
    { account: "Inventory", confidence: 4 },
  ],
};

function hasDocument(row: TransactionRow) {
  return Boolean(row.source_document || row.receipt || row.invoice || row.bill || row.document_name);
}

function sourceDocument(row: TransactionRow) {
  const value = row.source_document || row.receipt || row.invoice || row.bill || row.document_name;
  return value ? String(value) : null;
}

function isTransfer(row: TransactionRow) {
  return /\b(transfer|xfer|internal transfer)\b/i.test(String(row.description ?? ""));
}

function suggestionsFor(row: TransactionRow): AccountSuggestion[] {
  const vendor = String(row.clean_vendor || row.description || "").toLowerCase();
  const found = Object.entries(ambiguousSuggestions).find(([key]) => vendor.includes(key));
  if (found) return found[1];
  return [
    { account: "Office Supplies Expense", confidence: 35 },
    { account: "Equipment", confidence: 30 },
    { account: "Repairs & Maintenance Expense", confidence: 20 },
    { account: "Inventory", confidence: 15 },
  ];
}

function balancedLines(amount: number, account: string) {
  const absolute = Math.abs(amount);
  return amount < 0
    ? { debitAccount: account, creditAccount: "Operating Checking", debitAmount: absolute, creditAmount: absolute }
    : { debitAccount: "Operating Checking", creditAccount: account, debitAmount: absolute, creditAmount: absolute };
}

export function buildAccountingRecords(
  rows: TransactionRow[],
  approvedVendorRules: Record<string, string> = {},
): AccountingRecord[] {
  return cleanTransactions(rows).map((row, index) => {
    const id = `txn-${index + 1}-${String(row.date || "undated")}`;
    const vendor = String(row.clean_vendor || row.description || "Unknown vendor");
    const amount = moneyToNumber(row.amount) ?? 0;
    const category = String(row.suggested_category || "Uncategorized");
    const vendorRule = approvedVendorRules[vendor.toLowerCase()];
    const mapped = vendorRule || accountByCategory[category] || "Uncategorized / Suspense";
    const duplicate = String(row.review_flag || "").includes("Possible duplicate");
    const transfer = isTransfer(row);
    const unclear = mapped === "Uncategorized / Suspense" || category === "Needs Review";
    const documented = hasDocument(row);
    const status: AccountingStatus = duplicate
      ? "Possible Duplicate"
      : transfer
        ? "Transfer Review"
        : unclear
          ? "Needs Input"
          : "Ready to Post";
    const confidenceScore = vendorRule ? 98 : unclear ? (documented ? 58 : 35) : documented ? 94 : 84;
    const confidence: AccountingConfidence = unclear
      ? "Needs Input"
      : confidenceScore >= 90
        ? "High"
        : confidenceScore >= 70
          ? "Medium"
          : "Low";
    const lines = status === "Ready to Post" ? balancedLines(amount, mapped) : null;
    const evidence = documented
      ? `Supporting document ${sourceDocument(row)} is attached.`
      : "No supporting document is attached.";
    const reason = vendorRule
      ? `Matched the previously approved ${vendor} vendor rule.`
      : unclear
        ? `${evidence} More than one Chart of Accounts treatment is plausible, so Klyro did not finalize the entry.`
        : `Mapped ${category} to ${mapped} using the transaction description and existing Klyro accounting rules. ${evidence}`;

    return {
      id: `entry-${id}`,
      sourceTransactionId: id,
      sourceDocument: sourceDocument(row),
      date: String(row.date || ""),
      vendor,
      amount,
      proposedAccount: mapped,
      finalAccount: status === "Ready to Post" ? mapped : null,
      confidence,
      confidenceScore,
      status,
      reason,
      suggestions: unclear ? suggestionsFor(row) : [],
      ...(lines ?? { debitAccount: null, creditAccount: null, debitAmount: 0, creditAmount: 0 }),
      approvedBy: null,
      approvedAt: null,
      previousClassification: null,
      ruleUsed: vendorRule ? `Approved vendor rule: ${vendor}` : null,
      original: row,
    };
  });
}

export function resolveAccountingRecord(
  record: AccountingRecord,
  account: string,
  actor = "Business owner",
  occurredAt = new Date().toISOString(),
) {
  const lines = balancedLines(record.amount, account);
  const next: AccountingRecord = {
    ...record,
    previousClassification: record.finalAccount || record.proposedAccount,
    finalAccount: account,
    proposedAccount: account,
    confidence: "High",
    confidenceScore: 100,
    status: "Ready to Post",
    approvedBy: actor,
    approvedAt: occurredAt,
    reason: `Account selected by ${actor}.`,
    ...lines,
  };
  const event: ClassificationAuditEvent = {
    transactionId: record.sourceTransactionId,
    previousAccount: record.finalAccount || record.proposedAccount,
    finalAccount: account,
    actor,
    occurredAt,
    reason: "User resolved unclear accounting treatment",
  };
  return { record: next, event };
}

export function closeReadiness(records: AccountingRecord[]) {
  const transactionsImported = records.length;
  const duplicates = records.filter((record) => record.status === "Possible Duplicate").length;
  const transfers = records.filter((record) => record.status === "Transfer Review").length;
  const needsInput = records.filter((record) => record.status === "Needs Input").length;
  const ready = records.filter((record) => record.status === "Ready to Post").length;
  const missingDocuments = records.filter((record) => !record.sourceDocument && Math.abs(record.amount) >= 1_000).length;
  const resolvedPoints = ready * 4;
  const totalPoints = Math.max(1, transactionsImported * 4 + missingDocuments + duplicates + transfers);
  const readiness = transactionsImported ? Math.max(0, Math.min(100, Math.round((resolvedPoints / totalPoints) * 100))) : 0;
  return { transactionsImported, categorized: ready, ready, needsInput, missingDocuments, duplicates, transfers, readiness };
}

export type FocusSummary = {
  question: string;
  currentPosition: Array<{ label: string; value: string; kind: "Recorded" | "Calculated" | "Forecast" }>;
  finding: string;
  potentialImpact: string;
  attention: string[];
  why: string;
  confidence: "High" | "Medium" | "Low" | "Insufficient Data";
  assumptions: string[];
};

const dollars = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function buildFocusSummary(focus: BusinessFocus, records: AccountingRecord[]): FocusSummary {
  const inflows = records.reduce((sum, record) => sum + Math.max(0, record.amount), 0);
  const outflows = records.reduce((sum, record) => sum + Math.abs(Math.min(0, record.amount)), 0);
  const net = inflows - outflows;
  const ready = records.filter((record) => record.status === "Ready to Post").length;
  const unresolved = records.length - ready;
  const currentPosition = [
    { label: "Imported cash inflows", value: dollars(inflows), kind: "Recorded" as const },
    { label: "Imported cash outflows", value: dollars(outflows), kind: "Recorded" as const },
    { label: "Net cash change", value: dollars(net), kind: "Calculated" as const },
    { label: "Accounting records ready", value: `${ready} of ${records.length}`, kind: "Calculated" as const },
  ];
  const insufficient = records.length === 0;
  const base = {
    currentPosition,
    attention: unresolved ? [`Resolve ${unresolved} accounting review item(s) before relying on the summary.`] : ["Review and approve the proposed entries before posting."],
    confidence: insufficient ? "Insufficient Data" as const : unresolved ? "Low" as const : "Medium" as const,
    assumptions: ["Only imported records are included.", "No unrecorded obligations, tax treatment, or external account balances are assumed."],
  };
  const summaries: Partial<Record<BusinessFocus, Omit<FocusSummary, keyof typeof base>>> = {
    "Hire an Employee": {
      question: "Can I afford to hire another employee?",
      finding: `The imported activity shows a ${dollars(net)} net cash change, but payroll, cash balance, benefits, taxes, and the proposed compensation are not all available.`,
      potentialImpact: "Insufficient data to model runway after a hire without a proposed all-in employee cost and current cash balance.",
      why: "Hiring capacity depends on recurring employee cost and forward cash coverage, not imported transaction activity alone.",
    },
    "Buy Equipment": {
      question: "Can I afford the equipment purchase?",
      finding: `Imported records show ${dollars(outflows)} of cash outflows and ${dollars(net)} of net cash change.`,
      potentialImpact: "Enter the proposed purchase cost and current cash position in Klyro’s affordability model before making a decision.",
      why: "Equipment affordability depends on purchase price, available cash, debt, upcoming obligations, and runway.",
    },
    "Improve Cash Flow": {
      question: "What is driving my cash flow?",
      finding: `Imported activity contains ${dollars(inflows)} of inflows and ${dollars(outflows)} of outflows, producing a ${dollars(net)} net change.`,
      potentialImpact: net < 0 ? "Imported cash activity declined during the covered period." : "Imported cash activity increased during the covered period.",
      why: "The result is calculated directly from normalized imported transaction amounts; balance-sheet cash and unrecorded activity are excluded.",
    },
    "Increase Profitability": {
      question: "What is hurting profitability?",
      finding: `Imported activity includes ${dollars(inflows)} of inflows and ${dollars(outflows)} of outflows. Completed categories are required to explain margin changes reliably.`,
      potentialImpact: "Resolve review items, then compare recurring expenses and operating profit across periods.",
      why: "Profit analysis requires classified revenue and expenses, not bank movement alone.",
    },
  };
  const selected = summaries[focus] ?? {
    question: `How can Klyro help me ${focus.toLowerCase()}?`,
    finding: records.length ? `Klyro organized ${records.length} imported transaction(s), with ${unresolved} item(s) still requiring review.` : "No financial activity has been imported yet.",
    potentialImpact: "Complete the accounting review so Klyro can prioritize supported financial answers.",
    why: "Business Focus changes the order of analysis, not the accounting treatment of transactions.",
  };
  return { ...base, ...selected };
}
