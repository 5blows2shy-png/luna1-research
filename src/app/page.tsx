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
            Operating context.
            <br />
            <em>Analytical discipline.</em>
          </h1>
          <p>
            Luna1 is a professional financial research platform that connects
            operating context, financial statements, and market evidence to
            disciplined decisions. {professionalPositioning}{" "}It documents the
            research, valuation, portfolio decisions, and lessons behind that
            process.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/research">
              Explore Equity Research <span>→</span>
            </Link>
            <Link className="button" href="/recruiter">
              Why hire me? <span>→</span>
            </Link>
          </div>
          <div className="hero-proof">
            <span>Financial reasoning</span>
            <span>Operational understanding</span>
            <span>Investment process</span>
          </div>
        </div>
        <PrismSignature />
      </section>

      <section>
        <div className="section-heading">
          <span className="eyebrow">Six pillars</span>
          <h2>Evidence of how an analyst thinks.</h2>
          <p>
            Each section documents a different part of the analytical process,
            from source-aware research and valuation to accounting controls,
            portfolio accountability, and continuous improvement.
          </p>
        </div>
        <div className="analyst-pillar-grid">
          {platformPillars.map((pillar) => (
            <Link href={pillar.href} key={pillar.title}>
              <span>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.purpose}</p>
              <ul>
                {pillar.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <b>Explore {pillar.title} →</b>
            </Link>
          ))}
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
            Open Recruiter View <span>→</span>
          </Link>
          <Link className="button" href="/contact">
            Request a connection <span>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
