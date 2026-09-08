import type { Metadata } from "next";
import Link from "next/link";
import { setoraCompanyCandidates, setoraEventTypes, setoraSegments } from "@/data/setora-alpha";
import { setoraNavigation } from "@/lib/setora";

export const metadata: Metadata = {
  title: "SETORA MAP | Capital Intelligence",
  description: "Map capital sources, catalysts, industries, companies, and second-order beneficiaries with source-aware research.",
};

export default function SetoraOverviewPage() {
  return <section className="setora-hero setora-overview"><div className="setora-hero-grid"><div><span className="setora-wordmark">SETORA <i>ALPHA</i></span><h1>Capital intelligence across AI infrastructure and robotics.</h1><p>SETORA is Luna1’s source-aware capital-chain system, tracing data centers, power, autonomy, robotics, suppliers, customers, and the events that connect them. Company relationships remain research candidates until source-verified.</p></div><div className="setora-refresh"><span>SETORA status</span><strong>Research foundation</strong><small>Independent from Luna1’s legacy equity-research universe</small></div></div><div className="setora-kpis" aria-label="SETORA scope"><article><span>Coverage candidates</span><strong>{setoraCompanyCandidates.length}</strong><p>Data-center and AI-infrastructure companies queued for primary-source research</p><small>SETORA universe · not recommendations</small></article><article><span>Infrastructure segments</span><strong>{setoraSegments.length}</strong><p>Compute, power, cooling, networking, construction, and upstream layers</p><small>SETORA taxonomy</small></article><article><span>Capital event types</span><strong>{setoraEventTypes.length}</strong><p>Discrete events the research feed can normalize</p><small>SETORA event schema</small></article><article><span>Robotics ecosystem</span><strong>2</strong><p>Robotics and data-center AI infrastructure maps</p><small>Supplier and customer relationships</small></article></div><div className="setora-route-grid" aria-label="Explore SETORA">{setoraNavigation.slice(1).map(([label, href], index) => <Link href={href} key={href}><span>{String(index + 1).padStart(2, "0")}</span><h2>{label}</h2><b>Open page →</b></Link>)}</div></section>;
}
