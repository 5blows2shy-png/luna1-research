import Image from "next/image";
import { PageHeader } from "@/components/site";

const roles = [
  { date: "May 2026–Present", company: "Coronado Historical Association", title: "Executive & Finance Assistant", bullets: [
    "Support accrual-basis accounting activities in QuickBooks Online, including transaction recording, journal entries, accounts payable processing, and monthly bank and credit-card reconciliations.",
    "Prepare financial reports, supporting schedules, and board materials used for budgeting, cash-flow planning, and executive decision-making.",
    "Maintain audit-ready financial records, organize supporting documentation, and assist with tracking restricted and unrestricted funds in accordance with nonprofit accounting requirements.",
  ]},
  { date: "Nov 2020–Present", company: "LightEdge Solutions", title: "Data Center Operations Technician / NOC Technician", bullets: [
    "Diagnose and resolve network outages, connectivity issues, latency, hardware failures, and security alerts across routers, switches, servers, and storage systems.",
    "Support cloud-storage and VMware virtualized environments by monitoring virtual machines, managing storage access, troubleshooting connectivity and performance issues, and documenting incidents through ticketing systems.",
    "Provision customer infrastructure, including server installations, rack-and-stack deployments, structured cabling, IP connectivity, storage access, and remote-hands support.",
    "Support firewall rule changes, port configurations, network access requests, and connectivity testing while following change-management and cybersecurity procedures.",
  ]},
  { date: "Nov 2015–May 2019", company: "United States Army", title: "Supply Specialist & Financial Management Technician", bullets: [
    "Coordinated fuel supply operations supporting aviation and ground missions, ensuring timely distribution of petroleum products to maintain operational readiness.",
    "Managed inventory tracking, storage, accountability, and documentation for inventory, equipment, and mission-critical supplies across daily logistics operations.",
    "Supported operations planning by coordinating deliveries, equipment movement, supply requests, and aviation-support documentation.",
    "Assisted with tracking and reporting more than $10 million in operational expenditures supporting unit financial operations.",
    "Maintained financial records, processed transactions, and ensured proper documentation for reporting and compliance.",
    "Supported reconciliation of financial transactions and assisted with tracking expenses and budgets.",
    "Prepared financial reports and assisted leadership with budgeting and cost monitoring.",
  ]},
  { date: "Jun 2014–Jul 2015", company: "Wilgus Associates", title: "Junior Reconciliation Accountant", bullets: [
    "Maintained ledger accounts, processed transactions, and performed bank reconciliations to ensure accuracy.",
    "Investigated discrepancies between financial reports and supporting documentation.",
    "Assisted with month-end close, including reconciliation documentation and reporting support.",
    "Implemented automated reconciliation processes that reduced reconciliation time by 50%.",
  ]},
];

export default function Resume() {
  // TODO: Add a resume download only after a privacy-safe, redacted PDF is provided.
  return <>
    <PageHeader kicker="Resume" title="Shy Lee" description="Finance professional and U.S. Army veteran with experience in fundamental investment research, financial analysis, nonprofit finance, and mission-critical operations. Skilled in evaluating company fundamentals, valuation, industry dynamics, and risk to develop investment theses and support capital-allocation decisions. Brings analytical rigor, disciplined execution, and a differentiated operational perspective to investment management, portfolio strategy, and financial planning." />
    <section className="resume-layout">
      <aside>
        <div className="profile-card resume-profile"><span className="eyebrow">Shy Lee · Founder</span><Image className="profile-photo" src="/shyheim-lee-founder.jpeg" alt="Portrait of Shy Lee, founder of Luna1 Research" width={400} height={400} sizes="(max-width: 760px) calc(100vw - 86px), 300px" priority/><dl><div><dt>Education</dt><dd>B.S. Finance · SDSU, expected 2027<br/>A.S. Business Administration · Miramar College, 2024</dd></div><div><dt>Research focus</dt><dd>Infrastructure, Compounders, Inflections, Bottle Neck Constraint Analysis</dd></div></dl></div>
        <span className="eyebrow">Organization</span>
        <h3>Aztec Investment Fund (AIF)</h3><p>Conduct fundamental equity research and develop investment theses across financial performance, valuation, and industry trends. Presented an AI infrastructure thesis leveraging more than five years of data center operations experience to identify investment opportunities across the AI compute and infrastructure value chain.</p>
        <span className="eyebrow">Technical skills</span><p>QuickBooks Online Level 1<br/>Bloomberg Market Concepts<br/>Financial statement analysis<br/>Budgeting and forecasting<br/>Account reconciliation<br/>Financial modeling and valuation</p>
      </aside>
      <div className="timeline"><span className="eyebrow">Professional experience</span>{roles.map((role) => <article key={role.company}><time>{role.date}</time><div><h2>{role.company}</h2><h3>{role.title}</h3><ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div>
    </section>
  </>;
}
