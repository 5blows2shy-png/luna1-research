import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading } from "@/components/site";
import { commentary } from "@/lib/data";
import { analystJournalCategories } from "@/lib/professional-profile";
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
          eyebrow="Notebook structure"
          title="Eight lenses for continuous research"
          copy="Categories organize the work without presenting unfinished notes as complete research."
        />
        <div className="journal-category-grid">
          {analystJournalCategories.map((category, index) => (
            <article key={category.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <small>
                {category.title === "Books"
                  ? "No published entries"
                  : "Notebook category"}
              </small>
            </article>
          ))}
        </div>
      </section>
      <section>
        <SectionHeading
          eyebrow="Current notebook"
          title="Research questions in development"
          copy="These are research scaffolds. Primary sources, financial evidence, and final conclusions remain pending."
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
                {note.slug === "be-project-economics" && (
                  <a
                    className="analyst-note-download"
                    download
                    href="/reports/BE-Luna1-Analyst-Journal.pdf"
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
      <section>
        <SectionHeading
          eyebrow="Market notes archive"
          title="Context without prediction"
          copy="Archived market observations support company-level research but do not replace business analysis."
        />
        <div className="journal-list">
          {commentary.map((item, index) => (
            <Link href={`/market-commentary/${item.slug}`} key={item.slug}>
              <span className="journal-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="eyebrow">
                  {item.category} · {item.date}
                </span>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <b>Read market note →</b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
