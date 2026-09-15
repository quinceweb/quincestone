# Quincestone — Provider Register

**Inspected:** 2026-09-15

| Provider | Governed role | Current status and evidence |
|---|---|---|
| GitHub | Source authority | **CONNECTED / VERIFIED**: `quinceweb/quincestone`; remote `main` inspected at the recorded SHA |
| Vercel | Project deployment and domain delivery | **CONNECTED / CONFIGURED**: five projects inspected; only Web was READY at current `main`; see [deployment evidence](09_DEPLOYMENT_AND_ENVIRONMENTS.md) |
| Supabase | Auth, PostgreSQL, RLS, RPCs and Edge Functions | **CONNECTED / DEPLOYED**: exact Quincestone project inspected; migration-source mismatch is **BLOCKED** |
| Stripe | PaymentProvider | **CONNECTED** in live mode: one active “Quincestone Edge Assessment” product and one USD 49 one-time price; no webhook endpoints returned. No successful production payment was inspected |
| Resend | Email delivery provider | **CONNECTED / CONFIGURED**: `send.quincestone.com` verified for sending; `shopmail.quincestone.com` failed verification; no templates or webhooks returned. Delivery is **NOT VERIFIED** |
| Shopify | CommerceProvider / downstream projection where used | Projection tables and RPC boundary **DEPLOYED** in Supabase; provider connection, catalog sync and order authority **NOT VERIFIED** |
| Google | CalendarProvider / business capability | Calendar Edge Functions **DEPLOYED**; provider configuration and successful execution **NOT VERIFIED** |
| Colibrì | Replaceable IntelligenceProvider below Edge | **PLANNED / NOT INSPECTED**; no product, policy or authority ownership |
| Ever Gauzy | Optional BusinessProvider below ActionExecution | **PLANNED / NOT INSPECTED**; no connection, deployment or production readiness claimed |
| Artemis | Independent verification plane | **PLANNED / DEFERRED**; never runtime product authority |

Provider capability never transfers Quincestone identity, policy, authorization, workflow or UX ownership. Account existence, configuration, connection, deployment, runtime verification and production readiness are separate states.
