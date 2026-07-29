import Image from "next/image";
import Link from "next/link";
import { luna1Brand } from "@/config/brand";
import { watchlistCoverage } from "@/data/research/watchlist-coverage";

export function ResearchCoverageGrid() {
  return (
    <div className="research-coverage-block">
      <div className="section-heading">
        <span className="eyebrow">Luna1 Research Coverage</span>
        <h2>Research beneath the Watchlist.</h2>
        <p>
          Independent company research, valuation work, investment theses, and
          ongoing earnings updates across technology, infrastructure, financial
          services, industrials, and capital markets.
        </p>
      </div>
      <div className="research-coverage-grid">
        {watchlistCoverage.map((company) => (
          <article
            className="luxury-card research-coverage-card"
            key={company.ticker}
          >
            <header>
              <Image
                alt="Luna1 Research logo"
                className="coverage-logo"
                height={34}
                src={luna1Brand.logoPath}
                width={99}
              />
              <span className="ticker">{company.ticker}</span>
            </header>
            <h3>{company.companyName}</h3>
            <p>{company.industry}</p>
            <dl>
              <div>
                <dt>Research</dt>
                <dd>{company.researchStatus}</dd>
              </div>
              <div>
                <dt>Valuation</dt>
                <dd>{company.valuationStatus}</dd>
              </div>
              <div>
                <dt>Thesis</dt>
                <dd>{company.thesisStatus}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{company.lastUpdated}</dd>
              </div>
            </dl>
            <Link className="editorial-link" href={company.href}>
              View Full Research <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
