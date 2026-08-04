"use client";

import { usePathname } from "next/navigation";
import { MarketPulse } from "@/components/market-pulse";

export function RouteAwareMarketPulse() {
  const pathname = usePathname();
  const isLunaBooks = pathname === "/transaction-intelligence"
    || pathname.startsWith("/transaction-intelligence/");

  return isLunaBooks ? null : <MarketPulse />;
}
