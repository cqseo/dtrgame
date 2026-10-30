/**
 * The one object the original's module code uses.
 *
 * Every `->` in the whole module tree is on `$db`, and between them they
 * call twelve methods. `$db` lives in the sys module's variables, so the
 * runtime puts it there and module code reaches it through
 * `eval(import_module('sys'))` like any other module variable.
 *
 * The methods here follow include/db/db_mysql.class.php. Two of its
 * details matter and are easy to lose:
 *
 *   - `array_update()` with `$o_data` writes only the fields whose value
 *     actually changed, and issues no query at all when none did. Writing
 *     every field instead would turn one player's stale copy into an
 *     overwrite of another's concurrent change.
 *   - `fetch_array()` walks a result one row at a time and returns false
 *     when it runs out, which is what every `while ($row = ...)` in the
 *     original depends on.
 */
import { PhpArray, type PhpValue } from "../template/values";

/** A result handle, which the original passes back into fetch_array(). */
export class LegacyQueryResult {
  cursor = 0;
  constructor(readonly rows: readonly PhpArray[]) {}
}

/** One statement the port issued, for tests and for the Supabase binding. */
export interface LegacyStatement {
  readonly sql: string;
}

/**
 * What a database must provide for the original's modules to run.
 *
 * It is deliberately the original's own surface rather than a tidier one:
 * the module code is the specification, and it calls these.
 */
export abstract class LegacyDatabase {
  /** Statements issued, oldest first. */
  readonly issued: LegacyStatement[] = [];

  abstract query(sql: string, type?: string): LegacyQueryResult | boolean;

  /** The next row, or false past the end. */
  fetch_array(result: PhpValue): PhpArray | false {
    if (!(result instanceof LegacyQueryResult)) return false;
    const row = result.rows[result.cursor];
    if (row === undefined) return false;
    result.cursor += 1;
    return row;
  }

  num_rows(result: PhpValue): number {
    return result instanceof LegacyQueryResult ? result.rows.length : 0;
  }

  /** The first column of one row, which the original uses for scalars. */
  result(result: PhpValue, row: PhpValue): PhpValue {
    if (!(result instanceof LegacyQueryResult)) return false;
    const found = result.rows[Number(row) || 0];
    if (!found) return false;
    const firstKey = found.keys()[0];
    return firstKey === undefined ? false : found.get(firstKey);
  }

  data_seek(result: PhpValue, row: PhpValue): void {
    if (result instanceof LegacyQueryResult) result.cursor = Number(row) || 0;
  }

  /**
   * `UPDATE table SET k = 'v', … WHERE where`.
   *
   * With `o_data`, only the fields that differ are written, and nothing is
   * issued when none do. Returns the statement, as the original does.
   */
  array_update(table: string, data: PhpValue, where: string, oData: PhpValue = null): string {
    const fields = data instanceof PhpArray ? data : new PhpArray();
    const original = oData instanceof PhpArray ? oData : null;

    const assignments: string[] = [];
    for (const key of fields.keys()) {
      const value = fields.get(key);
      // The original compares with !==, so a change of type counts as a
      // change even when the values would be equal loosely.
      if (original && original.keys().includes(key) && original.get(key) === value) continue;
      assignments.push(`${String(key)} = '${this.escape(value)}'`);
    }
    if (assignments.length === 0) return "";

    const sql = `UPDATE ${table} SET ${assignments.join(",")} WHERE ${where}`;
    this.query(sql);
    return sql;
  }

  array_insert(table: string, data: PhpValue, onDuplicateUpdate: PhpValue = 0): string {
    const fields = data instanceof PhpArray ? data : new PhpArray();
    const keys = fields.keys().map(String);
    const values = fields.keys().map(key => `'${this.escape(fields.get(key))}'`);
    let sql = `INSERT INTO ${table} (${keys.join(",")}) VALUES (${values.join(",")})`;
    if (onDuplicateUpdate) {
      const updates = keys.map((key, index) => `${key} = ${values[index]}`);
      sql += ` ON DUPLICATE KEY UPDATE ${updates.join(",")}`;
    }
    this.query(sql);
    return sql;
  }

  abstract insert_id(): number;
  abstract affected_rows(): number;

  queries(statements: PhpValue): void {
    const list = statements instanceof PhpArray ? statements.values() : [statements];
    for (const statement of list) this.query(String(statement));
  }

  /** Escapes a value for a single-quoted SQL literal, as the original does. */
  protected escape(value: PhpValue): string {
    return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }
}

/**
 * A database held in memory, for tests and for running a tick without a
 * server.
 *
 * It understands only the statements the original actually issues on the
 * paths that are ported, and refuses anything else rather than guessing.
 * A silent mis-parse here would be a wrong game state, which is the whole
 * thing this port is trying not to do.
 */
export class InMemoryLegacyDatabase extends LegacyDatabase {
  readonly tables = new Map<string, PhpArray[]>();
  #affected = 0;
  #insertId = 0;

  constructor(tables: Readonly<Record<string, readonly PhpArray[]>> = {}) {
    super();
    for (const [name, rows] of Object.entries(tables)) this.tables.set(name, [...rows]);
  }

  override query(sql: string): LegacyQueryResult | boolean {
    this.issued.push({ sql });
    const statement = sql.trim();

    const select = /^SELECT\s+(.+?)\s+FROM\s+(\S+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+.+?)?(?:\s+LIMIT\s+\d+)?$/is.exec(
      statement
    );
    if (select) {
      const rows = this.#rowsOf(select[2] as string).filter(row =>
        this.#matches(row, select[3])
      );
      return new LegacyQueryResult(rows);
    }

    const update = /^UPDATE\s+(\S+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/is.exec(statement);
    if (update) {
      const matching = this.#rowsOf(update[1] as string).filter(row =>
        this.#matches(row, update[3])
      );
      for (const row of matching) {
        for (const [column, value] of this.#assignments(update[2] as string)) {
          row.set(column, value);
        }
      }
      this.#affected = matching.length;
      return true;
    }

    throw new Error(
      `The in-memory database does not understand this statement, and will not ` +
        `guess at it: ${statement}`
    );
  }

  override insert_id(): number {
    return this.#insertId;
  }

  override affected_rows(): number {
    return this.#affected;
  }

  #rowsOf(table: string): PhpArray[] {
    const rows = this.tables.get(table);
    if (!rows) throw new Error(`No table named ${table} in this in-memory database.`);
    return rows;
  }

  /** Only `col='value'`, joined by AND, which is all the ported paths use. */
  #matches(row: PhpArray, where: string | undefined): boolean {
    if (!where) return true;
    return where.split(/\s+AND\s+/i).every(clause => {
      const condition = /^\s*(\S+?)\s*=\s*'(.*)'\s*$/s.exec(clause);
      if (!condition) {
        throw new Error(`Unsupported WHERE clause, refusing to guess: ${clause}`);
      }
      // The original's columns come back from MySQL as strings, and its
      // comparisons are string comparisons, so this compares as strings.
      return String(row.get(condition[1] as string) ?? "") === (condition[2] as string);
    });
  }

  /**
   * Splits `a = 'x',b = 'y'` without being fooled by a comma in a value.
   *
   * The column name must exclude the comma that separates assignments:
   * `\S+?` would happily swallow it and name the second column
   * ",deathnum", so every field but the first would be written to a column
   * that does not exist and the update would appear to do nothing.
   */
  #assignments(text: string): [string, string][] {
    const found: [string, string][] = [];
    const pattern = /([^\s,]+)\s*=\s*'((?:[^'\\]|\\.)*)'/gs;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      found.push([
        match[1] as string,
        (match[2] as string).replace(/\\'/g, "'").replace(/\\\\/g, "\\")
      ]);
    }
    return found;
  }
}
