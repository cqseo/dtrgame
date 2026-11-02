-- Complete original engine request transactions. Installs DISABLED.
-- No public/anonymous/authenticated access; no live data is copied or changed.
create schema if not exists dtr_runtime;
create table if not exists dtr_runtime.original_control (
  singleton boolean primary key default true check(singleton),
  enabled boolean not null default false,
  revision bigint not null default 0,
  files jsonb not null default '{}'::jsonb,
  directories jsonb not null default '[]'::jsonb,
  counters jsonb not null default '{}'::jsonb
);
insert into dtr_runtime.original_control(singleton) values(true) on conflict do nothing;
create table if not exists dtr_runtime.original_tables (
  table_name text primary key,
  primary_key text not null,
  identity_column boolean not null
);
-- Exact original table inventory is populated by the companion generator.
insert into dtr_runtime.original_tables values
('acbra2_activity_ranking_aprillfool2018','pid',true),
('acbra2_chat','cid',true),
('acbra2_del_messages','mid',true),
('acbra2_game','groomid',false),
('acbra2_history','gid',false),
('acbra2_log','lid',true),
('acbra2_mapitem','iid',true),
('acbra2_maptrap','tid',true),
('acbra2_messages','mid',true),
('acbra2_newsinfo','nid',true),
('acbra2_players','pid',true),
('acbra2_recovery_codes','username',false),
('acbra2_s1_chat','cid',true),
('acbra2_s1_log','lid',true),
('acbra2_s1_mapitem','iid',true),
('acbra2_s1_maptrap','tid',true),
('acbra2_s1_newsinfo','nid',true),
('acbra2_s1_players','pid',true),
('acbra2_s1_shopitem','sid',true),
('acbra2_s2_chat','cid',true),
('acbra2_s2_log','lid',true),
('acbra2_s2_mapitem','iid',true),
('acbra2_s2_maptrap','tid',true),
('acbra2_s2_newsinfo','nid',true),
('acbra2_s2_players','pid',true),
('acbra2_s2_shopitem','sid',true),
('acbra2_s3_chat','cid',true),
('acbra2_s3_log','lid',true),
('acbra2_s3_mapitem','iid',true),
('acbra2_s3_maptrap','tid',true),
('acbra2_s3_newsinfo','nid',true),
('acbra2_s3_players','pid',true),
('acbra2_s3_shopitem','sid',true),
('acbra2_s4_chat','cid',true),
('acbra2_s4_log','lid',true),
('acbra2_s4_mapitem','iid',true),
('acbra2_s4_maptrap','tid',true),
('acbra2_s4_newsinfo','nid',true),
('acbra2_s4_players','pid',true),
('acbra2_s4_shopitem','sid',true),
('acbra2_s5_chat','cid',true),
('acbra2_s5_log','lid',true),
('acbra2_s5_mapitem','iid',true),
('acbra2_s5_maptrap','tid',true),
('acbra2_s5_newsinfo','nid',true),
('acbra2_s5_players','pid',true),
('acbra2_s5_shopitem','sid',true),
('acbra2_s6_chat','cid',true),
('acbra2_s6_log','lid',true),
('acbra2_s6_mapitem','iid',true),
('acbra2_s6_maptrap','tid',true),
('acbra2_s6_newsinfo','nid',true),
('acbra2_s6_players','pid',true),
('acbra2_s6_shopitem','sid',true),
('acbra2_s8_chat','cid',true),
('acbra2_s8_log','lid',true),
('acbra2_s8_mapitem','iid',true),
('acbra2_s8_maptrap','tid',true),
('acbra2_s8_newsinfo','nid',true),
('acbra2_s8_players','pid',true),
('acbra2_s8_shopitem','sid',true),
('acbra2_shistory','gid',false),
('acbra2_shopitem','sid',true),
('acbra2_tmp_players','pid',true),
('acbra2_users','uid',true)
on conflict(table_name) do nothing;
create table if not exists dtr_runtime.original_request_receipts (
  request_id uuid primary key,
  request_digest text not null check(request_digest ~ '^[0-9a-f]{64}$'),
  revision bigint not null unique,
  response jsonb not null,
  created_at timestamptz not null default now()
);
create table if not exists dtr_runtime.original_match_endings (
  room_id bigint not null,
  gamenum bigint not null,
  original_start_time bigint not null,
  request_id uuid not null references dtr_runtime.original_request_receipts(request_id) deferrable initially deferred,
  primary key(room_id,gamenum,original_start_time)
);
alter table dtr_runtime.original_control enable row level security;
alter table dtr_runtime.original_tables enable row level security;
alter table dtr_runtime.original_request_receipts enable row level security;
alter table dtr_runtime.original_match_endings enable row level security;
revoke all on dtr_runtime.original_control,dtr_runtime.original_tables,dtr_runtime.original_request_receipts,dtr_runtime.original_match_endings from public,anon,authenticated;

create or replace function dtr_runtime.original_collect()
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare
  meta record; rows jsonb; tables jsonb:='{}'; counters jsonb; sequence_name text; counter bigint; called boolean;
  control dtr_runtime.original_control%rowtype;
begin
  select * into strict control from dtr_runtime.original_control where singleton;
  counters:=control.counters;
  for meta in select * from dtr_runtime.original_tables order by table_name loop
    execute format('select coalesce(jsonb_agg(to_jsonb(t) order by %I),''[]''::jsonb) from public.%I t',meta.primary_key,meta.table_name) into rows;
    tables:=tables||jsonb_build_object(meta.table_name,rows);
    if meta.identity_column and not(counters ? meta.table_name) then
      sequence_name:=pg_catalog.pg_get_serial_sequence(format('public.%I',meta.table_name),meta.primary_key);
      counter:=0;
      if sequence_name is not null then
        execute format('select last_value,is_called from %s',sequence_name) into counter,called;
        if not called then counter:=0;end if;
      end if;
      execute format('select greatest($1,coalesce(max(%I),0)) from public.%I',meta.primary_key,meta.table_name) into counter using counter;
      counters:=counters||jsonb_build_object(meta.table_name,counter);
    end if;
  end loop;
  return jsonb_build_object('revision',control.revision,'tables',tables,'files',control.files,'directories',control.directories,'counters',counters);
end $$;
revoke all on function dtr_runtime.original_collect() from public,anon,authenticated,service_role;

create or replace function public.dtr_original_load()
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare document jsonb; active boolean;
begin
  select enabled into active from dtr_runtime.original_control where singleton for share;
  if not active then raise exception 'complete original engine is disabled';end if;
  document:=dtr_runtime.original_collect();
  return document||jsonb_build_object('signature',md5(document::text));
end $$;

create or replace function public.dtr_original_commit(
  p_request_id uuid,p_request_digest text,p_expected_revision bigint,p_signature text,
  p_changes jsonb,p_files jsonb,p_directories jsonb,p_counters jsonb,p_response jsonb
)
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare
  control dtr_runtime.original_control%rowtype;
  receipt dtr_runtime.original_request_receipts%rowtype;
  document jsonb; change jsonb; meta record; columns text; assignments text; column_count integer;
  entry record; room_before jsonb; room_after jsonb; n bigint; maximum_id bigint;
begin
  select * into strict control from dtr_runtime.original_control where singleton for update;
  select * into receipt from dtr_runtime.original_request_receipts where request_id=p_request_id;
  if found then
    if receipt.request_digest is distinct from p_request_digest then raise exception 'original request identity mismatch';end if;
    return jsonb_build_object('ok',true,'revision',receipt.revision,'response',receipt.response,'replayed',true);
  end if;
  if not control.enabled then raise exception 'complete original engine is disabled';end if;
  if p_request_digest is null or p_request_digest !~ '^[0-9a-f]{64}$' then raise exception 'invalid original request digest';end if;
  if control.revision is distinct from p_expected_revision then return jsonb_build_object('ok',false,'conflict',true,'revision',control.revision);end if;
  -- Freeze every canonical input while validating the preimage and applying
  -- changes. Even an older writer cannot modify a row between these steps.
  for meta in select * from dtr_runtime.original_tables order by table_name loop
    execute format('lock table public.%I in share row exclusive mode',meta.table_name);
  end loop;
  document:=dtr_runtime.original_collect();
  if md5(document::text) is distinct from p_signature then return jsonb_build_object('ok',false,'conflict',true,'revision',control.revision);end if;
  if jsonb_typeof(p_changes) is distinct from 'array' or jsonb_typeof(p_files) is distinct from 'object'
    or jsonb_typeof(p_directories) is distinct from 'array' or jsonb_typeof(p_counters) is distinct from 'object'
    or jsonb_typeof(p_response) is distinct from 'object' or jsonb_typeof(p_response->'body') is distinct from 'string'
    or (p_response->>'status')::int not between 100 and 599 then raise exception 'invalid original request transaction';end if;
  for entry in select * from jsonb_each(p_files) loop
    if entry.key !~ '^(gamedata/(tmp|bak|javascript|replays|cache)/|log[.]txt$)' or entry.key ~ '(^|/)[.][.](/|$)'
      or jsonb_typeof(entry.value->'content') is distinct from 'string' or jsonb_typeof(entry.value->'mtime') is distinct from 'number'
      or coalesce(entry.value->>'encoding','') not in ('','base64') then raise exception 'invalid original state file';end if;
  end loop;
  for entry in select value from jsonb_array_elements(p_directories) loop
    if jsonb_typeof(entry.value) is distinct from 'string' or (entry.value#>>'{}') !~ '^gamedata(/(tmp|bak|javascript|replays|cache)(/.*)?)?$'
      or (entry.value#>>'{}') ~ '(^|/)[.][.](/|$)' then raise exception 'invalid original state directory';end if;
  end loop;
  for change in select value from jsonb_array_elements(p_changes) loop
    select * into meta from dtr_runtime.original_tables where table_name=change->>'table';
    if not found then raise exception 'original table is not allowed';end if;
    if change->>'operation'='delete' then
      if jsonb_typeof(change->'key') is distinct from 'object' or not(change->'key' ? meta.primary_key) then raise exception 'invalid original delete';end if;
      execute format('delete from public.%I where %I=(jsonb_populate_record(null::public.%I,$1)).%I',meta.table_name,meta.primary_key,meta.table_name,meta.primary_key) using change->'key';
    elsif change->>'operation'='upsert' then
      if jsonb_typeof(change->'row') is distinct from 'object' or not(change->'row' ? meta.primary_key)
        or change->'key'->>meta.primary_key is distinct from change->'row'->>meta.primary_key then raise exception 'invalid original upsert';end if;
      select count(*),string_agg(format('%I',a.attname),',' order by a.attnum),
        string_agg(format('%I=excluded.%I',a.attname,a.attname),',' order by a.attnum) filter(where a.attname<>meta.primary_key)
        into column_count,columns,assignments from pg_catalog.pg_attribute a
        where a.attrelid=format('public.%I',meta.table_name)::regclass and a.attnum>0 and not a.attisdropped;
      if (select count(*) from jsonb_object_keys(change->'row'))<>column_count or exists(
        select 1 from jsonb_object_keys(change->'row') k where not exists(select 1 from pg_catalog.pg_attribute a where a.attrelid=format('public.%I',meta.table_name)::regclass and a.attname=k and a.attnum>0 and not a.attisdropped)
      ) then raise exception 'original row does not match captured schema';end if;
      execute format('insert into public.%I(%s) select %s from jsonb_populate_record(null::public.%I,$1) on conflict(%I) do update set %s',meta.table_name,columns,columns,meta.table_name,meta.primary_key,assignments) using change->'row';
    else raise exception 'original mutation operation is not allowed';end if;
  end loop;
  -- Keep exact MySQL identity state transactionally, including a DROP/CREATE
  -- resetting it. PostgreSQL nextval/setval are intentionally NOT used: their
  -- changes escape rollback. The original engine always allocates in its
  -- serialized working copy and inserts explicit ids here.
  for meta in select * from dtr_runtime.original_tables where identity_column loop
    if jsonb_typeof(p_counters->meta.table_name) is distinct from 'number' then raise exception 'missing original identity counter';end if;
    n:=(p_counters->>meta.table_name)::bigint;
    if n<0 or n>9007199254740991 or (p_counters->>meta.table_name)::numeric<>n then raise exception 'invalid original identity counter';end if;
    execute format('select coalesce(max(%I),0) from public.%I',meta.primary_key,meta.table_name) into maximum_id;
    if n<maximum_id then raise exception 'original identity counter is behind rows';end if;
  end loop;
  for room_after in select to_jsonb(g) from public.acbra2_game g where g.gamestate=0 loop
    select value into room_before from jsonb_array_elements(document->'tables'->'acbra2_game') where value->>'groomid'=room_after->>'groomid';
    if (room_before->>'gamestate')::bigint>=5 then
      insert into dtr_runtime.original_match_endings values((room_before->>'groomid')::bigint,(room_before->>'gamenum')::bigint,(room_before->>'starttime')::bigint,p_request_id);
    end if;
  end loop;
  update dtr_runtime.original_control set revision=revision+1,files=p_files,directories=p_directories,counters=p_counters where singleton returning revision into n;
  insert into dtr_runtime.original_request_receipts(request_id,request_digest,revision,response) values(p_request_id,p_request_digest,n,p_response);
  return jsonb_build_object('ok',true,'revision',n,'response',p_response,'replayed',false);
end $$;

create or replace function public.dtr_original_reconcile(p_request_id uuid,p_request_digest text,p_expected_revision bigint)
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare receipt dtr_runtime.original_request_receipts%rowtype; current_revision bigint;
begin
  select revision into current_revision from dtr_runtime.original_control where singleton for update;
  select * into receipt from dtr_runtime.original_request_receipts where request_id=p_request_id;
  if found then
    if receipt.request_digest is distinct from p_request_digest then raise exception 'original request identity mismatch';end if;
    return jsonb_build_object('ok',true,'revision',receipt.revision,'response',receipt.response,'replayed',true);
  end if;
  -- Acquiring this lock also waits out a currently executing commit. A late
  -- RPC queued behind recovery must fail its old revision after this fence.
  if current_revision=p_expected_revision then
    update dtr_runtime.original_control set revision=revision+1 where singleton returning revision into current_revision;
  end if;
  return jsonb_build_object('ok',false,'conflict',true,'revision',current_revision);
end $$;
revoke all on function public.dtr_original_load(),public.dtr_original_commit(uuid,text,bigint,text,jsonb,jsonb,jsonb,jsonb,jsonb),public.dtr_original_reconcile(uuid,text,bigint) from public,anon,authenticated;
grant execute on function public.dtr_original_load(),public.dtr_original_commit(uuid,text,bigint,text,jsonb,jsonb,jsonb,jsonb,jsonb),public.dtr_original_reconcile(uuid,text,bigint) to service_role;
