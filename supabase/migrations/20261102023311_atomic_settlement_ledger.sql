-- Stable identity survives original-compatible global history gid allocation.
create table if not exists dtr_runtime.active_matches (
  room_id smallint primary key check(room_id between 0 and 12),
  match_id bigint not null unique check(match_id>0),
  game_number bigint not null check(game_number>0),
  history_gid bigint, concluded_at bigint,
  updated_at timestamptz not null default pg_catalog.now()
);
alter table dtr_runtime.active_matches enable row level security;
revoke all on dtr_runtime.active_matches from public,anon,authenticated,service_role;

-- Experimental base settlement, OFF by default. Post-game module hooks remain
-- a release gate. No account, game or history rows change when installed.
create table if not exists dtr_runtime.settlement_control (
  singleton boolean primary key default true check (singleton),
  enabled boolean not null default false
);
insert into dtr_runtime.settlement_control(singleton, enabled) values(true, false)
  on conflict (singleton) do nothing;
alter table dtr_runtime.settlement_control enable row level security;
revoke all on dtr_runtime.settlement_control from public, anon, authenticated, service_role;

create table if not exists dtr_runtime.match_settlements (
  match_id bigint primary key references dtr_runtime.match_snapshots(match_id),
  receipt jsonb not null check (jsonb_typeof(receipt) = 'object'),
  created_at timestamptz not null default pg_catalog.now()
);
alter table dtr_runtime.match_settlements enable row level security;
revoke all on dtr_runtime.match_settlements from public, anon, authenticated, service_role;

create or replace function public.dtr_match_settle(
  p_match_id bigint, p_expected_version bigint, p_ended_at bigint, p_history jsonb
) returns jsonb
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_snapshot dtr_runtime.match_snapshots%rowtype;
  v_game public.acbra2_game%rowtype;
  v_receipt jsonb;
  v_state jsonb;
  v_players jsonb;
  v_entry record;
  v_p jsonb;
  v_room bigint;
  v_game_number bigint;
  v_valid integer;
  v_alive integer;
  v_mode integer;
  v_winners text[] := '{}'::text[];
  v_winner text;
  v_first_team text;
  v_credits bigint;
  v_gold bigint;
  v_wins integer;
  v_rewards jsonb := '[]'::jsonb;
  v_decision jsonb;
  v_history_table text;
  v_gid bigint;
  v_high_kill text := '';
  v_high_kill_num bigint := 0;
  v_encoded_valid text;
  v_encoded_winner text;
begin
  if p_match_id is null or p_match_id <= 0 or p_expected_version is null or p_expected_version < 0
     or p_ended_at is null or p_ended_at <= 0 or p_ended_at > 9007199254740991 then
    raise exception 'invalid settlement identity or timestamp';
  end if;
  -- The snapshot row is the common lock for saves and settlements. A waiter
  -- checks the immutable receipt again AFTER acquiring this lock.
  select * into v_snapshot from dtr_runtime.match_snapshots s
    where s.match_id = p_match_id for update;
  if not found then raise exception 'match snapshot missing'; end if;
  select l.receipt into v_receipt from dtr_runtime.match_settlements l where l.match_id = p_match_id;
  if found then return v_receipt; end if;
  if not coalesce((select c.enabled from dtr_runtime.settlement_control c where c.singleton), false) then
    raise exception 'experimental settlement disabled';
  end if;
  if v_snapshot.version <> p_expected_version then raise exception 'stale settlement version'; end if;
  v_state := v_snapshot.state;
  v_players := v_state->'players';
  v_room := p_match_id / 1000000000;
  v_game_number := p_match_id % 1000000000;
  -- Only subrooms are implemented here: automatic main-room restart has
  -- separate scheduling hooks in original rs_sttime().
  if v_room not between 1 and 12 or v_game_number <= 0
     or (v_state->>'matchId')::bigint is distinct from p_match_id
     or pg_catalog.jsonb_typeof(v_players) is distinct from 'object'
     or coalesce((v_state->>'gamestate')::integer, 0) < 5 or v_state ? 'settlement' then
    raise exception 'invalid active match snapshot';
  end if;
  select * into v_game from public.acbra2_game g where g.groomid = v_room for update;
  if not found then raise exception 'game row missing'; end if;
  if v_game.gamenum <> v_game_number or v_game.gamestate < 5 or v_game.groomstatus < 40
     or (v_state->>'gametype')::bigint is distinct from v_game.gametype
     or p_ended_at < v_game.starttime then
    raise exception 'active room identity or state mismatch';
  end if;

  -- Do not infer missing type/name/pid/hp fields or reward malformed rows.
  for v_entry in select key, value from pg_catalog.jsonb_each(v_players) loop
    v_p := v_entry.value;
    if pg_catalog.jsonb_typeof(v_p) is distinct from 'object' or not(v_p ?& array['name','type','hp','pid'])
       or v_p->>'name' is distinct from v_entry.key or v_entry.key = '' or position(',' in v_entry.key) > 0
       or pg_catalog.jsonb_typeof(v_p->'name') is distinct from 'string'
       or pg_catalog.jsonb_typeof(v_p->'pid') is distinct from 'number'
       or pg_catalog.jsonb_typeof(v_p->'type') is distinct from 'number'
       or pg_catalog.jsonb_typeof(v_p->'hp') is distinct from 'number'
       or (v_p->>'pid')::bigint <= 0 or (v_p->>'type')::bigint < 0 then
      raise exception 'invalid player roster';
    end if;
    if (v_p->>'type')::integer = 0 then
      foreach v_winner in array array['killnum','npckillnum','lvl','wp','wk','wg','wc','wd','wf','money'] loop
        if coalesce((v_p->>v_winner)::numeric, -1) < 0 then raise exception 'invalid player reward field'; end if;
      end loop;
    end if;
  end loop;
  if (select count(*) <> count(distinct (value->>'pid')::bigint) from pg_catalog.jsonb_each(v_players)) then
    raise exception 'duplicate player pid';
  end if;
  select count(*)::integer, count(*) filter(where (value->>'hp')::numeric > 0)::integer
    into v_valid, v_alive from pg_catalog.jsonb_each(v_players) where (value->>'type')::integer = 0;
  if v_valid <> v_game.validnum then raise exception 'entrant count mismatch'; end if;
  if v_valid = 0 then v_mode := 4;
  elsif v_alive = 0 then v_mode := 1;
  else
    v_mode := 2;
    if v_game.gametype in (14,20) then
      select coalesce(value->>'teamID','') into v_first_team from pg_catalog.jsonb_each(v_players)
        where (value->>'type')::integer=0 and (value->>'hp')::numeric>0 order by (value->>'pid')::bigint limit 1;
      if exists(select 1 from pg_catalog.jsonb_each(v_players) where (value->>'type')::integer=0
        and (value->>'hp')::numeric>0 and (coalesce(value->>'teamID','') <> v_first_team
          or (v_alive > 1 and v_first_team = ''))) then raise exception 'multiple living teams'; end if;
      select coalesce(array_agg(key order by (value->>'pid')::bigint),'{}'::text[]) into v_winners
        from pg_catalog.jsonb_each(v_players) where (value->>'type')::integer=0
          and ((v_first_team <> '' and value->>'teamID'=v_first_team) or (v_first_team='' and (value->>'hp')::numeric>0));
    else
      if v_alive <> 1 then raise exception 'multiple survivors'; end if;
      select array_agg(key) into v_winners from pg_catalog.jsonb_each(v_players)
        where (value->>'type')::integer=0 and (value->>'hp')::numeric>0;
    end if;
  end if;
  v_winner := coalesce(array_to_string(v_winners,','),'');
  v_decision := pg_catalog.jsonb_build_object('ready',true,'winmode',v_mode,'winners',to_jsonb(v_winners),
    'validnum',v_valid,'alivenum',v_alive,'winnum',cardinality(v_winners));

  -- Acquire account locks in a stable order across rooms before updating any
  -- accounts, and reject the whole transaction if even one account is absent.
  for v_entry in select key, value from pg_catalog.jsonb_each(v_players)
    where (value->>'type')::integer=0 order by key loop
    perform 1 from public.acbra2_users u where u.username=v_entry.key for update;
    if not found then raise exception 'settlement account missing'; end if;
  end loop;
  for v_entry in select key, value from pg_catalog.jsonb_each(v_players)
    where (value->>'type')::integer=0 order by (value->>'pid')::bigint loop
    v_p := v_entry.value;
    v_gold := 0; v_credits := 0;
    if v_game.gametype not in (1,10,14,15,16,17) then
      v_gold := case when v_entry.key=any(v_winners) then 120 else 10 end;
      v_credits := case when v_entry.key=any(v_winners) then 200 when (v_p->>'hp')::numeric>0 then 25 else 10 end
        + (v_p->>'killnum')::bigint*10 + (v_p->>'npckillnum')::bigint*2
        + round((v_p->>'lvl')::numeric/2)::bigint
        + least(2000,round(greatest((v_p->>'wp')::numeric,(v_p->>'wk')::numeric,(v_p->>'wg')::numeric,
            (v_p->>'wc')::numeric,(v_p->>'wd')::numeric,(v_p->>'wf')::numeric)/25)::bigint)
        + least(2000,round((v_p->>'money')::numeric/500)::bigint);
    end if;
    -- Preserve original joined-winner-string comparison for wingames.
    v_wins := case when ((v_game.gametype<>15 and v_mode in(2,3,5,7)) or v_game.gametype=1)
      and v_entry.key=v_winner then 1 else 0 end;
    update public.acbra2_users u set credits=u.credits+v_credits, gold=u.gold+v_gold,
      validgames=u.validgames+case when v_game.gametype=15 then 0 else 1 end,
      wingames=u.wingames+v_wins, lastwin=case when v_wins=1 then p_ended_at else u.lastwin end
      where u.username=v_entry.key;
    v_rewards := v_rewards || pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object('username',v_entry.key,
      'credits',v_credits,'gold',v_gold,'validgames',case when v_game.gametype=15 then 0 else 1 end,
      'wingames',v_wins,'lastwin',case when v_wins=1 then p_ended_at else null end));
    if v_entry.key=any(v_winners) then
      v_players := pg_catalog.jsonb_set(v_players,array[v_entry.key,'winner_flag'],to_jsonb(v_mode));
    end if;
  end loop;

  if pg_catalog.jsonb_typeof(p_history) is distinct from 'object'
    or not (p_history ?& array['validlist','winnerpdata'])
    or (p_history - array['validlist','winnerpdata']) <> '{}'::jsonb
    or pg_catalog.jsonb_typeof(p_history->'validlist') is distinct from 'string'
    or pg_catalog.jsonb_typeof(p_history->'winnerpdata') is distinct from 'string' then
    raise exception 'invalid server history encoding';
  end if;
  v_encoded_valid := p_history->>'validlist'; v_encoded_winner := p_history->>'winnerpdata';
  if (v_mode<>4 and v_encoded_valid='') or (cardinality(v_winners)=1 and v_encoded_winner='') then
    raise exception 'missing server history encoding';
  end if;
  -- Original PHP subrooms share acbra2_shistory. This TABLE lock also
  -- serializes legacy INSERT writers which do not take our advisory lock.
  v_history_table := 'acbra2_shistory';
  execute pg_catalog.format('lock table public.%I in share row exclusive mode',v_history_table);
  execute pg_catalog.format('select greatest($1, coalesce(max(gid),0)+1) from public.%I',v_history_table)
    into v_gid using v_game_number;
  select key, (value->>'killnum')::bigint into v_high_kill, v_high_kill_num
    from pg_catalog.jsonb_each(v_players) where (value->>'type')::integer=0
    order by (value->>'killnum')::numeric desc,(value->>'lvl')::numeric desc,(value->>'pid')::bigint limit 1;
  execute pg_catalog.format('insert into public.%I(gid,wmode,winner,gametype,vnum,gstime,getime,gtime,areanum,
    deathnum,alivenum,hdmg,hdp,hkill,hkp,winnernum,"winnerteamID",winnerlist,winnerpdata,validlist)
    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)',v_history_table)
    using v_gid,v_mode,v_winner,v_game.gametype,v_valid,v_game.starttime,p_ended_at,
      greatest(0,p_ended_at-v_game.starttime),v_game.areanum,v_valid-v_alive,v_alive,
      case when v_mode=4 then 0 else v_game.hdamage end,case when v_mode=4 then '' else v_game.hplayer end,
      coalesce(v_high_kill_num,0),coalesce(v_high_kill,''),cardinality(v_winners),
      case when cardinality(v_winners)>1 then coalesce(v_first_team,'') else '' end,
      case when cardinality(v_winners)>1 then v_winner else '' end,v_encoded_winner,v_encoded_valid;

  v_state := v_state || pg_catalog.jsonb_build_object('gamestate',0,'players',v_players,
    'settlement',pg_catalog.jsonb_build_object('historyGid',v_gid,'endedAt',p_ended_at,'winmode',v_mode,
      'winner',v_winner,'hooksPending',true));
  v_receipt := pg_catalog.jsonb_build_object('matchId',p_match_id,'historyGid',v_gid,'endedAt',p_ended_at,
    'snapshot',pg_catalog.jsonb_build_object('version',v_snapshot.version+1,'state',v_state),
    'plan',pg_catalog.jsonb_build_object('decision',v_decision,'winner',v_winner,'rewards',v_rewards),'hooksPending',true);
  insert into dtr_runtime.match_settlements(match_id,receipt) values(p_match_id,v_receipt);
  update dtr_runtime.match_snapshots set version=v_snapshot.version+1,state=v_state,updated_at=pg_catalog.now()
    where match_id=p_match_id;
  update public.acbra2_game set gamenum=v_gid,gamestate=0,starttime=0,
    validnum=v_valid,alivenum=v_alive,deathnum=v_valid-v_alive,winmode=v_mode,winner=v_winner
    where groomid=v_room;
  -- Keep the stable match identity if the earlier mapping migration exists.
  if pg_catalog.to_regclass('dtr_runtime.active_matches') is not null then
    execute 'insert into dtr_runtime.active_matches(room_id,match_id,game_number,history_gid,concluded_at)
      values($1,$2,$3,$4,$5) on conflict(room_id) do update set match_id=excluded.match_id,
      game_number=excluded.game_number,history_gid=excluded.history_gid,concluded_at=excluded.concluded_at,
      updated_at=pg_catalog.now()' using v_room,p_match_id,v_game_number,v_gid,p_ended_at;
  end if;
  return v_receipt;
end
$$;
revoke all on function public.dtr_match_settle(bigint,bigint,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.dtr_match_settle(bigint,bigint,bigint,jsonb) to service_role;

-- Protect terminal snapshots even from a delayed, otherwise higher version
-- command. UPDATE locks the same row as settlement before checking the ledger.
create or replace function public.dtr_match_save(p_match_id bigint,p_version bigint,p_state jsonb)
returns boolean language plpgsql volatile security definer set search_path = ''
as $$
declare affected integer;
begin
  if p_match_id is null or p_match_id<=0 or p_version is null or p_version<0
    or pg_catalog.jsonb_typeof(p_state) is distinct from 'object'
    or (p_state->>'matchId')::bigint is distinct from p_match_id then
    raise exception 'invalid match snapshot';
  end if;
  -- Use a separate lock statement: under READ COMMITTED the following
  -- ledger lookup must see a settlement committed while waiting for the lock.
  perform 1 from dtr_runtime.match_snapshots where match_id=p_match_id for update;
  if exists(select 1 from dtr_runtime.match_settlements where match_id=p_match_id) then return false; end if;
  insert into dtr_runtime.match_snapshots(match_id,version,state,updated_at)
    values(p_match_id,p_version,p_state,pg_catalog.now())
    on conflict(match_id) do update set version=excluded.version,state=excluded.state,updated_at=pg_catalog.now()
      where excluded.version>dtr_runtime.match_snapshots.version;
  get diagnostics affected=row_count;
  return affected=1;
end
$$;
revoke all on function public.dtr_match_save(bigint,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.dtr_match_save(bigint,bigint,jsonb) to service_role;

-- An ended room's game number may now be a different shared history gid.
-- Use the archived mapping ONLY for that ended game; a subsequent active
-- game must derive its new identity, rather than reviving an old match.
create or replace function public.dtr_legacy_user_match(p_username text)
returns table(room_id smallint,match_id bigint,gamenum integer,gamestate smallint,
  gametype smallint,groomtype smallint,groomstatus smallint,starttime bigint,
  validnum integer,alivenum integer,deathnum integer,areanum smallint,weather smallint)
language sql stable security definer set search_path = ''
as $$
  select g.groomid::smallint,
    coalesce(m.match_id,g.groomid::bigint*1000000000+g.gamenum),
    g.gamenum::integer,g.gamestate::smallint,g.gametype::smallint,g.groomtype::smallint,
    g.groomstatus::smallint,g.starttime::bigint,g.validnum::integer,g.alivenum::integer,
    g.deathnum::integer,g.areanum::smallint,g.weather::smallint
  from public.acbra2_users u join public.acbra2_game g on g.groomid=u.roomid
  left join dtr_runtime.active_matches m on m.room_id=g.groomid and g.gamestate=0
    and m.history_gid=g.gamenum and m.concluded_at is not null
  where u.username=p_username and u.roomid>0 and g.groomstatus>=40 limit 1
$$;
revoke all on function public.dtr_legacy_user_match(text) from public,anon,authenticated;
grant execute on function public.dtr_legacy_user_match(text) to service_role;

-- An older experimental RPC exists on some isolated projects but is absent
-- from current runtime code. It trusts caller-supplied awards and can replace
-- ended snapshots, so retire that capability when installing the ledger.
do $$ begin
  if pg_catalog.to_regprocedure('public.dtr_match_commit(bigint,bigint,jsonb,jsonb)') is not null then
    execute 'revoke all on function public.dtr_match_commit(bigint,bigint,jsonb,jsonb) from public,anon,authenticated,service_role';
  end if;
end $$;
