-- Mutable QA only; source snapshot and production are untouched.
CREATE TABLE acfun_runtime_qa_20261029.runtime_room_sequences (
 roomid integer NOT NULL CHECK(roomid BETWEEN 0 AND 12),
 table_kind text NOT NULL CHECK(table_kind IN ('players','mapitem','maptrap','shopitem','chat','log','newsinfo')),
 next_id bigint NOT NULL CHECK(next_id>0), PRIMARY KEY(roomid,table_kind)
);
ALTER TABLE acfun_runtime_qa_20261029.runtime_room_sequences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON acfun_runtime_qa_20261029.runtime_room_sequences FROM PUBLIC,anon,authenticated;
CREATE POLICY qa_runtime_only ON acfun_runtime_qa_20261029.runtime_room_sequences TO dts_runtime_qa_20261029 USING(true) WITH CHECK(true);
GRANT SELECT,INSERT,UPDATE ON acfun_runtime_qa_20261029.runtime_room_sequences TO dts_runtime_qa_20261029;
DO $$
DECLARE room integer; kind text; target text; primary_field text; highest bigint;
BEGIN
 FOR room IN 0..12 LOOP
  FOREACH kind IN ARRAY ARRAY['players','mapitem','maptrap','shopitem','chat','log','newsinfo'] LOOP
   target:=CASE WHEN room=0 THEN kind ELSE 's'||room||'_'||kind END;
   IF to_regclass('acfun_runtime_qa_20261029.'||target) IS NULL THEN
    EXECUTE format('CREATE TABLE acfun_runtime_qa_20261029.%I (LIKE acfun_runtime_qa_20261029.%I INCLUDING ALL)',target,kind);
    EXECUTE format('ALTER TABLE acfun_runtime_qa_20261029.%I ENABLE ROW LEVEL SECURITY',target);
    EXECUTE format('CREATE POLICY qa_runtime_only ON acfun_runtime_qa_20261029.%I TO dts_runtime_qa_20261029 USING(true) WITH CHECK(true)',target);
   END IF;
   EXECUTE format('REVOKE ALL ON acfun_runtime_qa_20261029.%I FROM PUBLIC,anon,authenticated',target);
   EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON acfun_runtime_qa_20261029.%I TO dts_runtime_qa_20261029',target);
   primary_field:=CASE kind WHEN 'players' THEN 'pid' WHEN 'mapitem' THEN 'iid' WHEN 'maptrap' THEN 'tid' WHEN 'shopitem' THEN 'sid' WHEN 'chat' THEN 'cid' WHEN 'log' THEN 'lid' ELSE 'nid' END;
   EXECUTE format('SELECT coalesce(max(%I),0)+1 FROM acfun_runtime_qa_20261029.%I',primary_field,target) INTO highest;
   INSERT INTO acfun_runtime_qa_20261029.runtime_room_sequences VALUES(room,kind,highest);
  END LOOP;
 END LOOP;
END $$;
