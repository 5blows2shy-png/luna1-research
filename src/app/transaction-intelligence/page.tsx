import type { Metadata } from "next";
import { TransactionIntelligenceWorkspace } from "@/components/transaction-intelligence-workspace";

export const metadata: Metadata = {
  title: "Transaction Intelligence",
  description:
    "A financial-data review workspace for importing, cleaning, classifying, reconciling, reviewing, and exporting transaction records.",
};

export default function TransactionIntelligencePage() {
  return <TransactionIntelligenceWorkspace />;
}
