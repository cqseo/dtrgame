import { LEGACY_MYSQL_UTF8_WEIGHT_OVERRIDES } from "./generated/legacy-mysql-weights";

const LEGACY_WEIGHTS = new Map<number, number>(LEGACY_MYSQL_UTF8_WEIGHT_OVERRIDES);

/** Exact original utf8_general_ci BMP sort weights, including PAD SPACE. */
export function originalMysqlUsernameKey(value: string): string | null {
  const trimmed = value.replace(/ +$/u, "");
  let key = "";
  for (const char of trimmed) {
    const cp = char.codePointAt(0)!;
    if (cp > 0xffff || (cp >= 0xd800 && cp <= 0xdfff)) return null;
    key += (LEGACY_WEIGHTS.get(cp) ?? cp).toString(16).padStart(4, "0");
  }
  return key;
}

export function originalMysqlUsernameEquals(a: string, b: string): boolean {
  const ka = originalMysqlUsernameKey(a);
  const kb = originalMysqlUsernameKey(b);
  return ka !== null && kb !== null && ka === kb;
}