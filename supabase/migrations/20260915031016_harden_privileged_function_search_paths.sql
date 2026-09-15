-- Fix the search path of privileged and trigger functions without changing
-- their bodies, grants, ownership, or runtime authorization behavior.
alter function public.decide_assessment_review(uuid, text, text, jsonb)
  set search_path = '';

alter function public.set_operational_alerts_updated_at()
  set search_path = '';
