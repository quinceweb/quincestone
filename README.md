# Quincestone

**Intelligence between interaction and action.**

Quincestone is edge intelligence infrastructure for modern business websites and applications. It combines edge experience, controlled AI, business knowledge, intelligent qualification, workflow routing, human escalation, and operational visibility.

- Builder: Quinceweb
- Domain: [quincestone.com](https://quincestone.com)
- Public email: [hello@quincestone.com](mailto:hello@quincestone.com)
- Stack: React, TypeScript, Vite, React Router, Tailwind CSS, React Hook Form, Zod, Supabase, Vitest

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Supabase is optional for local rendering. If its public URL and anon key are absent, forms fail safely and direct the visitor to email; they never present a false success state.

## Commands

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run check
```

## Architecture

The public application uses route-level splitting for the two demonstration surfaces. Form schemas are client-validated with React Hook Form and Zod, then sent through a typed submission service. The public operations demo reads local fictional fixtures only. SQL migrations enable RLS and protect public submission writes behind a validated server-side boundary.

See [`docs/architecture.md`](docs/architecture.md), [`docs/database.md`](docs/database.md), and [`docs/production-checklist.md`](docs/production-checklist.md).

## Deployment

`vercel.json` rewrites application routes to `index.html`. Configure only the public Supabase URL and anon key in the browser environment. Never place a Supabase service-role key in a `VITE_` variable.

## Calendar production boundary

The calendar frontend and four Supabase Edge Functions are implemented in the production candidate. The browser persists a submission first, then requests free/busy slots and an idempotent booking. Google OAuth credentials and the Supabase service role remain server-only. Public demo routes remain deterministic and fixture-only.

**Runtime truth:** the Edge Functions are deployed in Supabase, but Google Calendar end-to-end connectivity still requires final health/booking/cancellation verification. Do not describe live scheduling as verified until those tests pass.

## Payments

The marketing site contains a Stripe-hosted checkout boundary for the one-time Edge Assessment. The intended Stripe price is $49 USD. The hosted checkout destination must be configured as `VITE_PAYMENT_URL` before the payment flow is considered production-ready.

## Demo boundary

Northstone Roofing is fictional. Public demo routes use demonstration data only and never create real appointments, payments, subscriptions, customers, or production operational records.
