import type { Metadata } from "next";
import { LuxuryCard } from "@/components/luxury";
import {
  ResearchDisclaimer,
  ResearchSectionNav,
} from "@/components/research-ui";
import { PageHeader, SectionHeading } from "@/components/site";
import { formatResearchDate } from "@/lib/date";
import { readingLibrary } from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Reading Library",
  description:
    "Original summaries of books and ideas that influence the Luna1 Research process.",
};
export default function ReadingLibraryPage() {
  return (
    <>
      <PageHeader
        kicker="Research · Reading library"
        title="Ideas translated into research habits."
        description="The library records original lesson summaries and explains how each title changed the investment process. It does not reproduce copyrighted text."
      />
      <section>
        <ResearchSectionNav />
        <SectionHeading eyebrow="Investment process" title="Reading records" />
        {readingLibrary.map((book) => (
          <LuxuryCard
            key={book.slug}
            variant="research"
            className="reading-card"
          >
            <div className="reading-heading">
              <div>
                <span className="eyebrow">
                  {book.category} · {book.status}
                </span>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
              </div>
              <time>Completed · {formatResearchDate(book.dateCompleted)}</time>
            </div>
            <div className="reading-grid">
              <div>
                <h3>Key lessons</h3>
                <ol>
                  {book.keyLessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3>Influence on the process</h3>
                <p>{book.processInfluence}</p>
              </div>
            </div>
          </LuxuryCard>
        ))}
      </section>
      <section className="research-disclaimer-section">
        <ResearchDisclaimer />
      </section>
    </>
  );
}
