import { getMarketQuotes } from "@/lib/market-data-service";
import { portfolioTickerSymbols } from "@/lib/market-ticker-config";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("symbols")?.split(",") ?? [];
  const symbols = Array.from(new Set(requested.map((symbol) => symbol.trim().toUpperCase()).filter((symbol) => portfolioTickerSymbols.includes(symbol)))).slice(0, 24);
  if (!symbols.length) return Response.json({ error: "Select at least one supported Luna1 portfolio symbol." }, { status: 400 });
  const response = await getMarketQuotes(symbols);
  const rateLimited = response.status === "rate-limited";
  return Response.json(response, {
    status: rateLimited ? 429 : 200,
    headers: {
      "Cache-Control": rateLimited
        ? "private, no-store"
        : "public, max-age=30, stale-while-revalidate=60",
      "CDN-Cache-Control": rateLimited
        ? "no-store"
        : "public, s-maxage=60, stale-while-revalidate=300",
      "Vercel-CDN-Cache-Control": rateLimited
        ? "no-store"
        : "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
