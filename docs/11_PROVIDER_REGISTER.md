# Quincestone — Provider Register

| Provider | Role | Current authority/status |
|---|---|---|
| GitHub | Source control | Canonical repository and `main` production source authority |
| Vercel | Application deployment | `webquincestone` and `quincestone-app` projects exist; current deployment verification is blocked by the provider's Hobby daily deployment limit |
| Supabase | Database, storage, Edge Functions | Current production backend authority |
| Supabase Auth | Identity | Current production identity authority |
| Clerk | Future identity | Migration direction; not current runtime authority |
| Stripe | Payments/billing | Connected sandbox account verified; no production billing state claimed |
| Resend | Transactional email | `send.quincestone.com` verified with sending enabled; production application flows are not yet claimed as fully integrated |
| Alibaba | Sourcing/manufacturing network | Operational sourcing relationship, not a software runtime integration |

Provider status is maintained from direct inspection. Account existence, configuration, deployment, runtime verification, and production readiness are separate states.
