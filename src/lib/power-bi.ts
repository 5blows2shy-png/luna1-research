/** Only a supplied public Power BI report URL may be embedded. No credentials or arbitrary hosts. */
export function publicPowerBIUrl(raw: string | null): string | null {
  if (!raw || /[\\\s\u0000-\u001f]/.test(raw)) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "app.powerbi.com" || url.port || url.username || url.password || url.pathname !== "/view" || url.hash) return null;
    if (!/^[A-Za-z0-9_=-]+$/.test(url.searchParams.get("r") ?? "")) return null;
    if ([...url.searchParams.keys()].some(key => !["r", "pageName"].includes(key))) return null;
    return url.href;
  } catch { return null; }
}
