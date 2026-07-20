import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyResearchPage } from "@/components/research/company-research-page";
import { luna1Brand } from "@/config/brand";
import {
  getResearchCompany,
  researchCompanies,
} from "@/data/research/research-companies";

export const dynamicParams = false;

export function generateStaticParams() {
  return researchCompanies.map((company) => ({ ticker: company.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const company = getResearchCompany(ticker);
  if (!company) return {};
  const title = `${company.companyName} Equity Research and Valuation`;
  const description = `Independent equity research, investment thesis, financial analysis, valuation framework, catalysts, and risks for ${company.companyName} by Shy Lee of Luna1 Research.`;
  const canonical = `/watchlist/${company.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Luna1 Research`,
      description,
      type: "article",
      url: canonical,
    },
  };
}

export default async function WatchlistResearchPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = getResearchCompany(ticker);
  if (!company) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${company.companyName} Equity Research and Valuation`,
    description: company.description,
    author: {
      "@type": "Person",
      name: luna1Brand.analyst,
      url: `${luna1Brand.website}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: luna1Brand.name,
      url: luna1Brand.website,
      logo: `${luna1Brand.website}${luna1Brand.logoPath}`,
    },
    mainEntityOfPage: `${luna1Brand.website}/watchlist/${company.slug}`,
    about: {
      "@type": company.kind === "etf" ? "FinancialProduct" : "Corporation",
      name: company.companyName,
      tickerSymbol: company.ticker,
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <CompanyResearchPage company={company} />
    </>
  );
}
