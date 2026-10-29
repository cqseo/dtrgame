/** Common PHP 7.4 coercions used by the original game modules. */
export function phpEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === false) return true;
  if (typeof value === "number") return value === 0 || Number.isNaN(value);
  if (typeof value === "bigint") return value === 0n;
  if (typeof value === "string") return value === "" || value === "0";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function phpBool(value: unknown): boolean {
  return !phpEmpty(value);
}

/** PHP 7.4 numeric conversion accepts a leading numeric portion. */
export function phpNumber(value: unknown): number {
  if (value === null || value === undefined || value === false) return 0;
  if (value === true) return 1;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const match = value.trimStart().match(/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?/);
    return match ? Number(match[0]) : 0;
  }
  return Array.isArray(value) ? (value.length ? 1 : 0) : 1;
}

export function phpInt(value: unknown): number {
  return Math.trunc(phpNumber(value));
}

export function phpString(value: unknown): string {
  if (value === undefined || value === null || value === false) return "";
  if (value === true) return "1";
  if (Array.isArray(value)) return "Array";
  if (typeof value === "object") return "Object";
  return String(value);
}

export function phpArrayKey(value: unknown): string | number {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return Math.trunc(value);
  if (typeof value === "string" && /^(?:0|-?[1-9]\d*)$/.test(value)) return Number(value);
  return phpString(value);
}

/** The scalar cases used by original conditions and array searches. */
export function phpLooseEqual(left: unknown, right: unknown): boolean {
  if (typeof left === "boolean" || typeof right === "boolean" || left === null || right === null) return phpBool(left) === phpBool(right);
  if (typeof left === "number" && typeof right === "string") return left === phpNumber(right);
  if (typeof left === "string" && typeof right === "number") return phpNumber(left) === right;
  if (typeof left === "bigint" || typeof right === "bigint") return phpNumber(left) === phpNumber(right);
  return left === right;
}
