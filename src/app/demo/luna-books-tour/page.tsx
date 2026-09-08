import type { Metadata } from "next";
import { LunaBooksTour } from "@/components/luna-books-tour";

export const metadata: Metadata = {
  title: "Luna Books Guided Tour",
  description: "Explore Luna Books through a safe, interactive fictional business workspace.",
  robots: { index: true, follow: true },
};

export default function LunaBooksTourPage() {
  return <LunaBooksTour />;
}
