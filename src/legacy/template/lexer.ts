/**
 * Tokenizer for the PHP subset the original's compiled templates contain.
 *
 * The compiler emits inline HTML interleaved with `<?php ... ?>` blocks, so
 * the lexer alternates between HTML mode and code mode exactly as PHP does,
 * including the rule that a `?>` immediately followed by a newline swallows
 * that newline.
 */

export type TokenKind =
  | "inlineHtml"
  | "variable"
  | "name"
  | "number"
  | "string"
  | "operator"
  | "punct"
  | "eof";

export interface Token {
  readonly kind: TokenKind;
  readonly value: string;
  /** For strings: the decoded value. For numbers: the numeric value. */
  readonly literal?: string | number;
  /** Double-quoted strings interpolate; single-quoted ones do not. */
  readonly interpolated?: boolean;
  readonly position: number;
}

const OPERATORS = [
  "<<=", ">>=",
  "===", "!==", "<=>", "**=", "...", "??=",
  "|=", "&=", "^=",
  "==", "!=", "<>", "<=", ">=", "&&", "||", "->", "=>", "++", "--", "+=", "-=",
  "*=", "/=", ".=", "%=", "??", "::", "**", "<<", ">>",
  "+", "-", "*", "/", "%", "=", "<", ">", "!", ".", "?", ":", "&", "|", "^", "~", "@", "$"
];

const PUNCT = new Set(["(", ")", "[", "]", "{", "}", ",", ";"]);

const isNameStart = (c: string): boolean => /[A-Za-z_\u0080-\uffff\\]/.test(c);
const isNamePart = (c: string): boolean => /[A-Za-z0-9_\u0080-\uffff\\]/.test(c);

/** Decodes the escapes PHP recognises inside a double-quoted string. */
function decodeDoubleQuoted(raw: string): string {
  return raw.replace(/\\(n|t|r|v|e|f|\\|\$|"|0[0-7]{0,2}|x[0-9A-Fa-f]{1,2})/g, (match, escape: string) => {
    switch (escape[0]) {
      case "n": return "\n";
      case "t": return "\t";
      case "r": return "\r";
      case "v": return "\v";
      case "e": return "\x1b";
      case "f": return "\f";
      case "\\": return "\\";
      case "$": return "$";
      case '"': return '"';
      case "x": return String.fromCharCode(parseInt(escape.slice(1), 16));
      case "0": return String.fromCharCode(parseInt(escape, 8));
      default: return match;
    }
  });
}

/** Decodes the two escapes PHP recognises inside a single-quoted string. */
const decodeSingleQuoted = (raw: string): string => raw.replace(/\\(['\\])/g, "$1");

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  /** Index access is checked; past the end reads as "" rather than undefined. */
  const at = (position: number): string => source.charAt(position);
  let index = 0;
  let inCode = false;

  const push = (token: Token) => tokens.push(token);

  while (index < source.length) {
    if (!inCode) {
      const open = source.indexOf("<?php", index);
      const end = open === -1 ? source.length : open;
      if (end > index) {
        push({ kind: "inlineHtml", value: source.slice(index, end), position: index });
      }
      if (open === -1) break;
      index = open + "<?php".length;
      inCode = true;
      continue;
    }

    const char = at(index);

    if (char === "?" && at(index + 1) === ">") {
      index += 2;
      // PHP discards a single newline directly after the closing tag.
      if (at(index) === "\n") index += 1;
      else if (at(index) === "\r" && at(index + 1) === "\n") index += 2;
      inCode = false;
      continue;
    }

    if (char === " " || char === "\t" || char === "\n" || char === "\r") {
      index += 1;
      continue;
    }

    // Comments.
    if (char === "/" && at(index + 1) === "/") {
      const stop = source.indexOf("\n", index);
      index = stop === -1 ? source.length : stop;
      continue;
    }
    if (char === "#" && at(index + 1) !== "[") {
      const stop = source.indexOf("\n", index);
      index = stop === -1 ? source.length : stop;
      continue;
    }
    if (char === "/" && at(index + 1) === "*") {
      const stop = source.indexOf("*/", index + 2);
      index = stop === -1 ? source.length : stop + 2;
      continue;
    }

    if (char === "$" && isNameStart(at(index + 1) ?? "")) {
      let end = index + 1;
      while (end < source.length && isNamePart(at(end)) && at(end) !== "\\") end += 1;
      push({ kind: "variable", value: source.slice(index + 1, end), position: index });
      index = end;
      continue;
    }

    // Heredoc and nowdoc. Three of each appear in the original; the
    // __MAGIC__ hook prologue is itself defined as a nowdoc, so a lexer that
    // mistook `<<<` for two shifts would misread the kernel.
    if (char === "<" && at(index + 1) === "<" && at(index + 2) === "<") {
      const opener = /^<<<[ \t]*(?:'([A-Za-z_]\w*)'|"([A-Za-z_]\w*)"|([A-Za-z_]\w*))\r?\n/.exec(
        source.slice(index)
      );
      if (opener) {
        const label = opener[1] ?? opener[2] ?? opener[3] ?? "";
        // A nowdoc ('LABEL') does not interpolate; a heredoc does.
        const interpolated = opener[1] === undefined;
        const bodyStart = index + opener[0].length;
        // The closing label sits at the start of a line, optionally indented
        // since PHP 7.3, and is followed by a non-word character.
        const closer = new RegExp(`^[ \\t]*${label}(?![\\w])`, "m");
        const rest = source.slice(bodyStart);
        const found = closer.exec(rest);
        if (found && found.index !== undefined) {
          let raw = rest.slice(0, found.index);
          // The newline before the closing label is not part of the value.
          raw = raw.replace(/\r?\n$/, "");
          push({
            kind: "string",
            value: raw,
            literal: interpolated ? decodeDoubleQuoted(raw) : raw,
            interpolated,
            position: index
          });
          index = bodyStart + found.index + found[0].length;
          continue;
        }
      }
    }

    if (char === "'" || char === '"') {
      const quote = char;
      let end = index + 1;
      let raw = "";
      while (end < source.length) {
        if (at(end) === "\\") {
          raw += source.slice(end, end + 2);
          end += 2;
          continue;
        }
        if (at(end) === quote) break;
        raw += at(end);
        end += 1;
      }
      push({
        kind: "string",
        value: raw,
        literal: quote === '"' ? decodeDoubleQuoted(raw) : decodeSingleQuoted(raw),
        interpolated: quote === '"',
        position: index
      });
      index = end + 1;
      continue;
    }

    if (/[0-9]/.test(char) || (char === "." && /[0-9]/.test(at(index + 1) ?? ""))) {
      const match = /^(?:0[xX][0-9A-Fa-f]+|(?:[0-9]*\.[0-9]+|[0-9]+\.?)(?:[eE][+-]?[0-9]+)?)/.exec(
        source.slice(index)
      );
      const text = match?.[0] ?? char;
      push({ kind: "number", value: text, literal: Number(text), position: index });
      index += text.length;
      continue;
    }

    if (isNameStart(char)) {
      let end = index;
      while (end < source.length && isNamePart(at(end))) end += 1;
      push({ kind: "name", value: source.slice(index, end), position: index });
      index = end;
      continue;
    }

    if (PUNCT.has(char)) {
      push({ kind: "punct", value: char, position: index });
      index += 1;
      continue;
    }

    const operator = OPERATORS.find(candidate => source.startsWith(candidate, index));
    if (operator) {
      push({ kind: "operator", value: operator, position: index });
      index += operator.length;
      continue;
    }

    throw new SyntaxError(`Unexpected character ${JSON.stringify(char)} at ${index}`);
  }

  push({ kind: "eof", value: "", position: source.length });
  return tokens;
}
