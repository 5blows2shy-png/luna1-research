import { getMarketNews } from "@/lib/market-news";
export const runtime = "nodejs";
export async function GET() { const payload = await getMarketNews(); return Response.json(payload, { status: payload.status === "ok" ? 200 : 503, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" } }); }
