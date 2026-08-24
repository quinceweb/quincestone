# Quincestone — Deployment and Environments

## Applications

- `apps/web` → `quincestone.com` and `shop.quincestone.com`
- `apps/app` → `app.quincestone.com`
- `apps/admin` → `admin.quincestone.com`
- `apps/api` → `api.quincestone.com`

Only applications that actually exist and build should receive a Vercel project.

## Verification rule

A deployment is verified only for the exact commit that was built and directly checked. A previous successful preview does not verify a later commit.

Distinguish preview from production and deployment existence from domain/runtime behavior.

## Current repository reality

The current main source tree contains `apps/web` and `apps/app`. The additional canonical boundaries are documented target architecture until their applications exist with real functionality.

## Environment

Keep browser-safe variables separate from server/provider secrets. Environment examples document only variables genuinely consumed by the application.
