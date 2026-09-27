"use client";
import { useState } from "react";
import { northstarRegions, caseSource } from "@/data/global-finance/northstar";
import { consolidateRegions } from "@/lib/global-finance/models";
import { BarChart, Metric, amount, percent } from "./visuals";
import styles from "./global-finance.module.css";
export function FpaCase() {
  const [growth, setGrowth] = useState("5");
  const [fxMove, setFxMove] = useState("0");
  const valid =
    growth.trim() !== "" &&
    fxMove.trim() !== "" &&
    Number.isFinite(Number(growth)) &&
    Number.isFinite(Number(fxMove)) &&
    Number(growth) > -100 &&
    Number(fxMove) > -100;
  const historical = consolidateRegions(northstarRegions);
  const scenario = valid
    ? consolidateRegions(
        northstarRegions.map((r) => ({
          ...r,
          actualRate:
            r.actualRate *
            (r.currency === "USD" ? 1 : 1 + Number(fxMove) / 100),
        })),
        Number(growth) / 100,
      )
    : null;
  function download() {
    const rows = [
      [
        "FICTIONAL CASE STUDY: Northstar Technologies",
        "Q2 2026",
        "Millions of local currency; USD per local unit; headcount in people",
      ],
      Object.keys(northstarRegions[0]),
      ...northstarRegions.map((r) => Object.values(r)),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "northstar-fictional-inputs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className={styles.note}>
        <b>{caseSource.status}</b> · Northstar Technologies is not a real
        company. All regional inputs and exchange rates were authored for this
        case. Q2 2026 compared with Q2 2025; no employer information.
      </div>
      <div className={styles.metrics}>
        <Metric
          label="Consolidated revenue"
          value={`$${amount(historical.revenue)}m`}
          detail={`${percent(historical.reportedGrowth)} reported growth`}
        />
        <Metric
          label="Budget variance"
          value={`${amount(historical.variance)}m`}
          detail="Actual less budget · USD"
        />
        <Metric
          label="FX-neutral growth"
          value={percent(historical.fxNeutralGrowth)}
          detail="Prior-period FX held constant"
        />
      </div>
      <div className={styles.grid}>
        <BarChart
          title="Regional revenue · actual vs budget"
          items={historical.rows.flatMap((r) => [
            { label: `${r.region} actual`, value: r.actualRevenueUsd },
            { label: `${r.region} budget`, value: r.budgetRevenueUsd },
          ])}
        />
        <div>
          <BarChart
            title="Revenue variance bridge"
            items={[
              { label: "Operations", value: historical.operatingVariance },
              { label: "FX translation", value: historical.fxVariance },
              { label: "Net variance", value: historical.variance },
            ]}
          />
          <div className={styles.note}>
            Budget {amount(historical.budget)} + operations{" "}
            {amount(historical.operatingVariance)} + FX (
            {amount(historical.fxVariance)}) = actual{" "}
            {amount(historical.revenue)} USD m.
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2>The regional operating picture</h2>
        <div className={styles.grid}>
          <BarChart
            title="Operating profit by region"
            items={historical.rows.map((r) => ({
              label: r.region,
              value: r.actualProfit,
            }))}
          />
          <BarChart
            title="Capital expenditure by region"
            items={historical.rows.map((r) => ({
              label: r.region,
              value: r.capexUsd,
            }))}
          />
        </div>
        <div
          className={styles.table}
          tabIndex={0}
          role="region"
          aria-label="Regional performance table"
        >
          <table>
            <caption>
              Calculated results · USD m except percentages, percentage points
              (pp), and people. Positive cost/headcount variances mean above
              budget.
            </caption>
            <thead>
              <tr>
                {[
                  "Region",
                  "Local growth",
                  "USD growth",
                  "Op. margin",
                  "Margin Δ pp",
                  "OpEx Δ",
                  "Headcount Δ",
                  "CapEx Δ",
                ].map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historical.rows.map((r) => (
                <tr key={r.region}>
                  <th scope="row">{r.region}</th>
                  <td>{percent(r.localGrowth)}</td>
                  <td>{percent(r.reportedGrowth)}</td>
                  <td>
                    {r.actualMargin === null
                      ? "Not Available"
                      : percent(r.actualMargin)}
                  </td>
                  <td>
                    {r.marginVariance === null
                      ? "Not Available"
                      : amount(r.marginVariance * 100)}
                  </td>
                  <td>{amount(r.opexVariance)}</td>
                  <td>{r.headcountVariance}</td>
                  <td>{amount(r.capexVariance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className={styles.section}>
        <h2>Management commentary</h2>
        <div className={styles.grid}>
          {historical.rows.map((r) => (
            <article key={r.region} className={styles.card}>
              <span className={styles.kicker}>
                {r.region} · {r.currency}
              </span>
              <h3>{percent(r.localGrowth)} local growth</h3>
              <p>
                Revenue grew {percent(r.localGrowth)} in local currency and{" "}
                {percent(r.reportedGrowth)} after USD translation. Reported
                revenue was {amount(Math.abs(r.revenueVariance))}m{" "}
                {r.revenueVariance >= 0 ? "above" : "below"} budget. FX
                contributed {amount(r.fxVariance)}m to that variance.
              </p>
              <p>
                Operating expense was {amount(Math.abs(r.opexVariance))}m{" "}
                {r.opexVariance >= 0 ? "above" : "below"} budget. Investigate
                staffing, pricing, and mix before attributing causes.
              </p>
            </article>
          ))}
        </div>
        <p className={styles.source}>
          Commentary is generated from the deterministic model. The model does
          not infer business causes from variances alone.
        </p>
      </section>
      <section className={styles.section}>
        <h2>Build the next-quarter scenario</h2>
        <p>
          Apply a common local revenue growth assumption to Q2 actuals, then
          move foreign-currency translation rates. This simplified revenue
          forecast excludes seasonality and does not forecast expenses or
          profit.
        </p>
        <div className={styles.fields}>
          <label>
            Local revenue growth (%)
            <input
              type="number"
              step="1"
              min="-99"
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
            />
          </label>
          <label>
            Foreign currencies against USD (%)
            <input
              type="number"
              step="1"
              min="-99"
              value={fxMove}
              onChange={(e) => setFxMove(e.target.value)}
            />
          </label>
        </div>
        {scenario ? (
          <>
            <div className={styles.metrics} aria-live="polite">
              <Metric
                label="Q3 scenario revenue"
                value={`$${amount(scenario.forecast)}m`}
                detail="Estimated Impact · not guidance"
              />
              <Metric
                label="Q2 starting revenue"
                value={`$${amount(historical.revenue)}m`}
              />
              <Metric
                label="Sequential change"
                value={percent(scenario.forecast / historical.revenue - 1)}
              />
            </div>
            <BarChart
              title="Regional forecast · Q3 scenario"
              items={scenario.rows.map((r) => ({
                label: r.region,
                value: r.forecastRevenue,
              }))}
            />
          </>
        ) : (
          <p role="alert">
            Enter finite growth and currency changes greater than −100%.
          </p>
        )}
      </section>
      <section className={styles.section}>
        <h2>Inspect the source inputs</h2>
        <p>
          Local revenue, expense, and CapEx amounts are retained. Multiply each
          by its period-average USD-per-local-unit rate to consolidate.
        </p>
        <div
          className={styles.table}
          tabIndex={0}
          role="region"
          aria-label="Fictional source inputs"
        >
          <table>
            <caption>
              All inputs fictional · Q2 2026 · Local millions; FX = USD per
              local unit · Same period for all regions.
            </caption>
            <thead>
              <tr>
                {[
                  "Region / currency",
                  "Prior rev.",
                  "Budget rev.",
                  "Actual rev.",
                  "Budget OpEx",
                  "Actual OpEx",
                  "Prior FX",
                  "Budget FX",
                  "Actual FX",
                  "Budget HC",
                  "Actual HC",
                  "Budget CapEx",
                  "Actual CapEx",
                ].map((x) => (
                  <th scope="col" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {northstarRegions.map((r) => (
                <tr key={r.region}>
                  <th scope="row">
                    {r.region} / {r.currency}
                  </th>
                  {[
                    r.priorRevenue,
                    r.budgetRevenue,
                    r.actualRevenue,
                    r.budgetExpenses,
                    r.actualExpenses,
                    r.priorRate,
                    r.budgetRate,
                    r.actualRate,
                    r.budgetHeadcount,
                    r.actualHeadcount,
                    r.budgetCapex,
                    r.actualCapex,
                  ].map((n, i) => (
                    <td key={i}>{n}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="button" onClick={download}>
          Download fictional inputs (CSV)
        </button>
        <details className={styles.card}>
          <summary>Model formulas and limitations</summary>
          <p>
            Budget variance = actual local revenue × actual FX − budget local
            revenue × budget FX. Operations = (actual − budget local revenue) ×
            budget FX. FX = actual local revenue × (actual FX − budget FX).
            Constant-currency growth uses prior-year FX for both years.
          </p>
          <p>
            Operating profit = revenue − operating expenses. Margin variance =
            actual margin − budget margin. No intercompany eliminations, tax,
            debt, depreciation schedules, or confidential data. Quarterly
            average rates are assumptions, not market quotes.
          </p>
        </details>
        <p className={styles.source}>
          Source: {caseSource.label} · As of {caseSource.asOf} · Updated{" "}
          {caseSource.updated} · {caseSource.units} · Reporting currency USD.
        </p>
      </section>
    </>
  );
}
