-- Original accounts use the Worker, not direct Supabase browser access.
-- service_role grants and privileged RPC execution are retained.
begin;
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname='public' and left(tablename,7)='acbra2_' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on table public.%I from public, anon, authenticated', t.tablename);
  end loop;
end $$;
commit;
