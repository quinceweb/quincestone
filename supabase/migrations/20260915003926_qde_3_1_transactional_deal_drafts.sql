create or replace function public.create_deal_draft(p_title text, p_counterparty_name text default null, p_currency text default 'USD', p_value_minor bigint default null, p_scope text default null, p_commercial_terms text default null, p_expires_at timestamptz default null)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_deal uuid;
  v_offer uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if nullif(trim(p_title),'') is null then raise exception 'deal title required'; end if;
  if p_value_minor is not null and p_value_minor < 0 then raise exception 'deal value cannot be negative'; end if;

  insert into public.deals(title, deal_type, status, creator_id, owner_id, counterparty_name, currency, value_minor, expires_at, next_action)
  values(trim(p_title), 'commercial', 'draft', v_user, v_user, nullif(trim(p_counterparty_name),''), upper(coalesce(nullif(trim(p_currency),''),'USD')), p_value_minor, p_expires_at, 'Review structured terms')
  returning id into v_deal;

  if p_value_minor is not null or nullif(trim(p_scope),'') is not null or nullif(trim(p_commercial_terms),'') is not null then
    insert into public.deal_offers(deal_id, version, status, proposed_by, value_minor, currency, summary, expires_at)
    values(v_deal, 1, 'draft', v_user, p_value_minor, upper(coalesce(nullif(trim(p_currency),''),'USD')), nullif(trim(p_scope),''), p_expires_at)
    returning id into v_offer;
  end if;

  if nullif(trim(p_scope),'') is not null then
    insert into public.deal_terms(deal_id, offer_id, kind, label, value, status, proposed_by, visibility)
    values(v_deal, v_offer, 'custom', 'Scope', jsonb_build_object('text', trim(p_scope)), 'open', v_user, 'shared');
  end if;
  if nullif(trim(p_commercial_terms),'') is not null then
    insert into public.deal_terms(deal_id, offer_id, kind, label, value, status, proposed_by, visibility)
    values(v_deal, v_offer, 'custom', 'Commercial terms', jsonb_build_object('text', trim(p_commercial_terms)), 'open', v_user, 'shared');
  end if;

  insert into public.deal_events(deal_id, actor_id, event_type, visibility, object_type, object_id, to_value, metadata)
  values(v_deal, v_user, 'deal_created', 'internal', 'deal', v_deal, jsonb_build_object('status','draft'), jsonb_build_object('source','composer','binding',false));

  return v_deal;
end;
$$;

grant execute on function public.create_deal_draft(text,text,text,bigint,text,text,timestamptz) to authenticated;
