"use client";
import { PageHeader } from "@/components/site";

const roles = [
  { date: "May 2026–Present", company: "Coronado Historical Association", location: "Coronado, California", title: "Executive & Finance Assistant", bullets: [
    "Support accrual-based accounting operations in QuickBooks Online, including transaction recording, journal entries, bill processing, and monthly reconciliations.",
    "Prepare financial reports, supporting schedules, and Board materials to support budgeting, planning, and executive decision-making.",
    "Maintain audit trails and financial documentation while supporting compliance for restricted and unrestricted nonprofit funds.",
  ]},
  { date: "Nov 2020–Present", company: "LightEdge Solutions", location: "San Diego, California", title: "Data Center Network Operations Technician", bullets: [
    "Support daily data center operations by monitoring infrastructure, coordinating service requests, and maintaining records across network and facility systems.",
    "Assist cloud and colocation customers through equipment tracking, access coordination, ticket updates, and operational issue resolution.",
    "Maintain records for installs, removals, migrations, maintenance, assets, and work orders to support compliance and audit readiness.",
    "Coordinate with network, facilities, security, and customer support teams to resolve discrepancies and maintain service continuity.",
  ]},
  { date: "Nov 2015–May 2019", company: "United States Army", location: "Fort Campbell, Kentucky", title: "Supply Specialist & Financial Management Technician", bullets: [
    "Coordinated fuel supply operations supporting aviation and ground missions while maintaining inventory, storage, accountability, and documentation.",
    "Supported operational planning through fuel deliveries, equipment movement, supply requests, and aviation-support documentation.",
    "Assisted with tracking and reporting more than $10 million in operational expenditures, financial transactions, reconciliations, budgets, and compliance records.",
    "Prepared financial reports and supported leadership with budgeting and cost monitoring.",
  ]},
  { date: "Jun 2014–Jul 2015", company: "Wilgus Associates", location: "Bethany Beach, Delaware", title: "Junior Reconciliation Accountant", bullets: [
    "Maintained ledger accounts, processed transactions, and performed bank reconciliations to ensure accuracy.",
    "Investigated discrepancies between financial reports and supporting documentation and assisted with month-end close.",
    "Implemented automated reconciliation processes that reduced reconciliation time by 50%.",
  ]},
];

export default function Resume() {
  return <>
    <PageHeader kicker="Resume" title="Shy Lee" description="Finance professional and U.S. Army veteran with experience spanning fundamental investment research, financial analysis, nonprofit finance, and mission-critical operations. Skilled in evaluating company fundamentals, valuation, industry dynamics, and risk to develop investment theses and support informed capital allocation decisions." />
    <section className="resume-actions"><div><span>Escondido, California</span><a href="mailto:leeshyheim@yahoo.com">leeshyheim@yahoo.com</a></div><div><button className="button primary" onClick={() => window.print()}>Print resume</button></div></section>
    <section className="resume-layout">
      <aside>
        <span className="eyebrow">Education</span>
        <h3>San Diego State University</h3><p>Fowler College of Business<br/>Bachelor of Science in Finance<br/>Expected 2027</p>
        <h3>San Diego Miramar College</h3><p>Associate of Science in Business Administration<br/>Graduated 2024</p>
        <span className="eyebrow">Organization</span>
        <h3>Aztec Investment Fund</h3><p>Conduct fundamental equity research and develop investment theses across financial performance, valuation, and industry trends. Presented an AI infrastructure thesis leveraging more than five years of data center operations experience to identify opportunities across the AI compute and infrastructure value chain.</p>
        <span className="eyebrow">Core perspective</span><p>Analytical rigor, disciplined execution, and an operational perspective applied to investment management, portfolio strategy, and financial planning.</p>
      </aside>
      <div className="timeline"><span className="eyebrow">Professional experience</span>{roles.map((role) => <article key={role.company}><time>{role.date}</time><div><h2>{role.company}</h2><h3>{role.title} · {role.location}</h3><ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div>
    </section>
  </>;
}
