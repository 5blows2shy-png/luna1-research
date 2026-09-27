import type { Metadata } from "next";
import Link from "next/link";
import { financeCases } from "@/data/global-finance/casebook";
import styles from "@/components/global-finance/global-finance.module.css";
export const metadata: Metadata = {
  title: "Global Finance Casebook",
  description:
    "Applied treasury, multinational research, global FP&A, and cross-border capital-flow evidence.",
};
export default function CasebookPage() {
  return (
    <>
      <header className={styles.section}>
        <span className={styles.kicker}>Proof of work · Models & research</span>
        <h1>Global Finance Casebook</h1>
        <p>
          Inspect the problem, inputs, calculation, and limitations behind each
          piece of work.
        </p>
      </header>
      <section className={styles.section}>
        <div className={styles.grid}>
          {financeCases.map((item) => (
            <article
              id={item.slug}
              key={item.slug}
              className={`${styles.card} ${styles.case}`}
            >
              <span className={styles.kicker}>{item.discipline}</span>
              <h2>{item.title}</h2>
              <span className={styles.badge}>{item.status}</span>
              <p>{item.problem}</p>
              <dl className={styles.ledger}>
                {[
                  ["Data", item.data],
                  ["Analysis", item.analysis],
                  ["Financial model", item.model],
                  ["Key findings", item.findings],
                  ["Risks / limitations", item.limitations],
                  ["Tools used", item.tools.join(" · ")],
                ].map(([key, val]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
              <Link href={item.href}>{item.action} →</Link>
            </article>
          ))}
        </div>
        <div className={styles.note}>
          Cross-Border Investment Case: Phase 2 planned. Project Finance Case:
          Phase 3 planned. No completed artifacts or tool claims are listed for
          either.
        </div>
      </section>
    </>
  );
}
