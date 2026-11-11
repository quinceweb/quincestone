# QPAI 1.2 — Shared Analytics Adapter Contract

**Status:** Proposed TypeScript contract; implementation not started  
**Repository baseline:** `6e1f9615f747788c318e7d5d098e374e4d9dbce5`

## 1. Purpose

Define one vendor-neutral contract used by Quincestone applications to submit approved product events. Statsig is an implementation behind the contract, not a dependency that product components should call directly.

The inspected monorepo has shared packages for configuration, intelligence, types, and UI, but no existing analytics package or Statsig dependency was found. The proposed shared package location is `packages/analytics`, subject to final implementation review.

## 2. Package boundary

Proposed package: `@quincestone/analytics`

Responsibilities:
- Event name and product/environment types.
- Runtime validation and metadata allowlists.
- Consent-aware initialization.
- Client event logging.
- Stable route-key mapping.
- Provider-neutral interface.
- Statsig client implementation behind an adapter.
- Safe no-op behavior when analytics is disabled or unavailable.

Out of scope:
- Supabase authorization or identity ownership.
- Business state changes.
- Payment, deal, workflow, or action execution.
- Durable business-event persistence.
- Admin audit logging.
- Session Replay and automatic DOM capture.
- Server secret storage.

The package must not import Supabase service-role clients or contain provider credentials.

## 3. Proposed public contract

Illustrative interface only; exact code is subject to package implementation and type-checking:

```ts
export type QpaiProduct =
  | "corporate"
  | "business_os"
  | "shop"
  | "deals"
  | "account"
  | "admin";

export type QpaiEnvironment =
  | "development"
  | "staging"
  | "production";

export type QpaiEvent = {
  name: string;
  schemaVersion: 1;
  product: QpaiProduct;
  environment: QpaiEnvironment;
  source: "client" | "server";
  eventId: string;
  routeKey?: string;
  metadata: Record<string, string | number | boolean>;
};

export interface QpaiAnalytics {
  initialize(context: {
    consentGranted: boolean;
    environment: QpaiEnvironment;
    userId?: string; // pseudonymous only
  }): Promise<void>;
  track(event: QpaiEvent): void;
  setUser(userId: string | null): Promise<void>;
  flush(): Promise<void>;
  shutdown(): Promise<void>;
}
```

The implementation should prefer typed event builders over accepting arbitrary `Record<string, unknown>` from product code. The example is a design contract, not an instruction to trust caller-provided identity, product, source, or environment values.

## 4. Validation

Before forwarding:
1. Verify event name exists in the approved registry.
2. Verify event namespace matches the calling product.
3. Verify environment is supplied by trusted application configuration.
4. Verify `source` matches the actual emitter.
5. Verify schema version is supported.
6. Validate metadata against the event-specific allowlist.
7. Reject forbidden keys, raw IDs, free text, URLs, and arbitrary nested objects.
8. Bound string lengths, numeric ranges, and property counts.
9. Require consent for analytics collection where applicable.
10. Reject events if validation fails; do not silently forward partial unknown payloads.

Do not rely solely on regex redaction. Use explicit event schemas and allowlists.

## 5. Client adapter behavior

- Initialize only after the consent policy permits analytics.
- Use `@statsig/js-client` with a public client key appropriate to the current environment.
- Initialize with a pseudonymous `userID` when available; never use raw Auth UUID or direct identifiers.
- Use asynchronous initialization without blocking critical page rendering.
- Route all product event calls through the adapter.
- Do not install `@statsig/web-analytics` or `@statsig/session-replay` in the initial pilot.
- Do not pass full URLs, referrers, form values, click targets, copied text, or arbitrary DOM metadata.
- Never call `logEvent` directly from product components.
- If Statsig is unavailable, product functionality continues and event failures are safely dropped or queued within bounded local limits.
- Never retry indefinitely or block user actions waiting for an analytics flush.

## 6. Server-authoritative event delivery

Client SDKs must not emit trusted business outcomes.

For events such as workspace creation, payment success, human decision, action execution, deal agreement, and workflow completion:
- Derive the event from the committed canonical state transition.
- Keep Supabase or the provider record as the authority.
- Do not invoke external analytics from a database trigger.
- Do not make a Statsig API call part of the transaction's success path.
- Use a durable post-commit delivery mechanism with retries, idempotency, and dead-letter visibility.

The repository already contains `public.events`, `public.integration_events`, and `public.deal_events`. Their current semantics must be evaluated before reuse. No existing Statsig delivery outbox was confirmed in the audit. A dedicated outbox or equivalent durable relay mechanism is a future design decision and must not be introduced without a separate migration review.

A server relay must:
- Select only approved event types.
- Map source records to the event dictionary.
- Strip prohibited data.
- Use a server secret only in trusted runtime.
- Reuse a stable delivery ID on retry.
- Record delivery outcome and retry state without altering source business state.
- Never expose a Statsig secret to the browser.
- Continue to preserve successful business state if Statsig is down.

## 7. Identity contract

The adapter accepts only a pseudonymous identity supplied by a trusted identity adapter. It does not derive IDs from email, raw Supabase UUID, phone, or profile attributes.

Identity changes must call the SDK's supported user-update method after consent and session transitions. On sign-out, clear the current analytics identity and do not attribute subsequent anonymous activity to the prior account.

Cross-product identity reuse requires explicit privacy approval. The first implementation may use product-scoped pseudonyms to avoid cross-product joining.

## 8. Feature gate contract

Feature gates may control optional product presentation and staged release only.

- Never use Statsig to authorize a user, workspace, role, payment, approval, or provider action.
- Enforce all consequential decisions in trusted Quincestone server/database logic.
- Unknown gate results use a documented safe fallback.
- A new optional feature may default off; an existing customer-critical path must retain its established behavior if Statsig is unavailable.
- Gate names must be registered, owned, described, and have a retirement date.
- Every gate requires a rollback plan.
- Record gate exposure only when the relevant feature is actually used, not merely because a page loaded.

## 9. Error and performance behavior

- Analytics initialization is non-blocking.
- Track calls are bounded and non-blocking.
- SDK/network failures never break rendering, checkout, authentication, workflow execution, or any consequential operation.
- Avoid synchronous network calls.
- Bound queue size and retry count.
- Do not log event payloads or identity values to console.
- Provide internal diagnostics using safe error codes and aggregate counters only.
- Avoid double initialization in React Strict Mode, Next.js route transitions, and Vite hot reload.
- Avoid duplicate page-view events on hydration and client navigation.

## 10. Testing contract

Required automated tests:
- Approved event passes schema validation.
- Unknown event name is rejected.
- Wrong product namespace is rejected.
- Forbidden metadata key is rejected.
- Direct identifiers and URLs are rejected.
- No consent means no initialization and no events.
- Analytics unavailable does not block application behavior.
- Client cannot emit server-only event.
- Duplicate event ID is deduplicated by relay.
- Retry preserves event identity.
- Environment mismatch is rejected.
- Feature gate unavailable uses safe fallback.
- Logout clears identity.
- Next.js and Vite route changes do not double-count.

## 11. Package integration order

The repository uses pnpm workspaces and Turbo. Proposed integration order:
1. Add package contract, schemas, tests, and mock provider.
2. Verify package checks in isolation.
3. Add Statsig client implementation and key injection.
4. Integrate one pilot app at a time.
5. Add trusted server event relay only after outbox design and security review.
6. Validate staging payloads and privacy behavior.
7. Approve production rollout separately.

No dependency or application package should be changed as part of this specification milestone.
