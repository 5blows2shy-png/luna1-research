import { getMarketNews } from "@/lib/fmp-market-service";
import { clientIdentifier, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const retryAfter = enforceRateLimit("market-news", clientIdentifier(request), 20);
  if (retryAfter) return Response.json({ status: "rate-limited", data: [], message: "Market news request limit reached." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  const search = new URL(request.url).searchParams;
  // The route delegates to the typed getFmpResource-backed stock-news service.
  const result = await getMarketNews({ symbol: search.get("symbol") ?? undefined, page: Number(search.get("page") ?? 0) || 0, limit: Math.min(Number(search.get("limit") ?? 20) || 20, 50) });
  return Response.json(result, { status: result.status === "ok" ? 200 : 503, headers: { "Cache-Control": result.status === "ok" ? "private, max-age=60, stale-while-revalidate=300" : "private, no-store" } });
}
