export const roles = ["OWNER", "ACCOUNTANT", "VIEWER"] as const;
export type Role = (typeof roles)[number];

export const permissions = [
  "business:read", "business:update", "business:delete", "ownership:transfer",
  "owner-security:update", "financial:read", "financial:write", "reconciliation:write",
  "report:export", "members:manage", "integration:write", "demo:reset",
] as const;
export type Permission = (typeof permissions)[number];

export type Membership = { userId: string; businessId: string; role: Role };
export type AuditAction = "LOGIN" | "LOGOUT" | "BUSINESS_ACCESS" | "TRANSACTION_EDIT" |
  "RECONCILIATION" | "INVOICE_CHANGE" | "REPORT_EXPORT" | "PERMISSION_CHANGE" |
  "INTEGRATION_CHANGE" | "DEMO_RESET";

export type DemoTransaction = {
  id: string; date: string; description: string; amountCents: number; kind: string;
  category: string | null; receiptMissing?: boolean; duplicateOf?: string;
};

export type DemoBusiness = {
  id: string; name: string; industry: string; accountingMethod: "ACCRUAL";
  fiscalYear: "CALENDAR"; isDemo: true; seedVersion: number;
  metrics: Record<string, number>; transactions: DemoTransaction[];
  customers: { id: string; name: string }[]; vendors: { id: string; name: string }[];
  invoices: { id: string; customerId: string; totalCents: number; paidCents: number; dueDate: string }[];
  bills: { id: string; vendorId: string; totalCents: number; dueDate: string }[];
  inventory: { sku: string; status: "HEALTHY" | "SLOW" | "DEAD" | "EXCESS" | "STOCKOUT_RISK"; costCents: number }[];
};
