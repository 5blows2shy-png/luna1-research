import styles from "./global-finance.module.css";
export const amount = (n: number) =>
  n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
export const percent = (n: number) => `${(n * 100).toFixed(1)}%`;
export function BarChart({
  title,
  items,
  unit = "USD m",
}: {
  title: string;
  items: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);
  const diverging = items.some((i) => i.value < 0);
  return (
    <figure className={styles.chart}>
      <figcaption>
        {title}
        <small>{unit} · shared scale, zero baseline</small>
      </figcaption>
      <div className={styles.bars}>
        {items.map((item) => (
          <div key={item.label} className={styles.barRow}>
            <span>{item.label}</span>
            <div
              className={styles.track}
              data-diverging={diverging}
              aria-hidden="true"
            >
              <i
                style={{
                  width: `${(Math.abs(item.value) / max) * (diverging ? 50 : 100)}%`,
                  marginLeft: diverging
                    ? `${item.value < 0 ? 50 - (Math.abs(item.value) / max) * 50 : 50}%`
                    : undefined,
                  background:
                    item.value < 0
                      ? "var(--accent-orange)"
                      : "var(--accent-blue)",
                }}
              />
            </div>
            <b>{amount(item.value)}</b>
          </div>
        ))}
      </div>
    </figure>
  );
}
export function SensitivityChart({
  points,
}: {
  points: { x: number; y: number }[];
}) {
  const max = Math.max(...points.map((p) => Math.abs(p.y)), 1);
  const x = (v: number) => 45 + (v + 10) * 20;
  const y = (v: number) => 112 - (v / max) * 75;
  return (
    <figure className={styles.chart}>
      <figcaption>
        FX sensitivity<small>Estimated operating income impact · USD m</small>
      </figcaption>
      <svg
        viewBox="0 0 490 240"
        role="img"
        aria-label={`FX sensitivity: ${points.map((p) => `${p.x}% currency move gives ${amount(p.y)} million dollars`).join("; ")}`}
      >
        <line x1="45" x2="445" y1="112" y2="112" stroke="var(--muted)" />
        <line x1="245" x2="245" y1="22" y2="202" stroke="var(--line)" />
        <text x="5" y="35" fill="currentColor" fontSize="12">
          {amount(max)}
        </text>
        <text x="5" y="200" fill="currentColor" fontSize="12">
          −{amount(max)}
        </text>
        <polyline
          points={points.map((p) => `${x(p.x)},${y(p.y)}`).join(" ")}
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="3"
        />
        {points.map((p) => (
          <g key={p.x}>
            <circle cx={x(p.x)} cy={y(p.y)} r="5" fill="var(--accent-blue)" />
            <text
              x={x(p.x)}
              y="227"
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {p.x > 0 ? "+" : ""}
              {p.x}%
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
export function ResearchChain() {
  return (
    <ol className={styles.chain} aria-label="Global research framework">
      {[
        "Global trend",
        "Capital movement",
        "Country / region",
        "Industry",
        "Bottleneck",
        "Company",
        "Financial impact",
        "Finance decision",
      ].map((label, i) => (
        <li key={label}>
          <small>{String(i + 1).padStart(2, "0")}</small>
          <b>{label}</b>
          <span aria-hidden="true">→</span>
        </li>
      ))}
    </ol>
  );
}
export function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className={styles.metric}>
      <small>{label}</small>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </div>
  );
}
