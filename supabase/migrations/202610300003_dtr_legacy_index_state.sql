create or replace function public.dtr_legacy_index_state()
returns table(global_state jsonb, rooms jsonb, site_text jsonb)
language sql stable security definer set search_path = ''
as $$
  select
    coalesce(
      (select to_jsonb(g) from acfun_runtime_qa_20261029.game g where g.groomid = 0 limit 1),
      '{}'::jsonb
    ),
    coalesce(
      (select jsonb_agg(to_jsonb(g) order by g.groomid)
       from acfun_runtime_qa_20261029.game g
       where g.groomid > 0 and g.groomstatus > 0),
      '[]'::jsonb
    ),
    coalesce(
      (select jsonb_object_agg(t.name, t.content)
       from acfun_runtime_qa_20261029.runtime_site_text t),
      '{}'::jsonb
    )
$$;

revoke all on function public.dtr_legacy_index_state() from public, anon, authenticated;
grant execute on function public.dtr_legacy_index_state() to service_role;
