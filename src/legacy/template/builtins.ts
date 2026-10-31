/**
 * The PHP library functions the original's templates actually call.
 *
 * The set is taken from an inventory of every directive in the 858 captured
 * templates rather than from a general port of PHP's standard library, so
 * each entry here exists because a template depends on it.
 */
import { pregMatch, pregMatchAll, pregQuote, pregReplace, pregSplit } from "./preg";
import { md5 } from "./md5";
import { toPhpFromJson } from "../php/codec";
import {
  PhpArray,
  compareValues,
  looseEquals,
  toBool,
  toInt,
  toNumber,
  toStringValue,
  type PhpValue
} from "./values";

export type HostFunction = (args: PhpValue[]) => PhpValue;

const str = (value: PhpValue | undefined): string => toStringValue(value ?? null);
const num = (value: PhpValue | undefined): number => toNumber(value ?? null);
const int = (value: PhpValue | undefined): number => toInt(value ?? null);
const arr = (value: PhpValue | undefined): PhpArray =>
  value instanceof PhpArray ? value : new PhpArray();

/** PHP counts bytes, not code points, so strings convert through UTF-8. */
const utf8 = new TextEncoder();
const utf8Decode = new TextDecoder();
export const byteLength = (value: string): number => utf8.encode(value).length;

/** PHP's substr and strpos work on byte offsets. */
function byteSubstr(value: string, start: number, length?: number): string {
  const bytes = utf8.encode(value);
  const from = start < 0 ? Math.max(bytes.length + start, 0) : Math.min(start, bytes.length);
  let to = bytes.length;
  if (length !== undefined) {
    to = length < 0 ? Math.max(bytes.length + length, from) : Math.min(from + length, bytes.length);
  }
  return utf8Decode.decode(bytes.slice(from, to));
}

function htmlSpecialChars(value: string, quotes = true): string {
  let out = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (quotes) out = out.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  return out;
}

/** PHP's date() for the specifiers the templates use. */
function formatDate(format: string, timestamp: number, utc: boolean): string {
  const date = new Date(timestamp * 1000);
  const get = {
    Y: () => (utc ? date.getUTCFullYear() : date.getFullYear()),
    n: () => (utc ? date.getUTCMonth() : date.getMonth()) + 1,
    j: () => (utc ? date.getUTCDate() : date.getDate()),
    G: () => (utc ? date.getUTCHours() : date.getHours()),
    i: () => (utc ? date.getUTCMinutes() : date.getMinutes()),
    s: () => (utc ? date.getUTCSeconds() : date.getSeconds())
  };
  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  let out = "";
  for (let index = 0; index < format.length; index++) {
    const character = format[index] as string;
    switch (character) {
      case "Y": out += String(get.Y()); break;
      case "y": out += pad(get.Y() % 100); break;
      case "m": out += pad(get.n()); break;
      case "n": out += String(get.n()); break;
      case "d": out += pad(get.j()); break;
      case "j": out += String(get.j()); break;
      case "H": out += pad(get.G()); break;
      case "G": out += String(get.G()); break;
      case "i": out += pad(get.i()); break;
      case "s": out += pad(get.s()); break;
      case "\\": index += 1; out += format[index] ?? ""; break;
      default: out += character;
    }
  }
  return out;
}

function varExport(value: PhpValue, depth: number): string {
  const pad = "  ".repeat(depth);
  if (value === null) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  if (value instanceof PhpArray) {
    const lines = [`array (`];
    for (const [key, entry] of value.pairs()) {
      const renderedKey = typeof key === "number" ? String(key) : `'${key.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
      lines.push(`${pad}  ${renderedKey} => ${varExport(entry, depth + 1)},`);
    }
    lines.push(`${pad})`);
    return lines.join("\n");
  }
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

export const PHP_BUILTINS: Readonly<Record<string, HostFunction>> = {
  // Types and inspection.
  is_array: ([value]) => value instanceof PhpArray,
  is_numeric: ([value]) =>
    typeof value === "number" ||
    (typeof value === "string" &&
      /^[ \t\n\r]*[+-]?(?:[0-9]*\.[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?$/.test(value)),
  is_string: ([value]) => typeof value === "string",
  is_int: ([value]) => typeof value === "number" && Number.isInteger(value),
  is_null: ([value]) => (value ?? null) === null,
  intval: ([value]) => int(value),
  floatval: ([value]) => num(value),
  strval: ([value]) => str(value),
  boolval: ([value]) => toBool(value ?? null),

  // Casts, produced by the parser for (int) and friends.
  __cast_int: ([value]) => int(value),
  __cast_integer: ([value]) => int(value),
  __cast_float: ([value]) => num(value),
  __cast_double: ([value]) => num(value),
  __cast_string: ([value]) => str(value),
  __cast_bool: ([value]) => toBool(value ?? null),
  __cast_boolean: ([value]) => toBool(value ?? null),
  __cast_array: ([value]) =>
    value instanceof PhpArray ? value : value === null || value === undefined
      ? new PhpArray()
      : PhpArray.from([value]),

  // Numbers.
  round: ([value, precision]) => {
    const factor = 10 ** int(precision ?? 0);
    const scaled = num(value) * factor;
    // PHP rounds halves away from zero, unlike Math.round.
    const rounded = scaled < 0 ? -Math.round(-scaled) : Math.round(scaled);
    return rounded / factor;
  },
  // PHP's chr() works on bytes: it takes the argument modulo 256, and a
  // negative value wraps up rather than down. map_display_y2coor() builds
  // the map's column letters with it.
  chr: ([value]) => String.fromCharCode(((Math.trunc(num(value)) % 256) + 256) % 256),
  ord: ([value]) => str(value).charCodeAt(0) || 0,
  floor: ([value]) => Math.floor(num(value)),
  ceil: ([value]) => Math.ceil(num(value)),
  abs: ([value]) => Math.abs(num(value)),
  max: args => reduceExtreme(args, 1),
  min: args => reduceExtreme(args, -1),
  number_format: ([value, decimals]) => {
    const fixed = num(value).toFixed(int(decimals ?? 0));
    const [whole, fraction] = fixed.split(".");
    const grouped = (whole ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fraction === undefined ? grouped : `${grouped}.${fraction}`;
  },

  // Strings.
  strlen: ([value]) => byteLength(str(value)),
  mb_strlen: ([value]) => [...str(value)].length,
  strpos: ([haystack, needle, offset]) => {
    const bytes = utf8.encode(str(haystack));
    const target = utf8.encode(str(needle));
    const from = int(offset ?? 0);
    outer: for (let index = from < 0 ? bytes.length + from : from; index + target.length <= bytes.length; index++) {
      for (let step = 0; step < target.length; step++) {
        if (bytes[index + step] !== target[step]) continue outer;
      }
      return index;
    }
    return false;
  },
  substr: ([value, start, length]) =>
    byteSubstr(str(value), int(start), length === undefined || length === null ? undefined : int(length)),
  str_replace: ([search, replace, subject]) => {
    const subjects = str(subject);
    const searches = search instanceof PhpArray ? search.values().map(str) : [str(search)];
    const replacements = replace instanceof PhpArray ? replace.values().map(str) : null;
    let out = subjects;
    searches.forEach((needle, index) => {
      if (needle === "") return;
      const with_ = replacements ? replacements[index] ?? "" : str(replace);
      out = out.split(needle).join(with_);
    });
    return out;
  },
  trim: ([value, characters]) => phpTrim(str(value), characters, true, true),
  ltrim: ([value, characters]) => phpTrim(str(value), characters, true, false),
  rtrim: ([value, characters]) => phpTrim(str(value), characters, false, true),
  strtoupper: ([value]) => str(value).replace(/[a-z]/g, c => c.toUpperCase()),
  strtolower: ([value]) => str(value).replace(/[A-Z]/g, c => c.toLowerCase()),
  ucfirst: ([value]) => {
    const text = str(value);
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  htmlspecialchars: ([value]) => htmlSpecialChars(str(value)),
  htmlentities: ([value]) => htmlSpecialChars(str(value)),
  strip_tags: ([value]) => str(value).replace(/<[^>]*>/g, ""),
  nl2br: ([value]) => str(value).replace(/(\r\n|\n\r|\n|\r)/g, "<br />$1"),
  urlencode: ([value]) =>
    encodeURIComponent(str(value)).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%20/g, "+"),
  rawurlencode: ([value]) => encodeURIComponent(str(value)),
  explode: ([separator, subject, limit]) => {
    const parts = str(subject).split(str(separator));
    const cap = limit === undefined || limit === null ? undefined : int(limit);
    if (cap !== undefined && cap > 0 && parts.length > cap) {
      return PhpArray.from([...parts.slice(0, cap - 1), parts.slice(cap - 1).join(str(separator))]);
    }
    return PhpArray.from(parts);
  },
  implode: ([glue, pieces]) => {
    if (glue instanceof PhpArray) return glue.values().map(str).join(str(pieces));
    return arr(pieces).values().map(str).join(str(glue));
  },
  join: ([glue, pieces]) => arr(pieces).values().map(str).join(str(glue)),
  sprintf: args => phpSprintf(args),
  json_encode: ([value]) => JSON.stringify(toJson(value ?? null)),

  // Arrays.
  count: ([value]) => (value instanceof PhpArray ? value.size : value === null ? 0 : 1),
  sizeof: ([value]) => (value instanceof PhpArray ? value.size : value === null ? 0 : 1),
  in_array: ([needle, haystack, strict]) => {
    const values = arr(haystack).values();
    return toBool(strict ?? false)
      ? values.some(candidate => candidate === needle)
      : values.some(candidate => looseEquals(candidate, needle ?? null));
  },
  array_search: ([needle, haystack]) => {
    for (const [key, value] of arr(haystack).pairs()) {
      if (looseEquals(value, needle ?? null)) return key;
    }
    return false;
  },
  array_keys: ([value]) => PhpArray.from(arr(value).keys() as PhpValue[]),
  array_values: ([value]) => PhpArray.from(arr(value).values()),
  array_key_exists: ([key, value]) => arr(value).has(key ?? null),
  array_flip: ([value]) => {
    const out = new PhpArray();
    for (const [key, item] of arr(value).pairs()) out.set(item, key);
    return out;
  },
  array_merge: args => {
    const out = new PhpArray();
    for (const argument of args) {
      for (const [key, value] of arr(argument).pairs()) {
        if (typeof key === "number") out.push(value);
        else out.set(key, value);
      }
    }
    return out;
  },
  array_pop: ([value]) => {
    const array = arr(value);
    const keys = array.keys();
    const last = keys[keys.length - 1];
    if (last === undefined) return null;
    const popped = array.get(last);
    array.delete(last);
    return popped;
  },
  range: ([start, end, step]) => {
    const out = new PhpArray();
    const from = typeof start === "string" && !/^-?\d/.test(start) ? start.charCodeAt(0) : num(start);
    const to = typeof end === "string" && !/^-?\d/.test(end) ? end.charCodeAt(0) : num(end);
    const characters = typeof start === "string" && !/^-?\d/.test(start);
    const by = Math.abs(num(step ?? 1)) || 1;
    if (from <= to) {
      for (let value = from; value <= to; value += by) out.push(characters ? String.fromCharCode(value) : value);
    } else {
      for (let value = from; value >= to; value -= by) out.push(characters ? String.fromCharCode(value) : value);
    }
    return out;
  },
  sort: ([value]) => {
    if (!(value instanceof PhpArray)) return false;
    const sorted = value.values().sort(compareValues);
    // PHP's sort() reindexes from zero, so the append counter resets too.
    value.reset();
    for (const item of sorted) value.push(item);
    return true;
  },
  /**
   * The sorts that keep the key with the value.
   *
   * sort() renumbers; these four do not, so the array is rebuilt from the
   * reordered pairs rather than pushed into.
   */
  ksort: ([value]) => sortInPlace(value, (a, b) => compareValues(a[0], b[0])),
  krsort: ([value]) => sortInPlace(value, (a, b) => compareValues(b[0], a[0])),
  asort: ([value]) => sortInPlace(value, (a, b) => compareValues(a[1], b[1])),
  arsort: ([value]) => sortInPlace(value, (a, b) => compareValues(b[1], a[1])),

  /**
   * array_slice(). Without preserve_keys, PHP renumbers integer keys from
   * zero but always keeps string keys, which is why this rebuilds rather
   * than copying the pairs across.
   */
  array_slice: ([value, offset, length, preserveKeys]) => {
    const source = arr(value);
    const pairs = source.keys().map(key => [key, source.get(key)] as const);
    const start = int(offset) < 0 ? Math.max(pairs.length + int(offset), 0) : int(offset);
    const end =
      length === undefined || length === null
        ? pairs.length
        : int(length) < 0
          ? pairs.length + int(length)
          : start + int(length);
    const result = new PhpArray();
    const keep = toBool(preserveKeys ?? false);
    for (const [key, item] of pairs.slice(start, Math.max(end, start))) {
      if (keep || typeof key === "string") result.set(key, item);
      else result.push(item);
    }
    return result;
  },
  array_reverse: ([value, preserveKeys]) => {
    const source = arr(value);
    const result = new PhpArray();
    const keep = toBool(preserveKeys ?? false);
    for (const key of source.keys().reverse()) {
      if (keep || typeof key === "string") result.set(key, source.get(key));
      else result.push(source.get(key));
    }
    return result;
  },
  array_sum: ([value]) => arr(value).values().reduce<number>((total, item) => total + toNumber(item), 0),
  array_fill: ([start, count, item]) => {
    const result = new PhpArray();
    for (let index = 0; index < int(count); index += 1) result.set(int(start) + index, item ?? null);
    return result;
  },
  /** array_diff() compares as strings, which is what PHP documents. */
  array_diff: ([first, ...rest]) => {
    const source = arr(first);
    const excluded = new Set(rest.flatMap(other => arr(other).values().map(item => str(item))));
    const result = new PhpArray();
    for (const key of source.keys()) {
      const item = source.get(key);
      if (!excluded.has(str(item))) result.set(key, item);
    }
    return result;
  },
  /** array_unique() keeps the first of each string-equal value and its key. */
  array_unique: ([value]) => {
    const source = arr(value);
    const seen = new Set<string>();
    const result = new PhpArray();
    for (const key of source.keys()) {
      const item = source.get(key);
      const asText = str(item);
      if (seen.has(asText)) continue;
      seen.add(asText);
      result.set(key, item);
    }
    return result;
  },
  str_repeat: ([value, times]) => str(value).repeat(Math.max(int(times), 0)),

  /**
   * The internal-pointer readers, which the original uses to peek at an
   * array rather than to walk one.
   */
  end: ([value]) => {
    const values = arr(value).values();
    return values.length === 0 ? false : (values[values.length - 1] as PhpValue);
  },
  reset: ([value]) => {
    const values = arr(value).values();
    return values.length === 0 ? false : (values[0] as PhpValue);
  },
  current: ([value]) => {
    const values = arr(value).values();
    return values.length === 0 ? false : (values[0] as PhpValue);
  },
  key: ([value]) => {
    const keys = arr(value).keys();
    return keys.length === 0 ? null : (keys[0] as PhpValue);
  },
  /** array_shift() removes the first element and renumbers integer keys. */
  array_shift: ([value]) => {
    if (!(value instanceof PhpArray)) return null;
    const keys = value.keys();
    if (keys.length === 0) return null;
    const first = keys[0] as string | number;
    const removed = value.get(first);
    const rest = keys.slice(1).map(key => [key, value.get(key)] as const);
    value.reset();
    for (const [key, item] of rest) {
      if (typeof key === "string") value.set(key, item);
      else value.push(item);
    }
    return removed;
  },
  array_push: ([value, ...items]) => {
    if (!(value instanceof PhpArray)) return false;
    for (const item of items) value.push(item);
    return value.keys().length;
  },

  /**
   * The PCRE functions. preg_match and preg_match_all write their
   * captures into a by-reference third argument and return a count, so
   * they are given a slot rather than a value; see
   * BUILTIN_REFERENCE_PARAMETERS below.
   */
  preg_match: ([pattern, subject, matches]) => {
    const found = pregMatch(pattern ?? null, subject ?? null);
    if (matches && typeof matches === "object" && "slot" in (matches as object)) {
      (matches as unknown as { slot: { set(value: PhpValue): void } }).slot.set(
        found ?? new PhpArray()
      );
    }
    return found ? 1 : 0;
  },
  preg_match_all: ([pattern, subject, matches]) => {
    const found = pregMatchAll(pattern ?? null, subject ?? null);
    if (matches && typeof matches === "object" && "slot" in (matches as object)) {
      (matches as unknown as { slot: { set(value: PhpValue): void } }).slot.set(found);
    }
    const first = found.get(0);
    return first instanceof PhpArray ? first.keys().length : 0;
  },
  preg_replace: ([pattern, replacement, subject]) =>
    pregReplace(pattern ?? null, replacement ?? null, subject ?? null),
  preg_split: ([pattern, subject, limit, flags]) =>
    pregSplit(pattern ?? null, subject ?? null, limit ?? null, flags ?? null),
  preg_quote: ([subject, delimiter]) => pregQuote(subject ?? null, delimiter ?? null),

  // Hashing. The original's accounts are MD5; see md5.ts for why that
  // is a compatibility requirement rather than a choice.
  md5: ([value]) => md5(str(value)),

  /**
   * var_export, in PHP's own layout.
   *
   * The original uses it inside its error reporting, so what it prints
   * reaches the player when something goes wrong. The format is exact
   * for the types the original exports -- null, bool, int, float, string
   * and array -- because a reader comparing a port's error with the
   * original's would otherwise see a difference that is not a real one.
   */
  var_export: ([value, asString]) => {
    const rendered = varExport(value ?? null, 0);
    return toBool(asString ?? false) ? rendered : rendered;
  },

  // Paths. The original uses these on template and module names, which
  // are paths in form even where nothing is read from disk.
  pathinfo: ([path, options]) => {
    const text = str(path);
    const slash = text.lastIndexOf("/");
    const dir = slash === -1 ? "." : text.slice(0, slash) || "/";
    const base = slash === -1 ? text : text.slice(slash + 1);
    const dot = base.lastIndexOf(".");
    const extension = dot <= 0 ? undefined : base.slice(dot + 1);
    const filename = dot <= 0 ? base : base.slice(0, dot);
    if (options !== undefined && options !== null) {
      switch (int(options)) {
        case 1: return dir;
        case 2: return base;
        case 4: return extension ?? "";
        case 8: return filename;
        default: break;
      }
    }
    const out = new PhpArray();
    out.set("dirname", dir);
    out.set("basename", base);
    // PHP omits the key entirely when there is no extension.
    if (extension !== undefined) out.set("extension", extension);
    out.set("filename", filename);
    return out;
  },
  basename: ([path, suffix]) => {
    const text = str(path).replace(/\/+$/, "");
    const slash = text.lastIndexOf("/");
    let base = slash === -1 ? text : text.slice(slash + 1);
    const ending = suffix === undefined ? "" : str(suffix);
    if (ending !== "" && base !== ending && base.endsWith(ending)) {
      base = base.slice(0, -ending.length);
    }
    return base;
  },
  dirname: ([path]) => {
    const text = str(path).replace(/\/+$/, "");
    const slash = text.lastIndexOf("/");
    if (slash === -1) return ".";
    return text.slice(0, slash) || "/";
  },
  // A Worker has no filesystem; host-environment.ts explains what is and
  // is not kept in memory, and neither of these is ever a directory.
  is_dir: () => false,
  is_file: () => false,

  // JSON decoding; json_encode is already defined above, through the same
  // encoder the game payloads use.
  json_decode: ([value, associative]) => {
    try {
      const parsed = JSON.parse(str(value)) as unknown;
      // The original always passes true; an object without it would be a
      // stdClass, which this port has no representation for.
      if (!toBool(associative ?? false) && parsed !== null && typeof parsed === "object") {
        throw new Error("json_decode without the associative flag is not supported here.");
      }
      return toPhpFromJson(parsed);
    } catch {
      return null;
    }
  },

  uniqid: ([prefix]) => {
    // PHP's uniqid is the current time in microseconds as 13 hex digits.
    const microseconds = Math.floor(Date.now() * 1000);
    return str(prefix) + microseconds.toString(16).padStart(13, "0").slice(-13);
  },

  array_merge_recursive: ([...arrays]) => {
    const merge = (into: PhpArray, from: PhpArray): PhpArray => {
      for (const [key, value] of from.pairs()) {
        if (typeof key === "number") {
          into.push(value);
          continue;
        }
        const existing = into.get(key);
        if (existing instanceof PhpArray && value instanceof PhpArray) {
          merge(existing, value);
        } else if (existing !== null && existing !== undefined && into.has(key)) {
          const combined = new PhpArray();
          combined.push(existing);
          combined.push(value);
          into.set(key, combined);
        } else {
          into.set(key, value);
        }
      }
      return into;
    };
    const out = new PhpArray();
    for (const value of arrays) merge(out, arr(value));
    return out;
  },

  http_build_query: ([data]) => {
    const source = arr(data);
    return source.pairs()
      .map(([key, value]) => `${encodeURIComponent(String(key))}=${encodeURIComponent(str(value))}`)
      .join("&");
  },

  // Maths.
  sqrt: ([value]) => Math.sqrt(num(value)),
  pow: ([base, exponent]) => Math.pow(num(base), num(exponent)),
  exp: ([value]) => Math.exp(num(value)),
  log10: ([value]) => Math.log10(num(value)),
  // PHP's fmod keeps the sign of the dividend, as JavaScript's % does.
  fmod: ([left, right]) => num(left) % num(right),
  hexdec: ([value]) => parseInt(str(value).replace(/[^0-9a-fA-F]/g, ""), 16) || 0,
  is_float: ([value]) => typeof value === "number" && !Number.isInteger(value),

  /**
   * rand() and mt_rand() are the same function from PHP 7.1 on.
   *
   * The sequence is deliberately not reproduced. The original seeds from
   * the system and its rolls are not replayable even against itself, so
   * matching the generator would buy nothing; what has to match is the
   * range, which is inclusive at both ends, and the no-argument form
   * returning 0..mt_getrandmax().
   */
  rand: ([low, high]) => {
    if (low === undefined || high === undefined) return Math.floor(Math.random() * 2147483648);
    const from = int(low);
    const to = int(high);
    return from + Math.floor(Math.random() * (to - from + 1));
  },

  // Arrays.
  array_unshift: ([target, ...values]) => {
    const source = arr(target);
    const moved = source.keys().map(key => [key, source.get(key)] as const);
    source.reset();
    for (const value of values) source.push(value ?? null);
    // String keys keep their name; integer keys are renumbered from the
    // new length, which is what unshift does to a mixed array.
    for (const [key, value] of moved) {
      if (typeof key === "string") source.set(key, value as PhpValue);
      else source.push(value as PhpValue);
    }
    return source.keys().length;
  },
  /**
   * Only the no-callback form, which keeps the truthy values.
   *
   * array_filter($a, 'f') has to call back into the interpreter, which a
   * builtin cannot do, so the runtime binds that form over this one. If
   * this is ever reached with a callback the runtime did not bind, it
   * says so rather than silently filtering on truthiness and quietly
   * changing what the original computed.
   */
  array_filter: ([target, callback]) => {
    if (callback !== undefined && callback !== null) {
      throw new Error("array_filter with a callback must be bound by the module runtime.");
    }
    const source = arr(target);
    const out = new PhpArray();
    for (const key of source.keys()) {
      const value = source.get(key);
      if (toBool(value ?? null)) out.set(key, value ?? null);
    }
    return out;
  },
  array_rand: ([target, count]) => {
    const keys = arr(target).keys();
    if (keys.length === 0) return null;
    const wanted = count === undefined ? 1 : int(count);
    if (wanted <= 1) return keys[Math.floor(Math.random() * keys.length)] ?? null;
    // PHP returns the chosen keys in their original order.
    const chosen = new Set<number>();
    while (chosen.size < Math.min(wanted, keys.length)) {
      chosen.add(Math.floor(Math.random() * keys.length));
    }
    const out = new PhpArray();
    [...chosen].sort((a, b) => a - b).forEach(index => out.push(keys[index] as PhpValue));
    return out;
  },
  array_splice: ([target, offset, length, replacement]) => {
    const source = arr(target);
    const entries = source.keys().map(key => [key, source.get(key)] as const);
    const start = int(offset) < 0 ? Math.max(entries.length + int(offset), 0) : int(offset);
    const count = length === undefined || length === null
      ? entries.length - start
      : int(length) < 0 ? Math.max(entries.length + int(length) - start, 0) : int(length);
    const removed = entries.slice(start, start + count);
    const inserted = replacement instanceof PhpArray
      ? replacement.keys().map(key => replacement.get(key) as PhpValue)
      : replacement === undefined || replacement === null ? [] : [replacement];
    const kept = [...entries.slice(0, start).map(([, v]) => v), ...inserted,
      ...entries.slice(start + count).map(([, v]) => v)];
    source.reset();
    for (const value of kept) source.push(value as PhpValue);
    const out = new PhpArray();
    for (const [, value] of removed) out.push(value as PhpValue);
    return out;
  },
  array_intersect: ([first, ...rest]) => {
    const source = arr(first);
    const others = rest.map(value => new Set(arr(value).keys().map(key => str(arr(value).get(key)))));
    const out = new PhpArray();
    for (const key of source.keys()) {
      const value = source.get(key);
      if (others.every(set => set.has(str(value)))) out.set(key, value ?? null);
    }
    return out;
  },
  array_diff_key: ([first, ...rest]) => {
    const source = arr(first);
    const out = new PhpArray();
    for (const key of source.keys()) {
      if (!rest.some(other => arr(other).has(key))) out.set(key, source.get(key) ?? null);
    }
    return out;
  },
  array_count_values: ([target]) => {
    const source = arr(target);
    const out = new PhpArray();
    for (const key of source.keys()) {
      const value = str(source.get(key));
      out.set(value, int(out.get(value) ?? 0) + 1);
    }
    return out;
  },
  array_combine: ([keys, values]) => {
    const keyList = arr(keys);
    const valueList = arr(values);
    const out = new PhpArray();
    const valueKeys = valueList.keys();
    keyList.keys().forEach((key, index) => {
      const at = valueKeys[index];
      out.set(str(keyList.get(key)), at === undefined ? null : valueList.get(at) ?? null);
    });
    return out;
  },
  shuffle: ([target]) => {
    const source = arr(target);
    const values = source.keys().map(key => source.get(key) as PhpValue);
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j] as PhpValue, values[i] as PhpValue];
    }
    // shuffle() discards the keys and renumbers from zero.
    source.reset();
    for (const value of values) source.push(value);
    return true;
  },
  rsort: ([target]) => {
    const source = arr(target);
    const values = source.keys().map(key => source.get(key) as PhpValue);
    values.sort((left, right) => compareValues(right, left));
    source.reset();
    for (const value of values) source.push(value);
    return true;
  },
  str_split: ([value, length]) => {
    const size = length === undefined ? 1 : Math.max(int(length), 1);
    const bytes = utf8.encode(str(value));
    const out = new PhpArray();
    // PHP splits by bytes, so a multi-byte character can be cut in half;
    // that is the behaviour, not a bug to smooth over.
    for (let index = 0; index < bytes.length; index += size) {
      out.push(utf8Decode.decode(bytes.slice(index, index + size)));
    }
    if (bytes.length === 0) out.push("");
    return out;
  },

  // Strings.
  strstr: ([haystack, needle, before]) => {
    const text = str(haystack);
    const at = text.indexOf(str(needle));
    if (at === -1) return false;
    return toBool(before ?? false) ? text.slice(0, at) : text.slice(at);
  },
  substr_count: ([haystack, needle]) => {
    const text = str(haystack);
    const search = str(needle);
    if (search === "") return 0;
    return text.split(search).length - 1;
  },
  substr_replace: ([subject, replacement, offset, length]) => {
    const text = str(subject);
    const bytes = utf8.encode(text);
    const start = int(offset) < 0 ? Math.max(bytes.length + int(offset), 0) : Math.min(int(offset), bytes.length);
    const count = length === undefined || length === null
      ? bytes.length - start
      : int(length) < 0 ? Math.max(bytes.length + int(length) - start, 0) : int(length);
    return utf8Decode.decode(bytes.slice(0, start)) + str(replacement) +
      utf8Decode.decode(bytes.slice(start + count));
  },
  // mb_substr counts characters where substr counts bytes.
  mb_substr: ([value, start, length]) => {
    const characters = [...str(value)];
    const from = int(start) < 0 ? Math.max(characters.length + int(start), 0) : int(start);
    const to = length === undefined || length === null
      ? characters.length
      : int(length) < 0 ? Math.max(characters.length + int(length), from) : from + int(length);
    return characters.slice(from, to).join("");
  },
  stripslashes: ([value]) => str(value).replace(/\\(.)/g, "$1"),
  htmlspecialchars_decode: ([value]) =>
    str(value).replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
  urldecode: ([value]) => decodeURIComponent(str(value).replace(/\+/g, " ")),
  bin2hex: ([value]) => [...utf8.encode(str(value))]
    .map(byte => byte.toString(16).padStart(2, "0")).join(""),
  base64_encode: ([value]) => {
    const bytes = utf8.encode(str(value));
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  },
  base64_decode: ([value]) => {
    const binary = atob(str(value));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return utf8Decode.decode(bytes);
  },
  version_compare: ([left, right, operator]) => {
    const parse = (value: string) => value.split(/[._\-+]/).map(part => parseInt(part, 10) || 0);
    const a = parse(str(left));
    const b = parse(str(right));
    let sign = 0;
    for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
      const diff = (a[index] ?? 0) - (b[index] ?? 0);
      if (diff !== 0) { sign = diff > 0 ? 1 : -1; break; }
    }
    if (operator === undefined) return sign;
    switch (str(operator)) {
      case "<": case "lt": return sign < 0;
      case "<=": case "le": return sign <= 0;
      case ">": case "gt": return sign > 0;
      case ">=": case "ge": return sign >= 0;
      case "==": case "eq": return sign === 0;
      case "!=": case "ne": case "<>": return sign !== 0;
      default: return null;
    }
  },
  ctype_space: ([value]) => {
    const text = str(value);
    return text.length > 0 && /^\s+$/.test(text);
  },

  // Time.
  time: () => Math.floor(Date.now() / 1000),
  // microtime(true) gives seconds as a float; microtime() gives PHP's
  // "0.00000000 0000000000" pair. The original times its own hot paths
  // with it and warns when one runs long, so both spellings are needed.
  microtime: ([asFloat]) => {
    const seconds = Date.now() / 1000;
    if (toBool(asFloat ?? false)) return seconds;
    const whole = Math.floor(seconds);
    return `${(seconds - whole).toFixed(8)} ${whole}`;
  },
  date: ([format, timestamp]) =>
    formatDate(str(format), timestamp === undefined || timestamp === null ? Math.floor(Date.now() / 1000) : int(timestamp), false),
  gmdate: ([format, timestamp]) =>
    formatDate(str(format), timestamp === undefined || timestamp === null ? Math.floor(Date.now() / 1000) : int(timestamp), true)
};

/**
 * Reorders an array in place, keeping each key with its value.
 *
 * ksort, krsort, asort and arsort all differ only in the comparison, and
 * none of them renumbers, so the array is cleared and refilled from the
 * reordered pairs.
 */
function sortInPlace(
  value: PhpValue | undefined,
  compare: (left: readonly [string | number, PhpValue], right: readonly [string | number, PhpValue]) => number
): boolean {
  if (!(value instanceof PhpArray)) return false;
  const pairs = value.keys().map(key => [key, value.get(key)] as const);
  pairs.sort(compare);
  value.reset();
  for (const [key, item] of pairs) value.set(key, item);
  return true;
}

function reduceExtreme(args: PhpValue[], direction: 1 | -1): PhpValue {
  const candidates = args.length === 1 && args[0] instanceof PhpArray ? (args[0] as PhpArray).values() : args;
  let best: PhpValue | undefined;
  for (const candidate of candidates) {
    if (best === undefined || compareValues(candidate, best) * direction > 0) best = candidate;
  }
  return best ?? false;
}

function phpTrim(value: string, characters: PhpValue | undefined, left: boolean, right: boolean): string {
  const set = characters === undefined || characters === null ? " \n\r\t\v\0" : toStringValue(characters);
  let start = 0;
  let end = value.length;
  if (left) while (start < end && set.includes(value[start] as string)) start += 1;
  if (right) while (end > start && set.includes(value[end - 1] as string)) end -= 1;
  return value.slice(start, end);
}

function phpSprintf(args: PhpValue[]): string {
  const format = toStringValue(args[0] ?? null);
  let argumentIndex = 1;
  return format.replace(/%(?:(\d+)\$)?([-+ 0]*)(\d+)?(?:\.(\d+))?([bdeEfFgGosuxX%])/g,
    (_match, explicit: string | undefined, flags: string, width: string | undefined, precision: string | undefined, type: string) => {
      if (type === "%") return "%";
      const value = args[explicit ? Number(explicit) : argumentIndex++] ?? null;
      let text: string;
      switch (type) {
        case "d": case "u": text = String(toInt(value)); break;
        case "f": case "F": text = toNumber(value).toFixed(precision === undefined ? 6 : Number(precision)); break;
        case "s": text = toStringValue(value); if (precision !== undefined) text = text.slice(0, Number(precision)); break;
        case "x": text = (toInt(value) >>> 0).toString(16); break;
        case "X": text = (toInt(value) >>> 0).toString(16).toUpperCase(); break;
        case "o": text = (toInt(value) >>> 0).toString(8); break;
        case "b": text = (toInt(value) >>> 0).toString(2); break;
        default: text = toStringValue(value);
      }
      if (flags.includes("+") && toNumber(value) >= 0 && "du".includes(type)) text = `+${text}`;
      const target = width === undefined ? 0 : Number(width);
      if (text.length >= target) return text;
      const padding = (flags.includes("0") && !flags.includes("-") ? "0" : " ").repeat(target - text.length);
      return flags.includes("-") ? text + padding : padding + text;
    }
  );
}

function toJson(value: PhpValue): unknown {
  if (value instanceof PhpArray) {
    const keys = value.keys();
    const isList = keys.every((key, index) => key === index);
    if (isList) return value.values().map(toJson);
    return Object.fromEntries(value.pairs().map(([key, item]) => [String(key), toJson(item)]));
  }
  return value;
}

/**
 * Builtins that take an argument by reference.
 *
 * PHP marks these in the function signature; here the caller has to know,
 * because a builtin receives values. Without this, preg_match would be
 * handed the current value of an undefined variable and its captures
 * would go nowhere.
 *
 * An array argument does not need to appear here: PhpArray is mutable, so
 * sort() and array_push() change the caller's array through the value
 * they are given.
 */
export const BUILTIN_REFERENCE_PARAMETERS: Readonly<Record<string, readonly boolean[]>> = {
  preg_match: [false, false, true],
  preg_match_all: [false, false, true]
};
