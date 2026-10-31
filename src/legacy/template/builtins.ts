/**
 * The PHP library functions the original's templates actually call.
 *
 * The set is taken from an inventory of every directive in the 858 captured
 * templates rather than from a general port of PHP's standard library, so
 * each entry here exists because a template depends on it.
 */
import { pregMatch, pregMatchAll, pregQuote, pregReplace, pregSplit } from "./preg";
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
const byteLength = (value: string): number => utf8.encode(value).length;

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

  // Time.
  time: () => Math.floor(Date.now() / 1000),
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
