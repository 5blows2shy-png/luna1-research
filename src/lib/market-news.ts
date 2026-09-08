import "server-only";

export type MarketHeadline = { title: string; url: string; source: string; publishedAt: string; symbol?: string };
export type MarketNewsResponse = { headlines: MarketHeadline[]; status: "ok" | "unavailable"; updatedAt: string | null; provider: "Financial Modeling Prep"; message?: string };
type FmpNewsItem = Record<string, unknown>;
function text(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : null; }

export async function getMarketNews(): Promise<MarketNewsResponse> {
  const apiKey = process.env.MARKET_DATA_API_KEY?.trim();
  if (!apiKey) return { headlines: [], status: "unavailable", updatedAt: null, provider: "Financial Modeling Prep", message: "Market news is not configured." };
  try {
    const response = await fetch("https://financialmodelingprep.com/stable/news/stock-latest?page=0&limit=8", { headers: { apikey: apiKey }, next: { revalidate: 300 } });
    if (!response.ok) throw new Error("NEWS_PROVIDER_UNAVAILABLE");
    const payload: unknown = await response.json();
    const headlines = (Array.isArray(payload) ? payload : []).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const raw = item as FmpNewsItem;
      const title = text(raw.title); const url = text(raw.url) ?? text(raw.link); const publishedAt = text(raw.publishedDate) ?? text(raw.publishedAt) ?? text(raw.date);
      if (!title || !url || !publishedAt || !/^https?:\/\//i.test(url) || !Number.isFinite(Date.parse(publishedAt))) return [];
      return [{ title, url, source: text(raw.site) ?? text(raw.publisher) ?? "Financial Modeling Prep", publishedAt, ...(text(raw.symbol) ? { symbol: text(raw.symbol)! } : {}) } satisfies MarketHeadline];
    });
    if (!headlines.length) return { headlines: [], status: "unavailable", updatedAt: null, provider: "Financial Modeling Prep", message: "No market headlines are currently available." };
    return { headlines, status: "ok", updatedAt: new Date().toISOString(), provider: "Financial Modeling Prep" };
  } catch { return { headlines: [], status: "unavailable", updatedAt: null, provider: "Financial Modeling Prep", message: "Market headlines are temporarily unavailable." }; }
}
