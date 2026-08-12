import { z } from "zod";

export const IntelligenceModeSchema = z.literal("demo");
export const IntentSchema = z.object({ primary: z.string(), confidence: z.number().min(0).max(1), urgency: z.enum(["low", "normal", "high", "emergency"]), entities: z.record(z.string()), ambiguity: z.array(z.string()), clarificationRequired: z.boolean() });
export const ContextSchema = z.object({ serviceLocation: z.string().nullable(), serviceAreaEligible: z.boolean().nullable(), urgency: z.string(), propertyType: z.string().nullable(), damageType: z.string().nullable(), timeline: z.string().nullable(), contactReady: z.boolean(), schedulingIntent: z.boolean(), businessHours: z.string() });
export const QualificationSchema = z.object({ status: z.enum(["qualified", "partially_qualified", "not_qualified", "needs_clarification"]), reasonCodes: z.array(z.string()), nextRequiredInformation: z.array(z.string()) });
export const KnowledgeSchema = z.object({ tenant: z.literal("northstone-roofing-demo"), version: z.string(), matches: z.array(z.object({ id: z.string(), title: z.string(), fact: z.string() })) });
export const PolicySchema = z.object({ decisions: z.array(z.object({ id: z.string(), result: z.enum(["allow", "constrain", "require_review"]), explanation: z.string(), constraint: z.string().nullable() })) });
export const WorkflowSchema = z.object({ name: z.enum(["request-more-information", "priority-human-review", "inspection-intake", "estimate-intake", "unsupported-service", "out-of-area", "general-information", "scheduling-preview"]) });
export const EscalationSchema = z.object({ required: z.boolean(), reason: z.string().nullable(), priority: z.enum(["low", "normal", "high", "urgent"]), safeNextAction: z.string() });
export const OutcomeSchema = z.object({ status: z.enum(["ready_for_review", "needs_information", "informational", "blocked"]), summary: z.string() });
export const IntelligenceTraceSchema = z.object({ traceId: z.string(), mode: IntelligenceModeSchema, tenant: z.literal("northstone-roofing-demo"), input: z.object({ message: z.string() }), intent: IntentSchema, context: ContextSchema, qualification: QualificationSchema, knowledge: KnowledgeSchema, policy: PolicySchema, workflow: WorkflowSchema, escalation: EscalationSchema, outcome: OutcomeSchema, timing: z.object({ totalMs: z.number(), stagesMs: z.record(z.number()) }) });
export type IntelligenceTrace = z.infer<typeof IntelligenceTraceSchema>;
