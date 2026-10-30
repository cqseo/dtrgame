create or replace function public.dtr_legacy_user_match(p_username text)
returns table(
  room_id smallint,
  match_id bigint,
  gamenum integer,
  gamestate smallint,
  gametype smallint,
  groomtype smallint,
  groomstatus smallint,
  starttime bigint,
  validnum integer,
  alivenum integer,
  deathnum integer,
  areanum smallint,
  weather smallint
)
language sql stable security definer set search_path = ''
as $$
  select
    g.groomid,
    g.groomid::bigint * 1000000000::bigint + g.gamenum::bigint,
    g.gamenum,
    g.gamestate,
    g.gametype,
    g.groomtype,
    g.groomstatus,
    g.starttime,
    g.validnum,
    g.alivenum,
    g.deathnum,
    g.areanum,
    g.weather
  from acfun_runtime_qa_20261029.users u
  join acfun_runtime_qa_20261029.game g on g.groomid = u.roomid
  where u.username = p_username and u.roomid > 0 and g.groomstatus >= 40
  limit 1
$$;

revoke all on function public.dtr_legacy_user_match(text) from public, anon, authenticated;
grant execute on function public.dtr_legacy_user_match(text) to service_role;
