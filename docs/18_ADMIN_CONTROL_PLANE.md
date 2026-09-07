# P18 — Admin Control Plane

## Purpose

Establish a distinct Quincestone platform-administration application. The control plane governs Quincestone itself; it does not operate as a customer workspace and does not inherit workspace-admin privileges.

## Authority boundary

- Customer workspace roles remain `owner`, `admin`, and `member`.
- A workspace role is never sufficient for platform administration or commerce operations.
- Platform authority is represented independently by `platform_admins`.
- `admin` may govern the platform; `operator` is reserved for operational workflows.
- Platform membership is checked server-side through private authority functions.
- No service-role key, administrator seed identity, supplier credential or client-side authorization flag belongs in the browser.
- When platform authority is unavailable, the admin surface fails closed and exposes no privileged tenant or commerce data.

## Commerce operations

The admin surface now includes `/commerce`, a server-rendered operational console for:

- product inventory and lifecycle;
- product QA and launch gates;
- order counts and order authority;
- fulfillment queues;
- return queues;
- supplier-fulfillment operating boundaries.

The console derives state from the commerce schema and requires platform operator authority before loading privileged records.

## Product launch gate

A product cannot be published merely because an operator edits its status. Database enforcement requires sourcing verification, exact SKU, approved sample, quality/functional/packaging pass, media rights, economics, shipping terms, returns/warranty, price, content and final decision readiness plus an active priced variant.

## Release state

The P18 platform authority model is implemented and deployed in Supabase. The initial administrator remains intentionally unseeded until explicit bootstrap approval. This is a security boundary, not a missing feature.

Commerce infrastructure is additive and preserves the existing workspace, Edge, human-review and event boundaries.
