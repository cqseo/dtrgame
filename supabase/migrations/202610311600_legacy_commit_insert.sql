-- Let the original create a row without naming its key.
--
-- insert_udata() lists every column but uid, because MySQL's
-- AUTO_INCREMENT assigns it, and the same holds for every table whose
-- key is an identity column. The commit protocol only understood
-- 'upsert' and 'delete', so such a row arrived with a key of null,
-- which fails the cast to bigint: registration could complete every
-- check and then lose the account.
--
-- The port cannot assign the key itself. A request loads a snapshot of
-- the rows it needs, so the largest uid it can see says nothing about
-- the largest in the table, and a guess would overwrite another
-- player. The row is inserted without a key and the identity column
-- assigns it, which is what the original relies on MySQL to do.

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
      v_logical := 'game'; v_physical := 'game'; v_primary_key := 'groomid';
    elseif v_client_table = 'acbra2_users' then
      v_logical := 'users'; v_physical := 'users'; v_primary_key := 'uid';
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
    where a.attrelid = v_relation::regclass and a.attname = v_primary_key and a.attnum > 0 and not a.attisdropped;
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
      -- Every column the row names, and only those: the key is left to
      -- the identity column, and anything unnamed takes its default.
      select
        string_agg(format('%I', a.attname), ', ' order by a.attnum)
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

revoke all on function public.dtr_legacy_database_commit(smallint, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.dtr_legacy_database_commit(smallint, bigint, jsonb) to service_role;
