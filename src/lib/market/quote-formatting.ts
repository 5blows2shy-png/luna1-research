import type { MarketDataType } from "@/lib/market-data";

export const dataTypeLabels: Record<MarketDataType, string> = {
  "real-time": "Real Time",
  delayed: "Delayed",
  "previous-close": "Previous Close",
  demo: "Demo Data",
  unavailable: "Unavailable",
};

export function formatQuoteNumber(value: number | null, digits = 2) {
  return value === null || !Number.isFinite(value) ? "—" : value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatQuoteChange(value: number | null) {
  if (value === null || !Number.isFinite(value)) return { direction: "neutral" as const, prefix: "", text: "—" };
  if (value > 0) return { direction: "up" as const, prefix: "↑ +", text: formatQuoteNumber(value) };
  if (value < 0) return { direction: "down" as const, prefix: "↓ −", text: formatQuoteNumber(Math.abs(value)) };
  return { direction: "neutral" as const, prefix: "", text: formatQuoteNumber(value) };
}

export function formatEasternTime(timestamp: string | null) {
  if (!timestamp) return "Unavailable";
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(timestamp));
}
