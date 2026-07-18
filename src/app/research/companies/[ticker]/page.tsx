import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialLink, LuxuryCard } from "@/components/luxury";
import {
  LastUpdated,
  ResearchDisclaimer,
  ResearchSectionNav,
  ResearchStatusBadge,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { companyResearch } from "@/lib/research-content";

type Props = { params: Promise<{ ticker: string }> };

export function generateStaticParams() {
  return companyResearch.map(({ slug }) => ({ ticker: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const company = companyResearch.find((item) => item.slug === ticker);
  return company
    ? { title: `${company.ticker} Research`, description: company.summary }
    : {};
}

export default async function CompanyResearchPage({ params }: Props) {
  const { ticker } = await params;
  const company = companyResearch.find((item) => item.slug === ticker);
  if (!company) notFound();
  return (
    <>
      <PageHeader
        kicker={`${company.ticker} · ${company.sector} · ${company.industry}`}
        title={company.companyName}
        description={company.summary}
      />
      <section className="research-dossier-top">
        <ResearchSectionNav />
        <div className="dossier-meta">
          <ResearchStatusBadge status={company.status} />
          <LastUpdated date={company.lastUpdated} />
        </div>
        <div className="placeholder-banner">
          Financial data, earnings history, and valuation assumptions remain in
          development. No values shown here represent live market data.
        </div>
      </section>
      <section className="dossier-section">
        <SectionHeading
          eyebrow="01 · Company overview"
          title="Business and revenue model"
        />
        <div className="dossier-two-column">
          <div>
            <h2>Business overview</h2>
            <p>{company.businessOverview}</p>
            <h2>Business model</h2>
            <p>{company.businessModel}</p>
          </div>
          <LuxuryCard variant="research">
            <h3>Primary revenue drivers</h3>
            <ul>
              {company.revenueDrivers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LuxuryCard>
        </div>
      </section>
      <section className="dossier-section">
        <SectionHeading
          eyebrow="02 · Investment thesis"
          title="What the research is testing"
        />
        <div className="dossier-ledger">
          {company.thesis.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="dossier-section">
        <SectionHeading
          eyebrow="03 · Financial record"
          title="Evidence pending primary-source update"
        />
        <div className="metric-placeholder-grid">
          {company.keyMetrics.map((metric) => (
            <div key={metric.label}>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
              <p>{metric.note}</p>
            </div>
          ))}
        </div>
        <div className="empty-financial-state">
          <div>
            <h3>Earnings history</h3>
            <p>
              {company.earningsHistory.length
                ? "Earnings records available."
                : "No verified earnings history has been added."}
            </p>
          </div>
          <div>
            <h3>Quarterly updates</h3>
            <p>
              {company.quarterlyUpdates.length
                ? "Quarterly updates available."
                : "No verified quarterly updates have been added."}
            </p>
          </div>
        </div>
      </section>
      <section className="dossier-section">
        <SectionHeading
          eyebrow="04 · Competitive position"
          title="Advantages under review"
        />
        <div className="dossier-two-column">
          <LuxuryCard variant="research">
            <h3>Potential advantages</h3>
            <ul>
              {company.competitiveAdvantages.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LuxuryCard>
          <LuxuryCard variant="research">
            <h3>Key risks</h3>
            <ul>
              {company.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LuxuryCard>
        </div>
      </section>
      <section className="dossier-section">
        <SectionHeading
          eyebrow="05 · Catalysts and valuation"
          title="Evidence that could change the assessment"
        />
        <div className="dossier-two-column">
          <LuxuryCard variant="research">
            <h3>Potential catalysts</h3>
            <ul>
              {company.catalysts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LuxuryCard>
          <LuxuryCard variant="research">
            <h3>Valuation framework</h3>
            <p>{company.valuation.currentAssessment}</p>
            <ul>
              {company.valuation.methodology.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <small>{company.valuation.assumptions}</small>
          </LuxuryCard>
        </div>
      </section>
      <section className="report-download-state">
        <div>
          <span className="eyebrow">Research report</span>
          <h2>
            {company.pdfUrl
              ? "Reviewed report available"
              : "Full research report in development."}
          </h2>
        </div>
        {company.pdfUrl ? (
          <Link className="button primary" href={company.pdfUrl}>
            Download PDF <span>↓</span>
          </Link>
        ) : (
          <EditorialLink href="/research/notes">
            Review working notes
          </EditorialLink>
        )}
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
