import { getMarketNews } from "@/lib/market-news";
import { clientIdentifier, enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const retryAfter = enforceRateLimit("market-news", clientIdentifier(request), 20);
  if (retryAfter) return Response.json({ headlines: [], status: "unavailable", updatedAt: null, provider: "Financial Modeling Prep", message: "Market news request limit reached. Try again shortly." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  const result = await getMarketNews();
  return Response.json(result, { status: result.status === "ok" ? 200 : 503, headers: { "Cache-Control": result.status === "ok" ? "private, max-age=60, stale-while-revalidate=300" : "private, no-store" } });
}
