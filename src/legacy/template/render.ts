/**
 * Evaluates the PHP that the original's template compiler emits.
 *
 * Workers forbid generating code at runtime, so the compiled output is
 * interpreted rather than transpiled. `include template('x')` runs the
 * included template in the same scope, as PHP's include does, which several
 * templates rely on to see variables the caller set.
 */
import type { Expression, Statement } from "./ast";
import { PHP_BUILTINS, type HostFunction } from "./builtins";
import { compileTemplate, type CompileOptions } from "./compile";
import { parseTemplateProgram } from "./parser";
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
   * The true global scope, which $GLOBALS exposes. gexit() renders the error
   * template inside a function, so only the variables it imports are in
   * scope there while $GLOBALS still reaches everything; keeping the two
   * separate is what makes that page match.
   */
  readonly globals?: Map<string, PhpValue> | undefined;
  /** Returns a template's source by the name template() would resolve. */
  readonly loadTemplate: (name: string) => string | undefined;
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
    loadTemplate: overrides.loadTemplate,
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
  private readonly compiledCache = new Map<string, Statement[]>();

  constructor(private readonly context: TemplateContext) {}

  include(name: string): void {
    let program = this.compiledCache.get(name);
    if (!program) {
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
        this.output += statement.text;
        return;
      case "echo":
        for (const value of statement.values) this.output += toStringValue(this.evaluate(value));
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
        if (statement.value) this.output += toStringValue(this.evaluate(statement.value));
        throw new TemplateExit(this.output);
      case "return":
        throw new ReturnSignal(statement.value ? this.evaluate(statement.value) : null);
      case "break":
        throw new BreakSignal(statement.levels);
      case "continue":
        throw new ContinueSignal(statement.levels);
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

  private callFunction(name: string, args: readonly Expression[]): PhpValue {
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
    if (lowered === "constant") {
      return this.context.constants.get(toStringValue(this.evaluate(args[0] as Expression))) ?? null;
    }

    const values = args.map(argument => this.evaluate(argument));

    const writer = this.context.writeFunctions?.get(name) ?? this.context.writeFunctions?.get(lowered);
    if (writer) {
      this.output += writer(values);
      return null;
    }

    // Original module functions keep their namespace in the key.
    const host = this.context.functions.get(name) ?? this.context.functions.get(lowered);
    if (host) return host(values);

    const builtin = PHP_BUILTINS[lowered];
    if (builtin) return builtin(values);

    throw new TemplateError(
      `Original function not ported: ${name}. Register it on the template context rather than approximating it.`
    );
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
      case "methodCall":
        throw new TemplateError(
          `Method call ->${expression.name}() is not available here. Only the database ` +
            `object has methods in the original, and it is not bound in this context.`
        );
      case "dynamicCall":
        throw new TemplateError(
          "A dynamic call such as $chprocess() needs the hook chain, which this context " +
            "does not provide."
        );
      case "reference":
        throw new TemplateError(
          "A reference (&$x) cannot be taken in this context; it needs the module " +
            "interpreter's variable slots."
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
