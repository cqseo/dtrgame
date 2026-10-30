create or replace function public.dtr_legacy_start_match(
  p_room_id smallint,
  p_usernames text[],
  p_gamestate smallint,
  p_started_at bigint
)
returns table(match_id bigint, gamenum integer, gamestate smallint, profiles jsonb)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_game acfun_runtime_qa_20261029.game%rowtype;
  v_profiles jsonb;
  v_count integer;
begin
  perform pg_advisory_xact_lock(20261030, p_room_id::integer);
  select * into v_game
  from acfun_runtime_qa_20261029.game g
  where g.groomid = p_room_id
  for update;
  if not found then raise exception '房间数据记录不存在。'; end if;
  if v_game.groomstatus < 10 then raise exception '房间不在等待状态，命令无效。'; end if;

  select count(*), jsonb_agg(
    jsonb_build_object(
      'username', u.username, 'password', u.password, 'groupid', u.groupid,
      'gender', u.gender, 'icon', u.icon, 'ip', u.ip, 'card', u.card,
      'motto', u.motto, 'killmsg', u.killmsg, 'lastword', u.lastword
    ) order by requested.ordinality
  )
  into v_count, v_profiles
  from unnest(p_usernames) with ordinality requested(username, ordinality)
  join acfun_runtime_qa_20261029.users u on u.username = requested.username
  where u.roomid = p_room_id;

  if coalesce(array_length(p_usernames, 1), 0) = 0 or
     v_count <> array_length(p_usernames, 1) then
    raise exception '房间玩家资料不完整，不能开始游戏。';
  end if;

  if v_game.groomstatus < 40 then
    update acfun_runtime_qa_20261029.game g set
      gamenum = g.gamenum + 1,
      gamestate = p_gamestate,
      groomstatus = 40,
      starttime = p_started_at,
      validnum = v_count,
      alivenum = v_count,
      deathnum = 0,
      combonum = 0,
      hdamage = 0,
      hplayer = '',
      winner = '',
      winmode = 0,
      areanum = 1,
      areawarn = 0,
      arealist = ''
    where g.groomid = p_room_id
    returning * into v_game;

    update acfun_runtime_qa_20261029.users u
    set lastgame = 's' || v_game.gamenum::text
    where u.username = any(p_usernames);
  end if;

  return query select
    p_room_id::bigint * 1000000000::bigint + v_game.gamenum::bigint,
    v_game.gamenum,
    v_game.gamestate,
    coalesce(v_profiles, '[]'::jsonb);
end
$$;

revoke all on function public.dtr_legacy_start_match(smallint, text[], smallint, bigint) from public, anon, authenticated;
grant execute on function public.dtr_legacy_start_match(smallint, text[], smallint, bigint) to service_role;
