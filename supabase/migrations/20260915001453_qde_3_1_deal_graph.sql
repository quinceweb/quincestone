create extension if not exists pgcrypto;

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  deal_number bigint generated always as identity unique,
  title text not null check (char_length(title) between 1 and 240),
  deal_type text not null default 'commercial',
  status text not null default 'draft' check (status in ('draft','proposed','negotiating','internal_review','awaiting_approval','ready_for_agreement','agreed','execution_ready','in_progress','completed','declined','withdrawn','expired','cancelled')),
  creator_id uuid not null references auth.users(id),
  owner_id uuid not null references auth.users(id),
  workspace_id uuid references public.workspaces(id),
  counterparty_name text,
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  value_minor bigint check (value_minor is null or value_minor >= 0),
  expires_at timestamptz,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deal_participants (
  id uuid primary key default gen_random_uuid(), deal_id uuid not null references public.deals(id) on delete cascade,
  user_id uuid references auth.users(id), display_name text not null, role text not null default 'participant',
  visibility text not null default 'shared' check (visibility in ('internal','shared')), created_at timestamptz not null default now()
);
create table public.deal_offers (
  id uuid primary key default gen_random_uuid(), deal_id uuid not null references public.deals(id) on delete cascade,
  version integer not null check (version > 0), status text not null default 'draft' check (status in ('draft','proposed','counteroffer','acceptable_pending_approval','accepted','rejected','withdrawn','expired','superseded')),
  proposed_by uuid references auth.users(id), value_minor bigint check (value_minor is null or value_minor >= 0), currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  summary text, expires_at timestamptz, created_at timestamptz not null default now(), unique(deal_id, version)
);
create table public.deal_terms (
  id uuid primary key default gen_random_uuid(), deal_id uuid not null references public.deals(id) on delete cascade, offer_id uuid references public.deal_offers(id) on delete set null,
  kind text not null, label text not null, value jsonb, previous_value jsonb, status text not null default 'open' check (status in ('agreed','open','changed','blocked','requires_approval','not_specified','review')),
  proposed_by uuid references auth.users(id), visibility text not null default 'shared' check (visibility in ('internal','shared')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.deal_decisions (
  id uuid primary key default gen_random_uuid(), deal_id uuid not null references public.deals(id) on delete cascade, offer_id uuid references public.deal_offers(id) on delete set null, term_id uuid references public.deal_terms(id) on delete set null,
  title text not null, requested_by uuid not null references auth.users(id), decision_maker uuid references auth.users(id), status text not null default 'requested' check (status in ('requested','approved','declined','cancelled')),
  reason text, visibility text not null default 'internal' check (visibility in ('internal','shared')), decided_at timestamptz, created_at timestamptz not null default now()
);
create table public.deal_events (
  id uuid primary key default gen_random_uuid(), deal_id uuid not null references public.deals(id) on delete cascade, actor_id uuid references auth.users(id), event_type text not null,
  visibility text not null default 'internal' check (visibility in ('internal','shared')), object_type text, object_id uuid, from_value jsonb, to_value jsonb, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index deals_owner_updated_idx on public.deals(owner_id, updated_at desc);
create index deal_events_deal_created_idx on public.deal_events(deal_id, created_at desc);
create index deal_terms_deal_idx on public.deal_terms(deal_id);
create index deal_decisions_deal_idx on public.deal_decisions(deal_id, created_at desc);

alter table public.deals enable row level security;
alter table public.deal_participants enable row level security;
alter table public.deal_offers enable row level security;
alter table public.deal_terms enable row level security;
alter table public.deal_decisions enable row level security;
alter table public.deal_events enable row level security;

grant select, insert, update, delete on public.deals, public.deal_participants, public.deal_offers, public.deal_terms, public.deal_decisions, public.deal_events to authenticated;
grant usage, select on sequence public.deals_deal_number_seq to authenticated;

create policy deals_select on public.deals for select to authenticated using (creator_id = (select auth.uid()) or owner_id = (select auth.uid()) or exists (select 1 from public.deal_participants p where p.deal_id = id and p.user_id = (select auth.uid())));
create policy deals_insert on public.deals for insert to authenticated with check (creator_id = (select auth.uid()) and owner_id = (select auth.uid()));
create policy deals_update on public.deals for update to authenticated using (creator_id = (select auth.uid()) or owner_id = (select auth.uid())) with check (creator_id = (select auth.uid()) or owner_id = (select auth.uid()));
create policy deals_delete on public.deals for delete to authenticated using (creator_id = (select auth.uid()) or owner_id = (select auth.uid()));

create policy participants_select on public.deal_participants for select to authenticated using (exists (select 1 from public.deals d where d.id = deal_id and (d.creator_id = (select auth.uid()) or d.owner_id = (select auth.uid()) or exists (select 1 from public.deal_participants me where me.deal_id = d.id and me.user_id = (select auth.uid())))));
create policy participants_write on public.deal_participants for all to authenticated using (exists (select 1 from public.deals d where d.id = deal_id and (d.creator_id = (select auth.uid()) or d.owner_id = (select auth.uid())))) with check (exists (select 1 from public.deals d where d.id = deal_id and (d.creator_id = (select auth.uid()) or d.owner_id = (select auth.uid()))));

create policy offers_select on public.deal_offers for select to authenticated using (exists (select 1 from public.deals d where d.id = deal_id and (d.creator_id = (select auth.uid()) or d.owner_id = (select auth.uid()) or exists (select 1 from public.deal_participants p where p.deal_id=d.id and p.user_id=(select auth.uid())))));
create policy offers_write on public.deal_offers for all to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid())))) with check (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()))));
create policy terms_select on public.deal_terms for select to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()) or (visibility='shared' and exists (select 1 from public.deal_participants p where p.deal_id=d.id and p.user_id=(select auth.uid()))))));
create policy terms_write on public.deal_terms for all to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid())))) with check (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()))));
create policy decisions_select on public.deal_decisions for select to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()) or (visibility='shared' and exists (select 1 from public.deal_participants p where p.deal_id=d.id and p.user_id=(select auth.uid()))))));
create policy decisions_write on public.deal_decisions for all to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid())))) with check (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()))));
create policy events_select on public.deal_events for select to authenticated using (exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()) or (visibility='shared' and exists (select 1 from public.deal_participants p where p.deal_id=d.id and p.user_id=(select auth.uid()))))));
create policy events_insert on public.deal_events for insert to authenticated with check (actor_id=(select auth.uid()) and exists (select 1 from public.deals d where d.id=deal_id and (d.creator_id=(select auth.uid()) or d.owner_id=(select auth.uid()))));
