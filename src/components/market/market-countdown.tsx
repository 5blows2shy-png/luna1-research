import { formatMarketCountdown, type MarketSessionInfo } from "@/lib/market/market-session";

export function MarketCountdown({ now, info }: { now: Date; info: MarketSessionInfo }) {
  const countdown = formatMarketCountdown(now, info);
  return countdown ? <span className="market-countdown">{countdown}</span> : null;
}
