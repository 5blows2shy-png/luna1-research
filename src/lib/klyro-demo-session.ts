import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const KLYRO_DEMO_COOKIE = "klyro_demo_session";
export const KLYRO_DEMO_LIFETIME_SECONDS = 60 * 60 * 24;

export type KlyroDemoSession = {
  id: string;
  issuedAt: number;
  expiresAt: number;
};

function getSecret() {
  const secret = process.env.DEMO_SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "klyro-local-demo-session-only";
  return null;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createKlyroDemoSession(now = Date.now()) {
  const secret = getSecret();
  if (!secret) return null;

  const session: KlyroDemoSession = {
    id: randomUUID(),
    issuedAt: now,
    expiresAt: now + KLYRO_DEMO_LIFETIME_SECONDS * 1_000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function readKlyroDemoSession(value: string | undefined, now = Date.now()) {
  const secret = getSecret();
  if (!secret || !value) return null;

  const [payload, suppliedSignature, extra] = value.split(".");
  if (!payload || !suppliedSignature || extra) return null;

  const expectedSignature = sign(payload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as KlyroDemoSession;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= now ||
      parsed.expiresAt - parsed.issuedAt !== KLYRO_DEMO_LIFETIME_SECONDS * 1_000
    ) return null;
    return parsed;
  } catch {
    return null;
  }
}
