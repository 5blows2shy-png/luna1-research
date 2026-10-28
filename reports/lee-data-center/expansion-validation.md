# Lee Data Center — 10 MW listed-site case validation

Prepared October 28, 2026. Hypothetical acquisition and development of the publicly advertised 16000 Midlothian Turnpike parcel; the existing 20 MW web / Power BI case is separate.

## Workbook checks

- Formula engine recalculation and saved XLSX inspection found no cached formula errors.
- Annual schedules and six return metrics reconcile to the TypeScript model in `expansion-model.json`.
- All 27 sensitivity results reconcile; three native two-variable Excel Data Tables are present.
- Tested base, upside, downside, zero debt, annuity repayment, early exit, missing selected inputs, and a later-year lease change.
- Fifty-five annual cash and debt reconciliations meet the $0.01 tolerance. Audit checks do not feed model calculations.
- Saved workbook contains two charts and no external workbook links or VBA. All eleven worksheets visually reviewed.
- Native Microsoft Excel application recalculation was attempted but timed out. It is not certified by this check. Enable Automatic calculation, including data tables, in Excel.

## Recommendation

The two-page Luna1-branded committee memo was rendered and both pages reviewed. Base equity IRR is 16.2%, but minimum DSCR is 0.50x against a 1.30x covenant, with six breach years. Recommendation: defer land acquisition, construction and debt drawdown under current terms.

Inputs and public benchmark scope differences are documented in the workbook and memo. The annual cash-tax proxy and exclusions (monthly liquidity, reserve accounts, debt sculpting, loss carryforwards and other lender terms) are explicit; this is not a lender-approved financing model.

## Repository checks

Lint, TypeScript, 136 unit tests and the production build passed. All 26 desktop/mobile browser tests passed. Download integrity and browser behavior are covered by `e2e/applied-finance.spec.ts`. Re-run saved workbook checks with `python3 scripts/verify-lee-excel.py`.

Version 2.0 adds a separate fixed site-cost schedule: $10.244m in Year 0 and $0.848m in Year 1. Asking price is $9.8m; all other costs are analyst allowances. Site costs stay fixed in construction sensitivities. A higher purchase-price edit lowers equity IRR. Saved workbook and website defaults reconcile.
