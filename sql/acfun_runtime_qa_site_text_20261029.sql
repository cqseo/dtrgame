CREATE TABLE acfun_runtime_qa_20261029.runtime_site_text(name text PRIMARY KEY CHECK(name IN ('adminmsg','systemmsg')),content text NOT NULL);
ALTER TABLE acfun_runtime_qa_20261029.runtime_site_text ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON acfun_runtime_qa_20261029.runtime_site_text FROM PUBLIC,anon,authenticated;
CREATE POLICY qa_runtime_read ON acfun_runtime_qa_20261029.runtime_site_text FOR SELECT TO dts_runtime_qa_20261029 USING(true);
GRANT SELECT ON acfun_runtime_qa_20261029.runtime_site_text TO dts_runtime_qa_20261029;
