import type { Metadata } from "next";
import { FpaCase } from "@/components/global-finance/fpa-case";
import styles from "@/components/global-finance/global-finance.module.css";
export const metadata: Metadata = {
  title: "Global FP&A · Northstar",
  description:
    "A fictional multinational case in regional consolidation, variance analysis, and currency-neutral growth.",
};
export default function FpaPage() {
  return (
    <>
      <header className={styles.section}>
        <span className={styles.kicker}>
          Global Finance · Planning & performance
        </span>
        <h1>Global FP&A</h1>
        <p>
          Northstar Technologies. Four regions, four currencies, one
          consolidated operating story.
        </p>
      </header>
      <FpaCase />
    </>
  );
}
