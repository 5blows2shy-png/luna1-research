import type { MetadataRoute } from "next";
import { commentary, research } from "@/lib/data";
const routes = [
  "",
  "/about",
  "/brand",
  "/certifications",
  "/contact",
  "/financial-models",
  "/investment-philosophy",
  "/luna1-framework",
  "/market-commentary",
  "/portfolio",
  "/portfolio/mistake-journal",
  "/recruiter",
  "/research",
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
    ...commentary.map((item) => ({
      url: `${base}/market-commentary/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
