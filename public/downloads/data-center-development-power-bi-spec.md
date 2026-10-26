# LUNA1 | 10-Year Data Center Investment & Development Model

Version 1.0 · Educational portfolio specification · USD

**For modeling practice only. The $12 million per MW assumption is illustrative and is not an estimate of any specific LightEdge, customer, facility, or real-world project.**

This hypothetical case study was developed for educational and portfolio purposes. All financial assumptions are illustrative or derived from appropriately cited public sources. It does not use confidential employer, customer, facility, pricing, capacity, or internal financial information.

## Status and source of truth

The website calculation engine is the financial source of truth. This document specifies a report to be built in Power BI; it is not a completed PBIX file or a screenshot of one. No market pricing, lease-up schedule, discount rate or exit multiple is pre-populated. The initial $240M budget is 20 MW × the illustrative $12M/MW input; all category costs begin unallocated under Other.

Enter and validate the assumptions in Luna1, then download the Power BI JSON package or individual CSV tables. JSON includes the disclosures, source assumptions and all tables. In Power Query, select the JSON `tables` record, select each named list, convert to a table and expand its records. Alternatively import the individual CSVs with comma delimiter, quoted text and UTF-8 encoding. Use numbers for amounts, whole numbers for Year/Phase_ID, text for Scenario and percentages as decimal fractions. Null means unavailable, never zero. Keep assumption and scenario-status tables in the report for auditability.

## Model and relationships

Use these fact tables; the other exported tables are convenient views and must not be added to the same measures a second time.

| Dimension | Key | Facts | Cardinality / direction |
|---|---|---|---|
| DIM_DATE | Year (0–10) | FACT_FINANCIALS, FACT_CAPEX, FACT_CAPACITY | One-to-many, single direction |
| DIM_PHASE | Phase_ID (1 or 2) | FACT_FINANCIALS, FACT_CAPEX, FACT_CAPACITY | One-to-many, single direction |
| DIM_SCENARIO | Scenario | All five fact tables | One-to-many, single direction |

- FACT_FINANCIALS grain: one row per scenario, phase and year. Contains phase operating data, cash-flow components and allocated exit proceeds.
- FACT_CAPEX grain: scenario, phase, year and category. Category allocations sum to annual development spending; do not add FACT_FINANCIALS development CapEx again.
- FACT_CAPACITY grain: scenario, phase and year. MW are stock measures; do not sum them over years.
- FACT_RETURNS grain: one full-project result per valid scenario. Do not relate it to date or phase, and do not sum NPV, IRR, MOIC or payback.
- FACT_SENSITIVITY grain: metric, row factor and column factor. These 27 rows stress the base assumptions only. No date or phase relationship. Scenario key is Base.
- Yearly_Financials is a consolidated convenience view. Do not union it into phase facts.
- Operating_Expenses is a separate category-detail fact if used. Link it to date, phase and scenario. Its Power category is already part of total OpEx.
- Scenario_Status records valid and invalid scenarios. An invalid scenario has no financial facts; display its reason rather than a zero metric.
- Project_Assumptions contains all parameters and source labels. Scenario_Assumptions contains explicit overlay factors. Upside and downside initially equal Base until users change their factors.

Set the default scenario slicer to **single-select Base**. Disable multi-select and Select All. Return cards display full-project results, unaffected by phase and year slicers; label them accordingly. Operating charts can respond to phase and year selections. Keep sensitivity visuals on Base and clearly label that scope.

## Six report pages

### 1. Executive overview

KPI cards: total capacity, illustrative development budget, 10-year horizon, NPV, IRR and MOIC. Bind capacity and budget to exported results, not fixed 20 / 240 labels after inputs change. Use a revenue / EBITDA trend, annual unlevered FCF columns, available / leased / utilized capacity and CapEx by phase. Add the single-select scenario slicer and visible hypothetical-project disclosure.

### 2. Development

Stacked columns of annual CapEx split by phase; horizontal category bars; a phase timeline showing first positive development spend through first available year; cumulative development investment line. Read availability from the assumption register. No equal construction duration is implied. Category names and shares are user-editable.

### 3. Capacity & lease-up

Available versus leased MW combo chart; utilization line; separate phase lease-up lines; capacity bridge from total developed MW through available and leased to unleased available capacity. Pre-leased MW can exceed available MW, but do not generate early revenue. Explain this distinction in a tooltip. Stock KPI cards use the last selected year, not a sum of annual balances.

### 4. Operating performance

Revenue, EBITDA, margin and power-cost cards. Revenue / EBITDA combo chart, expense category stacked columns, facility energy, PUE and power cost per utilized MW. Ratios use weighted totals, not averages of phase margins. PUE includes cooling electricity; cooling service must exclude that electricity.

### 5. Investment returns

Full-project NPV, IRR, MOIC, operating payback and net exit value. Annual unlevered FCF bars, cumulative total investor cash flow, and a cash realization bridge. Label negative net cash flows as invested capital and positive net cash flows as value realized. A waterfall can show annual total cash flows; do not add gross development costs to already-netted FCF. Show exit proceeds and WC release separately.

### 6. Scenario & sensitivity

Compare Base, Upside and Downside full-project return cards and exit-year revenue / EBITDA. Label each exit year when timing differs. Display the IRR construction-cost / lease-ramp matrix and NPV construction-cost / exit-multiple matrix, with the MOIC lease-ramp / exit-multiple matrix available below. Use 0.90x, 1.00x, 1.10x axes. Show N/A, with the exported reason, for invalid cells. Highlight construction cost, lease-up, power economics and terminal valuation.

## Measures

Financial returns are imported from Luna1; do not substitute XIRR, an unweighted phase IRR or a monthly discount convention. These measures assume the exact exported field names and the relationships above.

```dax
Total Revenue = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_FINANCIALS[Revenue]))
Total EBITDA = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_FINANCIALS[EBITDA]))
EBITDA Margin = DIVIDE([Total EBITDA], [Total Revenue])
Total CapEx = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_CAPEX[Development_CapEx]))
Total Unlevered FCF = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_FINANCIALS[Unlevered_FCF]))
Power Cost = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_FINANCIALS[Power_Cost]))
Average Utilization = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), DIVIDE(SUM(FACT_CAPACITY[MW_Utilized]), SUM(FACT_CAPACITY[MW_Available])))
Total MW Leased =
VAR LastYear = MAX(DIM_DATE[Year])
RETURN IF(HASONEVALUE(DIM_SCENARIO[Scenario]), CALCULATE(SUM(FACT_CAPACITY[MW_Leased]), DIM_DATE[Year] = LastYear))
NPV = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SELECTEDVALUE(FACT_RETURNS[NPV]))
IRR = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SELECTEDVALUE(FACT_RETURNS[IRR]))
MOIC = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SELECTEDVALUE(FACT_RETURNS[MOIC]))
Operating Payback = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SELECTEDVALUE(FACT_RETURNS[Payback]))
Exit Value = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SELECTEDVALUE(FACT_RETURNS[Exit_Value]))
Total Cash Flow = IF(HASONEVALUE(DIM_SCENARIO[Scenario]), SUM(FACT_FINANCIALS[Total_Cash_Flow]))
Cumulative Cash Flow =
VAR LastYear = MAX(DIM_DATE[Year])
RETURN CALCULATE([Total Cash Flow], FILTER(ALL(DIM_DATE), DIM_DATE[Year] <= LastYear))
```

Average Utilization is weighted by available MW-years in the selected range, not an arithmetic mean of phase percentages. Cumulative Cash Flow includes all years from Year 0 to the displayed year, even if the date slicer begins later. Return cards are scenario-level, not phase-level. After an early exit, subsequent operating facts are zero. For an exit-year capacity snapshot, use FACT_RETURNS[Exit_Year] rather than Year 10.

## Financial methodology

Year 0 is development at time zero. Years 1–10 are annual end-period cash flows. Availability begins at the start of the specified year; all development spend precedes it. IT energy uses utilized MW × 1,000 × 8,760; facility energy multiplies by PUE. Revenue is selected leased or utilized MW times a converted annual rate. Contracted pre-leases do not create revenue before availability. Capacity pricing escalates from Year 1. Other recurring revenue uses leased MW. Fixed operating costs are allocated by phase capacity and begin at phase availability.

Cash taxes are a user-entered effective rate on positive phase EBITDA, without tax depreciation, losses or interest. Working capital is a share of revenue and is released at exit. Unlevered FCF subtracts taxes, development, maintenance CapEx and change in WC. No financing flows are included. Exit value uses consolidated positive EBITDA and the user’s multiple, less selling costs. No disposal tax is modeled. A nonpositive exit EBITDA requires an explicit zero multiple to model no sale proceeds; otherwise outputs are withheld. Exit value is allocated to positive-EBITDA phases for fact-table reconciliation, not represented as a separate phase valuation.

NPV uses the entered annual rate. IRR is reported only for conventional outflows followed by inflows. MOIC is total positive net investor cash flow divided by absolute negative net investor cash flow, including exit proceeds and WC release. Operating payback excludes exit cash and must remain recovered through the modeled horizon. Two analytical break-even values solve NPV=0 while holding all other inputs fixed: the exit EBITDA multiple and CapEx/MW. A nonnegative solution is required.

## Luna1 visual system

Import `luna1-infrastructure-power-bi-theme.json`. Use near-black / midnight surfaces, warm ivory text, champagne primary series and muted gray secondary series. Use green / red only for meaningful favorable / adverse values. Keep chart gridlines subtle, titles descriptive, units visible and tables aligned. Avoid 3D, rainbow palettes, excessive donuts and decorative imagery. Apply the approved Luna1 logo with its original proportions and colors on a neutral background. Include the model disclaimer on every report page and PDF export.

## Embedding and publication

The website renders no iframe until `developmentDashboard` has an approved public `https://app.powerbi.com/view?r=...` URL. This public report path is intentionally narrower than authenticated embedding; private tenant reports need a separate authenticated integration. Set `approvedForPublicUse` only after reviewing every underlying data table for public distribution. The site never accepts a user-supplied iframe or script. This specification does not authorize publication of private research.

Microsoft reference: [Publish to web](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web) and [custom report themes](https://learn.microsoft.com/en-us/power-bi/create-reports/report-themes-create-custom), consulted October 19, 2026. Public embedding makes underlying report data accessible to the public.

## Acceptance checklist

1. Phase allocations and category shares each total 100%; phase facts reconcile to consolidated website schedules.
2. All valid scenario NPV / IRR / MOIC values match the exported return rows; invalid scenarios and nulls remain visible as unavailable.
3. Base / upside / downside slicers do not sum multiple scenario results. Phase filters never imply phase-specific IRR or NPV.
4. Revenue, EBITDA, CapEx, cash flow and energy totals match the same selected scenario and years in Luna1.
5. Each sensitivity cell matches its exported metric and factors. Capped lease-up is explained.
6. Disclosures remain visible in both interactive and PDF output; only reviewed public data is published.
