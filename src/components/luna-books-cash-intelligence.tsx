"use client";

import { useMemo, useState } from "react";
import {
  buildCashFlowIntelligence,
  evaluateInventoryPurchase,
  formatMoney,
  type CashIntelligenceInput,
} from "@/lib/luna-books-intelligence";

const demoInput: CashIntelligenceInput = {
  bankBalanceCents: 4_285_000,
  obligations: [
    { id: "payroll", label: "Payroll", amountCents: 980_000, dueDate: "2026-08-12", kind: "payroll" },
    { id: "supplier", label: "Primary supplier", amountCents: 720_000, dueDate: "2026-08-15", kind: "bill" },
    { id: "rent", label: "Facility rent", amountCents: 260_000, dueDate: "2026-09-01", kind: "operating" },
    { id: "debt", label: "Equipment loan", amountCents: 145_000, dueDate: "2026-08-20", kind: "debt" },
  ],
  receivables: [
    { id: "inv-1042", customer: "Northstar Services", totalCents: 820_000, paidCents: 0, dueDate: "2026-07-29", expectedDate: "2026-08-13" },
    { id: "inv-1048", customer: "Mesa Retail", totalCents: 460_000, paidCents: 120_000, dueDate: "2026-08-02", expectedDate: "2026-08-17" },
    { id: "inv-1051", customer: "Civic Workshop", totalCents: 510_000, paidCents: 0, dueDate: "2026-08-18", expectedDate: "2026-08-18" },
  ],
  inventory: [
    { id: "a", name: "Product A", supplier: "Coastal Supply", unitCostCents: 4_200, unitPriceCents: 8_900, quantityOnHand: 72, unitsSoldLast30Days: 90, daysSinceLastSale: 2, leadTimeDays: 12, minimumOrderQuantity: 50 },
    { id: "b", name: "Product B", supplier: "Coastal Supply", unitCostCents: 6_800, unitPriceCents: 12_900, quantityOnHand: 118, unitsSoldLast30Days: 12, daysSinceLastSale: 66, leadTimeDays: 18, minimumOrderQuantity: 40 },
    { id: "c", name: "Product C", supplier: "Valley Goods", unitCostCents: 3_100, unitPriceCents: 7_500, quantityOnHand: 90, unitsSoldLast30Days: 0, daysSinceLastSale: 124, leadTimeDays: null, minimumOrderQuantity: 30 },
    { id: "d", name: "Product D", supplier: "Valley Goods", unitCostCents: null, unitPriceCents: 5_500, quantityOnHand: 25, unitsSoldLast30Days: 18, daysSinceLastSale: 5, leadTimeDays: 10, minimumOrderQuantity: 25 },
  ],
  settings: {
    asOfDate: "2026-08-06",
    minimumCashReserveCents: 1_000_000,
    taxReserveCents: 285_000,
    weeklyOperatingCostCents: 410_000,
    desiredRunwayWeeks: 6,
    slowMovingDays: 60,
    deadStockDays: 90,
  },
};

export function LunaBooksCashIntelligence() {
  const [scenario, setScenario] = useState<"Conservative" | "Expected" | "Optimistic">("Expected");
  const [purchaseDollars, setPurchaseDollars] = useState(12_000);
  const intelligence = useMemo(() => buildCashFlowIntelligence(demoInput), []);
  const purchase = evaluateInventoryPurchase(demoInput, Math.max(0, Math.round(purchaseDollars * 100)));
  const forecast = intelligence.forecasts[scenario];

  return (
    <section className="ti-section ti-intelligence" aria-labelledby="cash-intelligence-heading">
      <header>
        <div>
          <span className="eyebrow">Records → Understanding → Decisions</span>
          <h2 id="cash-intelligence-heading">Cash Flow Intelligence</h2>
          <p>Demonstration data · deterministic calculations · estimates are not guarantees</p>
        </div>
        <span className="ti-intelligence-label">In development</span>
      </header>

      <div className="ti-metrics ti-metrics--intelligence">
        <div><span>Recorded bank balance</span><strong>{formatMoney(intelligence.safeToSpend.bankBalanceCents)}</strong><small>Recorded</small></div>
        <div><span>Estimated safe to spend</span><strong>{formatMoney(intelligence.safeToSpend.safeToSpendCents)}</strong><small>Calculated</small></div>
        <div><span>Estimated cash runway</span><strong>{intelligence.runway.runwayWeeks?.toFixed(1) ?? "—"} weeks</strong><small>Forecast · {intelligence.runway.confidence} confidence</small></div>
        <div><span>Cash tied up in inventory</span><strong>{formatMoney(intelligence.inventory.totalCostCents)}</strong><small>Calculated · known costs only</small></div>
        <div><span>Overdue receivables</span><strong>{formatMoney(intelligence.overdueReceivableCents)}</strong><small>Recorded open balances</small></div>
        <div><span>Obligations due in 14 days</span><strong>{formatMoney(intelligence.upcomingBillsCents)}</strong><small>Recorded</small></div>
      </div>

      <details className="ti-intelligence-details">
        <summary>Why are safe-to-spend cash and runway estimates?</summary>
        <div className="ti-assumption-grid">
          <p><b>Bank balance</b>{formatMoney(intelligence.safeToSpend.bankBalanceCents)}</p>
          <p><b>30-day obligations</b>{formatMoney(intelligence.safeToSpend.upcomingObligationsCents)}</p>
          <p><b>Minimum reserve</b>{formatMoney(intelligence.safeToSpend.minimumCashReserveCents)}</p>
          <p><b>Tax reserve</b>{formatMoney(intelligence.safeToSpend.taxReserveCents)}</p>
        </div>
        <small>Runway uses estimated safe-to-spend cash divided by the recorded weekly operating cost. Unrecorded obligations and uncertain collections are excluded.</small>
      </details>

      <div className="ti-intelligence-columns">
        <div>
          <h3>Top three decisions</h3>
          <div className="ti-decision-list">
            {intelligence.recommendations.map((item, index) => (
              <details key={item.id} open={index === 0}>
                <summary><span>{index + 1}</span><b>{item.action}</b><small>{item.urgency}</small></summary>
                <p>{item.reason}</p>
                <dl>
                  <div><dt>Estimated impact</dt><dd>{item.estimatedImpact}</dd></div>
                  <div><dt>Confidence</dt><dd>{item.confidence}</dd></div>
                  <div><dt>Evidence</dt><dd>{item.evidence.join(" · ")}</dd></div>
                  <div><dt>Assumptions</dt><dd>{item.assumptions.join(" · ")}</dd></div>
                </dl>
              </details>
            ))}
          </div>
        </div>
        <div>
          <h3>Inventory cash</h3>
          <div className="ti-inventory-cash">
            <p><span>Healthy / active</span><b>{formatMoney(intelligence.inventory.healthyCents)}</b></p>
            <p><span>Slow moving</span><b>{formatMoney(intelligence.inventory.slowMovingCents)}</b></p>
            <p><span>Dead stock</span><b>{formatMoney(intelligence.inventory.deadStockCents)}</b></p>
            <p><span>Excess</span><b>{formatMoney(intelligence.inventory.excessCents)}</b></p>
            <p><span>Potential review opportunity</span><b>{formatMoney(intelligence.inventory.potentialRecoverableCashCents)}</b></p>
          </div>
          {intelligence.inventory.missingCostItems.length > 0 && <p className="ti-data-warning">Low confidence: unit cost is missing for {intelligence.inventory.missingCostItems.join(", ")}.</p>}
        </div>
      </div>

      <div className="ti-intelligence-columns">
        <div>
          <h3>Can I afford this inventory purchase?</h3>
          <label className="ti-purchase-input">Purchase amount<input min="0" step="100" type="number" value={purchaseDollars} onChange={(event) => setPurchaseDollars(Number(event.target.value) || 0)} /></label>
          <div className="ti-purchase-result" data-risk={purchase.status.toLowerCase().replaceAll(" ", "-")}>
            <strong>{purchase.status}</strong>
            <p>Cash after purchase: {formatMoney(purchase.cashAfterCents)}</p>
            <p>Runway: {purchase.runwayBeforeWeeks?.toFixed(1) ?? "—"} → {purchase.runwayAfterWeeks?.toFixed(1) ?? "—"} weeks</p>
            <small>{purchase.explanation}</small>
          </div>
        </div>
        <div>
          <div className="ti-forecast-heading">
            <h3>13-week cash outlook</h3>
            <label>Scenario<select value={scenario} onChange={(event) => setScenario(event.target.value as typeof scenario)}><option>Conservative</option><option>Expected</option><option>Optimistic</option></select></label>
          </div>
          <div className="ti-table-wrap"><table className="ti-table"><thead><tr><th>Week</th><th>Starting cash</th><th>Expected collections</th><th>Known outflows</th><th>Ending cash</th></tr></thead><tbody>{forecast.map((week) => <tr key={week.week}><td>{week.week}</td><td>{formatMoney(week.startingCashCents)}</td><td>{formatMoney(week.customerPaymentsCents)}</td><td>{formatMoney(week.obligationsCents + week.operatingCents)}</td><td>{formatMoney(week.endingCashCents)}</td></tr>)}</tbody></table></div>
          <p className="ti-data-warning">Forecast uses recorded due dates, scenario collection rates, and recurring weekly costs. It is not a guarantee.</p>
        </div>
      </div>
    </section>
  );
}
