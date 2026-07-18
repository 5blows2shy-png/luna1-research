import { notFound } from "next/navigation";
import { ResearchDisclaimer } from "@/components/research-ui";
import { PageHeader, Score, SectionHeading } from "@/components/site";
import { research } from "@/lib/data";

export function generateStaticParams() {
  return research.map((report) => ({ slug: report.ticker.toLowerCase() }));
}

export default async function Report({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = research.find((item) => item.ticker.toLowerCase() === slug);
  if (!report) notFound();

  const sections = [
    [
      "What the Company Does",
      `${report.company} is presented here as a sample company profile for demonstrating Luna1’s research structure.`,
    ],
    [
      "Revenue Model",
      "Illustrative review of revenue drivers, customer mix, recurrence, and unit economics.",
    ],
    [
      "Industry Position",
      `The ${report.industry} landscape is assessed through market structure, bottlenecks, and relative positioning.`,
    ],
    [
      "Moat",
      "Switching costs, differentiation, customer dependence, and durability require source-grounded validation.",
    ],
    [
      "Management",
      "Capital allocation, communication quality, and execution history are core diligence areas.",
    ],
    [
      "Earnings and Revenue Trend",
      "Quarterly acceleration, estimate revisions, and historical comparisons belong here once verified.",
    ],
    [
      "Margins and Cash Flow",
      "The framework separates gross margin, operating leverage, and free-cash-flow conversion.",
    ],
    [
      "Balance Sheet",
      "Liquidity, leverage, obligations, and capital requirements shape downside resilience.",
    ],
    [
      "Institutional Ownership",
      "Ownership trends and volume behavior can indicate informed demand, but do not replace fundamental work.",
    ],
    ["Catalysts", report.catalyst],
    ["Risks", report.risk],
    [
      "Technical Structure",
      "Stage, base quality, relative strength, volume, and extension inform timing—not business quality.",
    ],
    [
      "Valuation",
      "Expectations should be tested with multiple methods and explicit scenarios.",
    ],
    [
      "Bull, Base, and Bear Case",
      "Scenario analysis should identify operating assumptions, implied expectations, and asymmetric outcomes.",
    ],
    [
      "Thesis Invalidation",
      "The thesis changes when primary evidence contradicts its core operating or technical assumptions.",
    ],
    [
      "Sources",
      "Company filings, earnings materials, transcripts, and industry sources will be linked as reports are completed.",
    ],
  ];

  return (
    <>
      <PageHeader
        kicker={`${report.ticker} · ${report.industry} · ${report.date}`}
        title={report.company}
        description={report.summary}
      />
      <section className="report-summary">
        <Score score={report.score} />
        <div>
          <span className="eyebrow">Illustrative classification</span>
          <h2>{report.classification}</h2>
        </div>
        <div>
          <small>Primary catalyst</small>
          <b>{report.catalyst}</b>
        </div>
        <div>
          <small>Key risk</small>
          <b>{report.risk}</b>
        </div>
      </section>
      <section>
        <div className="placeholder-banner">
          Illustrative research template — sample values are not current market
          data or a recommendation.
        </div>
        <SectionHeading
          eyebrow="Executive summary"
          title="The Luna1 view"
          copy={`${report.company} is included to demonstrate the full structure of a Luna1 research report. A published investment thesis would require current primary sources and dated financial evidence.`}
        />
        <div className="report-sections">
          {sections.map(([title, content], index) => (
            <article key={title}>
              <span>{String(index + 2).padStart(2, "0")}</span>
              <div>
                <h2>{title}</h2>
                <p>{content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
