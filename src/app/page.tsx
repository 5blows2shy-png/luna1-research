import Link from "next/link";
import { PrismSignature } from "@/components/luxury";
import {
  professionalPositioning,
} from "@/lib/professional-profile";

const researchPathways = [
  {
    number: "01",
    title: "Equity Research",
    href: "/research",
    purpose:
      "Source-aware company and industry work that moves from a research question to a documented conclusion.",
  },
  {
    number: "02",
    title: "Global Finance",
    href: "/global-finance",
    purpose:
      "Cross-border business analysis connecting currencies, trade, infrastructure, and capital allocation.",
  },
  {
    number: "03",
    title: "Portfolio Lab",
    href: "/portfolio",
    purpose:
      "A decision record centered on thesis quality, valuation, risk, position role, and what changed after purchase.",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="luxury-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            Independent Investment &amp; Global Finance Research · Shy Lee
          </span>
          <h1>
            Follow the capital.
            <br />
            <em>Understand the business.</em>
            <br />
            Find the opportunity.
          </h1>
          <p>
            Independent investment and global finance research across public
            companies, capital flows, valuation, and structural themes.
            {" "}{professionalPositioning}
          </p>
          <div className="button-row">
            <Link className="button primary" href="/research">
              Explore Research <span>→</span>
            </Link>
            <Link className="button" href="/research/capital-flows">
              View Capital Flows <span>→</span>
            </Link>
          </div>
          <div className="hero-proof">
            <span>Companies</span>
            <span>Capital flows</span>
            <span>Global finance</span>
          </div>
        </div>
        <PrismSignature />
      </section>

      <section>
        <div className="section-heading">
          <span className="eyebrow">01 · Featured research</span>
          <h2>Research built from evidence, not noise.</h2>
          <p>
            A focused selection of company work, capital-flow research, and
            global-finance analysis. Every item keeps its sources, status, and
            limitations visible.
          </p>
        </div>
        <div className="featured-research">
          <Link className="featured-research-primary" href="/research/capital-flows">
            <span className="eyebrow">Featured · AI infrastructure</span>
            <h3>Follow the capital: from compute to power.</h3>
            <p>
              A structured view of demand, bottlenecks, and the companies
              positioned along the infrastructure value chain.
            </p>
            <b>View Capital Flows →</b>
          </Link>
          <div className="featured-research-secondary">
            {researchPathways.map((pillar) => (
              <Link href={pillar.href} key={pillar.title}>
                <span>{pillar.number} · {pillar.title}</span>
                <p>{pillar.purpose}</p>
                <b>Open research →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-proof">
        <span className="eyebrow">Professional Contact</span>
        <h2>Looking for an analyst who can connect operations to value?</h2>
        <p>
          Review the recruiter brief, research samples, valuation process, and
          decision record, then use the secure contact form to start a
          conversation.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/recruiter">
            Open Professional Profile <span>→</span>
          </Link>
          <Link className="button" href="/contact">
            Request a connection <span>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
