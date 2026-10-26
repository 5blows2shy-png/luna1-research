import { ProjectBrand } from "@/components/applied-finance/project-brand";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { financeProjects, projectHref, safeArtifactUrl } from "@/data/applied-finance-projects";
import { NonprofitDashboard } from "@/components/applied-finance/nonprofit-dashboard";
import { DataCenterModel } from "@/components/applied-finance/data-center-model";
import { ProjectStatusLabel } from "@/components/applied-finance/project-previews";
import { ProjectSection } from "@/components/applied-finance/financial-display";
import { projectFinanceContext } from "@/data/project-finance-context";
import styles from "@/components/applied-finance/project.module.css";
export function generateStaticParams() { return financeProjects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = financeProjects.find(p => p.slug === slug);
  return project ? { title: `${project.title} · ${project.status}`, description: project.summary, alternates: { canonical: projectHref(slug) } } : {};
}
export default async function FinanceProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = financeProjects.find(p => p.slug === slug);
  if (!project) notFound();
  const dataCenter = slug === "data-center-investment-model";
  return <article className={styles.page}>
    <Link href="/recruiter#applied-finance-projects">← Professional Profile / Applied Finance Projects</Link>
    <header><div className={styles.brandHeading}><ProjectBrand /><p className={styles.meta}>Project {project.number} · {project.category}</p></div><h1>{project.title}</h1><ProjectStatusLabel status={project.status} /><p>{project.summary}</p></header>
    <nav aria-label="Project workflow"><ol className={styles.workflow}>{[["Project", "overview"], ["Business question", "question"], ["Assumptions / data", "assumptions"], ["Analysis", "analysis"], ["Model / dashboard", "model"], ["Key findings", "findings"], ["What this demonstrates", "skills"], ["Evidence", "evidence"]].map(([label, id]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol></nav>
    <ProjectSection id="overview" title="Project overview"><p>{dataCenter ? "An interactive infrastructure and project-finance work sample connects operating economics, sources & uses, debt amortization, CFADS, DSCR, and investor returns. An eight-screen recruiting mode uses the same model inputs. The completed work sample includes a downloadable Excel model and an eight-page PDF presentation." : "A completed management reporting work sample connects a fictional financial dataset to budget, forecast, cash, and fund analysis. Explore the interactive dashboard and download the supporting Excel workbook and PDF case study."}</p></ProjectSection>
    <ProjectSection id="question" title="Business question"><p>{project.question}</p></ProjectSection>
    <ProjectSection id="assumptions" title="Assumptions / data"><span className={styles.meta}>{project.dataLabel}</span><p>{project.dataNote}</p><div className={styles.note}><p>Inputs are labeled user assumptions or synthetic data. Calculated values and model outputs derive deterministically from those inputs. Public data must have a source before it is used.</p></div>{project.sources.map(source => <p key={source.title}><strong>{source.provenance}</strong> · {source.title}{safeArtifactUrl(source.url) && <> · <a href={safeArtifactUrl(source.url)!}>View source</a></>}</p>)}</ProjectSection>
    {dataCenter ? <DataCenterModel /> : <NonprofitDashboard />}
    <ProjectSection id="skills" title="What this demonstrates"><p>Applied methods demonstrated in the interactive analysis and downloadable work samples below.</p><ul className={styles.skills}>{project.skills.map(skill => <li key={skill}>{skill}</li>)}</ul><Link href="/recruiter#capabilities">View the existing capability register →</Link></ProjectSection>
    <ProjectSection id="connection" title="Professional connection"><p>{project.connection}</p><p>This is independent educational portfolio work. No confidential employer documents, financials, customers, pricing, architecture, or operating statistics are used.</p></ProjectSection>
    {dataCenter && <ProjectSection id="research-path" title="Luna1 research connection"><p>Capital flow thesis → Data center industry → Project economics → Public companies → Equity research.</p><p>{projectFinanceContext.flow.join(" → ")}</p><p>{projectFinanceContext.discussion}</p><p><a href={projectFinanceContext.source.url}>{projectFinanceContext.source.title}</a> · accessed {projectFinanceContext.source.accessed}. {projectFinanceContext.limitation}</p><div className={styles.links}><Link href="/global-finance">Global Finance</Link><Link href="/research/capital-flows#capital-flow-compute">Capital Flows</Link><Link href="/setora">AI infrastructure coverage</Link><Link href="/research">Equity research</Link></div></ProjectSection>}
    <ProjectSection id="evidence" title="Evidence"><p>Completed work samples are available below. Excel files contain editable assumptions and formulas; PDFs capture the starting case. All inputs remain clearly labeled synthetic or hypothetical.</p><div className={styles.artifacts}>{project.artifacts.map(artifact => {
      const url = artifact.status === "available" ? safeArtifactUrl(artifact.url) : null;
      return <article key={artifact.title}><span className={styles.meta}>{artifact.type} · {artifact.fileFormat}</span><h3>{artifact.title}</h3><span className={styles.status}>{url ? "Available" : "Optional extension"}</span><p>{artifact.description}</p><small>{artifact.date ? `Artifact date: ${artifact.date}` : "Artifact date: not yet published"} · {artifact.version}</small>{url ? <p><a href={url}>View {artifact.title} →</a></p> : <p>Not included in the completed scope</p>}</article>;
    })}</div></ProjectSection>
    <p className={styles.note}>Educational portfolio work only. Synthetic data and hypothetical assumptions are not actual employer results, current market data, or personalized financial advice.</p>
  </article>;
}
