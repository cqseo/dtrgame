import { checkLegacyAttribute, parseLegacyAttributes } from "./item";

export interface LegacyCompoundAttribute { head: string; digits: string; payload: string; }

/** attrbase/get_comp_itmsk_info: ^001 is a literal marker, not a valued attribute. */
export function getLegacyCompoundAttribute(value: string): LegacyCompoundAttribute | null {
  if (!value.startsWith("^")) return null;
  let head = "", digits = "";
  for (const character of value.slice(1)) {
    if (character >= "0" && character <= "9") {
      if (!head) return null;
      digits += character;
    } else head += character;
  }
  head = `^${head}`;
  const separator = head.indexOf("_");
  return { head, digits, payload: separator < 0 ? "" : head.slice(separator + 1) };
}

export function legacyAttributeHeadEquals(attribute: string, head: string): boolean {
  return attribute === head || (head.startsWith("^") && attribute.startsWith(head));
}

/** Includes the enabled attrbase hook; the basic item module only checks literals. */
export function readLegacyAttribute(mark: string, value: string | readonly string[], count = false): boolean | number | string {
  const compound = getLegacyCompoundAttribute(mark);
  if (!compound) return checkLegacyAttribute(mark, value, count);
  const parts = typeof value === "string" ? parseLegacyAttributes(value) : value;
  let found: false | string | number = false;
  for (const part of parts) {
    if (!legacyAttributeHeadEquals(part, compound.head)) continue;
    const data = getLegacyCompoundAttribute(part);
    if (!data) continue;
    found = found === false || found === "" || found === "0" || found === 0 ? data.digits : Number(found) + Number(data.digits);
    if (data.payload && data.payload !== "0") return data.payload;
    if (!count) break;
  }
  return found;
}

/** The strict branch follows PHP's comparison to skhead, including its edge cases. */
export function replaceLegacyAttribute(needle: string, replacement: string, value: string, strict = false): string {
  const compound = getLegacyCompoundAttribute(needle);
  if (compound) return parseLegacyAttributes(value, true).map(part => ((!strict && legacyAttributeHeadEquals(part, compound.head)) || part === compound.head) ? replacement : part).join("");
  if (value.includes("^")) return parseLegacyAttributes(value, true).map(part => part === needle ? replacement : part).join("");
  return value.split(needle).join(replacement);
}

const LEGACY_BASE64_DIGITS = ")!@#$%-~*(";

export function encodeLegacyAttributePayload(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/[0-9]/g, digit => LEGACY_BASE64_DIGITS[Number(digit)]!);
}

export function decodeLegacyAttributePayload(value: string): string {
  let normalized = [...value].map(character => {
    const index = LEGACY_BASE64_DIGITS.indexOf(character);
    return index < 0 ? character : String(index);
  }).join("").replace(/[^A-Za-z0-9+/]/g, "");
  // PHP non-strict base64_decode ignores an incomplete final six-bit group.
  if (normalized.length % 4 === 1) normalized = normalized.slice(0, -1);
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, character => character.charCodeAt(0)));
}

/** Encodes innermost payloads first, preserving the original parallel/nested format. */
export function processLegacyAttributeConfig(value: string): string {
  const pattern = /<:comp_itmsk:>\{([^\{]+?)\}/gs;
  let result = value;
  while (true) {
    const next = result.replace(pattern, (_whole, contents: string) => encodeLegacyAttributePayload(contents.replace(/<:sepr:>/g, ",")));
    if (next === result) return result;
    result = next;
  }
}
