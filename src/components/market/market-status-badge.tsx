import type { MarketSession } from "@/lib/market/market-session";

const labels: Record<MarketSession, string> = { regular: "LIVE", "pre-market": "PRE-MARKET", "after-hours": "AFTER HOURS", closed: "MARKET CLOSED" };

export function MarketStatusBadge({ session, unavailable = false, delayed = false }: { session: MarketSession; unavailable?: boolean; delayed?: boolean }) {
  const state = unavailable ? "unavailable" : session;
  const label = unavailable ? "DATA UNAVAILABLE" : labels[session];
  return <span className={`market-session-badge market-session-badge--${state}`}><i aria-hidden="true" />{label}{delayed && !unavailable ? <small> · UPDATE UNAVAILABLE</small> : null}</span>;
}
