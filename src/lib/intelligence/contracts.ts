import { z } from "zod";

export const IntelligenceTraceSchema = z.object({
  traceId: z.string(),
  mode: z.literal("demo"),
  tenant: z.literal("northstone-roofing-demo"),
  input: z.object({ message: z.string() }),
  intent: z.object({ primary: z.string(), confidence: z.number().min(0).max(1), urgency: z.string(), entities: z.record(z.string()), ambiguity: z.array(z.string()), clarificationRequired: z.boolean() }),
  context: z.object({ serviceLocation: z.string().nullable(), serviceAreaEligible: z.boolean().nullable(), urgency: z.string(), propertyType: z.string().nullable(), damageType: z.string().nullable(), timeline: z.string().nullable(), contactReady: z.boolean(), schedulingIntent: z.boolean(), businessHours: z.string() }),
  qualification: z.object({ status: z.string(), reasonCodes: z.array(z.string()), nextRequiredInformation: z.array(z.string()) }),
  knowledge: z.object({ tenant: z.literal("northstone-roofing-demo"), version: z.string(), matches: z.array(z.object({ id: z.string(), title: z.string(), fact: z.string() })) }),
  policy: z.object({ decisions: z.array(z.object({ id: z.string(), result: z.string(), explanation: z.string(), constraint: z.string().nullable() })) }),
  workflow: z.object({ name: z.string() }),
  escalation: z.object({ required: z.boolean(), reason: z.string().nullable(), priority: z.string(), safeNextAction: z.string() }),
  outcome: z.object({ status: z.string(), summary: z.string() }),
  timing: z.object({ total: z.number(), ["intent"]: z.number(), ["context"]: z.number(), ["qualification"]: z.number(), ["knowledge"]: z.number(), ["policy"]: z.number(), ["workflow"]: z.number(), ["escalation"]: z.number(), ["outcome"]: z.number() }),
});
export type IntelligenceTrace = z.infer<typeof IntelligenceTraceSchema>;
