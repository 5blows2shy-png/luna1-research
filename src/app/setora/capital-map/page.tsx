import type { Metadata } from "next";
import { SetoraMap } from "@/components/setora-map";
export const metadata: Metadata = { title: "Capital Map | SETORA", description: "Explore the interactive SETORA capital-flow network." };
export default function CapitalMapPage() { return <section className="setora-subpage"><header className="setora-section-heading"><div><span className="eyebrow">Four-vertical capital intelligence</span><h1>Follow the capital chain.</h1></div><p>Open any of the four ecosystems, choose a company, and explore suppliers, upstream connections, and customers. Public-company quotes can be refreshed separately; filings, earnings, and event evidence are source-reviewed rather than tick-by-tick data.</p></header><SetoraMap /></section>; }
