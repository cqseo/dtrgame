create or replace function public.dtr_legacy_user(p_username text)
returns table(username varchar, password varchar, groupid smallint, roomid smallint)
language sql stable security definer set search_path = ''
as $$
  select u.username, u.password, u.groupid, u.roomid
  from acfun_runtime_qa_20261029.users as u
  where u.username = p_username
  limit 1
$$;

create or replace function public.dtr_legacy_record_login(p_username text, p_timestamp bigint)
returns void language sql volatile security definer set search_path = ''
as $$
  update acfun_runtime_qa_20261029.users set lastvisit = p_timestamp where username = p_username
$$;

create or replace function public.dtr_legacy_set_room(p_username text, p_room_id smallint)
returns void language sql volatile security definer set search_path = ''
as $$
  update acfun_runtime_qa_20261029.users set roomid = p_room_id where username = p_username
$$;

create or replace function public.dtr_legacy_room(p_room_id smallint)
returns table(groomid smallint, groomtype smallint, groomstatus smallint, gametype smallint, gamestate smallint, roomvars text)
language sql stable security definer set search_path = ''
as $$
  select g.groomid, g.groomtype, g.groomstatus, g.gametype, g.gamestate, g.roomvars
  from acfun_runtime_qa_20261029.game as g
  where g.groomid = p_room_id
  limit 1
$$;

create or replace function public.dtr_legacy_save_room(
  p_room_id smallint, p_groomtype smallint, p_groomstatus smallint,
  p_gametype smallint, p_gamestate smallint, p_roomvars text
)
returns void language sql volatile security definer set search_path = ''
as $$
  update acfun_runtime_qa_20261029.game
  set groomtype = p_groomtype, groomstatus = p_groomstatus,
      gametype = p_gametype, gamestate = p_gamestate, roomvars = p_roomvars
  where groomid = p_room_id
$$;

revoke all on function public.dtr_legacy_user(text) from public, anon, authenticated;
revoke all on function public.dtr_legacy_record_login(text, bigint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_set_room(text, smallint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_room(smallint) from public, anon, authenticated;
revoke all on function public.dtr_legacy_save_room(smallint, smallint, smallint, smallint, smallint, text) from public, anon, authenticated;

grant execute on function public.dtr_legacy_user(text) to service_role;
grant execute on function public.dtr_legacy_record_login(text, bigint) to service_role;
grant execute on function public.dtr_legacy_set_room(text, smallint) to service_role;
grant execute on function public.dtr_legacy_room(smallint) to service_role;
grant execute on function public.dtr_legacy_save_room(smallint, smallint, smallint, smallint, smallint, text) to service_role;
