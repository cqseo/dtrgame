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
  perform pg_advisory_xact_lock(20261030, 1);
  select u.roomid into v_user_room
  from acfun_runtime_qa_20261029.users u
  where u.username = p_username
  for update;
  if not found then raise exception 'no_login'; end if;
  if v_user_room > 0 then raise exception '你已在房间内，请先退出房间'; end if;

  select candidate into v_room_id
  from generate_series(1, 10) candidate
  left join acfun_runtime_qa_20261029.game g on g.groomid = candidate
  where g.groomid is null or g.groomstatus = 0
  order by candidate
  limit 1;
  if v_room_id is null then raise exception '房间数目已经达到上限，请加入一个已存在的房间'; end if;

  insert into acfun_runtime_qa_20261029.game (
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
    gametype = excluded.gametype, gamestate = 0, groomtype = excluded.groomtype,
    groomstatus = 10, starttime = 0, roomvars = excluded.roomvars, gamevars = '';

  update acfun_runtime_qa_20261029.users set roomid = v_room_id where username = p_username;
  return query select v_room_id;
end
$$;

create or replace function public.dtr_legacy_join_room(p_username text, p_room_id smallint)
returns table(groomid smallint, groomtype smallint, groomstatus smallint, gametype smallint, gamestate smallint, roomvars text)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_user_room smallint;
begin
  select u.roomid into v_user_room
  from acfun_runtime_qa_20261029.users u
  where u.username = p_username
  for update;
  if not found then raise exception 'no_login'; end if;
  if v_user_room > 0 then raise exception '你已在房间内，请先退出房间'; end if;
  if not exists (
    select 1 from acfun_runtime_qa_20261029.game g
    where g.groomid = p_room_id and g.groomstatus > 0
  ) then return; end if;
  update acfun_runtime_qa_20261029.users set roomid = p_room_id where username = p_username;
  return query
    select g.groomid, g.groomtype, g.groomstatus, g.gametype, g.gamestate, g.roomvars
    from acfun_runtime_qa_20261029.game g where g.groomid = p_room_id;
end
$$;

revoke all on function public.dtr_legacy_create_room(text, smallint, smallint, text) from public, anon, authenticated;
revoke all on function public.dtr_legacy_join_room(text, smallint) from public, anon, authenticated;
grant execute on function public.dtr_legacy_create_room(text, smallint, smallint, text) to service_role;
grant execute on function public.dtr_legacy_join_room(text, smallint) to service_role;
