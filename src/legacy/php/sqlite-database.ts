import { LEGACY_SQLITE_SHADOW_SCHEMA, LEGACY_SQLITE_TRANSPORT_SCHEMA } from "../../generated/legacy-sqlite-shadow-schema";
import { LEGACY_RUNTIME_DATA_FILES } from '../../generated/legacy-runtime-source-metadata';
import { PhpArray, type PhpValue } from "../template/values";
import { LegacyDatabase, LegacyQueryResult, SnapshotLegacyDatabase, legacyRowFromJson, type LegacyRowMutation } from "./database";

export interface LegacySqliteConnection {
  exec(sql: string, params?: readonly (string | number | null)[]): Array<{ columns: string[]; values: Array<Array<string | number | null>> }>;
  close(): void;
}

/** MySQL multi_query() statement boundaries, ignoring comments and quoted
 * semicolons. This is also used for the original's fixed schema resets. */
export function splitLegacyStatements(source:string):string[]{
  const statements:string[]=[];let current='',quote='';
  for(let i=0;i<source.length;i++){
    const c=source[i]!;
    if(quote){current+=c;if(c==='\\'&&quote!=='`'&&source[i+1]!==undefined)current+=source[++i];else if(c===quote){if(source[i+1]===quote)current+=source[++i];else quote='';}continue;}
    if(c==="'"||c==='"'||c==='`'){quote=c;current+=c;continue;}
    if(c==='#'||c==='-'&&source[i+1]==='-'&&/\s/.test(source[i+2]??' ')){while(i<source.length&&source[i]!=='\n')i++;current+=' ';continue;}
    if(c==='/'&&source[i+1]==='*'){const end=source.indexOf('*/',i+2);if(end<0)throw new Error('Unterminated SQL comment.');i=end+1;current+=' ';continue;}
    if(c===';'){if(current.trim())statements.push(current.trim());current='';}else current+=c;
  }
  if(quote)throw new Error('Unterminated SQL string.');if(current.trim())statements.push(current.trim());return statements;
}

/** Parse MySQL quoted literals into bound values. No replacement runs inside
 * user text; quotes/backslashes/commas/SQL keywords in names remain data. */
export function bindLegacySql(source: string): { sql: string; params: Array<string | number | null> } {
  let sql = ""; const params: Array<string | number | null> = [];
  for (let i=0; i<source.length; i++) {
    if (source[i] !== "'") { sql += source[i]; continue; }
    let value = ""; let ended=false;
    for (i++; i<source.length; i++) {
      const c = source[i]!;
      if (c === "\\") {
        const next=source[++i];
        if (next===undefined) throw new Error("Unterminated legacy SQL literal.");
        value += ({ "0":"\0", "b":"\b", "n":"\n", "r":"\r", "t":"\t", "Z":"\x1a" } as Record<string,string>)[next] ?? next;
      } else if (c === "'") {
        if (source[i+1] === "'") { value+="'"; i++; }
        else { ended=true; break; }
      } else value += c;
    }
    if (!ended) throw new Error("Unterminated legacy SQL literal.");
    params.push(value); sql += `?${params.length}`;
  }
  return { sql, params };
}

function createTemplateKey(source:string):string{
  const {sql,params}=bindLegacySql(source);
  return JSON.stringify([sql.replace(/^(CREATE\s+TABLE\s+)(?:IF\s+NOT\s+EXISTS\s+)?`?[A-Za-z0-9_]+`?/i,'$1__ORIGINAL_TABLE__').replace(/\s+/g,' ').trim(),params]);
}
const ORIGINAL_CREATE_TEMPLATES=new Set(Object.entries(LEGACY_RUNTIME_DATA_FILES)
  .filter(([name])=>name.startsWith('gamedata/sql/')&&name.endsWith('.sql'))
  .flatMap(([,source])=>splitLegacyStatements(source)).filter(sql=>/^CREATE\s+TABLE\b/i.test(sql)).map(createTemplateKey));

/** Real SQL evaluation over an isolated working copy, before any external
 * commit. Never a source of canonical account or room state. */
export class SqliteLegacyDatabase extends LegacyDatabase {
  readonly #before: Record<string, PhpArray[]>;
  readonly #keys: Record<string,string> = {};
  readonly #nullDefaults:Record<string,Record<string,string>>={};
  readonly #integerColumns:Record<string,string[]>={};
  readonly #integerWritePrepared=new Set<string>();
  #affected=0;
  #insertId=0;
  constructor(readonly connection: LegacySqliteConnection, tables: Readonly<Record<string, readonly PhpArray[]>>,counters:Readonly<Record<string,number>>={}) {
    super(); this.#before = {};
    for(const ddl of Object.values(LEGACY_SQLITE_TRANSPORT_SCHEMA))connection.exec(ddl);
    for (const [name, rows] of Object.entries(tables)) {
      const schema = LEGACY_SQLITE_SHADOW_SCHEMA[name];
      if (!schema) throw new Error(`Unknown original table: ${name}`);
      this.#keys[name]=schema.primaryKey;
      connection.exec(schema.ddl);
      const columns=connection.exec(`PRAGMA table_info("${name}")`)[0]?.values??[];
      this.#nullDefaults[name]=Object.fromEntries(columns
        .filter(column=>Number(column[3])===1).map(column=>[String(column[1]),String(column[2]).toUpperCase()==='TEXT'?"''":'0']));
      // SQLite's INTEGER affinity retains an empty string as text. The
      // original non-strict MySQL connection stores it as zero, including
      // inside batch inserts and CASE updates. Apply this at each write,
      // before subsequent original queries can observe the wrong value.
      // Keep this narrow: other MySQL numeric/range coercions need separate
      // parity evidence and must not be approximated by a generic CAST.
      this.#integerColumns[name]=columns.filter(column=>String(column[2]).toUpperCase()==='INTEGER').map(column=>String(column[1]));
      this.#before[name]=rows.map(r=>r.clone());
      for (const row of rows) {
        const keys=row.keys().map(String);
        if (!keys.length) continue;
        const values=keys.map(k=>row.get(k));
        if(values.some(v=>v instanceof PhpArray || typeof v==='boolean')) throw new Error('SQL snapshot rows must be scalar.');
        connection.exec(`INSERT INTO "${name}" (${keys.map(k=>'"'+k.replaceAll('"','""')+'"').join(',')}) VALUES (${keys.map(()=>'?').join(',')})`, values as (string|number|null)[]);
      }
      // Canonicalize defaults/types once; merely selecting a partially
      // specified fixture must not manufacture changes to every column.
      this.#before[name]=this.rows(name).map(r=>r.clone());
      if(schema.ddl.includes('AUTOINCREMENT')&&counters[name]!==undefined){
        const seq=counters[name]!;const max=this.#before[name].reduce((n,row)=>Math.max(n,Number(row.get(schema.primaryKey))),0);
        if(!Number.isSafeInteger(seq)||seq<max)throw new Error('Original identity counter is invalid: '+name);
        connection.exec('DELETE FROM sqlite_sequence WHERE name=?',[name]);
        connection.exec('INSERT INTO sqlite_sequence(name,seq) VALUES(?,?)',[name,seq]);
      }
    }
  }

  override query(source: string): LegacyQueryResult | boolean {
    this.issued.push({sql:source});
    if(splitLegacyStatements(source).length!==1)throw new Error('Original query() accepts exactly one statement.');
    let { sql, params }=bindLegacySql(source.trim());
    // Original room creation probes installed tables before deciding
    // whether its captured SQL blueprints must be installed.
    const show=/^SHOW\s+TABLES\s+LIKE\s+\?1\s*;?$/i.exec(sql);
    if(show){
      const result=this.connection.exec("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ?",params)[0];
      return new LegacyQueryResult((result?.values??[]).map(row=>legacyRowFromJson({Tables_in_original:row[0]})));
    }
    sql=sql.replace(/\s+FOR\s+UPDATE\s*;?$/i,'');
    const reset=/^(DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?|TRUNCATE\s+(?:TABLE\s+)?)(`?)(acbra2_[A-Za-z0-9_]+)\2\s*;?$/i.exec(sql);
    if(reset){
      const name=reset[3]!;if(!this.#keys[name])throw new Error('Original reset table is not loaded: '+name);
      this.connection.exec(`DELETE FROM "${name}"`);
      if(LEGACY_SQLITE_SHADOW_SCHEMA[name]!.ddl.includes('AUTOINCREMENT'))this.connection.exec('DELETE FROM sqlite_sequence WHERE name=?',[name]);
      this.#affected=0;return true;
    }
    const create=/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(acbra2_[A-Za-z0-9_]+)`?\s*\(/i.exec(sql);
    if(create){
      const name=create[1]!;if(!this.#keys[name])throw new Error('Original schema table is not loaded: '+name);
      if(!ORIGINAL_CREATE_TEMPLATES.has(createTemplateKey(source)))throw new Error('CREATE does not match an immutable original reset script.');
      // The generated complete original schema already includes fields
      // subsequently installed by the original module ALTERs. SQL reset
      // scripts clear rows/identities; they cannot change that schema.
      return true;
    }
    // Only original DML is allowed. Requests cannot execute schema/pragma,
    // attach files or introduce a second statement into the working engine.
    if (!/^(SELECT|UPDATE|INSERT|DELETE|REPLACE)\b/i.test(sql) || /;\s*\S/.test(sql)) throw new Error('Unsupported original SQL statement.');
    const insertSet=/^INSERT\s+(?:INTO\s+)?(\S+)\s+SET\s+(.+)$/is.exec(sql);
    if(insertSet) {
      const fields=insertSet[2]!.split(',').map(x=>/^\s*([^=\s]+)\s*=\s*(.+)\s*$/s.exec(x));
      if(fields.some(x=>!x)) throw new Error('Invalid original INSERT SET.');
      sql=`INSERT INTO ${insertSet[1]} (${fields.map(x=>x![1]).join(',')}) VALUES (${fields.map(x=>x![2]).join(',')})`;
    }
    sql=sql.replace(/\bON\s+DUPLICATE\s+KEY\s+UPDATE\b/i,'ON CONFLICT DO UPDATE SET')
      .replace(/\bRAND\s*\(\s*\)/gi,'(abs(random()) / 9223372036854775808.0)')
      .replace(/\bIF\s*\(/gi,'IIF(').replace(/\bGREATEST\s*\(/gi,'MAX(').replace(/\bLEAST\s*\(/gi,'MIN(');
    const conflict=sql.search(/\bON CONFLICT DO UPDATE SET\b/i);
    if(conflict>=0)sql=sql.slice(0,conflict)+sql.slice(conflict).replace(/\bVALUES\s*\(\s*(`?[A-Za-z0-9_]+`?)\s*\)/gi,'excluded.$1');
    sql=this.#coerceNonNullUpdates(sql);
    const written=/^(?:UPDATE\s+|(?:INSERT|REPLACE)\s+(?:INTO\s+)?)`?(acbra2_[A-Za-z0-9_]+)`?/i.exec(sql)?.[1];
    if(written)this.#prepareIntegerWrites(written);
    const result=this.connection.exec(sql,params);
    if(/^SELECT\b/i.test(sql)) {
      const set=result[0];
      return new LegacyQueryResult(set ? set.values.map(values=>legacyRowFromJson(Object.fromEntries(set.columns.map((k,i)=>[k,values[i]??null])))) : []);
    }
    const meta=this.connection.exec('SELECT changes(),last_insert_rowid()')[0]?.values[0];
    this.#affected=Number(meta?.[0]??0); this.#insertId=Number(meta?.[1]??0);
    return true;
  }

  #prepareIntegerWrites(name:string){
    // Most requests touch only one or two of the hundred canonical tables.
    // Loading a valid PostgreSQL snapshot needs no coercion triggers; install
    // them only before the first original write to that particular table.
    if(this.#integerWritePrepared.has(name))return;
    const integers=this.#integerColumns[name];if(!integers?.length)return;
    const when=integers.map(column=>`NEW."${column}"=''`).join(' OR ');
    const assignments=integers.map(column=>`"${column}"=CASE WHEN NEW."${column}"='' THEN 0 ELSE NEW."${column}" END`).join(',');
    for(const event of ['INSERT','UPDATE'])this.connection.exec(`CREATE TRIGGER "${name}_empty_integer_${event}" AFTER ${event} ON "${name}" WHEN ${when} BEGIN UPDATE "${name}" SET ${assignments} WHERE "${this.#keys[name]}" IS NEW."${this.#keys[name]}"; END`);
    this.#integerWritePrepared.add(name);
  }

  #coerceNonNullUpdates(sql:string):string{
    const update=/^UPDATE\s+`?(acbra2_[A-Za-z0-9_]+)`?\s+SET\s+/i.exec(sql);
    if(!update)return sql;
    const defaults=this.#nullDefaults[update[1]!]??{};
    // Original mysqli explicitly uses sql_mode=''. A sparse batch CASE
    // yields SQL NULL for rows with no WHEN; MySQL converts that to the
    // column type's implicit default (not its old value). SQLite instead
    // rejects NOT NULL, which broke the original 荣耀 NPC pickup/reset path.
    const body=sql.slice(update[0].length),parts:string[]=[];
    let depth=0,quote='',start=0,end=body.length;
    for(let i=0;i<body.length;i++){
      const c=body[i]!;
      if(quote){if(c===quote)quote='';continue;}
      if(c==='`'||c==='"'){quote=c;continue;}
      if(c==='(')depth++;else if(c===')')depth--;
      if(depth===0&&/^WHERE\b/i.test(body.slice(i))&&(i===0||/\s/.test(body[i-1]!))){end=i;break;}
      if(depth===0&&c===','){parts.push(body.slice(start,i));start=i+1;}
    }
    parts.push(body.slice(start,end));
    const adapted=parts.map(part=>{
      const assignment=/^(\s*`?([A-Za-z0-9_]+)`?\s*=\s*)([\s\S]*?)\s*$/.exec(part);
      const fallback=assignment&&defaults[assignment[2]!];
      return assignment&&fallback!==undefined?assignment[1]+`COALESCE((${assignment[3]}),${fallback})`:part;
    }).join(',');
    return update[0]+adapted+(end<body.length?' '+body.slice(end):'');
  }

  rows(table: string): PhpArray[] {
    if(!this.#keys[table]) throw new Error(`Table not loaded: ${table}`);
    const result=this.connection.exec(`SELECT * FROM "${table}"`)[0];
    return result ? result.values.map(values=>legacyRowFromJson(Object.fromEntries(result.columns.map((k,i)=>[k,values[i]??null])))) : [];
  }
  mutations(): LegacyRowMutation[] {
    const diff=new SnapshotLegacyDatabase(this.#before);
    for(const table of Object.keys(this.#keys)) diff.tables.set(table,this.rows(table));
    return diff.mutations(this.#keys);
  }
  counters():Record<string,number>{
    const result:Record<string,number>={};
    for(const name of Object.keys(this.#keys))if(LEGACY_SQLITE_SHADOW_SCHEMA[name]!.ddl.includes('AUTOINCREMENT'))result[name]=0;
    const rows=this.connection.exec('SELECT name,seq FROM sqlite_sequence')[0]?.values??[];
    for(const [name,seq]of rows)if(typeof name==='string'&&Object.hasOwn(result,name))result[name]=Number(seq);
    return result;
  }
  override affected_rows():number{return this.#affected;}
  override insert_id():number{return this.#insertId;}
  override queries(statements:PhpValue):void {
    const list=statements instanceof PhpArray?statements.values():[statements];
    for(const source of list){if(typeof source!=='string')throw new Error('Original SQL batch must be text.');for(const sql of splitLegacyStatements(source))this.query(sql);}
  }
  close():void{this.connection.close();}
}
