import type { Metadata } from "next";
import { SetoraMap } from "@/components/setora-map";
export const metadata: Metadata = { title: "Capital Map | SETORA", description: "Explore the interactive SETORA capital-flow network." };
export default function CapitalMapPage() { return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">Supplier & customer intelligence</span><h1>Follow the capital chain.</h1></div><p>Open Data Centers or Robotics, choose a company, and explore its suppliers, upstream connections, and customers. Every company link includes its supporting disclosure.</p></header><SetoraMap /></section>; }
