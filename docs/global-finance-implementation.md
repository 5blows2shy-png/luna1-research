# Global Finance — Phase 1 implementation

Completed September 26, 2026. Additive expansion of Luna1 Research.

October 4 local update: Global Finance now replaces Klyro in the primary desktop/mobile navigation. The overview adds the career-positioning brief: regional interests, an analyst framework, example company coverage cards, a developing-skills panel, operating-background diagram, readiness, an aspirational timeline, an unavailable-market-data panel, and recruiter links. Existing analytical tools remain connected. This update is not yet merged or deployed.

## 1. Existing systems reused

Next.js 16.3.2 App Router, strict TypeScript, React 19, existing ResearchSectionNav, site header/footer, disclaimer, theme tokens, editorial typography, company dossiers, Watchlist research renderer, typed CapitalFlowTheme records, and recruiter page. Static pages remain server components; only Treasury and FP&A inputs/downloads require client components. Existing auth, portfolio calculations, valuation tools, and market ticker were preserved. No dependencies added to package.json.

## 2. Routes added

- `/research/global-finance`: overview, growth comparison chart, eight-step research diagram, eight discipline cards with explicit later-phase states.
- `/research/global-finance/treasury`: interactive FX, financing, working-capital, sensitivity, and currency-conversion analysis.
- `/research/global-finance/fpa`: fictional Northstar consolidation and forecasting case.
- `/research/global-finance/casebook`: four proof-of-work records linking to implemented artifacts.

The shared layout includes Research navigation and the existing financial disclaimer. Sitemap entries were added.

## 3. Navigation

Global Finance is nested within Research through the existing shared section navigation. The Research landing page gains one pathway card. No duplicate primary-navigation item. Local links connect Overview, Treasury & FX, Global FP&A, and Casebook.

## 4. Treasury / FX

Editable revenue and expense exposure; −10%, −5%, +5%, +10% currency scenarios; selected foreign currency; debt repricing/refinancing fraction; interest-rate shifts; and working-capital cash release/absorption. Outputs separate revenue, expense, operating income, incremental interest, pre-tax impact, and a cash bridge. Includes signed impact bars, an FX sensitivity graph, and an original-to-reporting-currency conversion diagram.

Currency conversion retains original amount, original currency, reporting currency, rate, date, and source. Pair/date mismatches and invalid rates are rejected. Missing FX returns unavailable. Changing currency clears the entered conversion rate. Examples are explicitly fictional assumptions, not quotes or audited forecasts. Translation does not automatically change cash.

## 5. Multinational research

Optional `globalExposure` fields extend both existing company model shapes. One sourced example, GLW, appears in both `/research/companies/glw` and `/watchlist/glw`. Bar charts and a table show regional sales and shares; profile fields show unavailable when unverified. Other dossiers do not display an irrelevant empty module.

Source: [Corning 2025 Form 10-K, Note 18](https://www.sec.gov/Archives/edgar/data/24741/000002474126000124/glw-20251231.htm). Geographic sales use the disclosed segment basis, with its separate reconciliation to consolidated GAAP sales. Customer geography is not treated as invoicing-currency exposure. Period, source, units, reporting currency, and verification date are visible.

## 6. Global Capital Flow Map

The existing Compute theme gains optional geography nodes covering the United States, Taiwan, South Korea, Japan, European markets, and global infrastructure. Each node contains region, industry, bottleneck, and capital need; the U.S. node links to existing Corning research. A six-node diagram renders inside the existing theme. These are explicitly conceptual diligence questions, not measured trade flows or a claim of investment attractiveness.

## 7. Global FP&A

Northstar Technologies is a fictional case with United States/USD, Germany/EUR, Mexico/MXN, and Japan/JPY. Local inputs retain revenue, expenses, headcount, CapEx, budgets, actuals, prior revenue, and period-average rate assumptions. Deterministic calculations consolidate USD revenue and operating profit, reconcile operations and FX to budget variance, calculate reported and constant-currency growth, and show cost, headcount, margin, and CapEx variances.

Charts cover regional actual versus budget, variance attribution, operating profit, CapEx, and next-quarter revenue forecasts. Commentary uses calculated values only. The next-quarter forecast supports common local growth and foreign-currency shocks; it is explicitly a revenue-only scenario. Full source inputs are inspectable and downloadable as a fictional CSV.

## 8. Casebook

Four records: Treasury, Global FP&A, Global Equity Research, and Capital Flow. Each includes discipline, problem, data, analysis, financial model, findings, limitations, tools actually used, artifact link, and status. Cross-Border Investment and Project Finance are labeled planned, without fabricated completed artifacts.

## 9. Recruiter connection

A small secondary Global Finance proof section links to Treasury, FP&A, the existing Capital Flow Map, and Casebook. The existing professional profile layout and claims remain intact.

## 10. Database

No database or migration changes. Research and fictional cases use repository-owned typed data, consistent with existing content architecture. Supabase service-role and auth boundaries were not changed.

## 11. APIs / providers

Existing FMP market, financial-statement, SEC-filing, and economic-indicator adapters remain intact. Inspection found no dedicated recorded FX or FRED adapter. New typed FX and global-dataset interfaces prepare a centralized extension boundary; the current FX adapter explicitly returns unavailable. No live-data capability is claimed and no API secrets are added to browser code.

## 12. Files created

- `src/app/research/global-finance/layout.tsx`
- `src/app/research/global-finance/page.tsx`
- `src/app/research/global-finance/treasury/page.tsx`
- `src/app/research/global-finance/fpa/page.tsx`
- `src/app/research/global-finance/casebook/page.tsx`
- `src/components/global-finance/global-finance.module.css`
- `src/components/global-finance/visuals.tsx`
- `src/components/global-finance/treasury-lab.tsx`
- `src/components/global-finance/fpa-case.tsx`
- `src/components/global-finance/company-exposure.tsx`
- `src/components/global-finance/global-value-chain.tsx`
- `src/data/global-finance/northstar.ts`
- `src/data/global-finance/exposure.ts`
- `src/data/global-finance/casebook.ts`
- `src/lib/global-finance/models.ts`
- `src/lib/global-finance/providers.ts`
- `tests/global-finance.test.mjs`
- `e2e/global-finance.spec.ts`
- `docs/global-finance-implementation.md`

## 13. Files modified

- `src/app/recruiter/page.tsx`
- `src/app/research/page.tsx`
- `src/app/research/companies/[ticker]/page.tsx`
- `src/app/sitemap.ts`
- `src/components/research-ui.tsx`
- `src/components/capital-flow-map.tsx`
- `src/components/research/company-research-page.tsx`
- `src/data/research/capital-flows.ts`
- `src/data/research/research-companies.ts`
- `src/data/research/research-types.ts`
- `src/lib/research-content.ts`

Pre-existing edits in `src/data/setora-updates.json` and the untracked `New project 3/` directory were preserved. Duplicate generated `.next/types/* 2.ts` files were moved to a temporary backup to resolve pre-existing type conflicts; no source files were removed.

## 14. Validation

- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm test`: 168 passed, including 10 new financial/data tests.
- `npm run build`: passed, including all four new routes.
- New Playwright suite: 12 passed (four flows at desktop 1440px, tablet 1024px, and mobile 390px in Chromium).
- Browser tests verify navigation, disclosures, no horizontal page overflow, model input changes, missing FX, validation errors, keyboard controls, CSV download, company sources, both GLW renderers, capital-flow geography, and recruiter links. Page-error capture passed across the new routes.
- Agent-browser visual review of the production preview; no reported page errors.
- `git diff --check`: passed.

Unit tests independently verify currency preservation, FX pair/date rejection, missing quotes, translation/interest/cash formulas, natural hedges, consolidation, variance reconciliation, growth, invalid periods, source-basis geography, global theme nodes, and casebook completeness. No full legacy browser-suite run or exhaustive WCAG audit is claimed. Existing unit tests all pass.

## 15. Limitations

One dated sourced company exposure record; unverified fields remain unavailable. No recorded FX feed, real-time global-market expansion, measured trade datasets, hedge book, tax model, cash-by-country feed, debt-maturity engine, or complete repatriation model. The FP&A forecast is revenue-only and excludes intercompany eliminations and seasonality. Models are educational and transient, with no saved user assumptions. Global value-chain geography remains a labeled framework pending primary-source review.

## 16. Deferred work

Phase 2: cross-border acquisition model, deeper regional market view, trade and investment-flow analysis. Phase 3: project finance with deterministic DSCR/NPV/IRR, international datasets, advanced treasury, and more case studies. Later-phase disciplines appear only as clearly marked planned scope on the overview/casebook.

## 17. Recommended next build

Connect a dated FX provider through the adapter interface, then add verified currency and regional exposure for a second multinational. This strengthens the existing Treasury and company workflows before adding another model. Follow with the scoped Phase 2 acquisition case.
