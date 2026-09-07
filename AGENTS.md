# Quincestone repository instructions

- Treat `quinceweb/quincestone` as the only canonical repository and `main` as the production source authority.
- Preserve the application boundaries: `apps/web`, `apps/app`, and `apps/admin`; add `apps/api` only when a stable separate service boundary is genuinely required.
- Position Quincestone as a commerce and product-development company. Edge is reusable governed intelligence infrastructure, not the whole company.
- Keep `shop.quincestone.com` as a host-aware public commerce surface of `apps/web`; do not create a fifth frontend without evidence that it is necessary.
- Preserve truthful state. Never claim a product, supplier, specification, inventory, review, discount, delivery promise, media right, payment, customer, metric, domain, index, integration or provider connection exists unless inspected and verified.
- Commerce browser code is never authoritative for price, discount, payment, order, refund, fulfillment, supplier cost, inventory or admin permissions. Recalculate and verify commercially sensitive state server-side.
- Product publication is a controlled state transition. Research candidates must remain private until every required launch gate passes; never seed fake product media, reviews, stock, pricing or shipping claims.
- Keep supplier costs, supplier mappings, QA evidence and internal product operations out of public catalog responses.
- Stripe is the payment authority. Redirects are not payment proof. Checkout must be server-created and payment state must be reconciled from signed provider events with idempotency.
- Supplier-direct fulfillment is a validation mechanism, not the public identity. V1 supplier purchasing requires human approval; never auto-place a supplier order merely because a customer paid.
- Preserve existing Quincestone Edge, workspace, event, human-review, calendar and onboarding boundaries. Do not replace working infrastructure merely to match a diagram.
- Keep privileged credentials server-side. Never expose Supabase service-role, Stripe secret/webhook, Resend, OAuth, supplier or other provider secrets to browser code.
- Internal Quincestone admin/commerce authority is separate from workspace membership. Do not infer platform-admin or operations privileges from user-controlled workspace roles.
- Public demonstrations remain fictional and deterministic. Never expose real submissions as demo evidence.
- Run the repository quality gate before publishing changes: `pnpm check`.
- Use focused feature branches and pull requests for substantive changes. Review diffs and verify production against the exact released commit before declaring a release complete.
