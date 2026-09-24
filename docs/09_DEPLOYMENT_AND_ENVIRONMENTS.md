# Quincestone — Deployment and Environments

## Edge installation release

Deploy the database migration before the gateway and updated authenticated function. Deploy `edge-channel-gateway` with platform JWT verification disabled because it performs its own installation/origin gate; keep `edge-workspace` JWT verification enabled. Configure the Business OS with the verified asset and gateway URLs, then test one marked installation from an approved and an unapproved origin. Disable or revoke the installation to stop new public intake. Do not reuse a production installation for preview.

**Authority:** current deployment evidence

**Inspected:** 2026-09-24 against `main` source `dc91a3548498bb1760104064e62c83b681646fbb`

## Vercel projects

Five projects are **CONNECTED** to `quinceweb/quincestone` in the inspected Vercel team. No standalone Shop project exists yet. Provider state and repository configuration are reported separately; a repository contract is not deployment proof.

| Project | App boundary | Framework | Repository configuration | Domains reported by Vercel | Latest production attempt | Latest READY production |
|---|---|---|---|---|---|---|
| `webquincestone` | `apps/web` | Vite | root expected `apps/web`; output `dist` | includes the current Corporate domains and the legacy Shop attachment | **READY**, exact inspected `main` SHA | `8d10dc36eab4e207c2db1026ba9435ba43cb7ac2` |
| `Quincestone Shop` | `apps/shop` | Next.js 16.3.1 | root `apps/shop`; Vercel defaults for pnpm install and Next build; framework output unset | target `shop.quincestone.com` | **NOT CREATED** | None |
| `quincestone-account` | `apps/account` | Next.js | app `vercel.json`: root-relative frozen install, filtered build, `.next` | Vercel aliases only; no custom domain reported | **CANCELED**, exact inspected `main` SHA | `b7f616a09606d29789180d2962ed1c78ef9d974c` |
| `quincestone-app` | `apps/app` | Next.js | app `vercel.json`: root-relative frozen install, filtered build, `.next` | Vercel aliases only; no custom domain reported | **CANCELED**, exact inspected `main` SHA | `b7f616a09606d29789180d2962ed1c78ef9d974c` |
| `quincestone-admin` | `apps/admin` | Next.js | app `vercel.json` added by this reconciliation: root-relative frozen install, filtered build, `.next` | Vercel aliases only; no custom domain reported | **CANCELED**, exact inspected `main` SHA | None found in the 20 deployments inspected |
| `quincestone-deals` | `apps/deals` | Next.js | app `vercel.json`: root-relative frozen install, filtered build, `.next` | Vercel aliases only; no `QuincestoneDeal.app` domain reported | **CANCELED**, exact inspected `main` SHA | `b7f616a09606d29789180d2962ed1c78ef9d974c` |

All projects reported Node `24.x`. Project IDs are intentionally omitted because names are sufficient for operations and avoid turning volatile provider identifiers into architecture.

## Deployment conclusions

- Corporate Web is **DEPLOYED** at the inspected `main` SHA and Vercel reports production **READY**. Direct production journey verification is separate.
- Standalone Shop is repository-ready only after its branch checks pass. It has no Vercel project, preview, or production deployment in this snapshot.
- Standalone Shop's Next.js artifact is `apps/shop/.next`; this is a framework build artifact, not a Vercel Output Directory setting. Leave Output Directory unset for the Vercel Next.js preset.
- Account, Business OS and Deals have older **READY** production artifacts, but the latest exact-`main` production attempts are **CANCELED**. They are not verified current.
- Admin is **CONFIGURED** as a Vercel project, but no READY production artifact was found in the inspected window.
- The documentation PR's first Admin preview exposed a stale Vercel `dist` output setting. The branch adds an app-local Next.js `vercel.json`; verification remains pending until a new preview is READY.
- Do not detach `shop.quincestone.com` from `webquincestone` until a standalone Shop preview has the correct environment contract and its routes, APIs, canonical metadata, checkout return, mobile behavior and accessibility are verified. The final domain move must be one intentional cutover with a rollback target.
- `account.quincestone.com`, `app.quincestone.com`, `admin.quincestone.com` and `QuincestoneDeal.app` remain canonical domain contracts; their attachment state must be rechecked at release time.
- A canceled deployment is not a diagnosed build failure. Build logs were not inspected, so no cause is claimed.

## Environment and release rules

Browser-safe variables must remain separate from service-role, Stripe, Resend, OAuth, provider and webhook secrets. The root `pnpm-lock.yaml` is dependency authority.

A deployment is verified only when the exact commit, target, status and intended domain journey are directly checked. Preview READY does not imply production; an older production artifact does not verify newer source.

See [12_RELEASE_PROCESS.md](12_RELEASE_PROCESS.md) for the release gate and [00_COMPANY_ARCHITECTURE.md](00_COMPANY_ARCHITECTURE.md) for domain ownership.
