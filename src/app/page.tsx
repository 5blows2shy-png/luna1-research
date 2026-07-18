import Link from "next/link";
import { PrismSignature } from "@/components/luxury";

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
            <Link className="button primary" href="/portfolio">
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
