"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { mistakeJournalEntries } from "@/lib/mistake-journal-data";
import {
  calculateMistakeJournalSummary,
  filterMistakeJournalEntries,
  initialMistakeJournalFilters,
  type MistakeJournalEntry,
  type MistakeJournalFilters,
} from "@/lib/mistake-journal";

const classificationOptions = [
  "All",
  "Failed Thesis",
  "Early Exit",
  "Poor Entry",
  "Position Sizing",
  "Risk Management",
  "Emotional Decision",
  "Process Violation",
];
const outcomeOptions = ["All", "Gain", "Loss", "Breakeven", "Open"];
const thesisOptions = ["All", "Intact at Exit", "Weakened", "Invalidated", "Uncertain"];
const qualityOptions = ["All", "Poor", "Moderate", "Strong"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value?: string) {
  return value ? dateFormatter.format(new Date(`${value}T00:00:00Z`)) : "Open";
}

function JournalFilter({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: keyof MistakeJournalFilters;
  value: string;
  options: string[];
  onChange: (name: keyof MistakeJournalFilters, value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(name, event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ReviewList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ReviewDrawer({ entry, onClose }: { entry: MistakeJournalEntry; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const classifications = [entry.classification, ...(entry.secondaryClassifications ?? [])];

  return (
    <div className="review-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside
        className="review-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        aria-describedby="review-description"
      >
        <header>
          <div>
            <span className="eyebrow">Decision Review · {entry.lastUpdated}</span>
            <h2 id="review-title">{entry.ticker} · {entry.companyName}</h2>
            <p id="review-description">A structured audit of thesis quality, execution, and process discipline.</p>
          </div>
          <button ref={closeButtonRef} className="drawer-close" onClick={onClose} aria-label="Close JBL decision review">×</button>
        </header>

        <div className="review-meta" aria-label="Decision review summary">
          <div><small>Classification</small><strong>{classifications.join(" · ")}</strong></div>
          <div><small>Outcome</small><strong>{entry.outcome ?? "Not recorded"}</strong></div>
          <div><small>Thesis status</small><strong>{entry.thesisStatus}</strong></div>
          <div><small>Emotional discipline</small><strong>{entry.emotionalDiscipline}</strong></div>
        </div>

        <div className="review-sections">
          <article><span>01</span><div><h3>Original Thesis</h3><p>{entry.originalThesis}</p></div></article>
          <article><span>02</span><div><h3>What Happened?</h3><p>{entry.whatHappened}</p></div></article>
          <article><span>03</span><div><h3>What Mistakes Did I Make?</h3><ReviewList items={entry.mistakes}/></div></article>
          <article><span>04</span><div><h3>What Did I Learn?</h3><ReviewList items={entry.lessons}/></div></article>
          <article><span>05</span><div><h3>What Opportunities Did I Miss?</h3><ReviewList items={entry.missedOpportunities}/></div></article>
          <article><span>06</span><div><h3>Process Changes</h3><ReviewList items={entry.processChanges}/></div></article>
          <article><span>07</span><div><h3>Final Assessment</h3><p>{entry.finalAssessment}</p></div></article>
        </div>

        <section className="before-after" aria-labelledby="before-after-heading">
          <span className="eyebrow">Framework Updated</span>
          <h3 id="before-after-heading">Before Rule / After Rule</h3>
          <div>
            <article><small>Before Rule</small><p>Exit when price action creates concern about a possible structural break.</p></article>
            <article><small>Observed Failure</small><p>Intraday volatility prompted a full exit while the thesis and broader structure remained intact.</p></article>
            <article><small>After Rule</small><p>Require a daily-close confirmation and a fundamental review before a full exit, absent emergency portfolio risk.</p></article>
          </div>
        </section>
      </aside>
    </div>
  );
}

export function MistakeJournal() {
  const [filters, setFilters] = useState(initialMistakeJournalFilters);
  const [selectedEntry, setSelectedEntry] = useState<MistakeJournalEntry | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const summary = useMemo(() => calculateMistakeJournalSummary(mistakeJournalEntries), []);
  const filteredEntries = useMemo(
    () => filterMistakeJournalEntries(mistakeJournalEntries, filters),
    [filters],
  );
  const years = ["All", ...new Set(mistakeJournalEntries.map((entry) =>
    (entry.exitDate ?? entry.entryDate).slice(0, 4),
  ))];

  function updateFilter(name: keyof MistakeJournalFilters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function openReview(entry: MistakeJournalEntry, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelectedEntry(entry);
  }

  function closeReview() {
    setSelectedEntry(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  const summaryCards = [
    ["Total reviewed decisions", summary.totalReviewedDecisions],
    ["Failed theses", summary.failedTheses],
    ["Early exits", summary.earlyExits],
    ["Process violations", summary.processViolations],
    ["Most common mistake", summary.mostCommonMistake],
    ["Process changes adopted", summary.processChangesAdopted],
  ];

  return (
    <div className="journal">
      <div className="journal-intro">
        <span className="eyebrow">Process Audit</span>
        <h2>Decision quality, reviewed without hindsight bias.</h2>
        <p>“The Mistake Journal documents errors in thesis development, execution, position sizing, risk management, and emotional discipline. Its purpose is to improve the investment process through transparent, evidence-based review.”</p>
        <small>Past results do not predict future performance. Reviews are educational and are not personalized investment advice.</small>
      </div>

      <div className="journal-summary" aria-label="Mistake Journal summary">
        {summaryCards.map(([label, value]) => (
          <div key={label}><small>{label}</small><strong>{value}</strong></div>
        ))}
      </div>

      <div className="journal-filters" aria-label="Filter decision reviews">
        <JournalFilter label="Classification" name="classification" value={filters.classification} options={classificationOptions} onChange={updateFilter}/>
        <JournalFilter label="Outcome" name="outcome" value={filters.outcome} options={outcomeOptions} onChange={updateFilter}/>
        <JournalFilter label="Thesis status" name="thesisStatus" value={filters.thesisStatus} options={thesisOptions} onChange={updateFilter}/>
        <JournalFilter label="Entry quality" name="entryQuality" value={filters.entryQuality} options={qualityOptions} onChange={updateFilter}/>
        <JournalFilter label="Exit quality" name="exitQuality" value={filters.exitQuality} options={qualityOptions} onChange={updateFilter}/>
        <JournalFilter label="Year" name="year" value={filters.year} options={years} onChange={updateFilter}/>
        <button className="button" type="button" onClick={() => setFilters(initialMistakeJournalFilters)}>Reset filters</button>
      </div>

      {filteredEntries.length ? (
        <div className="table-wrap journal-table-wrap">
          <table className="journal-table">
            <caption>{filteredEntries.length} reviewed decision{filteredEntries.length === 1 ? "" : "s"} · public journal is read-only</caption>
            <thead><tr><th>Ticker</th><th>Entry date</th><th>Exit date</th><th>Classification</th><th>Outcome</th><th>Thesis status at exit</th><th>Entry quality</th><th>Exit quality</th><th>Primary lesson</th><th><span className="sr-only">Review action</span></th></tr></thead>
            <tbody>{filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td data-label="Ticker"><b className="portfolio-ticker">{entry.ticker}</b><small className="company-under">{entry.companyName}</small></td>
                <td data-label="Entry date">{formatDate(entry.entryDate)}</td>
                <td data-label="Exit date">{formatDate(entry.exitDate)}</td>
                <td data-label="Classification">{[entry.classification, ...(entry.secondaryClassifications ?? [])].join(" · ")}</td>
                <td data-label="Outcome"><span className="status" data-status={entry.outcome?.toLowerCase().replaceAll(" ", "-")}>{entry.outcome}</span></td>
                <td data-label="Thesis status">{entry.thesisStatus}</td>
                <td data-label="Entry quality">{entry.entryQuality}</td>
                <td data-label="Exit quality">{entry.exitQuality}</td>
                <td data-label="Primary lesson" className="journal-lesson">{entry.lessons[0]}</td>
                <td data-label="Decision review"><button className="review-button" type="button" onClick={(event) => openReview(entry, event.currentTarget)}>View Review</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="empty-portfolio" role="status">
          <span className="eyebrow">No matching reviews</span>
          <h2>The current filters returned no decisions.</h2>
          <p>Reset the filters to return to the complete Mistake Journal.</p>
          <button className="button" type="button" onClick={() => setFilters(initialMistakeJournalFilters)}>Reset filters</button>
        </div>
      )}

      {selectedEntry && <ReviewDrawer entry={selectedEntry} onClose={closeReview}/>}
    </div>
  );
}
