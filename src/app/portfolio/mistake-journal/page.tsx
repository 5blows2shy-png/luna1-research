import type { Metadata } from "next";
import Link from "next/link";
import { MistakeJournal } from "@/components/mistake-journal";
import { PageHeader } from "@/components/site";

export const metadata: Metadata = {
  title: "Mistake Journal | Portfolio",
  description:
    "Portfolio decision reviews documenting thesis quality, execution, lessons, and process changes.",
};

export default function PortfolioMistakeJournalPage() {
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/portfolio">Portfolio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Mistake Journal</span>
      </nav>
      <PageHeader
        kicker="Portfolio · Investment Committee · Decision Reviews"
        title="Good judgment is built through honest postmortems."
        description="A read-only portfolio record of decisions, errors, lessons, missed opportunities, and the rules adopted afterward."
      />
      <section className="journal-page">
        <MistakeJournal />
      </section>
    </>
  );
}
