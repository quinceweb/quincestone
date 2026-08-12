export type ContactReason = "request-assessment" | "discuss-implementation" | "platform-integration" | "media" | "general" | "technical" | "legal-privacy";
export const isContactSchedulingEligible = (reason: ContactReason) => ["request-assessment", "discuss-implementation", "platform-integration"].includes(reason);
