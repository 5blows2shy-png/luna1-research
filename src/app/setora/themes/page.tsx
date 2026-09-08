import type { Metadata } from "next";
import { SetoraCoverage } from "@/components/setora-coverage";
import { setoraVerticals } from "@/data/setora-alpha";
export const metadata: Metadata = { title: "Themes | SETORA", description: "Explore Data Center AI Infrastructure and Robotics coverage." };
export default function Page() {
  return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">Four connected verticals</span><h1>Explore the themes.</h1></div><p>SETORA’s primary verticals organize the questions. Defense &amp; autonomy remains a cross-cutting lens, and every company or relationship stays subject to source review.</p></header><div className="setora-vertical-index">{setoraVerticals.map((vertical) => <article key={vertical.id}><span>{vertical.status}</span><h2>{vertical.name}</h2><p>{vertical.question}</p></article>)}</div><SetoraCoverage view="themes" /></section>;
}
