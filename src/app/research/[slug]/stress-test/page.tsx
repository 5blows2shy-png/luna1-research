import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site";
import { ThesisStressTest } from "@/components/thesis-stress-test";
import { research } from "@/lib/data";

export const metadata: Metadata = {
  title: "Thesis Stress Test",
  description:
    "Adjust assumptions, test risk conditions, and compare a structured research view with the Klyro reference case.",
};

export function generateStaticParams() {
  return research.map((report) => ({ slug: report.ticker.toLowerCase() }));
}

export default async function StressTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = research.find(
    (item) => item.ticker.toLowerCase() === slug,
  );
  if (!report) notFound();
  return (
    <>
      <PageHeader
        kicker={`${report.ticker} · Investment committee workspace`}
        title="Klyro Thesis Stress Test"
        description="Adjust the assumptions, challenge the investment case, and compare your conclusion with the Klyro research view."
      />
      <ThesisStressTest
        company={{
          company: report.company,
          ticker: report.ticker,
          catalyst: report.catalyst,
          risk: report.risk,
          date: report.date,
        }}
      />
    </>
  );
}
