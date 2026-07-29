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
        <div className="research-evidence-legend" aria-label="Data labels">
          {[
            "Reported",
            "Calculated",
            "Estimated",
            "Forecast",
            "Scenario Assumption",
          ].map((label) => (
            <span className="research-data-label" key={label}>
              {label}
            </span>
          ))}
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
            : "Review disclosed business segments."
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

      <ResearchSection
        eyebrow="Operating components"
        title="Build From Operating Components"
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Reported operating evidence, economic relationships, and open
              uncertainties
            </caption>
            <thead>
              <tr>
                <th>Component</th>
                <th>Historical evidence</th>
                <th>Unit</th>
                <th>Revenue relationship</th>
                <th>Margin relationship</th>
                <th>Cash-flow relationship</th>
                <th>Key uncertainty</th>
                <th>Analyst interpretation</th>
              </tr>
            </thead>
            <tbody>
              {company.operatingComponents.map((record) => (
                <tr key={record.name}>
                  <td data-label="Component">
                    <strong>{record.name}</strong>
                    <small className="research-data-label">
                      {record.evidenceLabel}
                    </small>
                  </td>
                  <td data-label="Historical evidence">
                    {record.sourceUrl ? (
                      <a href={record.sourceUrl} rel="noreferrer" target="_blank">
                        {record.historicalEvidence}
                      </a>
                    ) : (
                      record.historicalEvidence
                    )}
                  </td>
                  <td data-label="Unit">{record.unit}</td>
                  <td data-label="Revenue relationship">
                    {record.revenueRelationship}
                  </td>
                  <td data-label="Margin relationship">
                    {record.marginRelationship}
                  </td>
                  <td data-label="Cash-flow relationship">
                    {record.cashFlowRelationship}
                  </td>
                  <td data-label="Key uncertainty">{record.uncertainty}</td>
                  <td data-label="Analyst interpretation">
                    {record.interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResearchSection>

      {!isEtf && (
        <ResearchSection
          eyebrow="Historical financials"
          title="Five Years of Evidence — Not Invented Precision"
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
          eyebrow="Estimates"
          title="Current-period calculations are not reported results."
        >
          {company.estimates.length ? (
            <div className="table-wrap research-table-wrap">
              <table>
                <caption>
                  Values inferred for an incomplete or recently completed period
                </caption>
                <thead>
                  <tr>
                    <th>Estimate</th>
                    <th>Value</th>
                    <th>Method</th>
                    <th>Source inputs</th>
                    <th>Period</th>
                    <th>Confidence</th>
                    <th>Limitations</th>
                    <th>Management guidance</th>
                  </tr>
                </thead>
                <tbody>
                  {company.estimates.map((record) => (
                    <tr key={record.name}>
                      <td data-label="Estimate">
                        {record.name}
                        <small className="research-data-label">
                          {record.evidenceLabel}
                        </small>
                      </td>
                      <td data-label="Value">{record.value}</td>
                      <td data-label="Method">{record.calculationMethod}</td>
                      <td data-label="Source inputs">{record.sourceInputs}</td>
                      <td data-label="Period">{record.reportingPeriod}</td>
                      <td data-label="Confidence">{record.confidence}</td>
                      <td data-label="Limitations">{record.limitations}</td>
                      <td data-label="Management guidance">
                        {record.managementGuidance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState>
              No analyst estimate is published. Reported results and management
              guidance remain labeled separately in the source record.
            </EmptyState>
          )}
        </ResearchSection>
      )}

      <ResearchSection
        eyebrow="Forecasts"
        title="Forward expectations begin with operating drivers."
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Forward-looking analyst framework · unsupported point forecasts
              are withheld
            </caption>
            <thead>
              <tr>
                <th>Period</th>
                <th>Metric</th>
                <th>Base case</th>
                <th>Bull case</th>
                <th>Bear case</th>
                <th>Operating-driver build</th>
                <th>Difference from guidance</th>
                <th>Main sensitivity</th>
                <th>Principal risk</th>
              </tr>
            </thead>
            <tbody>
              {company.forecastScenarios.map((record) => (
                <tr key={`${record.period}-${record.metric}`}>
                  <td data-label="Period">{record.period}</td>
                  <td data-label="Metric">
                    {record.metric}
                    <small className="research-data-label">Forecast</small>
                  </td>
                  <td data-label="Base case">{record.baseCase}</td>
                  <td data-label="Bull case">{record.bullCase}</td>
                  <td data-label="Bear case">{record.bearCase}</td>
                  <td data-label="Operating-driver build">
                    {record.operatingDriverBuild}
                  </td>
                  <td data-label="Difference from guidance">
                    {record.managementGuidanceDifference}
                  </td>
                  <td data-label="Main sensitivity">
                    {record.mainSensitivity}
                  </td>
                  <td data-label="Principal risk">{record.principalRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>Forecast assumption register</caption>
            <thead>
              <tr>
                <th>Assumption</th>
                <th>Historical basis</th>
                <th>Management evidence</th>
                <th>Luna1 interpretation</th>
                <th>Base</th>
                <th>Bull</th>
                <th>Bear</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {company.forecastAssumptions.map((record) => (
                <tr key={record.assumption}>
                  <td data-label="Assumption">
                    {record.sourceUrl ? (
                      <a href={record.sourceUrl} rel="noreferrer" target="_blank">
                        {record.assumption}
                      </a>
                    ) : (
                      record.assumption
                    )}
                  </td>
                  <td data-label="Historical basis">
                    {record.historicalBasis}
                  </td>
                  <td data-label="Management evidence">
                    {record.managementEvidence}
                  </td>
                  <td data-label="Luna1 interpretation">
                    {record.interpretation}
                  </td>
                  <td data-label="Base">{record.baseCase}</td>
                  <td data-label="Bull">{record.bullCase}</td>
                  <td data-label="Bear">{record.bearCase}</td>
                  <td data-label="Last updated">{record.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResearchSection>

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
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Valuation framework · market data, reported data, forecasts, and
              assumptions remain separate
            </caption>
            <tbody>
              {[
                ["Selected method", company.valuationFramework.method],
                ["Why it fits", company.valuationFramework.rationale],
                ["Valuation date", company.valuationFramework.valuationDate],
                ["Share-price date", company.valuationFramework.sharePriceDate],
                ["Share count", company.valuationFramework.shareCount],
                ["Net debt or cash", company.valuationFramework.netDebtOrCash],
                ["Forecast period", company.valuationFramework.forecastPeriod],
                ["Discount rate", company.valuationFramework.discountRate],
                [
                  "Terminal assumption",
                  company.valuationFramework.terminalAssumption,
                ],
                ["Scenario range", company.valuationFramework.scenarioRange],
                [
                  "Major sensitivities",
                  company.valuationFramework.majorSensitivities,
                ],
                [
                  "Calculation source",
                  company.valuationFramework.calculationSource,
                ],
                ["Limitations", company.valuationFramework.limitations],
              ].map(([label, detail]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td data-label={label}>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Comparable companies"
        title="Comparable evidence remains separate from valuation output."
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
        eyebrow="Thesis monitoring"
        title="Evidence that strengthens or challenges the case."
      >
        <div className="research-summary-grid">
          {[
            ["Core thesis", company.thesisMonitoring.coreThesis],
            [
              "Evidence supporting the thesis",
              company.thesisMonitoring.supportingEvidence,
            ],
            [
              "Evidence challenging the thesis",
              company.thesisMonitoring.challengingEvidence,
            ],
            [
              "Key quarterly metric",
              company.thesisMonitoring.keyQuarterlyMetric,
            ],
            ["Key annual metric", company.thesisMonitoring.keyAnnualMetric],
            [
              "Primary valuation driver",
              company.thesisMonitoring.primaryValuationDriver,
            ],
            [
              "Primary downside risk",
              company.thesisMonitoring.primaryDownsideRisk,
            ],
            ["Upcoming catalyst", company.thesisMonitoring.upcomingCatalyst],
            [
              "Next earnings date",
              company.thesisMonitoring.nextEarningsDate,
            ],
            ["Thesis status", company.thesisMonitoring.status],
            ["Last reviewed", company.thesisMonitoring.lastReviewed],
          ].map(([title, detail]) => (
            <article className="luxury-card" key={title}>
              <span className="eyebrow">{title}</span>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Earnings history"
        title="Verified quarterly evidence."
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
        title="Research changes and open questions."
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
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              Primary-source register · source publication dates are preserved
            </caption>
            <thead>
              <tr>
                <th>Document</th>
                <th>Publisher</th>
                <th>Publication date</th>
                <th>Reporting period</th>
                <th>Type</th>
                <th>Relevant section</th>
                <th>Date accessed</th>
              </tr>
            </thead>
            <tbody>
              {company.sources.map((source) => (
                <tr key={source.href}>
                  <td data-label="Document">
                    <a href={source.href} rel="noreferrer" target="_blank">
                      {source.label}
                    </a>
                  </td>
                  <td data-label="Publisher">
                    {source.publisher ?? "Publisher identified by source"}
                  </td>
                  <td data-label="Publication date">
                    {source.publicationDate ?? "See source"}
                  </td>
                  <td data-label="Reporting period">
                    {source.reportingPeriod ?? "See source"}
                  </td>
                  <td data-label="Type">{source.type}</td>
                  <td data-label="Relevant section">
                    {source.relevantSection ?? "See source"}
                  </td>
                  <td data-label="Date accessed">
                    {source.accessedDate ?? "Not recorded"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="research-source-note">
          <p>{RESEARCH_SOURCE_NOTE}</p>
          <p>
            <strong>Educational disclosure:</strong> {RESEARCH_DISCLOSURE}
          </p>
        </div>
      </ResearchSection>

      <ResearchSection
        eyebrow="Research completeness"
        title="What is supported, partial, or still missing."
      >
        <div className="table-wrap research-table-wrap">
          <table>
            <caption>
              A heading alone does not qualify a section as complete
            </caption>
            <thead>
              <tr>
                <th>Section</th>
                <th>Status</th>
                <th>Audit note</th>
              </tr>
            </thead>
            <tbody>
              {company.completeness.map((record) => (
                <tr key={record.section}>
                  <td data-label="Section">{record.section}</td>
                  <td data-label="Status">
                    <span className="research-data-label">{record.status}</span>
                  </td>
                  <td data-label="Audit note">{record.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
