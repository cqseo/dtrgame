/**
 * Port of the damage-breakdown formatters in base/attack and the base-64
 * digit conversion in base/skillbase.
 *
 * The formatters build the arithmetic the combat log shows a player —
 * "12 + 8 = 20" and the like — so their spacing and signs are part of what
 * the page displays, not cosmetic detail.
 *
 * Held to the original by test/legacy-attack-format.parity.test.mjs.
 */
import { PHP_BUILTINS } from "./template/builtins";
import { looseEquals, toNumber, toStringValue, type PhpValue } from "./template/values";

const isNumeric = (value: PhpValue): boolean => Boolean(PHP_BUILTINS.is_numeric?.([value]));

/**
 * Appends a signed term. A non-numeric value is always shown as an
 * addition, since there is no sign to read from it.
 */
export function addFormat(value: PhpValue, text: PhpValue, space: PhpValue = 1): string {
  let shown = value;
  let sign: string;
  if (isNumeric(value)) {
    sign = toNumber(value) >= 0 ? "+" : "-";
    shown = Math.abs(toNumber(value));
  } else {
    sign = "+";
  }
  if (PHP_BUILTINS.boolval?.([space])) sign = ` ${sign} `;
  return toStringValue(text) + sign + toStringValue(shown);
}

/**
 * Appends a multiplier, or nothing when it is 1.
 *
 * The original reads $asign here, which this function never defines —
 * add_format's variable, left behind. In PHP an undefined variable is null,
 * so with $space truthy the separator becomes two spaces rather than the
 * "×" the line above sets. The multiplication sign only ever appears when
 * $space is falsy. Reproduced as the original behaves, because the combat
 * log shows it.
 */
export function multiplyFormat(value: PhpValue, text: PhpValue, space: PhpValue = 1): string {
  if (looseEquals(value, 1)) return toStringValue(text);
  const sign = PHP_BUILTINS.boolval?.([space]) ? "  " : "×";
  return toStringValue(text) + sign + toStringValue(value);
}

/**
 * Closes a breakdown with its total, or wraps a bare value when there is no
 * arithmetic to close. The spaced "=" is used only when the line already
 * contains a spaced "+".
 */
export function equalsignFormat(value: PhpValue, text: PhpValue, style: PhpValue = null): string {
  const content = toStringValue(text);
  const open = PHP_BUILTINS.boolval?.([style]) ? `<span class="${toStringValue(style)}">` : "<span>";
  const equals = content.includes(" + ") ? " = " : "=";
  if (content.includes("+") || content.includes("×")) {
    return `${content}${equals}${open}${toStringValue(value)}</span>`;
  }
  return `${open}${content}</span>`;
}

/** The original's alphabet: a–z, A–Z, 0–9, then '+' and '-'. */
export function b64ConvToValue(character: PhpValue): number {
  const text = toStringValue(character);
  if (text >= "a" && text <= "z") return text.charCodeAt(0) - "a".charCodeAt(0);
  if (text >= "A" && text <= "Z") return text.charCodeAt(0) - "A".charCodeAt(0) + 26;
  if (text >= "0" && text <= "9") return text.charCodeAt(0) - "0".charCodeAt(0) + 52;
  if (text === "+") return 62;
  if (text === "-") return 63;
  throw new Error(`bad nskill value ${text}`);
}

/** Inverse of b64ConvToValue, refusing anything outside 0–63. */
export function valueConvToB64(value: PhpValue): string {
  const number = toNumber(value);
  if (number >= 0) {
    if (number <= 25) return String.fromCharCode("a".charCodeAt(0) + number);
    if (number <= 51) return String.fromCharCode("A".charCodeAt(0) + number - 26);
    if (number <= 61) return String.fromCharCode("0".charCodeAt(0) + number - 52);
    if (number === 62) return "+";
    if (number === 63) return "-";
  }
  throw new Error(`bad char in skillbase ${toStringValue(value)}`);
}
