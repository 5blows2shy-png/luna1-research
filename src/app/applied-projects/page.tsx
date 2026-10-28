import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectPreviews } from '@/components/applied-finance/project-previews';
import { ProfessionalCasePreviews } from '@/components/applied-finance/professional-case-previews';
import { ProjectBrand } from '@/components/applied-finance/project-brand';
import styles from '@/components/applied-finance/project.module.css';
export const metadata: Metadata = { title: 'Applied Projects | Luna1 Research', description: 'Financial operations, infrastructure investment and equity research work samples with transparent evidence and assumptions.', alternates: {canonical:'/applied-projects'} };
export default function AppliedProjectsPage(){return <article className={`${styles.page} ${styles.flagshipPage}`}>
<header><div className={styles.brandHeading}><ProjectBrand/><span className={styles.meta}>Models · Evidence · Investment decisions</span></div><h1>Applied Projects</h1><p>Financial operations, infrastructure investment and equity research. Explore the analysis, inspect the assumptions and download the supporting work.</p><Link href='/recruiter'>Professional Resume →</Link></header>
<ProjectPreviews/><ProfessionalCasePreviews/>
<section><h2>Company and strategic research</h2><p>WD-40 Company research workstream for the SDSU CFA Institute Research Challenge. Role and scope are owner-provided; completed valuation is not implied.</p><Link href='/recruiter/research-challenge'>Explore WD-40 research →</Link></section>
<p className={styles.note}>Educational portfolio work. Hypothetical model results are not employer results, investment recommendations or evidence of secured financing.</p>
</article>;}
