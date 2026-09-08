# Project rules

- Preserve the professional institutional-investment design.
- Use strict TypeScript and prefer server components where appropriate.
- Use client components only for interactivity.
- Keep components reusable and avoid unnecessary dependencies.
- Make every page mobile responsive.
- Use accessible heading structure, form labels, keyboard behavior, and color contrast.
- Never expose API keys, secrets, or private contact details in browser-side code.
- Sanitize MDX and user input; treat only repository-owned MDX as trusted content.
- Protect admin routes and keep Supabase service-role access server-side.
- Rate-limit public forms and do not implement brokerage trading.
- Run lint, type-check, tests, and the production build before delivery.
- Do not modify portfolio-performance calculations without adding or updating tests.
- Never fabricate real-time market data; label placeholders clearly.
- Add source fields to research content before publishing sourced analysis.
- Preserve the financial disclaimer across the site.
- Do not publish investment recommendations as personalized financial advice.
- Do not add Deal Lab, Python Lab, or Real Estate sections, routes, navigation items, homepage previews, or promotional modules unless the user explicitly requests one of them in a future instruction. Mistake Journal belongs under Portfolio and must not be promoted as a separate top-level product section.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
