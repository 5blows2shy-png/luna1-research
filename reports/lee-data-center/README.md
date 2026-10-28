# Lee Data Center — Houston, TX

Hypothetical Houston, Texas project. All operating, construction and financing inputs are illustrative portfolio assumptions, not market quotes, lender terms, site feasibility findings or a real development proposal.

## Open and review
Extract this entire folder. Open Lee Data Center.pbip in Power BI Desktop (Windows) with project support enabled. Refresh to load the embedded illustrative dataset, then select exactly one scenario on each page. No credentials, local absolute paths or external data source are required. The semantic model imports a fixed snapshot; browser edits do not sync automatically.

This generated PBIR report and TMSL semantic model have not been opened in Power BI Desktop. JSON schema validation and model reconciliation are separate from native application validation. Verify visuals, refresh, scenario filters, theme and measures before publishing. No live dashboard URL is available.

## Refresh from your edits
Export the annual and returns CSV files from the website. In Power BI Desktop, replace the Annual and Results Power Query source expressions with imports of those corresponding CSV files, preserve column names and types, and refresh. Editing data/model.json alone does not update the embedded semantic model. Keep Results[Scenario] unique and its one-to-many relationship to Annual[Scenario]. Do not sum IRR, MOIC or DSCR. Never sum ending debt across years; that measure is intended only on a Year axis.

## Financial method
Rent bills leased MW after availability; power uses utilized MW. Construction draws fund a fixed share of CapEx. Interest = opening balance plus half-year draws, times interest rate. Fees and construction interest are equity-funded. CFADS excludes development spend, financing and exit proceeds. DSCR excludes exit debt payoff, which is separately bridged in the website schedule. The cash tax proxy is positive phase EBITDA times the entered rate; no interest shield, losses, DSRA or refinancing. Equity contributions include later cash deficits. MOIC uses positive over absolute negative annual net flows; IRR is withheld for nonconventional flows. All figures are nominal USD.

## Reconcile starter data
Base equity IRR: 24.5511%. Base equity MOIC: 6.167624x. Minimum DSCR: 0.783104x. Annual rows: 33. Return rows: 3. Sensitivity cells: 27.

WD-40 companion: /recruiter/research-challenge. No private WD-40 document is included.

Microsoft references:
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report
https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-dataset
