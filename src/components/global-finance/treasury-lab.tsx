"use client";
import { useState } from "react";
import {
  treasuryScenario,
  convertCurrency,
  type Currency,
  type TreasuryInputs,
} from "@/lib/global-finance/models";
import { BarChart, SensitivityChart, Metric, amount } from "./visuals";
import styles from "./global-finance.module.css";
const defaults = {
  revenue: "1000",
  expenses: "750",
  revenueExposure: "35",
  expenseExposure: "20",
  fxChange: "5",
  debt: "200",
  floatingShare: "50",
  interestRate: "4",
  rateChange: "1",
  cash: "100",
  workingCapitalRelease: "10",
};
const fields: {
  key: keyof typeof defaults;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { key: "revenue", label: "Annual revenue (USD m)", min: 0 },
  { key: "expenses", label: "Annual operating expenses (USD m)", min: 0 },
  {
    key: "revenueExposure",
    label: "Revenue in selected currency (%)",
    min: 0,
    max: 100,
  },
  {
    key: "expenseExposure",
    label: "Expenses in selected currency (%)",
    min: 0,
    max: 100,
  },
  {
    key: "fxChange",
    label: "Foreign currency move against USD (%)",
    min: -99,
    max: 100,
  },
  { key: "debt", label: "Debt (USD m)", min: 0 },
  {
    key: "floatingShare",
    label: "Debt repriced / refinanced (%)",
    min: 0,
    max: 100,
  },
  { key: "interestRate", label: "Base interest rate (%)", min: 0 },
  { key: "rateChange", label: "Rate change (percentage points)" },
  { key: "cash", label: "Starting cash (USD m)", min: 0 },
  {
    key: "workingCapitalRelease",
    label: "Cash released / absorbed by working capital (USD m)",
  },
];
const pctKeys = new Set([
  "revenueExposure",
  "expenseExposure",
  "fxChange",
  "floatingShare",
  "interestRate",
  "rateChange",
]);
export function TreasuryLab() {
  const [values, setValues] = useState(defaults);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [localAmount, setLocalAmount] = useState("100");
  const [rate, setRate] = useState("1.05");
  const [date, setDate] = useState("2026-06-30");
  const input = Object.fromEntries(
    Object.entries(values).map(([key, val]) => [
      key,
      val.trim() === "" ? NaN : Number(val) / (pctKeys.has(key) ? 100 : 1),
    ]),
  ) as TreasuryInputs;
  let result: ReturnType<typeof treasuryScenario> | null = null;
  let error = "";
  try {
    result = treasuryScenario(input);
  } catch (e) {
    error = e instanceof Error ? e.message : "Invalid assumptions.";
  }
  let conversion: ReturnType<typeof convertCurrency> = null;
  let conversionError = "";
  try {
    if (!date || !localAmount.trim())
      throw new Error("Enter an amount and conversion date.");
    conversion = convertCurrency(
      { amount: Number(localAmount), currency },
      "USD",
      rate.trim()
        ? {
            base: currency,
            quote: "USD",
            rate: Number(rate),
            date,
            kind: "Assumption",
            source: "User-entered scenario rate",
          }
        : null,
      date,
    );
  } catch (e) {
    conversionError = e instanceof Error ? e.message : "Invalid conversion.";
  }
  return (
    <>
      <div className={styles.note}>
        <b>Assumption · Fictional multinational.</b> No company data is
        preloaded. Positive currency moves mean one unit of foreign currency
        buys more USD. All amounts are USD millions unless labeled otherwise.
      </div>
      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="assumptions-title">
          <h2 id="assumptions-title">Set the assumptions</h2>
          <div className={styles.fields}>
            <label>
              Exposure currency
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value as Currency);
                  setRate("");
                }}
              >
                {["EUR", "JPY", "GBP", "CAD", "MXN"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            {fields.map((f) => (
              <label key={f.key}>
                {f.label}
                <input
                  type="number"
                  step="any"
                  min={f.min}
                  max={f.max}
                  value={values[f.key]}
                  onChange={(e) =>
                    setValues({ ...values, [f.key]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <div className={styles.presets} aria-label="Currency scenarios">
            {[-10, -5, 5, 10].map((v) => (
              <button
                key={v}
                aria-pressed={Number(values.fxChange) === v}
                onClick={() => setValues({ ...values, fxChange: String(v) })}
              >
                {currency}/USD {v > 0 ? "+" : ""}
                {v}%
              </button>
            ))}
            <button onClick={() => setValues(defaults)}>
              Reset assumptions
            </button>
          </div>
        </section>
        <section aria-labelledby="impact-title">
          <span className={styles.badge}>Scenario → Estimated Impact</span>
          <h2 id="impact-title">Translation, then financing.</h2>
          {error ? (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          ) : (
            result && (
              <>
                <div className={styles.metrics} aria-live="polite">
                  <Metric
                    label="Revenue translation"
                    value={`${amount(result.revenueImpact)}m`}
                  />
                  <Metric
                    label="Operating income impact"
                    value={`${amount(result.operatingIncomeImpact)}m`}
                  />
                  <Metric
                    label="Annual interest expense"
                    value={`${amount(result.interestExpense)}m`}
                  />
                </div>
                <BarChart
                  title="Scenario impacts"
                  items={[
                    { label: "Revenue", value: result.revenueImpact },
                    { label: "Expenses", value: result.expenseImpact },
                    {
                      label: "Op. income",
                      value: result.operatingIncomeImpact,
                    },
                    { label: "Interest", value: result.interestImpact },
                    { label: "Pre-tax", value: result.pretaxImpact },
                  ]}
                />
                <p>
                  Expense and interest increases reduce profit. Cash after the
                  working-capital change: <b>{amount(result.cashPosition)}m</b>.{" "}
                  {result.cashPosition < 0
                    ? "The scenario produces a funding shortfall."
                    : "This is a cash bridge, not a complete liquidity forecast."}
                </p>
              </>
            )
          )}
        </section>
      </div>
      {result && (
        <div className={styles.section}>
          <div className={styles.grid}>
            <SensitivityChart
              points={[-10, -5, 0, 5, 10].map((x) => ({
                x,
                y: treasuryScenario({ ...input, fxChange: x / 100 })
                  .operatingIncomeImpact,
              }))}
            />
            <div className={styles.card}>
              <h3>Read the mechanism</h3>
              <ol>
                <li>Revenue × revenue exposure × currency move.</li>
                <li>Expenses × expense exposure × currency move.</li>
                <li>Operating impact = revenue impact − expense impact.</li>
                <li>
                  Debt × repriced share × rate change = incremental interest.
                </li>
              </ol>
              <p>
                Positive {currency} translation can be partly offset by local
                expenses. A natural hedge depends on both sides of the income
                statement.
              </p>
              <p>
                Assumes constant local volumes, prices, and exposure, no
                hedging, no taxes, and full-year rate repricing. Translation
                does not itself generate cash. Transaction exposure concerns
                contracted foreign-currency receipts and payments; it requires
                separate settlement data.
              </p>
            </div>
          </div>
        </div>
      )}
      <section className={styles.section}>
        <h2>Preserve the original currency.</h2>
        <div className={styles.fields}>
          <label>
            Original amount ({currency} m)
            <input
              type="number"
              step="any"
              value={localAmount}
              onChange={(e) => setLocalAmount(e.target.value)}
            />
          </label>
          <label>
            Assumed USD per {currency} (blank = unavailable)
            <input
              type="number"
              step="any"
              min="0.000001"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </label>
          <label>
            Assumed conversion date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        {conversionError ? (
          <p role="alert">{conversionError}</p>
        ) : conversion ? (
          <div className={styles.bridge} aria-live="polite">
            <div>
              <small>Original amount retained</small>
              <strong>
                {amount(conversion.originalAmount)}{" "}
                {conversion.originalCurrency} m
              </strong>
            </div>
            <span aria-hidden="true">×</span>
            <div>
              <small>Assumption · {conversion.conversionDate}</small>
              <strong>
                {conversion.fxRate} USD/{currency}
              </strong>
            </div>
            <span aria-hidden="true">→</span>
            <div>
              <small>Converted value</small>
              <strong>{amount(conversion.convertedValue)} USD m</strong>
            </div>
          </div>
        ) : (
          <p role="status">
            Not Available — enter an assumed FX rate to convert. No replacement
            rate is invented.
          </p>
        )}
        <p className={styles.source}>
          Source: user-entered assumptions · No recorded FX quote · The example
          rate is fictional. Changing currency clears the rate so the new pair
          requires an explicit assumption.
        </p>
      </section>
      <details className={styles.card}>
        <summary>Liquidity and data limitations</summary>
        <p>
          Cash by region, debt currency, maturity schedules, repatriation taxes,
          covenants, and hedge books: Not Available. Repatriation moves cash
          between jurisdictions and does not increase consolidated cash before
          costs. A full repatriation or debt-maturity model requires additional
          sourced inputs and is deferred.
        </p>
        <p>
          These simplified sensitivities are educational scenarios, not audited
          forecasts.
        </p>
      </details>
    </>
  );
}
