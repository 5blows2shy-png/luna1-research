export type MarketSession = "pre-market" | "regular" | "after-hours" | "closed";

export type MarketSessionInfo = {
  session: MarketSession;
  nextOpen: Date | null;
  dateKey: string;
};

type EasternParts = { weekday: string; year: string; month: string; day: string; hour: number; minute: number };

const easternFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function easternParts(date: Date): EasternParts {
  const parts = easternFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { weekday: get("weekday"), year: get("year"), month: get("month"), day: get("day"), hour: Number(get("hour")), minute: Number(get("minute")) };
}

function sessionAt(date: Date, holidays: ReadonlySet<string>): MarketSession {
  const eastern = easternParts(date);
  const dateKey = `${eastern.year}-${eastern.month}-${eastern.day}`;
  if (eastern.weekday === "Sat" || eastern.weekday === "Sun" || holidays.has(dateKey)) return "closed";
  const minuteOfDay = eastern.hour * 60 + eastern.minute;
  if (minuteOfDay >= 4 * 60 && minuteOfDay < 9 * 60 + 30) return "pre-market";
  if (minuteOfDay >= 9 * 60 + 30 && minuteOfDay < 16 * 60) return "regular";
  if (minuteOfDay >= 16 * 60 && minuteOfDay < 20 * 60) return "after-hours";
  return "closed";
}

export function getMarketSession(date = new Date(), holidays: ReadonlySet<string> = new Set()): MarketSessionInfo {
  const eastern = easternParts(date);
  const session = sessionAt(date, holidays);
  let nextOpen: Date | null = null;
  if (session !== "regular") {
    const cursor = new Date(date.getTime() + 60_000);
    for (let minute = 0; minute < 8 * 24 * 60; minute += 1) {
      if (sessionAt(cursor, holidays) === "regular") { nextOpen = new Date(cursor); break; }
      cursor.setTime(cursor.getTime() + 60_000);
    }
  }
  return { session, nextOpen, dateKey: `${eastern.year}-${eastern.month}-${eastern.day}` };
}

export function marketRefreshInterval(session: MarketSession) {
  if (session === "regular") return 30_000;
  if (session === "pre-market" || session === "after-hours") return 60_000;
  return 5 * 60_000;
}

export function formatMarketCountdown(now: Date, info: MarketSessionInfo) {
  if (info.session === "regular" || !info.nextOpen) return null;
  const totalMinutes = Math.max(1, Math.ceil((info.nextOpen.getTime() - now.getTime()) / 60_000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const duration = days ? `${days}d ${hours}h` : hours ? `${hours}h ${minutes}m` : `${minutes}m`;
  if (info.session === "pre-market") return `Market opens in ${duration}`;
  const nextDay = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long" }).format(info.nextOpen);
  const today = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long" }).format(now);
  return nextDay === today ? `Opens in ${duration}` : `Opens ${nextDay} in ${duration}`;
}

export function isMarketDataStale(timestamp: string | null, session: MarketSession, dataType: string, now = new Date()) {
  if (!timestamp || dataType === "previous-close" && session === "closed") return false;
  const age = now.getTime() - new Date(timestamp).getTime();
  const threshold = session === "regular" ? 2 * 60_000 : 10 * 60_000;
  return Number.isFinite(age) && age > threshold;
}
