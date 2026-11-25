# Lee Data Center — 10 MW Virginia site case

Report refreshed November 24, 2026. The October 28, 2026 underwriting assumptions remain unchanged. This replaces the earlier 20 MW Houston teaching snapshot.

Hypothetical development using a publicly listed Midlothian, Virginia parcel. Listing facts are broker-reported; no acquisition, entitlement or electric service is secured. All operating, construction and financing inputs are illustrative portfolio assumptions, not market quotes, lender terms, site feasibility findings or a real development proposal.

## Open and review
Extract the entire archive and open Lee Data Center.pbip in Power BI Desktop on Windows with project support enabled. The model imports embedded Power Query tables; no credentials, absolute local paths or external source are required. Investment cards and annual charts default to Base when the scenario field is unfiltered. Select one scenario to change them; multiple selected scenarios return blank rather than summing ratios. The scenario comparison table evaluates each row independently. The two additional pages use independent default Base inputs and do not respond to the investment scenario slicer.

Five report pages: investment overview, operating economics, credit review, infrastructure sourcing, and power pricing. Luna1 branding and financial disclosure appear on every page. PBIR schema and model reconciliation checks are separate from native Power BI Desktop rendering, DAX execution and refresh, which remain unverified. This is an editable PBIP project, not a verified PBIX or hosted report.

## Current 10 MW model
Two 5 MW phases. Site acquisition/enabling allowances of $11.092 million plus $134.4 million non-land development = $145.492 million CapEx. Base debt commitment: $65.4714 million. Base equity IRR: 16.1811%; equity MOIC: 3.495071x; minimum DSCR: 0.504438x. 6 covenant breach years. 33 annual rows and 3 scenario return rows.

## Decision perspectives
Illustrative enterprise sourcing comparison, not the landlord investment case. All options serve the same phased provisioned-capacity proxy. No workload benchmark or vendor quote establishes equivalent performance. Costs exclude taxes, financing, application licenses, common application staff and residual value; no tenant rent or sale proceeds offset owned infrastructure costs.

Sourcing uses open/leased MW converted to server equivalents, with peak installed capacity retained in all options. Cloud uses the same provisioned vCPU-hours (no elasticity/spot/commitment savings), plus storage, egress and support. Colocation includes capacity rental excluding power, metered power and common physical IT hardware/support. Owned includes the full facility development/operation/maintenance plus the same physical IT hardware/support. Cohorts refresh every five years. Physical hardware includes local storage and network allocation; colo rent includes facility connectivity/operations. Annual escalation applies to cloud, colo capacity and hardware; the owned-facility cost assumptions remain those in the Lee model. No terminal property or hardware recovery is credited. Workload performance equivalence, SLA parity and vendor price quotes require diligence. Sources and editable defaults are recorded in data/infrastructure.json. Cost is positive: lower PV cost is less costly under the assumptions, not a sourcing recommendation.

Power-price analysis reruns the Base investment model at each tariff stress with no revenue pass-through, demand reduction or financing change. Electricity = utilized IT MW × 1,000 × 8,760 × PUE. CFADS excludes sale proceeds and development; operating DSCR excludes the exit balloon. Annual cash taxes are a simplified proxy on positive phase EBITDA, without an interest tax shield or loss carryforwards.

## Refresh and reproduce
From the repository run node scripts/build-lee-power-bi.mjs, node --test tests/lee-infrastructure.test.mjs and node scripts/validate-lee-power-bi.mjs. The current inputs come from initialExpansionProject(), not initialLeeProject(). All five semantic-model tables are regenerated from the shared website engines.

CSV and JSON files are audit snapshots. Editing them alone does not update embedded model.bim partitions. Browser controls do not synchronize with the report. For browser-edited investment cases, use the VALUES-ONLY annual and returns CSV exports, not the formula CSVs, and replace the Annual and Results Power Query sources while preserving types, column names and the Results-to-Annual scenario relationship. For edited sourcing or power cases, replace the corresponding table sources as well. Keep Sourcing results and SourcingAnnual detail from the same assumptions. Do not sum ratios or stock balances across periods; Ending Debt requires one Year in context. Sourcing/Power tables intentionally have no relationship to Results.

## References
AWS EC2 On-Demand pricing components: https://aws.amazon.com/ec2/pricing/on-demand/ — Compute and data transfer are separate pricing dimensions. No AWS SKU price is used as an observed quote.
Microsoft Azure pricing calculator: https://azure.microsoft.com/en-us/pricing/calculator/ — Obtain a region-, configuration- and contract-specific estimate before relying on cloud cost assumptions.
EIA electricity prices by state and sector: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a — Regional context only. State averages are not the parcel tariff. The power allowance and stress prices remain analyst assumptions.
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report
