# Prism Investment Research

Prism is Shy Lee's personal investment research website. It separates a stock price into the business, institutional, technical, valuation, and risk forces producing it.

## Local development

```bash
npm install
npm run dev
```

Quality checks: `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.

## Structure

- `src/app/` - App Router pages and the demonstration contact endpoint
- `src/components/` - shared navigation, footer, score, form, and calculators
- `src/lib/data.ts` - typed navigation, research, and commentary content
- `docs/` - editing, deployment, and integration guides
- `public/` - social preview and downloadable resume

All seeded securities, scores, prices, allocations, and model outputs are illustrative placeholders. Prism does not provide personalized investment advice.
