import type { Metadata } from "next";
import { SetoraUpdates } from "@/components/setora-updates";
export const metadata: Metadata = { title: "Research & Updates | SETORA", description: "Source-linked SEC filings, earnings materials, and candidate capital events for AI infrastructure and robotics." };
export default function SetoraResearchPage() { return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">SETORA research monitor</span><h1>Filings, earnings, and capital events.</h1></div><p>Follow official disclosures across both ecosystems. Reported facts retain their source links; proposed capital events remain candidates until reviewed.</p></header><SetoraUpdates /></section>; }
