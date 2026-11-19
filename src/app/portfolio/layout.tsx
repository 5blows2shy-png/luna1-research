import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Portfolio overview, watchlist, long-term holdings, and decision reviews.",
};
export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
