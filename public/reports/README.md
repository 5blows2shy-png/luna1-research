# Klyro Reports

Place only reviewed, publication-ready equity research PDFs in this directory.

Naming convention: `TICKER-Klyro-Research-Report.pdf`

After adding a report, update the corresponding `report` record in
`src/data/research/research-companies.ts`:

- set `status` to `available`;
- set `url` to `/reports/TICKER-Klyro-Research-Report.pdf`;
- add the verified file size and publication version;
- replace `Date to be confirmed` with the verified publication or revision date.

Do not publish draft, empty, or unsourced reports.
