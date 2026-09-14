# Quincestone Open Code Review Policy

Open Code Review is advisory only. It must never auto-merge or mutate protected branches.

## Identity
- Never trust a client-provided `user_id`.
- Never expose a Supabase `service_role` secret to client code, logs, build output, or public environment variables.
- Protected Account routes require a verified server-side session.

## Authorization
- Individual account records require ownership checks against the authenticated user.
- Business records require workspace membership and remain outside Account.
- Admin authority and control-plane records remain isolated from Account and Business surfaces.

## Redirects
- Cross-domain return destinations must use an explicit allowlist.
- Never redirect to an arbitrary user-supplied URL or origin.

## Commerce truth
- No fake stock, order status, prices, saved products, reviews, fulfillment, returns, or support history.
- Unavailable/unpublished saved products remain visible with their current verified state once persistence exists.

## Payments
- Never store raw card numbers, CVV/CVC, full magnetic-stripe data, or PIN data.
- Store provider references only when a payment integration is intentionally connected.

## Truthfulness
- UNKNOWN remains UNKNOWN.
- ESTIMATED is explicitly labeled.
- VERIFIED requires evidence from the canonical system of record.

## Review focus
Prioritize authentication, authorization, IDOR, unsafe redirects, cross-domain boundaries, service-role exposure, secret leakage, fake commerce data, business-data leakage, and admin-data leakage.
