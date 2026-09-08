import "server-only";
import { timingSafeEqual } from "node:crypto";
import { authorizeBusiness } from "./authorization";
import { createHarborSupplyDemo, DEMO_BUSINESS_ID } from "./demo-seed";
import type { AuditAction, DemoBusiness, Membership, Permission, Role } from "./types";

type DemoUser = { id: string; email: string; role: Role };
const users: DemoUser[] = [
  { id: "demo-owner", email: process.env.DEMO_OWNER_EMAIL || "demo-owner@klyro.test", role: "OWNER" },
  { id: "demo-accountant", email: process.env.DEMO_ACCOUNTANT_EMAIL || "demo-accountant@klyro.test", role: "ACCOUNTANT" },
];
const memberships: Membership[] = users.map((user) => ({ userId: user.id, businessId: DEMO_BUSINESS_ID, role: user.role }));
let demo = createHarborSupplyDemo();
const audit: { action: AuditAction; userId: string; businessId?: string; at: string; metadata?: Record<string, string> }[] = [];

function developmentOnly() { if (process.env.NODE_ENV === "production") throw new Error("DEMO_DISABLED"); }
function equalSecret(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export function authenticateDemo(email: string, password: string) {
  developmentOnly();
  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  const expected = user?.role === "OWNER" ? process.env.DEMO_OWNER_PASSWORD : process.env.DEMO_ACCOUNTANT_PASSWORD;
  if (!user || !expected || !equalSecret(password, expected)) return null;
  recordAudit("LOGIN", user.id); return user;
}
export function getDemoBusinesses(userId: string) { developmentOnly(); authorizeBusiness(memberships, userId, DEMO_BUSINESS_ID, "business:read"); recordAudit("BUSINESS_ACCESS", userId, DEMO_BUSINESS_ID); return [structuredClone(demo)]; }
export function requireDemoPermission(userId: string, permission: Permission) { developmentOnly(); return authorizeBusiness(memberships, userId, DEMO_BUSINESS_ID, permission); }
export function resetDemoBusiness(userId: string) { developmentOnly(); requireDemoPermission(userId, "demo:reset"); if (!demo.isDemo) throw new Error("PRODUCTION_RESET_REJECTED"); demo = createHarborSupplyDemo(); recordAudit("DEMO_RESET", userId, demo.id); return structuredClone(demo); }
export function recordAudit(action: AuditAction, userId: string, businessId?: string, metadata?: Record<string, string>) { audit.push({ action, userId, businessId, at: new Date().toISOString(), metadata }); }
export function demoExternalActionAllowed(action: "SEND_INVOICE" | "SEND_EMAIL" | "TRANSFER" | "PAYMENT" | "BANK_WRITE" | "QUICKBOOKS_WRITE" | "INVITE") { void action; return false; }
export function snapshotForTests(): { demo: DemoBusiness; memberships: Membership[]; auditCount: number } { return { demo: structuredClone(demo), memberships: structuredClone(memberships), auditCount: audit.length }; }
