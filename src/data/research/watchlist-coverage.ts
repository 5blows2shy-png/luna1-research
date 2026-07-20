import { researchCompanies } from "./research-companies";

export const watchlistCoverage = researchCompanies.map((company) => ({
  ticker: company.ticker,
  companyName: company.companyName,
  industry: company.industry,
  researchStatus: company.researchStatus,
  lastUpdated: company.lastUpdated,
  valuationStatus: company.valuationStatus,
  thesisStatus: company.thesisStatus,
  href: `/watchlist/${company.slug}`,
}));
