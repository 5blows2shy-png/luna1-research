import updates from "@/data/setora-updates.json";
import styles from "./setora-map.module.css";

export function SetoraUpdates() {
  return <div className={styles.maps}>
    <p>Last checked: {new Date(updates.lastCheckedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" })} Pacific. {updates.coverageNote}</p>
    {([["data-centers", "Data Center AI Infrastructure"], ["robotics", "Robotics"]] as const).map(([id, name]) => <details className={styles.ecosystem} open key={id}>
      <summary className={styles.summary}><span><small>FILINGS · EARNINGS · CAPITAL EVENTS</small><strong>{name}</strong></span><span className={styles.summaryMeta}>{updates.items.filter((item) => item.segment === id).length} updates <b aria-hidden="true">⌄</b></span></summary>
      <div className={styles.content}>{updates.items.filter((item) => item.segment === id).map((item) => <article className={styles.relationship} key={item.id}>
        <p><small>{item.company} · {item.publishedDate} · {item.sourceType} · {item.eventType.replaceAll("_", " ")} · {item.status === "candidate" ? "Candidate — review required" : "Source checked"}</small></p>
        <h2>{item.title}</h2>
        <p><strong>Reported fact:</strong> {item.fact}</p>
        <p><strong>SETORA interpretation:</strong> {item.interpretation}</p>
        <p><a href={item.url} target="_blank" rel="noreferrer">{item.sourceTitle} ↗</a></p>
        <p><strong>Call / transcript:</strong> {item.transcriptStatus}. <a href={item.callUrl} target="_blank" rel="noreferrer">Official materials ↗</a></p>
        <p className={styles.note}>First seen by SETORA: {item.firstSeenAt}. Source dates and discovery dates are preserved separately.</p>
      </article>)}</div>
    </details>)}
  </div>;
}

