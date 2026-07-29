"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatResearchDate } from "@/lib/date";
import {
  type DevelopmentCategory,
  type DevelopmentFeatureStatus,
  type DevelopmentLogEntry,
  type DevelopmentStatus,
} from "@/lib/development-log";

const featureStatusClass: Record<DevelopmentFeatureStatus, string> = {
  Planned: "planned",
  Preview: "draft",
  "In Development": "in-progress",
};

export function DevelopmentLogFilter({
  entries,
}: {
  entries: DevelopmentLogEntry[];
}) {
  const [category, setCategory] = useState<DevelopmentCategory | "All">("All");
  const [status, setStatus] = useState<DevelopmentStatus | "All">("All");
  const categories = [...new Set(entries.map((entry) => entry.category))];
  const statuses = [...new Set(entries.map((entry) => entry.status))];
  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (category === "All" || entry.category === category) &&
          (status === "All" || entry.status === status),
      ),
    [category, entries, status],
  );

  return (
    <>
      <div className="development-filters">
        <label>
          Category
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as DevelopmentCategory | "All")
            }
          >
            <option>All</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as DevelopmentStatus | "All")
            }
          >
            <option>All</option>
            {statuses.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <span aria-live="polite">{filtered.length} entries</span>
      </div>
      <div className="development-timeline">
        {filtered.map((entry, index) => (
          <article key={entry.id} className="development-entry">
            <div className="development-marker">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </div>
            <div className="development-copy">
              <header>
                <div>
                  <span className="eyebrow">
                    {entry.phase} · {entry.category}
                  </span>
                  <h2>{entry.title}</h2>
                </div>
                <div className="development-meta">
                  <time>{formatResearchDate(entry.date)}</time>
                  <span
                    className={`research-status research-status--${entry.status.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {entry.status}
                  </span>
                </div>
              </header>
              <p className="development-summary">{entry.summary}</p>
              <dl>
                <div>
                  <dt>Why it changed</dt>
                  <dd>{entry.reason}</dd>
                </div>
                <div>
                  <dt>Impact</dt>
                  <dd>{entry.impact}</dd>
                </div>
              </dl>
              <div className="development-detail">
                <div>
                  <h3>Lessons</h3>
                  <ul>
                    {entry.lessons.map((lesson) => (
                      <li key={lesson}>{lesson}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Skills applied</h3>
                  <p>{entry.skills.join(" · ")}</p>
                </div>
              </div>
              {entry.overview && (
                <div className="development-extension">
                  <section
                    className="development-overview"
                    aria-labelledby={`${entry.id}-overview`}
                  >
                    <h3 id={`${entry.id}-overview`}>Overview</h3>
                    {entry.overview.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                  {entry.evolutionStatement && (
                    <blockquote className="development-evolution">
                      <p>{entry.evolutionStatement}</p>
                    </blockquote>
                  )}
                  {entry.featurePreview && (
                    <section
                      className="development-preview"
                      aria-labelledby={`${entry.id}-features`}
                    >
                      <header>
                        <div>
                          <span className="eyebrow">Feature preview</span>
                          <h3 id={`${entry.id}-features`}>
                            Accounting &amp; Transaction Intelligence roadmap
                          </h3>
                        </div>
                        <span className="research-status research-status--in-progress">
                          In Development
                        </span>
                      </header>
                      <ul>
                        {entry.featurePreview.map((feature) => (
                          <li key={feature.label}>
                            <strong>{feature.label}</strong>
                            <span
                              className={`research-status research-status--${featureStatusClass[feature.status]}`}
                            >
                              {feature.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="development-preview-action">
                        {entry.route ? (
                          <Link className="button" href={entry.route}>
                            View Accounting Intelligence Preview
                          </Link>
                        ) : (
                          <>
                            <button className="button" type="button" disabled>
                              Preview Coming Soon
                            </button>
                            <span className="research-status research-status--in-progress">
                              In Development
                            </span>
                          </>
                        )}
                      </div>
                    </section>
                  )}
                  <div className="development-plan">
                    {entry.milestones && (
                      <section aria-labelledby={`${entry.id}-milestones`}>
                        <h3 id={`${entry.id}-milestones`}>Key Milestones</h3>
                        <ul>
                          {entry.milestones.map((milestone) => (
                            <li key={milestone}>{milestone}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {entry.nextSteps && (
                      <section aria-labelledby={`${entry.id}-next-steps`}>
                        <h3 id={`${entry.id}-next-steps`}>Next Steps</h3>
                        <ul>
                          {entry.nextSteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                  {entry.projectOrigin && (
                    <section
                      className="development-origin"
                      aria-labelledby={`${entry.id}-origin`}
                    >
                      <h3 id={`${entry.id}-origin`}>Project Origin</h3>
                      <p>{entry.projectOrigin}</p>
                    </section>
                  )}
                  {entry.disclosure && (
                    <small className="development-disclosure">
                      {entry.disclosure}
                    </small>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="research-empty" role="status">
          No development entries match these filters.
        </div>
      )}
    </>
  );
}
