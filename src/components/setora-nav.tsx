"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setoraNavigation } from "@/lib/setora";

export function SetoraNav() {
  const pathname = usePathname();
  return <nav className="setora-product-nav" aria-label="SETORA sections">{setoraNavigation.map(([label, href]) => <Link key={href} href={href} className={pathname === href ? "active" : undefined} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>;
}
