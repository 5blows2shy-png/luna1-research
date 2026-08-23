import { getMarketPulse } from "@/lib/market-pulse/service";

export const runtime = "nodejs";

export async function GET() {
  const payload = await getMarketPulse();
  return Response.json(payload, {
    status: payload.status === "unavailable" ? 503 : 200,
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=90" },
  });
}
