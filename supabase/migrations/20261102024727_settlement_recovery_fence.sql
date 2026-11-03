-- A response-lost SQL request may still be running or arrive after recovery.
-- Locking waits for in-flight settlement; advancing an unchanged active
-- version invalidates any late request carrying the old expected_version.
-- This function never writes accounts, history, game or settlement receipts.
create or replace function public.dtr_match_reconcile(p_match_id bigint,p_expected_version bigint)
returns table(version bigint,state jsonb)
language plpgsql volatile security definer set search_path = ''
as $$
declare v_snapshot dtr_runtime.match_snapshots%rowtype;
begin
  if p_match_id is null or p_match_id<=0 or p_expected_version is null or p_expected_version<0 then
    raise exception 'invalid settlement recovery identity';
  end if;
  select * into v_snapshot from dtr_runtime.match_snapshots s where s.match_id=p_match_id for update;
  if not found then raise exception 'match snapshot missing'; end if;
  if v_snapshot.version<p_expected_version then raise exception 'recovery snapshot is older than pending request'; end if;
  if v_snapshot.version=p_expected_version and not exists(
      select 1 from dtr_runtime.match_settlements l where l.match_id=p_match_id)
      and coalesce((v_snapshot.state->>'gamestate')::integer,0)>=5 then
    update dtr_runtime.match_snapshots s set version=s.version+1,updated_at=pg_catalog.now()
      where s.match_id=p_match_id returning s.* into v_snapshot;
  end if;
  return query select v_snapshot.version,v_snapshot.state;
end
$$;
revoke all on function public.dtr_match_reconcile(bigint,bigint) from public,anon,authenticated;
grant execute on function public.dtr_match_reconcile(bigint,bigint) to service_role;
