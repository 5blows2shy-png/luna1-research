# Luna1 CloudSpend

A browser-local FinOps intelligence application at `/cloudspend`, linked from Applied Projects and the earlier Cloud FinOps case study. This release provides interactive analysis, local CSV import and CSV report downloads. It does not connect to billing accounts, provision resources, store uploaded records, or implement multi-tenant authentication.

## Architecture

- `src/lib/cloudspend/model.ts`: typed cost model, allocation, monthly comparisons, forecasting, anomaly rules and VM safeguards.
- `src/lib/cloudspend/demo.ts`: deterministic June–November 2026 daily cost simulation and independent VM telemetry/pricing assumptions. Current demo data is complete through November 21, 2026.
- `src/lib/cloudspend/import.ts`: bounded CSV parser, atomic validation and FOCUS-subset normalization. No dependencies or network calls.
- `src/components/cloudspend`: interactive workspace and keyboard-accessible SVG charts. Client-side state holds the current dataset; refresh clears imports and review states.
- `src/app/cloudspend/page.tsx`: server route and metadata. Existing site navigation, branding and financial disclaimer are preserved.

Run `npm run dev` and visit `/cloudspend`. Standard repository lint, type-check, unit-test and production-build commands apply. `tests/cloudspend.test.mjs` tests financial reconciliation and ingestion boundaries; `e2e/cloudspend.spec.ts` tests navigation, input changes, imports and downloads.

## Financial definitions

BilledCost and EffectiveCost are separate selectable measures; they are never added together. Billed cost represents charged amounts, while effective cost uses the source's amortized allocation. The synthetic compute discount is an illustrative difference, not a provider commitment calculation. USD is the only supported currency. Credits remain negative; allocation percentages use net total spend and are unavailable when that total is nonpositive.

Month-to-date actuals are compared with the prior month's matching day cutoff. Previous full-month spend appears separately. A month-end run rate divides actual cost by elapsed calendar days and multiplies by the month's calendar days. Forecasts require declared coverage from the first of the selected month. Imported coverage is user-declared; missing source days can bias forecasts. Three future months compound the selected growth rate; hypothetical savings are deducted once from positive gross forecasts. Annualized spend is the current run rate times twelve, not a twelve-month forecast. Demo budgets are independent service-level planning amounts, not actual spend multiplied by a factor. Imported budgets remain unavailable until supplied for the current filter scope.

Showback groups one allocation dimension at a time and reconciles to selected spend. Blank tags remain Unallocated. Shared costs are not redistributed without a documented policy.

## Rightsizing and operational safeguards

Simulated VMs include allocated CPU/RAM, averages, p95 and peaks, minimum specifications, telemetry coverage, latency and I/O evidence. Halving CPU and RAM is a candidate only with at least 30 observation days, 95% coverage, 30% p95 headroom and 20% peak headroom, plus minimum-specification, memory-pressure, latency and I/O checks. Billing imports alone cannot provide this evidence; rightsizing is unavailable for imported datasets.

Pricing is explicit: allocated vCPU times an illustrative CPU price plus allocated GB RAM times an illustrative memory price plus fixed platform cost. These assumptions are not AWS/Azure SKU quotes. Target availability, reservations, licensing, load testing and rollback must be reviewed before realizing savings. VMware capacity release is not cash savings and is excluded from the executive public-cloud savings estimate. No changes are executed.

## Anomaly method

For each provider/service category, compare one day's selected cost measure with the preceding seven calendar days. All seven prior days must have records. Flag increases greater than or equal to the maximum of $100, 35% of the baseline and three population standard deviations. No future observations enter the baseline. Usage comparisons are available only when units match and quantities are present. A storage-cost spike is called a usage-growth signal only when comparable usage also increases. Flags are investigative signals, not confirmed waste. Review states persist only until tab refresh.

## Import contract

Use AWS or Azure **FOCUS cost-and-usage CSV** exports with daily or hourly charge periods, within one UTC calendar day. Legacy CUR and Azure ActualCost schemas require upstream conversion. Monthly charges require documented upstream daily allocation. Maximum 5 MB and 25,000 records, with a declared coverage range no longer than one year.

Required columns: ProviderName, ServiceCategory, ServiceName, ResourceId, ChargePeriodStart, ChargePeriodEnd, BilledCost, EffectiveCost, BillingCurrency. ResourceId may be blank and remains unassigned. Optional: ConsumedQuantity, ConsumedUnit, Tags (JSON object), x_Department, x_Project, x_Application, x_CostCenter and x_Customer. Extension columns take precedence over tags. Unknown columns are ignored. Dates are ISO dates or UTC timestamps; end timestamps are exclusive. Exact duplicate records, invalid costs, out-of-coverage dates, mixed currencies and malformed CSV reject the entire import. Duplicate records can represent legitimate billing complexity; review upstream rather than removing them blindly.

This is a **FOCUS-aligned analytical subset**, not a full FOCUS dataset generator, conformance validator or certification. No columns beyond the documented subset are synthesized to imply compliance. CSV downloads escape formula-like text; raw billing inputs never become executable spreadsheet formulas.

## References

Reviewed November 22, 2026. These sources inform structure and field semantics; none supplies the demo's financial values.

- [FinOps Framework](https://www.finops.org/framework/)
- [Forecasting capability](https://www.finops.org/framework/capabilities/forecasting/)
- [Anomaly management](https://www.finops.org/framework/capabilities/anomaly-management/)
- [FOCUS 1.2 columns](https://focus.finops.org/docs/specification/v1-2/columns/)
- [AWS Data Exports](https://docs.aws.amazon.com/cur/latest/userguide/dataexports-create.html)
- [Azure Cost Management exports](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-improved-exports)

All demo infrastructure, customers, costs and savings are hypothetical. No LightEdge Solutions or other employer/customer data is used. Native provider connections, scheduled ingestion, persistent review workflows and imported VM telemetry are outside this release.

## Release verification

November 22, 2026: lint, strict TypeScript checking, the production build and all 151 repository unit tests passed. Four Playwright workflows passed against the production build across desktop Chromium and mobile WebKit, covering project navigation, filters, VM evidence, showback downloads, forecast changes, anomaly review, successful import, atomic rejection of an invalid currency and clearing imports on refresh. Desktop and mobile screenshots were inspected; no horizontal page overflow was observed. Live provider connections and full FOCUS conformance were not tested or claimed.
