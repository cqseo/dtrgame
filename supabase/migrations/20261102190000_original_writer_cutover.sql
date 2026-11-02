-- Fence older PHP-adapter/handwritten-kernel writers before adopting the
-- original transaction counters. Installs in LEGACY mode; no cutover occurs.
alter table dtr_runtime.original_control add column if not exists writer_mode text not null default 'legacy'
  check(writer_mode in ('legacy','paused','original'));

create or replace function dtr_runtime.original_writer_guard()
returns trigger language plpgsql volatile security definer set search_path='' as $$
declare active boolean; mode text;
begin
  select enabled,writer_mode into strict active,mode from dtr_runtime.original_control where singleton;
  -- No control-row lock here: DML already owns its table lock. The complete
  -- commit/cutover locks all canonical tables before collecting its preimage,
  -- draining writers that began before the mode changed without lock inversion.
  if (active or mode='paused') and current_setting('dtr.original_write',true) is distinct from 'on' then
    raise exception 'canonical original game writes require the complete transaction boundary';
  end if;
  return null;
end $$;
revoke all on function dtr_runtime.original_writer_guard() from public,anon,authenticated,service_role;
do $$declare meta record;begin
  for meta in select * from dtr_runtime.original_tables order by table_name loop
    execute format('drop trigger if exists dtr_original_writer_guard on public.%I',meta.table_name);
    execute format('create trigger dtr_original_writer_guard before insert or update or delete or truncate on public.%I for each statement execute function dtr_runtime.original_writer_guard()',meta.table_name);
  end loop;
end$$;

create or replace function public.dtr_original_set_mode(p_mode text)
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare control dtr_runtime.original_control%rowtype; meta record; sequence_name text;
  sequence_value bigint; maximum_id bigint; snapshot jsonb;
begin
  if p_mode not in ('legacy','paused','original') or p_mode is null then raise exception 'invalid original writer mode';end if;
  select * into strict control from dtr_runtime.original_control where singleton for update;
  if p_mode<>'paused' and (control.writer_mode<>'paused' or control.enabled) then
    raise exception 'pause original game writes before switching writer mode';
  end if;
  for meta in select * from dtr_runtime.original_tables order by table_name loop
    execute format('lock table public.%I in share row exclusive mode',meta.table_name);
  end loop;
  if p_mode='paused' then
    -- Legacy sequences may have advanced since the last original-engine run.
    -- Recollect them on the next original-mode entry; never reuse old counters.
    update dtr_runtime.original_control set enabled=false,writer_mode='paused',revision=revision+1,
      counters=case when control.writer_mode='legacy' then '{}'::jsonb else counters end where singleton;
  elsif p_mode='original' then
    snapshot:=dtr_runtime.original_collect();
    update dtr_runtime.original_control set enabled=true,writer_mode='original',revision=revision+1,
      counters=snapshot->'counters' where singleton;
  else
    -- setval is nontransactional. A prior, separately committed PAUSED mode
    -- is mandatory: failure leaves all writers paused even if some sequence
    -- adjustments survived. A safe retry finishes the remaining adjustments.
    for meta in select * from dtr_runtime.original_tables where identity_column order by table_name loop
      sequence_name:=pg_catalog.pg_get_serial_sequence(format('public.%I',meta.table_name),meta.primary_key);
      execute format('select coalesce(max(%I),0) from public.%I',meta.primary_key,meta.table_name) into maximum_id;
      sequence_value:=greatest(maximum_id,coalesce((control.counters->>meta.table_name)::bigint,0));
      if sequence_name is not null then
        perform pg_catalog.setval(sequence_name::regclass,greatest(sequence_value,1),sequence_value>0);
      end if;
    end loop;
    update dtr_runtime.original_control set enabled=false,writer_mode='legacy',revision=revision+1 where singleton;
  end if;
  return (select jsonb_build_object('mode',writer_mode,'enabled',enabled,'revision',revision) from dtr_runtime.original_control where singleton);
end $$;
revoke all on function public.dtr_original_set_mode(text) from public,anon,authenticated;
grant execute on function public.dtr_original_set_mode(text) to service_role;
