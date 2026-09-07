import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading } from "@/components/site";
import { researchNotes } from "@/lib/research-content";

export const metadata: Metadata = {
  title: "Analyst Journal",
  description:
    "An ongoing notebook of company, industry, earnings, macro, market, and investment-process observations from Luna1 Research.",
};

export default function AnalystJournalPage() {
  return (
    <>
      <PageHeader
        kicker="Analyst Journal"
        title="Working notes before the conclusion."
        description="An analyst notebook for questions, observations, updates, and lessons. Drafts remain clearly labeled until evidence and sources are ready for review."
      />
      <section>
        <SectionHeading
          eyebrow="Current notebook"
          title="Research notes and open questions"
          copy="Published entries link to sourced reports. Drafts remain clearly labeled while evidence and conclusions are still being developed."
        />
        <div className="analyst-note-ledger">
          {researchNotes.map((note) => (
            <article key={note.slug}>
              <div>
                <span className="eyebrow">
                  {note.category}
                  {note.ticker ? ` · ${note.ticker}` : ""}
                </span>
                <h2>{note.title}</h2>
                <p>{note.summary}</p>
              </div>
              <div>
                <span className="research-status research-status--draft">
                  {note.status}
                </span>
                <small>{note.date}</small>
                {note.pdfUrl && (
                  <a
                    className="analyst-note-download"
                    download
                    href={note.pdfUrl}
                  >
                    Download PDF <span aria-hidden="true">↓</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/research/notes">
          Open the filterable research notebook →
        </Link>
      </section>
    </>
  );
}
