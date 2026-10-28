import { expansionExport, expansionSources } from '@/lib/lee-expansion';
import { Metrics, money, percent } from './financial-display';
import styles from './project.module.css';

export function LeeExpansionCase() {
  const data = expansionExport();
  const base = data.returns[0];
  return <section id='expansion-investment-case' aria-labelledby='expansion-title'>
    <span className={styles.meta}>Companion investment committee case</span>
    <h2 id='expansion-title'>10 MW site underwriting</h2>
    <p>Acquire the whole listed parcel, then develop two 5 MW phases. The model separates $134.4 million of non-land development from $11.092 million of acquisition, diligence, closing, carrying and enabling costs. No existing campus cash flows or shared-asset savings are credited.</p>
    <Metrics items={[["Development CapEx",money(145_492_000)],["Equity IRR",percent(base.Equity_IRR)],["Equity NPV at 15%",money(base.Equity_NPV)],["Minimum DSCR",`${base.Minimum_DSCR?.toFixed(2)}x`]]}/>
    <h3>Recommendation: do not approve under current terms</h3>
    <p>The base case breaches the assumed 1.30x debt covenant in six operating years. The workbook traces debt draws, interest, principal, CFADS, equity returns and exit proceeds, with native Excel sensitivities, a debt-capacity screen and reconciliation checks. The memo sets out the downside and conditions for resubmission.</p>
    <div className={styles.controls}>
      <a href='/downloads/lee-data-center-10mw-expansion.xlsx' download>Download 10 MW expansion Excel model →</a>
      <a href='/downloads/lee-data-center-10mw-investment-committee.docx' download>Download two-page investment committee memo →</a>
    </div>
    <p className={styles.note}>The workbook and interactive model use the same 10 MW site-case defaults. Browser edits do not sync to the workbook. The earlier 20 MW Power BI starter requires a dataset replacement. The asking price is sourced; development, financing and feasibility assumptions remain hypothetical.</p>
    <details><summary>Public benchmark sources and model use</summary><ul>{expansionSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a><p>{source.benchmark} {source.application}</p></li>)}</ul><p>Sources accessed October 28, 2026. No confidential employer, customer or facility information is used.</p></details>
  </section>;
}
