begin;

create or replace function public.ccmv_booking_sync_mutate(
  p_trip_id text,
  p_party_id text,
  p_mutation jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_result jsonb;
begin
  if p_party_id <> 'party-crystal' then
    return jsonb_build_object('ok', false, 'code', 'booking_admin_required');
  end if;

  -- Delegate to the already installed Stage E implementation.
  -- This wrapper body is replaced during deployment by the current canonical
  -- function plus the admin guard. See deployment report.
  raise exception 'ADMIN_GUARD_MIGRATION_REQUIRES_CANONICAL_FUNCTION_MERGE';
end;
$function$;

rollback;
