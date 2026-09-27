export type Currency = "USD" | "EUR" | "MXN" | "JPY" | "GBP" | "CAD";
export type FxRate = {
  base: Currency;
  quote: Currency;
  rate: number;
  date: string;
  source: string;
  kind: "Assumption" | "Recorded Data";
};
export type Money = { amount: number; currency: Currency };
export function convertCurrency(
  original: Money,
  reportingCurrency: Currency,
  fx: FxRate | null,
  conversionDate: string,
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(conversionDate) || !Number.isFinite(Date.parse(conversionDate)))
    throw new Error("A valid conversion date is required.");
  if (!Number.isFinite(original.amount))
    throw new Error("Amount must be finite.");
  if (original.currency === reportingCurrency)
    return {
      originalAmount: original.amount,
      originalCurrency: original.currency,
      reportingCurrency,
      fxRate: 1,
      conversionDate,
      convertedValue: original.amount,
      source: "Same-currency conversion",
    };
  if (!fx) return null;
  if (
    fx.base !== original.currency ||
    fx.quote !== reportingCurrency ||
    fx.date !== conversionDate ||
    !Number.isFinite(fx.rate) ||
    fx.rate <= 0
  )
    throw new Error("FX pair, date, or rate is invalid.");
  const convertedValue = original.amount * fx.rate;
  if (!Number.isFinite(convertedValue)) throw new Error("Conversion exceeds the supported numeric range.");
  return {
    originalAmount: original.amount,
    originalCurrency: original.currency,
    reportingCurrency,
    fxRate: fx.rate,
    conversionDate,
    convertedValue,
    source: fx.source,
  };
}
export type TreasuryInputs = {
  revenue: number;
  expenses: number;
  revenueExposure: number;
  expenseExposure: number;
  fxChange: number;
  debt: number;
  floatingShare: number;
  interestRate: number;
  rateChange: number;
  cash: number;
  workingCapitalRelease: number;
};
export function treasuryScenario(input: TreasuryInputs) {
  if (Object.values(input).some((v) => !Number.isFinite(v)))
    throw new Error("Enter a finite value for every assumption.");
  for (const key of ["revenue", "expenses", "debt", "cash"] as const)
    if (input[key] < 0)
      throw new Error("Revenue, expenses, debt, and cash cannot be negative.");
  for (const key of [
    "revenueExposure",
    "expenseExposure",
    "floatingShare",
  ] as const)
    if (input[key] < 0 || input[key] > 1)
      throw new Error("Exposure must be between 0% and 100%.");
  if (
    input.fxChange <= -1 ||
    input.interestRate < 0 ||
    input.interestRate + input.rateChange < 0
  )
    throw new Error(
      "Exchange rates must stay positive and interest rates nonnegative.",
    );
  const revenueImpact = input.revenue * input.revenueExposure * input.fxChange;
  const expenseImpact = input.expenses * input.expenseExposure * input.fxChange;
  const interestImpact = input.debt * input.floatingShare * input.rateChange;
  const result = {
    revenueImpact,
    expenseImpact,
    operatingIncomeImpact: revenueImpact - expenseImpact,
    interestImpact,
    interestExpense: input.debt * input.interestRate + interestImpact,
    pretaxImpact: revenueImpact - expenseImpact - interestImpact,
    cashPosition: input.cash + input.workingCapitalRelease,
  };
  if (Object.values(result).some((v) => !Number.isFinite(v))) throw new Error("Scenario exceeds the supported numeric range.");
  return result;
}
export type RegionalPlan = {
  region: string;
  currency: Currency;
  period: string;
  fxDate: string;
  priorRevenue: number;
  budgetRevenue: number;
  actualRevenue: number;
  budgetExpenses: number;
  actualExpenses: number;
  budgetHeadcount: number;
  actualHeadcount: number;
  budgetCapex: number;
  actualCapex: number;
  priorRate: number;
  budgetRate: number;
  actualRate: number;
};
export function consolidateRegions(
  regions: readonly RegionalPlan[],
  forecastGrowth = 0,
) {
  if (
    !regions.length ||
    !Number.isFinite(forecastGrowth) ||
    forecastGrowth <= -1
  )
    throw new Error("A valid case and growth assumption are required.");
  const periods = new Set(regions.map((r) => r.period));
  const dates = new Set(regions.map((r) => r.fxDate));
  if (periods.size !== 1 || dates.size !== 1)
    throw new Error("Regional periods and FX dates must align.");
  const rows = regions.map((r) => {
    for (const value of Object.values(r))
      if (typeof value === "number" && (!Number.isFinite(value) || value < 0))
        throw new Error("Case inputs must be finite and nonnegative.");
    if (
      r.priorRevenue <= 0 ||
      r.budgetRevenue <= 0 ||
      Math.min(r.priorRate, r.budgetRate, r.actualRate) <= 0
    )
      throw new Error("Revenue bases and FX rates must be positive.");
    const actualRevenueUsd = r.actualRevenue * r.actualRate;
    const budgetRevenueUsd = r.budgetRevenue * r.budgetRate;
    const actualExpensesUsd = r.actualExpenses * r.actualRate;
    const budgetExpensesUsd = r.budgetExpenses * r.budgetRate;
    const actualProfit = actualRevenueUsd - actualExpensesUsd;
    return {
      ...r,
      actualRevenueUsd,
      budgetRevenueUsd,
      actualExpensesUsd,
      actualProfit,
      budgetProfit: budgetRevenueUsd - budgetExpensesUsd,
      revenueVariance: actualRevenueUsd - budgetRevenueUsd,
      operatingVariance: (r.actualRevenue - r.budgetRevenue) * r.budgetRate,
      fxVariance: r.actualRevenue * (r.actualRate - r.budgetRate),
      localGrowth: r.actualRevenue / r.priorRevenue - 1,
      reportedGrowth: actualRevenueUsd / (r.priorRevenue * r.priorRate) - 1,
      opexVariance: actualExpensesUsd - budgetExpensesUsd,
      headcountVariance: r.actualHeadcount - r.budgetHeadcount,
      actualMargin: actualRevenueUsd ? actualProfit / actualRevenueUsd : null,
      marginVariance: actualRevenueUsd
        ? actualProfit / actualRevenueUsd -
          (budgetRevenueUsd - budgetExpensesUsd) / budgetRevenueUsd
        : null,
      capexUsd: r.actualCapex * r.actualRate,
      capexVariance:
        r.actualCapex * r.actualRate - r.budgetCapex * r.budgetRate,
      forecastRevenue: actualRevenueUsd * (1 + forecastGrowth),
    };
  });
  const sum = (
    key:
      | "actualRevenueUsd"
      | "budgetRevenueUsd"
      | "actualProfit"
      | "revenueVariance"
      | "operatingVariance"
      | "fxVariance"
      | "forecastRevenue"
      | "capexUsd",
  ) => rows.reduce((total, row) => total + row[key], 0);
  const prior = regions.reduce((s, r) => s + r.priorRevenue * r.priorRate, 0);
  const neutral = regions.reduce(
    (s, r) => s + r.actualRevenue * r.priorRate,
    0,
  );
  return {
    rows,
    revenue: sum("actualRevenueUsd"),
    budget: sum("budgetRevenueUsd"),
    profit: sum("actualProfit"),
    variance: sum("revenueVariance"),
    operatingVariance: sum("operatingVariance"),
    fxVariance: sum("fxVariance"),
    forecast: sum("forecastRevenue"),
    capex: sum("capexUsd"),
    fxNeutralGrowth: neutral / prior - 1,
    reportedGrowth: sum("actualRevenueUsd") / prior - 1,
  };
}
