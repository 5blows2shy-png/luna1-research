import Link from "next/link";
import type { CapitalFlowGeography } from "@/data/research/capital-flows";
import styles from "./global-finance.module.css";
export function GlobalValueChain({ nodes }: { nodes: CapitalFlowGeography[] }) {
  return (
    <div id="global-value-chain">
      <span className={styles.badge}>
        Illustrative research framework · evidence review pending
      </span>
      <h3>AI infrastructure across regions</h3>
      <p>
        Read these as connected diligence questions, not measured spending flows
        or a ranking of investment attractiveness. The chain branches; it is not
        a literal sequence of payments.
      </p>
      <ol className={styles.corridor}>
        {nodes.map((node, i) => (
          <li key={node.country}>
            <small>
              {String(i + 1).padStart(2, "0")} · {node.region}
            </small>
            <b>{node.country}</b>
            <h4>{node.industry}</h4>
            <p>
              <strong>Bottleneck:</strong> {node.bottleneck}
            </p>
            <p>
              <strong>Capital need:</strong> {node.capitalNeed}
            </p>
            {node.company ? (
              <Link href={node.company.href}>
                {node.company.name} research →
              </Link>
            ) : (
              <small>Company evidence pending</small>
            )}
          </li>
        ))}
      </ol>
      <p className={styles.source}>
        Source: Luna1 conceptual research framework, 2026-09-26 · No monetary
        amounts or market data · Verify each regional role and company linkage
        before publishing an investment conclusion.
      </p>
    </div>
  );
}
