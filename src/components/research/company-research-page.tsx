import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { luna1Brand } from "@/config/brand";
import {
  DATA_PENDING,
  RESEARCH_DISCLOSURE,
  RESEARCH_SOURCE_NOTE,
} from "@/data/research/research-disclosures";
import type {
  CompanyResearchCoverage,
  ResearchDocument,
  ResearchLink,
} from "@/data/research/research-types";

function value(value: number | null, format: "number" | "percent" = "number") {
  if (value === null) return DATA_PENDING;
  return format === "percent"
    ? `${(value * 100).toFixed(1)}%`
    : value.toLocaleString("en-US");
}

function ResearchSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="company-research-section">
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Action({ link }: { link: ResearchLink }) {
  if (!link.href) {
    return (
      <button
        className="button research-action-disabled"
        disabled
        title={`${link.label} will be enabled after a verified URL is added.`}
        type="button"
      >
        {link.label} · Pending
      </button>
    );
  }
  return (
    <a className="button" href={link.href} rel="noreferrer" target="_blank">
      {link.label}
    </a>
  );
}

function DownloadAction({
  document,
  availableLabel,
}: {
  document: ResearchDocument;
  availableLabel: string;
}) {
  if (document.status !== "available" || !document.url) {
    return (
      <button
        className="button research-action-disabled"
        disabled
        title={`${document.fileFormat} download is being completed and reviewed.`}
        type="button"
      >
        {document.fileFormat === "PDF" ? "Report" : "Model"} in Progress
      </button>
    );
  }
  return (
    <a className="button" download href={document.url}>
      {availableLabel}
    </a>
  );
}

function DocumentPreview({
  company,
  document,
  title,
}: {
  company: CompanyResearchCoverage;
  document: ResearchDocument;
  title: string;
}) {
  return (
    <article className="document-preview-card">
      <div className="document-preview-paper">
        <Image
          alt="Luna1 Research logo"
          height={55}
          src={luna1Brand.logoPath}
          width={160}
        />
        <span>{company.ticker}</span>
        <h3>{company.companyName}</h3>
        <p>{title}</p>
        <small>Prepared by {luna1Brand.analyst}</small>
      </div>
      <dl>
        <div>
          <dt>Last updated</dt>
          <dd>{company.lastUpdated}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{document.fileFormat}</dd>
        </div>
        <div>
          <dt>File size</dt>
          <dd>{document.fileSize ?? "Available after publication"}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>In progress</dd>
        </div>
      </dl>
    </article>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="research-empty-state">{children}</div>;
}

export function CompanyResearchPage({
  company,
}: {
  company: CompanyResearchCoverage;
}) {
  const isEtf = company.kind === "etf";
  const isTraditionalDcf = !["etf", "bank", "investment-bank"].includes(
    company.kind,
  );
  const modelLabel = isEtf
    ? "Download ETF Research Model"
    : "Download Valuation Model";

  return (
    <>
      <section className="company-research-header">
        <div>
          <span className="eyebrow">
            {company.ticker} · {company.sector} · {company.industry}
          </span>
          <h1>{company.companyName}</h1>
          <p>{company.description}</p>
        </div>
        <aside className="research-ledger" aria-label="Research record">
          <dl>
            <div>
              <dt>Ticker</dt>
              <dd>{company.ticker}</dd>
            </div>
            <div>
              <dt>Exchange</dt>
              <dd>{company.exchange}</dd>
            </div>
            <div>
              <dt>Research status</dt>
              <dd>{company.researchStatus}</dd>
            </div>
            <div>
              <dt>Thesis status</dt>
              <dd>{company.thesisStatus}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{company.lastUpdated}</dd>
            </div>
            <div>
              <dt>Analyst</dt>
              <dd>{luna1Brand.analyst} · Luna1 Research</dd>
            </div>
          </dl>
        </aside>
        <div className="button-row research-actions">
          <DownloadAction
            availableLabel="Download Research Report"
            document={company.report}
          />
          <DownloadAction
            availableLabel={modelLabel}
            document={company.model}
          />
          <Action link={company.latestFiling} />
          <Action link={company.investorRelations} />
        </div>
      </section>

      <ResearchSection
        eyebrow="Executive summary"
        title="The questions under review."
      >
        <div className="research-summary-grid">
          {[
            ["What the company does", company.description],
            ["Why it is on the Watchlist", company.watchlistReason],
            ["Core investment question", company.coreInvestmentQuestion],
            ["Primary monitoring reason", company.primaryMonitoringReason],
            ["Current thesis summary", company.thesisSummary],
            ["Key valuation question", company.keyValuationQuestion],
          ].map(([title, detail]) => (
            <article className="luxury-card" key={title}>
              <span className="eyebrow">{title}</span>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      {company.specialSection && (
        <ResearchSection
          eyebrow="Operating perspective"
          title={company.specialSection.title}
        >
          <div className="prose research-personal-note">
            <p className="lead">{company.specialSection.body}</p>
          </div>
        </ResearchSection>
      )}

      <ResearchSection
        eyebrow="Investment thesis"
        title="Scenarios before conviction."
      >
        <div className="research-thesis-grid">
          {[
            ["Bull case", company.bullCase],
            ["Base case", company.baseCase],
            ["Bear case", company.bearCase],
            ["What the market may be missing", company.marketMayBeMissing],
            ["Conditions required", company.thesisRequirements],
            ["What would invalidate the thesis", company.thesisInvalidation],
          ].map(([title, detail]) => (
            <article className="luxury-card" key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow={isEtf ? "Fund overview" : "Business overview"}
        title={
          isEtf
            ? "Understand the portfolio before the theme."
            : "Understand the operating system."
        }
      >
        <div className="research-diligence-grid">
          {company.businessOverview.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow={isEtf ? "Exposure analysis" : "Segment analysis"}
        title={
          isEtf
            ? "Map what the fund actually owns."
            : "Build from operating components."
        }
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              {isEtf ? "Fund exposure inputs" : "Company segment inputs"} ·
              source citations required
            </caption>
            <thead>
              <tr>
                <th>{isEtf ? "Exposure" : "Segment"}</th>
                <th>Revenue</th>
                <th>Growth</th>
                <th>Operating income</th>
                <th>Operating margin</th>
                <th>Share of total</th>
                <th>Key driver</th>
              </tr>
            </thead>
            <tbody>
              {company.segments.map((segment) => (
                <tr key={segment.name}>
                  <td data-label={isEtf ? "Exposure" : "Segment"}>
                    {segment.name}
                  </td>
                  <td data-label="Revenue">{value(segment.revenue)}</td>
                  <td data-label="Growth">
                    {value(segment.revenueGrowth, "percent")}
                  </td>
                  <td data-label="Operating income">
                    {value(segment.operatingIncome)}
                  </td>
                  <td data-label="Operating margin">
                    {value(segment.operatingMargin, "percent")}
                  </td>
                  <td data-label="Share of total">
                    {value(segment.shareOfRevenue, "percent")}
                  </td>
                  <td data-label="Key driver">{segment.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResearchSection>

      {!isEtf && (
        <ResearchSection
          eyebrow="Historical financials"
          title="Five years of evidence—not invented precision."
        >
          <div className="table-wrap research-table-wrap">
            <table>
              <caption>
                Historical inputs · all values remain pending until sourced
              </caption>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                  <th>Gross profit</th>
                  <th>Gross margin</th>
                  <th>Operating income</th>
                  <th>Operating margin</th>
                  <th>EBITDA</th>
                  <th>EBITDA margin</th>
                  <th>Net income</th>
                  <th>EPS</th>
                  <th>Operating cash flow</th>
                  <th>Capital expenditures</th>
                  <th>FCF</th>
                  <th>Cash</th>
                  <th>Debt</th>
                  <th>Diluted shares</th>
                </tr>
              </thead>
              <tbody>
                {company.historicalFinancials.map((record) => (
                  <tr key={record.period}>
                    <td data-label="Period">{record.period}</td>
                    <td data-label="Revenue">{value(record.revenue)}</td>
                    <td data-label="Growth">
                      {value(record.revenueGrowth, "percent")}
                    </td>
                    <td data-label="Gross profit">
                      {value(record.grossProfit)}
                    </td>
                    <td data-label="Gross margin">
                      {value(record.grossMargin, "percent")}
                    </td>
                    <td data-label="Operating income">
                      {value(record.operatingIncome)}
                    </td>
                    <td data-label="Operating margin">
                      {value(record.operatingMargin, "percent")}
                    </td>
                    <td data-label="EBITDA">{value(record.ebitda)}</td>
                    <td data-label="EBITDA margin">
                      {value(record.ebitdaMargin, "percent")}
                    </td>
                    <td data-label="Net income">{value(record.netIncome)}</td>
                    <td data-label="EPS">{value(record.dilutedEps)}</td>
                    <td data-label="Operating cash flow">
                      {value(record.operatingCashFlow)}
                    </td>
                    <td data-label="Capital expenditures">
                      {value(record.capitalExpenditures)}
                    </td>
                    <td data-label="FCF">{value(record.freeCashFlow)}</td>
                    <td data-label="Cash">{value(record.cash)}</td>
                    <td data-label="Debt">{value(record.debt)}</td>
                    <td data-label="Diluted shares">
                      {value(record.dilutedShares)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResearchSection>
      )}

      <ResearchSection
        eyebrow="Revenue build"
        title="Model the actual economic drivers."
      >
        <div className="research-driver-grid">
          {company.revenueDrivers.map((driver, index) => (
            <article key={driver}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{driver}</h3>
              <p>{DATA_PENDING} · source and assumption required</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      {!isEtf && (
        <ResearchSection
          eyebrow="Forecast model"
          title="Separate estimates from forecasts."
        >
          <div className="table-wrap research-table-wrap">
            <table>
              <caption>
                Editable forecast framework · no estimates have been entered
              </caption>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Type</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                  <th>Gross margin</th>
                  <th>Operating margin</th>
                  <th>EBITDA margin</th>
                  <th>Tax rate</th>
                  <th>EPS</th>
                  <th>Capex</th>
                  <th>FCF</th>
                  <th>Share count</th>
                  <th>Net debt</th>
                </tr>
              </thead>
              <tbody>
                {company.forecasts.map((record) => (
                  <tr key={record.period}>
                    <td data-label="Period">{record.period}</td>
                    <td data-label="Type">
                      Luna1 Research {record.periodType}
                    </td>
                    <td data-label="Revenue">{value(record.revenue)}</td>
                    <td data-label="Growth">
                      {value(record.revenueGrowth, "percent")}
                    </td>
                    <td data-label="Gross margin">
                      {value(record.grossMargin, "percent")}
                    </td>
                    <td data-label="Operating margin">
                      {value(record.operatingMargin, "percent")}
                    </td>
                    <td data-label="EBITDA margin">
                      {value(record.ebitdaMargin, "percent")}
                    </td>
                    <td data-label="Tax rate">
                      {value(record.taxRate, "percent")}
                    </td>
                    <td data-label="EPS">{value(record.eps)}</td>
                    <td data-label="Capex">
                      {value(record.capitalExpenditures)}
                    </td>
                    <td data-label="FCF">{value(record.freeCashFlow)}</td>
                    <td data-label="Share count">{value(record.shareCount)}</td>
                    <td data-label="Net debt">{value(record.netDebt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResearchSection>
      )}

      <ResearchSection
        eyebrow="Valuation"
        title="Make every assumption visible."
      >
        <div className="valuation-framework-grid">
          <article className="luxury-card">
            <h3>Methods</h3>
            <ul>
              {company.valuationMethods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </article>
          <article className="luxury-card">
            <h3>Primary model inputs</h3>
            <ul>
              {company.valuationFocus.map((focus) => (
                <li key={focus}>{focus}</li>
              ))}
            </ul>
          </article>
        </div>
        {isTraditionalDcf && (
          <div className="sensitivity-placeholder-grid">
            <article>
              <span className="eyebrow">Illustrative Scenario</span>
              <h3>WACC versus terminal growth</h3>
              <p>
                Sensitivity table will render after sourced assumptions are
                entered.
              </p>
            </article>
            <article>
              <span className="eyebrow">Illustrative Scenario</span>
              <h3>Revenue growth versus operating margin</h3>
              <p>
                Sensitivity table will render after sourced assumptions are
                entered.
              </p>
            </article>
          </div>
        )}
      </ResearchSection>

      <ResearchSection
        eyebrow="Comparable companies"
        title="Peer evidence requires sourced inputs."
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Comparable-company framework · no peer values entered
            </caption>
            <thead>
              <tr>
                <th>Company</th>
                <th>Ticker</th>
                <th>Market capitalization</th>
                <th>Enterprise value</th>
                <th>Revenue growth</th>
                <th>EBITDA margin</th>
                <th>EV/Revenue</th>
                <th>EV/EBITDA</th>
                <th>P/E</th>
                <th>FCF yield</th>
                <th>Price-to-book</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
        <EmptyState>
          Comparable-company data has not been entered. The model supports
          market capitalization, enterprise value, growth, margins, valuation
          multiples, free-cash-flow yield, and price-to-book where appropriate.
        </EmptyState>
      </ResearchSection>

      <ResearchSection
        eyebrow="Catalysts"
        title="What could change the evidence."
      >
        <div className="research-diligence-grid">
          {company.catalysts.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      <ResearchSection eyebrow="Risks" title="What could break the thesis.">
        <div className="research-diligence-grid">
          {company.risks.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Earnings history"
        title="Quarterly evidence will be added only when verified."
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>Quarterly earnings framework · no records entered</caption>
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Revenue</th>
                <th>Revenue growth</th>
                <th>EPS</th>
                <th>EPS growth</th>
                <th>Gross margin</th>
                <th>Operating margin</th>
                <th>Guidance</th>
                <th>Earnings reaction</th>
                <th>Analyst note</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
        <EmptyState>
          No earnings records or dated quarterly updates have been published.
          This section will remain empty until revenue, EPS, margins, guidance,
          market reaction, analyst notes, and source links are verified.
        </EmptyState>
      </ResearchSection>

      <ResearchSection
        eyebrow="Research notes"
        title="A dated record of what changes."
      >
        <EmptyState>
          No dated notes have been published. Earnings, investor-day, product,
          industry, valuation, thesis, and portfolio-lesson notes require a
          verified date and source.
        </EmptyState>
      </ResearchSection>

      <ResearchSection
        eyebrow="Downloads"
        title="Branded documents—published only when complete."
      >
        <div className="document-preview-grid">
          <DocumentPreview
            company={company}
            document={company.report}
            title="Equity Research and Valuation Report"
          />
          <DocumentPreview
            company={company}
            document={company.model}
            title={isEtf ? "ETF Research Model" : "Integrated Valuation Model"}
          />
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Sources and disclosures"
        title="Evidence before publication."
      >
        <EmptyState>
          No source links have been published. SEC filings, annual and quarterly
          reports, earnings releases, investor presentations, conference calls,
          investor-relations materials, and industry reports must be added to
          the coverage record first.
        </EmptyState>
        <div className="research-source-note">
          <p>{RESEARCH_SOURCE_NOTE}</p>
          <p>
            <strong>Educational disclosure:</strong> {RESEARCH_DISCLOSURE}
          </p>
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Analyst"
        title="Research ownership and professional context."
      >
        <div className="research-author-block">
          <div>
            <h3>{luna1Brand.analyst}</h3>
            <p>Finance Student, San Diego State University</p>
            <p>Founder, Luna1 Research</p>
            <p>Bloomberg Market Concepts Completed</p>
            <p>U.S. Army Veteran</p>
            <p>Experience in nonprofit finance and data-center operations</p>
          </div>
          <nav aria-label="Related Luna1 pages">
            <Link href="/portfolio">Watchlist</Link>
            <Link href="/research/themes">Investment Themes</Link>
            <Link href="/development-log">Development Log</Link>
            <Link href="/about">About</Link>
            <Link href="/recruiter">Recruiter View</Link>
          </nav>
        </div>
      </ResearchSection>
    </>
  );
}
