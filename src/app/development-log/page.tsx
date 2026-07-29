import type { Metadata } from "next";
import { DevelopmentLogFilter } from "@/components/development-log-filter";
import { EditorialLink } from "@/components/luxury";
import { PageHeader, SectionHeading } from "@/components/site";
import { developmentLogEntries } from "@/lib/development-log";

export const metadata: Metadata = {
  title: "Development Log",
  description:
    "A transparent timeline of the strategy, research, portfolio, and platform decisions behind Luna1 Research.",
};

export default function DevelopmentLogPage() {
  return (
    <>
      <PageHeader
        kicker="Development log"
        title="A living record of how Luna1 Research is being built."
        description="The timeline documents what changed, why it changed, what was learned, and how each decision affected the research process. Unknown historical dates remain explicitly unconfirmed."
      />
      <section className="development-intro">
        <SectionHeading
          eyebrow="From strategy to platform"
          title="Progress measured by decisions, not feature volume"
          copy="This record uses repository history for verified website dates and deliberately avoids inventing dates for work completed before the public build."
        />
        <EditorialLink href="/research">Explore the research hub</EditorialLink>
      </section>
      <section className="development-log-section">
        <DevelopmentLogFilter entries={developmentLogEntries} />
      </section>
    </>
  );
}
