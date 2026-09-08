import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "klyro_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;
export type KlyroSession = { userId: string; email: string; expiresAt: number };

function secret() {
  const value = process.env.KLYRO_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("KLYRO_SESSION_SECRET must contain at least 32 characters");
  return value;
}
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function createSessionToken(session: KlyroSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function verifySessionToken(token: string): KlyroSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try { const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as KlyroSession; return value.expiresAt > Date.now() ? value : null; } catch { return null; }
}
export async function readSession() { const token = (await cookies()).get(COOKIE)?.value; return token ? verifySessionToken(token) : null; }
export async function writeSession(userId: string, email: string) {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  (await cookies()).set(COOKIE, createSessionToken({ userId, email, expiresAt }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE_SECONDS });
}
export async function clearSession() { (await cookies()).set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); }
