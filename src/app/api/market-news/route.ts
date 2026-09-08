import { getFmpResource } from "@/lib/fmp-market-service";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const result = await getFmpResource("stock-news", { symbol: search.get("symbol") ?? undefined, page: search.get("page") ?? 0, limit: Math.min(Number(search.get("limit") ?? 20) || 20, 50) }, { ttlMs: 5 * 60_000 });
  return Response.json(result, { status: result.status === "ok" ? 200 : 503, headers: { "Cache-Control": result.status === "ok" ? "private, max-age=60, stale-while-revalidate=300" : "private, no-store" } });
}
