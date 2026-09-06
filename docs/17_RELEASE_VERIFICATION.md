# Quincestone — P17 Release Verification

**Verification date:** 2026-09-06
**Production source authority:** `main`
**Current main commit at verification:** `d7bc10b511f269761a6e5664a5b6fb9a3979c857`

## Verified

- GitHub repository is active and `main` remains the production source authority.
- P14 PR #73 merged into `main`.
- P15 PR #74 merged into `main`.
- P16 PR #75 merged into `main`.
- Vercel project `webquincestone` exists and the canonical production domains are configured on the project.
- Current Vercel production deployment is `dpl_DEJgvy24TUcJuSvJSCedeAcs2yuX`, state `READY`, target `production`.
- Production deployment directly returns HTTP 200 for `https://www.quincestone.com/`.
- Production demo route request returns HTTP 200 for `/demo/experience`.
- Vercel reports no runtime error clusters in the inspected 24-hour production window.

## Not yet verified / blocked

### Production source parity

The current production deployment points to main commit `d572ddfc960bcd4f211012f10c762f220c27732c`, while current `main` is `d7bc10b511f269761a6e5664a5b6fb9a3979c857`. Therefore production is **not verified as running the current main source**.

A new production deployment/promotion for the current main commit is required before release can be called fully current.

### CI quality run

P15 added `.github/workflows/quality.yml`, but the GitHub connector currently reports no workflow run for the inspected P15/P16 main commits. The workflow exists in source; a passing CI run is not claimed.

### Supabase/Auth

Supabase runtime state and the P10 security boundary were previously verified. Supabase Auth leaked-password protection remains an external dashboard configuration item and is not marked fixed here.

### Billing

Stripe is connected in live mode. No new live financial mutation was performed as part of P17. Payment verification must remain provider-authoritative; this release record does not claim a fresh live checkout transaction.

### Resend

The sending domain was previously verified. No new transactional email delivery test was performed during this release gate.

## Release decision

**Repository release work: merged.**

**Production release gate: BLOCKED pending production deployment parity and a fresh verification of the current main commit.**

Do not label Quincestone fully production-verified until those blockers are cleared.