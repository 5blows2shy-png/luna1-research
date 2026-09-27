import Link from "next/link";
import {
  globalExposureByTicker,
  type GlobalExposure,
} from "@/data/global-finance/exposure";
import { BarChart, percent } from "./visuals";
import styles from "./global-finance.module.css";
export function CompanyExposure({
  ticker,
  exposure = globalExposureByTicker[ticker.toUpperCase()],
}: {
  ticker: string;
  exposure?: GlobalExposure;
}) {
  if (!exposure) return null;
  const available = exposure.geography.filter(
    (g): g is { region: string; revenue: number } => g.revenue !== null,
  );
  return (
    <section className="company-research-section" id="global-exposure">
      <span className={styles.kicker}>
        Geography · Currency · Capital allocation
      </span>
      <h2>Global Exposure</h2>
      <span className={styles.badge}>Recorded Data · dated filing</span>
      <div className={styles.grid}>
        <BarChart
          title={`${ticker} · Revenue by geography`}
          items={available.map((g) => ({ label: g.region, value: g.revenue }))}
          unit="USD m · segment reporting basis"
        />
        <div
          className={styles.table}
          tabIndex={0}
          role="region"
          aria-label="Revenue by geography"
        >
          <table>
            <caption>Calculated share of disclosed geographic sales</caption>
            <thead>
              <tr>
                <th scope="col">Region</th>
                <th scope="col">Revenue (USD m)</th>
                <th scope="col">Share</th>
              </tr>
            </thead>
            <tbody>
              {exposure.geography.map((g) => (
                <tr key={g.region}>
                  <th scope="row">{g.region}</th>
                  <td>
                    {g.revenue?.toLocaleString("en-US") ?? "Not Available"}
                  </td>
                  <td>
                    {g.revenue !== null && exposure.totalRevenue
                      ? percent(g.revenue / exposure.totalRevenue)
                      : "Not Available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={styles.note}>{exposure.source.basis}</p>
      <dl className={styles.ledger}>
        {[
          ["Home country", exposure.homeCountry],
          [
            "Foreign revenue share (segment sales)",
            exposure.foreignRevenueShare === null
              ? null
              : percent(exposure.foreignRevenueShare),
          ],
          ["Largest international customer market", exposure.largestMarket],
          ["Primary operating / FX currencies", exposure.currencies],
          ["Manufacturing / supply regions", exposure.productionRegions],
          ["International growth driver", exposure.growthDriver],
          ["Cross-border risk", exposure.risk],
          ["International capital allocation", exposure.capitalAllocation],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? "Not Available"}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.source}>
        Source:{" "}
        <a href={exposure.source.href} target="_blank" rel="noreferrer">
          {exposure.source.label}
        </a>{" "}
        · {exposure.source.period} · {exposure.source.currency}{" "}
        {exposure.source.units} · Updated {exposure.source.updated}. Missing
        fields have not been verified; no currency exposure is inferred from
        geography.
      </p>
      <Link className="text-link" href="/research/global-finance/treasury">
        Explore a separate illustrative FX scenario →
      </Link>
    </section>
  );
}
