type RateLimitEntry = { count: number; reset: number };

const globalStore = globalThis as typeof globalThis & {
  lunaRateLimits?: Map<string, RateLimitEntry>;
};
const attempts =
  globalStore.lunaRateLimits ??= new Map<string, RateLimitEntry>();

export function clientIdentifier(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function enforceRateLimit(
  namespace: string,
  identifier: string,
  limit = 4,
  windowMs = 60_000,
  now = Date.now(),
) {
  const key = `${namespace}:${identifier}`;
  for (const [storedKey, entry] of attempts) {
    if (entry.reset <= now) attempts.delete(storedKey);
  }
  if (attempts.size >= 1_000 && !attempts.has(key)) {
    const oldest = attempts.keys().next().value;
    if (oldest) attempts.delete(oldest);
  }
  const current = attempts.get(key);
  if (current && current.reset > now && current.count >= limit) {
    return Math.ceil((current.reset - now) / 1_000);
  }
  attempts.set(key, {
    count: current && current.reset > now ? current.count + 1 : 1,
    reset: current && current.reset > now ? current.reset : now + windowMs,
  });
  return null;
}
