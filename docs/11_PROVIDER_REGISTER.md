# Quincestone — Provider Register

| Provider | Role | Current authority/status |
|---|---|---|
| GitHub | Source control | Canonical repository and `main` production source authority |
| Vercel | Application deployment | `webquincestone` and `quincestone-app` projects exist; exact deployment verification is commit-specific |
| Supabase | Database, storage, Edge Functions | Current production backend authority |
| Supabase Auth | Identity | Current production identity authority |
| Clerk | Future identity | Migration direction; not current runtime authority |
| Stripe | Payments/billing | Existing account/configuration must be inspected before describing live products or prices |
| Resend | Transactional email | Provider boundary; production sending state must be inspected before claiming readiness |
| Alibaba | Sourcing/manufacturing network | Operational sourcing relationship, not a software runtime integration |

Provider status must be updated from direct inspection rather than assumptions.
