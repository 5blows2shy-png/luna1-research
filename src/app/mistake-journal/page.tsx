import type { Metadata } from "next";
import { MistakeJournal } from "@/components/mistake-journal";
import { PageHeader } from "@/components/site";

export const metadata:Metadata={title:"Mistake Journal",description:"Investment decision reviews documenting thesis quality, execution, lessons, and process changes."};
export default function MistakeJournalPage(){return <><PageHeader kicker="Investment Committee · Decision Reviews" title="Good judgment is built through honest postmortems." description="A read-only record of decisions, errors, lessons, missed opportunities, and the portfolio rules adopted afterward."/><section className="journal-page"><MistakeJournal/></section></>}
