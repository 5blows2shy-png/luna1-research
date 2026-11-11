# Enterprise Cloud Cost Optimization & FinOps Dashboard

All financial figures, cloud-resource assumptions, workloads, budgets, utilization rates and savings estimates are simulated for educational and portfolio purposes only. They do not represent actual LightEdge Solutions, AWS, Microsoft Azure, customer or employer financial or operating data.

## Open
Extract the entire archive and open Cloud FinOps.pbip in Power BI Desktop on Windows with project support. The semantic model imports embedded Power Query tables: no credentials, billing accounts, external services or absolute local paths. Four pages: executive overview, showback, optimization opportunities and scenarios. Select one scenario (Moderate is the measure default if no scenario is selected); provider and department dimensions filter both spend and forecast. The scenario comparison page evaluates all three rows separately.

JSON schemas, data reconciliation and unit tests can be checked here; native Desktop refresh, DAX execution and visual behavior have NOT been verified. This is a PBIP/PBIR project, not a PBIX or a hosted dashboard. Validate in Desktop before publishing.

## Reproduce
From the Luna1 repository run node scripts/build-cloud-finops.mjs, node --test tests/cloud-finops.test.mjs and node scripts/validate-cloud-finops.mjs. The shared calculation engine is src/lib/cloud-finops.ts. CSVs are audit snapshots; editing them does not refresh the embedded data. Regenerate the package from the engine to update it. Website controls do not synchronize to Power BI.

## Financial method
Historical period: Jan–Dec 2026. Direct actual spend is scaled to $1,104,000; shared platform overhead is $96,000. Independent budget is $1,164,000. Actual consumption trend is 1.2% per month with a 25% September shock for Data production; budget trend is 0.4%. Usage quantities are synthetic, with no provider pricing represented.

Shared overhead is allocated each month by baseline direct-cost share, held constant across scenarios, and never counted twice. Savings waterfall: idle removal, compute rightsizing (limited by utilization ceiling), storage reduction, then discounts on eligible remaining compute/database cost. Reservations are effective-rate reductions on production workloads only, with no separate upfront cash-flow model. Policies are in data/policies.json. Savings exclude implementation costs, commitment underuse, taxes, fees and migration costs; they are gross steady-state opportunities, not realized savings.

Utilization is compute used capacity / remaining compute capacity; minimum buffer is the lowest active compute resource-month headroom. Workload units appear on Compute records only, preventing fourfold double counting across services. Cost per unit is meaningful at workload level, not at individual non-compute service level. Mixed usage units must not be summed.

The fixed Power BI forecast covers Jan–Dec 2027. Each workload starts from Dec 2026 cost, compounds direct costs by 1.2% monthly, leaves its shared allocation fixed and compounds budget by 0.4%. The website additionally allows earlier anchor months and growth sensitivities. Forecast policy assumes proportional capacity growth and no new commitment pricing; it is a planning extrapolation, not a trained statistical model. Run rate is December allocated cost times 12.

## Management recommendation
Adopt Moderate as a 90-day pilot, with owner/dependency checks before idle deletion, peak-load validation and rollback thresholds before rightsizing, then commitments on stable residual demand. Moderate retains a 30% policy minimum buffer and 50% eligible commitment coverage; Aggressive targets a 20% floor and 80% coverage. More savings are not sufficient evidence for more commitments. Validate provider contract terms, demand downside, retrieval costs and cash implementation costs before execution. Showback improves accountability; it does not itself reduce invoices.

## Sources
Framework references only; all numbers are simulated.
https://www.finops.org/framework/capabilities/usage-optimization/
https://framework.finops.org/framework/capabilities/allocation/
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview

## Reconciliation
`reconciliation.json` contains scenario spend, savings, utilization, minimum buffers, unit economics and forecast totals.
