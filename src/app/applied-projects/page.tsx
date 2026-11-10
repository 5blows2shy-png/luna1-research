import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectPreviews } from '@/components/applied-finance/project-previews';
import { ProfessionalCasePreviews } from '@/components/applied-finance/professional-case-previews';
import { ProjectBrand } from '@/components/applied-finance/project-brand';
import styles from '@/components/applied-finance/project.module.css';
export const metadata: Metadata = { title: 'Applied Projects | Luna1 Research', description: 'Financial operations, infrastructure investment and equity research work samples with transparent evidence and assumptions.', alternates: {canonical:'/applied-projects'} };
export default function AppliedProjectsPage(){return <article className={`${styles.page} ${styles.flagshipPage}`}>
<header><div className={styles.brandHeading}><ProjectBrand/><span className={styles.meta}>Models · Evidence · Investment decisions</span></div><h1>Applied Projects</h1><p>Financial operations, infrastructure investment and equity research. Explore the analysis, inspect the assumptions and download the supporting work.</p><Link href='/recruiter'>Professional Resume →</Link></header>
<ProjectPreviews/>
<section className={styles.projectSection} aria-labelledby="energy-research-title">
<span className={styles.meta}>Independent research brief · November 10, 2026</span>
<h2 id="energy-research-title">How Rising Data Center Electricity Demand Is Reshaping Clean Energy Investment</h2>
<p>A two-page analysis of clean-power procurement, grid constraints and investment underwriting, with a hypothetical 10 MW electricity-cost example and downside considerations.</p>
<a href="/downloads/data-center-electricity-clean-energy-analysis.docx" download>Download two-page clean energy analysis (Word) →</a>
<p className={styles.note}>Public-source research and illustrative calculations. The operating example does not represent an actual facility or employer results.</p>
<details><summary>Research sources</summary><ul>
<li><a href="https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary">IEA · Key Questions on Energy and AI (2026)</a></li>
<li><a href="https://eta.lbl.gov/publications/united-states-data-center-energy-2025">Berkeley Lab · United States Data Center Energy Usage Report 2025 Update (June 2026)</a></li>
<li><a href="https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai">IEA · Energy supply for AI (2025)</a></li>
<li><a href="https://eta.lbl.gov/publications/queued-2026-edition-characteristics">Berkeley Lab · Queued Up 2026 Edition</a></li>
</ul></details>
</section>
<ProfessionalCasePreviews/>
<p className={styles.note}>Educational portfolio work. Hypothetical model results are not employer results, investment recommendations or evidence of secured financing.</p>
</article>;}
