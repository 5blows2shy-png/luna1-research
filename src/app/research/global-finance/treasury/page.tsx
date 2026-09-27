import type { Metadata } from "next";
import { TreasuryLab } from "@/components/global-finance/treasury-lab";
import { unavailableFxProvider } from "@/lib/global-finance/providers";
import styles from "@/components/global-finance/global-finance.module.css";
export const metadata: Metadata = {
  title: "Global Treasury & FX",
  description:
    "Transparent currency, interest-rate, and working-capital scenarios with deterministic calculations.",
};
export default async function TreasuryPage() {
  const fx = await unavailableFxProvider.getRate("EUR", "USD", "2026-06-30");
  return (
    <>
      <header className={styles.section}>
        <span className={styles.kicker}>Global Finance · Applied treasury</span>
        <h1>Global Treasury & FX</h1>
        <p>
          See how currency exposure, financing costs, and working capital change
          a multinational’s financial picture.
        </p>
        <span className={styles.badge}>Recorded Data: {fx.status}</span>
      </header>
      <TreasuryLab />
    </>
  );
}
