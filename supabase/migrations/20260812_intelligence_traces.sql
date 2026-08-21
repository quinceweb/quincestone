create table if not exists public.intelligence_traces (
  id uuid primary key default gen_random_uuid(),
  trace_id text not null unique,
  mode text not null check (mode = 'demo'),
  tenant_key text not null check (tenant_key = 'northstone-roofing-demo'),
  intent jsonb not null default '{}'::jsonb,
  qualification jsonb not null default '{}'::jsonb,
  policy jsonb not null default '{}'::jsonb,
  workflow jsonb not null default '{}'::jsonb,
  escalation jsonb not null default '{}'::jsonb,
  outcome jsonb not null default '{}'::jsonb,
  status text not null check (status in ('completed','failed')),
  duration_ms integer not null check (duration_ms >= 0),
  created_at timestamptz not null default now()
);

alter table public.intelligence_traces enable row level security;
revoke all on public.intelligence_traces from anon, authenticated;

create index if not exists intelligence_traces_created_at_idx
  on public.intelligence_traces (created_at desc);
create index if not exists intelligence_traces_tenant_idx
  on public.intelligence_traces (tenant_key, created_at desc);
