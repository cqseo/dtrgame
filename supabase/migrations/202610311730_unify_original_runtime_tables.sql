-- Put every live account/lobby/match RPC on the original acbra2_* tables.
--
-- Registration and compiled page execution already use public.acbra2_*.
-- The older hand-written lobby bridge still pointed at the isolated QA
-- schema, which split one player into two databases: a newly registered
-- account existed to login.php but not to roomcmd.php.  These definitions
-- keep the existing RPC signatures and privileges while changing the one
-- source of truth to the original tables.

insert into public.acbra2_game (groomid, gamenum, starttime)
values (0, 0, extract(epoch from clock_timestamp())::bigint)
on conflict (groomid) do nothing;

create or replace function public.dtr_legacy_user(p_username text)
returns table(username varchar, password varchar, groupid smallint, roomid smallint)
language sql stable security definer set search_path = ''
as $$
  select u.username::varchar, u.password::varchar,
         u.groupid::smallint, u.roomid::smallint
  from public.acbra2_users as u
  where u.username = p_username
  limit 1
$$;

create or replace function public.dtr_legacy_record_login(p_username text, p_timestamp bigint)
returns void language sql volatile security definer set search_path = ''
as $$
  update public.acbra2_users set lastvisit = p_timestamp where username = p_username
$$;

create or replace function public.dtr_legacy_set_room(p_username text, p_room_id smallint)
returns void language sql volatile security definer set search_path = ''
as $$
  update public.acbra2_users set roomid = p_room_id where username = p_username
$$;

create or replace function public.dtr_legacy_room(p_room_id smallint)
returns table(
  groomid smallint, groomtype smallint, groomstatus smallint,
  gametype smallint, gamestate smallint, roomvars text
)
language sql stable security definer set search_path = ''
as $$
  select g.groomid::smallint, g.groomtype::smallint,
         g.groomstatus::smallint, g.gametype::smallint,
         g.gamestate::smallint, g.roomvars
  from public.acbra2_game as g
  where g.groomid = p_room_id
  limit 1
$$;

create or replace function public.dtr_legacy_save_room(
  p_room_id smallint, p_groomtype smallint, p_groomstatus smallint,
  p_gametype smallint, p_gamestate smallint, p_roomvars text
)
returns void language sql volatile security definer set search_path = ''
as $$
  update public.acbra2_game
  set groomtype = p_groomtype, groomstatus = p_groomstatus,
      gametype = p_gametype, gamestate = p_gamestate, roomvars = p_roomvars
  where groomid = p_room_id
$$;

create or replace function public.dtr_legacy_create_room(
  p_username text, p_room_type smallint, p_game_type smallint, p_roomvars text
)
returns table(room_id smallint)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_room_id smallint;
  v_user_room smallint;
begin
  perform pg_catalog.pg_advisory_xact_lock(20261030, 1);
  select u.roomid::smallint into v_user_room
  from public.acbra2_users u
  where u.username = p_username
  for update;
  if not found then raise exception 'no_login'; end if;
  if v_user_room > 0 then raise exception '你已在房间内，请先退出房间'; end if;

  select candidate::smallint into v_room_id
  from pg_catalog.generate_series(1, 10) candidate
  left join public.acbra2_game g on g.groomid = candidate
  where g.groomid is null or g.groomstatus = 0
  order by candidate
  limit 1;
  if v_room_id is null then
    raise exception '房间数目已经达到上限，请加入一个已存在的房间';
  end if;

  insert into public.acbra2_game (
    gamenum, gametype, gamestate, groomid, groomtype, groomstatus,
    starttime, afktime, validnum, alivenum, deathnum, combonum, weather,
    hack, hdamage, hplayer, winmode, winner, areanum, areatime, areawarn,
    arealist, noisevars, roomvars, gamevars
  ) values (
    0, p_game_type, 0, v_room_id, p_room_type, 10,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, '', 0, '', 0, 0, 0,
    '', '', p_roomvars, ''
  )
  on conflict (groomid) do update set
    gametype = excluded.gametype, gamestate = 0,
    groomtype = excluded.groomtype, groomstatus = 10,
    starttime = 0, roomvars = excluded.roomvars, gamevars = '';

  update public.acbra2_users set roomid = v_room_id where username = p_username;
  return query select v_room_id;
end
$$;

create or replace function public.dtr_legacy_join_room(p_username text, p_room_id smallint)
returns table(
  groomid smallint, groomtype smallint, groomstatus smallint,
  gametype smallint, gamestate smallint, roomvars text
)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_user_room smallint;
begin
  select u.roomid::smallint into v_user_room
  from public.acbra2_users u
  where u.username = p_username
  for update;
  if not found then raise exception 'no_login'; end if;
  if v_user_room > 0 then raise exception '你已在房间内，请先退出房间'; end if;
  if not exists (
    select 1 from public.acbra2_game g
    where g.groomid = p_room_id and g.groomstatus > 0
  ) then return; end if;

  update public.acbra2_users set roomid = p_room_id where username = p_username;
  return query
    select g.groomid::smallint, g.groomtype::smallint,
           g.groomstatus::smallint, g.gametype::smallint,
           g.gamestate::smallint, g.roomvars
    from public.acbra2_game g where g.groomid = p_room_id;
end
$$;

create or replace function public.dtr_legacy_index_state()
returns table(global_state jsonb, rooms jsonb, site_text jsonb)
language sql stable security definer set search_path = ''
as $$
  select
    coalesce(
      (select pg_catalog.to_jsonb(g) from public.acbra2_game g where g.groomid = 0 limit 1),
      '{}'::jsonb
    ),
    coalesce(
      (select pg_catalog.jsonb_agg(pg_catalog.to_jsonb(g) order by g.groomid)
       from public.acbra2_game g
       where g.groomid > 0 and g.groomstatus > 0),
      '[]'::jsonb
    ),
    coalesce(
      (select pg_catalog.jsonb_object_agg(t.name, t.content)
       from acfun_runtime_qa_20261029.runtime_site_text t),
      '{}'::jsonb
    )
$$;

create or replace function public.dtr_legacy_start_match(
  p_room_id smallint, p_usernames text[], p_gamestate smallint, p_started_at bigint
)
returns table(match_id bigint, gamenum integer, gamestate smallint, profiles jsonb)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_game public.acbra2_game%rowtype;
  v_profiles jsonb;
  v_count integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(20261030, p_room_id::integer);
  select * into v_game
  from public.acbra2_game g
  where g.groomid = p_room_id
  for update;
  if not found then raise exception '房间数据记录不存在。'; end if;
  if v_game.groomstatus < 10 then raise exception '房间不在等待状态，命令无效。'; end if;

  select count(*)::integer, pg_catalog.jsonb_agg(
    pg_catalog.jsonb_build_object(
      'username', u.username, 'password', u.password, 'groupid', u.groupid,
      'gender', u.gender, 'icon', u.icon, 'ip', u.ip, 'card', u.card,
      'motto', u.motto, 'killmsg', u.killmsg, 'lastword', u.lastword
    ) order by requested.ordinality
  )
  into v_count, v_profiles
  from pg_catalog.unnest(p_usernames) with ordinality requested(username, ordinality)
  join public.acbra2_users u on u.username = requested.username
  where u.roomid = p_room_id;

  if coalesce(pg_catalog.array_length(p_usernames, 1), 0) = 0 or
     v_count <> pg_catalog.array_length(p_usernames, 1) then
    raise exception '房间玩家资料不完整，不能开始游戏。';
  end if;

  if v_game.groomstatus < 40 then
    update public.acbra2_game g set
      gamenum = g.gamenum + 1, gamestate = p_gamestate,
      groomstatus = 40, starttime = p_started_at,
      validnum = v_count, alivenum = v_count, deathnum = 0,
      combonum = 0, hdamage = 0, hplayer = '', winner = '',
      winmode = 0, areanum = 1, areawarn = 0, arealist = ''
    where g.groomid = p_room_id
    returning * into v_game;

    update public.acbra2_users u
    set lastgame = 's' || v_game.gamenum::text
    where u.username = any(p_usernames);
  end if;

  return query select
    p_room_id::bigint * 1000000000::bigint + v_game.gamenum::bigint,
    v_game.gamenum::integer, v_game.gamestate::smallint,
    coalesce(v_profiles, '[]'::jsonb);
end
$$;

create or replace function public.dtr_legacy_user_match(p_username text)
returns table(
  room_id smallint, match_id bigint, gamenum integer, gamestate smallint,
  gametype smallint, groomtype smallint, groomstatus smallint,
  starttime bigint, validnum integer, alivenum integer, deathnum integer,
  areanum smallint, weather smallint
)
language sql stable security definer set search_path = ''
as $$
  select
    g.groomid::smallint,
    g.groomid::bigint * 1000000000::bigint + g.gamenum::bigint,
    g.gamenum::integer, g.gamestate::smallint, g.gametype::smallint,
    g.groomtype::smallint, g.groomstatus::smallint, g.starttime::bigint,
    g.validnum::integer, g.alivenum::integer, g.deathnum::integer,
    g.areanum::smallint, g.weather::smallint
  from public.acbra2_users u
  join public.acbra2_game g on g.groomid = u.roomid
  where u.username = p_username and u.roomid > 0 and g.groomstatus >= 40
  limit 1
$$;

revoke all on function public.dtr_legacy_user(text) from public, anon, authenticated;
revoke all on function public.dtr_legacy_record_login(text, bigint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_set_room(text, smallint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_room(smallint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_save_room(smallint, smallint, smallint, smallint, smallint, text) from public, anon, authenticated;
revoke all on function public.dtr_legacy_create_room(text, smallint, smallint, text) from public, anon, authenticated;
revoke all on function public.dtr_legacy_join_room(text, smallint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_index_state() from public, anon, authenticated;
revoke all on function public.dtr_legacy_start_match(smallint, text[], smallint, bigint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_user_match(text) from public, anon, authenticated;

grant execute on function public.dtr_legacy_user(text) to service_role;
grant execute on function public.dtr_legacy_record_login(text, bigint) to service_role;
grant execute on function public.dtr_legacy_set_room(text, smallint) to service_role;
grant execute on function public.dtr_legacy_room(smallint) to service_role;
grant execute on function public.dtr_legacy_save_room(smallint, smallint, smallint, smallint, smallint, text) to service_role;
grant execute on function public.dtr_legacy_create_room(text, smallint, smallint, text) to service_role;
grant execute on function public.dtr_legacy_join_room(text, smallint) to service_role;
grant execute on function public.dtr_legacy_index_state() to service_role;
grant execute on function public.dtr_legacy_start_match(smallint, text[], smallint, bigint) to service_role;
grant execute on function public.dtr_legacy_user_match(text) to service_role;
