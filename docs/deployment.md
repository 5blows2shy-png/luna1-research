# Vercel deployment guide

Luna1 Research is a standard Next.js App Router application located at the repository root.

## Vercel project settings

- Framework Preset: `Next.js`
- Root Directory: `.`
- Build Command: `npm run build` (or leave at the detected default)
- Install Command: `npm install` (or leave at the detected default)
- Output Directory: leave unset

Do not configure `.next` manually as the Output Directory. Next.js creates and manages that directory during `next build`, and Vercel's Next.js integration detects it automatically.

## Pre-deployment verification

```bash
npm install
npm run lint
npm run type-check
npm test
npm run build
test -d .next
```

The site runs in demonstration mode without external credentials. Supabase, Resend, Sentry, and admin credentials must be configured as server-side Vercel environment variables when those services are enabled. Never expose service-role or API secrets with a `NEXT_PUBLIC_` prefix.
