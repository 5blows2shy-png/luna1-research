import type { Metadata } from "next";
import Link from "next/link";
import { TransactionIntelligenceWorkspace } from "@/components/transaction-intelligence-workspace";

export const metadata: Metadata = {
  title: "Luna Books",
  description:
    "A financial-data review workspace for importing, cleaning, classifying, reconciling, reviewing, and exporting transaction records.",
};

export default function TransactionIntelligencePage() {
  return (
    <>
      <aside className="luna-public-demo" aria-label="Interactive Luna Books demo">
        <div>
          <span>Safe public demo</span>
          <strong>See what Luna Books can do for a small business.</strong>
          <p>Explore a fictional, read-only Harbor Supply workspace. No login, bank connection, or customer data required.</p>
        </div>
        <Link href="/demo/luna-books-tour">Try the interactive demo <span aria-hidden>→</span></Link>
      </aside>
      <TransactionIntelligenceWorkspace />
    </>
  );
}
