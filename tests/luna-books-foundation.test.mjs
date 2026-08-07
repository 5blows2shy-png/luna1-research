import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { hasLunaBooksCapability } from "../src/lib/luna-books-access.ts";
import {
  billSchema,
  businessSchema,
  inventoryItemSchema,
  invoiceSchema,
  transactionImportSchema,
} from "../src/lib/luna-books-schema.ts";

const migration = fs.readFileSync("docs/luna-books-foundation.sql", "utf8");
const userClient = fs.readFileSync("src/lib/luna-books-supabase.ts", "utf8");

test("tenant foundation enables RLS on every financial table", () => {
  for (const table of [
    "luna_businesses",
    "luna_business_memberships",
    "luna_financial_accounts",
    "luna_customers",
    "luna_vendors",
    "luna_transactions",
    "luna_transaction_versions",
    "luna_invoices",
    "luna_invoice_payments",
    "luna_bills",
    "luna_bill_payments",
    "luna_inventory_items",
    "luna_inventory_movements",
    "luna_audit_events",
  ]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`), table);
  }
});

test("tenant foreign keys include business id to block cross-business references", () => {
  for (const relationship of [
    "account_id, business_id",
    "transaction_id, business_id",
    "customer_id, business_id",
    "invoice_id, business_id",
    "vendor_id, business_id",
    "bill_id, business_id",
    "inventory_item_id, business_id",
  ]) assert.ok(migration.includes(`foreign key (${relationship})`), relationship);
});

test("original transactions, payments, movements, versions, and audit events are append-only", () => {
  assert.match(migration, /transactions_insert/);
  assert.doesNotMatch(migration, /transactions_update/);
  assert.doesNotMatch(migration, /luna_invoice_payments_update/);
  assert.doesNotMatch(migration, /luna_bill_payments_update/);
  assert.doesNotMatch(migration, /luna_inventory_movements_update/);
  assert.doesNotMatch(migration, /luna_transaction_versions_update/);
  assert.match(migration, /Luna audit events are append-only/);
});

test("membership and grants preserve least privilege and at least one owner", () => {
  assert.match(migration, /A Luna business must retain at least one owner/);
  assert.match(migration, /revoke all on public\.luna_businesses[\s\S]+from anon/);
  assert.match(migration, /grant delete on public\.luna_business_memberships to authenticated/);
  assert.doesNotMatch(migration, /grant delete on public\.luna_transactions/);
});

test("user-scoped Supabase access uses the anon key and never the service role", () => {
  assert.match(userClient, /SUPABASE_ANON_KEY/);
  assert.match(userClient, /Authorization/);
  assert.doesNotMatch(userClient, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("least-privilege role capabilities separate ownership, bookkeeping, review, and employee access", () => {
  assert.equal(hasLunaBooksCapability("owner", "manage_members"), true);
  assert.equal(hasLunaBooksCapability("manager", "manage_members"), false);
  assert.equal(hasLunaBooksCapability("bookkeeper", "write_books"), true);
  assert.equal(hasLunaBooksCapability("accountant", "write_books"), false);
  assert.equal(hasLunaBooksCapability("accountant", "review_books"), true);
  assert.equal(hasLunaBooksCapability("employee", "view_business"), false);
  assert.equal(hasLunaBooksCapability("employee", "submit_expense"), true);
});

test("business and accounting inputs enforce identifiers, dates, currency, and integer money", () => {
  assert.equal(businessSchema.safeParse({ displayName: "Demo", legalName: "Demo LLC", baseCurrency: "USD" }).success, true);
  assert.equal(transactionImportSchema.safeParse({
    businessId: "a6d138ae-c920-4ada-b22a-48fdf91e737b",
    transactionDate: "2026-08-06",
    originalDescription: "Supplier payment",
    originalAmountMinor: -125_00,
    currency: "USD",
    entrySide: "debit",
    sourceType: "csv",
  }).success, true);
  assert.equal(transactionImportSchema.safeParse({
    businessId: "not-a-uuid",
    transactionDate: "2026-08-06",
    originalDescription: "Bad input",
    originalAmountMinor: 1.25,
    currency: "usd",
    entrySide: "debit",
    sourceType: "csv",
  }).success, false);
});

test("invoice and bill due dates cannot precede issue dates", () => {
  const common = {
    businessId: "a6d138ae-c920-4ada-b22a-48fdf91e737b",
    issueDate: "2026-08-06",
    dueDate: "2026-08-01",
    totalMinor: 10_000,
    currency: "USD",
  };
  assert.equal(invoiceSchema.safeParse({ ...common, customerId: "77f89f8d-4020-4f8e-b072-e63736fab2bd", invoiceNumber: "INV-1" }).success, false);
  assert.equal(billSchema.safeParse({ ...common, vendorId: "aac70519-6a16-4ee7-a5fa-e0bc52c34915" }).success, false);
});

test("inventory schema allows missing cost but rejects negative known cost", () => {
  const item = {
    businessId: "a6d138ae-c920-4ada-b22a-48fdf91e737b",
    sku: "SKU-1",
    name: "Product",
    quantityOnHand: 4,
    currency: "USD",
  };
  assert.equal(inventoryItemSchema.safeParse({ ...item, unitCostMinor: null }).success, true);
  assert.equal(inventoryItemSchema.safeParse({ ...item, unitCostMinor: -1 }).success, false);
});
