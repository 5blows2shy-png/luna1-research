import Link from "next/link";
import { financeProjects, projectHref, type ProjectStatus } from "@/data/applied-finance-projects";
import styles from "./project.module.css";
import { leeHref, leeTitle } from "@/lib/lee-data-center";
export function ProjectStatusLabel({ status }: { status: ProjectStatus }) {
  return <span className={`${styles.status} ${status === "Completed" ? styles.completed : ""}`}>{status}</span>;
}
export function ProjectPreviews() {
  return <section className={styles.projectSection} id="applied-finance-projects" aria-labelledby="applied-finance-title">
    <span className="eyebrow">03 · Applied finance projects</span>
    <h2 id="applied-finance-title">Applied Finance Projects</h2>
    <p>Proof of capability: Lee Data Center demonstrates financing and cash-flow analysis; WD-40 demonstrates company and strategic research. Supporting financial-operations work remains below.</p>
    <article className={`${styles.preview} ${styles.featuredProject}`}>
      <span className={styles.meta}>Featured</span>
      <div><span className={styles.meta}>Infrastructure Finance · Financial Modeling · Power BI</span><h3>{leeTitle}</h3><p>A 10 MW site investment case anchored to an actively advertised industrial parcel in Virginia. Acquisition basis, site feasibility, debt coverage and investment returns connect to a formula-driven workbook and committee memo.</p><small>Interactive model ready · Power BI project available; Desktop validation pending</small></div>
      <aside><Link href={leeHref}>Explore Lee Data Center →</Link><Link href="/recruiter/research-challenge">Companion: WD-40 research →</Link></aside>
    </article>
    <div className={styles.projects}>{financeProjects.filter(project => project.slug !== "data-center-investment-model").map(project => <article className={styles.preview} key={project.slug}>
      <span className={styles.meta}>{project.number}</span>
      <div><span className={styles.meta}>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><small className={styles.meta}>{project.dataLabel}</small></div>
      <aside><ProjectStatusLabel status={project.status} /><Link href={projectHref(project.slug)} aria-label={`View project: ${project.title}`}>View project →</Link></aside>
    </article>)}</div>
  </section>;
}
