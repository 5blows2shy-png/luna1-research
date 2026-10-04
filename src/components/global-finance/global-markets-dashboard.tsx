"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MarketQuote, MarketQuotesApiResponse } from "@/lib/market-data";
import { globalMarketGroups, globalMarketInstruments, globalMarketSymbols } from "@/lib/global-finance/market-dashboard";
import styles from "./global-finance.module.css";

type DashboardQuote = Omit<MarketQuote, "name" | "dataType">;
type DashboardState = { quotes: Map<string, DashboardQuote>; updatedAt: string | null; dataType: MarketQuotesApiResponse["dataType"]; status: "loading" | "ok" | "partial" | "unavailable"; message?: string };
const initialState: DashboardState = { quotes: new Map(), updatedAt: null, dataType: undefined, status: "loading" };

function isResponse(value: unknown): value is MarketQuotesApiResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.status === "string" && Array.isArray(record.quotes);
}

function formatPrice(value: number, decimals = 2, currency = "") {
  const formatted = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  return currency === "USD" ? `$${formatted}` : formatted;
}

function formatTimestamp(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "No verified update";
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(value));
}

export function GlobalMarketsDashboard() {
  const [state, setState] = useState<DashboardState>(initialState);
  const [paused, setPaused] = useState(false);
  const query = useMemo(() => encodeURIComponent(globalMarketSymbols.join(",")), []);

  const refresh = useCallback(async () => {
    if (document.visibilityState === "hidden") return;
    try {
      const response = await fetch(`/api/market-quotes?symbols=${query}`, { cache: "no-store" });
      const payload: unknown = await response.json();
      if (!isResponse(payload) || !response.ok && payload.status !== "partial") throw new Error("GLOBAL_MARKETS_UNAVAILABLE");
      setState((current) => {
        const quotes = new Map(current.quotes);
        for (const quote of payload.quotes) quotes.set(quote.symbol, quote);
        const hasQuotes = quotes.size > 0;
        return { quotes, updatedAt: payload.lastUpdated ?? current.updatedAt, dataType: payload.dataType ?? current.dataType, status: payload.status === "success" ? "ok" : hasQuotes ? "partial" : "unavailable", ...(payload.message ? { message: payload.message } : {}) };
      });
    } catch {
      setState((current) => ({ ...current, status: current.quotes.size ? "partial" : "unavailable", message: current.quotes.size ? "Update unavailable · Last verified values retained" : "Global market data is temporarily unavailable." }));
    }
  }, [query]);

  useEffect(() => {
    if (paused) return;
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), 5 * 60_000);
    const onVisibility = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisibility); };
  }, [paused, refresh]);

  return (
    <section id="global-markets" className={styles.marketDashboard} aria-labelledby="global-markets-title">
      <div className={styles.marketHeader}>
        <div>
          <span className={styles.kicker}>Financial Modeling Prep · Latest available</span>
          <h2 id="global-markets-title">Global Markets Briefing</h2>
          <p>Regional risk assets, currencies, real assets, and duration in one institutional market view.</p>
        </div>
        <div className={styles.marketControls}>
          <span className={styles.marketState} data-status={state.status}>{state.status === "loading" ? "Loading" : state.status === "ok" ? "Connected" : state.status === "partial" ? "Partial data" : "Data unavailable"}</span>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? "Resume updates" : "Pause updates"}</button>
          <button type="button" onClick={() => void refresh()}>Refresh</button>
        </div>
      </div>
      {state.message ? <p className={styles.marketMessage} role="status">{state.message}</p> : null}
      <div className={styles.marketGroups} aria-live="polite">
        {globalMarketGroups.map((group) => (
          <section key={group.id} className={styles.marketGroup} aria-labelledby={`global-market-${group.id}`}>
            <header><h3 id={`global-market-${group.id}`}>{group.label}</h3><p>{group.description}</p></header>
            <div className={styles.marketRows}>
              {globalMarketInstruments.filter(({ group: id }) => id === group.id).map((instrument) => {
                const quote = state.quotes.get(instrument.symbol);
                const direction = quote?.changePercent != null && quote.changePercent > 0 ? "up" : quote?.changePercent != null && quote.changePercent < 0 ? "down" : "flat";
                return <article key={instrument.symbol} className={styles.marketRow} data-direction={direction}>
                  <div><strong>{instrument.label}</strong><small>{instrument.symbol} · {instrument.context}{instrument.proxy ? " · Proxy" : ""}</small></div>
                  <div className={styles.marketValue}>{quote?.price == null ? <strong>—</strong> : <strong>{formatPrice(quote.price, instrument.decimals, group.id === "fx" ? "" : quote.currency)}</strong>}<small>{quote?.changePercent == null ? "Change unavailable" : `${quote.changePercent > 0 ? "↑" : quote.changePercent < 0 ? "↓" : "—"} ${Math.abs(quote.changePercent).toFixed(2)}%`}</small></div>
                </article>;
              })}
            </div>
          </section>
        ))}
      </div>
      <footer className={styles.marketFooter}>
        <span>{paused ? "Automatic updates paused" : `Refreshes every 5 minutes · ${state.dataType === "previous-close" ? "Previous close" : state.dataType === "delayed" ? "Delayed data" : state.dataType === "real-time" ? "Real-time where licensed" : "Availability varies by instrument"}`}</span>
        <time dateTime={state.updatedAt ?? undefined}>Updated {formatTimestamp(state.updatedAt)}</time>
      </footer>
      <p className={styles.source}>Market data may be delayed and is provided for informational and educational purposes. ETF and fund observations are labeled as proxies. Luna1 does not guarantee accuracy or completeness and does not present this dashboard as investment advice.</p>
    </section>
  );
}
