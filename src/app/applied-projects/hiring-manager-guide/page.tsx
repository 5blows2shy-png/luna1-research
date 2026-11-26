import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectBrand } from '@/components/applied-finance/project-brand';
import styles from '@/components/applied-finance/project.module.css';
import guide from './page.module.css';
export const metadata: Metadata = { title: 'Hiring Manager Guide | Luna1 Research', description: 'Architecture, design decisions, evidence and a review guide for Luna1 CloudSpend, Lee Data Center and WD-40 research.', alternates: { canonical: '/applied-projects/hiring-manager-guide' } };
const projects = [
 { title: 'Luna1 CloudSpend', skill: 'FinOps · Operations analytics', text: 'Translate cloud consumption into cost ownership, forecasts and safeguarded optimization candidates.', href: '/cloudspend', action: 'Explore CloudSpend', review: 'Change a provider filter, reconcile showback to selected spend, then inspect the CPU, memory and performance evidence behind a rightsizing candidate.' },
 { title: 'Lee Data Center', skill: 'Project finance · Capital allocation', text: 'Underwrite a hypothetical 10 MW site investment with operating cash flow, debt service and equity returns.', href: '/recruiter/projects/lee-data-center', action: 'Review the Lee model', review: 'Raise the power price and inspect EBITDA, DSCR and equity returns. Compare sourcing costs separately, then download the formula-based Excel model and Power BI project.' },
 { title: 'WD-40 company research', skill: 'Equity research · Strategic analysis', text: 'Review the separate company and business-mapping workstream for the SDSU CFA Institute Research Challenge.', href: '/recruiter/research-challenge', action: 'Read the research profile', review: 'Review business model, geographic exposure, competitive positioning and the disclosed scope of the company-analysis role. Distinguish published material from team work in progress.' },
];
function Flow({title,steps}:{title:string;steps:readonly (readonly [string,string])[]}) {return <figure><figcaption><h3>{title}</h3></figcaption><ol className={guide.flow}>{steps.map(([label,text])=><li key={label}><strong>{label}</strong><span>{text}</span></li>)}</ol></figure>;}
export default function HiringManagerGuide(){return <article className={`${styles.page} ${styles.flagshipPage}`}>
<header><ProjectBrand/><p className={styles.meta}>Portfolio README · Architecture & decision evidence</p><h1>From infrastructure to financial decisions.</h1><p className={guide.intro}>A hiring manager’s guide to Shy Lee’s applied work: inspect the system, understand the assumptions and test the decisions. These projects connect NOC and data-center experience with finance, research and analytical software.</p><nav className={guide.links} aria-label="Guide resources"><Link href="/applied-projects">Applied Projects</Link><Link href="/recruiter">Professional Resume</Link><a href="/downloads/luna1-portfolio-README.md" download>Download portfolio README</a></nav></header>
<section className={styles.projectSection}><h2>A five-minute review</h2><div className={guide.grid}>{projects.map(p=><section className={guide.card} key={p.title}><p className={styles.meta}>{p.skill}</p><h3>{p.title}</h3><p>{p.text}</p><p><strong>Try this:</strong> {p.review}</p><Link href={p.href}>{p.action}</Link></section>)}</div></section>
<section className={styles.projectSection}><h2>Architecture you can inspect</h2><p>The diagrams describe the implemented portfolio workflows. Interactive calculations run in the browser; downloadable reporting artifacts are generated separately.</p>
<Flow title="CloudSpend · billing data to an operational decision" steps={[
 ['Inputs','Reproducible AWS, Azure and VMware demo data, or a user-selected daily FOCUS-subset CSV.'],
 ['Validation','Check schema, currency, dates, coverage and duplicates before replacing the active dataset.'],
 ['Analysis','Typed calculation functions produce spend, allocation, forecasts and anomaly signals. Separate simulated telemetry supports VM review.'],
 ['Decision & export','Interactive charts, showback CSVs and review candidates. Imported billing data stays in tab memory; refresh clears it.'],
]}/>
<Flow title="Lee Data Center · assumptions to investment evidence" steps={[
 ['Assumptions','10 MW phased development; disclosed site inputs, operating assumptions, debt terms and sensitivity drivers.'],
 ['Model engines','Operating cash flow, debt schedule, DSCR and equity returns; separate enterprise sourcing-cost analysis.'],
 ['Interactive review','Edit assumptions and compare scenarios, power prices and infrastructure options in the browser.'],
 ['Evidence package','Excel formulas, CSV exports and a generated five-page Power BI project. Workbook and report are fixed artifacts, not live browser sync.'],
]}/></section>
<section className={styles.projectSection}><h2>Why it is designed this way</h2><dl className={guide.decisions}>
<div><dt>Keep financial logic separate from the interface</dt><dd>Typed model functions can be tested independently of charts. This makes cash-flow reconciliation and edge cases easier to inspect.</dd></div>
<div><dt>Make local billing analysis explicit</dt><dd>CloudSpend does not request cloud credentials or upload billing records to an application server. Tab-memory processing reduces setup and exposure, but does not provide persistence or scheduled ingestion.</dd></div>
<div><dt>Separate actuals, forecasts and savings</dt><dd>A run-rate estimate is not an actual expense. Gross optimization potential is not realized savings. Billed and effective costs are alternative measures, never added together.</dd></div>
<div><dt>Protect performance before proposing a smaller VM</dt><dd>CPU averages alone are insufficient. The simulated review checks memory, peaks, p95 demand, coverage, minimum specifications, latency and I/O. Billing imports alone cannot enable rightsizing.</dd></div>
<div><dt>Separate enterprise cost from landlord returns</dt><dd>Cloud, colocation and owned infrastructure compare enterprise cash costs for a common provisioned workload. They do not mix tenant sourcing costs with Lee’s landlord revenue or equity returns.</dd></div>
<div><dt>Keep uncertainty visible</dt><dd>Illustrative prices, hypothetical infrastructure, incomplete evidence and report limitations are labeled alongside the outputs. No employer cost savings or live deployments are claimed.</dd></div>
</dl></section>
<section className={styles.projectSection}><h2>Evidence behind the presentation</h2><p>Review the implementation and tests alongside the live workflows. The repository documents how to run lint, strict TypeScript checks, unit tests and the production build.</p><ul>
<li><a href="https://github.com/5blows2shy-png/luna1-research/blob/main/docs/cloudspend/README.md">CloudSpend architecture, financial definitions and safeguards</a></li>
<li><a href="https://github.com/5blows2shy-png/luna1-research/blob/main/reports/lee-data-center/infrastructure-validation.md">Lee sourcing and power-sensitivity validation</a></li>
<li><a href="https://github.com/5blows2shy-png/luna1-research/tree/main/tests">Calculation and ingestion tests</a></li>
<li><a href="/downloads/lee-data-center-power-bi.zip" download>Current 10 MW Power BI project</a></li>
</ul><p className={styles.note}>Repository links may require GitHub access. The website and downloadable portfolio README provide the reviewer’s overview without requiring source access.</p></section>
<section className={styles.projectSection}><h2>Scope and next engineering steps</h2><p>CloudSpend is a browser-local portfolio application, not a production multi-tenant billing service. Its FOCUS support is a documented subset, not certification. Production extensions would require authenticated tenant boundaries, secure ingestion, persistence, monitoring and operational approval workflows.</p><p>Lee is a hypothetical underwriting exercise. Provider prices in the sourcing comparison are illustrative, not quotes or workload benchmarks. Power BI data and report definitions are validated; native Power BI Desktop rendering, DAX execution and refresh remain unverified.</p><p className={styles.note}>Educational portfolio work. No confidential employer information, realized employer savings or personalized investment advice is represented. Research scope and publication status remain disclosed on each project page.</p></section>
</article>;}
