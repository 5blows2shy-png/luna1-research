"use client";
import { useState } from "react";
import { professionalInterests } from "@/data/global-finance/career";
import styles from "./global-finance.module.css";
export function RegionalInterests() {
  const [selected, setSelected] = useState(0);
  const region = professionalInterests[selected];
  return (
    <section
      className={styles.section}
      aria-labelledby="regional-interests-title"
    >
      <span className={styles.kicker}>Markets of professional interest</span>
      <h2 id="regional-interests-title">
        A global direction. A deliberate foundation.
      </h2>
      <p>
        These are markets where I’m interested in developing experience, not a
        record of countries where I have worked.
      </p>
      <div className={styles.grid}>
        <div>
          <svg
            className={styles.regionDiagram}
            viewBox="0 0 650 320"
            role="img"
            aria-label={`Professional-interest network highlighting ${region.name}. Conceptual diagram, not geographic coordinates or work history.`}
          >
            {professionalInterests.slice(1).map((r, i) => (
              <path
                key={r.name}
                d={`M 90 122 Q 260 ${15 + i * 45} ${r.x} ${r.y}`}
                fill="none"
                stroke={
                  selected === i + 1 ? "var(--accent-blue)" : "var(--line)"
                }
                strokeWidth="2"
              />
            ))}
            {professionalInterests.map((r, i) => (
              <g key={r.name}>
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={selected === i ? 12 : 7}
                  fill={selected === i ? "var(--accent-blue)" : "var(--muted)"}
                />
                <text
                  x={r.x}
                  y={r.y + 32}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                >
                  {
                    [
                      "United States",
                      "London",
                      "Europe",
                      "Middle East",
                      "Singapore",
                    ][i]
                  }
                </text>
              </g>
            ))}
          </svg>
          <div
            className={styles.regionButtons}
            aria-label="Select a market of professional interest"
          >
            {professionalInterests.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                aria-controls="regional-interest-detail"
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
        <article
          id="regional-interest-detail"
          className={styles.card}
          aria-live="polite"
        >
          <span className={styles.badge}>
            Professional interest · not work history
          </span>
          <h3>{region.name}</h3>
          <b>{region.center}</b>
          <p>{region.description}</p>
          <p className={styles.source}>
            Career direction supplied by Shy Lee. No international work
            experience is implied.
          </p>
        </article>
      </div>
    </section>
  );
}
