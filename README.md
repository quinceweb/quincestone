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

The public application uses route-level splitting for the two demonstration surfaces. Form schemas are client-validated with React Hook Form and Zod, then sent through a typed submission service. The public operations demo reads local fictional fixtures only. SQL migrations enable RLS and grant anonymous insert—but no anonymous read, update, or delete—on public lead forms.

See [`docs/architecture.md`](docs/architecture.md), [`docs/database.md`](docs/database.md), and [`docs/production-checklist.md`](docs/production-checklist.md).

## Deployment

`vercel.json` rewrites application routes to `index.html`. Configure only the public Supabase URL and anon key in the browser environment. Never place a Supabase service-role key in a `VITE_` variable.

External Supabase, Turnstile, edge API, booking, payment, and messaging integrations remain configuration-dependent and are not claimed as complete.

## Production calendar boundary
Live scheduling is centralized in `src/services/calendar.ts` and four Supabase Edge Functions. The browser persists a submission first, then requests free/busy slots and an idempotent booking; public demo routes remain fixture-only. Google OAuth refresh credentials and service-role access are server-only. See [Google Calendar setup](docs/google-calendar.md). The external connection remains configuration-dependent until the documented production verification succeeds.
