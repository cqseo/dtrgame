/**
 * PHP's PCRE functions.
 *
 * The original uses these everywhere — validating a username, splitting an
 * item code, rewriting a log line — so they have to behave as PHP's do,
 * not merely as something regex-shaped.
 *
 * Three differences from JavaScript matter:
 *
 *   - A PHP pattern carries its own delimiters and trailing modifiers,
 *     `/foo/is`, rather than being a bare expression.
 *   - preg_match writes its captures into a by-reference third argument
 *     and returns 1 or 0, not the match itself.
 *   - An unmatched optional group is an empty string in PHP's $matches,
 *     where JavaScript gives undefined.
 */
import { PhpArray, toStringValue, type PhpValue } from "./values";

/** A PHP pattern, taken apart into what JavaScript needs. */
export interface ParsedPattern {
  readonly source: string;
  readonly flags: string;
}

const CLOSING: Record<string, string> = { "(": ")", "[": "]", "{": "}", "<": ">" };

/**
 * Splits `/foo/is` into its expression and flags.
 *
 * The delimiter is whatever character the pattern opens with, and the
 * bracket styles pair rather than repeat. Modifiers PHP has and
 * JavaScript does not are translated or dropped deliberately:
 *
 *   u  unicode, which JavaScript spells the same
 *   x  extended; whitespace and # comments are stripped here instead
 *   D, A, S, U  have no JavaScript equivalent and do not change what
 *      these patterns match in this codebase, so they are dropped
 */
export function parsePattern(pattern: string): ParsedPattern | null {
  const text = String(pattern);
  const delimiter = text[0];
  /*
   * PHP warns and returns false for an empty pattern rather than
   * failing. The original relies on that: gamedata/banlist.list ships
   * with $iplimit = '', and register.php tests
   * `preg_match($iplimit, $onlineip)` on every registration. Throwing
   * here made every registration an error on a site that bans no IPs.
   */
  if (!delimiter) return null;
  const closing = CLOSING[delimiter] ?? delimiter;

  const end = text.lastIndexOf(closing);
  if (end <= 0) throw new Error(`Unterminated regular expression: ${text}`);

  let source = text.slice(1, end);
  const modifiers = text.slice(end + 1);

  let flags = "";
  if (modifiers.includes("i")) flags += "i";
  if (modifiers.includes("m")) flags += "m";
  if (modifiers.includes("s")) flags += "s";
  if (modifiers.includes("u")) flags += "u";

  if (modifiers.includes("x")) {
    // Extended mode: unescaped whitespace and # comments are not literal.
    source = source.replace(/\\[\s\S]|\[[^\]]*\]|\s+|#.*$/gm, match => {
      if (match.startsWith("\\") || match.startsWith("[")) return match;
      return "";
    });
  }

  // PHP's \A and \z have no JavaScript spelling; ^ and $ with no multiline
  // flag mean the same thing here.
  source = source.replace(/\\A/g, "^").replace(/\\z/g, "$").replace(/\\Z/g, "$");

  return { source, flags };
}

const compile = (pattern: PhpValue, extra = ""): RegExp | null => {
  const parsed = parsePattern(toStringValue(pattern));
  if (!parsed) return null;
  return new RegExp(parsed.source, parsed.flags + extra);
};

/** Captures as PHP reports them: an absent group is "" rather than undefined. */
function captures(match: RegExpExecArray): PhpArray {
  const array = new PhpArray();
  for (let index = 0; index < match.length; index += 1) {
    array.set(index, match[index] ?? "");
  }
  // Named groups sit alongside the numbered ones in PHP.
  for (const [name, value] of Object.entries(match.groups ?? {})) {
    array.set(name, value ?? "");
  }
  return array;
}

/**
 * Replacement references: PHP writes `$1`, `\1` and `${1}`, JavaScript
 * only `$1`. Backslash form and braces are converted; `$0` is the whole
 * match in both.
 */
function toJsReplacement(replacement: string): string {
  return replacement
    .replace(/\$\{(\d+)\}/g, "$$$1")
    .replace(/\\(\d+)/g, "$$$1");
}

export const pregMatch = (pattern: PhpValue, subject: PhpValue): PhpArray | null | false => {
  const expression = compile(pattern);
  // An empty pattern: PHP warns and returns false.
  if (!expression) return false;
  const match = expression.exec(toStringValue(subject));
  return match ? captures(match) : null;
};

export const pregMatchAll = (pattern: PhpValue, subject: PhpValue): PhpArray | false => {
  const expression = compile(pattern, "g");
  if (!expression) return false;
  const text = toStringValue(subject);
  const all: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  while ((match = expression.exec(text)) !== null) {
    all.push(match);
    // A pattern that can match empty would otherwise never advance.
    if (match[0] === "") expression.lastIndex += 1;
  }

  // PHP's default is PREG_PATTERN_ORDER: by group, then by match.
  const groups = all.reduce((most, item) => Math.max(most, item.length), 0);
  const result = new PhpArray();
  for (let group = 0; group < groups; group += 1) {
    const perGroup = new PhpArray();
    for (const item of all) perGroup.push(item[group] ?? "");
    result.set(group, perGroup);
  }
  return result;
};

export const pregReplace = (
  pattern: PhpValue,
  replacement: PhpValue,
  subject: PhpValue
): PhpValue => {
  const patterns = pattern instanceof PhpArray ? pattern.values() : [pattern];
  const replacements =
    replacement instanceof PhpArray ? replacement.values() : null;

  let text = toStringValue(subject);
  patterns.forEach((one, index) => {
    const with_ = replacements
      ? toStringValue(replacements[index] ?? "")
      : toStringValue(replacement);
    const expression = compile(one, "g");
    if (!expression) return;
    text = text.replace(expression, toJsReplacement(with_));
  });
  return text;
};

export const pregSplit = (
  pattern: PhpValue,
  subject: PhpValue,
  limit: PhpValue,
  flags: PhpValue
): PhpArray | false => {
  const expression = compile(pattern, "g");
  if (!expression) return false;
  const pieces = toStringValue(subject).split(expression);
  const result = new PhpArray();
  // PREG_SPLIT_NO_EMPTY is 1, and the original passes it where it matters.
  const dropEmpty = (Number(limit) === -1 || limit === null) && Number(flags) === 1;
  for (const piece of pieces) {
    if (dropEmpty && piece === "") continue;
    result.push(piece ?? "");
  }
  return result;
};

/** preg_quote(), including PHP's optional extra delimiter. */
export const pregQuote = (subject: PhpValue, delimiter: PhpValue): string => {
  const special = ".\\+*?[^]$(){}=!<>|:-#/";
  const extra = delimiter === null || delimiter === undefined ? "" : toStringValue(delimiter);
  let out = "";
  for (const character of toStringValue(subject)) {
    out += special.includes(character) || extra.includes(character)
      ? `\\${character}`
      : character;
  }
  return out;
};
