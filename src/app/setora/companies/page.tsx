import type { Metadata } from "next";
import { SetoraCoverage } from "@/components/setora-coverage";
export const metadata: Metadata = { title: "Companies | SETORA", description: "Explore Data Center AI Infrastructure and Robotics coverage." };
export default function Page() {
  return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">Two capital ecosystems</span><h1>Explore the companies.</h1></div><p>Open a segment to explore its suppliers, platforms, and customers. Each segment has a separate capital map and source-linked research.</p></header><SetoraCoverage view="companies" /></section>;
}
