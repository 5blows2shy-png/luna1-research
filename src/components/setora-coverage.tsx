import Link from "next/link";
import { setoraCoverageGroups } from "@/data/setora-coverage";
import styles from "./setora-map.module.css";

export function SetoraCoverage({ view }: { view: "themes" | "companies" }) {
  return <div className={styles.maps}>{setoraCoverageGroups.map((group, index) => (
    <details key={group.id} className={styles.ecosystem} open={index === 0}>
      <summary className={styles.summary}><span><small>SETORA SEGMENT</small><strong>{group.name}</strong></span><span className={styles.summaryMeta}>{view === "themes" ? group.themes.length + " themes" : group.companies.length + " companies"} <b aria-hidden="true">⌄</b></span></summary>
      <div className={styles.content}><p>{group.description}</p>
        <p><Link className="text-link" href={"/setora/capital-map#" + group.id}>Explore this capital map →</Link></p>
        <div className="setora-company-grid">
          {view === "themes" ? group.themes.map((theme) => <article key={theme}><span>{group.name}</span><h2>{theme}</h2><p>Follow disclosed capital spending, contracts, capacity, and earnings evidence in this part of the chain.</p><small>Coverage theme · event evidence determines direction</small></article>) :
            group.companies.map((company) => <article key={company.name}><span>{company.listing} · {company.segment}</span><h2>{company.name}</h2><p>{company.researchQuestion}</p><small>Coverage candidate · source review required for each event</small></article>)}
        </div>
      </div>
    </details>
  ))}</div>;
}

