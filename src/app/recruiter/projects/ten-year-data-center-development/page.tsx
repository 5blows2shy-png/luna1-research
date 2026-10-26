import type { Metadata } from "next";
import Link from "next/link";
import { DevelopmentModel } from "@/components/applied-finance/development-model";
import { ProjectBrand } from "@/components/applied-finance/project-brand";
import { Metrics, ProjectSection } from "@/components/applied-finance/financial-display";
import { developmentDashboard } from "@/data/development-project";
import { developmentConfidentiality, developmentDisclosure, developmentHref, developmentTitle } from "@/lib/development-model";
import styles from "@/components/applied-finance/project.module.css";
export const metadata: Metadata = { title: `${developmentTitle} | Luna1 Research`, description: "Hypothetical 20 MW, two-phase development model with $240M illustrative CapEx, independent lease-up, unlevered cash flows, returns and Power BI-ready exports.", alternates: { canonical: developmentHref } };
export default function DevelopmentProjectPage() {
  return <article className={`${styles.page} ${styles.flagshipPage}`}>
    <Link href="/recruiter#applied-finance-projects">← Professional Profile / Featured project</Link>
    <header><div className={styles.brandHeading}><ProjectBrand /><span className={styles.meta}>Flagship portfolio model · Infrastructure finance</span></div><h1>10-Year Data Center Investment &amp; Development Model</h1><p>Hypothetical 20 MW development · Two independent 10 MW phases</p><Metrics items={[["Starting capacity", "20 MW"], ["Illustrative CapEx", "$240M"], ["Development phases", "2"], ["Investment horizon", "10 years"]]} /><p className={styles.note}>{developmentDisclosure}</p><p>{developmentConfidentiality}</p></header>
    <ProjectSection id="project-thesis" title="Project thesis"><p>This case study evaluates the economics of developing a hypothetical 20 MW data center over two 10 MW phases. The model examines how construction timing, lease-up, operating performance, and terminal valuation interact to drive project returns over a 10-year investment horizon.</p><p className={styles.meta}>Model framework implemented · Financial inputs await entry · Power BI report in development</p></ProjectSection>
    <nav aria-label="Development model sections"><ol className={styles.workflow}>{[["Assumptions", "key-assumptions"], ["Development", "development-timeline"], ["Capacity", "capacity-leaseup"], ["Operations", "operating-performance"], ["Cash flow", "unlevered-cash-flow"], ["Returns", "investment-returns"], ["Scenarios", "scenario-analysis"], ["Sensitivity", "sensitivity"], ["Power BI", "power-bi"], ["Conclusion", "investment-conclusion"], ["Evidence", "evidence"]].map(([title, id]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol></nav>
    <DevelopmentModel embedUrl={developmentDashboard.embedUrl} approvedForPublicUse={developmentDashboard.approvedForPublicUse} />
  </article>;
}
