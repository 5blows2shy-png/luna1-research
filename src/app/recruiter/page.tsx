import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/site";
import styles from "./page.module.css";

const title = "Shy Lee | Finance Analyst • Investment Research • FP&A";
const description =
  "Finance candidate with experience across financial operations, investment research, modeling, and finance automation. Explore selected work, research, and applied finance experience.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/recruiter" },
  openGraph: { title, description, url: "/recruiter", type: "profile" },
  twitter: { card: "summary_large_image", title, description },
};

const snapshot = [
  ["Education", "San Diego State University — Finance"],
  ["Expected graduation", "May 2027"],
  ["Current finance experience", "Executive & Finance Assistant"],
  ["Applied investment experience", "Aztec Investment Fund"],
  ["Professional organization", "CFA Society San Diego — Student Member"],
  ["Additional background", "U.S. Army Veteran"],
  ["Location", "San Diego, California"],
] as const;

const selectedWork = [
  {
    number: "01", label: "Independent research platform", title: "Luna1 Research",
    subtitle: "Equity Research & Investment Framework",
    description: "Fundamental company and industry work connecting earnings, valuation, market structure, catalysts, risk, and portfolio research.",
    href: "/research", action: "View research", status: "Published work",
  },
  {
    number: "02", label: "Financial modeling", title: "Valuation Lab",
    subtitle: "DCF & Scenario Frameworks",
    description: "An interactive discounted-cash-flow sample with transparent assumptions; additional revenue, sensitivity, and comparable-company models remain clearly labeled as planned.",
    href: "/valuation-models", action: "Review model", status: "Interactive sample",
  },
  {
    number: "03", label: "Finance automation", title: "Klyro",
    subtitle: "Transaction & Accounting Workflow",
    description: "A structured workflow for financial imports, transaction review, exception detection, reconciliation support, controlled exports, and decision-oriented cash analysis.",
    href: "/klyro", action: "View project", status: "Working preview",
  },
  {
    number: "04", label: "Applied investment experience", title: "Aztec Investment Fund",
    subtitle: "Student-Managed Investment Fund",
    description: "Equity research, valuation, investment-thesis development, portfolio analysis, and investment decision-making within a student-managed fund. The samples below show company analysis from investment and operating perspectives.",
    status: "2 work samples",
    artifacts: [
      {
        title: "COST Qualitative Investment Memo",
        context: "Equity valuation draft · July 28, 2026",
        href: "/downloads/shy-lee-costco-qualitative-investment-memo.pdf",
      },
      {
        title: "Casey’s Operations & Supply Chain Analysis",
        context: "Related company analysis · BA 360 executive summary",
        href: "/downloads/shy-lee-caseys-operations-supply-chain-analysis.pdf",
      },
    ],
  },
  {
    number: "05", label: "FP&A case study", title: "Planning & Performance",
    subtitle: "Forecasting, Variance & Cash Flow",
    description: "A focused case study for budget-versus-actual analysis, variance drivers, cash-flow planning, and management commentary.",
    status: "In development",
  },
] as const;

const capabilities = [
  {
    number: "01", title: "Financial Modeling",
    applied: ["DCF", "Scenario analysis", "Sensitivity analysis"],
    developing: ["Three-statement modeling", "Revenue forecasting", "Margin analysis", "Cash-flow modeling"],
    href: "/valuation-models", proof: "Review the Valuation Lab",
  },
  {
    number: "02", title: "FP&A / Strategic Finance",
    applied: ["Financial reporting", "Cash-flow planning", "Management and board support", "Business decision support"],
    developing: ["Budget vs actual", "Variance analysis", "KPI analysis"],
    href: "/klyro", proof: "Review the finance workflow",
  },
  {
    number: "03", title: "Investment Research",
    applied: ["Equity research", "Financial-statement analysis", "Earnings analysis", "Valuation", "Thesis development", "Catalyst and risk analysis", "Portfolio monitoring"],
    developing: [], href: "/research", proof: "Review published research",
  },
  {
    number: "04", title: "Finance Automation",
    applied: ["Financial-data processing", "Transaction analysis", "Exception detection", "Reconciliation support", "Workflow automation"],
    developing: ["Python delivery", "Streamlit"], href: "/klyro", proof: "Review the automation workflow",
  },
  {
    number: "05", title: "Data & Analytics",
    applied: ["Excel", "Financial modeling", "Financial-data visualization"],
    developing: ["Power BI", "SQL", "Python"], href: "/valuation-models", proof: "Review analytical work",
  },
] as const;

const experience = [
  {
    company: "Coronado Historical Association", role: "Executive & Finance Assistant", date: "May 2026–Present", relevance: "Financial operations",
    bullets: [
      "Support accrual accounting in QuickBooks Online, including journal entries, deposits, and transaction recordkeeping.",
      "Perform bank and credit-card reconciliations and maintain supporting financial documentation.",
      "Prepare monthly financial reporting and supporting materials for management and board review.",
      "Track restricted and unrestricted funds and organize audit-ready records and controls.",
    ],
  },
  {
    company: "Aztec Investment Fund", role: "Applied Investment Experience", relevance: "Student-managed investment fund",
    bullets: ["Apply equity research, valuation, and investment-thesis development.", "Evaluate portfolio implications, risks, and investment decisions."],
  },
  {
    company: "LightEdge Solutions", role: "Data Center Operations Technician", date: "Nov 2020–Present", relevance: "Mission-critical operations",
    bullets: ["Analyze operational issues and coordinate work in uptime-sensitive environments.", "Follow change controls, document incidents, and maintain audit-ready operating records.", "Apply risk awareness across infrastructure, capacity, and service delivery."],
  },
  {
    company: "U.S. Army", role: "Supply Specialist & Financial Management Technician", date: "Nov 2015–May 2019", relevance: "Financial management & resource accountability",
    bullets: ["Coordinated aviation and ground logistics while supporting budgets, reconciliations, reporting, and accountable resource management.", "Supported financial accountability for more than $10 million in operational expenditures through disciplined recordkeeping and compliance."],
  },
  {
    company: "Wilgus Associates", role: "Junior Reconciliation Accountant", date: "Jun 2014–Jul 2015", relevance: "Reconciliation accounting",
    bullets: ["Maintained ledger accounts, processed transactions, and performed bank reconciliations to support accurate financial records.", "Investigated variances and supported month-end close through reconciliation documentation and reporting.", "Implemented automated reconciliation processes that reduced reconciliation time by 50%."],
  },
] as const;

const organizations = [
  { name: "Aztec Investment Fund", detail: "Student-managed investment fund", status: "Applied investment experience" },
  { name: "CFA Society San Diego", detail: "Student Member", status: "2026–Present" },
  { name: "Bloomberg Market Concepts", detail: "Bloomberg for Education", status: "Completed", href: "/downloads/shy-lee-bloomberg-market-concepts-certificate.pdf" },
  { name: "QuickBooks Online Level 1", detail: "Intuit", status: "Completed" },
  { name: "Microsoft Excel", detail: "Microsoft", status: "Completed" },
  { name: "CFA Level I", detail: "CFA Institute", status: "Planned · August 2027" },
] as const;

const roles = [
  { title: "FP&A / Strategic Finance", proof: "Forecasting · Variance analysis · Cash flow · Decision support" },
  { title: "Corporate Finance / Leadership Programs", proof: "Financial reporting · Planning · Operations · Management support" },
  { title: "Equity Research / Asset Management", proof: "Research · Valuation · Earnings · Thesis and risk" },
  { title: "Treasury", proof: "Cash visibility · Controls · Reconciliation · Risk awareness" },
  { title: "Finance Transformation", proof: "Process analysis · Automation · Financial data · Controls" },
] as const;

function SectionLabel({ number, children }: { number: string; children: string }) {
  return <span className={styles.sectionLabel}><b>{number}</b> {children}</span>;
}

export default function RecruiterView() {
  return <>
    <section className={styles.hero} aria-labelledby="recruiter-title">
      <div className={styles.heroCopy}>
        <span className="eyebrow">Recruiter profile · Finance</span>
        <h1 id="recruiter-title">Shy Lee</h1>
        <p className={styles.professionalLine}>Finance Analyst <i /> Investment Research <i /> FP&amp;A <i /> Financial Automation</p>
        <p className={styles.positioning}>Finance candidate combining real accounting operations, investment research, financial modeling, and Python-based finance automation.</p>
        <ul className={styles.identifiers} aria-label="Professional identifiers">
          <li>SDSU Finance</li><li>Aztec Investment Fund</li><li>CFA Society San Diego</li><li>U.S. Army Veteran</li>
        </ul>
        <div className={styles.actions}>
          <a className="button primary" href="#selected-work">View selected work <span aria-hidden="true">↓</span></a>
          <a className="button" href="/downloads/shy-lee-resume.pdf" download>Download resume <span aria-hidden="true">↓</span></a>
          <Link className="button" href="/contact">Contact <span aria-hidden="true">→</span></Link>
          <a className="button" href="https://www.linkedin.com/in/shyheim-lee/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <aside className={styles.heroBrief} aria-label="Candidate brief">
        <div className={styles.briefTop}><span>Candidate brief</span><b>Available for review</b></div>
        <dl>
          <div><dt>Profile</dt><dd>Finance candidate with operating context</dd></div>
          <div><dt>Primary evidence</dt><dd>Accounting · Research · Models · Automation</dd></div>
          <div><dt>Target functions</dt><dd>FP&amp;A · Corporate Finance · Research</dd></div>
          <div><dt>Review path</dt><dd>Selected work → Resume → Contact</dd></div>
        </dl>
        <p>The evidence below distinguishes applied work from developing capabilities.</p>
      </aside>
    </section>

    <nav className={styles.sectionNav} aria-label="Recruiter page sections">
      <a href="#profile">01 Profile</a><a href="#selected-work">02 Selected work</a><a href="#capabilities">03 Capabilities</a><a href="#experience">04 Experience</a><a href="#investment-experience">05 Investment experience</a><a href="#alignment">06 Career alignment</a>
    </nav>

    <section id="profile" className={styles.snapshotSection}>
      <div className={styles.snapshotHeading}>
        <SectionLabel number="01">Candidate snapshot</SectionLabel>
        <h2>Finance capability grounded in accountable execution.</h2>
        <p>A concise view of education, current finance work, applied investment experience, and operating background.</p>
      </div>
      <dl className={styles.snapshotGrid}>{snapshot.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>

    <section id="selected-work">
      <SectionLabel number="02">Selected work</SectionLabel>
      <SectionHeading eyebrow="Evidence, not claims" title="How I analyze, model, research, and improve financial workflows." copy="Completed work links directly to evidence. Developing work is labeled before publication." />
      <div className={styles.workGrid}>{selectedWork.map((work) => <article className={styles.workCard} key={work.title}>
        <div className={styles.cardMeta}><span>{work.number} · {work.label}</span><b>{work.status}</b></div>
        <div><h3>{work.title}</h3><h4>{work.subtitle}</h4><p>{work.description}</p></div>
        {"artifacts" in work ? <div className={styles.workArtifacts} aria-label="Aztec Investment Fund work samples">
          <span>Related analytical evidence</span>
          {work.artifacts.map((artifact) => <a href={artifact.href} download key={artifact.href}>
            <span><b>{artifact.title}</b><small>{artifact.context}</small></span><i aria-hidden="true">↓</i>
          </a>)}
          <small>Educational work only. The COST memo is a dated draft and is not current market data or investment advice.</small>
        </div> : "href" in work ? <Link className="text-link" href={work.href}>{work.action} <span aria-hidden="true">→</span></Link> : <span className={styles.pendingLink}>Supporting artifact forthcoming</span>}
      </article>)}</div>
    </section>

    <section id="capabilities">
      <SectionLabel number="03">Finance capabilities</SectionLabel>
      <SectionHeading eyebrow="Capability register" title="Every capability points to work—or states that it is developing." copy="Applied indicates direct use in professional, academic, or portfolio work. Developing indicates continued study or an unfinished evidence artifact." />
      <div className={styles.capabilityLedger}>{capabilities.map((capability) => <article key={capability.title}>
        <span>{capability.number}</span><h3>{capability.title}</h3>
        <div><b>Applied</b><ul>{capability.applied.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><b>Developing</b>{capability.developing.length ? <ul>{capability.developing.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Evidence available in published work.</p>}</div>
        <Link className="text-link" href={capability.href}>{capability.proof} <span aria-hidden="true">→</span></Link>
      </article>)}</div>
    </section>

    <section id="experience">
      <SectionLabel number="04">Applied finance experience</SectionLabel>
      <SectionHeading eyebrow="Relevant experience" title="Finance work supported by operating discipline." copy="Focused on the responsibilities and transferable context most relevant to financial analysis and decision support." />
      <div className={styles.experienceLedger}>{experience.map((role, index) => <article key={role.company}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div className={styles.roleIdentity}><small>{role.relevance}</small><h3>{role.company}</h3><b>{role.role}</b>{"date" in role && <time>{role.date}</time>}</div>
        <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
      </article>)}</div>
    </section>

    <section id="investment-experience">
      <SectionLabel number="05">Investment organizations & applied experience</SectionLabel>
      <SectionHeading eyebrow="Professional development" title="Investment participation and finance credentials." copy="An understated record of applied investment work, professional membership, completed credentials, and clearly labeled plans." />
      <div className={styles.organizationList}>{organizations.map((item, index) => <article key={item.name}>
        <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.name}</h3><p>{item.detail}</p></div><b>{item.status}</b>
        {"href" in item ? <a className="text-link" href={item.href} download>View certificate <span aria-hidden="true">↓</span></a> : <span aria-hidden="true" />}
      </article>)}</div>
    </section>

    <section className={styles.differenceSection}>
      <div><span className="eyebrow">Why this profile is different</span><h2>Finance + Operations + Technology</h2></div>
      <div><p className={styles.editorialLead}>My experience sits at the intersection of financial operations, investment analysis, and technology.</p><p>I have worked directly with accounting records and financial reporting, developed investment research through Luna1 and applied investment work, and built tools aimed at making finance workflows more efficient.</p><p>The objective is straightforward: understand the numbers, identify what matters, and communicate the financial implications clearly.</p></div>
    </section>

    <section id="alignment">
      <SectionLabel number="06">Career alignment</SectionLabel>
      <SectionHeading eyebrow="Shared analytical foundation" title="Roles connected by the same finance disciplines." copy="Financial analysis, forecasting, valuation, decision support, and financial operations provide the common thread." />
      <div className={styles.roleGrid}>{roles.map((role, index) => <article key={role.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{role.title}</h3><p>{role.proof}</p></article>)}</div>
    </section>

  </>;
}
