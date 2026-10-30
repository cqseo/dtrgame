/**
 * Parser for the PHP subset the original's compiled templates contain.
 *
 * Precedence follows PHP 8, where concatenation binds looser than `+` and
 * `-`. Getting that wrong would silently change what a page prints, so the
 * table below is ordered deliberately rather than copied from C.
 */
import type { Expression, Statement } from "./ast";
import { tokenize, type Token } from "./lexer";

/** Binding power per binary operator, loosest first in the comments. */
const BINARY_PRECEDENCE: Record<string, number> = {
  "or": 1, "xor": 2, "and": 3,
  "??": 5,
  "||": 6, "&&": 7,
  "|": 8, "^": 9, "&": 10,
  "==": 11, "!=": 11, "===": 11, "!==": 11, "<>": 11, "<=>": 11,
  "<": 12, "<=": 12, ">": 12, ">=": 12,
  ".": 13,
  "<<": 14, ">>": 14,
  "+": 15, "-": 15,
  "*": 16, "/": 16, "%": 16,
  "instanceof": 18,
  "**": 19
};

const RIGHT_ASSOCIATIVE = new Set(["**", "??"]);

const ASSIGN_OPERATORS = new Set([
  "=", "+=", "-=", "*=", "/=", ".=", "%=", "**=", "??=",
  // The bitwise compound assignments. The modules use |= to build the
  // crafting slot mask, among others.
  "|=", "&=", "^=", "<<=", ">>="
]);

const CASTS = new Set(["int", "integer", "float", "double", "string", "bool", "boolean", "array"]);

export class Parser {
  protected readonly tokens: Token[];
  protected position = 0;

  constructor(source: string) {
    this.tokens = tokenize(source);
  }

  protected peek(offset = 0): Token {
    return this.tokens[Math.min(this.position + offset, this.tokens.length - 1)] as Token;
  }

  protected next(): Token {
    return this.tokens[this.position++] as Token;
  }

  protected at(kind: Token["kind"], value?: string): boolean {
    const token = this.peek();
    if (token.kind !== kind) return false;
    if (value === undefined) return true;
    return kind === "name" ? token.value.toLowerCase() === value : token.value === value;
  }

  protected eat(kind: Token["kind"], value?: string): boolean {
    if (!this.at(kind, value)) return false;
    this.position += 1;
    return true;
  }

  protected expect(kind: Token["kind"], value?: string): Token {
    if (!this.at(kind, value)) {
      const token = this.peek();
      throw new SyntaxError(
        `Expected ${value ?? kind} but found ${token.kind} ${JSON.stringify(token.value)} at ${token.position}`
      );
    }
    return this.next();
  }

  parseProgram(): Statement[] {
    const body: Statement[] = [];
    while (!this.at("eof")) body.push(this.parseStatement());
    return body;
  }

  protected parseBlockOrStatement(): Statement[] {
    if (this.eat("punct", "{")) {
      const body: Statement[] = [];
      while (!this.at("punct", "}") && !this.at("eof")) body.push(this.parseStatement());
      this.expect("punct", "}");
      return body;
    }
    return [this.parseStatement()];
  }

  protected parseStatement(): Statement {
    const token = this.peek();

    if (token.kind === "inlineHtml") {
      this.next();
      return { kind: "inlineHtml", text: token.value };
    }

    if (token.kind === "punct" && token.value === ";") {
      this.next();
      return { kind: "block", body: [] };
    }

    if (token.kind === "punct" && token.value === "{") {
      return { kind: "block", body: this.parseBlockOrStatement() };
    }

    if (token.kind === "name") {
      switch (token.value.toLowerCase()) {
        case "echo": return this.parseEcho();
        case "print": return this.parseEcho();
        case "if": return this.parseIf();
        case "foreach": return this.parseForeach();
        case "include":
        case "include_once":
        case "require":
        case "require_once": return this.parseInclude();
        case "exit":
        case "die": return this.parseExit();
        case "return": return this.parseReturn();
        case "break": return this.parseBreakContinue("break");
        case "continue": return this.parseBreakContinue("continue");
        // Templates render in the global scope, so `global $x;` imports
        // nothing; it is accepted and discarded rather than mistaken for a
        // constant named "global".
        case "global": return this.parseGlobal();
        case "unset": return this.parseUnset();
        default: break;
      }
    }

    const expression = this.parseExpression();
    this.eat("punct", ";");
    return { kind: "expression", expression };
  }

  protected parseGlobal(): Statement {
    this.next();
    do {
      if (this.at("punct", ";")) break;
      this.parseExpression();
    } while (this.eat("punct", ","));
    this.eat("punct", ";");
    return { kind: "block", body: [] };
  }

  protected parseUnset(): Statement {
    this.next();
    const targets: Expression[] = [];
    this.expect("punct", "(");
    do {
      if (this.at("punct", ")")) break;
      targets.push(this.parseExpression());
    } while (this.eat("punct", ","));
    this.expect("punct", ")");
    this.eat("punct", ";");
    return { kind: "unset", targets };
  }

  protected parseEcho(): Statement {
    this.next();
    const values = [this.parseExpression()];
    while (this.eat("punct", ",")) values.push(this.parseExpression());
    this.eat("punct", ";");
    return { kind: "echo", values };
  }

  protected parseIf(): Statement {
    this.expect("name", "if");
    this.expect("punct", "(");
    const condition = this.parseExpression();
    this.expect("punct", ")");
    const branches = [{ condition, body: this.parseBlockOrStatement() }];
    let otherwise: Statement[] = [];

    for (;;) {
      if (this.at("name", "elseif")) {
        this.next();
        this.expect("punct", "(");
        const next = this.parseExpression();
        this.expect("punct", ")");
        branches.push({ condition: next, body: this.parseBlockOrStatement() });
        continue;
      }
      if (this.at("name", "else")) {
        this.next();
        if (this.at("name", "if")) {
          this.next();
          this.expect("punct", "(");
          const next = this.parseExpression();
          this.expect("punct", ")");
          branches.push({ condition: next, body: this.parseBlockOrStatement() });
          continue;
        }
        otherwise = this.parseBlockOrStatement();
      }
      break;
    }

    return { kind: "if", branches, otherwise };
  }

  protected parseForeach(): Statement {
    this.expect("name", "foreach");
    this.expect("punct", "(");
    const subject = this.parseExpression();
    this.expect("name", "as");

    let byReference = this.eat("operator", "&");
    let first = this.parseExpression();
    let keyVariable: Expression | null = null;
    let valueVariable = first;

    if (this.eat("operator", "=>")) {
      keyVariable = first;
      byReference = this.eat("operator", "&");
      valueVariable = this.parseExpression();
    }

    this.expect("punct", ")");
    return { kind: "foreach", subject, keyVariable, valueVariable, byReference, body: this.parseBlockOrStatement() };
  }

  protected parseInclude(): Statement {
    this.next();
    const template = this.parseExpression();
    this.eat("punct", ";");
    return { kind: "include", template };
  }

  protected parseExit(): Statement {
    this.next();
    let value: Expression | null = null;
    if (this.eat("punct", "(")) {
      if (!this.at("punct", ")")) value = this.parseExpression();
      this.expect("punct", ")");
    }
    this.eat("punct", ";");
    return { kind: "exit", value };
  }

  protected parseReturn(): Statement {
    this.next();
    const value = this.at("punct", ";") || this.at("punct", "}")
      ? null
      : this.parseExpression();
    this.eat("punct", ";");
    return { kind: "return", value };
  }

  protected parseBreakContinue(kind: "break" | "continue"): Statement {
    this.next();
    let levels = 1;
    if (this.peek().kind === "number") levels = Number(this.next().literal);
    this.eat("punct", ";");
    return kind === "break" ? { kind: "break", levels } : { kind: "continue", levels };
  }

  parseExpression(): Expression {
    return this.parseAssignment();
  }

  protected parseAssignment(): Expression {
    const left = this.parseTernary();
    const token = this.peek();
    if (token.kind === "operator" && ASSIGN_OPERATORS.has(token.value)) {
      this.next();
      // `$itm = &$theitem['itm']` binds a reference rather than copying.
      // The modules use it to alias into the item they are acting on, so
      // writes through the alias have to reach the original array.
      if (token.value === "=" && this.eat("operator", "&")) {
        return {
          kind: "assign",
          operator: "=",
          target: left,
          value: { kind: "reference", target: this.parseAssignment() }
        };
      }
      // Assignment is right-associative.
      const value = this.parseAssignment();
      return { kind: "assign", operator: token.value, target: left, value };
    }
    return left;
  }

  protected parseTernary(): Expression {
    let condition = this.parseBinary(0);
    while (this.at("operator", "?")) {
      this.next();
      if (this.eat("operator", ":")) {
        const otherwise = this.parseAssignment();
        condition = { kind: "ternary", condition, then: null, otherwise };
        continue;
      }
      const then = this.parseAssignment();
      this.expect("operator", ":");
      const otherwise = this.parseAssignment();
      condition = { kind: "ternary", condition, then, otherwise };
    }
    return condition;
  }

  protected binaryOperator(): string | null {
    const token = this.peek();
    if (token.kind === "operator" && BINARY_PRECEDENCE[token.value] !== undefined) return token.value;
    if (token.kind === "name") {
      const lowered = token.value.toLowerCase();
      if (lowered === "and" || lowered === "or" || lowered === "xor" || lowered === "instanceof") {
        return lowered;
      }
    }
    return null;
  }

  protected parseBinary(minimumPrecedence: number): Expression {
    let left = this.parseUnary();
    for (;;) {
      const operator = this.binaryOperator();
      if (operator === null) break;
      const precedence = BINARY_PRECEDENCE[operator] ?? -1;
      if (precedence < minimumPrecedence) break;
      this.next();
      const nextMinimum = RIGHT_ASSOCIATIVE.has(operator) ? precedence : precedence + 1;
      const right = this.parseBinary(nextMinimum);
      left = { kind: "binary", operator, left, right };
    }
    return left;
  }

  protected parseUnary(): Expression {
    const token = this.peek();

    if (token.kind === "operator" && (token.value === "!" || token.value === "-" || token.value === "+" || token.value === "~" || token.value === "@")) {
      this.next();
      return { kind: "unary", operator: token.value, operand: this.parseUnary() };
    }

    if (token.kind === "operator" && (token.value === "++" || token.value === "--")) {
      this.next();
      return { kind: "incdec", operator: token.value, prefix: true, target: this.parseUnary() };
    }

    // Casts such as (int) are written as a parenthesised type name.
    if (token.kind === "punct" && token.value === "(" && this.peek(1).kind === "name" && this.peek(2).value === ")") {
      const typeName = this.peek(1).value.toLowerCase();
      if (CASTS.has(typeName)) {
        this.next();
        this.next();
        this.next();
        return { kind: "call", callee: `__cast_${typeName}`, args: [this.parseUnary()] };
      }
    }

    return this.parsePostfix(this.parsePrimary());
  }

  protected parsePostfix(target: Expression): Expression {
    let current = target;
    for (;;) {
      if (this.at("punct", "[")) {
        this.next();
        if (this.eat("punct", "]")) {
          current = { kind: "index", target: current, index: null };
          continue;
        }
        const index = this.parseExpression();
        this.expect("punct", "]");
        current = { kind: "index", target: current, index };
        continue;
      }
      if (this.at("operator", "->")) {
        this.next();
        const name = this.expect("name").value;
        // Every `->` in the original's module tree is on the database
        // object, and the eleven names it uses are all methods. A bare
        // property read is still parsed, because templates read properties.
        current = this.at("punct", "(")
          ? { kind: "methodCall", target: current, name, args: this.parseArguments() }
          : { kind: "property", target: current, name };
        continue;
      }
      // A call on something that is not a bare name: `$chprocess(...)`, which
      // is how a module calls the implementation it overrode, and the single
      // most common construct in the module tree after the hook prologue.
      if (this.at("punct", "(") && current.kind !== "call" && current.kind !== "literal") {
        current = { kind: "dynamicCall", callee: current, args: this.parseArguments() };
        continue;
      }
      const token = this.peek();
      if (token.kind === "operator" && (token.value === "++" || token.value === "--")) {
        this.next();
        current = { kind: "incdec", operator: token.value, prefix: false, target: current };
        continue;
      }
      return current;
    }
  }

  protected parseArguments(): Expression[] {
    this.expect("punct", "(");
    const args: Expression[] = [];
    if (!this.at("punct", ")")) {
      do {
        if (this.at("punct", ")")) break;
        // Argument unpacking, `f(...$args)`. The module tree uses it once,
        // in skill729's array_merge.
        if (this.eat("operator", "...")) {
          args.push({ kind: "call", callee: "__spread", args: [this.parseExpression()] });
          continue;
        }
        args.push(this.parseExpression());
      } while (this.eat("punct", ","));
    }
    this.expect("punct", ")");
    return args;
  }

  protected parsePrimary(): Expression {
    // `&$x` as an operand: the modules build `array('itm' => &$itm0, …)` so
    // the entries alias the caller's variables, and `foreach (array(&$pa,
    // &$pd) as &$pl)` to act on both combatants in turn.
    if (this.at("operator", "&")) {
      this.next();
      return { kind: "reference", target: this.parseUnary() };
    }

    const token = this.next();

    if (token.kind === "variable") return { kind: "variable", name: token.value };

    if (token.kind === "number") return { kind: "literal", value: token.literal as number };

    if (token.kind === "string") {
      if (!token.interpolated) return { kind: "literal", value: token.literal as string };
      return parseInterpolated(token.literal as string);
    }

    if (token.kind === "punct" && token.value === "(") {
      const inner = this.parseExpression();
      this.expect("punct", ")");
      return inner;
    }

    // ${expr} and $$name produce a variable whose name is computed.
    if (token.kind === "operator" && token.value === "$") {
      if (this.eat("punct", "{")) {
        const name = this.parseExpression();
        this.expect("punct", "}");
        return { kind: "variableVariable", name };
      }
      return { kind: "variableVariable", name: this.parsePrimary() };
    }

    if (token.kind === "punct" && token.value === "[") {
      return this.parseArrayEntries("]");
    }

    if (token.kind === "name") {
      const lowered = token.value.toLowerCase();

      if (lowered === "array" && this.at("punct", "(")) {
        this.next();
        return this.parseArrayEntries(")");
      }
      if (lowered === "isset") {
        const args = this.parseArguments();
        return { kind: "isset", targets: args };
      }
      if (lowered === "empty") {
        const args = this.parseArguments();
        return { kind: "empty", target: args[0] ?? { kind: "literal", value: null } };
      }
      if (lowered === "list") {
        this.expect("punct", "(");
        const targets: (Expression | null)[] = [];
        do {
          if (this.at("punct", ")")) break;
          targets.push(this.at("punct", ",") ? null : this.parseExpression());
        } while (this.eat("punct", ","));
        this.expect("punct", ")");
        return { kind: "list", targets };
      }
      if (lowered === "true") return { kind: "literal", value: true };
      if (lowered === "false") return { kind: "literal", value: false };
      if (lowered === "null") return { kind: "literal", value: null };

      if (this.at("punct", "(")) {
        return { kind: "call", callee: token.value, args: this.parseArguments() };
      }
      return { kind: "constant", name: token.value };
    }

    throw new SyntaxError(
      `Unexpected ${token.kind} ${JSON.stringify(token.value)} at ${token.position}`
    );
  }

  protected parseArrayEntries(closing: string): Expression {
    const entries: { key: Expression | null; value: Expression }[] = [];
    while (!this.at("punct", closing) && !this.at("eof")) {
      const first = this.parseExpression();
      if (this.eat("operator", "=>")) entries.push({ key: first, value: this.parseExpression() });
      else entries.push({ key: null, value: first });
      if (!this.eat("punct", ",")) break;
    }
    this.expect("punct", closing);
    return { kind: "array", entries };
  }
}

/**
 * Splits a double-quoted string into its literal and variable parts.
 * Supports `$name`, `$name[key]` and `{$expr}`, which is what the original's
 * templates and eval statements use.
 */
export function parseInterpolated(decoded: string): Expression {
  const parts: Expression[] = [];
  // `{$…}` is matched by balancing braces rather than by stopping at the
  // first `}`: the modules write `{${'itm'.$itmn}}`, where a non-balancing
  // match would cut the expression in half.
  const pattern = /\{\$|\$[A-Za-z_\u0080-￿][A-Za-z0-9_\u0080-￿]*(?:\[[^\]]*\])?/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(decoded)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "literal", value: decoded.slice(lastIndex, match.index) });
    }

    let normalized: string;
    let end: number;
    if (match[0] === "{$") {
      let depth = 1;
      let scan = match.index + 1;
      while (scan < decoded.length && depth > 0) {
        scan += 1;
        if (decoded[scan] === "{") depth += 1;
        else if (decoded[scan] === "}") depth -= 1;
      }
      normalized = decoded.slice(match.index + 1, scan);
      end = scan + 1;
    } else {
      // Bare $name[key] inside a string treats an unquoted key as a string.
      normalized = match[0].replace(/\[([A-Za-z_\u0080-￿][A-Za-z0-9_\u0080-￿]*)\]$/, "['$1']");
      end = match.index + match[0].length;
    }

    try {
      parts.push(new Parser(`<?php ${normalized};`).parseExpression());
    } catch (error) {
      // The sub-parser's offsets mean nothing to a caller looking at a
      // module file, so say which interpolation failed.
      throw new SyntaxError(
        `Cannot parse interpolated ${JSON.stringify(normalized)}: ${(error as Error).message}`
      );
    }
    lastIndex = end;
    pattern.lastIndex = end;
  }

  if (lastIndex < decoded.length) {
    parts.push({ kind: "literal", value: decoded.slice(lastIndex) });
  }
  const only = parts[0];
  if (parts.length === 1 && only !== undefined && only.kind === "literal") return only;
  if (parts.length === 0) return { kind: "literal", value: "" };
  return { kind: "interpolate", parts };
}

export function parseTemplateProgram(compiled: string): Statement[] {
  return new Parser(compiled).parseProgram();
}
