# Lee Data Center formula CSV exports

Annual and returns exports are self-contained, single-sheet CSVs with Year 0–10 columns and separate Base, Upside and Downside sections. Each formula uses only cells in its own file. Invalid scenarios are labeled with their validation error and omitted from calculated summaries.

The annual export calculates phase EBITDA, consolidated operating cash flow, phase-level cash taxes, working capital, exit value, debt draws, interest, principal, debt payoff, equity cash flows, coverage and returns. Phase revenue, power, other operating costs, capacity and development expenditure are explicitly labeled snapshots from the browser model, not a second full driver model. Change operating drivers or timing on the website and export again, or use the full Excel workbook. Financing and cash-flow calculations can be inspected and edited in the CSV.

The returns export includes its own current-model cash-flow and debt-service inputs. IRR, MOIC, discounted cash flows, NPV, minimum DSCR, covenant breaches and total contributions/distributions are formulas. It does not depend on the annual file or refresh from it.

Year 0 is undiscounted. DSCR excludes the exit balloon and sale proceeds. No-debt coverage is unavailable, not zero. IRR is unavailable when a negative cash flow follows positive cash flows, or cash flows lack both signs. An IRR numerical failure is also marked unavailable.

## Verification — November 19, 2026

- Recalculated both formula grids with the bundled Artifact Tool spreadsheet engine.
- Reconciled eleven return metrics per valid scenario against the website calculation engine for default financing, annuity financing, zero debt, zero interest and exit in Year 6: 28 file/scenario combinations and 308 comparisons.
- Zero-interest Upside is explicitly unavailable because the existing Upside scenario subtracts one percentage point and violates the model's nonnegative-rate constraint.
- Changed the equity discount rate in both default exports; NPV decreased and returned to its original value after restoring the rate.
- Scanned calculated cells for spreadsheet errors and rendered both Base return summaries for inspection.
- Unit tests cover self-contained references, live formulas, edited inputs, unavailable scenarios and preservation of CSV-injection protection in general data exports.
- Browser tests exercise both downloads after an input edit and the retained values-only data export on desktop and mobile.

Native Microsoft Excel recalculation has not been verified. Open formula CSVs directly in Excel and save as `.xlsx` to retain formulas on subsequent saves; import/ETL tools may treat formula text as data. CSV does not retain images, formatting or multiple sheets. The full branded workbook remains the primary driver-level modeling deliverable.
