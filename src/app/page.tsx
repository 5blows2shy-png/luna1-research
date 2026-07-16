import Link from "next/link";
import { PrismSignature } from "@/components/luxury";
import { Score, SectionHeading } from "@/components/site";
import { research } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="luxury-hero">
        <div className="hero-copy">
          <span className="eyebrow">Luna1 Research · Shy Lee</span>
          <h1>
            Independent research built around evidence, conviction, and
            accountability.
          </h1>
          <p>
            A focused public-markets research platform for understanding
            businesses, portfolio decisions, and the evidence that changes a
            thesis.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/research">
              Explore Research <span>↗</span>
            </Link>
            <Link className="button" href="/portfolio">
              View Portfolio <span>→</span>
            </Link>
          </div>
          <div className="hero-proof">
            <span>Public markets</span>
            <span>Portfolio discipline</span>
            <span>Decision reviews</span>
          </div>
        </div>
        <PrismSignature />
      </section>

      <section>
        <SectionHeading
          eyebrow="Featured Research"
          title="Evidence before opinion."
          copy="A focused research library organized around business quality, change, valuation, institutional behavior, and explicit risk."
        />
        <div className="research-grid luxury-grid">
          {research.slice(0, 3).map((item, index) => (
            <Link
              href={`/research/${item.ticker.toLowerCase()}`}
              className="research-card luxury-card luxury-card--research"
              key={item.ticker}
            >
              <div className="card-top">
                <div>
                  <span className="ticker">{item.ticker}</span>
                  <small>
                    {String(index + 1).padStart(2, "0")} · {item.industry}
                  </small>
                </div>
                <Score score={item.score} />
              </div>
              <h3>{item.company}</h3>
              <p>{item.summary}</p>
              <div className="card-meta">
                <span>{item.classification}</span>
                <span>{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="contact-proof">
        <span className="eyebrow">Professional Contact</span>
        <h2>Thoughtful work begins with a clear conversation.</h2>
        <p>
          For recruiting, investment research, finance, or professional
          collaboration, use the secure contact form.
        </p>
        <Link className="button primary" href="/contact">
          Request a connection <span>↗</span>
        </Link>
      </section>
    </>
  );
}
