create or replace function public.create_deal_counteroffer(p_deal_id uuid, p_value_minor bigint default null, p_currency text default null, p_summary text default null, p_expires_at timestamptz default null)
returns uuid language plpgsql security invoker set search_path = public as $$
declare v_user uuid := auth.uid(); v_previous public.deal_offers%rowtype; v_offer uuid; v_version integer;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if not exists(select 1 from public.deals d where d.id=p_deal_id and (d.owner_id=v_user or d.creator_id=v_user)) then raise exception 'deal not found or not authorized'; end if;
 select * into v_previous from public.deal_offers where deal_id=p_deal_id and status in ('draft','proposed','counteroffer','acceptable_pending_approval') order by version desc limit 1 for update;
 select coalesce(max(version),0)+1 into v_version from public.deal_offers where deal_id=p_deal_id;
 if v_previous.id is not null then update public.deal_offers set status='superseded' where id=v_previous.id; end if;
 insert into public.deal_offers(deal_id,version,status,proposed_by,value_minor,currency,summary,expires_at) values(p_deal_id,v_version,'counteroffer',v_user,p_value_minor,upper(coalesce(nullif(trim(p_currency),''),v_previous.currency,'USD')),nullif(trim(p_summary),''),p_expires_at) returning id into v_offer;
 if v_previous.id is not null then insert into public.deal_events(deal_id,actor_id,event_type,visibility,object_type,object_id,from_value,to_value,metadata) values(p_deal_id,v_user,'offer_superseded','shared','offer',v_previous.id,jsonb_build_object('version',v_previous.version,'value_minor',v_previous.value_minor,'currency',v_previous.currency),jsonb_build_object('version',v_version,'value_minor',p_value_minor,'currency',upper(coalesce(nullif(trim(p_currency),''),v_previous.currency,'USD'))),jsonb_build_object('replacement_offer_id',v_offer)); end if;
 insert into public.deal_events(deal_id,actor_id,event_type,visibility,object_type,object_id,to_value,metadata) values(p_deal_id,v_user,'offer_created','shared','offer',v_offer,jsonb_build_object('version',v_version,'value_minor',p_value_minor,'currency',upper(coalesce(nullif(trim(p_currency),''),v_previous.currency,'USD'))),jsonb_build_object('binding',false,'kind','counteroffer'));
 update public.deals set status='negotiating',value_minor=coalesce(p_value_minor,value_minor),currency=upper(coalesce(nullif(trim(p_currency),''),currency)),next_action='Review latest counteroffer',updated_at=now() where id=p_deal_id;
 return v_offer;
end; $$;
revoke execute on function public.create_deal_counteroffer(uuid,bigint,text,text,timestamptz) from public, anon;
grant execute on function public.create_deal_counteroffer(uuid,bigint,text,text,timestamptz) to authenticated;

create or replace function public.request_deal_decision(p_deal_id uuid,p_title text,p_offer_id uuid default null,p_term_id uuid default null,p_decision_maker uuid default null,p_reason text default null)
returns uuid language plpgsql security invoker set search_path = public as $$
declare v_user uuid:=auth.uid(); v_decision uuid;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if nullif(trim(p_title),'') is null then raise exception 'decision title required'; end if;
 if not exists(select 1 from public.deals d where d.id=p_deal_id and (d.owner_id=v_user or d.creator_id=v_user)) then raise exception 'deal not found or not authorized'; end if;
 insert into public.deal_decisions(deal_id,offer_id,term_id,title,requested_by,decision_maker,status,reason,visibility) values(p_deal_id,p_offer_id,p_term_id,trim(p_title),v_user,p_decision_maker,'requested',nullif(trim(p_reason),''),'internal') returning id into v_decision;
 insert into public.deal_events(deal_id,actor_id,event_type,visibility,object_type,object_id,to_value,metadata) values(p_deal_id,v_user,'decision_requested','internal','decision',v_decision,jsonb_build_object('status','requested','decision_maker',p_decision_maker),jsonb_build_object('reason',nullif(trim(p_reason),'')));
 update public.deals set status='awaiting_approval',next_action='Authority decision required',updated_at=now() where id=p_deal_id;
 return v_decision;
end; $$;
revoke execute on function public.request_deal_decision(uuid,text,uuid,uuid,uuid,text) from public, anon;
grant execute on function public.request_deal_decision(uuid,text,uuid,uuid,uuid,text) to authenticated;

create or replace function public.decide_deal_decision(p_decision_id uuid,p_outcome text,p_reason text default null)
returns uuid language plpgsql security invoker set search_path = public as $$
declare v_user uuid:=auth.uid(); v_decision public.deal_decisions%rowtype;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if p_outcome not in ('approved','declined') then raise exception 'invalid decision outcome'; end if;
 select * into v_decision from public.deal_decisions where id=p_decision_id for update;
 if v_decision.id is null then raise exception 'decision not found'; end if;
 if v_decision.status<>'requested' then raise exception 'decision already resolved'; end if;
 if v_decision.decision_maker is null or v_decision.decision_maker<>v_user then raise exception 'only the assigned decision maker may decide'; end if;
 update public.deal_decisions set status=p_outcome,reason=coalesce(nullif(trim(p_reason),''),reason),decided_at=now() where id=p_decision_id;
 insert into public.deal_events(deal_id,actor_id,event_type,visibility,object_type,object_id,from_value,to_value,metadata) values(v_decision.deal_id,v_user,'decision_recorded','internal','decision',p_decision_id,jsonb_build_object('status','requested'),jsonb_build_object('status',p_outcome),jsonb_build_object('reason',nullif(trim(p_reason),'')));
 return p_decision_id;
end; $$;
revoke execute on function public.decide_deal_decision(uuid,text,text) from public, anon;
grant execute on function public.decide_deal_decision(uuid,text,text) to authenticated;

revoke execute on function public.create_deal_draft(text,text,text,bigint,text,text,timestamptz) from public, anon;
grant execute on function public.create_deal_draft(text,text,text,bigint,text,text,timestamptz) to authenticated;

create index if not exists deal_offers_proposed_by_idx on public.deal_offers(proposed_by);
create index if not exists deal_terms_offer_idx on public.deal_terms(offer_id);
create index if not exists deal_terms_proposed_by_idx on public.deal_terms(proposed_by);
create index if not exists deal_decisions_offer_idx on public.deal_decisions(offer_id);
create index if not exists deal_decisions_term_idx on public.deal_decisions(term_id);
create index if not exists deal_decisions_requested_by_idx on public.deal_decisions(requested_by);
create index if not exists deal_decisions_decision_maker_idx on public.deal_decisions(decision_maker);
create index if not exists deal_events_actor_idx on public.deal_events(actor_id);
create index if not exists deal_participants_deal_idx on public.deal_participants(deal_id);
create index if not exists deal_participants_user_idx on public.deal_participants(user_id);
create index if not exists deals_creator_idx on public.deals(creator_id);
create index if not exists deals_workspace_idx on public.deals(workspace_id);
