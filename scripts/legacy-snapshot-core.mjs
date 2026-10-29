/** Staging-only SQL generation for the ORIGINAL 66-table DTS snapshot. */
export const PREFIX = "acbra2_";
export function assertSourceTable(name) {
 if(typeof name!=="string" || !/^acbra2_[a-z0-9_]+$/.test(name)) {
   throw new Error("Invalid or untrusted original table identifier");
 }
 return name.slice(PREFIX.length);
}
export function assertSchemaColumns(names, expected) {
 if(!Array.isArray(names) || names.length!==expected || new Set(names).size!==expected)
   throw new Error("Incomplete source column list");
 for(const name of names) {
   if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) throw new Error("Unsafe source column identifier");
 }
}
export function buildInsertSql(sourceName, columns) {
 const name=assertSourceTable(sourceName);
 assertSchemaColumns(columns,columns.length);
 const fields=columns.map(c=>'"'+c+'"').join(",");
 return 'INSERT INTO acfun_legacy."'+name+'" ('+fields+') '+
    'SELECT '+fields+' FROM jsonb_populate_recordset('+
    'NULL::acfun_legacy."'+name+'", $1::jsonb) '+
    'ON CONFLICT DO NOTHING';
}
export function safeSnapshotEntry(entry) {
 if(!entry || typeof entry!=="object")throw new Error("Invalid snapshot entry");
 assertSourceTable(entry.table);
 if(!Number.isSafeInteger(entry.rows)||entry.rows<0||!Number.isSafeInteger(entry.fields)||entry.fields<1)
  throw new Error("Invalid source row/column counts");
 if(!/^[0-9a-f]{64}$/.test(entry.sha256_jsonl))throw new Error("Invalid original SHA256");
 return entry;
}
/** Avoid accepting an arbitrary production Postgres URL as the staging destination. */
export function assertDtsSupabaseUrl(value) {
 if(!value) throw new Error("DTS_SUPABASE_PG_URL environment variable not configured");
 const url=new URL(value);
 if(!["postgres:","postgresql:"].includes(url.protocol))throw new Error("Only Postgres URLs allowed");
 const direct=url.hostname==="db.qtjcjmpapjsgrrgtfica.supabase.co";
 const pooler=url.hostname.endsWith(".pooler.supabase.com") && url.username==="postgres.qtjcjmpapjsgrrgtfica";
 if(!direct&&!pooler)throw new Error("Destination is not the authorized dtrgame Supabase project");
 return url;
}