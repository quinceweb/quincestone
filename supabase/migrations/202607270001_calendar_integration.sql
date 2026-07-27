create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.calendar_integrations (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'google-calendar' check (provider in ('google-calendar')),
  calendar_id text not null check (char_length(calendar_id) between 1 and 320),
  display_name text not null check (char_length(display_name) between 1 and 120),
  is_active boolean not null default true,
  timezone text not null default 'America/New_York' check (char_length(timezone) between 1 and 80),
  booking_window_days integer not null default 30 check (booking_window_days between 1 and 90),
  minimum_notice_minutes integer not null default 240 check (minimum_notice_minutes between 0 and 10080),
  slot_duration_minutes integer not null default 30 check (slot_duration_minutes between 15 and 240),
  buffer_before_minutes integer not null default 10 check (buffer_before_minutes between 0 and 120),
  buffer_after_minutes integer not null default 10 check (buffer_after_minutes between 0 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('assessment','implementation','demo','contact','manual')),
  source_record_id uuid,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  company_name text check (company_name is null or char_length(company_name) <= 120),
  appointment_type text not null check (char_length(appointment_type) between 2 and 80),
  requested_date date not null,
  requested_start_time timestamptz not null,
  requested_end_time timestamptz not null,
  timezone text not null check (char_length(timezone) between 1 and 80),
  calendar_event_id text,
  calendar_event_url text,
  calendar_status text not null default 'pending' check (calendar_status in ('pending','created','failed','cancelled','rescheduled')),
  booking_status text not null default 'requested' check (booking_status in ('requested','confirmed','cancelled','completed','no_show')),
  notes text check (notes is null or char_length(notes) <= 1000),
  source text not null default 'website' check (char_length(source) between 1 and 50),
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 200),
  cancellation_token_hash text unique,
  cancellation_token_expires_at timestamptz,
  cancellation_token_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requested_end_time > requested_start_time)
);

create index if not exists appointment_requests_source_idx on public.appointment_requests(source_type, source_record_id);
create index if not exists appointment_requests_start_idx on public.appointment_requests(requested_start_time);
create index if not exists appointment_requests_status_idx on public.appointment_requests(booking_status, calendar_status);

create table if not exists public.integration_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (char_length(provider) between 1 and 40),
  event_type text not null check (char_length(event_type) between 1 and 80),
  source_type text check (source_type is null or char_length(source_type) <= 40),
  source_record_id uuid,
  status text not null check (status in ('started','succeeded','failed','retrying')),
  request_id text check (request_id is null or char_length(request_id) <= 200),
  error_code text check (error_code is null or char_length(error_code) <= 80),
  error_message_safe text check (error_message_safe is null or char_length(error_message_safe) <= 300),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists integration_events_source_idx on public.integration_events(source_type, source_record_id);
create index if not exists integration_events_created_idx on public.integration_events(created_at desc);

alter table public.calendar_integrations enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.integration_events enable row level security;

-- No anonymous policies are created for these operational tables. All access is through
-- trusted Supabase Edge Functions using the service role. Existing public submission
-- tables retain their controlled insert-only policies.

create trigger calendar_integrations_set_updated_at
before update on public.calendar_integrations
for each row execute function public.set_updated_at();

create trigger appointment_requests_set_updated_at
before update on public.appointment_requests
for each row execute function public.set_updated_at();
