import Link from "next/link";
import { professionalCaseStudies, caseStudyHref } from "@/data/professional-case-studies";
import styles from "./project.module.css";

export function ProfessionalCasePreviews() {
  return <section className={styles.projectSection} id="professional-case-studies" aria-labelledby="professional-case-title">
    <span className="eyebrow">Luna1 · Professional case studies</span>
    <h2 id="professional-case-title">Three perspectives. A shared analytical discipline.</h2>
    <p>Financial operations, infrastructure operations and investment research—each presented through a clear challenge, analytical approach, findings and supporting evidence.</p>
    <div className={styles.projects}>{professionalCaseStudies.map(study => <article className={styles.preview} key={study.slug}>
      <span className={styles.meta}>{study.number}</span>
      <div><span className={styles.meta}>{study.category}</span><h3>{study.title}</h3><p>{study.summary}</p></div>
      <aside><Link href={caseStudyHref(study.slug)} aria-label={`Read case study: ${study.category}`}>Read case study →</Link></aside>
    </article>)}</div>
  </section>;
}
