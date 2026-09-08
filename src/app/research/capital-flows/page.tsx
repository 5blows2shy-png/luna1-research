import type { Metadata } from "next";
import { CapitalFlowMap } from "@/components/capital-flow-map";
import { ResearchDisclaimer, ResearchSectionNav } from "@/components/research-ui";
import { PageHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "Capital Flows",
  description:
    "Capital-flow research mapping spending, bottlenecks, operating evidence, and potential public-market beneficiaries.",
};

export default function CapitalFlowsPage() {
  return (
    <>
      <PageHeader
        kicker="Research · Capital Flows"
        title="Follow the capital before the headline."
        description="A focused map of structural spending, operational constraints, value chains, and the questions that determine whether a theme translates into company-level evidence."
      />
      <section className="research-hub-intro">
        <ResearchSectionNav />
      </section>
      <CapitalFlowMap />
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
