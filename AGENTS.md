# Quincestone repository instructions

- Treat `quinceweb/quincestone` as the only canonical repository and `main` as the production source authority.
- Preserve the four application boundaries: `apps/web`, `apps/app`, `apps/admin`, and `apps/api`.
- Position Quincestone as a commerce and operating-systems company. Edge is a named product, not the whole company.
- Keep `shop.quincestone.com` as a host-aware public surface of `apps/web`; do not create a fifth app without evidence that it is necessary.
- Preserve truthful state. Never claim an integration, deployment, domain, payment, index, customer, metric, or provider connection exists unless inspected and verified.
- Keep public demonstrations fictional and deterministic. Never expose real submissions as demo operations or evidence.
- Keep privileged credentials server-side. Never expose Supabase service-role, Stripe secret, Resend, Google, webhook, or other provider secrets to browser code.
- Internal Quincestone admin authority is separate from workspace membership. Do not infer platform-admin privileges from user-controlled workspace roles.
- Preserve working Supabase Edge Functions and Next.js server boundaries. Do not duplicate services merely to match an architecture diagram.
- Run the repository quality gate before publishing changes: `pnpm check`.
- Do not merge release work around a required deployment verification gate. If Vercel is rate-limited, mark deployment verification as pending and continue only independent work.
