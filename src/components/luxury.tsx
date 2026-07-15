import Link from "next/link";
import type { ReactNode } from "react";

type CardVariant =
  | "research"
  | "portfolio"
  | "review"
  | "recruiter"
  | "download";

export function LuxuryCard({
  variant,
  children,
  className = "",
}: {
  variant: CardVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`luxury-card luxury-card--${variant} ${className}`.trim()}
    >
      {children}
    </article>
  );
}

export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="luxury-metric">
      <small>{label}</small>
      <strong>{value}</strong>
      {note && <span>{note}</span>}
    </div>
  );
}

export function EditorialLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="editorial-link" href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function PrismSignature() {
  const factors = ["Fundamentals", "Capital", "Moat", "Structure", "Risk"];
  return (
    <div
      className="prism-signature"
      aria-label="The Luna1 prism separates one market price into underlying research dimensions"
    >
      <div className="prism-price">
        <span>MARKET PRICE</span>
        <i />
      </div>
      <div className="prism-core">
        <span>L1</span>
      </div>
      <div className="prism-rays">
        {factors.map((factor, index) => (
          <span key={factor} style={{ "--ray": index } as React.CSSProperties}>
            {factor}
          </span>
        ))}
      </div>
      <small>ONE PRICE · MULTIPLE SOURCES OF EVIDENCE</small>
    </div>
  );
}
