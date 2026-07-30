begin;

revoke insert, update, delete on public.bookings from anon, authenticated;

create or replace function public.ccmv_booking_sync_mutate(
  p_trip_id text,
  p_party_id text,
  p_mutation jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_generation integer;
  v_operation text := p_mutation->>'operation';
  v_booking_id text := p_mutation->>'recordId';
  v_mutation_id text := p_mutation->>'mutationId';
  v_schema integer := coalesce((p_mutation->>'schemaVersion')::integer, (p_mutation->'payload'->>'schemaVersion')::integer);
  v_base integer := (p_mutation->>'baseVersion')::integer;
  v_row public.bookings%rowtype;
  v_payload jsonb := coalesce(p_mutation->'payload', '{}'::jsonb);
begin
  if p_trip_id is null or p_trip_id <> p_mutation->>'tripId' then
    return jsonb_build_object('ok', false, 'code', 'wrong_trip');
  end if;
  select trip_generation into v_generation from public.trips where trip_id = p_trip_id for update;
  if v_generation is null then return jsonb_build_object('ok', false, 'code', 'wrong_trip'); end if;
  if not exists (
    select 1 from public.trip_memberships m
    where m.trip_id = p_trip_id and m.party_id = p_party_id
  ) then return jsonb_build_object('ok', false, 'code', 'invalid_party'); end if;
  if p_mutation->>'domain' <> 'booking' then return jsonb_build_object('ok', false, 'code', 'invalid_payload'); end if;
  if (p_mutation->>'tripGeneration')::integer <> v_generation then
    return jsonb_build_object('ok', false, 'code', 'generation_mismatch');
  end if;
  if v_schema <> 1 then
    return jsonb_build_object('ok', false, 'code', case when v_schema > 1 then 'future_schema' else 'invalid_payload' end);
  end if;

  select * into v_row from public.bookings
    where trip_id = p_trip_id and mutation_id = v_mutation_id;
  if found then
    return jsonb_build_object('ok', true, 'mutationId', v_mutation_id, 'record', to_jsonb(v_row), 'version', v_row.version);
  end if;

  if v_operation = 'reset' then
    update public.trips set trip_generation = trip_generation + 1 where trip_id = p_trip_id
      returning trip_generation into v_generation;
    return jsonb_build_object('ok', true, 'tripGeneration', v_generation, 'mutationId', v_mutation_id);
  end if;

  select * into v_row from public.bookings
    where trip_id = p_trip_id and booking_id = v_booking_id for update;

  if v_operation = 'create' then
    if found then return jsonb_build_object('ok', false, 'code', 'version_conflict', 'mutationId', v_mutation_id, 'canonicalRecord', to_jsonb(v_row), 'canonicalVersion', v_row.version); end if;
    insert into public.bookings (
      trip_id, booking_id, event_id, place_id, day_number, status, booking_date, booking_time,
      booking_name, category, title, deposit_paid, deposit_amount, booking_method, booking_contact,
      secondary_contact, booking_url, notes, schema_version, trip_generation, version,
      created_at, updated_at, updated_by_party_id, updated_by_user_id, deleted_at, mutation_id
    ) values (
      p_trip_id, v_booking_id, v_payload->>'eventId', v_payload->>'placeId', (v_payload->>'day')::integer,
      v_payload->>'status', nullif(v_payload->>'date','')::date, nullif(v_payload->>'time','')::time,
      coalesce(v_payload->>'bookingName',''), coalesce(v_payload->>'category',''), coalesce(v_payload->>'title',''),
      coalesce((v_payload->>'depositPaid')::boolean,false), v_payload->>'depositAmount',
      v_payload->>'bookingMethod', v_payload->>'bookingContact', v_payload->>'secondaryContact',
      v_payload->>'bookingUrl', v_payload->>'notes', v_schema, v_generation, 1,
      coalesce((v_payload->>'createdAt')::timestamptz, now()), now(), p_party_id, null, null, v_mutation_id
    ) returning * into v_row;
  elsif v_operation in ('update','delete') then
    if not found then return jsonb_build_object('ok', false, 'code', 'not_found'); end if;
    if v_base is null or v_base <> v_row.version then
      return jsonb_build_object('ok', false, 'code', 'version_conflict', 'mutationId', v_mutation_id, 'canonicalRecord', to_jsonb(v_row), 'canonicalVersion', v_row.version);
    end if;
    update public.bookings set
      event_id = case when v_operation='delete' then event_id else coalesce(v_payload->>'eventId', event_id) end,
      place_id = case when v_operation='delete' then place_id else coalesce(v_payload->>'placeId', place_id) end,
      day_number = case when v_operation='delete' then day_number else coalesce((v_payload->>'day')::integer, day_number) end,
      status = case when v_operation='delete' then status else coalesce(v_payload->>'status', status) end,
      booking_name = case when v_operation='delete' then booking_name else coalesce(v_payload->>'bookingName', booking_name) end,
      category = case when v_operation='delete' then category else coalesce(v_payload->>'category', category) end,
      title = case when v_operation='delete' then title else coalesce(v_payload->>'title', title) end,
      notes = case when v_operation='delete' then notes else coalesce(v_payload->>'notes', notes) end,
      version = version + 1, updated_at = now(), updated_by_party_id = p_party_id,
      deleted_at = case when v_operation='delete' then now() else deleted_at end,
      mutation_id = v_mutation_id
    where trip_id = p_trip_id and booking_id = v_booking_id returning * into v_row;
  else
    return jsonb_build_object('ok', false, 'code', 'invalid_payload');
  end if;
  return jsonb_build_object('ok', true, 'mutationId', v_mutation_id, 'record', to_jsonb(v_row), 'version', v_row.version);
exception when others then
  return jsonb_build_object('ok', false, 'code', 'internal_error');
end;
$$;

revoke all on function public.ccmv_booking_sync_mutate(text,text,jsonb) from public, anon, authenticated;
grant execute on function public.ccmv_booking_sync_mutate(text,text,jsonb) to service_role;
commit;
