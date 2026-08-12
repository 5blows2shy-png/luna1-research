import type { Metadata } from "next";
import { cookies } from "next/headers";
import { KlyroAd } from "@/components/luna-books-ad/luna-books-ad";
import { TransactionIntelligenceWorkspace } from "@/components/transaction-intelligence-workspace";
import { KLYRO_DEMO_COOKIE, readKlyroDemoSession } from "@/lib/klyro-demo-session";

export const metadata: Metadata = {
  title: "Klyro | Accounting Intelligence Portal",
  description: "Upload, clean, reconcile, analyze, and export business transaction data inside the Klyro intelligence portal.",
};

export default async function KlyroPage() {
  const cookieStore = await cookies();
  const demoSession = readKlyroDemoSession(cookieStore.get(KLYRO_DEMO_COOKIE)?.value);
  return (
    <>
      {demoSession && (
        <aside className="klyro-demo-bar" aria-label="Demo workspace status">
          <div>
            <strong>Demo workspace</strong>
            <span>Fictional sample data · Changes remain in this browser · Expires {new Date(demoSession.expiresAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
          <form action="/api/klyro/demo/end" method="post">
            <button type="submit">Exit demo</button>
          </form>
        </aside>
      )}
      <section aria-label="Klyro introduction"><KlyroAd /></section>
      <TransactionIntelligenceWorkspace />
    </>
  );
}
