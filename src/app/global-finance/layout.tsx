import Link from "next/link";
import { ResearchDisclaimer } from "@/components/research-ui";
import styles from "@/components/global-finance/global-finance.module.css";

export default function GlobalFinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Global Finance sections">
        <Link href="/global-finance">Overview</Link>
        <Link href="/global-finance#global-markets">Global Markets</Link>
        <Link href="/global-finance/treasury">Treasury &amp; FX</Link>
        <Link href="/global-finance/fpa">Global FP&amp;A</Link>
        <Link href="/global-finance/casebook">Casebook</Link>
      </nav>
      {children}
      <ResearchDisclaimer />
    </div>
  );
}
