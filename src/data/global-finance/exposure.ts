export type GlobalExposure = {
  homeCountry: string | null;
  geography: { region: string; revenue: number | null }[];
  totalRevenue: number | null;
  foreignRevenueShare: number | null;
  largestMarket: string | null;
  currencies: string | null;
  productionRegions: string | null;
  growthDriver: string | null;
  risk: string | null;
  capitalAllocation: string | null;
  source: {
    label: string;
    href: string;
    period: string;
    currency: string;
    units: string;
    updated: string;
    basis: string;
  };
};
export const globalExposureByTicker: Record<string, GlobalExposure> = {
  GLW: {
    homeCountry: "United States",
    geography: [
      { region: "North America", revenue: 7105 },
      { region: "Europe", revenue: 1412 },
      { region: "Asia-Pacific", revenue: 7646 },
      { region: "Latin America", revenue: null },
      { region: "Other", revenue: 245 },
    ],
    totalRevenue: 16408,
    foreignRevenueShare: (16408 - 6760) / 16408,
    largestMarket: "China (customer-location basis)",
    currencies: null,
    productionRegions: null,
    growthDriver: null,
    risk: "Research question: how do customer concentration and currency translation affect reported results?",
    capitalAllocation: null,
    source: {
      label: "Corning 2025 Form 10-K · Note 18, pp. 104–105",
      href: "https://www.sec.gov/Archives/edgar/data/24741/000002474126000124/glw-20251231.htm",
      period: "Year ended 2025-12-31",
      currency: "USD",
      units: "Millions",
      updated: "2026-09-26",
      basis:
        "Geographic sales use the segment reporting basis (16,408), before the 779 constant-currency adjustment to consolidated GAAP sales (15,629). Shares use 16,408. Customer location is not invoicing currency. Mexico is included in North America; Latin America is not separately available.",
    },
  },
};
