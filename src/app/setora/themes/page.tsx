import type { Metadata } from "next";
import { SetoraCoverage } from "@/components/setora-coverage";
export const metadata: Metadata = { title: "Themes | SETORA", description: "Explore Data Center AI Infrastructure and Robotics coverage." };
export default function Page() {
  return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">Two capital ecosystems</span><h1>Explore the themes.</h1></div><p>Open a segment to explore its research themes and infrastructure layers. Each segment has a separate capital map and source-linked research.</p></header><SetoraCoverage view="themes" /></section>;
}
