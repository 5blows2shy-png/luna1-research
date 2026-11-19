import { ChartMotion } from './chart-motion';
import styles from './infographics.module.css';
/** Common zero origin for comparable nonnegative amounts; exact values stay visible. */
export function ValueBars({ title, items }: { title: string; items: { label: string; value: number; display: string }[] }) {
  const max = Math.max(1, ...items.map(item => item.value));
  return <ChartMotion key={JSON.stringify(items)}><figure className={styles.bars}><figcaption>{title}</figcaption><dl>{items.map(item => <div key={item.label}><dt><span>{item.label}</span><strong>{item.display}</strong></dt><dd><div className={styles.track} aria-hidden="true"><div className={styles.bar} style={{ width: `${Math.max(0,item.value) / max * 100}%` }}/></div></dd></div>)}</dl></figure></ChartMotion>;
}
export function ScenarioCards({ items }: { items: { name: string; metrics: [string, string][]; note?: string }[] }) {
  return <ChartMotion key={JSON.stringify(items)}><div className={styles.cards}>{items.map(item => <article key={item.name} className={styles.card}><h3>{item.name}</h3><dl>{item.metrics.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{item.note && <p>{item.note}</p>}</article>)}</div></ChartMotion>;
}
