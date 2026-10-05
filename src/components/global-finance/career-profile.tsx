import Link from "next/link";
import {
  careerAreas,
  globalBusinessFramework,
  careerResearch,
  competencies,
  careerMarketWatch,
  type CareerResearchCard,
} from "@/data/global-finance/career";
import { RegionalInterests } from "./regional-interests";
import styles from "./global-finance.module.css";
export function CareerThesis() {
  return (
    <>
      <section className={styles.section}>
        <span className={styles.kicker}>An analyst’s framework</span>
        <h2>How I Evaluate a Global Business</h2>
        <div className={styles.frameworkGrid}>
          {globalBusinessFramework.map(([title, question], i) => (
            <article key={title}>
              <span className={styles.kicker}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{question}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.kicker}>
          Global career thesis · Finance student · 2027
        </span>
        <h2>Building toward decisions that cross borders.</h2>
        <p>
          My objective is to build a career at the intersection of global
          corporate finance, investment analysis, and infrastructure. I’m
          particularly interested in roles where financial decisions span
          countries, currencies, business units, and capital markets.
        </p>
        <ul className={styles.careerTags}>
          {careerAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </section>
      <RegionalInterests />

    </>
  );
}
function CompanyCard({ record }: { record: CareerResearchCard }) {
  return (
    <article className={styles.card}>
      <span className={styles.badge}>Example coverage candidate</span>
      <h3>{record.company}</h3>
      <p>Research planned · no published thesis or recommendation.</p>
      <details>
        <summary>View research fields</summary>
        <dl className={styles.ledger}>
          {[
            ["Headquarters", record.headquarters],
            ["Industry", record.industry],
            ["Geographic exposure", record.geography],
            ["Investment thesis", record.thesis],
            ["Revenue growth", record.revenueGrowth],
            ["Operating margin", record.operatingMargin],
            ["ROIC", record.roic],
            ["Valuation", record.valuation],
            ["Key global risk", record.risk],
            ["Source", record.source],
            ["As of", record.asOf],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value ?? "Not Available"}</dd>
            </div>
          ))}
        </dl>
      </details>
      {record.report ? (
        <Link href={record.report}>Read research report →</Link>
      ) : (
        <small className={styles.source}>Report not yet published</small>
      )}
    </article>
  );
}
export function CareerEvidence() {
  return (
    <>
      <section className={styles.section}>
        <span className={styles.kicker}>Research pipeline</span>
        <h2>Global Company Analysis</h2>
        <p>
          I study companies through both a financial and operating lens, with
          particular interest in businesses whose competitive advantages extend
          across countries and markets.
        </p>
        <p className={styles.note}>
          The companies below are example coverage candidates. Financial metrics
          and company profiles require sourced research before publication.{" "}
          <Link href="/research/companies/glw#global-exposure">
            View the existing sourced Corning exposure analysis →
          </Link>
        </p>
        <div className={styles.cards}>
          {careerResearch.map((record) => (
            <CompanyCard key={record.company} record={record} />
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.kicker}>Global finance toolkit</span>
        <h2>Preparing for Cross-Border Finance</h2>
        <p>
          Professional operating experience supports a financial skill set that
          is still developing. These labels describe the evidence behind each
          area, not a claim of mastery.
        </p>
        <div className={styles.frameworkGrid}>
          {competencies.map((group) => (
            <article key={group.category}>
              <span className={styles.badge}>{group.status}</span>
              <h3>{group.category}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className={styles.source}>
          Technology tools are a development path; this panel does not claim
          professional proficiency in every tool.{" "}
          <Link href="/recruiter">
            View experience and completed credentials →
          </Link>
        </p>
      </section>
      <section className={`${styles.section} ${styles.differentiator}`}>
        <span className={styles.kicker}>My operating perspective</span>
        <h2>Finance + Operations + Infrastructure</h2>
        <div
          className={styles.perspective}
          aria-label="Operating experience connects to financial questions"
        >
          {[
            ["Physical systems", "Power · equipment · reliability"],
            ["Operating decisions", "Capacity · logistics · accountability"],
            ["Financial consequences", "Cash flow · capital · operating risk"],
          ].map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p>
          My path into finance includes experience outside the traditional
          finance track. Working in mission-critical data center operations,
          financial administration, and military logistics has given me exposure
          to the physical systems behind financial decisions — infrastructure,
          power, equipment, logistics, inventory, reliability, and operational
          risk.
        </p>
        <p>
          My goal is to combine that operating perspective with financial
          analysis to understand not only what the numbers say, but what is
          happening inside the business producing them.
        </p>
      </section>
    </>
  );
}
export function CareerReadiness() {
  return (
    <>
      <section className={styles.section}>
        <span className={styles.kicker}>
          Direction, not a claim of international experience
        </span>
        <h2>International Readiness</h2>
        <div className={styles.grid}>
          {[
            [
              "Geographic Mobility",
              "Open to relocation and international assignments.",
            ],
            [
              "Cross-Cultural Environment",
              "Interested in working within multinational and geographically distributed teams.",
            ],
            [
              "Global Markets",
              "Actively developing knowledge of international companies, capital markets, currencies, and economic systems.",
            ],
            [
              "Long-Term Objective",
              "Build meaningful professional experience across multiple financial centers and business environments.",
            ],
          ].map(([title, text]) => (
            <article className={styles.card} key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.kicker}>
          Dashboard foundation · data connection planned
        </span>
        <h2>Global Markets I’m Watching</h2>
        <p>
          A future view of the market inputs behind financing, operating, and
          valuation decisions. Recorded observations, sources, and timestamps
          will be required before any quote appears.
        </p>
        <div className={styles.marketGrid}>
          {careerMarketWatch.map((m) => (
            <article key={m.name}>
              <h3>{m.name}</h3>
              <strong aria-label="No recorded value">—</strong>
              <span>{m.status}</span>
              <small>Source / as of: Not Available</small>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.kicker}>
          A conversation about the next step
        </span>
        <h2>Interested in Building Across Markets</h2>
        <p>
          I’m interested in connecting with teams working across corporate
          finance, infrastructure, investment research, treasury, strategic
          finance, and global rotational programs.
        </p>
        <div className={styles.ctaRow}>
          <Link className="button" href="/resume">
            View Resume
          </Link>
          <Link className="button" href="/research">
            View Research
          </Link>
          <a
            className="button"
            href="https://www.linkedin.com/in/shyheim-lee/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <Link className="button" href="/contact">
            Contact Me
          </Link>
        </div>
      </section>
    </>
  );
}
