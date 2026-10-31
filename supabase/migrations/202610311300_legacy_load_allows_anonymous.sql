-- Let the legacy snapshot load for a visitor who is not logged in.
--
-- dtr_legacy_database_load refused an empty username, which was right
-- while only signed-in game requests used it. The original's pages are
-- served to anyone: index.php, help.php and register.php all run before
-- there is an account, and register.php in particular runs precisely to
-- create one.
--
-- An empty username now means "no account rows", which is what an
-- anonymous visitor should see, rather than being an error. The caller
-- no longer has to invent a username that cannot exist -- the previous
-- attempt used a NUL character, which Postgres text cannot hold, so
-- every anonymous page answered 400.
--
-- Nothing else changes: a non-empty name is still validated and still
-- filtered exactly as before.

create or replace function public.dtr_legacy_database_load(
  p_room_id smallint,
  p_username text,
  p_tables text[] default array['game']::text[]
)
returns table(revision bigint, tables jsonb)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_logical text;
  v_physical text;
  v_primary_key text;
  v_rows jsonb;
  v_tables jsonb := '{}'::jsonb;
begin
  if p_room_id not between 0 and 12 then raise exception 'invalid legacy room id'; end if;
  if p_username is null or char_length(p_username) > 15 then
    raise exception 'invalid legacy username';
  end if;
  if p_tables is null or cardinality(p_tables) = 0 or cardinality(p_tables) > 9 then
    raise exception 'invalid legacy table request';
  end if;

  insert into dtr_runtime.legacy_room_revisions(room_id)
  values (p_room_id)
  on conflict (room_id) do nothing;

  foreach v_logical in array p_tables loop
    if v_logical = 'game' then
      select coalesce(jsonb_agg(to_jsonb(g) order by g.groomid), '[]'::jsonb)
      into v_rows
      from public.acbra2_game g
      where g.groomid = p_room_id;
    elseif v_logical = 'users' then
      -- An empty name is an anonymous visitor, and matches no account.
      select coalesce(jsonb_agg(to_jsonb(u) order by u.uid), '[]'::jsonb)
      into v_rows
      from public.acbra2_users u
      where p_username <> '' and u.username = p_username;
    elseif v_logical = any(array['chat','log','mapitem','maptrap','newsinfo','players','shopitem']::text[]) then
      v_physical := case when p_room_id = 0 then v_logical else 's' || p_room_id::text || '_' || v_logical end;
      v_primary_key := case v_logical
        when 'chat' then 'cid' when 'log' then 'lid' when 'mapitem' then 'iid'
        when 'maptrap' then 'tid' when 'newsinfo' then 'nid'
        when 'players' then 'pid' when 'shopitem' then 'sid'
      end;
      execute format(
        'select coalesce(jsonb_agg(to_jsonb(t) order by %I), ''[]''::jsonb) from %I.%I t',
        v_primary_key, 'public', 'acbra2_' || v_physical
      ) into v_rows;
    else
      raise exception 'legacy table is not allowed: %', v_logical;
    end if;
    v_tables := v_tables || jsonb_build_object(v_logical, coalesce(v_rows, '[]'::jsonb));
  end loop;

  return query
  select r.revision, v_tables
  from dtr_runtime.legacy_room_revisions r
  where r.room_id = p_room_id;
end
$$;

revoke all on function public.dtr_legacy_database_load(smallint, text, text[]) from public, anon, authenticated;
grant execute on function public.dtr_legacy_database_load(smallint, text, text[]) to service_role;
