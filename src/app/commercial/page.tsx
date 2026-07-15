import type { Metadata } from "next";
import Link from "next/link";
import { LunaCommercial } from "@/components/commercial/luna-commercial";

export const metadata: Metadata = {
  title: "Commercial",
  description: "A 25-second institutional brand film about the Luna1 Research process.",
  alternates: { canonical: "/commercial" },
  openGraph: { title: "Luna1 Research — Discipline. Evidence. Evolution.", description: "Markets create noise. Research creates clarity.", url: "/commercial", type: "website", images: [{ url: "/commercial-poster.png", width: 1200, height: 630, alt: "Luna1 Research prism separating market noise into disciplined research dimensions" }] },
  twitter: { card: "summary_large_image", title: "Luna1 Research", description: "Discipline. Evidence. Evolution.", images: ["/commercial-poster.png"] },
};

export default function CommercialPage() { return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"VideoObject",name:"Luna1 Research — Discipline. Evidence. Evolution.",description:"A cinematic institutional research brand film.",thumbnailUrl:"https://luna1research.com/commercial-poster.png",duration:"PT29S",uploadDate:"2026-07-14"}).replace(/</g,"\\u003c")}}/>
  <section className="commercial-header"><span className="eyebrow">Luna1 Research · Brand film</span><h1>From market noise<br/>to research clarity.</h1><p>A 29-second portrait of an independent research process built around discipline, evidence, and continuous improvement.</p></section>
  <section className="commercial-section"><LunaCommercial/><div className="commercial-context"><p>This film uses illustrative data and concept product screens. Luna1 Research is independent educational research—not personalized investment advice, a broker-dealer, or a registered investment adviser.</p><Link className="text-link" href="/luna1-framework">Explore the research framework →</Link></div></section>
  </>; }
