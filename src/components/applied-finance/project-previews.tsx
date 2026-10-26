import Link from "next/link";
import { financeProjects, projectHref, type ProjectStatus } from "@/data/applied-finance-projects";
import styles from "./project.module.css";
import { developmentHref, developmentTitle } from "@/lib/development-model";
import { developmentDashboard } from "@/data/development-project";
import { publicPowerBIUrl } from "@/lib/power-bi";
export function ProjectStatusLabel({ status }: { status: ProjectStatus }) {
  return <span className={`${styles.status} ${status === "Completed" ? styles.completed : ""}`}>{status}</span>;
}
export function ProjectPreviews() {
  return <section className={styles.projectSection} id="applied-finance-projects" aria-labelledby="applied-finance-title">
    <span className="eyebrow">03 · Applied finance projects</span>
    <h2 id="applied-finance-title">Applied Finance Projects</h2>
    <p>Turning finance concepts into practical analysis. These projects connect my professional experience with financial modeling, FP&amp;A, data analysis, and investment decision-making.</p>
    <article className={`${styles.preview} ${styles.featuredProject}`}>
      <span className={styles.meta}>Featured</span>
      <div><span className={styles.meta}>Infrastructure Finance · Financial Modeling · Power BI</span><h3>{developmentTitle}</h3><p>Hypothetical 20 MW, two-phase data center development model analyzing $240M of illustrative CapEx, lease-up, operating performance, unlevered cash flow, NPV, IRR, MOIC, exit valuation, and investment sensitivities.</p><small>Model framework ready · Power BI report in development</small></div>
      <aside><Link href={developmentHref}>View case study →</Link>{developmentDashboard.approvedForPublicUse && publicPowerBIUrl(developmentDashboard.embedUrl) && <Link href={`${developmentHref}#power-bi`}>View dashboard →</Link>}</aside>
    </article>
    <div className={styles.projects}>{financeProjects.map(project => <article className={styles.preview} key={project.slug}>
      <span className={styles.meta}>{project.number}</span>
      <div><span className={styles.meta}>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><small className={styles.meta}>{project.dataLabel}</small></div>
      <aside><ProjectStatusLabel status={project.status} /><Link href={projectHref(project.slug)} aria-label={`View project: ${project.title}`}>View project →</Link></aside>
    </article>)}</div>
  </section>;
}
