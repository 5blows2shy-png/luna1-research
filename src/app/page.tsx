import Link from "next/link";
import { PrismSignature } from "@/components/luxury";
import {
  careerProgression,
  platformPillars,
  professionalPositioning,
} from "@/lib/professional-profile";

export default function Home() {
  return (
    <>
      <section className="luxury-hero">
        <div className="hero-copy">
          <span className="eyebrow">Professional Financial Research Platform · Shy Lee</span>
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
            {platformPillars.slice(0, 3).map((pillar) => (
              <Link href={pillar.href} key={pillar.title}>
                <span>{pillar.number} · {pillar.title}</span>
                <p>{pillar.purpose}</p>
                <b>Open research →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <span className="eyebrow">Career progression</span>
          <h2>Each role added another layer of financial understanding.</h2>
          <p>
            The progression is grounded in documented responsibilities and
            shows how operating, accounting, and investment perspectives
            connect.
          </p>
        </div>
        <ol className="career-progression" aria-label="Career progression">
          {careerProgression.map((item, index) => (
            <li key={item.stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.stage}</h3>
                <p>{item.contribution}</p>
              </div>
            </li>
          ))}
        </ol>
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
