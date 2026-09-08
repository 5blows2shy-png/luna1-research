import { getFmpResource, type FmpResource } from "@/lib/fmp-market-service";
import { clientIdentifier, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
const allowed = new Set<FmpResource>(["profile", "historical-price-full", "income-statement", "balance-sheet-statement", "cash-flow-statement", "earning-calendar", "analyst-estimates", "price-target", "dividends", "insider-trading", "institutional-ownership", "sec-filings", "stock-news", "earning-call-transcript", "etf-holdings", "economic-indicators", "market-performance", "sector-performance", "stock-peers", "dcf"]);
export async function GET(request: Request) {
  const retryAfter = enforceRateLimit("market-data", clientIdentifier(request), 30);
  if (retryAfter) return Response.json({ status: "rate-limited", data: [], message: "Market data request limit reached." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  const search = new URL(request.url).searchParams;
  const resource = search.get("resource") as FmpResource | null;
  if (!resource || !allowed.has(resource)) return Response.json({ status: "unavailable", data: [], message: "Unsupported market-data resource." }, { status: 400 });
  const params = Object.fromEntries([...search.entries()].filter(([key]) => key !== "resource").slice(0, 12));
  const result = await getFmpResource(resource, params);
  return Response.json(result, { status: result.status === "ok" ? 200 : result.status === "rate-limited" ? 429 : result.status === "unauthorized" || result.status === "subscription-restricted" ? 403 : 503, headers: { "Cache-Control": result.status === "ok" ? "private, max-age=60, stale-while-revalidate=300" : "private, no-store" } });
}
