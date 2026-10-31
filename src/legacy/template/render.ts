/**
 * Evaluates the PHP that the original's template compiler emits.
 *
 * Workers forbid generating code at runtime, so the compiled output is
 * interpreted rather than transpiled. `include template('x')` runs the
 * included template in the same scope, as PHP's include does, which several
 * templates rely on to see variables the caller set.
 */
import type { Expression, Statement } from "./ast";
import { BUILTIN_REFERENCE_PARAMETERS, PHP_BUILTINS, byteLength, type HostFunction } from "./builtins";
import { compileTemplate, type CompileOptions } from "./compile";
import { parseTemplateProgram } from "./parser";
import { LegacyDatabase } from "../php/database";
import { ModuleScope, PhpException, PhpRef, PhpThrow } from "../php/module-store";
import {
  PhpArray,
  compareValues,
  looseEquals,
  strictEquals,
  toBool,
  toInt,
  toNumber,
  toStringValue,
  type PhpValue
} from "./values";

export interface TemplateContext {
  /** Global scope; `include` and the page share it, as in the original. */
  readonly variables: Map<string, PhpValue>;
  /** define()d constants, including the MOD_* flags the loader sets. */
  readonly constants: Map<string, PhpValue>;
  /**
   * Original functions reachable from templates, keyed exactly as written,
   * including the namespace (`\skillbase\skill_getvalue`). Anything absent
   * is reported rather than guessed at.
   */
  readonly functions: Map<string, HostFunction>;
  /**
   * PHP helpers such as bubblebox_start() render a template as a side effect.
   * Their return value is still null, but their bytes are appended at the
   * exact point of the call.
   */
  readonly writeFunctions?: Map<string, (args: PhpValue[]) => string> | undefined;
  /**
   * Dispatches a call to a compiled module function through the hook chain.
   * Supplied by the module runtime; absent when rendering a plain template,
   * where a dynamic call cannot occur.
   */
  readonly callQualified?: ((name: string, args: (PhpValue | PhpRef)[]) => PhpValue) | undefined;
  /** Whether that runtime knows a function by this name. */
  readonly hasQualified?: ((name: string) => boolean) | undefined;
  /**
   * Which of a function's parameters are declared `&$x`, so the caller
   * passes a slot for those positions instead of a value.
   */
  readonly referenceParameters?: ((name: string) => readonly boolean[]) | undefined;
  /**
   * The true global scope, which $GLOBALS exposes. gexit() renders the error
   * template inside a function, so only the variables it imports are in
   * scope there while $GLOBALS still reaches everything; keeping the two
   * separate is what makes that page match.
   */
  readonly globals?: Map<string, PhpValue> | undefined;
  /** Returns a template's source by the name template() would resolve. */
  readonly loadTemplate: (name: string) => string | undefined;
  /**
   * Resolves an `include`/`require` of one of the original's .php files.
   *
   * A template and a PHP include are not the same thing: a template is
   * compiled by parse_template first, a .php file is PHP already.
   * Compiling the second as the first silently mangles it, so they are
   * resolved separately and PHP is tried first.
   */
  readonly loadPhp?: ((name: string) => readonly Statement[] | undefined) | undefined;
  readonly compileOptions?: CompileOptions | undefined;
}

export class TemplateError extends Error {}

/** Raised by exit()/die() so the caller can distinguish it from a fault. */
export class TemplateExit extends Error {
  constructor(readonly output: string) {
    super("exit");
  }
}

class BreakSignal {
  constructor(readonly levels: number) {}
}
class ContinueSignal {
  constructor(readonly levels: number) {}
}
class ReturnSignal {
  constructor(readonly value: PhpValue) {}
}

/** A slot that can be read and written, used for assignment targets. */
interface Reference {
  get(): PhpValue;
  set(value: PhpValue): void;
}

export function createTemplateContext(
  overrides: Partial<TemplateContext> & Pick<TemplateContext, "loadTemplate">
): TemplateContext {
  return {
    variables: overrides.variables ?? new Map(),
    globals: overrides.globals,
    constants: overrides.constants ?? new Map(),
    functions: overrides.functions ?? new Map(),
    writeFunctions: overrides.writeFunctions,
    callQualified: overrides.callQualified,
    hasQualified: overrides.hasQualified,
    referenceParameters: overrides.referenceParameters,
    loadTemplate: overrides.loadTemplate,
    loadPhp: overrides.loadPhp,
    compileOptions: overrides.compileOptions
  };
}

export function renderTemplate(name: string, context: TemplateContext): string {
  const renderer = new Renderer(context);
  renderer.include(name);
  return renderer.output;
}

/** Renders already-compiled text; used by the parity harness. */
export function renderCompiled(compiled: string, context: TemplateContext): string {
  const renderer = new Renderer(context);
  renderer.run(parseTemplateProgram(compiled));
  return renderer.output;
}

/** Executes one precompiled PHP-subset function body without runtime codegen. */
export function executeCompiledFunctionBody(compiled: string, context: TemplateContext): {
  value: PhpValue;
  output: string;
} {
  return executeCompiledFunctionProgram(parseTemplateProgram(compiled), context);
}

/** Executes a checked-in build-time AST; this is the Worker runtime path. */
export function executeCompiledFunctionProgram(
  program: readonly Statement[],
  context: TemplateContext
): { value: PhpValue; output: string } {
  const renderer = new Renderer(context);
  try {
    renderer.run(program);
    return { value: null, output: renderer.output };
  } catch (signal) {
    if (signal instanceof ReturnSignal) return { value: signal.value, output: renderer.output };
    throw signal;
  }
}

class Renderer {
  output = "";
  /**
   * PHP's output buffering stack.
   *
   * command.php and register.php build their response with ob_start()
   * and ob_clean(): they let the page produce output, throw it away, and
   * echo only the encoded payload. Without a real stack, everything
   * written before ob_clean() would survive into the response and the
   * body would not be the original's.
   */
  readonly #buffers: string[] = [];

  /** Appends to the innermost buffer, or to the response when there is none. */
  private write(text: string): void {
    if (this.#buffers.length === 0) this.output += text;
    else this.#buffers[this.#buffers.length - 1] += text;
  }
  private readonly compiledCache = new Map<string, Statement[]>();

  constructor(private readonly context: TemplateContext) {}

  include(name: string): void {
    let program = this.compiledCache.get(name);
    if (!program) {
      const php = this.context.loadPhp?.(name);
      if (php) {
        this.compiledCache.set(name, php as Statement[]);
        this.run(php);
        return;
      }
      const source = this.context.loadTemplate(name);
      if (source === undefined) throw new TemplateError(`template not found: ${name}`);
      program = parseTemplateProgram(compileTemplate(source, this.context.compileOptions));
      this.compiledCache.set(name, program);
    }
    this.run(program);
  }

  run(statements: readonly Statement[]): void {
    for (const statement of statements) this.execute(statement);
  }

  private execute(statement: Statement): void {
    switch (statement.kind) {
      case "inlineHtml":
        this.write(statement.text);
        return;
      case "echo":
        for (const value of statement.values) this.write(toStringValue(this.evaluate(value)));
        return;
      case "expression":
        this.evaluate(statement.expression);
        return;
      case "block":
        this.run(statement.body);
        return;
      case "unset":
        for (const target of statement.targets) this.unset(target);
        return;
      case "if": {
        for (const branch of statement.branches) {
          if (toBool(this.evaluate(branch.condition))) {
            this.run(branch.body);
            return;
          }
        }
        this.run(statement.otherwise);
        return;
      }
      case "foreach":
        this.executeForeach(statement);
        return;
      case "include": {
        const name = toStringValue(this.evaluate(statement.template));
        this.include(name);
        return;
      }
      case "exit":
        if (statement.value) this.write(toStringValue(this.evaluate(statement.value)));
        // PHP flushes any open output buffers when the script ends, so
        // what the browser receives includes whatever was still buffered.
        throw new TemplateExit(this.output + this.#buffers.join(""));
      case "return":
        throw new ReturnSignal(statement.value ? this.evaluate(statement.value) : null);
      case "break":
        throw new BreakSignal(statement.levels);
      case "continue":
        throw new ContinueSignal(statement.levels);

      // Module statements. Compiled templates contain none of these, but
      // module functions are mostly made of them.
      case "global":
        // `global $x` makes the local name an alias of the global, not a
        // copy of it: include/user.func.php declares `global $db` and then
        // calls methods on it, and writes through such a name have to
        // reach the global the rest of the request shares.
        for (const name of statement.names) {
          if (name.kind !== "variable") continue;
          const globals = this.context.globals;
          if (!globals || globals === this.context.variables) continue;
          const scope = this.context.variables;
          if (scope instanceof ModuleScope && globals instanceof ModuleScope) {
            scope.alias(name.name, globals.slotFor(name.name));
          } else {
            scope.set(name.name, globals.get(name.name) ?? null);
          }
        }
        return;
      case "for":
        this.executeFor(statement);
        return;
      case "while":
        this.executeWhile(statement);
        return;
      case "doWhile":
        this.executeDoWhile(statement);
        return;
      case "switch":
        this.executeSwitch(statement);
        return;
      case "throw": {
        // The original's throws are all `throw new Exception(...)`, and
        // command.php catches them, so this raises a PHP exception the
        // catch clauses can match rather than a renderer error.
        const thrown = this.evaluate(statement.value);
        throw new PhpThrow(
          thrown instanceof PhpException
            ? thrown
            : new PhpException("Exception", toStringValue(thrown))
        );
      }
      case "try":
        this.executeTry(statement);
        return;
      case "namespace":
      case "functionDeclaration":
        // Declarations are handled when a module is compiled, not when a
        // function body runs. One here means a whole file was handed to the
        // function runner by mistake.
        throw new TemplateError(
          `A ${statement.kind} cannot be executed as a statement; compile the module instead.`
        );
    }
  }

  /**
   * `try` / `catch` / `finally`.
   *
   * Only a PHP exception is catchable here. The interpreter's own
   * control-flow signals - return, break, continue, exit - pass straight
   * through, as they must, and `finally` still runs for them.
   */
  private executeTry(statement: Extract<Statement, { kind: "try" }>): void {
    try {
      try {
        this.run(statement.body);
      } catch (error) {
        if (!(error instanceof PhpThrow)) throw error;
        const handler = statement.catches.find(clause =>
          clause.types.some(type => this.matchesExceptionType(error.exception, type))
        );
        if (!handler) throw error;
        if (handler.variable) {
          this.context.variables.set(handler.variable, error.exception as unknown as PhpValue);
        }
        this.run(handler.body);
      }
    } finally {
      if (statement.finally) this.run(statement.finally);
    }
  }

  /**
   * Whether a thrown exception matches a catch clause.
   *
   * The original defines no exception classes of its own and throws only
   * Exception, so this covers the hierarchy it uses: Throwable and
   * Exception catch everything thrown here, and anything else matches by
   * name.
   */
  private matchesExceptionType(exception: PhpException, type: string): boolean {
    const wanted = type.toLowerCase();
    if (wanted === "throwable" || wanted === "exception") return true;
    return wanted === exception.className.toLowerCase();
  }

  /** `for (init; cond; update)`, with PHP's comma-separated clauses. */
  private executeFor(statement: Extract<Statement, { kind: "for" }>): void {
    for (const initializer of statement.initializers) this.evaluate(initializer);
    for (;;) {
      // PHP evaluates every condition but only the last one decides.
      let proceed = true;
      for (const condition of statement.conditions) proceed = toBool(this.evaluate(condition));
      if (statement.conditions.length > 0 && !proceed) return;
      if (this.runLoopBody(statement.body)) return;
      for (const update of statement.updates) this.evaluate(update);
    }
  }

  private executeWhile(statement: Extract<Statement, { kind: "while" }>): void {
    while (toBool(this.evaluate(statement.condition))) {
      if (this.runLoopBody(statement.body)) return;
    }
  }

  private executeDoWhile(statement: Extract<Statement, { kind: "doWhile" }>): void {
    do {
      if (this.runLoopBody(statement.body)) return;
    } while (toBool(this.evaluate(statement.condition)));
  }

  /**
   * Runs one loop iteration, reporting whether the loop should stop.
   *
   * `break 2` and `continue 2` carry outward, so a signal with levels above
   * one is rethrown with one level removed rather than consumed here.
   */
  private runLoopBody(body: readonly Statement[]): boolean {
    try {
      this.run(body);
    } catch (signal) {
      if (signal instanceof BreakSignal) {
        if (signal.levels > 1) throw new BreakSignal(signal.levels - 1);
        return true;
      }
      if (signal instanceof ContinueSignal) {
        if (signal.levels > 1) throw new ContinueSignal(signal.levels - 1);
        return false;
      }
      throw signal;
    }
    return false;
  }

  /**
   * `switch`, which in PHP compares loosely and falls through.
   *
   * `default` is taken only when no case matched, but execution still falls
   * through from wherever it starts, so the match is found first and the
   * run begins there.
   */
  private executeSwitch(statement: Extract<Statement, { kind: "switch" }>): void {
    const subject = this.evaluate(statement.subject);
    let start = statement.cases.findIndex(
      branch => branch.test !== null && looseEquals(subject, this.evaluate(branch.test))
    );
    if (start === -1) start = statement.cases.findIndex(branch => branch.test === null);
    if (start === -1) return;

    try {
      for (let index = start; index < statement.cases.length; index += 1) {
        this.run(statement.cases[index]?.body ?? []);
      }
    } catch (signal) {
      // A switch counts as one loop level for break.
      if (signal instanceof BreakSignal) {
        if (signal.levels > 1) throw new BreakSignal(signal.levels - 1);
        return;
      }
      throw signal;
    }
  }

  private executeForeach(statement: Extract<Statement, { kind: "foreach" }>): void {
    const subject = this.evaluate(statement.subject);
    if (!(subject instanceof PhpArray)) return;

    // The original iterates a snapshot, so writes inside the body do not
    // disturb the traversal.
    for (const [key, value] of subject.pairs()) {
      if (statement.keyVariable) this.reference(statement.keyVariable).set(key);
      this.reference(statement.valueVariable).set(
        value instanceof PhpArray && !statement.byReference ? value.clone() : value
      );
      try {
        this.run(statement.body);
      } catch (signal) {
        if (signal instanceof ContinueSignal) {
          if (signal.levels > 1) throw new ContinueSignal(signal.levels - 1);
          continue;
        }
        if (signal instanceof BreakSignal) {
          if (signal.levels > 1) throw new BreakSignal(signal.levels - 1);
          return;
        }
        throw signal;
      }
      if (statement.byReference) subject.set(key, this.reference(statement.valueVariable).get());
    }
  }

  private unset(expression: Expression): void {
    if (expression.kind === "variable") {
      this.context.variables.delete(expression.name);
      return;
    }
    if (expression.kind === "index" && expression.index !== null) {
      const container = this.evaluate(expression.target);
      if (container instanceof PhpArray) container.delete(this.evaluate(expression.index));
    }
  }

  private reference(expression: Expression): Reference {
    switch (expression.kind) {
      case "variable": {
        const { variables } = this.context;
        const name = expression.name;
        return {
          get: () => variables.get(name) ?? null,
          set: value => void variables.set(name, value)
        };
      }
      case "variableVariable": {
        const { variables } = this.context;
        const name = toStringValue(this.evaluate(expression.name));
        return {
          get: () => variables.get(name) ?? null,
          set: value => void variables.set(name, value)
        };
      }
      case "index": {
        const parent = this.reference(expression.target);
        let container = parent.get();
        if (!(container instanceof PhpArray)) {
          // PHP creates an array when writing through an unset or empty slot.
          container = new PhpArray();
          parent.set(container);
        }
        const array = container;
        if (expression.index === null) {
          let appended: PhpValue = null;
          let placed = false;
          return {
            get: () => appended,
            set: value => {
              appended = value;
              if (!placed) {
                array.push(value);
                placed = true;
              }
            }
          };
        }
        const key = this.evaluate(expression.index);
        return {
          get: () => array.get(key),
          set: value => array.set(key, value)
        };
      }
      case "list": {
        const targets = expression.targets;
        const self = this;
        return {
          get: () => null,
          set: value => {
            if (!(value instanceof PhpArray)) return;
            targets.forEach((target, index) => {
              if (target) self.reference(target).set(value.get(index));
            });
          }
        };
      }
      default:
        throw new TemplateError(`Cannot assign to ${expression.kind}`);
    }
  }

  /**
   * Calls a function in a value position.
   *
   * get_var_in_module() is declared `function &` in the original and hands
   * back a binding. Used as a value — `$x = get_var_in_module(...)` — PHP
   * reads through it, so the binding is resolved here and only
   * bindReference() keeps it.
   */
  private callFunction(name: string, args: readonly Expression[]): PhpValue {
    const result = this.callFunctionRaw(name, args);
    return result instanceof PhpRef ? result.slot.get() : result;
  }

  private callFunctionRaw(name: string, args: readonly Expression[]): PhpValue | PhpRef {
    const lowered = name.toLowerCase();

    // `template('x')` resolves a name; the include statement does the work.
    if (lowered === "template") return toStringValue(this.evaluate(args[0] as Expression));
    if (lowered === "defined") {
      return this.context.constants.has(toStringValue(this.evaluate(args[0] as Expression)));
    }
    if (lowered === "function_exists") {
      const target = toStringValue(this.evaluate(args[0] as Expression));
      return this.context.functions.has(target) || this.context.writeFunctions?.has(target) === true ||
        PHP_BUILTINS[target.toLowerCase()] !== undefined;
    }
    // Output buffering is about this renderer's own output, so it cannot
    // be a plain builtin.
    if (lowered === "ob_start") {
      this.#buffers.push("");
      return true;
    }
    if (lowered === "ob_get_contents") {
      return this.#buffers.length === 0 ? false : this.#buffers[this.#buffers.length - 1] as string;
    }
    if (lowered === "ob_get_length") {
      return this.#buffers.length === 0
        ? false
        : byteLength(this.#buffers[this.#buffers.length - 1] as string);
    }
    if (lowered === "ob_clean") {
      if (this.#buffers.length > 0) this.#buffers[this.#buffers.length - 1] = "";
      return true;
    }
    if (lowered === "ob_end_clean") {
      if (this.#buffers.length === 0) return false;
      this.#buffers.pop();
      return true;
    }
    if (lowered === "ob_end_flush" || lowered === "ob_flush" || lowered === "flush") {
      if (lowered !== "ob_end_flush") return true;
      if (this.#buffers.length === 0) return false;
      const finished = this.#buffers.pop() as string;
      this.write(finished);
      return true;
    }
    if (lowered === "ob_get_clean") {
      if (this.#buffers.length === 0) return false;
      return this.#buffers.pop() as string;
    }
    if (lowered === "ob_implicit_flush" || lowered === "ob_get_level") {
      return lowered === "ob_get_level" ? this.#buffers.length : true;
    }

    if (lowered === "constant") {
      return this.context.constants.get(toStringValue(this.evaluate(args[0] as Expression))) ?? null;
    }

    const values = args.map(argument => this.evaluate(argument));

    const writer = this.context.writeFunctions?.get(name) ?? this.context.writeFunctions?.get(lowered);
    if (writer) {
      this.write(writer(values));
      return null;
    }

    // Original module functions keep their namespace in the key.
    const host = this.context.functions.get(name) ?? this.context.functions.get(lowered);
    if (host) return host(values);

    // A compiled module function, dispatched through the hook chain. Its
    // arguments are rebuilt because a by-reference parameter needs a slot
    // rather than the value already computed above.
    if (this.context.callQualified && this.context.hasQualified?.(name)) {
      return this.context.callQualified(name, this.callArguments(name, args));
    }

    const builtin = PHP_BUILTINS[lowered];
    if (builtin) {
      const references = BUILTIN_REFERENCE_PARAMETERS[lowered];
      return builtin(references ? this.callArguments(lowered, args) as PhpValue[] : values);
    }

    throw new TemplateError(
      `Original function not ported: ${name}. Register it on the template context rather than approximating it.`
    );
  }

  /**
   * Builds the arguments for a module function call.
   *
   * A parameter declared `&$x` is passed as a slot, so the callee's writes
   * reach the caller's variable. 3,509 of the original's parameters are
   * declared that way, and the combat and item code depends on it: they
   * take `(&$pa, &$pd)` and modify the players in place.
   *
   * An argument that is not a place — a literal, an expression — cannot be
   * bound, and PHP passes those by value too.
   */
  private callArguments(target: string, args: readonly Expression[]): (PhpValue | PhpRef)[] {
    const byReference =
      this.context.referenceParameters?.(target) ??
      BUILTIN_REFERENCE_PARAMETERS[target.toLowerCase()] ??
      [];
    return args.map((argument, index) =>
      byReference[index] ? this.bindReference(argument) : this.evaluate(argument)
    );
  }

  /**
   * Produces a binding for an expression where one is wanted.
   *
   * A variable, an array element or a variable variable names a place, so a
   * slot is taken for it. `get_var_in_module()` returns `& $GLOBALS[...]`
   * in the original, so a call may hand back a binding of its own. Anything
   * else — a literal, an arithmetic expression — has no place to bind to,
   * and PHP passes those by value too.
   */
  private bindReference(expression: Expression): PhpValue | PhpRef {
    if (
      expression.kind === "variable" ||
      expression.kind === "index" ||
      expression.kind === "variableVariable"
    ) {
      return new PhpRef(this.reference(expression));
    }
    // A `function &` such as get_var_in_module() hands back a binding of
    // its own, which must survive instead of being read through.
    if (expression.kind === "call") {
      return this.callFunctionRaw(expression.callee, expression.args);
    }
    return this.evaluate(expression);
  }

  private evaluate(expression: Expression): PhpValue {
    switch (expression.kind) {
      case "literal":
        return expression.value;
      case "interpolate":
        return expression.parts.map(part => toStringValue(this.evaluate(part))).join("");
      case "variable":
        // $GLOBALS reaches the real global scope even from a function body.
        if (expression.name === "GLOBALS") {
          const globals = this.context.globals ?? this.context.variables;
          const view = new PhpArray();
          for (const [name, value] of globals) view.set(name, value);
          return view;
        }
        return this.context.variables.get(expression.name) ?? null;
      case "variableVariable":
        return this.context.variables.get(toStringValue(this.evaluate(expression.name))) ?? null;
      case "constant": {
        const { constants } = this.context;
        if (constants.has(expression.name)) return constants.get(expression.name) ?? null;
        // An undefined constant is a fatal error in PHP 8; surfacing it keeps
        // a missing MOD_* flag from silently reading as its own name.
        throw new TemplateError(`Undefined constant ${expression.name}`);
      }
      case "index": {
        const target = this.evaluate(expression.target);
        if (expression.index === null) return null;
        const key = this.evaluate(expression.index);
        if (target instanceof PhpArray) return target.get(key);
        if (typeof target === "string") {
          const offset = toInt(key);
          return target[offset < 0 ? target.length + offset : offset] ?? "";
        }
        return null;
      }
      case "property":
        return null;
      // These three exist for module code, which the module interpreter
      // runs. Reaching one here means a template or a module function
      // needs behaviour this renderer does not have, and guessing a value
      // would be a silent behaviour change, so it says so instead.
      case "new": {
        // Exceptions are the only objects the original builds. Anything
        // else would need a class model it does not have, so it is
        // reported rather than approximated with an empty value.
        const known = ["exception", "runtimeexception", "logicexception", "errorexception"];
        if (!known.includes(expression.className.toLowerCase())) {
          throw new TemplateError(
            `The original constructs no ${expression.className}; only exceptions are supported.`
          );
        }
        const message = expression.args[0] ? toStringValue(this.evaluate(expression.args[0])) : "";
        return new PhpException(expression.className, message) as unknown as PhpValue;
      }
      case "methodCall": {
        const target = this.evaluate(expression.target);
        if (target instanceof PhpException) {
          const method = expression.name.toLowerCase();
          if (method === "getmessage") return target.message;
          if (method === "getcode") return 0;
          throw new TemplateError(`Exception has no ${expression.name}() in this port.`);
        }
        // $db. Every `->` in the original's module tree is on it.
        if (target instanceof LegacyDatabase) {
          const method = (target as unknown as Record<string, unknown>)[expression.name];
          if (typeof method !== "function") {
            throw new TemplateError(
              `The original's database has no ${expression.name}(); the twelve it uses ` +
                "are implemented in src/legacy/php/database.ts."
            );
          }
          const args = expression.args.map(argument => this.evaluate(argument));
          return (method as (...values: PhpValue[]) => PhpValue).apply(target, args);
        }
        throw new TemplateError(
          `Method call ->${expression.name}() is not available here. Only the database ` +
            `object has methods in the original, and it is not bound in this context.`
        );
      }
      case "dynamicCall": {
        // `$chprocess(...)`: in the original $chprocess holds the name of
        // the implementation this one replaced, and calling it is a
        // variable-function call, so the callee is resolved to a string and
        // dispatched by name.
        const callee = this.evaluate(expression.callee);
        const target = toStringValue(callee);
        if (!this.context.callQualified) {
          throw new TemplateError(
            `A dynamic call to ${target} needs the module runtime, which this context ` +
              "does not provide."
          );
        }
        return this.context.callQualified(target, this.callArguments(target, expression.args));
      }
      case "includeExpression": {
        // PHP returns whatever the included file returns, or 1 when it
        // returns nothing, which is every template here. The output it
        // produced has already been appended.
        const name = toStringValue(this.evaluate(expression.template));
        this.include(name);
        return 1;
      }
      case "reference":
        // `&$x` binds only where something can hold the binding: the right
        // of an assignment, and a by-reference argument. Both are handled
        // before evaluation reaches here.
        //
        // The remaining position is inside an array literal —
        // `array('itm' => &$itm0)` — where PHP stores a real reference and
        // the item code writes through it. PhpArray holds values, so that
        // binding cannot be represented yet. Returning the value would make
        // those writes vanish silently, so it is refused instead and shows
        // up as a blocked function rather than a wrong one.
        throw new TemplateError(
          "A reference inside an array literal is not supported yet: PhpArray holds " +
            "values, so the binding would be lost and writes through it would vanish."
        );
      case "call":
        return this.callFunction(expression.callee, expression.args);
      case "isset":
        return expression.targets.every(target => this.evaluateQuiet(target) !== null);
      case "empty":
        return !toBool(this.evaluateQuiet(expression.target));
      case "list":
        return null;
      case "array": {
        const array = new PhpArray();
        for (const entry of expression.entries) {
          if (entry.key === null) array.push(this.evaluate(entry.value));
          else array.set(this.evaluate(entry.key), this.evaluate(entry.value));
        }
        return array;
      }
      case "unary":
        return this.evaluateUnary(expression.operator, expression.operand);
      case "binary":
        return this.evaluateBinary(expression.operator, expression.left, expression.right);
      case "ternary": {
        const condition = this.evaluate(expression.condition);
        if (expression.then === null) return toBool(condition) ? condition : this.evaluate(expression.otherwise);
        return toBool(condition) ? this.evaluate(expression.then) : this.evaluate(expression.otherwise);
      }
      case "assign":
        return this.evaluateAssign(expression);
      case "incdec": {
        const slot = this.reference(expression.target);
        const before = slot.get();
        const after = expression.operator === "++" ? toNumber(before) + 1 : toNumber(before) - 1;
        slot.set(after);
        return expression.prefix ? after : before;
      }
    }
  }

  /** isset() and empty() must not raise on an undefined constant or slot. */
  private evaluateQuiet(expression: Expression): PhpValue {
    try {
      return this.evaluate(expression);
    } catch (error) {
      if (error instanceof TemplateError) return null;
      throw error;
    }
  }

  private evaluateUnary(operator: string, operand: Expression): PhpValue {
    if (operator === "@") return this.evaluateQuiet(operand);
    const value = this.evaluate(operand);
    switch (operator) {
      case "!": return !toBool(value);
      case "-": return -toNumber(value);
      case "+": return toNumber(value);
      case "~": return ~toInt(value);
      default: throw new TemplateError(`Unsupported unary ${operator}`);
    }
  }

  private evaluateBinary(operator: string, leftNode: Expression, rightNode: Expression): PhpValue {
    // Short-circuit before evaluating the right-hand side.
    if (operator === "&&" || operator === "and") {
      return toBool(this.evaluate(leftNode)) ? toBool(this.evaluate(rightNode)) : false;
    }
    if (operator === "||" || operator === "or") {
      return toBool(this.evaluate(leftNode)) ? true : toBool(this.evaluate(rightNode));
    }
    if (operator === "??") {
      const left = this.evaluateQuiet(leftNode);
      return left === null ? this.evaluate(rightNode) : left;
    }

    const left = this.evaluate(leftNode);
    const right = this.evaluate(rightNode);

    switch (operator) {
      case ".": return toStringValue(left) + toStringValue(right);
      case "+":
        if (left instanceof PhpArray && right instanceof PhpArray) {
          const union = left.clone();
          for (const [key, value] of right.pairs()) if (!union.has(key)) union.set(key, value);
          return union;
        }
        return toNumber(left) + toNumber(right);
      case "-": return toNumber(left) - toNumber(right);
      case "*": return toNumber(left) * toNumber(right);
      case "/": {
        const divisor = toNumber(right);
        if (divisor === 0) throw new TemplateError("Division by zero");
        return toNumber(left) / divisor;
      }
      case "%": {
        const divisor = toInt(right);
        if (divisor === 0) throw new TemplateError("Modulo by zero");
        return toInt(left) % divisor;
      }
      case "**": return toNumber(left) ** toNumber(right);
      case "==": return looseEquals(left, right);
      case "!=": case "<>": return !looseEquals(left, right);
      case "===": return strictEquals(left, right);
      case "!==": return !strictEquals(left, right);
      case "<": return compareValues(left, right) < 0;
      case "<=": return compareValues(left, right) <= 0;
      case ">": return compareValues(left, right) > 0;
      case ">=": return compareValues(left, right) >= 0;
      case "<=>": return compareValues(left, right);
      case "&": return toInt(left) & toInt(right);
      case "|": return toInt(left) | toInt(right);
      case "^": return toInt(left) ^ toInt(right);
      case "<<": return toInt(left) << toInt(right);
      case ">>": return toInt(left) >> toInt(right);
      case "xor": return toBool(left) !== toBool(right);
      default: throw new TemplateError(`Unsupported operator ${operator}`);
    }
  }

  private evaluateAssign(expression: Extract<Expression, { kind: "assign" }>): PhpValue {
    // `$a = &$b` binds rather than copies, so the target name has to become
    // an alias before any slot for it is taken.
    if (expression.operator === "=" && expression.value.kind === "reference") {
      const bound = this.bindReference(expression.value.target);
      if (bound instanceof PhpRef && expression.target.kind === "variable") {
        const scope = this.context.variables;
        if (scope instanceof ModuleScope) {
          scope.alias(expression.target.name, bound.slot);
          return bound.slot.get();
        }
      }
      // Outside a module scope there is nothing to bind to, so the value is
      // copied; a template has no module variables to alias in the first
      // place.
      const value = bound instanceof PhpRef ? bound.slot.get() : bound;
      this.reference(expression.target).set(value);
      return value;
    }

    const slot = this.reference(expression.target);
    if (expression.operator === "=") {
      const value = this.evaluate(expression.value);
      slot.set(value instanceof PhpArray ? value.clone() : value);
      return slot.get();
    }
    if (expression.operator === "??=") {
      const current = slot.get();
      if (current !== null) return current;
      const value = this.evaluate(expression.value);
      slot.set(value);
      return value;
    }
    const binary = expression.operator.slice(0, -1);
    const value = this.evaluateBinaryValues(binary, slot.get(), this.evaluate(expression.value));
    slot.set(value);
    return value;
  }

  private evaluateBinaryValues(operator: string, left: PhpValue, right: PhpValue): PhpValue {
    switch (operator) {
      case ".": return toStringValue(left) + toStringValue(right);
      case "+": return toNumber(left) + toNumber(right);
      case "-": return toNumber(left) - toNumber(right);
      case "*": return toNumber(left) * toNumber(right);
      case "/": return toNumber(left) / toNumber(right);
      case "%": return toInt(left) % toInt(right);
      case "**": return toNumber(left) ** toNumber(right);
      default: throw new TemplateError(`Unsupported compound assignment ${operator}=`);
    }
  }
}
