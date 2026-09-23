# Quincestone repository instructions

These rules apply repository-wide. More specific application instructions may add constraints but may not contradict the [canonical ecosystem architecture](docs/00_COMPANY_ARCHITECTURE.md).

## Product boundaries

- Treat `quinceweb/quincestone` and remote `main` as source authority. Source existence is not deployment evidence.
- Preserve `apps/web`, `apps/shop`, `apps/account`, `apps/app`, `apps/deals` and `apps/admin` as separate responsibility boundaries.
- `apps/web` owns only institutional `quincestone.com`; `apps/shop` owns product discovery and fixed-price commerce at `shop.quincestone.com`.
- Quincestone Account owns individual identity and relationship. It never grants business or platform authority by itself.
- Shop delegates authentication and durable customer relationship experiences to Account through allowlisted return destinations. Never accept an arbitrary return URL.
- Quincestone Business OS owns authorized business workspaces. Server-authoritative membership follows authentication.
- Quincestone Deals / QDE owns negotiated commerce and is a peer of Shop, not a Business OS module.
- Quincestone Admin is an internal control plane. Ordinary identity or workspace membership never implies platform-operator authority.
- Quincestone Core owns governed intelligence/execution primitives. Edge recommends and routes; it does not become consequential authority.
- Artemis independently verifies Layers 2–6; it is not runtime product authority.
- Colibrì and Ever Gauzy are replaceable providers below governed interfaces. Neither owns Quincestone UX, policy or authorization.

## Authority and truth

- Enforce the [One Quincestone Backend](docs/03_ONE_QUINCESTONE_BACKEND.md) boundary: one canonical Supabase project named `quincestone`, one Auth authority, one migration history, and one canonical record per real-world entity.
- Never create a product-specific Supabase project or database without an approved architecture decision record. Never apply Quincestone migrations to Neptlium or any project whose exact name was not verified as `quincestone`.
- Keep browser access publishable-key and RLS constrained. Secret/service-role credentials and consequential mutations belong only in authorized server boundaries.
- Use only **IMPLEMENTED**, **CONFIGURED**, **DEPLOYED**, **CONNECTED**, **VERIFIED**, **PLANNED**, **DEFERRED**, **BLOCKED** and **SUPERSEDED** as defined in the canonical architecture.
- Never infer persistence from frontend success, payment from a redirect, production from a preview, or authorization from browser-supplied roles/IDs.
- Never fabricate products, suppliers, inventory, reviews, metrics, transactions, customers, integrations, outcomes or verification.
- Keep privileged credentials and supplier/internal evidence server-side. Never commit or print secrets.
- Enforce price, payment, agreement, workspace, review and action state at server/database boundaries.
- Consequential workflows require explicit policy, sufficient authority, idempotency, audit evidence and Human Review where required.

## Engineering workflow

Follow: **inspect reality → define authority → model state → implement vertically → verify evidence → document truth → release safely → learn from outcomes**.

For significant work:

1. Fetch and inspect remote `main`, the worktree, open PRs and relevant runtime state.
2. Identify the owning surface, trusted authority and complete state/failure model.
3. Implement the smallest complete vertical slice; do not stop at UI-only success.
4. Test static, behavior, accessibility, integration and runtime boundaries.
5. Run `pnpm check`; record exact environmental blockers and safe equivalents if it cannot execute.
6. Use a focused branch and PR. Do not contaminate unrelated active PRs or force-push shared history.
7. Verify the exact preview SHA, required CI, merged `main` SHA and production domain separately.
8. Record blockers and deferred work without upgrading their status.

The root lockfile is the only dependency authority. Preserve repository conventions and working boundaries unless inspected evidence supports a focused improvement.
