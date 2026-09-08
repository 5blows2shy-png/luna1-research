import type { ReactNode } from "react";
import { SetoraNav } from "@/components/setora-nav";

export default function SetoraLayout({ children }: { children: ReactNode }) {
  return <><div className="setora-nav-shell"><SetoraNav /></div>{children}</>;
}
