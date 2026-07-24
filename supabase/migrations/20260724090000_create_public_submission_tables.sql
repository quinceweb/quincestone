create extension if not exists pgcrypto;

create table if not exists public.assessment_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text not null default '' check (char_length(company) <= 120),
  website text not null default '' check (char_length(website) <= 300),
  message text not null check (char_length(message) between 10 and 2000),
  company_site text not null default '' check (company_site = ''),
  created_at timestamptz not null default now()
);

create table if not exists public.implementation_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text not null default '' check (char_length(company) <= 120),
  website text not null default '' check (char_length(website) <= 300),
  message text not null check (char_length(message) between 10 and 2000),
  company_site text not null default '' check (company_site = ''),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text not null default '' check (char_length(company) <= 120),
  website text not null default '' check (char_length(website) <= 300),
  message text not null check (char_length(message) between 10 and 2000),
  company_site text not null default '' check (company_site = ''),
  created_at timestamptz not null default now()
);

create table if not exists public.demo_interactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  created_at timestamptz not null default now()
);

create table if not exists public.demo_events (
  id uuid primary key default gen_random_uuid(),
  interaction_id uuid not null references public.demo_interactions(id) on delete cascade,
  event_type text not null check (char_length(event_type) between 1 and 80),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now()
);

alter table public.assessment_requests enable row level security;
alter table public.implementation_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.demo_interactions enable row level security;
alter table public.demo_events enable row level security;

revoke all on public.assessment_requests, public.implementation_applications, public.contact_messages, public.demo_interactions, public.demo_events from anon, authenticated;
grant insert on public.assessment_requests, public.implementation_applications, public.contact_messages to anon;

create policy "anonymous assessment insert" on public.assessment_requests for insert to anon with check (company_site = '');
create policy "anonymous application insert" on public.implementation_applications for insert to anon with check (company_site = '');
create policy "anonymous contact insert" on public.contact_messages for insert to anon with check (company_site = '');

comment on table public.demo_interactions is 'Reserved for a future protected demo runtime. The public operations demo uses local fixtures only.';
comment on table public.demo_events is 'Reserved for a future protected demo runtime. No anonymous privileges are granted.';
