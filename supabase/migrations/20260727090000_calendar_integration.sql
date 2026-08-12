-- Production calendar records. Public callers can only use validated Edge Functions.
alter table public.contact_messages add column if not exists contact_reason text check (contact_reason in ('request-assessment','discuss-implementation','platform-integration','media','general','technical','legal-privacy'));
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;

create table if not exists public.calendar_integrations (
 id uuid primary key default gen_random_uuid(), provider text not null default 'google' check (provider = 'google'),
 calendar_id text not null check (char_length(calendar_id) between 1 and 500), display_name text not null default 'Quincestone appointments' check (char_length(display_name) <= 120),
 is_active boolean not null default true, timezone text not null default 'America/New_York' check (char_length(timezone) between 1 and 100),
 booking_window_days integer not null default 30 check (booking_window_days between 1 and 90), minimum_notice_minutes integer not null default 240 check (minimum_notice_minutes between 0 and 10080),
 slot_duration_minutes integer not null default 30 check (slot_duration_minutes between 15 and 240), buffer_before_minutes integer not null default 10 check (buffer_before_minutes between 0 and 120), buffer_after_minutes integer not null default 10 check (buffer_after_minutes between 0 and 120),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.appointment_requests (
 id uuid primary key default gen_random_uuid(), source_type text not null check (source_type in ('assessment','implementation','demo','contact','manual')), source_record_id uuid,
 full_name text not null check (char_length(full_name) between 2 and 100), email text not null check (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'), phone text not null default '' check (char_length(phone) <= 40), company_name text not null default '' check (char_length(company_name) <= 120), appointment_type text not null check (char_length(appointment_type) between 1 and 80),
 requested_date date not null, requested_start_time timestamptz not null, requested_end_time timestamptz not null check (requested_end_time > requested_start_time), timezone text not null check (char_length(timezone) between 1 and 100),
 calendar_event_id text, calendar_event_url text, calendar_status text not null default 'pending' check (calendar_status in ('pending','created','failed','cancelled','rescheduled')), booking_status text not null default 'requested' check (booking_status in ('requested','confirmed','cancelled','completed','no_show')),
 notes text not null default '' check (char_length(notes) <= 1000), source text not null default 'website' check (char_length(source) <= 80), idempotency_key uuid not null unique,
 cancellation_token_hash text unique, cancellation_expires_at timestamptz, cancellation_used_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists appointment_requests_start_idx on public.appointment_requests(requested_start_time);
create index if not exists appointment_requests_source_idx on public.appointment_requests(source_type, source_record_id);
create table if not exists public.integration_events (
 id uuid primary key default gen_random_uuid(), provider text not null check (char_length(provider) <= 40), event_type text not null check (char_length(event_type) <= 80), source_type text check (char_length(source_type) <= 40), source_record_id uuid, status text not null check (status in ('started','succeeded','failed')), request_id text check (char_length(request_id) <= 100), error_code text check (char_length(error_code) <= 80), error_message_safe text check (char_length(error_message_safe) <= 300), metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'), created_at timestamptz not null default now()
);
drop trigger if exists calendar_integrations_updated_at on public.calendar_integrations; create trigger calendar_integrations_updated_at before update on public.calendar_integrations for each row execute function public.set_updated_at();
drop trigger if exists appointment_requests_updated_at on public.appointment_requests; create trigger appointment_requests_updated_at before update on public.appointment_requests for each row execute function public.set_updated_at();
alter table public.calendar_integrations enable row level security; alter table public.appointment_requests enable row level security; alter table public.integration_events enable row level security;
revoke all on public.calendar_integrations, public.appointment_requests, public.integration_events from anon, authenticated;
comment on table public.calendar_integrations is 'Protected Google Calendar configuration metadata; secrets are stored only in Supabase project secrets.';
comment on table public.appointment_requests is 'Protected appointment lifecycle records. Anonymous access is through Edge Functions only.';
comment on table public.integration_events is 'Protected, sanitized integration audit events. Provider payloads and secrets are prohibited.';

-- Return only an opaque reference while keeping submission rows unreadable.
create or replace function public.submit_public_form(submission_kind text, payload jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
 if coalesce(payload->>'company_site','') <> '' then raise exception 'invalid submission'; end if;
 if submission_kind = 'assessment_requests' then
  insert into public.assessment_requests(name,email,company,website,message,company_site) values (payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''), payload->>'message','') returning id into new_id;
 elsif submission_kind = 'implementation_applications' then
  insert into public.implementation_applications(name,email,company,website,message,company_site) values (payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''), payload->>'message','') returning id into new_id;
 elsif submission_kind = 'contact_messages' then
  insert into public.contact_messages(name,email,company,website,message,company_site,contact_reason) values (payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''), payload->>'message','',coalesce(payload->>'contact_reason','general')) returning id into new_id;
 else raise exception 'invalid submission kind'; end if;
 return new_id;
end $$;
revoke all on function public.submit_public_form(text,jsonb) from public;
grant execute on function public.submit_public_form(text,jsonb) to anon;
revoke insert on public.assessment_requests, public.implementation_applications, public.contact_messages from anon;
drop policy if exists "anonymous assessment insert" on public.assessment_requests;
drop policy if exists "anonymous application insert" on public.implementation_applications;
drop policy if exists "anonymous contact insert" on public.contact_messages;
comment on function public.submit_public_form(text,jsonb) is 'Validated public submission boundary; returns only the newly generated opaque UUID.';
