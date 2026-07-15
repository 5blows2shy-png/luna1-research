import Link from "next/link";
import { EditorialLink, MetricCard, PrismSignature } from "@/components/luxury";
import { Score, SectionHeading } from "@/components/site";
import { analysisCategories, research } from "@/lib/data";
import { mistakeJournalEntries } from "@/lib/mistake-journal-data";

export default function Home() {
  const review = mistakeJournalEntries[0];
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

      <section className="focus-section">
        <SectionHeading
          eyebrow="Current Areas of Focus"
          title="Research where constraints meet durable demand."
          copy="The platform concentrates on public businesses where operational evidence can sharpen financial judgment."
        />
        <div className="focus-grid">
          {analysisCategories.slice(0, 6).map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
              <p>
                {
                  [
                    "Acceleration, quality, and durability of growth.",
                    "Conversion, reinvestment, and operating leverage.",
                    "Customer captivity and competitive staying power.",
                    "Decision quality and capital allocation across cycles.",
                    "Bottlenecks, value chains, and supply discipline.",
                    "Evidence of informed and sustained demand.",
                  ][index]
                }
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="portfolio-proof">
        <div>
          <span className="eyebrow">Portfolio Snapshot</span>
          <h2>Conviction, sized with discipline.</h2>
          <p>
            Each public example connects thesis quality, entry logic, portfolio
            role, and the evidence that would change the decision.
          </p>
          <EditorialLink href="/portfolio">Open the portfolio</EditorialLink>
        </div>
        <div className="metric-board">
          <MetricCard
            label="Active positions"
            value="3"
            note="Manually maintained"
          />
          <MetricCard
            label="Research priorities"
            value="12"
            note="LUNA-scored watchlist"
          />
          <MetricCard
            label="Decision reviews"
            value={String(mistakeJournalEntries.length)}
            note="Portfolio postmortems"
          />
          <MetricCard
            label="Data policy"
            value="Delayed"
            note="No brokerage connection"
          />
        </div>
      </section>

      <section className="decision-feature">
        <SectionHeading
          eyebrow="Portfolio · Latest Decision Review"
          title="A process becomes credible when errors are documented."
        />
        <div className="luxury-card luxury-card--review">
          <div className="decision-number">01</div>
          <div>
            <span className="eyebrow">
              {review.ticker} · {review.classification}
            </span>
            <h3>{review.companyName}</h3>
            <p>{review.finalAssessment}</p>
            <div className="decision-facts">
              <span>
                <small>Thesis at exit</small>
                {review.thesisStatus}
              </span>
              <span>
                <small>Exit quality</small>
                {review.exitQuality}
              </span>
              <span>
                <small>Primary lesson</small>
                {review.lessons[0]}
              </span>
            </div>
            <EditorialLink href="/portfolio/mistake-journal">
              Read the portfolio decision review
            </EditorialLink>
          </div>
        </div>
      </section>

      <section className="career-proof">
        <div>
          <span className="eyebrow">Career and Credentials</span>
          <h2>Financial analysis grounded in accountable operations.</h2>
          <p>
            Army financial-management experience, mission-critical data-center
            operations, nonprofit finance, and undergraduate investment research
            shape the work behind Luna1.
          </p>
          <EditorialLink href="/recruiter">Open Recruiter View</EditorialLink>
        </div>
        <div className="career-ledger">
          <div>
            <span>01</span>
            <b>U.S. Army veteran</b>
            <p>Accountability, logistics, and financial management.</p>
          </div>
          <div>
            <span>02</span>
            <b>Finance assistant</b>
            <p>Reporting, reconciliations, and decision support.</p>
          </div>
          <div>
            <span>03</span>
            <b>Data-center operations</b>
            <p>Firsthand infrastructure and constraint perspective.</p>
          </div>
          <div>
            <span>04</span>
            <b>SDSU Finance</b>
            <p>Equity research, valuation, and portfolio analysis.</p>
          </div>
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
