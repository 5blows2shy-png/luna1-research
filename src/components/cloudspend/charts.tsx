'use client';
import { useState } from 'react';
import styles from './cloudspend.module.css';
export const usd = (n: number | null, digits = 0) => n === null ? 'Not available' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(n);
export const pct = (n: number | null) => n === null ? 'Not available' : `${(n * 100).toFixed(1)}%`;
export function Bars({ items, currency = true }: { items: { name: string; cost: number }[]; currency?: boolean }) {
  const max = Math.max(1, ...items.map(i => Math.abs(i.cost)));
  return <div className={styles.bars}>{items.map((item, i) => <div key={item.name}><div><span><i style={{ background: ['#dbc18c', '#7baee3', '#85c5b2', '#b4a5df'][i % 4] }}/>{item.name}{item.cost < 0 && ' (credit)'}</span><strong>{currency ? usd(item.cost) : `${item.cost.toFixed(1)}%`}</strong></div><div className={styles.track} aria-hidden="true"><span style={{ width: `${Math.abs(item.cost) / max * 100}%`, background: item.cost < 0 ? '#efaa91' : ['#dbc18c', '#7baee3', '#85c5b2', '#b4a5df'][i % 4] }}/></div></div>)}</div>;
}
/** Buttons provide the same chart exploration to keyboard and touch users as hover. */
export function SpendChart({ points, label, unit = 'USD' }: { points: { label: string; actual: number; comparison?: number }[]; label: string; unit?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const chosen = points[Math.min(active ?? points.length - 1, points.length - 1)];
  if (!points.length) return <p>No observations for this selection.</p>;
  const low = Math.min(0, ...points.flatMap(p => [p.actual, p.comparison ?? 0]));
  const high = Math.max(1, ...points.flatMap(p => [p.actual, p.comparison ?? 0]));
  const x = (i: number) => 56 + i * 590 / Math.max(1, points.length - 1);
  const y = (v: number) => 196 - (v - low) / (high - low) * 157;
  const format = (v: number) => unit === 'USD' ? usd(v) : `${v.toFixed(1)}%`;
  return <figure className={styles.chart}><figcaption>{label}<span>{chosen.label} · <strong>{format(chosen.actual)}</strong>{chosen.comparison !== undefined && ` / comparison ${format(chosen.comparison)}`}</span></figcaption>
    <svg viewBox="0 0 680 230" role="img" aria-label={`${label}. Select an observation below to inspect exact values.`}>
      {[0, .5, 1].map(f => { const value = low + (high - low) * f; return <g key={f}><line x1="56" x2="646" y1={y(value)} y2={y(value)} stroke="#324054" strokeDasharray="3 5"/><text x="0" y={y(value) + 4}>{unit === 'USD' ? `${Math.round(value / 1000)}k` : `${Math.round(value)}%`}</text></g>; })}
      <path d={`M ${x(0)} ${y(0)} L ${points.map((p, i) => `${x(i)} ${y(p.actual)}`).join(' L ')} L ${x(points.length - 1)} ${y(0)} Z`} fill="#dbc18c" opacity=".08"/>
      {points.some(p => p.comparison !== undefined) && <polyline points={points.map((p, i) => `${x(i)},${y(p.comparison ?? 0)}`).join(' ')} fill="none" stroke="#7baee3" strokeWidth="2" strokeDasharray="5 5"/>}
      <polyline className={styles.draw} points={points.map((p, i) => `${x(i)},${y(p.actual)}`).join(' ')} fill="none" stroke="#dbc18c" strokeWidth="3"/>
      {points.map((p, i) => <g key={p.label} onMouseEnter={() => setActive(i)}><circle cx={x(i)} cy={y(p.actual)} r="12" fill="transparent"/><circle cx={x(i)} cy={y(p.actual)} r={p === chosen ? 5 : 3} fill="#dbc18c"/>{(i === 0 || i === points.length - 1 || points.length <= 6) && <text x={x(i)} y="222" textAnchor="middle">{p.label}</text>}</g>)}
    </svg>
    <div className={styles.observations} aria-label={`${label} observations`}>{points.map((p, i) => <button key={p.label} type="button" aria-pressed={p === chosen} onClick={() => setActive(i)}>{p.label}</button>)}</div>
  </figure>;
}
