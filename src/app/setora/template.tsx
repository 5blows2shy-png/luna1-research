"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function SetoraTemplate({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const close = () => container.current?.querySelectorAll("details[open]").forEach((pane) => pane.removeAttribute("open"));
    close();
    window.addEventListener("pageshow", close);
    return () => window.removeEventListener("pageshow", close);
  }, [pathname]);
  return <div ref={container}>{children}</div>;
}
