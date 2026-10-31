/**
 * Parser for the original's module files.
 *
 * docs/WHY_COMPILE_THE_MODULES.md has the census behind this: across all
 * 1,661 module files there are no classes, no closures, and no exceptions
 * beyond six throws in two already-ported files. So this is the template
 * parser plus the statements templates happen not to contain — function
 * declarations, a real `global`, the three remaining loop forms, `switch`,
 * and namespaces.
 *
 * It extends the template parser rather than copying it. That expression
 * grammar and its PHP 8 precedence are already held to the original by the
 * 845-template compile parity test, and a second copy would drift from it.
 *
 * This replaces finding a function with a regular expression. A regex cannot
 * match a parameter list containing `)` — `function f($a = array())` and
 * `$x = foo()` both appear in the original — and cannot tell a declaration
 * from the same text inside a string or comment.
 */
import type { Expression, Parameter, Statement } from "../template/ast";
import { Parser } from "../template/parser";

export class ModuleParser extends Parser {
  /**
   * Reads one statement, adding the module-level forms.
   *
   * Anything unrecognised falls through to the template parser, which
   * already handles every expression, `if`, `foreach`, `echo`, `unset`,
   * `return`, `include` and the rest.
   */
  protected override parseStatement(): Statement {
    const token = this.peek();

    if (token.kind === "name") {
      switch (token.value.toLowerCase()) {
        case "namespace": return this.parseNamespace();
        case "function": return this.parseFunctionDeclaration();
        case "global": return this.parseRealGlobal();
        case "for": return this.parseFor();
        case "while": return this.parseWhile();
        case "do": return this.parseDoWhile();
        case "switch": return this.parseSwitch();
        case "throw": return this.parseThrow();
        case "try": return this.parseTry();
        // Neither appears in the module tree's game logic, but both are
        // cheap to tolerate and would otherwise parse as a constant.
        case "declare":
        case "use": return this.skipToSemicolon();
        default: break;
      }
    }

    return super.parseStatement();
  }

  private skipToSemicolon(): Statement {
    while (!this.at("punct", ";") && !this.at("eof")) this.next();
    this.eat("punct", ";");
    return { kind: "block", body: [] };
  }

  private parseNamespace(): Statement {
    this.expect("name", "namespace");
    // Both `namespace x { ... }` and `namespace x;` are used.
    const name = this.at("name") ? this.next().value : "";
    if (this.eat("punct", "{")) {
      const body: Statement[] = [];
      while (!this.at("punct", "}") && !this.at("eof")) body.push(this.parseStatement());
      this.expect("punct", "}");
      return { kind: "namespace", name, body };
    }
    this.eat("punct", ";");
    // A braceless namespace runs to the end of the file. parseModuleFile
    // folds the rest of the program into it; a null body means "not yet".
    return { kind: "namespace", name, body: null };
  }

  private parseFunctionDeclaration(): Statement {
    this.expect("name", "function");
    // A by-reference return, as in `function &get_var_in_module(...)`.
    this.eat("operator", "&");
    const name = this.expect("name").value;
    const parameters = this.parseParameters();
    // A return type, as in `function dts_quickmatch_tick(): void`. The
    // module tree declares none, but the include files do.
    if (this.eat("operator", ":")) this.skipTypeName();
    const body = this.parseBracedBody();
    return { kind: "functionDeclaration", name, parameters, body };
  }

  /** Skips a type: `void`, `?Foo`, `int|false`, and so on. */
  private skipTypeName(): void {
    this.eat("operator", "?");
    do {
      if (this.at("name")) this.next();
    } while (this.eat("operator", "|") || this.eat("operator", "&"));
  }

  private parseParameters(): Parameter[] {
    this.expect("punct", "(");
    const parameters: Parameter[] = [];
    while (!this.at("punct", ")") && !this.at("eof")) {
      // A declared parameter type. The original declares none, but a bare
      // name here could only be a type, so skipping it costs nothing.
      if (this.at("name")) this.next();

      const byReference = this.eat("operator", "&");
      const variadic = this.eat("operator", "...");
      const name = this.expect("variable").value;
      // The default is a full expression, so `= array()`, `= array(1,2)` and
      // `= SOME_CONSTANT` all parse, which a regex over the text cannot do.
      const defaultValue = this.eat("operator", "=") ? this.parseExpression() : null;
      parameters.push({ name, byReference, variadic, defaultValue });
      if (!this.eat("punct", ",")) break;
    }
    this.expect("punct", ")");
    return parameters;
  }

  private parseBracedBody(): Statement[] {
    this.expect("punct", "{");
    const body: Statement[] = [];
    while (!this.at("punct", "}") && !this.at("eof")) body.push(this.parseStatement());
    this.expect("punct", "}");
    return body;
  }

  private parseRealGlobal(): Statement {
    this.expect("name", "global");
    const names: Expression[] = [];
    do {
      if (this.at("punct", ";")) break;
      names.push(this.parseExpression());
    } while (this.eat("punct", ","));
    this.eat("punct", ";");
    return { kind: "global", names };
  }

  private parseFor(): Statement {
    this.expect("name", "for");
    this.expect("punct", "(");
    const initializers = this.parseExpressionList(";");
    this.expect("punct", ";");
    const conditions = this.parseExpressionList(";");
    this.expect("punct", ";");
    const updates = this.parseExpressionList(")");
    this.expect("punct", ")");
    return { kind: "for", initializers, conditions, updates, body: this.parseLoopBody("endfor") };
  }

  /** Reads a comma-separated list ending at `terminator`, possibly empty. */
  private parseExpressionList(terminator: string): Expression[] {
    const list: Expression[] = [];
    if (this.at("punct", terminator)) return list;
    do {
      if (this.at("punct", terminator)) break;
      list.push(this.parseExpression());
    } while (this.eat("punct", ","));
    return list;
  }

  private parseWhile(): Statement {
    this.expect("name", "while");
    this.expect("punct", "(");
    const condition = this.parseExpression();
    this.expect("punct", ")");
    return { kind: "while", condition, body: this.parseLoopBody("endwhile") };
  }

  private parseDoWhile(): Statement {
    this.expect("name", "do");
    const body = this.parseBlockOrStatement();
    this.expect("name", "while");
    this.expect("punct", "(");
    const condition = this.parseExpression();
    this.expect("punct", ")");
    this.eat("punct", ";");
    return { kind: "doWhile", condition, body };
  }

  /**
   * Reads a loop body in either brace or alternative (`:` … `endwhile;`)
   * form, both of which the original uses.
   */
  private parseLoopBody(alternativeEnd: string): Statement[] {
    if (this.eat("operator", ":")) {
      const body: Statement[] = [];
      while (!this.at("name", alternativeEnd) && !this.at("eof")) body.push(this.parseStatement());
      this.expect("name", alternativeEnd);
      this.eat("punct", ";");
      return body;
    }
    return this.parseBlockOrStatement();
  }

  private parseSwitch(): Statement {
    this.expect("name", "switch");
    this.expect("punct", "(");
    const subject = this.parseExpression();
    this.expect("punct", ")");
    this.expect("punct", "{");

    const cases: { test: Expression | null; body: Statement[] }[] = [];
    while (!this.at("punct", "}") && !this.at("eof")) {
      let test: Expression | null = null;
      if (this.eat("name", "case")) test = this.parseExpression();
      else this.expect("name", "default");
      // PHP accepts both `case 1:` and `case 1;`.
      if (!this.eat("operator", ":")) this.eat("punct", ";");

      const body: Statement[] = [];
      while (
        !this.at("punct", "}") &&
        !this.at("name", "case") &&
        !this.at("name", "default") &&
        !this.at("eof")
      ) {
        body.push(this.parseStatement());
      }
      cases.push({ test, body });
    }
    this.expect("punct", "}");
    return { kind: "switch", subject, cases };
  }

  /**
   * `try { } catch (Exception $e) { } finally { }`.
   *
   * command.php wraps its whole request in one and prints the message, so
   * the catch variable and the types it names both matter.
   */
  private parseTry(): Statement {
    this.expect("name", "try");
    const body = this.parseBracedBody();
    const catches: { types: string[]; variable: string; body: Statement[] }[] = [];

    while (this.at("name", "catch")) {
      this.next();
      this.expect("punct", "(");
      const types: string[] = [];
      do {
        types.push(this.expect("name").value.replace(/^\\+/, ""));
      } while (this.eat("operator", "|"));
      // PHP 8 allows `catch (Exception)` with no variable.
      const variable = this.at("variable") ? this.next().value : "";
      this.expect("punct", ")");
      catches.push({ types, variable, body: this.parseBracedBody() });
    }

    const finallyBody = this.eat("name", "finally") ? this.parseBracedBody() : null;
    return { kind: "try", body, catches, finally: finallyBody };
  }

  private parseThrow(): Statement {
    this.expect("name", "throw");
    const value = this.parseExpression();
    this.eat("punct", ";");
    return { kind: "throw", value };
  }
}

/**
 * Parses one module file into its top-level statements.
 *
 * A braceless `namespace x;` carries to the end of the file, so its
 * statements are folded into it here rather than left as siblings.
 */
export function parseModuleFile(source: string): Statement[] {
  const parsed = new ModuleParser(source).parseProgram();
  const program: Statement[] = [];

  for (let index = 0; index < parsed.length; index += 1) {
    const statement = parsed[index] as Statement;
    if (statement.kind === "namespace" && statement.body === null) {
      program.push({ kind: "namespace", name: statement.name, body: parsed.slice(index + 1) });
      return program;
    }
    program.push(statement);
  }
  return program;
}

export interface DeclaredFunction {
  readonly namespace: string;
  readonly name: string;
  readonly parameters: readonly Parameter[];
  readonly body: readonly Statement[];
}

/**
 * Collects every function a module file declares, with the namespace it was
 * declared in.
 *
 * This is what makes compiling the whole tree possible: one parse yields all
 * of a file's functions, rather than one regex search per function name.
 */
export function collectDeclaredFunctions(source: string): DeclaredFunction[] {
  const found: DeclaredFunction[] = [];

  const walk = (statements: readonly Statement[], namespace: string): void => {
    for (const statement of statements) {
      if (statement.kind === "namespace") {
        walk(statement.body ?? [], statement.name);
        continue;
      }
      if (statement.kind === "functionDeclaration") {
        found.push({
          namespace,
          name: statement.name,
          parameters: statement.parameters,
          body: statement.body
        });
        // The original declares no nested functions, but walking the body
        // costs nothing and would catch one rather than lose it.
        walk(statement.body, namespace);
        continue;
      }
      if (statement.kind === "block") walk(statement.body, namespace);
    }
  };

  walk(parseModuleFile(source), "");
  return found;
}
