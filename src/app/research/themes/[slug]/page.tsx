import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LuxuryCard } from "@/components/luxury";
import {
  LastUpdated,
  ResearchDisclaimer,
  ResearchSectionNav,
  ResearchStatusBadge,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { investmentThemes } from "@/lib/research-content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return investmentThemes.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const theme = investmentThemes.find((item) => item.slug === slug);
  return theme ? { title: theme.title, description: theme.summary } : {};
}

export default async function ThemePage({ params }: Props) {
  const { slug } = await params;
  const theme = investmentThemes.find((item) => item.slug === slug);
  if (!theme) notFound();
  const sections = [
    ["Value chain", theme.valueChain],
    ["Potential beneficiaries", theme.beneficiaries],
    ["Principal risks", theme.risks],
    ["Monitoring questions", theme.monitoringQuestions],
  ] as const;
  return (
    <>
      <PageHeader
        kicker="Research theme"
        title={theme.title}
        description={theme.summary}
      />
      <section className="theme-detail">
        <ResearchSectionNav />
        <div className="dossier-meta">
          <ResearchStatusBadge status={theme.status} />
          <LastUpdated date={theme.lastUpdated} />
        </div>
        <SectionHeading
          eyebrow="Working thesis"
          title="What the theme research is testing"
          copy={theme.thesis}
        />
        <div className="theme-detail-grid">
          {sections.map(([title, items]) => (
            <LuxuryCard key={title} variant="research">
              <h2>{title}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </LuxuryCard>
          ))}
        </div>
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
