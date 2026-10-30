import type { Statement } from "./template/ast";
import { parseTemplateProgram } from "./template/parser";

export interface CompiledPhpParameter {
  readonly name: string;
  readonly byReference: boolean;
  readonly variadic: boolean;
  readonly defaultSource?: string;
}

export interface CompiledPhpFunction {
  readonly namespace: string;
  readonly name: string;
  readonly parameters: readonly CompiledPhpParameter[];
  /** Source is retained only for deterministic checked-in generation/audit. */
  readonly bodySource: string;
  readonly program: readonly Statement[];
}

function escaped(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Finds a named function while respecting comments and quoted strings when
 * matching its closing brace. PHP's tokenizer census proves the module tree
 * has no closures, so named declarations are the only function form here.
 */
export function compilePhpModuleFunction(
  source: string,
  namespace: string,
  functionName: string
): CompiledPhpFunction {
  const declaration = new RegExp(
    `function\\s+&?\\s*${escaped(functionName)}\\s*\\(([^)]*)\\)\\s*\\{`,
    "m"
  ).exec(source);
  if (!declaration || declaration.index === undefined) {
    throw new SyntaxError(`Function ${namespace}\\\\${functionName} was not found.`);
  }
  const open = declaration.index + declaration[0].lastIndexOf("{");
  let depth = 1;
  let index = open + 1;
  let quote = "";
  let lineComment = false;
  let blockComment = false;
  while (index < source.length && depth > 0) {
    const char = source[index]!;
    const next = source[index + 1] ?? "";
    if (lineComment) {
      if (char === "\n" || char === "\r") lineComment = false;
      index += 1;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; index += 2; }
      else index += 1;
      continue;
    }
    if (quote) {
      if (char === "\\") { index += 2; continue; }
      if (char === quote) quote = "";
      index += 1;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 2; continue; }
    if (char === "#") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 2; continue; }
    if (char === "'" || char === '"') { quote = char; index += 1; continue; }
    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    index += 1;
  }
  if (depth !== 0) throw new SyntaxError(`Function ${namespace}\\\\${functionName} has an unclosed body.`);

  const parameters = (declaration[1] ?? "").split(",").flatMap(raw => {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    const match = /^(?:[^$]*?)(\.\.\.)?\s*(&)?\s*\$([A-Za-z_][A-Za-z0-9_]*)(?:\s*=\s*([\s\S]*))?$/.exec(trimmed);
    if (!match) throw new SyntaxError(`Unsupported parameter ${JSON.stringify(trimmed)} in ${functionName}.`);
    return [{
      name: match[3]!,
      byReference: match[2] === "&",
      variadic: match[1] === "...",
      ...(match[4] === undefined ? {} : { defaultSource: match[4].trim() })
    }];
  });
  const bodySource = source.slice(open + 1, index - 1);
  return {
    namespace,
    name: functionName,
    parameters,
    bodySource,
    program: parseTemplateProgram(`<?php ${bodySource}`)
  };
}
