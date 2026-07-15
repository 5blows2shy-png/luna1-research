import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RecruiterActions } from "@/components/recruiter-actions";
import { research } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume and professional profile for Shy Lee: finance, equity research, operations, and military experience.",
};

const experience = [
  {
    date: "May 2026–Present",
    company: "Coronado Historical Association",
    title: "Executive & Finance Assistant",
    bullets: [
      "Support accrual-basis accounting activities in QuickBooks Online, including transaction recording, journal entries, accounts payable processing, and monthly bank and credit-card reconciliations.",
      "Prepare financial reports, supporting schedules, and board materials used for budgeting, cash-flow planning, and executive decision-making.",
      "Maintain audit-ready financial records, organize supporting documentation, and assist with tracking restricted and unrestricted funds in accordance with nonprofit accounting requirements.",
    ],
  },
  {
    date: "Nov 2020–Present",
    company: "LightEdge Solutions",
    title: "Data Center Operations Technician / NOC Technician",
    bullets: [
      "Diagnose and resolve network outages, connectivity issues, latency, hardware failures, and security alerts across routers, switches, servers, and storage systems.",
      "Support cloud-storage and VMware virtualized environments by monitoring virtual machines, managing storage access, troubleshooting connectivity and performance issues, and documenting incidents through ticketing systems.",
      "Provision customer infrastructure, including server installations, rack-and-stack deployments, structured cabling, IP connectivity, storage access, and remote-hands support.",
      "Support firewall rule changes, port configurations, network access requests, and connectivity testing while following change-management and cybersecurity procedures.",
    ],
  },
  {
    date: "Nov 2015–May 2019",
    company: "United States Army",
    title: "Supply Specialist & Financial Management Technician",
    bullets: [
      "Coordinated fuel supply operations supporting aviation and ground missions while managing accountable inventory, equipment, and mission-critical supplies.",
      "Assisted with tracking and reporting more than $10 million in operational expenditures supporting unit financial operations.",
      "Maintained financial records, processed transactions, supported reconciliations, and prepared reports for budgeting, cost monitoring, and compliance.",
    ],
  },
  {
    date: "Jun 2014–Jul 2015",
    company: "Wilgus Associates",
    title: "Junior Reconciliation Accountant",
    bullets: [
      "Maintained ledger accounts, processed transactions, and performed bank reconciliations to ensure accuracy.",
      "Investigated discrepancies and supported month-end close through reconciliation documentation and reporting.",
      "Implemented automated reconciliation processes that reduced reconciliation time by 50%.",
    ],
  },
] as const;

const models = [
  [
    "Discounted cash flow",
    "Revenue, margin, tax, discount-rate, and terminal-growth sensitivities.",
  ],
  [
    "Comparable companies",
    "Peer multiples organized around growth, profitability, cash conversion, and expectations.",
  ],
  [
    "Scenario analysis",
    "Base, upside, and downside cases with explicit catalysts, risks, and invalidation points.",
  ],
] as const;

export default function Resume() {
  return (
    <>
      <section className="recruiter-hero">
        <div>
          <span className="eyebrow">Resume · Shy Lee</span>
          <p className="recruiter-status">
            <i /> Open to finance, investment research, and analyst
            opportunities
          </p>
          <h1>
            Finance discipline.
            <br />
            <em>Operational perspective.</em>
          </h1>
          <p className="recruiter-lead">
            U.S. Army veteran and finance professional combining equity
            research, accounting, financial analysis, and five-plus years inside
            mission-critical data center operations.
          </p>
          <RecruiterActions />
        </div>
        <aside className="recruiter-brief" aria-label="Candidate snapshot">
          <span className="eyebrow">Shy Lee · Founder</span>
          <Image
            className="profile-photo"
            src="/shyheim-lee-founder.jpeg"
            alt="Portrait of Shy Lee, founder of Luna1 Research"
            width={400}
            height={400}
            sizes="(max-width: 900px) calc(100vw - 118px), 360px"
            priority
          />
          <span className="eyebrow">Candidate brief</span>
          <dl>
            <div>
              <dt>Focus</dt>
              <dd>Equity research · FP&amp;A · Finance</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>B.S. Finance, expected 2027</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>Accounting · Operations · Military</dd>
            </div>
            <div>
              <dt>Research focus</dt>
              <dd>
                Infrastructure, Compounders, Inflections, Bottle Neck Constraint
                Analysis
              </dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Professional inquiries via contact form</dd>
            </div>
          </dl>
        </aside>
      </section>
      <nav className="recruiter-index" aria-label="Resume sections">
        {[
          "Summary",
          "Experience",
          "Education",
          "Certifications",
          "Research",
          "Models",
          "Philosophy",
          "Framework",
          "Portfolio",
          "Journal",
          "Timeline",
          "Contact",
        ].map((label) => (
          <a key={label} href={`#${label.toLowerCase()}`}>
            {label}
          </a>
        ))}
      </nav>
      <section id="summary" className="recruiter-split">
        <div>
          <span className="eyebrow">Professional summary</span>
          <h2>Analysis grounded in accountable execution.</h2>
        </div>
        <div>
          <p className="recruiter-pull">
            I translate complex operating and financial information into clear
            decisions, with a process shaped by military accountability,
            hands-on infrastructure work, and fundamental investment research.
          </p>
          <p>
            My work connects financial statements to the business beneath them:
            revenue drivers, margin structure, capital allocation, industry
            constraints, valuation, and the evidence that would change a thesis.
          </p>
          <p>
            Core capabilities include Financial statement analysis, Budgeting
            and forecasting, Account reconciliation, financial modeling,
            valuation, and investment-thesis development.
          </p>
        </div>
      </section>
      <section id="experience">
        <header className="recruiter-section-head">
          <span className="eyebrow">Experience</span>
          <h2>Professional experience</h2>
        </header>
        <div className="recruiter-timeline">
          {experience.map((role, i) => (
            <article key={role.company}>
              <span className="recruiter-number">0{i + 1}</span>
              <time>{role.date}</time>
              <div>
                <h3>{role.company}</h3>
                <b>{role.title}</b>
                <ul>
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="recruiter-duo">
        <div id="education">
          <span className="eyebrow">Education</span>
          <h2>Finance foundation</h2>
          <div className="credential">
            <b>SDSU</b>
            <span>Fowler College of Business</span>
            <p>Bachelor of Science in Finance · Expected 2027</p>
          </div>
          <div className="credential">
            <b>Miramar College</b>
            <p>Associate of Science in Business Administration · 2024</p>
          </div>
          <div className="credential">
            <b>Aztec Investment Fund (AIF)</b>
            <p>
              Fundamental equity research and investment-thesis development,
              including an AI infrastructure thesis informed by data center
              operating experience.
            </p>
          </div>
        </div>
        <div id="certifications">
          <span className="eyebrow">Certifications</span>
          <h2>Applied development</h2>
          <div className="credential-list">
            <div>
              <b>QuickBooks Online Level 1</b>
              <span>Completed</span>
            </div>
            <div>
              <b>Bloomberg Market Concepts</b>
              <span>Completed</span>
            </div>
            <div>
              <b>Microsoft Excel</b>
              <span>Completed</span>
            </div>
            <div>
              <b>SIE</b>
              <span>Planned</span>
            </div>
          </div>
          <Link className="text-link" href="/certifications">
            View certification roadmap →
          </Link>
        </div>
      </section>
      <section id="research">
        <header className="recruiter-section-head">
          <span className="eyebrow">Featured research</span>
          <h2>Businesses worth understanding.</h2>
          <p>
            Illustrative research records demonstrate the structure of the Luna1
            process; values are not real-time market data.
          </p>
        </header>
        <div className="recruiter-research">
          {research.slice(0, 3).map((item, i) => (
            <Link
              href={`/research/${item.ticker.toLowerCase()}`}
              key={item.ticker}
            >
              <span>
                0{i + 1} · {item.industry}
              </span>
              <h3>
                {item.ticker} / {item.company}
              </h3>
              <p>{item.catalyst}</p>
              <b>{item.classification} →</b>
            </Link>
          ))}
        </div>
      </section>
      <section id="models">
        <header className="recruiter-section-head">
          <span className="eyebrow">Financial models</span>
          <h2>Valuation with visible assumptions.</h2>
        </header>
        <div className="model-list">
          {models.map(([title, copy], i) => (
            <div className="model-line" key={title}>
              <span>0{i + 1}</span>
              <div>
                <b>{title}</b>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
        <Link className="text-link" href="/financial-models">
          Explore financial models →
        </Link>
      </section>
      <section id="philosophy" className="recruiter-quote">
        <span className="eyebrow">Investment philosophy</span>
        <blockquote>
          “A thesis is not a story to defend. It is a hypothesis to update as
          evidence changes.”
        </blockquote>
        <p>
          Start with business change. Test it through earnings, competitive
          position, institutional recognition, valuation, technical structure,
          and explicit risk rules.
        </p>
        <Link className="text-link" href="/investment-philosophy">
          Read the full philosophy →
        </Link>
      </section>
      <section id="framework" className="recruiter-split">
        <div>
          <span className="eyebrow">LUNA Framework</span>
          <h2>A repeatable structure for evidence and risk.</h2>
        </div>
        <div>
          <p className="recruiter-pull">
            Layered Understanding of Narrative Acceleration organizes business
            fundamentals, competitive position, institutional sponsorship,
            valuation, technical structure, and risk into one documented
            research process.
          </p>
          <p>
            The framework is educational and supports research prioritization;
            it is not a personalized investment recommendation.
          </p>
          <Link className="button" href="/luna1-framework">
            Explore the LUNA Framework <span>→</span>
          </Link>
        </div>
      </section>
      <section id="portfolio" className="recruiter-split">
        <div>
          <span className="eyebrow">Portfolio</span>
          <h2>Conviction made accountable.</h2>
        </div>
        <div>
          <p className="recruiter-pull">
            Every position begins with a written thesis, an evidence checklist,
            a defined add level, and a clear invalidation rule.
          </p>
          <p>
            Public portfolio examples are manually updated and educational only.
            They do not represent real-time brokerage data or personalized
            investment advice.
          </p>
          <Link className="button" href="/portfolios">
            View portfolio methodology <span>→</span>
          </Link>
        </div>
      </section>
      <section id="journal">
        <header className="recruiter-section-head">
          <span className="eyebrow">Portfolio · Mistake Journal</span>
          <h2>Process improves when errors become data.</h2>
        </header>
        <div className="journal-method">
          <div>
            <span>01</span>
            <b>Record</b>
            <p>
              Capture the decision, evidence available, and emotional context
              without rewriting history.
            </p>
          </div>
          <div>
            <span>02</span>
            <b>Classify</b>
            <p>
              Separate analytical, sizing, timing, execution, and process
              errors.
            </p>
          </div>
          <div>
            <span>03</span>
            <b>Correct</b>
            <p>
              Translate the lesson into a checklist, threshold, or repeatable
              portfolio rule.
            </p>
          </div>
        </div>
        <Link className="text-link" href="/portfolio/mistake-journal">
          Open portfolio decision reviews →
        </Link>
      </section>
      <section id="timeline">
        <header className="recruiter-section-head">
          <span className="eyebrow">Timeline</span>
          <h2>A career built across finance and operations.</h2>
        </header>
        <div className="career-line">
          <div>
            <time>2014</time>
            <b>Accounting</b>
          </div>
          <div>
            <time>2015</time>
            <b>U.S. Army</b>
          </div>
          <div>
            <time>2020</time>
            <b>Data centers</b>
          </div>
          <div>
            <time>2024</time>
            <b>Business degree</b>
          </div>
          <div>
            <time>2026</time>
            <b>Finance &amp; research</b>
          </div>
          <div>
            <time>2027</time>
            <b>B.S. Finance</b>
          </div>
        </div>
      </section>
      <section id="contact" className="recruiter-contact">
        <div>
          <span className="eyebrow">Contact</span>
          <h2>Start a professional conversation.</h2>
          <p>
            Recruiting inquiries are welcome through the secure site contact
            form. Private contact details are intentionally not published.
          </p>
        </div>
        <Link className="button primary" href="/contact">
          Contact Shy <span>↗</span>
        </Link>
      </section>
    </>
  );
}
