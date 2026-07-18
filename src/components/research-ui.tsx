import Link from "next/link";
import { EditorialLink, LuxuryCard } from "@/components/luxury";
import { formatResearchDate } from "@/lib/date";
import {
  FINANCIAL_DISCLAIMER,
  type CompanyResearch,
  type InvestmentTheme,
  type ResearchStatus,
} from "@/lib/research-content";

export function ResearchDisclaimer() {
  return <aside className="research-disclaimer">{FINANCIAL_DISCLAIMER}</aside>;
}

export function ResearchStatusBadge({
  status,
}: {
  status: ResearchStatus | "Completed" | "Planned";
}) {
  return (
    <span
      className={`research-status research-status--${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

export function LastUpdated({ date }: { date: string }) {
  return (
    <time className="research-date">
      Last updated · {formatResearchDate(date)}
    </time>
  );
}

export function ResearchSectionNav() {
  return (
    <nav className="research-section-nav" aria-label="Research sections">
      <Link href="/research">Research Hub</Link>
      <Link href="/research/themes">Investment Themes</Link>
      <Link href="/research/notes">Research Notes</Link>
      <Link href="/research/library">Reading Library</Link>
    </nav>
  );
}

export function CompanyResearchCard({ company }: { company: CompanyResearch }) {
  return (
    <LuxuryCard variant="research" className="research-hub-card">
      <div className="research-card-heading">
        <div>
          <span className="ticker">{company.ticker}</span>
          <small>
            {company.sector} · {company.industry}
          </small>
        </div>
        <ResearchStatusBadge status={company.status} />
      </div>
      <h3>{company.companyName}</h3>
      <p>{company.summary}</p>
      <div className="research-card-footer">
        <LastUpdated date={company.lastUpdated} />
        <EditorialLink href={`/research/companies/${company.slug}`}>
          Open dossier
        </EditorialLink>
      </div>
    </LuxuryCard>
  );
}

export function ThemeCard({ theme }: { theme: InvestmentTheme }) {
  return (
    <LuxuryCard variant="research" className="research-hub-card theme-card">
      <div className="research-card-heading">
        <span className="eyebrow">Investment theme</span>
        <ResearchStatusBadge status={theme.status} />
      </div>
      <h3>{theme.title}</h3>
      <p>{theme.summary}</p>
      <div className="research-card-footer">
        <LastUpdated date={theme.lastUpdated} />
        <EditorialLink href={`/research/themes/${theme.slug}`}>
          View theme
        </EditorialLink>
      </div>
    </LuxuryCard>
  );
}

export function ResearchEmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="research-empty" role="status">
      {children}
    </div>
  );
}
