"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  buildCommitteeQuestions,
  calculateAnalystScenario,
  calculatePortfolioAnalysis,
  calculateProjectEconomics,
  calculateRiskAnalysis,
  defaultLunaAssumptions,
  defaultPortfolioInputs,
  defaultProjectInputs,
  defaultRiskInputs,
  RISK_FACTORS,
  THESIS_ROLES,
  type AnalystAssumptions,
  type PortfolioInputs,
  type ProjectInputs,
  type RiskInputs,
  type ThesisRole,
} from "@/lib/thesis-stress-test";

type CompanyContext = {
  company: string;
  ticker: string;
  catalyst: string;
  risk: string;
  date: string;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const analystFields: Array<[keyof AnalystAssumptions, string, string]> = [
  ["revenueGrowth", "Revenue growth", "%"],
  ["volumeGrowth", "Volume growth", "%"],
  ["pricing", "Pricing", "%"],
  ["productMix", "Product mix", "%"],
  ["grossMargin", "Gross margin", "%"],
  ["operatingMargin", "Operating margin", "%"],
  ["taxRate", "Tax rate", "%"],
  ["capex", "Capital expenditure", "$m"],
  ["workingCapital", "Working capital", "$m"],
  ["freeCashFlow", "Free cash flow", "$m"],
  ["shareCount", "Share count", "m"],
  ["netDebt", "Net debt", "$m"],
  ["valuationMultiple", "Valuation multiple", "×"],
  ["discountRate", "Discount rate", "%"],
  ["terminalGrowthRate", "Terminal growth rate", "%"],
];

const portfolioFields: Array<[keyof PortfolioInputs, string, string]> = [
  ["holdingPeriod", "Expected holding period", "years"],
  ["requiredReturn", "Required annual return", "%"],
  ["maximumDownside", "Maximum acceptable downside", "%"],
  ["bullProbability", "Bull-case probability", "%"],
  ["baseProbability", "Base-case probability", "%"],
  ["bearProbability", "Bear-case probability", "%"],
  ["proposedPosition", "Proposed position size", "%"],
  ["maximumPosition", "Maximum position size", "%"],
  ["bullValue", "Bull-case value", "$/share"],
  ["baseValue", "Base-case value", "$/share"],
  ["bearValue", "Bear-case value", "$/share"],
  ["confidence", "Confidence level", "%"],
];

const projectFields: Array<[keyof ProjectInputs, string, string]> = [
  ["capacity", "Project capacity", "MW"],
  ["installedCostPerMw", "Installed cost per MW", "$m"],
  ["constructionYears", "Construction period", "years"],
  ["contractYears", "Contract duration", "years"],
  ["utilization", "Utilization rate", "%"],
  ["revenuePerMw", "Revenue per MW", "$m"],
  ["servicePrice", "Energy / service price index", "×"],
  ["operatingExpense", "Operating expense", "$m"],
  ["maintenanceExpense", "Maintenance expense", "$m"],
  ["financingCost", "Financing cost", "%"],
  ["debtPercentage", "Debt percentage", "%"],
  ["taxRate", "Tax rate", "%"],
  ["residualValue", "Residual value", "$m"],
  ["customerDeposit", "Customer deposit", "$m"],
  ["workingCapital", "Working-capital requirement", "$m"],
  ["completionProbability", "Probability of completion", "%"],
];

function NumberField({
  label,
  unit,
  value,
  onChange,
  luna,
  min,
  max,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  luna?: number;
  min?: number;
  max?: number;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="stress-field" htmlFor={id}>
      <span>{label}</span>
      {luna !== undefined && <small>Luna1 base case: {luna}{unit}</small>}
      <span className="stress-input">
        <input
          id={id}
          type="number"
          step="any"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <b>{unit}</b>
      </span>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="stress-text-field" htmlFor={id}>
      {label}
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="stress-metric">
      <small>{label}</small>
      <strong>{value}</strong>
      {note && <span>{note}</span>}
    </div>
  );
}

export function ThesisStressTest({ company }: { company: CompanyContext }) {
  const [role, setRole] = useState<ThesisRole>("Portfolio Manager");
  const [generated, setGenerated] = useState(false);
  const [portfolio, setPortfolio] = useState(defaultPortfolioInputs);
  const [analyst, setAnalyst] = useState<AnalystAssumptions>(
    defaultLunaAssumptions,
  );
  const [risk, setRisk] = useState<RiskInputs>(defaultRiskInputs);
  const [project, setProject] = useState<ProjectInputs>(defaultProjectInputs);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const analystResult = useMemo(() => calculateAnalystScenario(analyst), [analyst]);
  const portfolioResult = useMemo(
    () => calculatePortfolioAnalysis(portfolio, defaultLunaAssumptions.fairValue),
    [portfolio],
  );
  const riskResult = useMemo(() => calculateRiskAnalysis(risk), [risk]);
  const projectResult = useMemo(() => calculateProjectEconomics(project), [project]);
  const probabilityValid = portfolioResult.probabilityTotal === 100;
  const isAnalyst = role === "Research Analyst" || role === "Corporate Strategy";
  const thesisStatus =
    role === "Risk Analyst"
      ? riskResult.status
      : isAnalyst
        ? analystResult.thesisStatus
        : role === "Infrastructure / Project Finance"
          ? projectResult.npv < 0
            ? "Challenged"
            : projectResult.debtServiceCoverage < 1.2
              ? "Monitor"
              : "Supported"
          : portfolioResult.decision === "Avoid"
            ? "Challenged"
            : portfolioResult.decision === "Watchlist"
              ? "Monitor"
              : "Supported";
  const mostSensitive =
    role === "Risk Analyst"
      ? riskResult.principalDriver
      : role === "Infrastructure / Project Finance"
        ? projectResult.largestSensitivity
        : isAnalyst
          ? String(analystResult.mostSensitive.key)
          : "bear-case value";
  const questions = buildCommitteeQuestions({
    role,
    company: company.company,
    catalyst: company.catalyst,
    risk: company.risk,
    mostSensitive,
    thesisStatus,
  });

  const generate = () => {
    if (role === "Portfolio Manager" && !probabilityValid) return;
    setGenerated(true);
    requestAnimationFrame(() =>
      document.getElementById("stress-results")?.focus(),
    );
  };

  async function submitResearchView(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionMessage("Submitting privately…");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/research-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    setSubmissionMessage(
      body.message ??
        (response.ok
          ? "Your view was submitted for private review."
          : "Private submission is unavailable. Your analysis remains in this browser."),
    );
    if (response.ok) form.reset();
  }

  return (
    <div className="stress-shell">
      <nav className="stress-steps" aria-label="Stress test workflow">
        {[
          "Select Role",
          "Review Luna1 Assumptions",
          "Enter Your Assumptions",
          "Define Risk Conditions",
          "Generate Analysis",
          "Compare Views",
          "Export Committee Memo",
        ].map((step, index) => (
          <a key={step} href={index < 4 ? "#stress-inputs" : "#stress-results"}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {step}
          </a>
        ))}
      </nav>

      <section className="stress-panel" id="stress-inputs">
        <header className="stress-panel-heading">
          <div>
            <span className="eyebrow">01 · Professional lens</span>
            <h2>Select your committee role</h2>
          </div>
          <p>
            The role changes the assumptions, risk conditions, and committee
            output. No personal information is required.
          </p>
        </header>
        <fieldset className="role-grid">
          <legend className="sr-only">Professional role</legend>
          {THESIS_ROLES.map((item) => (
            <label key={item} className={role === item ? "selected" : ""}>
              <input
                type="radio"
                name="role"
                value={item}
                checked={role === item}
                onChange={() => {
                  setRole(item);
                  setGenerated(false);
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>

        <div className="assumption-source">
          <span className="eyebrow">02 · Luna1 reference case</span>
          <div>
            <Metric label="Revenue growth" value={`${defaultLunaAssumptions.revenueGrowth}%`} />
            <Metric label="Operating margin" value={`${defaultLunaAssumptions.operatingMargin}%`} />
            <Metric label="Free cash flow" value={`$${defaultLunaAssumptions.freeCashFlow}m`} />
            <Metric label="Fair value" value={formatMoney(defaultLunaAssumptions.fairValue)} />
          </div>
          <p>
            Luna1 estimate · Illustrative demonstration values, not current market
            data or company guidance. Replace with sourced report data before
            publication.
          </p>
        </div>

        {role === "Portfolio Manager" && (
          <div className="stress-form-grid">
            {portfolioFields.map(([key, label, unit]) => (
              <NumberField
                key={key}
                label={label}
                unit={unit}
                value={portfolio[key] as number}
                min={key.includes("Probability") || key === "confidence" ? 0 : undefined}
                max={key.includes("Probability") || key === "confidence" ? 100 : undefined}
                onChange={(value) =>
                  setPortfolio((current) => ({ ...current, [key]: value }))
                }
              />
            ))}
            <TextField
              label="Thesis-break condition"
              value={portfolio.thesisBreak}
              onChange={(value) => setPortfolio({ ...portfolio, thesisBreak: value })}
            />
            <TextField
              label="Primary catalyst"
              value={portfolio.catalyst}
              onChange={(value) => setPortfolio({ ...portfolio, catalyst: value })}
            />
            <TextField
              label="Primary risk"
              value={portfolio.risk}
              onChange={(value) => setPortfolio({ ...portfolio, risk: value })}
            />
            <p className={probabilityValid ? "validation-ok" : "validation-error"} role="status">
              Scenario probability total: {portfolioResult.probabilityTotal}%{" "}
              {probabilityValid ? "— validated" : "— must equal 100%"}
            </p>
          </div>
        )}

        {isAnalyst && (
          <div className="stress-form-grid">
            {analystFields.map(([key, label, unit]) => (
              <NumberField
                key={key}
                label={label}
                unit={unit}
                luna={defaultLunaAssumptions[key]}
                value={analyst[key]}
                onChange={(value) =>
                  setAnalyst((current) => ({ ...current, [key]: value }))
                }
              />
            ))}
          </div>
        )}

        {role === "Risk Analyst" && (
          <>
            <div className="risk-input-grid">
              {RISK_FACTORS.map((factor) => (
                <label key={factor}>
                  <span>{factor}</span>
                  <select
                    aria-label={`${factor} score`}
                    value={risk.scores[factor]}
                    onChange={(event) =>
                      setRisk({
                        ...risk,
                        scores: { ...risk.scores, [factor]: Number(event.target.value) },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <option key={score} value={score}>
                        {score} — {score === 1 ? "Low" : score === 5 ? "Critical" : "Moderate"}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="stress-form-grid">
              <TextField
                label="Most likely failure mode"
                value={risk.failureMode}
                onChange={(value) => setRisk({ ...risk, failureMode: value })}
              />
              <NumberField
                label="Maximum acceptable loss"
                unit="%"
                value={risk.maximumLoss}
                onChange={(value) => setRisk({ ...risk, maximumLoss: value })}
              />
              <TextField
                label="Thesis invalidation signal"
                value={risk.invalidationSignal}
                onChange={(value) => setRisk({ ...risk, invalidationSignal: value })}
              />
              <label className="stress-field">
                <span>Monitoring frequency</span>
                <select
                  value={risk.monitoringFrequency}
                  onChange={(event) =>
                    setRisk({ ...risk, monitoringFrequency: event.target.value })
                  }
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </label>
              <NumberField
                label="Required margin of safety"
                unit="%"
                value={risk.marginOfSafety}
                onChange={(value) => setRisk({ ...risk, marginOfSafety: value })}
              />
            </div>
          </>
        )}

        {role === "Infrastructure / Project Finance" && (
          <>
            <div className="method-warning">
              Project-economics inputs are available because this mode was
              explicitly selected. Confirm that project economics are material to
              the company before relying on the output.
            </div>
            <div className="stress-form-grid">
              {projectFields.map(([key, label, unit]) => (
                <NumberField
                  key={key}
                  label={label}
                  unit={unit}
                  value={project[key]}
                  onChange={(value) =>
                    setProject((current) => ({ ...current, [key]: value }))
                  }
                />
              ))}
            </div>
          </>
        )}

        {role === "Observer" && (
          <div className="observer-note">
            <h3>Read-only committee review</h3>
            <p>
              Observer mode preserves the Luna1 reference case and generates a
              traceable comparison without collecting professional assumptions.
            </p>
          </div>
        )}

        <button
          className="button primary stress-generate"
          type="button"
          onClick={generate}
          disabled={role === "Portfolio Manager" && !probabilityValid}
        >
          Generate deterministic analysis <span aria-hidden="true">→</span>
        </button>
      </section>

      {generated && (
        <section className="stress-results" id="stress-results" tabIndex={-1}>
          <header className="stress-panel-heading">
            <div>
              <span className="eyebrow">05 · Committee output</span>
              <h2>Your View vs. Luna1</h2>
            </div>
            <p>
              Every conclusion below is tied to a numerical or selected
              assumption. No generative commentary is used.
            </p>
          </header>

          {role === "Portfolio Manager" && (
            <div className="stress-metrics-grid">
              <Metric label="Probability-weighted value" value={formatMoney(portfolioResult.expectedValue)} />
              <Metric label="Expected upside / downside" value={`${portfolioResult.expectedReturn}%`} />
              <Metric label="Annualized return" value={`${portfolioResult.annualizedReturn}%`} />
              <Metric label="Risk-adjusted return" value={`${portfolioResult.riskAdjustedReturn}%`} />
              <Metric label="Decision category" value={portfolioResult.decision} />
              <Metric label="Position-size check" value={portfolioResult.positionWarning} />
            </div>
          )}

          {isAnalyst && (
            <>
              <div className="stress-metrics-grid">
                <Metric label="Updated revenue" value={`$${analystResult.projectedRevenue}m`} />
                <Metric label="Gross profit" value={`$${analystResult.grossProfit}m`} />
                <Metric label="Operating income" value={`$${analystResult.operatingIncome}m`} />
                <Metric label="Free cash flow" value={`$${analystResult.freeCashFlow}m`} />
                <Metric label="Revised fair value" value={formatMoney(analystResult.fairValue)} />
                <Metric label="Thesis status" value={analystResult.thesisStatus} />
              </div>
              <div className="scenario-strip" aria-label="Scenario valuation">
                {Object.entries(analystResult.scenarioValues).map(([scenario, value]) => (
                  <div key={scenario}>
                    <small>{scenario} case</small>
                    <strong>{formatMoney(value)}</strong>
                    <i style={{ width: `${Math.min(100, Math.max(5, value * 2))}%` }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {role === "Risk Analyst" && (
            <>
              <div className="stress-metrics-grid">
                <Metric label="Weighted risk score" value={`${riskResult.weightedScore} / 5`} />
                <Metric label="Principal downside driver" value={riskResult.principalDriver} />
                <Metric label="Risk concentration" value={`${riskResult.concentration}%`} />
                <Metric label="Suggested thesis status" value={riskResult.status} />
              </div>
              <div className="risk-heat-map" aria-label="Risk heat map">
                {riskResult.ranked.map(([factor, score]) => (
                  <div key={factor} style={{ "--risk": score } as React.CSSProperties}>
                    <span>{factor}</span>
                    <b>{score}/5</b>
                  </div>
                ))}
              </div>
            </>
          )}

          {role === "Infrastructure / Project Finance" && (
            <>
              <div className="estimate-label">
                Luna1 analytical estimates based on user-entered assumptions.
              </div>
              <div className="stress-metrics-grid">
                <Metric label="Estimated project revenue" value={`$${projectResult.revenue}m`} />
                <Metric label="Estimated EBITDA" value={`$${projectResult.ebitda}m`} />
                <Metric label="Operating cash flow" value={`$${projectResult.operatingCashFlow}m`} />
                <Metric label="Payback period" value={`${projectResult.paybackPeriod} years`} />
                <Metric label="Break-even utilization" value={`${projectResult.breakEvenUtilization}%`} />
                <Metric label="Net present value" value={`$${projectResult.npv}m`} />
                <Metric label="Estimated project IRR" value={projectResult.irr === null ? "Not calculable" : `${projectResult.irr}%`} />
                <Metric label="Debt-service coverage" value={`${projectResult.debtServiceCoverage}×`} />
                <Metric label="Largest sensitivity" value={projectResult.largestSensitivity} />
              </div>
            </>
          )}

          {role === "Observer" && (
            <div className="stress-metrics-grid">
              <Metric label="Luna1 fair value" value={formatMoney(defaultLunaAssumptions.fairValue)} />
              <Metric label="Downside case" value={formatMoney(defaultLunaAssumptions.downsideValue)} />
              <Metric label="Confidence level" value={`${defaultLunaAssumptions.confidence}%`} />
              <Metric label="Thesis status" value="Illustrative / unverified" />
            </div>
          )}

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <caption>Material assumption differences are highlighted.</caption>
              <thead>
                <tr>
                  <th>Measure</th>
                  <th>Luna1 view</th>
                  <th>Your view</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Revenue growth", defaultLunaAssumptions.revenueGrowth, isAnalyst ? analyst.revenueGrowth : defaultLunaAssumptions.revenueGrowth, "%"],
                  ["Operating margin", defaultLunaAssumptions.operatingMargin, isAnalyst ? analyst.operatingMargin : defaultLunaAssumptions.operatingMargin, "%"],
                  ["Free cash flow", defaultLunaAssumptions.freeCashFlow, isAnalyst ? analystResult.freeCashFlow : defaultLunaAssumptions.freeCashFlow, "$m"],
                  ["Valuation multiple", defaultLunaAssumptions.valuationMultiple, isAnalyst ? analyst.valuationMultiple : defaultLunaAssumptions.valuationMultiple, "×"],
                  ["Fair value", defaultLunaAssumptions.fairValue, isAnalyst ? analystResult.fairValue : role === "Portfolio Manager" ? portfolioResult.expectedValue : defaultLunaAssumptions.fairValue, "$"],
                ].map(([label, luna, user, unit]) => {
                  const difference = Number(user) - Number(luna);
                  const material = Math.abs(difference / (Number(luna) || 1)) >= 0.1;
                  return (
                    <tr key={String(label)} className={material ? "material" : ""}>
                      <th scope="row">{label}</th>
                      <td>{unit}{luna}</td>
                      <td>{unit}{user}</td>
                      <td>
                        {difference === 0
                          ? "Aligned with the Luna1 reference case."
                          : `Your ${String(label).toLowerCase()} is ${Math.abs(difference).toFixed(1)}${unit} ${difference < 0 ? "below" : "above"} the Luna1 case.`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="committee-questions">
            <div>
              <span className="eyebrow">Investment committee questions</span>
              <h3>Evidence required before a decision</h3>
            </div>
            <ol>
              {questions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </div>

          <details className="methodology">
            <summary>Calculation methodology and data classification</summary>
            <p>
              Analyst fair value = ((projected revenue × operating margin ×
              (1 − tax rate) − capex − working capital) × valuation multiple −
              net debt) ÷ diluted shares. Project NPV discounts equity cash flows
              at the entered financing cost and weights the result by completion
              probability. IRR uses deterministic bisection.
            </p>
            <ul>
              <li>Luna1 values shown here are illustrative estimates.</li>
              <li>Edited values are user-entered assumptions.</li>
              <li>Calculated values are scenario outputs, not company guidance.</li>
            </ul>
          </details>

          <article className="committee-memo">
            <header>
              <span>Luna1 Investment Committee Challenge</span>
              <h2>{company.company} <small>{company.ticker}</small></h2>
              <p>Analysis date: {new Date().toISOString().slice(0, 10)} · Selected role: {role}</p>
            </header>
            <div className="memo-grid">
              <div><small>Thesis status</small><strong>{thesisStatus}</strong></div>
              <div><small>Primary catalyst</small><strong>{company.catalyst}</strong></div>
              <div><small>Primary risk</small><strong>{company.risk}</strong></div>
              <div><small>Largest disagreement / sensitivity</small><strong>{mostSensitive}</strong></div>
            </div>
            <h3>Questions requiring additional research</h3>
            <ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
            <p className="memo-disclosure">
              This analysis is based on user-entered assumptions and is provided
              for educational and research-demonstration purposes. It is not
              investment advice or a recommendation to buy or sell securities.
            </p>
            <footer>Luna1 Research | Interactive Thesis Stress Test | Educational and Portfolio Use</footer>
          </article>
          <button className="button primary no-print" type="button" onClick={() => window.print()}>
            Export committee memo <span aria-hidden="true">↗</span>
          </button>
        </section>
      )}

      <section className="share-view no-print">
        <div>
          <span className="eyebrow">Optional contribution</span>
          <h2>Share Your Research View</h2>
          <p>
            Submissions enter a private review queue. They are never published
            automatically, and contact details are never displayed publicly.
          </p>
        </div>
        <form onSubmit={submitResearchView}>
          <input type="hidden" name="company" value={company.company} />
          <label>Professional role<select name="professionalRole" defaultValue={role}>{THESIS_ROLES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Thesis stance<select name="thesisStance" required><option value="">Select stance</option><option>Bullish</option><option>Neutral</option><option>Cautious</option></select></label>
          <label>Most important assumption<input name="importantAssumption" required maxLength={300} /></label>
          <label>Main disagreement<textarea name="mainDisagreement" required rows={3} maxLength={1200} /></label>
          <label>Suggested research question<textarea name="researchQuestion" required rows={3} maxLength={600} /></label>
          <label>Evidence or source link<input name="sourceUrl" type="url" required /></label>
          <label>Optional name<input name="name" maxLength={100} /></label>
          <label>Optional organization<input name="organization" maxLength={160} /></label>
          <label>Optional email<input name="email" type="email" maxLength={254} /></label>
          <label className="consent"><input name="consent" type="checkbox" value="true" required />I understand that my submission may be reviewed and summarized as part of the Luna1 research process.</label>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button className="button primary" type="submit">Submit for private review</button>
          <p className="form-note" role="status" aria-live="polite">{submissionMessage}</p>
        </form>
      </section>

      <section className="perspectives">
        <span className="eyebrow">Approved, anonymized submissions only</span>
        <h2>Research Perspectives</h2>
        <p>
          No manually approved perspective summaries are available yet. Individual
          responses and contact details are never displayed here. Community views
          are educational research inputs, not professional investment advice.
        </p>
      </section>
    </div>
  );
}
