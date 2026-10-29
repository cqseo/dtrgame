create schema if not exists dtr_runtime;
revoke all on schema dtr_runtime from public, anon, authenticated, service_role;

create table if not exists dtr_runtime.match_snapshots (
  match_id integer primary key check (match_id > 0),
  version bigint not null default 0 check (version >= 0),
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

alter table dtr_runtime.match_snapshots enable row level security;
revoke all on dtr_runtime.match_snapshots from public, anon, authenticated, service_role;

create or replace function public.dtr_match_load(p_match_id integer)
returns table(version bigint, state jsonb)
language sql stable security definer set search_path = ''
as $$
  select s.version, s.state from dtr_runtime.match_snapshots as s where s.match_id = p_match_id limit 1
$$;

create or replace function public.dtr_match_save(p_match_id integer, p_version bigint, p_state jsonb)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $$
declare affected integer;
begin
  if p_match_id <= 0 or p_version < 0 or jsonb_typeof(p_state) <> 'object' then
    raise exception 'invalid match snapshot';
  end if;
  insert into dtr_runtime.match_snapshots(match_id, version, state, updated_at)
  values (p_match_id, p_version, p_state, now())
  on conflict (match_id) do update
    set version = excluded.version, state = excluded.state, updated_at = now()
    where excluded.version > dtr_runtime.match_snapshots.version;
  get diagnostics affected = row_count;
  return affected = 1;
end
$$;

revoke all on function public.dtr_match_load(integer) from public, anon, authenticated;
revoke all on function public.dtr_match_save(integer, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.dtr_match_load(integer) to service_role;
grant execute on function public.dtr_match_save(integer, bigint, jsonb) to service_role;
