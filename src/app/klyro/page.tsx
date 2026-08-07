import type { Metadata } from "next";
import { KlyroAd } from "@/components/luna-books-ad/luna-books-ad";

export const metadata: Metadata = {
  title: "Klyro | Financial Decision Support",
  description: "See how Klyro helps small-business owners understand what their business may safely spend.",
};

export default function KlyroPage() {
  return <section aria-label="Klyro"><KlyroAd /></section>;
}
