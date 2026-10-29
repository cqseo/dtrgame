"use strict";
/** Independent, READ-ONLY, per-table source/PG content SHA256 audit.
 * Neither credentials nor account rows leave their respective servers.
 */
const fs=require("node:fs");
const {Client}=require("pg");
const base="/opt/dts-port-workbench-20261029/";
const meta=JSON.parse(fs.readFileSync(base+"all-tables-schema-metadata.json","utf8")).tables;
const expected=JSON.parse(fs.readFileSync(base+"private-per-table-source-fingerprints.json","utf8"));
const raw=fs.readFileSync("/root/.config/dts-migration/supabase.env","utf8").trim();
const parsed=/^DTS_SUPABASE_PG_URL=(['"])([^\r\n]+)\1$/.exec(raw);
if(!parsed)throw new Error("PRIVATE_DATABASE_CONFIG_INVALID");
const url=new URL(parsed[2]);
if(url.hostname!=="db.qtjcjmpapjsgrrgtfica.supabase.co" &&
 !(url.hostname.endsWith(".pooler.supabase.com")&&url.username==="postgres.qtjcjmpapjsgrrgtfica")){
 throw new Error("INCORRECT_STAGING_PROJECT");
}
const pg=new Client({connectionString:url.href,
 ssl:{ca:fs.readFileSync("/root/.config/dts-migration/prod-ca-2021.crt","utf8"),rejectUnauthorized:true},
 connectionTimeoutMillis:15000,statement_timeout:120000});
async function run(){
 await pg.connect();
 if(!pg.connection.stream?.encrypted || !pg.connection.stream?.authorized)throw new Error("UNVERIFIED_TLS");
 let matched=0,totalRows=0;
 const mismatch=[];
 for(const [source,columns] of Object.entries(meta)){
  if(!/^acbra2_[a-z0-9_]+$/.test(source))throw new Error("INVALID_METADATA");
  const dest=source.slice(7);
  const names=columns.map(x=>x.COLUMN_NAME);
  if(names.some(c=>!/^[A-Za-z_][A-Za-z0-9_]*$/.test(c)))throw new Error("BAD_COLUMN");
  const expression=names.map(c=>'COALESCE(octet_length("'+c+'"::text)::text || \':\' || "'+c+'"::text || \';\',\'N;\')').join(" || ");
  const sql='WITH serialized AS (SELECT '+expression+
    ' AS row_text FROM acfun_legacy."'+dest+'"),'+
    " hashed AS (SELECT encode(digest(convert_to(row_text,'UTF8'),'sha256'),'hex') AS row_hash FROM serialized) "+
    "SELECT count(*)::integer AS n, encode(digest(convert_to(COALESCE(string_agg(row_hash,chr(10) ORDER BY row_hash),''),'UTF8'),'sha256'),'hex') AS checksum FROM hashed";
  const out=await pg.query(sql);
  const row=out.rows[0],want=expected[source];
  if(row?.n===want.count && row?.checksum===want.digest){matched++;totalRows+=row.n;}
  else mismatch.push({table:source,sourceCount:want.count,pgCount:row?.n,contentMatches:row?.checksum===want.digest});
 }
 console.log("STAGING_CONTENT_AUDIT",JSON.stringify({matchedTables:matched,totalTables:Object.keys(meta).length,matchedRows:totalRows,mismatches:mismatch,detailsExcluded:true}));
 if(mismatch.length)process.exitCode=2;
}
run().catch(e=>{console.log("STAGING_AUDIT_FAILED",String(e?.code||e?.name||"UNKNOWN"));process.exitCode=1;}).finally(()=>pg.end().catch(()=>{}));