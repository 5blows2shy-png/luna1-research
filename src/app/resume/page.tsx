import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RecruiterActions } from "@/components/recruiter-actions";
import {
  careerProgression,
  coreStrengths,
  platformPillars,
  professionalPositioning,
} from "@/lib/professional-profile";

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

type ResumeContentProps = {
  portraitSrc?: string;
  recruiterView?: boolean;
};

export function ResumeContent({
  portraitSrc = "/shyheim-lee-founder.jpeg",
  recruiterView = false,
}: ResumeContentProps) {
  const sectionIndex = recruiterView
    ? [
        "Summary",
        "Progression",
        "Strengths",
        "Projects",
        "Experience",
        "Education",
        "Certifications",
        "Philosophy",
      ]
    : [
        "Summary",
        "Experience",
        "Education",
        "Certifications",
        "Philosophy",
      ];

  return (
    <>
      <section className="recruiter-hero">
        <div>
          <span className="eyebrow">
            {recruiterView ? "Recruiter View · Why hire me?" : "Resume · Shy Lee"}
          </span>
          <p className="recruiter-status">
            <i /> Open to finance, investment research, and analyst
            opportunities
          </p>
          <h1>
            {recruiterView ? "An analyst’s process." : "Finance discipline."}
            <br />
            <em>
              {recruiterView
                ? "An operator’s perspective."
                : "Operational perspective."}
            </em>
          </h1>
          <p className="recruiter-lead">
            {recruiterView
              ? professionalPositioning
              : "U.S. Army veteran and finance professional combining equity research, accounting, financial analysis, and five-plus years inside mission-critical data center operations."}
          </p>
          <RecruiterActions />
        </div>
        <aside className="recruiter-brief" aria-label="Candidate snapshot">
          <span className="eyebrow">Shy Lee · Founder</span>
          <Image
            className="profile-photo"
            src={portraitSrc}
            alt="Portrait of Shy Lee, founder of Klyro"
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
        {sectionIndex.map((label) => (
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
      {recruiterView && (
        <>
          <section id="progression">
            <header className="recruiter-section-head">
              <span className="eyebrow">Career progression</span>
              <h2>Experience that compounds into analytical judgment.</h2>
              <p>
                No role is overstated. Each stage contributed a distinct layer
                of operating, accounting, financial, or investment context.
              </p>
            </header>
            <ol className="career-progression recruiter-progression">
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
          <section id="strengths">
            <header className="recruiter-section-head">
              <span className="eyebrow">Core strengths</span>
              <h2>Capabilities demonstrated through the work.</h2>
            </header>
            <div className="recruiter-strength-grid">
              {coreStrengths.map((strength, index) => (
                <article key={strength.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{strength.title}</h3>
                  <p>{strength.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="projects">
            <header className="recruiter-section-head">
              <span className="eyebrow">Projects · Klyro capabilities</span>
              <h2>One platform. Five forms of analytical evidence.</h2>
              <p>
                Klyro is a professional research portfolio—not a startup or a
                commercial software claim.
              </p>
            </header>
            <div className="recruiter-capability-grid">
              {platformPillars
                .filter(({ href }) => href !== "/transaction-intelligence")
                .map((pillar) => (
                  <Link href={pillar.href} key={pillar.title}>
                    <span>{pillar.number}</span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.purpose}</p>
                    <b>Review evidence →</b>
                  </Link>
                ))}
            </div>
          </section>
        </>
      )}
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
            <b>Advanced Finance Coursework</b>
            <p>Aztec Investment Fund – Equity Research &amp; Portfolio Management</p>
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
      </section>
    </>
  );
}

export default function Resume() {
  return <ResumeContent />;
}
