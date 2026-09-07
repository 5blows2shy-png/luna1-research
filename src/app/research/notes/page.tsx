import type { Metadata } from "next";
import { ResearchNotesFilter } from "@/components/research-notes-filter";
import {
  ResearchDisclaimer,
  ResearchSectionNav,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { researchNotes } from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Research Notes",
  description:
    "Draft company, theme, macro, and process notes from Luna1 Research.",
};
export default function ResearchNotesPage() {
  return (
    <>
      <PageHeader
        kicker="Research · Notes"
        title="Questions and observations before a full conclusion."
        description="Published notes make the sourced research path visible. Draft status identifies entries whose evidence, sourcing, or final assessment remains incomplete."
      />
      <section>
        <ResearchSectionNav />
        <SectionHeading
          eyebrow="Working notebook"
          title="Filter by category, ticker, or theme"
          copy="Published entries include sourced downloadable reports. Drafts remain research scaffolds, and no entry is a personalized investment recommendation."
        />
        <ResearchNotesFilter notes={researchNotes} />
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
