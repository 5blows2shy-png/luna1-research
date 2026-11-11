import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectBrand } from '@/components/applied-finance/project-brand';
import { FinopsDashboard } from '@/components/applied-finance/finops-dashboard';
import { finopsDisclosure, finopsHref, finopsTitle } from '@/lib/cloud-finops';
import styles from '@/components/applied-finance/project.module.css';
export const metadata: Metadata = { title: `${finopsTitle} | Luna1 Research`, description: 'Simulated cloud financial management with cost allocation, rolling forecasts, capacity-aware optimization and a four-page Power BI project.', alternates: { canonical: finopsHref } };
export default function CloudFinopsPage() {
  return <article className={styles.page}>
    <Link href="/applied-projects">← Applied Projects</Link>
    <header><div className={styles.brandHeading}><ProjectBrand/><span className={styles.meta}>Technology Finance &amp; Infrastructure · Cloud FinOps</span></div><h1>{finopsTitle}</h1><p>Where is cloud spend occurring, why are costs differing from budget, and how can management reduce costs while maintaining operating capacity?</p><p className={styles.note}>{finopsDisclosure}</p></header>
    <div className={styles.links}><a href="/downloads/cloud-finops-power-bi.zip" download>Download Power BI project and simulated data →</a><a href="#methodology">Methodology and evidence →</a></div>
    <p>480 service-month records · 10 workloads · 5 departments · 2 providers · $1.2M baseline annual spend · 3 scenarios</p>
    <FinopsDashboard/>
    <section id="methodology"><h2>Methodology and evidence</h2><p>The downloadable package contains four Power BI report pages, an embedded semantic model, DAX measures, source CSVs, forecast data, a data dictionary and a management recommendation. It is a fixed snapshot of the default simulation. Website filters and growth changes do not update the Power BI files.</p><p>Power BI project definitions and reconciliations are validated separately from native application behavior. Power BI Desktop on Windows is required for native refresh and visual validation; that validation is pending. This is not a hosted Power BI service dashboard.</p><p>Budget and actuals use independently scaled synthetic demand paths. Unit quantities and effective costs are illustrative, not a provider rate card. All figures are nominal USD; savings exclude implementation and financing costs. The simulation does not provision cloud resources or connect to billing accounts.</p><h3>Framework references</h3><ul><li><a href="https://www.finops.org/framework/capabilities/usage-optimization/">FinOps Foundation · Usage optimization</a></li><li><a href="https://framework.finops.org/framework/capabilities/allocation/">FinOps Foundation · Allocation</a></li><li><a href="https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview">Microsoft · Power BI Desktop projects</a></li></ul><p>References inform the structure; all dataset values and policy assumptions are simulated. Educational and informational purposes only. No personalized financial advice.</p></section>
  </article>;
}
