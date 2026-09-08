import { getFmpResource, type FmpResource } from "@/lib/fmp-market-service";

export const runtime = "nodejs";
const allowed = new Set<FmpResource>(["profile", "historical-price-full", "income-statement", "balance-sheet-statement", "cash-flow-statement", "earning-calendar", "analyst-estimates", "price-target", "dividends", "insider-trading", "institutional-ownership", "sec-filings", "earning-call-transcript", "etf-holdings", "economic-indicators", "market-performance", "sector-performance", "stock-peers", "dcf"]);
const limits = new Map<string, { count: number; reset: number }>();

function limited(request: Request) {
  const id = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const now = Date.now(); const current = limits.get(id);
  if (!current || current.reset < now) { limits.set(id, { count: 1, reset: now + 60_000 }); return false; }
  current.count += 1; return current.count > 30;
}

export async function GET(request: Request) {
  if (limited(request)) return Response.json({ status: "rate-limited", data: [], message: "Market data request limit reached." }, { status: 429, headers: { "Retry-After": "60" } });
  const search = new URL(request.url).searchParams;
  const resource = search.get("resource") as FmpResource | null;
  if (!resource || !allowed.has(resource)) return Response.json({ status: "unavailable", data: [], message: "Unsupported market-data resource." }, { status: 400 });
  const params = Object.fromEntries([...search.entries()].filter(([key]) => key !== "resource").slice(0, 12));
  const result = await getFmpResource(resource, params);
  return Response.json(result, { status: result.status === "ok" ? 200 : result.status === "rate-limited" ? 429 : result.status === "unauthorized" || result.status === "subscription-restricted" ? 403 : 503, headers: { "Cache-Control": result.status === "ok" ? "private, max-age=60, stale-while-revalidate=300" : "private, no-store" } });
}
