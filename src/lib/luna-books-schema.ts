import { z } from "zod";

export const lunaBooksRoles = ["owner", "manager", "bookkeeper", "accountant", "employee"] as const;
export type LunaBooksRole = (typeof lunaBooksRoles)[number];

const uuid = z.string().uuid();
const currency = z.string().regex(/^[A-Z]{3}$/).default("USD");
const minorUnits = z.number().int().safe();
const nonnegativeMinorUnits = minorUnits.nonnegative();
const date = z.iso.date();

export const businessSchema = z.object({
  displayName: z.string().trim().min(1).max(120),
  legalName: z.string().trim().min(1).max(160),
  baseCurrency: currency,
  fiscalYearStartMonth: z.number().int().min(1).max(12).default(1),
});

export const membershipSchema = z.object({
  businessId: uuid,
  userId: uuid,
  role: z.enum(lunaBooksRoles),
});

export const transactionImportSchema = z.object({
  businessId: uuid,
  accountId: uuid.nullable().optional(),
  externalSourceId: z.string().trim().max(240).nullable().optional(),
  transactionDate: date,
  postedDate: date.nullable().optional(),
  originalDescription: z.string().trim().min(1).max(1000),
  originalAmountMinor: minorUnits,
  currency,
  entrySide: z.enum(["debit", "credit"]),
  sourceType: z.string().trim().min(1).max(80),
  originalPayload: z.record(z.string(), z.unknown()).default({}),
});

export const transactionVersionSchema = z.object({
  businessId: uuid,
  transactionId: uuid,
  categoryCode: z.string().trim().max(80).nullable().optional(),
  subcategory: z.string().trim().max(120).nullable().optional(),
  merchant: z.string().trim().max(240).nullable().optional(),
  memo: z.string().trim().max(1000).nullable().optional(),
  reconciliationStatus: z.string().trim().min(1).max(40).default("unreviewed"),
  duplicateStatus: z.string().trim().min(1).max(40).default("unreviewed"),
  anomalyStatus: z.string().trim().min(1).max(40).default("unreviewed"),
  confidenceBasisPoints: z.number().int().min(0).max(10_000).nullable().optional(),
  reason: z.string().trim().min(1).max(1000),
});

export const invoiceSchema = z.object({
  businessId: uuid,
  customerId: uuid,
  invoiceNumber: z.string().trim().min(1).max(120),
  issueDate: date,
  dueDate: date,
  totalMinor: nonnegativeMinorUnits,
  currency,
  status: z.enum(["draft", "open", "partial", "paid", "void"]).default("draft"),
}).refine((value) => value.dueDate >= value.issueDate, {
  message: "Invoice due date cannot precede its issue date.",
  path: ["dueDate"],
});

export const billSchema = z.object({
  businessId: uuid,
  vendorId: uuid,
  billNumber: z.string().trim().max(120).nullable().optional(),
  issueDate: date,
  dueDate: date,
  totalMinor: nonnegativeMinorUnits,
  currency,
  status: z.enum(["draft", "open", "partial", "paid", "void"]).default("draft"),
}).refine((value) => value.dueDate >= value.issueDate, {
  message: "Bill due date cannot precede its issue date.",
  path: ["dueDate"],
});

export const inventoryItemSchema = z.object({
  businessId: uuid,
  sku: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(240),
  vendorId: uuid.nullable().optional(),
  unitCostMinor: nonnegativeMinorUnits.nullable().optional(),
  unitPriceMinor: nonnegativeMinorUnits.nullable().optional(),
  currency,
  quantityOnHand: z.number().finite(),
  reorderPoint: z.number().finite().nonnegative().nullable().optional(),
  minimumOrderQuantity: z.number().finite().nonnegative().nullable().optional(),
  supplierLeadTimeDays: z.number().int().min(0).max(730).nullable().optional(),
});

export type BusinessInput = z.infer<typeof businessSchema>;
export type TransactionImportInput = z.infer<typeof transactionImportSchema>;
export type TransactionVersionInput = z.infer<typeof transactionVersionSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type BillInput = z.infer<typeof billSchema>;
export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
