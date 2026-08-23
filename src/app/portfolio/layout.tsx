import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Portfolio overview, active positions, watchlist, long-term compounders, and decision reviews.",
};
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
