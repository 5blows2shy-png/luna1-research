# Luna1 Research Site Audit

Audit date: 2026-07-14  
Scope: all App Router pages, dynamic research/commentary routes, public assets, contact API, shared components, responsive styles, automated tests, production build, dependency audit, and a production-mode Lighthouse run.

## Executive summary

The audited site has no known broken internal navigation routes, missing image alt attributes, TypeScript errors, lint errors, failing unit tests, failing Playwright tests, or production-build failures after the safe fixes in this audit. The production Lighthouse baseline measured **94 Performance, 96 Accessibility, 96 Best Practices, and 100 SEO** before the final local-only analytics and footer-contrast corrections; those two findings were then fixed and revalidated through lint, type-check, tests, Playwright, and the production build.

Two issues require follow-up outside a code-only audit: production-grade distributed rate limiting for the public form, and verification/removal of sensitive data from repository history. Route-specific metadata and client-bundle decomposition are also recommended.

## Critical

### C-01 — Private contact details existed in a tracked PDF-generation script

- Area: Sensitive information / security
- Evidence: the audit baseline of `scripts/create_resume.py` contained a personal phone number and email address. A separate, pre-existing worktree change removed them while this audit was in progress.
- Impact: anyone with repository access—and potentially anyone with access to repository history—could retrieve the values even after the current file is corrected.
- Status: **Remediated in the current worktree outside this audit PR; repository history remains to be assessed.**
- Required follow-up: confirm the replacement file is intentionally committed, rotate or retire exposed contact channels if necessary, and use an approved history-rewrite process only if the repository owner determines the data must be purged from Git history.

## High

### H-01 — Contact-form rate limiting is process-local and trusts forwarding headers

- Area: Security / abuse prevention / API
- Evidence: `src/app/api/contact/route.ts` stores attempts in an in-memory `Map` and keys requests from `x-forwarded-for`.
- Impact: limits reset on cold starts, do not coordinate across serverless instances, and can be bypassed where the forwarding header is not normalized by trusted infrastructure. This can permit form spam and email-provider cost abuse.
- Status: **Open; infrastructure-dependent.** The safe code fix adds JSON content-type enforcement, normalized input, `Retry-After`, schema limits, and server-only secrets.
- Required follow-up: move counters to a managed distributed store or edge rate-limit service; derive identity only from the hosting platform’s trusted request metadata; add bot protection and observability without collecting unnecessary personal data.

## Medium

### M-01 — Route-specific titles, descriptions, and canonical URLs are incomplete

- Area: SEO / metadata
- Evidence: the root layout provides complete site-level Open Graph, Twitter, robots, viewport, and application metadata, but most routes inherit the generic title and description. A global canonical was intentionally not used because that would incorrectly canonicalize every page to the home page.
- Impact: search results and social previews are less specific, and duplicate-content signals are weaker than they should be.
- Status: **Partially fixed.** Added `robots.txt`, XML sitemap entries for static and dynamic content, image dimensions/alt metadata, explicit viewport metadata, and index/follow defaults.
- Recommended fix: add route-level `metadata` or `generateMetadata`, including self-canonicals and dynamic research/commentary titles.

### M-02 — Shared client module increases JavaScript shipped to static pages

- Area: Performance / architecture / duplicate components
- Evidence: `src/components/site.tsx` is a client module containing the navbar plus interactive scorecard and DCF calculator. Lighthouse reported about 28 KB of unused JavaScript on the home-page trace.
- Impact: unnecessary parsing and execution on pages that only need static headings/footer content; measured production TBT was 170 ms and LCP 2.7 s.
- Status: **Partially fixed.** Removed the dead duplicate `ContactForm`. Remaining decomposition is safe but broader than a targeted audit patch.
- Recommended fix: split static `Footer`, `PageHeader`, `SectionHeading`, and `Score` into server-compatible modules; isolate navbar, scorecard, and calculators in small client entry points; dynamically load chart-heavy dashboard code where appropriate.

### M-03 — Dependency audit reports a transitive PostCSS advisory through Next.js

- Area: Dependency security
- Evidence: `npm audit --omit=dev` reports two moderate entries representing one advisory chain: `next` → bundled `postcss` (`GHSA-qx2v-qp2m-jg93`). The suggested automated resolution incorrectly proposes a major downgrade to Next 9.3.3.
- Impact: the advisory concerns unsafe CSS stringification. Exploitability is reduced because the application does not generate CSS from user-controlled input, but the dependency remains flagged.
- Status: **Open; no safe automated fix available in the current dependency graph.**
- Recommended fix: update Next.js when an upstream release carries a patched PostCSS version; do not accept user-supplied CSS; re-run the audit after upgrading.

### M-04 — Mobile navigation lacked full disclosure semantics and Escape behavior

- Area: Accessibility / mobile UX
- Evidence: menu control lacked `aria-controls`; the menu could not be dismissed with Escape; active styling on nested mobile routes was inconsistent.
- Impact: keyboard and assistive-technology users received weaker state/context cues.
- Status: **Fixed.** Added control association, Escape-to-close with focus return, nested-route active state, and link-driven close behavior.

### M-05 — Theme preference was not persisted

- Area: Dark mode consistency
- Evidence: the theme always initialized dark and reset on navigation/reload.
- Impact: user preference was lost and UI controls could disagree with the preferred color scheme.
- Status: **Fixed.** Theme now follows stored/system preference, persists changes, updates `color-scheme`, and exposes an explicit accessible state.

## Low

### L-01 — Placeholder credential links were broken links

- Area: Broken links / accessibility
- Evidence: certification cards used `href="#"` for unavailable credentials.
- Impact: links navigated to the top of the same page and falsely implied an available destination.
- Status: **Fixed.** Replaced with honest non-interactive “Credential link pending” text.

### L-02 — No skip link or consistent visible focus treatment

- Area: Accessibility
- Evidence: keyboard users had to traverse the full global navigation and several controls relied on browser-default focus styling.
- Impact: slower keyboard navigation and reduced focus visibility.
- Status: **Fixed.** Added a main-content skip link, focus target, and high-contrast `:focus-visible` outlines.

### L-03 — Footer brand link failed small-text contrast

- Area: Accessibility / dark mode
- Evidence: production Lighthouse measured a 4.17:1 ratio for 9 px “Brand Assets” text due to opacity.
- Impact: below the WCAG AA 4.5:1 threshold for normal text.
- Status: **Fixed.** Removed the reduced-opacity presentation.

### L-04 — Motion did not fully honor reduced-motion preferences

- Area: Accessibility
- Evidence: the existing media rule disabled transitions but did not comprehensively constrain animation timing or smooth scrolling.
- Impact: avoidable motion for users requesting reduced motion.
- Status: **Fixed.** Added reduced animation duration/iterations and disabled smooth scrolling.

### L-05 — Brand cards could overflow under mobile emulation

- Area: Mobile responsiveness
- Evidence: Playwright exposed a mobile card width outside the expected content boundary.
- Impact: possible horizontal overflow on narrow/emulated viewports.
- Status: **Fixed.** Cards now have a constrained mobile width and centered layout; Playwright verifies that the card remains within the viewport.

### L-06 — Security response headers were incomplete

- Area: Security hardening
- Evidence: no application-level CSP, clickjacking, MIME-sniffing, referrer, or permissions policy was configured.
- Impact: reduced defense in depth.
- Status: **Fixed.** Added CSP, `frame-ancestors`, `X-Frame-Options`, `X-Content-Type-Options`, strict referrer policy, permissions policy, and disabled the framework signature header. CSP should be regression-tested whenever a new third-party integration is added.

### L-07 — Local production runs logged analytics 404/MIME errors

- Area: Console errors / developer experience
- Evidence: Vercel Analytics and Speed Insights attempted to load `/_vercel/*` scripts outside Vercel.
- Impact: noisy local console and lower local Lighthouse Best Practices score; deployed Vercel behavior was not implicated.
- Status: **Fixed.** Analytics components now render only when the Vercel runtime marker is present.

### L-08 — Structured-data serialization lacked defensive escaping

- Area: Security / SEO
- Evidence: JSON-LD used raw `JSON.stringify` inside `dangerouslySetInnerHTML`.
- Impact: current schema is static and repository-owned, so exploitability was not present, but future dynamic values could create an HTML break-out risk.
- Status: **Fixed.** Less-than characters are escaped before embedding.

### L-09 — Sitemap and crawler policy were missing

- Area: SEO
- Evidence: no App Router sitemap or robots metadata routes existed.
- Impact: weaker discovery and no explicit API exclusion guidance.
- Status: **Fixed.** Added static/dynamic sitemap URLs and a robots policy that excludes `/api/`.

## Verified clean areas

- Alt text: every rendered `next/image` instance has meaningful alt text; decorative Luna marks are hidden from assistive technology.
- API exposure: Supabase service-role and Resend credentials are read only from server-side environment variables; no `NEXT_PUBLIC_` secret usage was found.
- TypeScript: strict type-check passes with no warnings or errors.
- Broken internal routes/assets: Playwright loaded primary routes and verified all eight downloadable brand assets.
- Financial disclaimer: preserved globally.
- Market data: illustrative/placeholders remain explicitly labeled; no claim of real-time data was introduced.
- Brokerage behavior: no trading execution functionality exists.

## Validation results

- `npm run lint` — pass
- `npm run type-check` — pass
- `npm test` — 15/15 pass
- `npm run test:e2e` — 6/6 pass (desktop and mobile)
- `npm run build` — pass; production compilation and TypeScript validation completed
- `npm audit --omit=dev` — 0 critical, 0 high, 2 moderate entries in one Next/PostCSS advisory chain
- Production Lighthouse (mobile, home page) — Performance 94, Accessibility 96, Best Practices 96, SEO 100; FCP 0.8 s, LCP 2.7 s, TBT 170 ms, CLS 0

## Audit limitations

- Lighthouse is a laboratory run on local production output; field Core Web Vitals should be reviewed in Vercel after deployment.
- External LinkedIn availability and third-party uptime are outside repository control.
- No production Supabase, Resend, DNS, CDN, or Vercel dashboard access was used, so infrastructure configuration and live delivery were not mutated.
- Repository-history removal of sensitive values requires owner approval and coordination because it rewrites shared Git history.
