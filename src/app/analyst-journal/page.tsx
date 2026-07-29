import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading } from "@/components/site";
import { bloomAnalystJournal } from "@/lib/bloom-analyst-journal";
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
              </div>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/research/notes">
          Open the filterable research notebook →
        </Link>
      </section>
      <section id="be-project-economics">
        <SectionHeading
          eyebrow={`${bloomAnalystJournal.ticker} · ${bloomAnalystJournal.category} · ${bloomAnalystJournal.status}`}
          title={`${bloomAnalystJournal.company}: ${bloomAnalystJournal.title}`}
          copy={`Research date ${bloomAnalystJournal.researchDate}. ${bloomAnalystJournal.q2Status}`}
        />
        <div className="research-summary-grid">
          {[
            [
              "1. What Management Reported",
              bloomAnalystJournal.managementReported,
            ],
            ["2. What Improved", bloomAnalystJournal.whatImproved],
            [
              "3. What Remains Unclear",
              bloomAnalystJournal.whatRemainsUnclear,
            ],
            [
              "7. Forecast Implications",
              bloomAnalystJournal.forecastImplications,
            ],
            [
              "8. Valuation Implications",
              bloomAnalystJournal.valuationImplications,
            ],
            ["9. Thesis Impact", bloomAnalystJournal.thesisImpact],
            [
              "10. Next Evidence Required",
              bloomAnalystJournal.nextEvidenceRequired,
            ],
          ].map(([title, detail]) => (
            <article className="luxury-card" key={title}>
              <h2>{title}</h2>
              <p>{detail}</p>
            </article>
          ))}
        </div>

        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              What management reported · latest verified period{" "}
              {bloomAnalystJournal.latestVerifiedPeriod}
            </caption>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Reported value</th>
                <th>Period</th>
                <th>Prior-year value</th>
                <th>Change</th>
                <th>Analyst interpretation</th>
                <th>Open question</th>
              </tr>
            </thead>
            <tbody>
              {bloomAnalystJournal.evidence.map((record) => (
                <tr key={record.metric}>
                  <td data-label="Metric">
                    <a
                      href={record.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {record.metric}
                    </a>
                    <small className="research-data-label">Reported</small>
                  </td>
                  <td data-label="Reported value">{record.reportedValue}</td>
                  <td data-label="Period">{record.period}</td>
                  <td data-label="Prior-year value">
                    {record.priorYearValue}
                  </td>
                  <td data-label="Change">{record.change}</td>
                  <td data-label="Analyst interpretation">
                    {record.interpretation}
                  </td>
                  <td data-label="Open question">{record.openQuestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="company-research-section">
          <div className="section-heading">
            <span className="eyebrow">
              4–6. Project economics, cash conversion, and margin durability
            </span>
            <h2>Questions management evidence must answer</h2>
          </div>
          <div className="journal-category-grid">
            {bloomAnalystJournal.sections.map((section) => (
              <article key={section.title}>
                <h3>{section.title}</h3>
                <ul>
                  {section.questions.map((item) => (
                    <li key={item.question}>
                      <p>{item.question}</p>
                      <small className="research-data-label">
                        {item.status}
                      </small>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Bloom Energy primary-source register · accessed July 28, 2026
            </caption>
            <thead>
              <tr>
                <th>Document</th>
                <th>Publisher</th>
                <th>Publication date</th>
                <th>Reporting period</th>
                <th>Relevant section</th>
              </tr>
            </thead>
            <tbody>
              {bloomAnalystJournal.sources.map((source) => (
                <tr key={source.href}>
                  <td data-label="Document">
                    <a href={source.href} rel="noreferrer" target="_blank">
                      {source.title}
                    </a>
                  </td>
                  <td data-label="Publisher">{source.publisher}</td>
                  <td data-label="Publication date">
                    {source.publicationDate}
                  </td>
                  <td data-label="Reporting period">
                    {source.reportingPeriod}
                  </td>
                  <td data-label="Relevant section">{source.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="disclosure">
          This journal is educational research, not personalized investment,
          financial, tax, or legal advice. Questions marked unanswered or
          requiring disclosure are not presented as management-confirmed facts.
        </p>
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
