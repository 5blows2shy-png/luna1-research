import type { Metadata } from "next";
import { TransactionIntelligenceWorkspace } from "@/components/transaction-intelligence-workspace";

export const metadata: Metadata = {
  title: "Klyro",
  description:
    "Upload, organize, reconcile, analyze, and export financial transaction data through structured accounting controls.",
};

export default function TransactionIntelligencePage() {
  return <TransactionIntelligenceWorkspace />;
}
