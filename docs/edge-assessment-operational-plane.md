# Edge Assessment operational plane

## Experience architecture

`/assessment` remains the canonical route, but it is rendered by `AssessmentLayout`, not the corporate or Shop shell. The route has restrained Edge chrome, no marketing navigation and no corporate footer. The intro establishes purpose, information use and the human-authority boundary before collection begins. The workspace then presents one focused input with contextual intent and an operational model state.

QVS 2.0 remains authoritative through `packages/config/src/brand.css`. Assessment styling consumes the canonical dark surfaces, type, spacing, state, control and motion tokens. Press, selection and focus feedback use the 120/180/260ms token timings and are removed when reduced motion is requested.

## Submission contract

The dedicated `submit_edge_assessment(payload, idempotency_key)` RPC is the only canonical Edge Assessment intake path:

1. The client validates the active response and normalizes identity fields.
2. A versioned browser draft and stable UUID idempotency key are kept in session storage.
3. The RPC validates the payload again, derives the immutable reference and initial lifecycle state, and persists one record.
4. A retry with the same key returns the original reference instead of inserting another record.
5. The client enters `RECEIVED` only when the RPC returns the persisted server reference. Timeouts and errors preserve the draft and expose retry.

The canonical record reuses `assessment_requests`. Identity remains in its existing columns; full answers and attribution are in `assessment_payload`; preliminary browser scoring is in `assessment_report`; review notes, reviewer and review timestamps remain server/operator controlled. `reference`, `assessment_version`, `idempotency_key`, `human_review_required` and `updated_at` make the existing table usable as the origin record without creating a competing assessment table.

Browser-derived score, flags and priority are preliminary signals only. The browser cannot supply record status, reviewer identity, review notes, approval or a final recommendation.

## Status lifecycle and authority

The initial persisted state is `received`. The supported operational lifecycle is:

`received → triage → human_review → needs_context | recommendation_ready → closed`

`in_review`, `changes_requested`, `approved` and `rejected` remain accepted for compatibility with the existing Admin decision workflow. Future conversion states should be added only alongside the opportunity/workspace authority they represent.

Only authenticated platform operators can read assessment records or invoke the existing audited review decision RPC. Public submission grants no operator authority. Admin reads the structured payload/report directly and falls back to legacy message JSON only for older records.

## Post-submission operating flow

After confirmed persistence, the user sees the reference and truthful stage states: receipt is complete; normalization/review are pending or queued; recommendation and communication are not started. An operator can inspect identity, company/site, answers, preliminary flags and score, policy constraints, desired outcome, status and time, then request context, progress discovery/implementation/commerce/business-system work, or decline/close the record. If work begins, the assessment should remain the origin reference for later opportunity, proposal or workspace records.

## Notifications and privacy truth

Assessment persistence does not depend on email. No production-ready customer acknowledgement or operator-notification path was found in the repository assessment flow, so notifications are **DEFERRED**. When connected, notification failure must never roll back a persisted assessment; messages must use the server reference and must not promise an unverified response time.

The UI says responses are submitted directly to Quincestone for review. It does not claim encryption, retention periods, deletion guarantees or completed review. Those claims require separately verified operational controls and policy.

## Future integration points

- a server-owned triage transition and queue assignment;
- optional non-blocking Resend acknowledgement and operator notice;
- explicit `needs_context`, recommendation and close actions in Admin;
- opportunity/proposal/workspace linkage using the assessment ID as origin;
- retention and deletion policy once legally and operationally approved.
