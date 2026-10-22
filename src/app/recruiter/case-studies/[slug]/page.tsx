import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { professionalCaseStudies, caseStudyHref } from "@/data/professional-case-studies";
import { ProjectBrand } from "@/components/applied-finance/project-brand";
import { ProjectSection } from "@/components/applied-finance/financial-display";
import styles from "@/components/applied-finance/project.module.css";

export function generateStaticParams() { return professionalCaseStudies.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = professionalCaseStudies.find(study => study.slug === slug);
  return study ? { title: `${study.category} case study | Luna1 Research`, description: study.summary, alternates: { canonical: caseStudyHref(slug) } } : {};
}

export default async function ProfessionalCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = professionalCaseStudies.find(study => study.slug === slug);
  if (!study) notFound();
  return <article className={styles.page}>
    <Link href="/recruiter#professional-case-studies">← Professional Profile / Case studies</Link>
    <header>
      <div className={styles.brandHeading}><ProjectBrand /><p className={styles.meta}>Case {study.number} · {study.category}</p></div>
      <h1>{study.title}</h1><p>{study.summary}</p>
      <p className={styles.meta}>Published October 13, 2026 · Professional portfolio</p>
    </header>
    <nav aria-label="Case study sections"><ol className={styles.workflow}>{["Context", "Challenge", "Approach", "Findings", "Deliverable", "Evidence"].map(label => <li key={label}><a href={`#${label.toLowerCase()}`}>{label}</a></li>)}</ol></nav>
    <ProjectSection id="context" title="Context & role"><p><strong>{study.context}</strong></p><p>{study.role}</p><div className={styles.note}>{study.scope}</div></ProjectSection>
    <ProjectSection id="challenge" title="The challenge"><p>{study.challenge}</p></ProjectSection>
    <ProjectSection id="approach" title="Analytical approach">{study.approach.map((step, index) => <div key={step.title}><h3>{String(index + 1).padStart(2, "0")} / {step.title}</h3><p>{step.detail}</p></div>)}</ProjectSection>
    <ProjectSection id="findings" title="Findings & judgment">{study.findings.map(finding => <div key={finding.title}><h3>{finding.title}</h3><p>{finding.detail}</p></div>)}</ProjectSection>
    <ProjectSection id="deliverable" title="Deliverable & demonstrated skills"><p>{study.outcome}</p><ul className={styles.skills}>{study.competencies.map(skill => <li key={skill}>{skill}</li>)}</ul><h3>Scope and limitations</h3><p>{study.limitations}</p></ProjectSection>
    <ProjectSection id="evidence" title="Evidence & provenance"><div className={styles.artifacts}>{study.evidence.map(item => <article key={item.href}><h3><Link href={item.href}>{item.title} →</Link></h3><p>{item.description}</p></article>)}</div></ProjectSection>
    <ProjectSection id="related" title="Explore the other case studies"><div className={styles.links}>{professionalCaseStudies.filter(item => item.slug !== slug).map(item => <Link key={item.slug} href={caseStudyHref(item.slug)}>{item.category} →</Link>)}</div></ProjectSection>
    <p className={styles.note}>Luna1 Research · Independent educational portfolio work. No confidential employer information is used. Hypothetical models and dated research are not current market data or personalized financial advice.</p>
  </article>;
}
