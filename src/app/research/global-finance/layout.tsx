import Link from "next/link";
import {
  ResearchDisclaimer,
  ResearchSectionNav,
} from "@/components/research-ui";
import styles from "@/components/global-finance/global-finance.module.css";
export default function GlobalFinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <ResearchSectionNav />
      <nav className={styles.nav} aria-label="Global Finance sections">
        <Link href="/research/global-finance">Overview</Link>
        <Link href="/research/global-finance/treasury">Treasury & FX</Link>
        <Link href="/research/global-finance/fpa">Global FP&A</Link>
        <Link href="/research/global-finance/casebook">Casebook</Link>
      </nav>
      {children}
      <ResearchDisclaimer />
    </div>
  );
}
