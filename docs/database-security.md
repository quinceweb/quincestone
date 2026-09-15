# Database security

These controls apply across the one canonical `quincestone` Supabase backend. Product sharing never implies cross-product privilege: public, authenticated, trusted-server, and independently authorized Admin boundaries remain distinct as specified in [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md).

Anonymous visitors may insert valid rows into the three lead tables. They cannot select, update, or delete rows. Demo tables grant no anonymous privileges.

Client validation is a usability layer, not a security boundary. Production should add server-side rate limiting, bot verification, abuse monitoring, retention policy, and controlled staff-only read access.

Public applications use publishable credentials only. Secret/service-role credentials bypass RLS and therefore remain restricted to trusted server runtimes that validate identity, authorization, input, and idempotency before consequential mutations.

Calendar tables deliberately have no public policies: anonymous SELECT, INSERT, UPDATE, and DELETE are denied. Public scheduling passes through origin-aware, validated Edge Functions. Submission tables use a protected security-definer submission boundary and do not grant public reads. Cancellation uses a hashed, expiring, one-time token; raw Google event identifiers remain in the protected appointment record.

## Privileged function boundary

ActionExecution lifecycle RPCs (`claim_action_execution`,
`complete_action_execution`, and `fail_action_execution`) are service-role
only. Their private implementations and public wrappers use a fixed empty
`search_path`. The deployed `execute-action` Edge Function verifies JWTs and
uses server-held provider credentials; no secret is stored in repository SQL.

`decide_human_review` is security-invoker and checks authenticated workspace
administrator authority. `decide_assessment_review` is security-definer because
it crosses the internal operator boundary, but it checks the authenticated actor
with `private.is_platform_operator`, denies public/anonymous execution, records
a platform audit event, and now uses an empty `search_path`.

QDE mutation RPCs are security-invoker functions. Anonymous and PUBLIC execution
is revoked. Deal ownership/participation and the assigned decision maker remain
database-enforced boundaries.
