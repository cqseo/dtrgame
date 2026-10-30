/**
 * gencode() and gdecode(), the original's storage format for the columns
 * that hold structured data — roomvars, gamevars, noisevars.
 *
 *   gencode($p) = base64_encode(gzencode(json_encode($p)))
 *   gdecode($p) = $p ? json_decode(gunzip(base64_decode($p)), $assoc) : array()
 *
 * These have to be synchronous, because the interpreter is and PHP is. The
 * Worker's CompressionStream is async, so a synchronous deflate is used
 * instead; src/original-protocol.ts keeps the async pair for the edge,
 * where a Promise is fine.
 *
 * The bytes are made to match what PHP emits, not merely to round-trip.
 * array_update() only writes a column whose value differs from the one it
 * read, so an encoder that produced a different-but-equivalent gzip would
 * make every save look like a change and write every column every time.
 */
import { gunzipSync, gzipSync } from "fflate";
import { PhpArray, type PhpValue } from "../template/values";

/**
 * PHP writes a fixed gzip header: no name, no modification time, XFL 0 and
 * OS 3, whatever the platform. Checked against the live PHP 8.2.35, which
 * emits `1f 8b 08 00 00 00 00 00 00 03` for every payload.
 */
const GZIP_XFL_OFFSET = 8;
const GZIP_OS_OFFSET = 9;
const GZIP_OS_UNIX = 0x03;

/** zlib's default level, which is what PHP's gzencode($data) uses. */
const PHP_DEFAULT_LEVEL = 6;

/**
 * Serialises a value the way PHP's json_encode does by default.
 *
 * JSON.stringify differs in two ways that change the bytes: PHP escapes
 * forward slashes, and PHP escapes every non-ASCII character as \uXXXX
 * rather than emitting UTF-8. Both appear constantly in this game's data —
 * image paths and Chinese text — so neither can be skipped.
 */
export function phpJsonEncode(value: PhpValue): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return encodeNumber(value);
  if (typeof value === "string") return encodeString(value);

  if (value instanceof PhpArray) {
    const keys = value.keys();
    // PHP emits an array only for a list: integer keys 0..n-1, in order.
    const isList = keys.every((key, index) => key === index);
    if (isList) {
      return `[${keys.map(key => phpJsonEncode(value.get(key))).join(",")}]`;
    }
    const members = keys.map(
      key => `${encodeString(String(key))}:${phpJsonEncode(value.get(key))}`
    );
    return `{${members.join(",")}}`;
  }
  return "null";
}

/** PHP prints an integral float as an integer, as json_encode does. */
function encodeNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(value);
}

function encodeString(value: string): string {
  let out = '"';
  for (const character of value) {
    const code = character.codePointAt(0) as number;
    switch (character) {
      case '"': out += '\\"'; continue;
      case "\\": out += "\\\\"; continue;
      // PHP escapes the forward slash unless JSON_UNESCAPED_SLASHES is set,
      // and the original never sets it.
      case "/": out += "\\/"; continue;
      case "\b": out += "\\b"; continue;
      case "\f": out += "\\f"; continue;
      case "\n": out += "\\n"; continue;
      case "\r": out += "\\r"; continue;
      case "\t": out += "\\t"; continue;
      default: break;
    }
    if (code < 0x20) {
      out += `\\u${code.toString(16).padStart(4, "0")}`;
      continue;
    }
    if (code < 0x80) {
      out += character;
      continue;
    }
    // Non-ASCII becomes \uXXXX, as a surrogate pair beyond the BMP.
    for (let index = 0; index < character.length; index += 1) {
      out += `\\u${(character.charCodeAt(index) as number).toString(16).padStart(4, "0")}`;
    }
  }
  return `${out}"`;
}

/** Turns parsed JSON back into PHP values, as json_decode($s, true) does. */
export function toPhpFromJson(value: unknown): PhpValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }
  const array = new PhpArray();
  if (Array.isArray(value)) {
    for (const item of value) array.push(toPhpFromJson(item));
    return array;
  }
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    // PHP turns a numeric object key back into an integer key.
    const numeric = /^(?:0|-?[1-9]\d*)$/.test(key) ? Number(key) : key;
    array.set(numeric, toPhpFromJson(item));
  }
  return array;
}

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), character => character.charCodeAt(0));

/** base64(gzencode(json_encode($value))). */
export function gencode(value: PhpValue): string {
  const json = phpJsonEncode(value);
  const bytes = gzipSync(new TextEncoder().encode(json), {
    level: PHP_DEFAULT_LEVEL,
    // fflate stamps the current time into the header; PHP writes zero.
    mtime: 0
  });
  if (bytes.length > GZIP_OS_OFFSET) {
    bytes[GZIP_XFL_OFFSET] = 0;
    bytes[GZIP_OS_OFFSET] = GZIP_OS_UNIX;
  }
  return toBase64(bytes);
}

/**
 * The inverse. An empty payload gives an empty array, which is what the
 * original returns for a column that was never written.
 */
export function gdecode(value: PhpValue): PhpValue {
  const text = typeof value === "string" ? value : "";
  if (!text) return new PhpArray();
  const json = new TextDecoder().decode(gunzipSync(fromBase64(text)));
  return toPhpFromJson(JSON.parse(json));
}
