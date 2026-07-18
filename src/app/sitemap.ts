import type { MetadataRoute } from "next";
import { commentary, research } from "@/lib/data";
import { companyResearch, investmentThemes } from "@/lib/research-content";
const routes = [
  "",
  "/about",
  "/brand",
  "/certifications",
  "/contact",
  "/development-log",
  "/financial-models",
  "/investment-philosophy",
  "/luna1-framework",
  "/market-commentary",
  "/portfolio",
  "/portfolio/mistake-journal",
  "/recruiter",
  "/research",
  "/research/library",
  "/research/notes",
  "/research/themes",
  "/resume",
  "/valuation-models",
];
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://luna1research.com";
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...research.map((item) => ({
      url: `${base}/research/${item.ticker.toLowerCase()}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...companyResearch.map((item) => ({
      url: `${base}/research/companies/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...investmentThemes.map((item) => ({
      url: `${base}/research/themes/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...commentary.map((item) => ({
      url: `${base}/market-commentary/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
