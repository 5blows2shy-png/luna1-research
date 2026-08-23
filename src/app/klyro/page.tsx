import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KlyroLogin } from "@/components/klyro-account";
import { readSession } from "@/lib/klyro/session";

export const metadata: Metadata = {
  title: "Klyro | Financial Decision Support",
  description: "See how Klyro helps small-business owners understand what their business may safely spend.",
};

export default async function KlyroPage() {
  if (await readSession()) redirect("/klyro/businesses");
  return <KlyroLogin />;
}
