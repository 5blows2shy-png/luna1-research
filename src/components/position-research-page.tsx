import Link from "next/link";
import { SectionHeading } from "@/components/site";
import type { ActivePosition } from "@/data/portfolio/active-positions";
import type { PositionResearchRecord, PositionResearchSeries } from "@/data/portfolio/position-research";

function EvidenceChart({ series }: { series: PositionResearchSeries }) {
  const min = Math.min(...series.values);
  const range = Math.max(...series.values) - min || 1;
  const point = (value: number, index: number) => ({ x: series.values.length === 1 ? 50 : (index / (series.values.length - 1)) * 100, y: 82 - ((value - min) / range) * 62 });
  const points = series.values.map((value, index) => { const { x, y } = point(value, index); return `${x},${y}`; }).join(" ");
  return <article className="krys-progression-card">
    <header><h3>{series.label}</h3><strong>{series.values.at(-1)?.toFixed(2).replace(/\.00$/, "")}</strong></header>
    <svg viewBox="0 0 100 100" role="img" aria-label={`${series.label} progression`}><polyline points={points} vectorEffect="non-scaling-stroke" />{series.values.map((value, index) => { const { x, y } = point(value, index); return <circle cx={x} cy={y} key={`${series.label}-${series.periods[index]}`} r="1.8" />; })}</svg>
    <div className="position-research-periods" style={{ gridTemplateColumns: `repeat(${series.periods.length}, minmax(0, 1fr))` }} aria-hidden="true">{series.periods.map((period) => <span key={period}>{period}</span>)}</div>
    <p>{series.note} <a href={`#source-${series.sourceId}`}>Source ↘</a></p>
  </article>;
}

export function PositionResearchPage({ position, research }: { position: ActivePosition; research: PositionResearchRecord }) {
  return <>
    <section className="krys-hero"><Link className="text-link" href="/portfolio">← Portfolio Lab</Link><div className="krys-hero-grid"><div><span className="eyebrow">Active Position · Last Updated {research.lastUpdated}</span><h1>{research.ticker}</h1><h2>{research.company}</h2><div className="topic-strip">{research.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div><aside><span className="status" data-status="active-position">Active Position</span><dl><div><dt>Position type</dt><dd>{position.positionType}</dd></div><div><dt>Classification</dt><dd>{research.classification}</dd></div><div><dt>LUNA classification</dt><dd>{research.lunaClassification}</dd></div></dl></aside></div></section>
    <section><SectionHeading eyebrow="Position Thesis" title={research.headline} />{research.thesis.map((paragraph) => <p className="krys-lead" key={paragraph}>{paragraph}</p>)}</section>
    <section><SectionHeading eyebrow="Key Fundamentals" title="Reported evidence before interpretation." /><div className="krys-metric-grid">{research.metrics.map((metric) => <article key={metric.label}><small>{metric.label}</small><strong>{metric.value}</strong><span className="data-label">{metric.type}</span><p>{metric.note}</p><a href={`#source-${metric.sourceId}`}>Source ↘</a></article>)}</div></section>
    <section><SectionHeading eyebrow="Margins and Operating Progression" title="Direction, definition, and source all matter." /><div className="krys-progression-grid">{research.marginSeries.map((series) => <EvidenceChart key={series.label} series={series} />)}</div><p className="data-method-note">Values are reported or calculated from the cited company materials. Company-defined supplemental measures are not GAAP, may change with portfolio composition, and may not be comparable with similarly named measures at other companies.</p></section>
    <section><SectionHeading eyebrow="Operating Evidence" title={research.operatingHeadline} /><div className="krys-commercial-grid">{research.operatingEvidence.map((item) => <article key={item.label}><small>{item.label}</small><strong>{item.value}</strong><p>{item.note}</p><a href={`#source-${item.sourceId}`}>Source ↘</a></article>)}</div></section>
    <section><SectionHeading eyebrow="Luna1 Insight" title="What the evidence does—and does not—show." /><div className="krys-insights">{research.insight.map((item) => <blockquote key={item}>{item}</blockquote>)}</div></section>
    <section><SectionHeading eyebrow="Competitive Position" title="Potential advantages that still require monitoring." /><div className="krys-moat-grid">{research.advantages.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section><SectionHeading eyebrow="Growth Drivers" title="The evidence required for compounding." /><ul className="krys-driver-list">{research.drivers.map((driver) => <li key={driver}>{driver}</li>)}</ul></section>
    <section><SectionHeading eyebrow="What I Am Watching" title="A monitoring dashboard for thesis accountability." /><div className="krys-monitor-grid">{research.monitoring.map(([title, question]) => <article key={title}><h3>{title}</h3><p>{question}</p></article>)}</div></section>
    <section><SectionHeading eyebrow="Thesis Invalidation" title="What would materially weaken the case." /><div className="krys-invalidation"><p>{position.thesisInvalidation}</p></div></section>
    <section><SectionHeading eyebrow="Sources & Data Integrity" title="Reported facts remain separate from interpretation." /><div className="krys-source-list">{research.sources.map((source, index) => <article id={`source-${source.id}`} key={source.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{source.title}</h3><p>{source.publisher} · {source.date} · {source.period}</p><a href={source.url} target="_blank" rel="noreferrer">Open primary source ↗</a></div></article>)}</div><div className="research-disclaimer">This position research is for educational and informational purposes only. It reflects personal analysis and opinions and is not investment, financial, tax, or legal advice. Calculations should be independently reproduced before use.</div></section>
  </>;
}
