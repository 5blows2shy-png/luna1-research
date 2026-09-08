import Link from "next/link";
import { capitalFlowThemes } from "@/data/research/capital-flows";
import { research } from "@/lib/data";
import { companyResearch } from "@/lib/research-content";

const researchCompanies = new Map([
  ...research.map((company) => [
    company.ticker,
    {
      name: company.company,
      href: `/research/${company.ticker.toLowerCase()}`,
      status: company.status,
    },
  ] as const),
  ...companyResearch.map((company) => [
    company.ticker,
    {
      name: company.companyName,
      href: `/research/companies/${company.slug}`,
      status: company.status,
    },
  ] as const),
]);

const horizonLabels = [
  ["NOW", "0–2 years", "now"],
  ["NEXT", "2–5 years", "next"],
  ["EMERGING", "5–10 years", "emerging"],
] as const;

export function CapitalFlowMap() {
  return (
    <section className="capital-flow-map" id="capital-flows" aria-labelledby="capital-flow-title">
      <header className="capital-flow-intro">
        <div>
          <span className="eyebrow">Equity Research · Capital allocation</span>
          <h2 id="capital-flow-title">Capital Flow Map</h2>
        </div>
        <div>
          <p className="capital-flow-subtitle">
            Tracking where structural demand, infrastructure spending, and
            investment may create the next major opportunities.
          </p>
          <p>
            Luna1 follows capital from the macro trend to the bottleneck, then
            down to the companies positioned to capture that spending.
          </p>
        </div>
      </header>

      <div className="capital-flow-question">
        <span>Central research question</span>
        <strong>Who gets paid to remove the bottleneck?</strong>
      </div>

      <ol className="capital-flow-framework" aria-label="Capital flow research framework">
        {[
          "Structural trend",
          "Capital need",
          "Bottleneck",
          "Spending",
          "Value chain",
          "Public companies",
          "Equity research",
        ].map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{step}</b>
          </li>
        ))}
      </ol>

      <div className="capital-flow-theme-index" aria-label="Capital flow themes">
        {capitalFlowThemes.map((theme) => (
          <a href={`#capital-flow-${theme.id}`} key={theme.id}>
            {theme.name}
          </a>
        ))}
      </div>

      <div className="capital-flow-themes">
        {capitalFlowThemes.map((theme, themeIndex) => (
          <details className="capital-flow-theme" id={`capital-flow-${theme.id}`} key={theme.id} open={themeIndex === 0}>
            <summary className="capital-flow-theme-summary">
              <div>
                <span className="eyebrow">
                  {String(themeIndex + 1).padStart(2, "0")} · Structural theme
                </span>
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>
              <div className="capital-flow-status-block">
                <span className={`capital-flow-status capital-flow-status--${theme.status.toLowerCase()}`}>
                  {theme.status}
                </span>
                <small>Updated {theme.lastUpdated}</small>
              </div>
            </summary>

            <details className="capital-flow-collapsible" open>
              <summary>Flow framework <small>Horizon and capital chain</small></summary>
              <div className="capital-flow-horizons" aria-label={`${theme.name} qualitative horizon`}>
              {horizonLabels.map(([label, period, key]) => (
                <div
                  className={`capital-flow-horizon capital-flow-horizon--${theme.horizons[key].toLowerCase()}`}
                  key={label}
                >
                  <span>{label}</span>
                  <small>{period}</small>
                  <b><i aria-hidden="true" />{theme.horizons[key]}</b>
                </div>
              ))}
              <p>Qualitative research view · not a probability forecast</p>
              </div>

              <ol className="capital-flow-chain" aria-label={`${theme.name} capital flow chain`}>
              {theme.flow.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{step}</b>
                </li>
              ))}
              </ol>
            </details>

            <details className="capital-flow-detail">
              <summary>Why this status?</summary>
              <p>{theme.statusRationale}</p>
              <p><b>Key change:</b> {theme.keyChange}</p>
            </details>

            <details className="capital-flow-collapsible">
              <summary>Bottlenecks <small>{theme.bottlenecks.length} operating constraints</small></summary>
              <div className="capital-flow-bottlenecks">
              {theme.bottlenecks.map((bottleneck) => (
                <section className="capital-flow-bottleneck-card" key={bottleneck.name}>
                  <span className="eyebrow">Bottleneck</span>
                  <h4>{bottleneck.name}</h4>
                  <p>{bottleneck.whyItMatters}</p>
                  <div>
                    <b>Capital response</b>
                    <ul>
                      {bottleneck.capitalResponse.map((response) => (
                        <li key={response}>{response}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
              </div>
            </details>

            <details className="capital-flow-collapsible">
              <summary>Company mapping <small>{theme.companies.length} mapped companies</small></summary>
              <section className="capital-flow-companies" aria-labelledby={`${theme.id}-companies`}>
              <div className="capital-flow-section-label">
                <span className="eyebrow">Public company mapping</span>
                <h4 id={`${theme.id}-companies`}>Companies in the flow</h4>
              </div>
              {theme.companies.length ? (
                <div className="capital-flow-company-grid">
                  {theme.companies.map((mapping) => {
                    const company = researchCompanies.get(mapping.ticker);
                    return (
                    <article className="capital-flow-company-card" key={mapping.ticker}>
                        <header>
                          <span className="ticker">{mapping.ticker}</span>
                          <small>{mapping.valueChainNode}</small>
                        </header>
                        <h5>{company?.name ?? "Company record pending"}</h5>
                        <p>{mapping.role}</p>
                        <dl>
                          <div><dt>Revenue growth</dt><dd>Not Yet Evaluated</dd></div>
                          <div><dt>Earnings growth</dt><dd>Not Yet Evaluated</dd></div>
                          <div><dt>Backlog / orders</dt><dd>Not Yet Evaluated</dd></div>
                          <div><dt>Valuation</dt><dd>Not Yet Evaluated</dd></div>
                          <div><dt>Technical status</dt><dd>Not Yet Evaluated</dd></div>
                          <div><dt>Research status</dt><dd>{company?.status ?? "Research Pending"}</dd></div>
                        </dl>
                        {company ? (
                          <Link className="text-link" href={company.href}>
                            View Equity Research →
                          </Link>
                        ) : (
                          <span className="capital-flow-pending">Research Pending</span>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="research-empty">Research Pending · No company mapping has been published.</div>
              )}
              </section>
            </details>

            <details className="capital-flow-collapsible">
              <summary>Evidence &amp; risk <small>What could change the thesis?</small></summary>
              <div className="capital-flow-evidence-grid">
              <section>
                <span className="eyebrow">Capital flow evidence</span>
                <h4>Evidence review</h4>
                <dl>
                  {theme.evidence.map((evidence) => (
                    <div className={`capital-flow-evidence capital-flow-evidence--${evidence.status.toLowerCase().replaceAll(" ", "-")}`} key={evidence.type}>
                      <dt>{evidence.type}</dt>
                      <dd>
                        <b>{evidence.status}</b>
                        <span>{evidence.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section>
                <span className="eyebrow">Risk discipline</span>
                <h4>What could change the thesis?</h4>
                <ul>
                  {theme.thesisRisks.map((risk) => <li key={risk}>{risk}</li>)}
                </ul>
              </section>
              </div>
            </details>
          </details>
        ))}
      </div>

      <aside className="capital-flow-positioning">
        <span className="eyebrow">My positioning</span>
        <p>
          I am not trying to predict which technology gets the most headlines.
          I am looking for the businesses that become necessary if the larger
          trend succeeds. The focus is on identifying bottlenecks, following
          the capital needed to remove them, and researching the companies
          positioned to capture that spending.
        </p>
      </aside>
    </section>
  );
}
