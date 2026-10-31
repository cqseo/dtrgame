-- The original bootstrap checks the signed-in player's inbox on every page.
-- Add the two account-scoped message tables to the synchronous request
-- snapshot while keeping them filtered to the current username.

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
  if p_username is null or char_length(p_username) > 15 then raise exception 'invalid legacy username'; end if;
  if p_tables is null or cardinality(p_tables) = 0 or cardinality(p_tables) > 12 then
    raise exception 'invalid legacy table request';
  end if;

  insert into dtr_runtime.legacy_room_revisions(room_id)
  values (p_room_id)
  on conflict (room_id) do nothing;

  foreach v_logical in array p_tables loop
    if v_logical = 'game' then
      select coalesce(jsonb_agg(to_jsonb(g) order by g.groomid), '[]'::jsonb)
      into v_rows from public.acbra2_game g where g.groomid = p_room_id;
    elseif v_logical = 'users' then
      select coalesce(jsonb_agg(to_jsonb(u) order by u.uid), '[]'::jsonb)
      into v_rows from public.acbra2_users u
      where p_username <> '' and u.username = p_username;
    elseif v_logical = 'messages' then
      select coalesce(jsonb_agg(to_jsonb(m) order by m.mid), '[]'::jsonb)
      into v_rows from public.acbra2_messages m
      where p_username <> '' and (m.receiver = p_username or m.sender = p_username);
    elseif v_logical = 'del_messages' then
      select coalesce(jsonb_agg(to_jsonb(m) order by m.mid), '[]'::jsonb)
      into v_rows from public.acbra2_del_messages m
      where p_username <> '' and (m.receiver = p_username or m.sender = p_username);
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

create or replace function public.dtr_legacy_database_commit(
  p_room_id smallint,
  p_expected_revision bigint,
  p_changes jsonb
)
returns table(revision bigint)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_current bigint;
  v_change jsonb;
  v_operation text;
  v_client_table text;
  v_logical text;
  v_expected_table text;
  v_physical text;
  v_primary_key text;
  v_relation text;
  v_columns text;
  v_updates text;
  v_primary_type text;
begin
  if p_room_id not between 0 and 12 or p_expected_revision < 0 then
    raise exception 'invalid legacy commit identity';
  end if;
  if jsonb_typeof(p_changes) <> 'array' or jsonb_array_length(p_changes) > 500 then
    raise exception 'invalid legacy change set';
  end if;

  perform pg_advisory_xact_lock(20261031, p_room_id::integer);
  insert into dtr_runtime.legacy_room_revisions(room_id)
  values (p_room_id)
  on conflict (room_id) do nothing;
  select r.revision into v_current
  from dtr_runtime.legacy_room_revisions r
  where r.room_id = p_room_id
  for update;
  if v_current <> p_expected_revision then raise exception 'stale legacy room revision'; end if;

  for v_change in select value from jsonb_array_elements(p_changes) loop
    v_operation := v_change->>'operation';
    v_client_table := v_change->>'table';
    if v_client_table = 'acbra2_game' then
      v_physical := 'game'; v_primary_key := 'groomid';
    elseif v_client_table = 'acbra2_users' then
      v_physical := 'users'; v_primary_key := 'uid';
    elseif v_client_table = 'acbra2_messages' then
      v_physical := 'messages'; v_primary_key := 'mid';
    elseif v_client_table = 'acbra2_del_messages' then
      v_physical := 'del_messages'; v_primary_key := 'mid';
    else
      v_logical := regexp_replace(v_client_table, '^acbra2_(s[0-9]+_)?', '');
      if v_logical <> all(array['chat','log','mapitem','maptrap','newsinfo','players','shopitem']::text[]) then
        raise exception 'legacy mutation table is not allowed';
      end if;
      v_expected_table := 'acbra2_' || case when p_room_id = 0 then '' else 's' || p_room_id::text || '_' end || v_logical;
      if v_client_table <> v_expected_table then raise exception 'legacy mutation room mismatch'; end if;
      v_physical := case when p_room_id = 0 then v_logical else 's' || p_room_id::text || '_' || v_logical end;
      v_primary_key := case v_logical
        when 'chat' then 'cid' when 'log' then 'lid' when 'mapitem' then 'iid'
        when 'maptrap' then 'tid' when 'newsinfo' then 'nid'
        when 'players' then 'pid' when 'shopitem' then 'sid'
      end;
    end if;
    v_relation := format('%I.%I', 'public', 'acbra2_' || v_physical);

    select format_type(a.atttypid, a.atttypmod)
    into v_primary_type
    from pg_catalog.pg_attribute a
    where a.attrelid = v_relation::regclass and a.attname = v_primary_key
      and a.attnum > 0 and not a.attisdropped;
    if v_primary_type is null then raise exception 'legacy primary key is unavailable'; end if;

    if v_operation = 'delete' then
      execute format(
        'delete from %s where %I = ($1->>%L)::%s',
        v_relation, v_primary_key, v_primary_key, v_primary_type
      ) using v_change->'key';
    elseif v_operation = 'insert' then
      if jsonb_typeof(v_change->'row') <> 'object' or (v_change->'row' ? v_primary_key) then
        raise exception 'invalid legacy insert row';
      end if;
      select string_agg(format('%I', a.attname), ', ' order by a.attnum)
      into v_columns
      from pg_catalog.pg_attribute a
      where a.attrelid = v_relation::regclass and a.attnum > 0 and not a.attisdropped
        and a.attname <> v_primary_key and (v_change->'row') ? a.attname;
      if v_columns is null then raise exception 'legacy insert names no columns'; end if;
      execute format(
        'insert into %s (%s) select %s from jsonb_populate_record(null::%s, $1) r',
        v_relation, v_columns, v_columns, v_relation
      ) using v_change->'row';
    elseif v_operation = 'upsert' then
      if jsonb_typeof(v_change->'row') <> 'object' or not (v_change->'row' ? v_primary_key) then
        raise exception 'invalid legacy upsert row';
      end if;
      select
        string_agg(format('%I', a.attname), ', ' order by a.attnum),
        string_agg(format('%I = excluded.%I', a.attname, a.attname), ', ' order by a.attnum)
          filter (where a.attname <> v_primary_key)
      into v_columns, v_updates
      from pg_catalog.pg_attribute a
      where a.attrelid = v_relation::regclass and a.attnum > 0 and not a.attisdropped;
      execute format(
        'insert into %s (%s) select %s from jsonb_populate_record(null::%s, $1) r '
        'on conflict (%I) do update set %s',
        v_relation, v_columns, v_columns, v_relation, v_primary_key, v_updates
      ) using v_change->'row';
    else
      raise exception 'legacy mutation operation is not allowed';
    end if;
  end loop;

  update dtr_runtime.legacy_room_revisions r
  set revision = r.revision + 1, updated_at = now()
  where r.room_id = p_room_id
  returning r.revision into v_current;
  return query select v_current;
end
$$;

revoke all on function public.dtr_legacy_database_load(smallint, text, text[]) from public, anon, authenticated;
revoke all on function public.dtr_legacy_database_commit(smallint, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.dtr_legacy_database_load(smallint, text, text[]) to service_role;
grant execute on function public.dtr_legacy_database_commit(smallint, bigint, jsonb) to service_role;
