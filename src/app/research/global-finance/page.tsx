import {
  CareerThesis,
  CareerEvidence,
  CareerReadiness,
} from "@/components/global-finance/career-profile";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeftRight,
  Building2,
  Landmark,
  Factory,
  Network,
  BookOpen,
  Calculator,
} from "lucide-react";
import { ResearchChain, BarChart } from "@/components/global-finance/visuals";
import { northstarRegions } from "@/data/global-finance/northstar";
import { consolidateRegions } from "@/lib/global-finance/models";
import styles from "@/components/global-finance/global-finance.module.css";
export const metadata: Metadata = {
  title: "Global Finance",
  description:
    "Capital, currencies, multinational exposure, and applied global FP&A within Luna1 Research.",
};
const areas = [
  {
    name: "FX & Treasury",
    icon: ArrowLeftRight,
    text: "Trace currency and funding changes into earnings and cash.",
    href: "/global-finance/treasury",
    action: "Run a scenario",
  },
  {
    name: "Multinational Companies",
    icon: Building2,
    text: "Connect customer geography with the company research record.",
    href: "/research/companies/glw#global-exposure",
    action: "Explore Corning exposure",
  },
  {
    name: "Global FP&A",
    icon: Calculator,
    text: "Consolidate four regions. Separate operations from translation.",
    href: "/global-finance/fpa",
    action: "Open Northstar case",
  },
  {
    name: "Cross-Border Investment",
    icon: Landmark,
    text: "Understand valuation, currency, and financing together.",
    planned:
      "Phase 2 · A simple acquisition model, sources and uses, and FX sensitivity. No acquisition model is published yet.",
  },
  {
    name: "Trade & Capital Flows",
    icon: Network,
    text: "Follow capital needs through international value chains.",
    href: "/research/capital-flows#capital-flow-compute",
    action: "Open the existing map",
    planned:
      "Trade datasets and corridor analysis are Phase 2. The current map is a qualitative framework.",
  },
  {
    name: "Infrastructure Finance",
    icon: Factory,
    text: "Connect capacity investment to project economics.",
    planned:
      "Phase 3 · Deterministic DSCR, NPV, IRR, and project sensitivities. No project return model is published yet.",
  },
  {
    name: "Global Casebook",
    icon: BookOpen,
    text: "A compact library of models, evidence, and limitations.",
    href: "/global-finance/casebook",
    action: "Review the evidence",
  },
];
export default function GlobalFinancePage() {
  const fpa = consolidateRegions(northstarRegions);
  return (
    <>
      <header className={styles.hero}>
        <div>
          <span className={styles.kicker}>
            Global Finance · cross-border business analysis
          </span>
          <h1>Capital does not stop at the border.</h1>
          <p>
            A research perspective on currencies, trade, multinational
            businesses, infrastructure, and cross-border capital flows—built
            to connect operating realities with financial outcomes.
          </p>
          <Link className="button" href="/global-finance/treasury">
            Explore Treasury & FX →
          </Link>
        </div>
        <div>
          <span className={styles.badge}>
            A working example · fictional data
          </span>
          <BarChart
            title="Same business. Two growth perspectives."
            unit="Growth % · Northstar Q2 2026"
            items={[
              { label: "FX-neutral", value: fpa.fxNeutralGrowth * 100 },
              { label: "Reported USD", value: fpa.reportedGrowth * 100 },
            ]}
          />
          <p className={styles.source}>
            Local performance and reported results can tell different stories.
            Source: Luna1 fictional Northstar case.{" "}
            <Link href="/global-finance/fpa">
              Inspect every input →
            </Link>
          </p>
        </div>
      </header>
      <CareerThesis />
      <section className={styles.section}>
        <span className={styles.kicker}>One connected research process</span>
        <h2>Follow the capital. Explain the impact.</h2>
        <ResearchChain />
        <p>
          Where is capital moving, who supplies the capacity, and how do
          currency, financing, and operating risks change the company’s
          financial results?
        </p>
      </section>
      <section className={styles.section}>
        <span className={styles.kicker}>Research disciplines</span>
        <h2>Choose a question to go deeper.</h2>
        <div className={styles.cards}>
          {areas.map(({ name, icon: Icon, text, href, action, planned }) => (
            <article key={name} className={styles.card}>
              <Icon aria-hidden="true" />
              <h3>{name}</h3>
              <p>{text}</p>
              {href && <Link href={href}>{action} →</Link>}
              {planned && (
                <details>
                  <summary>
                    {href ? "Scope & next phase" : "Planned · view scope"}
                  </summary>
                  <p>{planned}</p>
                </details>
              )}
            </article>
          ))}
        </div>
      </section>
      <CareerEvidence />
      <CareerReadiness />
      <section className={styles.section}>
        <div className={styles.grid}>
          <div>
            <span className={styles.kicker}>Research standard</span>
            <h2>Evidence has a label.</h2>
            <p>
              Company disclosures retain their reporting periods and sources.
              Models keep original currencies. Assumptions and estimated impacts
              stay separate from recorded data.
            </p>
          </div>
          <dl className={styles.ledger}>
            {[
              ["Recorded Data", "Dated primary-source company disclosures."],
              ["Assumption", "Explicit, editable scenario inputs."],
              ["Scenario", "A controlled change in those inputs."],
              [
                "Estimated Impact",
                "A deterministic result, not an audited forecast.",
              ],
            ].map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
