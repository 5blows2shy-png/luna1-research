import type { Metadata } from "next";
import {
  ResearchDisclaimer,
  ResearchSectionNav,
  ThemeCard,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { investmentThemes } from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Investment Themes",
  description:
    "Value-chain maps, risks, beneficiaries, and monitoring questions for long-duration investment themes.",
};

export default function InvestmentThemesPage() {
  return (
    <>
      <PageHeader
        kicker="Research · Themes"
        title="Start with the value chain, then test the company."
        description="Thematic research maps infrastructure, bottlenecks, beneficiaries, and failure modes without turning a broad narrative into a security recommendation."
      />
      <section>
        <ResearchSectionNav />
        <SectionHeading
          eyebrow="Theme library"
          title="Five areas under structured review"
          copy="Each page records the thesis, value chain, potential beneficiaries, risks, and the questions that still need evidence."
        />
        <div className="research-hub-grid">
          {investmentThemes.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} />
          ))}
        </div>
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
