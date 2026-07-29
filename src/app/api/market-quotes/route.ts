import { getMarketQuotes } from "@/lib/market-data-service";
import { portfolioTickerSymbols } from "@/lib/market-ticker-config";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("symbols")?.split(",") ?? [];
  const symbols = Array.from(new Set(requested.map((symbol) => symbol.trim().toUpperCase()).filter((symbol) => portfolioTickerSymbols.includes(symbol)))).slice(0, 24);
  if (!symbols.length) return Response.json({ error: "Select at least one supported Luna1 portfolio symbol." }, { status: 400 });
  const response = await getMarketQuotes(symbols);
  return Response.json(response, { status: response.status === "rate-limited" ? 429 : 200, headers: { "Cache-Control": "private, max-age=30" } });
}
