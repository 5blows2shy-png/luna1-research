import "server-only";
const attempts = new Map<string, { count: number; resetAt: number }>();
export function allowLoginAttempt(key: string, now = Date.now()) { const item = attempts.get(key); if (!item || item.resetAt < now) { attempts.set(key, { count: 1, resetAt: now + 60_000 }); return true; } if (item.count >= 5) return false; item.count += 1; return true; }
export function sameOrigin(request: Request) { const origin = request.headers.get("origin"); if (!origin) return process.env.NODE_ENV !== "production"; try { return new URL(origin).host === new URL(request.url).host; } catch { return false; } }
