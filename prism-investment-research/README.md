# Luna1 Research

Luna1 Research is Shyheim Lee's institutional-quality educational investment research website. It separates a stock price into the business, institutional, technical, valuation, and risk forces producing it.

## Local development

```bash
npm install
npm run dev
```

Quality checks: `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.

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
