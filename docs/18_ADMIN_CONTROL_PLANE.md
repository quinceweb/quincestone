# P18 — Admin Control Plane

## Purpose

Establish a distinct Quincestone platform-administration application. The control plane governs Quincestone itself; it does not operate as a customer workspace and does not inherit workspace-admin privileges.

## Authority boundary

- Customer workspace roles remain `owner`, `admin`, and `member`.
- A workspace role is never sufficient for platform administration.
- Platform authority is represented independently by `platform_admins`.
- `admin` may govern the platform; `operator` is reserved for operational workflows and cannot be treated as a platform administrator.
- Platform membership is checked server-side through private authority functions; the browser never receives the platform-admin table as a readable data source.
- No service-role key, administrator seed identity, or client-side authorization flag belongs in the browser.
- When platform authority is unavailable, the admin surface fails closed and exposes no privileged tenant data or actions.

## Initial surface

`apps/admin` establishes the application boundary and a non-privileged control-plane shell for:

- organizations and tenant lifecycle;
- users and platform access;
- runtime/provider operations;
- audit and governance.

The authority schema is now established, but no administrator is seeded. Privileged CRUD and intervention endpoints remain blocked until a trusted server request identity is wired to the authority functions and durable audit events.

## Release gate

P18 is complete only when:

1. an independent administrator identity/role model exists;
2. every privileged route performs a server-side authority check;
3. platform audit events are durable and tamper-resistant within the application's trust model;
4. customer workspace RLS remains unchanged and is not bypassed by browser clients;
5. preview verification proves unauthorized users receive no privileged data;
6. production verification is performed against the exact released commit.
