-- Match IDs encode the room in the high decimal digits:
--   room_id * 1_000_000_000 + game_number
-- Room 3 therefore already exceeds PostgreSQL integer's 2,147,483,647
-- ceiling. Keep the identifier bigint end-to-end so every configured room
-- can persist and restore its Durable Object snapshot.

drop function if exists public.dtr_match_load(integer);
drop function if exists public.dtr_match_save(integer, bigint, jsonb);

alter table dtr_runtime.match_snapshots
  alter column match_id type bigint using match_id::bigint;

create or replace function public.dtr_match_load(p_match_id bigint)
returns table(version bigint, state jsonb)
language sql stable security definer set search_path = ''
as $$
  select s.version, s.state
  from dtr_runtime.match_snapshots as s
  where s.match_id = p_match_id
  limit 1
$$;

create or replace function public.dtr_match_save(
  p_match_id bigint,
  p_version bigint,
  p_state jsonb
)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $$
declare affected integer;
begin
  if p_match_id <= 0 or p_version < 0 or jsonb_typeof(p_state) <> 'object' then
    raise exception 'invalid match snapshot';
  end if;

  insert into dtr_runtime.match_snapshots(match_id, version, state, updated_at)
  values (p_match_id, p_version, p_state, pg_catalog.now())
  on conflict (match_id) do update
    set version = excluded.version,
        state = excluded.state,
        updated_at = pg_catalog.now()
    where excluded.version > dtr_runtime.match_snapshots.version;

  get diagnostics affected = row_count;
  return affected = 1;
end
$$;

revoke all on function public.dtr_match_load(bigint) from public, anon, authenticated;
revoke all on function public.dtr_match_save(bigint, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.dtr_match_load(bigint) to service_role;
grant execute on function public.dtr_match_save(bigint, bigint, jsonb) to service_role;
