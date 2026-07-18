"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Score } from "@/components/site";
import type { ResearchReport } from "@/lib/data";

export function ExistingResearchFilter({
  reports,
}: {
  reports: ResearchReport[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const rows = useMemo(
    () =>
      reports.filter(
        (report) =>
          (status === "All" || report.status === status) &&
          `${report.ticker} ${report.company} ${report.industry} ${report.theme}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, reports, status],
  );

  return (
    <>
      <div className="filters">
        <label>
          Search existing research
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ticker, company, industry, theme…"
          />
        </label>
        <label>
          Research status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Monitoring</option>
            <option>Watchlist</option>
          </select>
        </label>
        <span aria-live="polite">{rows.length} reports</span>
      </div>
      {rows.length ? (
        <div className="research-list">
          {rows.map((report) => (
            <Link
              href={`/research/${report.ticker.toLowerCase()}`}
              key={report.ticker}
              className="research-row"
            >
              <div>
                <span className="ticker">{report.ticker}</span>
                <small>
                  {report.company} · {report.industry}
                </small>
              </div>
              <p>{report.summary}</p>
              <div className="row-tag">
                <span>{report.classification}</span>
                <small>{report.status}</small>
              </div>
              <Score score={report.score} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="research-empty" role="status">
          No archived reports match these filters.
        </div>
      )}
    </>
  );
}
