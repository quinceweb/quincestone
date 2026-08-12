import { supabase } from "../supabase";
import { IntelligenceTraceSchema, type IntelligenceTrace } from "./contracts";

export async function runDemoIntelligence(message: string): Promise<IntelligenceTrace> {
  if (!supabase) throw new Error("The intelligence runtime is not configured.");
  const { data, error } = await supabase.functions.invoke("edge-intelligence", { body: { mode: "demo", tenant: "northstone-roofing-demo", message } });
  if (error) throw new Error("The intelligence runtime is temporarily unavailable.");
  const parsed = IntelligenceTraceSchema.safeParse(data?.trace);
  if (!parsed.success) throw new Error("The intelligence runtime returned an invalid trace.");
  return parsed.data;
}

export function rememberDemoTrace(trace: IntelligenceTrace) {
  const existing = JSON.parse(sessionStorage.getItem("quincestone-demo-traces") ?? "[]") as IntelligenceTrace[];
  const next = [trace, ...existing.filter((item) => item.traceId !== trace.traceId)].slice(0, 20);
  sessionStorage.setItem("quincestone-demo-traces", JSON.stringify(next));
}

export function readDemoTraces(): IntelligenceTrace[] {
  try { return JSON.parse(sessionStorage.getItem("quincestone-demo-traces") ?? "[]") as IntelligenceTrace[]; } catch { return []; }
}
