-- PostgreSQL replacements for the original room-open and owner heartbeat files.
-- No copied room is considered live until created in this QA runtime.
CREATE TABLE acfun_runtime_qa_20261029.runtime_room_flags (
 roomid integer PRIMARY KEY CHECK (roomid > 0 AND roomid <= 255),
 is_open boolean NOT NULL DEFAULT true,
 updated_at bigint NOT NULL,
 owner_seen_at bigint
);
ALTER TABLE acfun_runtime_qa_20261029.runtime_room_flags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON acfun_runtime_qa_20261029.runtime_room_flags FROM PUBLIC,anon,authenticated;
CREATE POLICY qa_runtime_only ON acfun_runtime_qa_20261029.runtime_room_flags TO dts_runtime_qa_20261029 USING(true) WITH CHECK(true);
GRANT SELECT,INSERT,UPDATE ON acfun_runtime_qa_20261029.runtime_room_flags TO dts_runtime_qa_20261029;
GRANT SELECT,INSERT ON acfun_runtime_qa_20261029.game TO dts_runtime_qa_20261029;
GRANT UPDATE(gamestate,groomstatus,groomtype,gametype,roomvars) ON acfun_runtime_qa_20261029.game TO dts_runtime_qa_20261029;
GRANT SELECT,DELETE ON acfun_runtime_qa_20261029.roomlisteners TO dts_runtime_qa_20261029;
