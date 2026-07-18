"use client";

import { useMemo, useState } from "react";
import { formatResearchDate } from "@/lib/date";
import type { ResearchNote } from "@/lib/research-content";

export function ResearchNotesFilter({ notes }: { notes: ResearchNote[] }) {
  const [category, setCategory] = useState("All");
  const [ticker, setTicker] = useState("All");
  const [theme, setTheme] = useState("All");
  const values = (key: "ticker" | "theme") =>
    [...new Set(notes.map((note) => note[key]).filter(Boolean))] as string[];
  const filtered = useMemo(
    () =>
      notes.filter(
        (note) =>
          (category === "All" || note.category === category) &&
          (ticker === "All" || note.ticker === ticker) &&
          (theme === "All" || note.theme === theme),
      ),
    [category, notes, theme, ticker],
  );

  return (
    <>
      <div className="note-filters">
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All</option>
            {[...new Set(notes.map((note) => note.category))].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Ticker
          <select
            value={ticker}
            onChange={(event) => setTicker(event.target.value)}
          >
            <option>All</option>
            {values("ticker").map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
          >
            <option>All</option>
            {values("theme").map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <span aria-live="polite">{filtered.length} notes</span>
      </div>
      <div className="research-note-list">
        {filtered.map((note) => (
          <article key={note.slug}>
            <div>
              <span className="eyebrow">
                {note.category}
                {note.ticker ? ` · ${note.ticker}` : ""}
              </span>
              <h2>{note.title}</h2>
              <p>{note.summary}</p>
            </div>
            <div className="note-meta">
              <span className="research-status research-status--draft">
                {note.status}
              </span>
              <time>{formatResearchDate(note.date)}</time>
              {note.theme && <small>{note.theme}</small>}
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="research-empty" role="status">
          No research notes match these filters.
        </div>
      )}
    </>
  );
}
