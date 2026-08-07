import type { Metadata } from "next";
import { KlyroAd } from "@/components/luna-books-ad/luna-books-ad";
import { TransactionIntelligenceWorkspace } from "@/components/transaction-intelligence-workspace";

export const metadata: Metadata = {
  title: "Klyro | Accounting Intelligence Portal",
  description: "Upload, clean, reconcile, analyze, and export business transaction data inside the Klyro intelligence portal.",
};

export default function KlyroPage() {
  return (
    <>
      <section aria-label="Klyro introduction"><KlyroAd /></section>
      <TransactionIntelligenceWorkspace />
    </>
  );
}
