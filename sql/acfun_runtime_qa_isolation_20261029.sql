-- Independent mutable QA copy. Never alter acfun_legacy or the PHP database.
-- Run once. Re-execution fails rather than overwriting existing QA progress.
CREATE ROLE dts_runtime_qa_20261029 NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
CREATE SCHEMA acfun_runtime_qa_20261029;
REVOKE ALL ON SCHEMA acfun_runtime_qa_20261029 FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA acfun_runtime_qa_20261029 TO dts_runtime_qa_20261029;

DO $$
DECLARE t record; c record; seq text; max_id bigint;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables
    WHERE table_schema='acfun_legacy' AND table_type='BASE TABLE'
    AND table_name NOT IN ('snapshot_runs','snapshot_rows','source_tables')
  LOOP
    EXECUTE format('CREATE TABLE acfun_runtime_qa_20261029.%I (LIKE acfun_legacy.%I INCLUDING ALL)',t.table_name,t.table_name);
    EXECUTE format('INSERT INTO acfun_runtime_qa_20261029.%I OVERRIDING SYSTEM VALUE SELECT * FROM acfun_legacy.%I',t.table_name,t.table_name);
    EXECUTE format('ALTER TABLE acfun_runtime_qa_20261029.%I ENABLE ROW LEVEL SECURITY',t.table_name);
    EXECUTE format('REVOKE ALL ON acfun_runtime_qa_20261029.%I FROM PUBLIC, anon, authenticated',t.table_name);
    EXECUTE format('CREATE POLICY qa_runtime_only ON acfun_runtime_qa_20261029.%I TO dts_runtime_qa_20261029 USING (true) WITH CHECK (true)',t.table_name);
    FOR c IN SELECT column_name FROM information_schema.columns WHERE table_schema='acfun_runtime_qa_20261029' AND table_name=t.table_name AND is_identity='YES'
    LOOP
      seq:=pg_get_serial_sequence(format('acfun_runtime_qa_20261029.%I',t.table_name),c.column_name);
      EXECUTE format('SELECT max(%I) FROM acfun_runtime_qa_20261029.%I',c.column_name,t.table_name) INTO max_id;
      PERFORM setval(seq, greatest(coalesce(max_id,1),1), max_id IS NOT NULL AND max_id>0);
    END LOOP;
  END LOOP;
END $$;

-- First checkpoint exposes only the account persistence required by login.
-- Other gameplay tables remain inaccessible until their handlers are ported.
GRANT SELECT ON acfun_runtime_qa_20261029.users, acfun_runtime_qa_20261029.username_weight_index TO dts_runtime_qa_20261029;
GRANT UPDATE (ip,lastvisit) ON acfun_runtime_qa_20261029.users TO dts_runtime_qa_20261029;
ALTER ROLE dts_runtime_qa_20261029 SET search_path = acfun_runtime_qa_20261029,pg_catalog;
ALTER ROLE dts_runtime_qa_20261029 SET statement_timeout = '10s';
ALTER ROLE dts_runtime_qa_20261029 SET idle_in_transaction_session_timeout = '10s';
