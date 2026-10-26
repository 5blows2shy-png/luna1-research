import type { ReactNode } from "react";
import styles from "./project.module.css";
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const percent = (value: number | null) => value === null ? "N/A" : `${(value * 100).toFixed(1)}%`;
export function Metrics({ items }: { items: [string, string][] }) {
  return <dl className={styles.kpis}>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
export function FinancialTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: (string | number)[][] }) {
  return <div className={styles.table} role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function ProjectSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2>{children}</section>;
}
/** Accessible chart supplemented by the full financial table, including negative values. */
export function TrendChart({ title, labels, series }: { title: string; labels: string[]; series: { name: string; values: number[]; color: string }[] }) {
  const values = series.flatMap(s => s.values);
  const low = Math.min(0, ...values), high = Math.max(1, ...values);
  const y = (value: number) => 185 - (value - low) / (high - low) * 145;
  const x = (i: number) => 75 + i / Math.max(1, labels.length - 1) * 630;
  return <figure style={{ margin: 0 }}><figcaption>{title}</figcaption><svg className={styles.chart} viewBox="0 0 750 245" role="img" aria-label={`${title}. Exact values appear in the accompanying table.`}>
    <line x1="75" y1={y(0)} x2="705" y2={y(0)} stroke="currentColor" opacity=".35" />
    <text x="0" y="36">${(high / 1e6).toFixed(2)}M</text><text x="0" y="190">${(low / 1e6).toFixed(2)}M</text>
    {series.map((s, index) => <g key={s.name}><polyline fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={index ? "6 4" : undefined} points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />{s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.color} />)}<line x1={75 + index * 225} y1="234" x2={95 + index * 225} y2="234" stroke={s.color} strokeWidth="2" strokeDasharray={index ? "6 4" : undefined} /><text x={102 + index * 225} y="238">{s.name}</text></g>)}
    {labels.map((label, i) => (i === 0 || i === labels.length - 1 || i % Math.max(1, Math.ceil(labels.length / 6)) === 0) && <text key={i} x={x(i)} y="212" textAnchor="middle">{label}</text>)}
  </svg></figure>;
}
