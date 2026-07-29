import type { Metadata } from "next";
import { ExistingResearchFilter } from "@/components/existing-research-filter";
import { EditorialLink, LuxuryCard } from "@/components/luxury";
import {
  CompanyResearchCard,
  ResearchDisclaimer,
  ResearchSectionNav,
  ThemeCard,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { research } from "@/lib/data";
import {
  companyResearch,
  investmentThemes,
  macroContext,
  researchNotes,
} from "@/lib/research-content";
import {
  primaryCoverage,
  researchReportStandard,
  secondaryCoverage,
} from "@/lib/professional-profile";

export const metadata: Metadata = {
  title: "Equity Research",
  description:
    "Institutional-style company research, industry analysis, valuation, risks, catalysts, sources, and ongoing updates from Luna1 Research.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        kicker="Equity Research"
        title="Evidence organized from question to conclusion."
        description="Institutional-style company dossiers connect the investment thesis, business and industry structure, financial evidence, valuation, risks, catalysts, sources, and subsequent updates."
      />
      <section className="research-hub-intro">
        <ResearchSectionNav />
        <div className="research-hub-overview">
          <div>
            <span className="eyebrow">Research standard</span>
            <h2>
              Transparent status. Explicit assumptions. No invented market data.
            </h2>
          </div>
          <p>
            The hub preserves the existing Luna1 report archive while adding a
            structured path for deeper company and thematic work. Financial
            evidence remains clearly labeled until it is verified from primary
            sources.
          </p>
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="Research architecture"
          title="A consistent standard across every company"
          copy="A section appears as complete only when its evidence has been reviewed. Missing financials or source support remain visibly pending."
        />
        <div className="research-standard-grid">
          {researchReportStandard.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item}</b>
            </div>
          ))}
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="Industry specialization"
          title="Coverage grounded in operating context"
          copy="Primary coverage emphasizes infrastructure and financial systems where operations, capacity, accounting, and capital allocation intersect."
        />
        <div className="coverage-specialization">
          <div>
            <span className="eyebrow">Primary coverage</span>
            <ul>
              {primaryCoverage.map((industry) => (
                <li key={industry}>{industry}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Secondary coverage</span>
            <ul>
              {secondaryCoverage.map((industry) => (
                <li key={industry}>{industry}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="01 · Company research"
          title="Developing company dossiers"
          copy="Three foundational dossiers organize the research question, business model, thesis, risks, catalysts, competitive position, and future financial evidence."
        />
        <div className="research-hub-grid">
          {companyResearch.map((company) => (
            <CompanyResearchCard key={company.ticker} company={company} />
          ))}
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="02 · Investment themes"
          title="Mapping the value chain before selecting the company"
          copy="Theme work identifies bottlenecks, beneficiaries, risks, and the questions that must be answered before a company-specific conclusion."
        />
        <div className="research-hub-grid">
          {investmentThemes.slice(0, 3).map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} />
          ))}
        </div>
        <div className="section-action">
          <EditorialLink href="/research/themes">
            Explore all investment themes
          </EditorialLink>
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="03 · Macro context"
          title="Context, not prediction"
          copy="These lenses frame financial conditions and market structure without substituting macro forecasts for company-level evidence."
        />
        <div className="macro-grid">
          {macroContext.map((item) => (
            <LuxuryCard key={item.title} variant="research">
              <span className="eyebrow">Context lens</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <small>{item.mostRecentNote}</small>
            </LuxuryCard>
          ))}
        </div>
      </section>
      <section className="research-pathways">
        <LuxuryCard variant="research">
          <span className="eyebrow">04 · Research notes</span>
          <h2>{researchNotes.length} working notes</h2>
          <p>
            Short-form research questions organized by company, theme, macro
            context, and process.
          </p>
          <EditorialLink href="/research/notes">
            Open research notes
          </EditorialLink>
        </LuxuryCard>
        <LuxuryCard variant="research">
          <span className="eyebrow">Development record</span>
          <h2>How the platform evolved</h2>
          <p>
            A dated record of product, research, portfolio, and
            professional-development decisions.
          </p>
          <EditorialLink href="/development-log">
            View development log
          </EditorialLink>
        </LuxuryCard>
      </section>
      <section className="library">
        <SectionHeading
          eyebrow="Existing archive"
          title="Original Luna1 research library"
          copy="The previous report library remains intact. Its seeded scores and classifications are illustrative placeholders, not current market data."
        />
        <ExistingResearchFilter reports={research} />
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
