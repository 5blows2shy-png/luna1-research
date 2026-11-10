import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectBrand } from '@/components/applied-finance/project-brand';
import { LeeModel } from '@/components/applied-finance/lee-model';
import { LeeExpansionCase } from '@/components/applied-finance/lee-expansion-case';
import { LeeSiteCase } from '@/components/applied-finance/lee-site-case';
import { leeTitle,leeDisclosure,leeHref } from '@/lib/lee-data-center';
import styles from '@/components/applied-finance/project.module.css';
export const metadata:Metadata={title:`${leeTitle} | Luna1 Research`,description:'Listed-land acquisition and 10 MW development underwriting with site diligence, debt coverage, formula Excel and an investment committee memo.',alternates:{canonical:leeHref}};
export default function LeePage(){return <article className={`${styles.page} ${styles.flagshipPage}`}>
<Link href='/applied-projects'>← Applied Projects</Link>
<header><div className={styles.brandHeading}><ProjectBrand/><span className={styles.meta}>Infrastructure investment case · 01</span></div><h1>Lee Data Center</h1><p className={styles.meta}>16000 Midlothian Turnpike · Virginia · Site case v2.0</p><p>Start with the land. Underwrite an advertised industrial parcel, test the development constraints, and connect acquisition cost to a hypothetical 10 MW data-center investment.</p><p className={styles.note}>{leeDisclosure}</p></header>
<LeeSiteCase/>
<LeeModel/>
<LeeExpansionCase/>
<p className={styles.note}>Educational and informational purposes only. No personalized financial advice. No actual lender commitment, operating asset, secured power capacity or investment opportunity is represented.</p>
</article>;}
