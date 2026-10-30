/**
 * PHP value semantics for the template runtime.
 *
 * Templates branch on PHP's own notions of truth and equality, where "0" is
 * false, "abc" == 0 is false in PHP 8 but "1" == "01" is true, and arrays are
 * ordered maps rather than lists. Approximating any of that with JavaScript's
 * rules would change which branch a page takes, so the conversions are
 * written out explicitly.
 */

export type PhpKey = string | number;
export type PhpValue = null | boolean | number | string | PhpArray;

/** PHP's array: an ordered map with the integer-key rules it applies. */
export class PhpArray {
  private readonly entries = new Map<PhpKey, PhpValue>();
  private nextIndex = 0;

  static from(source: Iterable<PhpValue> | Record<string, PhpValue>): PhpArray {
    const array = new PhpArray();
    if (Symbol.iterator in Object(source)) {
      for (const value of source as Iterable<PhpValue>) array.push(value);
    } else {
      for (const [key, value] of Object.entries(source as Record<string, PhpValue>)) {
        array.set(key, value);
      }
    }
    return array;
  }

  /** PHP casts "7" to 7 for keys, but leaves "07" and "1.5" as strings. */
  static normalizeKey(key: PhpValue): PhpKey {
    if (typeof key === "number") return Number.isInteger(key) ? key : Math.trunc(key);
    if (typeof key === "boolean") return key ? 1 : 0;
    if (key === null) return "";
    if (key instanceof PhpArray) return "Array";
    if (/^(0|-?[1-9][0-9]*)$/.test(key)) {
      const asNumber = Number(key);
      if (Number.isSafeInteger(asNumber)) return asNumber;
    }
    return key;
  }

  get size(): number {
    return this.entries.size;
  }

  has(key: PhpValue): boolean {
    return this.entries.has(PhpArray.normalizeKey(key));
  }

  get(key: PhpValue): PhpValue {
    return this.entries.get(PhpArray.normalizeKey(key)) ?? null;
  }

  set(key: PhpValue, value: PhpValue): void {
    const normalized = PhpArray.normalizeKey(key);
    this.entries.set(normalized, value);
    if (typeof normalized === "number" && normalized >= this.nextIndex) {
      this.nextIndex = normalized + 1;
    }
  }

  push(value: PhpValue): void {
    this.entries.set(this.nextIndex, value);
    this.nextIndex += 1;
  }

  delete(key: PhpValue): void {
    this.entries.delete(PhpArray.normalizeKey(key));
  }

  keys(): PhpKey[] {
    return [...this.entries.keys()];
  }

  values(): PhpValue[] {
    return [...this.entries.values()];
  }

  pairs(): [PhpKey, PhpValue][] {
    return [...this.entries.entries()];
  }

  clone(): PhpArray {
    const copy = new PhpArray();
    for (const [key, value] of this.entries) {
      copy.set(key, value instanceof PhpArray ? value.clone() : value);
    }
    copy.nextIndex = this.nextIndex;
    return copy;
  }
}

/** PHP's leading-numeric-prefix rule, used by arithmetic on strings. */
export function toNumber(value: PhpValue): number {
  if (value === null) return 0;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value;
  if (value instanceof PhpArray) return value.size === 0 ? 0 : 1;
  const match = /^[ \t\n\r\v\f]*[+-]?(?:0[xX][0-9a-fA-F]+|(?:[0-9]*\.[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)/.exec(
    value
  );
  if (!match) return 0;
  const text = match[0].trim();
  return /^[+-]?0[xX]/.test(text) ? 0 : Number(text);
}

export function toInt(value: PhpValue): number {
  const number = toNumber(value);
  return Number.isFinite(number) ? Math.trunc(number) : 0;
}

export function toStringValue(value: PhpValue): string {
  if (value === null) return "";
  if (typeof value === "boolean") return value ? "1" : "";
  if (typeof value === "string") return value;
  if (value instanceof PhpArray) return "Array";
  if (Number.isInteger(value)) return String(value);
  if (!Number.isFinite(value)) return Number.isNaN(value) ? "NAN" : value > 0 ? "INF" : "-INF";
  // PHP prints floats with up to 14 significant digits by default.
  const precise = value.toPrecision(14).replace(/\.?0+$/, "");
  return String(Number(precise));
}

/** PHP's falsy set: false, 0, 0.0, "", "0", null and the empty array. */
export function toBool(value: PhpValue): boolean {
  if (value === null || value === false) return false;
  if (value === true) return true;
  // NAN is truthy in PHP because it is not equal to zero; -0.0 is falsy.
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value !== "" && value !== "0";
  return value.size > 0;
}

const isNumericString = (value: string): boolean =>
  /^[ \t\n\r\v\f]*[+-]?(?:[0-9]*\.[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?[ \t\n\r\v\f]*$/.test(value);

/**
 * PHP 8's == : a number compared with a non-numeric string compares as
 * strings, which reversed PHP 7's behaviour and decides real branches here.
 */
export function looseEquals(left: PhpValue, right: PhpValue): boolean {
  if (left === null && right === null) return true;
  if (typeof left === "boolean" || typeof right === "boolean") return toBool(left) === toBool(right);
  if (left === null) return typeof right === "string" ? right === "" : !toBool(right);
  if (right === null) return typeof left === "string" ? left === "" : !toBool(left);

  if (left instanceof PhpArray || right instanceof PhpArray) {
    if (!(left instanceof PhpArray) || !(right instanceof PhpArray)) return false;
    if (left.size !== right.size) return false;
    for (const [key, value] of left.pairs()) {
      if (!right.has(key) || !looseEquals(value, right.get(key))) return false;
    }
    return true;
  }

  if (typeof left === "number" && typeof right === "number") return left === right;
  if (typeof left === "string" && typeof right === "string") {
    if (isNumericString(left) && isNumericString(right)) return toNumber(left) === toNumber(right);
    return left === right;
  }
  const numberSide = typeof left === "number" ? left : (right as number);
  const stringSide = typeof left === "string" ? left : (right as string);
  if (isNumericString(stringSide)) return numberSide === toNumber(stringSide);
  return toStringValue(numberSide) === stringSide;
}

export function strictEquals(left: PhpValue, right: PhpValue): boolean {
  if (left instanceof PhpArray && right instanceof PhpArray) {
    const a = left.pairs();
    const b = right.pairs();
    if (a.length !== b.length) return false;
    return a.every(([key, value], index) => {
      const other = b[index];
      return other !== undefined && other[0] === key && strictEquals(value, other[1]);
    });
  }
  if (typeof left !== typeof right) return false;
  return left === right;
}

/** PHP's <, >, <= and >= with the same numeric-string handling as ==. */
export function compareValues(left: PhpValue, right: PhpValue): number {
  if (typeof left === "string" && typeof right === "string") {
    if (isNumericString(left) && isNumericString(right)) {
      const a = toNumber(left);
      const b = toNumber(right);
      return a === b ? 0 : a < b ? -1 : 1;
    }
    return left === right ? 0 : left < right ? -1 : 1;
  }
  if (typeof left === "boolean" || typeof right === "boolean" || left === null || right === null) {
    const a = toBool(left);
    const b = toBool(right);
    return a === b ? 0 : a ? 1 : -1;
  }
  if (left instanceof PhpArray && right instanceof PhpArray) {
    return left.size === right.size ? 0 : left.size < right.size ? -1 : 1;
  }
  const a = toNumber(left);
  const b = toNumber(right);
  return a === b ? 0 : a < b ? -1 : 1;
}
