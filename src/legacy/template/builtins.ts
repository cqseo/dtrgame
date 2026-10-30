/**
 * The PHP library functions the original's templates actually call.
 *
 * The set is taken from an inventory of every directive in the 858 captured
 * templates rather than from a general port of PHP's standard library, so
 * each entry here exists because a template depends on it.
 */
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

  // Time.
  time: () => Math.floor(Date.now() / 1000),
  date: ([format, timestamp]) =>
    formatDate(str(format), timestamp === undefined || timestamp === null ? Math.floor(Date.now() / 1000) : int(timestamp), false),
  gmdate: ([format, timestamp]) =>
    formatDate(str(format), timestamp === undefined || timestamp === null ? Math.floor(Date.now() / 1000) : int(timestamp), true)
};

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
