# Quincestone — Identity and Access

## Current authority

Supabase Auth is the current production identity authority.

Workspace authorization is derived from the authenticated principal and server-side membership state. Browser-supplied workspace IDs and roles are never treated as proof of access.

## Workspace roles

Workspace membership controls customer-facing application access. Owner/admin/member capabilities must remain explicitly enforced by server-side authorization and database RLS.

## Internal administration

Quincestone platform-admin authority is a separate boundary from ordinary workspace membership. A workspace owner is not automatically a Quincestone administrator.

## Clerk direction

Clerk is the canonical long-term identity direction but is not a production authority until a controlled migration establishes provider-subject mapping, organization membership synchronization, redirect configuration, webhook behavior, and production cutover/rollback procedures.

Do not run a dual-authority identity model accidentally.
