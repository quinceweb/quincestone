export type DealStatus = "draft" | "proposed" | "negotiating" | "internal_review" | "awaiting_approval" | "ready_for_agreement" | "agreed" | "execution_ready" | "in_progress" | "completed" | "declined" | "withdrawn" | "expired" | "cancelled";
export type Visibility = "internal" | "shared";
export type TermState = "agreed" | "open" | "changed" | "blocked" | "requires_approval" | "not_specified";
export type TermKind = "price" | "quantity" | "delivery" | "payment" | "warranty" | "volume" | "service" | "cancellation" | "expiration" | "custom";
export type OfferStatus = "active" | "acceptable_pending_approval" | "rejected" | "withdrawn" | "expired" | "superseded";
export interface Party { id: string; name: string; role: string; organization?: string; visibility?: Visibility }
export interface DealTerm { id: string; kind: TermKind; label: string; value?: string; previousValue?: string; proposedBy?: string; state: TermState; updatedAt?: string }
export interface Offer { id: string; version: number; status: OfferStatus; currency: string; value?: number; quantity?: number; terms: DealTerm[]; createdAt: string; createdBy: string }
export interface Decision { id: string; title: string; requestedBy: string; decisionMaker?: string; state: "requested" | "approved" | "declined"; reason?: string; timestamp?: string; relatedOfferId?: string; relatedTermId?: string; visibility: Visibility }
export interface DealEvent { id: string; type: string; actor: string; at: string; summary: string; from?: string; to?: string; visibility: Visibility }
export interface Deal { id: string; title: string; type?: string; status: DealStatus; creatorId?: string; owner?: Party; organization?: string; counterparties: Party[]; participants: Party[]; currency: string; value?: number; quantity?: number; scope?: string; offers: Offer[]; terms: DealTerm[]; conditions: string[]; milestones: string[]; dependencies: string[]; expiresAt?: string; deliveryExpectation?: string; paymentExpectation?: string; approvals: Decision[]; risks: string[]; events: DealEvent[]; outcome?: string; createdAt: string; updatedAt: string }

export const dealLifecycle: DealStatus[] = ["draft","proposed","negotiating","internal_review","awaiting_approval","ready_for_agreement","agreed","execution_ready","in_progress","completed","declined","withdrawn","expired","cancelled"];

export function executionReadiness(deal: Deal) {
  const requiredTerms = deal.terms.filter((term) => term.state !== "not_specified");
  return [
    { label: "Required terms agreed", complete: requiredTerms.length > 0 && requiredTerms.every((term) => term.state === "agreed") },
    { label: "Required approvals complete", complete: deal.approvals.length === 0 || deal.approvals.every((approval) => approval.state === "approved") },
    { label: "Counterparty confirmed", complete: false, note: "No verified counterparty confirmation source connected." },
    { label: "Payment setup confirmed", complete: false, note: "Payment not connected." },
    { label: "Delivery requirements confirmed", complete: Boolean(deal.deliveryExpectation) },
  ];
}
