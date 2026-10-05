import Link from "next/link";
import type { ReactNode } from "react";
import { LunaMark } from "@/components/luna-mark";

export { LunaMark } from "@/components/luna-mark";
export { Score } from "@/components/luna-score";

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-intro">
          <Link className="brand" href="/">
            <LunaMark />
            <span className="brand-lockup">
              <b>LUNA1 RESEARCH</b>
              <small>Independent investment &amp; global finance research</small>
            </span>
          </Link>
          <p>
            Independent investment and global finance research by Shy Lee.
          </p>
        </div>
        <div>
          <span className="eyebrow">Research</span>
          <p>
            <Link href="/research">Equity Research</Link>
            <Link href="/research/capital-flows">Capital Flows</Link>
            <Link href="/global-finance">Global Finance</Link>
            <Link href="/valuation-models">Models</Link>
          </p>
        </div>
        <div>
          <span className="eyebrow">Profile</span>
          <p>
            <Link href="/recruiter">Professional Profile</Link>
            <Link href="/portfolio">Portfolio Lab</Link>
            <Link href="/development-log">Development Log</Link>
          </p>
        </div>
        <div>
          <span className="eyebrow">Created by Shy Lee</span>
          <p>
            Recruiting, research, and collaboration inquiries are available
            through the secure <Link href="/contact">contact form</Link>.
          </p>
        </div>
      </div>
      <div className="disclaimer">
        <strong>Educational Disclosure:</strong> The information on Luna1
        Research is provided for educational and informational purposes only. It
        reflects personal analysis and opinions and is not investment,
        financial, tax, or legal advice. Always conduct your own research before
        making investment decisions.
      </div>
      <div className="copyright">
        <span>© 2026 Luna1 Research. All rights reserved.</span>
        <span>
          <Link href="/about">About</Link>
          <Link className="footer-brand-link" href="/brand">
            Brand Assets
          </Link>
        </span>
      </div>
    </footer>
  );
}
export function PageHeader({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className={`page-header${children ? " page-header-with-aside" : ""}`}>
      <div className="page-header-rule" />
      <div>
        <span className="eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}
