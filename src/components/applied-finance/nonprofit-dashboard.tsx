"use client";
import { useState } from "react";
import { nonprofitMonths, nonprofitSummary, variance } from "@/lib/applied-finance";
import { FinancialTable, Metrics, money, percent, ProjectSection, TrendChart } from "./financial-display";
import styles from "./project.module.css";
export function NonprofitDashboard() {
  const [view, setView] = useState("Monthly");
  const [month, setMonth] = useState(0);
  const [commentary, setCommentary] = useState("Program expenses exceeded the fictional January budget by $14,500 (12.1%). Review supporting records before attributing the variance to a specific cause.");
  const start = view === "YTD" ? 0 : view === "Quarterly" ? Math.floor(month / 3) * 3 : month;
  const end = view === "Quarterly" ? start + 3 : month + 1;
  const s = nonprofitSummary(start, end);
  const label = `${nonprofitMonths[start].month}–${nonprofitMonths[end - 1].month} · synthetic reporting year`;
  const program = variance(s.programActual, s.programBudget);
  return <>
    <ProjectSection id="analysis" title="Financial overview">
      <p className={styles.meta}>Synthetic data · calculated values · USD</p>
      <div className={styles.controls}><label>Reporting view<select value={view} onChange={e => setView(e.target.value)}>{["Monthly", "Quarterly", "YTD"].map(v => <option key={v}>{v}</option>)}</select></label><label>Reporting month<select value={month} onChange={e => setMonth(Number(e.target.value))}>{nonprofitMonths.map((m, i) => <option key={m.month} value={i}>{m.month}</option>)}</select></label></div>
      <p aria-live="polite">{label}</p>
      <Metrics items={[["Revenue", money(s.revenue)], ["Expenses", money(s.expenses)], ["Operating surplus / deficit", money(s.surplus)], ["Cash", money(s.endingCash)], ["Budget variance · surplus", money(s.budgetVariance)], ["Forecast variance · surplus", money(s.forecastVariance)], ["Restricted funds", money(s.restricted.ending)], ["Unrestricted funds", money(s.unrestricted.ending)]]} />
      <h3>Budget vs. actual</h3>
      <FinancialTable caption={`${label} · variance = actual − budget; expense increases are unfavorable.`} headers={["Account", "Budget", "Actual", "Variance $", "Variance %", "Assessment"]} rows={[["Revenue", s.revenueBudget, s.revenue, "revenue"], ["Expenses", s.expenseBudget, s.expenses, "expense"]].map(([name, budget, actual, kind]) => {
        const v = variance(Number(actual), Number(budget));
        return [String(name), money(Number(budget)), money(Number(actual)), money(v.amount), percent(v.percent), v.amount === 0 ? "On budget" : (kind === "revenue" ? v.amount > 0 : v.amount < 0) ? "Favorable" : "Unfavorable"];
      })} />
      <FinancialTable caption="Forecast vs. actual · positive expense variance means spending above forecast." headers={["Account", "Forecast", "Actual", "Variance $", "Variance %"]} rows={[["Revenue", s.forecastRevenue, s.revenue], ["Expenses", s.forecastExpenses, s.expenses]].map(([name, forecast, actual]) => { const v = variance(Number(actual), Number(forecast)); return [String(name), money(Number(forecast)), money(Number(actual)), money(v.amount), percent(v.percent)]; })} />
      <h3>Key variances · program expenses</h3>
      <Metrics items={[["Budget", money(s.programBudget)], ["Actual", money(s.programActual)], ["Variance", money(program.amount)], ["Variance %", percent(program.percent)]]} />
      <p>{program.amount > 0 ? "Program expenses are above budget" : program.amount < 0 ? "Program expenses are below budget" : "Program expenses match budget"} for the selected period. Variance causes require supporting records.</p>
      <label>Management commentary · illustrative draft, retained only while this page is open<textarea value={commentary} maxLength={2000} onChange={e => setCommentary(e.target.value)} /></label>
    </ProjectSection>
    <ProjectSection id="model" title="Cash flow & fund reporting">
      <FinancialTable caption={`${label} · cash bridge`} headers={["Beginning cash", "Cash inflows", "Cash outflows", "Ending cash"]} rows={[[money(s.beginningCash), money(s.revenue), money(s.expenses), money(s.endingCash)]]} />
      <h3>Restricted & unrestricted funds</h3>
      <FinancialTable caption="Fund balances reconcile to cash in this simplified cash-basis dataset; restrictions limit availability." headers={["Fund", "Beginning balance", "Inflows", "Usage", "Ending balance"]} rows={[["Restricted funds", s.restricted], ["Unrestricted funds", s.unrestricted]].map(([name, f]) => { const fund = f as typeof s.restricted; return [String(name), money(fund.beginning), money(fund.inflows), money(fund.usage), money(fund.ending)]; })} />
      <h3>Monthly trends</h3>
      <TrendChart title="Revenue and expenses · selected reporting period" labels={s.months.map(m => m.month)} series={[{ name: "Revenue", values: s.months.map(m => m.revenueActual), color: "var(--project-accent)" }, { name: "Expenses", values: s.months.map(m => m.programActual + m.adminActual), color: "var(--project-chart-secondary)" }]} />
      <FinancialTable caption="Monthly management reporting · synthetic data" headers={["Month", "Revenue", "Expenses", "Surplus / deficit", "Ending cash"]} rows={s.months.map((m, i) => [m.month, money(m.revenueActual), money(m.programActual + m.adminActual), money(m.revenueActual - m.programActual - m.adminActual), money(nonprofitSummary(0, start + i + 1).endingCash)])} />
    </ProjectSection>
    <ProjectSection id="findings" title="Key findings">
      <p>The selected period generates a {s.surplus >= 0 ? "surplus" : "deficit"} of {money(Math.abs(s.surplus))}. Of {money(s.endingCash)} in ending cash, {money(s.restricted.ending)} is restricted; {money(s.unrestricted.ending)} remains unrestricted in this teaching case.</p>
      <p>Completed scope: interactive web reporting, a formula-based Excel workbook, and a management case study. The case uses cash-basis synthetic data. Power BI and accrual-ledger integration are optional future extensions.</p>
    </ProjectSection>
  </>;
}
