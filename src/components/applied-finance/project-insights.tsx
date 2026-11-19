import Link from 'next/link';
import { generateSpend, optimize, scenarioNames, summarize } from '@/lib/cloud-finops';
import { calculateLee, initialLeeDebt } from '@/lib/lee-data-center';
import { initialExpansionProject } from '@/lib/lee-expansion';
import { ValueBars } from './infographics';
import { money } from './financial-display';
import styles from './infographics.module.css';
export function ProjectInsights() {
  const history = generateSpend();
  const lee = calculateLee(initialExpansionProject(), initialLeeDebt());
  return <section aria-labelledby="project-insights-title"><h2 id="project-insights-title">The models at a glance</h2><p>Illustrative model outputs. Open a project to change assumptions and inspect the calculations.</p><div className={styles.snapshots}>
    <article className={styles.snapshot}><h3>Lee Data Center</h3><p>Two 5 MW phases · development funding sources</p><ValueBars title="Debt and equity funding" items={[{label:'Construction debt',value:lee.commitment,display:money(lee.commitment)},{label:'Equity for funding uses',value:lee.initialFundingEquity,display:money(lee.initialFundingEquity)}]}/><p>Includes development, financing fees and pre-operation interest. Later operating deficits require additional equity.</p><Link href="/recruiter/projects/lee-data-center">Inspect the site investment case →</Link></article>
    <article className={styles.snapshot}><h3>Cloud FinOps</h3><p>Same simulated environment · three cost policies</p><ValueBars title="Annual cloud spend by scenario" items={scenarioNames.map(label=>{const t=summarize(history.map(r=>optimize(r,label)));return {label,value:t.spend,display:money(t.spend)};})}/><p>Moderate is the recommended pilot. Savings are gross estimates before implementation costs and commitment underuse.</p><Link href="/recruiter/projects/cloud-finops">Inspect the optimization scenarios →</Link></article>
  </div></section>;
}
