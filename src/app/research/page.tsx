import type { Metadata } from "next";
import { EditorialLink, LuxuryCard } from "@/components/luxury";
import {
  ResearchDisclaimer,
  ResearchSectionNav,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";

export const metadata: Metadata = {
  title: "Equity Research",
  description:
    "Luna1 Equity Research organizes company evidence, investment reasoning, and ongoing monitoring into clear, educational research dossiers.",
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
            The hub provides a structured path for deeper company and thematic
            work. Financial evidence remains clearly labeled until it is
            verified from primary sources.
          </p>
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="Research approach"
          title="Reasoning before conclusion"
          copy="Each research path separates reported evidence, analyst interpretation, open questions, and risk. The work is educational and never a personalized recommendation."
        />
        <div className="research-pathways">
          <LuxuryCard variant="research">
            <span className="eyebrow">01 · Company dossiers</span>
            <h2>Evidence at the company level</h2>
            <p>Business structure, financial evidence, valuation context, catalysts, risks, and monitoring indicators in one consistent format.</p>
            <EditorialLink href="/research/companies/glw">Open company research</EditorialLink>
          </LuxuryCard>
          <LuxuryCard variant="research">
            <span className="eyebrow">02 · Capital Flows</span>
            <h2>Trace spending through the value chain</h2>
            <p>Explore capital intensity, bottlenecks, beneficiaries, and the operational evidence behind structural themes.</p>
            <EditorialLink href="/research/capital-flows">Open Capital Flows</EditorialLink>
          </LuxuryCard>
          <LuxuryCard variant="research">
            <span className="eyebrow">03 · Themes & notes</span>
            <h2>Organized research paths</h2>
            <p>Investment themes and working notes remain separate destinations, keeping this landing page concise.</p>
            <div className="research-card-actions">
              <EditorialLink href="/research/themes">Investment Themes</EditorialLink>
              <EditorialLink href="/research/notes">Research Notes</EditorialLink>
            </div>
          </LuxuryCard>
        </div>
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
