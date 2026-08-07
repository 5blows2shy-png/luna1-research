# Luna1 Research

Luna1 Research is Shyheim Lee's institutional-quality educational investment research website. It separates a stock price into the business, institutional, technical, valuation, and risk forces producing it.

## Product scope

The permanent public platform consists of Home, Research, Portfolio, About, Recruiter View, and Contact. Portfolio contains Overview, Active Positions, Watchlist, Long-Term Compounders, Conviction Dashboard, Mistake Journal, and Performance. Mistake Journal is a Portfolio capability, not a separate top-level product.

Deal Lab, Python Lab, and Real Estate are intentionally outside the product scope and must not be reintroduced unless explicitly requested by the user in a future instruction.

## Local development

```bash
npm install
npm run dev
```

Quality checks: `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.

Luna1 uses Next.js 16, so linting runs through the ESLint CLI. The legacy `next lint` command was removed in Next.js 16.

Browser checks use `npm run test:e2e` after Playwright browsers are available.

## Integrations

Copy `.env.example` to `.env.local` and configure server-side values only. Supabase is reserved for report metadata, private drafts, subscribers, and admin sessions. Resend is reserved for contact/newsletter delivery. Sentry credentials must remain server-side. The site runs safely in demonstration mode when these values are absent.

Never prefix service-role, Resend, Sentry, or admin secrets with `NEXT_PUBLIC_`.

## Structure

- `src/app/` - App Router pages and the demonstration contact endpoint
- `src/components/` - shared navigation, footer, score, form, and calculators
- `src/lib/data.ts` - typed navigation, research, and commentary content
- `docs/` - editing, deployment, and integration guides
- `public/` - social preview and downloadable resume

All seeded securities, scores, prices, allocations, and model outputs are illustrative placeholders. Luna1 Research does not provide personalized investment advice or brokerage trading.

## Vercel deployment

The Next.js application lives at the repository root. In Vercel, set **Root Directory** to `.` (the repository root), keep the detected framework as **Next.js**, and leave **Output Directory** unset. Vercel should run `npm run build`; Next.js will produce `.next/` automatically.
