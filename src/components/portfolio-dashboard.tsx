"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/site";
import { annualizedSharpe, cumulativeReturn, maxDrawdown, sortinoRatio } from "@/lib/portfolio-metrics";

const monthly = [.021, -.012, .038, .009, -.024, .031, .018, .006, .027, -.008, .019, .014];
const chart = monthly.map((value, index) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
  portfolio: +(100 * (1 + cumulativeReturn(monthly.slice(0, index + 1)))).toFixed(1),
  benchmark: +(100 * (1 + cumulativeReturn(monthly.slice(0, index + 1).map((item) => item * .72)))).toFixed(1),
  return: +(value * 100).toFixed(1),
}));
const sectors = [
  {name: "Technology", weight: 38},
  {name: "Financials", weight: 18},
  {name: "Health Care", weight: 16},
  {name: "Industrials", weight: 15},
  {name: "Other", weight: 13},
];
const metrics = [
  {label: "Cumulative return", value: `${(cumulativeReturn(monthly) * 100).toFixed(1)}%`},
  {label: "Maximum drawdown", value: `${(maxDrawdown(chart.map((item) => item.portfolio)) * 100).toFixed(1)}%`},
  {label: "Sharpe ratio", value: annualizedSharpe(monthly).toFixed(2)},
  {label: "Sortino ratio", value: sortinoRatio(monthly).toFixed(2)},
];

export function PortfolioPerformance() {
  return <div className="portfolio-performance">
    <div className="placeholder-banner">Illustrative, manually entered data. Results may be simulated or delayed and do not represent audited performance. Past results do not predict future performance.</div>
    <div className="metric-strip">{metrics.map((metric) => <div key={metric.label}><small>{metric.label}</small><strong>{metric.value}</strong></div>)}</div>
    <div className="chart-grid">
      <div className="chart-card"><h2>Benchmark comparison</h2><ResponsiveContainer width="100%" height={320}><AreaChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="var(--divider)"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Area type="monotone" dataKey="portfolio" stroke="var(--gold)" fill="var(--gold-soft)"/><Area type="monotone" dataKey="benchmark" stroke="var(--platinum)" fill="var(--platinum-soft)"/></AreaChart></ResponsiveContainer></div>
      <div className="chart-card"><h2>Monthly return</h2><ResponsiveContainer width="100%" height={320}><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="var(--divider)"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="return" fill="var(--emerald)"/></BarChart></ResponsiveContainer></div>
    </div>
    <div className="chart-card"><h2>Sector exposure</h2><ResponsiveContainer width="100%" height={280}><BarChart layout="vertical" data={sectors}><XAxis type="number"/><YAxis type="category" dataKey="name" width={90}/><Tooltip/><Bar dataKey="weight" fill="var(--gold)"/></BarChart></ResponsiveContainer></div>
  </div>;
}

export function PortfolioDashboard() {
  return <><PageHeader kicker="Portfolio Dashboard" title="Performance, risk, and exposure—made explicit." description="An educational dashboard for evaluating portfolio behavior against a benchmark."/><section><PortfolioPerformance/></section></>;
}
