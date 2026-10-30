/**
 * Runs the original's compiled module functions.
 *
 * This is the piece the rest of the port waits on. A module function is not
 * a plain function: it opens with `if (eval(__MAGIC__)) return
 * $___RET_VALUE;`, which may hand the call to whichever module registered
 * last; it reads its configuration through `eval(import_module(...))`,
 * which aliases module variables into its scope by reference; and it calls
 * the implementation it replaced through `$chprocess(...)`.
 *
 * src/legacy/php/dispatch.ts has the dispatch rule, taken from
 * modules.func.php. This supplies the scope, the imports and the calling.
 */
import { LEGACY_HOOK_CHAINS } from "../../generated/legacy-hook-manifest";
import type { CompiledPhpFunction } from "../module-compiler";
import type { Statement } from "../template/ast";
import type { HostFunction } from "../template/builtins";
import { createTemplateContext, executeCompiledFunctionProgram } from "../template/render";
import { PhpArray, toStringValue, type PhpValue } from "../template/values";
import {
  HookChains,
  NULL_FUNCTION,
  qualify,
  resolveDispatch,
  splitQualified
} from "./dispatch";
import { ModuleScope, ModuleVariableStore, PhpRef, type Slot } from "./module-store";

/** The marker `import_module()` returns, which `eval()` then consumes. */
const IMPORTED = "__DTS_IMPORT_APPLIED__";

/**
 * The value `__MAGIC__` carries here.
 *
 * In the original it is a string of PHP that every hooked function runs as
 * its first statement: it decides whether to hand the call to a newer
 * implementation, and sets $chprocess when it does not.
 *
 * This runtime makes that decision in call() before the body starts, so by
 * the time a body evaluates `if (eval(__MAGIC__))` the answer is always
 * "keep going" — the redirect case never reaches a body at all. eval()
 * therefore returns false for this marker, which is what the prologue
 * returns when it has set $chprocess rather than redirected.
 */
const MAGIC = "__DTS_MAGIC_PROLOGUE__";

/**
 * Builds the hook chains the original would have after loading all 735
 * enabled modules.
 *
 * The manifest records every one of the 5,235 implementations with the load
 * order of the module that declares it, so the chains here are the real
 * ones rather than the ones that happen to be compiled.
 */
function buildChainsFromManifest(): HookChains {
  const chains = new HookChains();
  for (const [name, entries] of Object.entries(LEGACY_HOOK_CHAINS)) {
    const ordered = [...entries].sort((left, right) => left.order - right.order);
    for (const entry of ordered) chains.register(entry.module, name);
  }
  return chains;
}

/**
 * Raised when the original would run an implementation this port has not
 * compiled.
 *
 * It names the module so the next step is obvious, and it is a distinct
 * type so a caller can report the page as unported rather than broken.
 */
export class LegacyFunctionNotCompiled extends Error {
  constructor(
    readonly qualified: string,
    readonly module: string,
    readonly functionName: string
  ) {
    super(
      `The original dispatches ${functionName}() to ${qualified}, which is not ` +
        `compiled yet. Add the ${module} module to ` +
        "scripts/generate-compiled-modules.mjs once its parity test passes."
    );
    this.name = "LegacyFunctionNotCompiled";
  }
}

export interface ModuleRuntimeOptions {
  /** Constants the original defines before a page runs. */
  readonly constants?: ReadonlyMap<string, PhpValue>;
  /** Host functions this port provides, keyed as the original writes them. */
  readonly functions?: ReadonlyMap<string, HostFunction>;
  readonly loadTemplate?: (name: string) => string | undefined;
}

export class LegacyModuleRuntime {
  readonly store: ModuleVariableStore;
  readonly chains: HookChains;
  readonly #functions = new Map<string, CompiledPhpFunction>();
  readonly #options: ModuleRuntimeOptions;

  constructor(store = ModuleVariableStore.fromOriginal(), options: ModuleRuntimeOptions = {}) {
    this.store = store;
    this.#options = options;
    this.chains = buildChainsFromManifest();
  }

  /**
   * Supplies the bodies for a module's functions.
   *
   * This does not build the chain. The chain comes from the manifest and
   * always holds all 735 modules, because a partly compiled port must not
   * be able to pick a different implementation than the original would: if
   * dispatch lands on a module that has no body yet, the call fails saying
   * so rather than quietly running an older one.
   */
  registerModule(functions: readonly CompiledPhpFunction[]): void {
    for (const fn of functions) {
      const key = qualify(fn.namespace, fn.name);
      const chain = this.chains.chain(fn.name);
      // A name absent from the manifest is not dispatched at all. init() is
      // the common case: __INIT_MODULE__ calls it directly while loading,
      // so it is never registered as a hook and cannot be overridden.
      if (chain.length > 0 && !chain.includes(key)) {
        throw new Error(
          `${key} is not in the original's chain for ${fn.name}, which holds ` +
            `${chain.join(", ")}. The compiled source and the hook manifest disagree.`
        );
      }
      this.#functions.set(key, fn);
    }
  }

  /**
   * Resolves a name the way PHP resolves one inside a namespace.
   *
   * A name written with a namespace means exactly that function. A bare
   * name inside `namespace map` means `map\…` first and the global
   * namespace second, which is how map/main.php:101 calls
   * `get_current_area()` from inside `map`.
   */
  resolve(name: string, namespace?: string): string {
    const written = name.replace(/^\\+/, "").toLowerCase();
    if (written.includes("\\")) return written;
    if (namespace) {
      const scoped = qualify(namespace, written);
      if (this.#functions.has(scoped) || this.chains.chain(written).length > 0) return scoped;
    }
    return written;
  }

  has(name: string, namespace?: string): boolean {
    return this.#functions.has(this.resolve(name, namespace));
  }

  /** Which parameters of a function are declared `&$x`. */
  referenceParameters(name: string, namespace?: string): readonly boolean[] {
    const fn = this.#functions.get(this.resolve(name, namespace));
    return fn ? fn.parameters.map(parameter => parameter.byReference) : [];
  }

  /**
   * Calls a function by its qualified name, entering the chain where the
   * original's prologue would.
   */
  call(
    name: string,
    args: readonly (PhpValue | PhpRef)[] = [],
    caller?: string,
    namespace?: string
  ): PhpValue {
    const target = this.resolve(name, namespace);

    // __MODULE_NULLFUNCTION__ is what $chprocess holds when nothing was
    // overridden, and the original's version returns NULL.
    if (target === NULL_FUNCTION.toLowerCase()) return null;

    const dispatch = resolveDispatch(this.chains, target, caller);
    if (dispatch.kind === "redirect") {
      // The prologue calls the newest implementation from inside the one it
      // redirected away from, so that is the caller the newest sees.
      return this.call(dispatch.target, args, target);
    }

    const fn = this.#functions.get(target);
    if (!fn) {
      // Dispatch chose this implementation because the original would have.
      // Falling back to one that happens to be compiled would run different
      // game logic than the original, so the call stops here instead.
      const { module, name: bare } = splitQualified(target);
      throw new LegacyFunctionNotCompiled(target, module, bare);
    }
    return this.#run(fn, target, args, dispatch.chprocess);
  }

  #run(
    fn: CompiledPhpFunction,
    qualified: string,
    args: readonly (PhpValue | PhpRef)[],
    chprocess: string
  ): PhpValue {
    const scope = new ModuleScope();

    // $chprocess holds the name of the implementation this one replaced;
    // calling it is a variable-function call in the original.
    scope.set("chprocess", chprocess);

    this.#bindParameters(fn, scope, args);

    const context = createTemplateContext({
      variables: scope,
      globals: scope,
      constants: new Map([...(this.#options.constants ?? []), ["__MAGIC__", MAGIC]]),
      functions: this.hostFunctions(scope, qualified),
      callQualified: (name, callArgs) => this.call(name, callArgs, qualified, fn.namespace),
      hasQualified: name => this.has(name, fn.namespace),
      referenceParameters: name => this.referenceParameters(name, fn.namespace),
      loadTemplate: this.#options.loadTemplate ?? (() => undefined)
    });

    return executeCompiledFunctionProgram(fn.program, context).value;
  }

  /**
   * Places the arguments in the callee's scope.
   *
   * A by-reference parameter aliases the caller's slot, so writes reach the
   * caller's variable. A missing argument takes its default, which is an
   * expression in the original and so is evaluated rather than read off.
   */
  #bindParameters(
    fn: CompiledPhpFunction,
    scope: ModuleScope,
    args: readonly (PhpValue | PhpRef)[]
  ): void {
    fn.parameters.forEach((parameter, index) => {
      if (parameter.variadic) {
        const rest = new PhpArray();
        for (const value of args.slice(index)) {
          rest.push(value instanceof PhpRef ? value.slot.get() : value);
        }
        scope.set(parameter.name, rest);
        return;
      }

      if (index < args.length) {
        const supplied = args[index];
        if (supplied instanceof PhpRef) scope.alias(parameter.name, supplied.slot);
        else scope.set(parameter.name, supplied ?? null);
        return;
      }

      if (parameter.defaultValue === null) {
        scope.set(parameter.name, null);
        return;
      }
      const { value } = executeCompiledFunctionProgram(
        [{ kind: "return", value: parameter.defaultValue } as Statement],
        createTemplateContext({
          variables: scope,
          globals: scope,
          constants: new Map([...(this.#options.constants ?? []), ["__MAGIC__", MAGIC]]),
          loadTemplate: () => undefined
        })
      );
      scope.set(parameter.name, value);
    });
  }

  /**
   * The host functions a module body can reach.
   *
   * import_module and get_var_in_module both need the scope they are
   * acting on, so they are built per scope rather than shared. A page
   * template needs them too: map_display.htm opens with
   * `eval(import_module('sys','map'))`, which brings the map's variables
   * into the template's own scope, so the same implementations are used
   * there rather than a second copy that could drift.
   */
  hostFunctions(scope: ModuleScope, qualified = ""): Map<string, HostFunction> {
    const functions = new Map<string, HostFunction>(this.#options.functions ?? []);

    // eval() in the original executes the code import_module() returned.
    // Here import_module has already applied its effect, so eval only has
    // to recognise that and not treat the marker as a value.
    functions.set("eval", values => {
      const first = values[0] ?? null;
      // The hook prologue: already resolved in call(), so it reports
      // "continue with this body".
      if (first === MAGIC) return false;
      if (first === IMPORTED) return null;
      return first;
    });

    functions.set("import_module", values => {
      for (const value of values) this.#importInto(scope, toStringValue(value));
      return IMPORTED;
    });

    // get_var_in_module($varname, $modulename) returns a reference into the
    // module's storage, and returns NULL for an unknown module, which is
    // what `!defined('MOD_X')` reports there.
    functions.set("get_var_in_module", values => {
      const name = toStringValue(values[0] ?? null);
      const module = toStringValue(values[1] ?? null);
      if (!name || !this.store.has(module)) return null;
      return new PhpRef(this.store.slot(module, name)) as unknown as PhpValue;
    });

    functions.set("__MODULE_NULLFUNCTION__", () => null);

    // The name of the function currently running, which a few helpers read.
    functions.set("__FUNCTION__", () => qualified);

    return functions;
  }

  /**
   * Aliases one module's variables into a scope.
   *
   * IMPORT_MODULE_<X>_GLOBALS expands to
   * `$name = &$___LOCAL_<X>__VARS__name;` for every variable the module
   * defines, so these are bindings and a write reaches the module.
   */
  #importInto(scope: ModuleScope, module: string): void {
    if (!this.store.has(module)) {
      // The original throws `undefined module X` from import_module().
      throw new Error(`undefined module ${module}`);
    }
    for (const name of this.store.names(module)) {
      scope.alias(name, this.store.slot(module, name));
    }
  }

  /** A slot for one module variable, for callers outside the runtime. */
  slot(module: string, name: string): Slot {
    return this.store.slot(module, name);
  }

  /** The qualified names registered, for coverage reporting. */
  registered(): readonly string[] {
    return [...this.#functions.keys()];
  }
}

export { splitQualified, qualify };
