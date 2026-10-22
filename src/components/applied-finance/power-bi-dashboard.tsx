import { publicPowerBIUrl } from "@/lib/power-bi";
import { powerBIPages } from "@/data/development-project";
import styles from "./project.module.css";
export function PowerBIDashboard({ embedUrl, approvedForPublicUse }: { embedUrl: string | null; approvedForPublicUse: boolean }) {
  const url = approvedForPublicUse ? publicPowerBIUrl(embedUrl) : null;
  return url ? <iframe className={styles.powerBIFrame} title="Luna1 interactive data center investment dashboard" src={url} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className={styles.dashboardPreview}>
    <span className={styles.meta}>Power BI dashboard · In Development</span><h3>Infrastructure investment committee report</h3>
    <p>Six-page report specification. No live dashboard is connected. The website engine supplies the financial results; Power BI will visualize the exported tables.</p>
    <ol>{powerBIPages.map(page => <li key={page.title}><strong>{page.title}</strong><p>{page.detail}</p></li>)}</ol>
  </div>;
}
