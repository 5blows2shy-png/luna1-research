# Infrastructure sourcing and power-price analysis

Prepared November 24, 2026. This reporting extension retains the October 28 10 MW Virginia site underwriting defaults and does not alter the existing Excel workbook or landlord model calculations.

## Comparison basis

The enterprise comparison uses the same phased, open-and-leased capacity as the Lee model, converted to provisioned server equivalents. All options retain peak provisioned capacity and carry identical provisioned vCPU-hours. Physical hardware additions are purchased once and refreshed by acquisition cohort; the default cycle is five years. Cloud hardware refresh is embedded in provider pricing rather than billed as customer CapEx.

Cloud includes compute with assumed RAM, storage, egress, support and migration. Colocation includes capacity rental excluding electricity, metered electricity, identical physical hardware, IT support and setup. Owned infrastructure includes the entire facility and parcel, power, facility operating and maintenance expense, physical hardware, IT support and setup. No landlord rent receipts, EBITDA sale value, financing, cash-tax proxy or terminal property/hardware recovery reduces enterprise TCO. Costs are positive; lower cost is not itself an investment recommendation. Values are nominal USD, discounted at the Lee project hurdle. Zero residual value, no cloud elasticity or commitment savings, and unverified workload equivalence materially affect comparisons.

Every newly introduced pricing, hardware-density and escalation input is an illustrative analyst assumption. No vendor offer is represented. Under default inputs the PV costs are approximately $2,237.93 million cloud, $458.34 million colocation and $538.25 million owned. The very large cloud result reflects provisioned 24/7 on-demand compute at the assumed server-to-vCPU density; it should not be generalized to an optimized architecture or a negotiated contract.

## Power-price sensitivity

The model reruns landlord operating cash flow, annual debt coverage and EBITDA-based exit value at $0.05, $0.075, $0.10, $0.125 and $0.15/kWh, adding the current browser-entered rate if different. No change in volume, PUE, debt terms or rent reimbursement is assumed. Failed cases return an explicit error rather than fabricated zero returns.

At the default Year 10 facility energy demand of 89,877,600 kWh, a $0.01/kWh price increase raises annual electricity expense and reduces EBITDA by $898,776. The $0.075 base case reconciles to 16.1811% equity IRR, $6,846,060 equity NPV and 0.504438x minimum DSCR. At $0.10/kWh, equity IRR is 14.0163% and equity NPV is negative $5,447,929; this is a hypothetical stress result, not a tariff forecast.

## Verification

- Unit tests reconcile every annual cost component, option PV totals, common provisioned demand, hardware refresh timing, early exit and retained peak capacity.
- Price edits affect the appropriate sourcing option while leaving the Lee investment engine unchanged; zero discount reconciles PV with nominal TCO.
- Current-price investment metrics reconcile to the Lee base case. Power-cost deltas equal energy times price changes, and higher prices reduce EBITDA, equity NPV and coverage.
- The Power BI package embeds the 10 MW annual schedules, current returns, both sourcing tables and power sensitivity. Tests decode each embedded Power Query table and compare every row with the shared engines.
- Fifty report/project definitions pass Microsoft JSON schemas. Ending-debt measures require a single year; investment measures default to Base when unfiltered and do not sum ratios across scenarios.
- The ZIP includes five branded report pages, five semantic tables, CSV/JSON audit data and refresh instructions. It replaces the 20 MW starter at the existing download URL.

Native Power BI Desktop rendering, DAX execution, refresh and service publication have not been verified in this environment. The package remains an editable PBIP/PBIR project, not a certified PBIX or hosted report. Browser edits are not automatically synchronized to the report or existing Excel workbook.
