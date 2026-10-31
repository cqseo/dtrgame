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
import { LEGACY_MODULES } from "../../generated/legacy-registry";
import { LEGACY_COMPILED_INCLUDES } from "../../generated/legacy-compiled-includes";
import { LEGACY_PAGE_SCRIPTS } from "../../generated/legacy-page-scripts";
import { parseModuleFile } from "./parser";
import { gdecode, gencode } from "./codec";
import type { LegacyDatabase } from "./database";
import type { CompiledPhpFunction } from "../module-compiler";
import type { Statement } from "../template/ast";
import type { HostFunction } from "../template/builtins";
import type { CompileOptions } from "../template/compile";
import { TemplateExit, createTemplateContext, executeCompiledFunctionProgram } from "../template/render";
import { PhpArray, toBool, toStringValue, type PhpValue } from "../template/values";
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
  /**
   * The database. It lives in the sys module's variables as $db, which is
   * how every module reaches it after eval(import_module('sys')), so it is
   * placed there rather than passed around.
   */
  readonly database?: LegacyDatabase;
  /** Host functions this port provides, keyed as the original writes them. */
  readonly functions?: ReadonlyMap<string, HostFunction>;
  readonly loadTemplate?: (name: string) => string | undefined;
  /**
   * How a template is compiled, chiefly the language pack.
   *
   * {lang x} is substituted when the template is compiled, not when it
   * is rendered. Without the pack a page still renders, but every
   * translated string comes out as its own placeholder -- the
   * registration page showed !vq_question_desc! where the question
   * belongs -- which is a page that works and is not the original's.
   */
  readonly compileOptions?: CompileOptions | undefined;
}

/**
 * PHP's superglobals, which are in scope everywhere without `global`.
 *
 * $GLOBALS is not here: the renderer answers it directly from the
 * global scope, so aliasing it would make it a copy of itself.
 */
const SUPERGLOBALS = ["_GET", "_POST", "_COOKIE", "_REQUEST", "_SERVER", "_FILES", "_ENV"] as const;

/** What a page script needs to know about the HTTP request. */
export interface LegacyPageRequest {
  readonly method?: string;
  readonly uri?: string;
  readonly post?: readonly (readonly [string, string])[];
  readonly get?: readonly (readonly [string, string])[];
  readonly cookies?: readonly (readonly [string, string])[];
  readonly remoteAddress?: string;
  readonly userAgent?: string;
}

export class LegacyModuleRuntime {
  readonly store: ModuleVariableStore;
  readonly chains: HookChains;
  readonly #functions = new Map<string, CompiledPhpFunction>();
  /** Kept so render_page can build a nested runtime with the same modules. */
  readonly #moduleTables: (readonly CompiledPhpFunction[])[] = [];
  /**
   * The true global scope, which `global $x` binds to.
   *
   * A handful of names are both a global and a sys module variable -- $db,
   * $gtablepre, $room_id -- because common.inc.php sets them up for
   * everything that follows. They are aliased rather than copied so the
   * two never drift apart during a request.
   */
  readonly #globals = new ModuleScope();
  /**
   * One live constants table for the whole request.
   *
   * define() at the top of a page script has to be visible to everything
   * loaded afterwards -- CURSCRIPT, IN_GAME and LOAD_CORE_ONLY steer what
   * common.inc.php does -- so the map is built once and shared, not
   * rebuilt per call.
   */
  readonly #constants = new Map<string, PhpValue>();
  /**
   * The original's gamedata/cache directory, in memory.
   *
   * The registration captcha builds its corpus once and caches it as a
   * PHP file, then includes that file on later requests. A Worker has no
   * disk, but the behaviour the original depends on is "write it, then
   * read it back", which an isolate-lifetime map reproduces exactly:
   * same content, same include, and a cold isolate simply rebuilds the
   * corpus as a cold PHP process would after the cache was cleared.
   *
   * It is deliberately limited to the cache directory. Anything else the
   * original writes -- logs, replays, the module list -- is refused by
   * host-environment.ts rather than quietly kept somewhere a later
   * request cannot see.
   */
  readonly #cacheFiles = new Map<string, string>();
  readonly #cachePrograms = new Map<string, readonly Statement[]>();
  /**
   * `static $x` values, per function, for the life of the request.
   *
   * PHP keeps a static for the process, which under PHP-FPM is one
   * request; a runtime is built per request here, so the lifetimes
   * line up.
   */
  readonly #statics = new Map<string, Map<string, PhpValue | undefined>>();
  readonly #options: ModuleRuntimeOptions;

  constructor(store = ModuleVariableStore.fromOriginal(), options: ModuleRuntimeOptions = {}) {
    this.store = store;
    this.#options = options;
    this.chains = buildChainsFromManifest();
    if (options.database) {
      this.store.set("sys", "db", options.database as unknown as PhpValue);
    }
    for (const shared of ["db", "gtablepre", "tablepre", "room_id", "now"]) {
      this.#globals.alias(shared, this.store.slot("sys", shared));
    }
    for (const [name, value] of options.constants ?? []) this.#constants.set(name, value);
    this.#constants.set("__MAGIC__", MAGIC);
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
    this.#moduleTables.push(functions);
    for (const fn of functions) {
      // A global-namespace function is keyed by its bare name: it is not
      // a hook, cannot be overridden, and module code calls it unqualified.
      if (fn.namespace === "") {
        this.#functions.set(fn.name.toLowerCase(), fn);
        continue;
      }
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
  /**
   * Which of a function's parameters are declared `&$x`.
   *
   * Undefined, not an empty array, when this runtime has no such
   * function: an empty array is an answer -- "it takes none by
   * reference" -- and the renderer would stop there instead of
   * consulting the builtin table. That is what silently disabled
   * preg_match_all's $matches, so the registration captcha built its
   * corpus from nothing.
   */
  referenceParameters(name: string, namespace?: string): readonly boolean[] | undefined {
    const fn = this.#functions.get(this.resolve(name, namespace));
    return fn ? fn.parameters.map(parameter => parameter.byReference) : undefined;
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

  /**
   * Runs one of the original's top-level page scripts.
   *
   * register.php, help.php and the rest are not functions: they are
   * statements at file scope that read $_POST, call the same global
   * functions the modules call, and echo their result. Running them
   * rather than re-implementing each one by hand is the same choice
   * already made for the modules, and for the same reason -- the
   * original is the specification, and a hand-written page would be a
   * second, divergent one.
   *
   * The script shares the global scope, as PHP does at file scope, so a
   * variable it sets is visible to whatever it includes.
   *
   * Returns what the script echoed, which for these pages is the whole
   * response body.
   */
  /**
   * The one file the Worker answers for itself: include/common.inc.php.
   *
   * Everything that file does, this runtime has already done by the time
   * a page runs. It requires global.func.php, user.func.php,
   * room.func.php, messages.func.php and modules.func.php, which are
   * compiled in; it walks gamedata/modules.list.php requiring each
   * module.inc.php, and all 735 enabled modules are registered; it then
   * imports a few modules into the page scope and, unless told not to,
   * runs sys\routine().
   *
   * What it cannot do here is the part that reads the filesystem -- the
   * module list, the cache directory, ini_set and the error handler --
   * because a Worker has no filesystem. So the remaining observable
   * effects are reproduced directly: the constants it defines, the
   * module import, and the tick.
   *
   * This substitution is invalidated if the original's module list stops
   * matching the generated registry, which is why the registry is
   * generated from that same list rather than written by hand.
   */
  #commonIncProgram(): readonly Statement[] {
    return [{ kind: "expression", expression: { kind: "call", callee: "__dts_common_inc__", args: [] } }];
  }

  /** Resolves an include of one of the original's .php files. */
  #loadPhp(name: string): readonly Statement[] | undefined {
    // The original builds these paths from GAME_ROOT, so what arrives can
    // be "/./include/..." or "./include/..." for the same file.
    const path = name.replace(/^\/?\.\//, "").replace(/^.*?(?=include\/|gamedata\/)/, "");
    if (path === "include/common.inc.php") return this.#commonIncProgram();
    // The function libraries are compiled in, so requiring one is
    // already satisfied; running it again would redeclare its functions,
    // which PHP itself would refuse.
    if (/^include\/(global|user|messages|valid|socket|itemplace|bubblebox)\.func\.php$/.test(path)) return [];
    if (/^include\/(roommng\/room|roommng\/roommng|modules\/modules)\.func\.php$/.test(path)) return [];
    // Small data files the pages include verbatim, compiled at build time.
    const data = LEGACY_COMPILED_INCLUDES[name] ?? LEGACY_COMPILED_INCLUDES[`./${path}`];
    if (data) return data;
    // A file this request wrote to the in-memory cache and is now
    // including back, which is how the captcha corpus is kept.
    const cached = this.#cacheFiles.get(name);
    if (cached !== undefined) {
      let program = this.#cachePrograms.get(name);
      if (!program) {
        program = parseModuleFile(cached);
        this.#cachePrograms.set(name, program);
      }
      return program;
    }
    return undefined;
  }

  runPageScript(
    program: readonly Statement[],
    request?: LegacyPageRequest
  ): { value: PhpValue; output: string } {
    if (request) this.#installSuperglobals(request);
    const context = createTemplateContext({
      variables: this.#globals,
      globals: this.#globals,
      constants: this.#constants,
      functions: this.hostFunctions(this.#globals, ""),
      callQualified: (name, callArgs) => this.call(name, callArgs, "", ""),
      hasQualified: name => this.has(name, ""),
      referenceParameters: name => this.referenceParameters(name, ""),
      loadTemplate: this.#options.loadTemplate ?? (() => undefined),
      loadPhp: name => this.#loadPhp(name),
      compileOptions: this.#options.compileOptions
    });
    try {
      return executeCompiledFunctionProgram(program, context);
    } catch (signal) {
      // exit() and die() end a page normally in PHP; what they have
      // written is the response, not a fault.
      if (signal instanceof TemplateExit) return { value: null, output: signal.output };
      throw signal;
    }
  }

  /**
   * Puts the request where the original's own code looks for it.
   *
   * The original does not read $_POST at the point of use: the input
   * module's init() walks $_COOKIE, $_POST and $_REQUEST and promotes
   * each name to a global, which is why register.php can write
   * $username. That promotion is the original's code and runs as such;
   * this only has to set the superglobals it reads.
   */
  #installSuperglobals(request: LegacyPageRequest): void {
    const toArray = (entries: Iterable<readonly [string, string]>): PhpArray => {
      const array = new PhpArray();
      for (const [key, value] of entries) array.set(key, value);
      return array;
    };
    const post = toArray(request.post ?? []);
    const get = toArray(request.get ?? []);
    this.#globals.set("_COOKIE", toArray(request.cookies ?? []));
    this.#globals.set("_POST", post);
    this.#globals.set("_GET", get);
    // PHP's default variables_order is GPCS, so POST wins over GET.
    this.#globals.set("_REQUEST", toArray([...(request.get ?? []), ...(request.post ?? [])]));
    const server = new PhpArray();
    server.set("REQUEST_METHOD", request.method ?? "GET");
    server.set("REQUEST_URI", request.uri ?? "/");
    server.set("REMOTE_ADDR", request.remoteAddress ?? "");
    server.set("HTTP_USER_AGENT", request.userAgent ?? "");
    this.#globals.set("_SERVER", server);
  }

  #run(
    fn: CompiledPhpFunction,
    qualified: string,
    args: readonly (PhpValue | PhpRef)[],
    chprocess: string
  ): PhpValue {
    const scope = new ModuleScope();

    /*
     * The superglobals are visible in every scope, as PHP makes them.
     *
     * The input module's init() opens with `if (isset($_POST))` and then
     * promotes each key to a global. Without this the function's own
     * scope had no $_POST at all, that test was false, and nothing was
     * promoted -- so register.php never saw $cmd and rendered its form
     * again instead of registering anyone.
     *
     * They are aliased rather than copied: $_COOKIE and $_POST are
     * reassigned by that same init(), through gstrfilter(), and the
     * filtered version has to be what every later scope reads.
     */
    for (const superglobal of SUPERGLOBALS) {
      scope.alias(superglobal, this.#globals.slotFor(superglobal));
    }

    // $chprocess holds the name of the implementation this one replaced;
    // calling it is a variable-function call in the original.
    scope.set("chprocess", chprocess);

    this.#bindParameters(fn, scope, args);

    const context = createTemplateContext({
      variables: scope,
      globals: this.#globals,
      constants: this.#constants,
      functions: this.hostFunctions(scope, qualified, args),
      callQualified: (name, callArgs) => this.call(name, callArgs, qualified, fn.namespace),
      hasQualified: name => this.has(name, fn.namespace),
      referenceParameters: name => this.referenceParameters(name, fn.namespace),
      staticSlot: name => {
        let own = this.#statics.get(qualified);
        if (!own) {
          own = new Map();
          this.#statics.set(qualified, own);
        }
        return {
          get: () => own.get(name) as PhpValue,
          set: (value: PhpValue) => {
            own.set(name, value);
          }
        };
      },
      loadTemplate: this.#options.loadTemplate ?? (() => undefined),
      loadPhp: name => this.#loadPhp(name),
      compileOptions: this.#options.compileOptions
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
  hostFunctions(
    scope: ModuleScope,
    qualified = "",
    callArgs: readonly (PhpRef | PhpValue)[] = []
  ): Map<string, HostFunction> {
    const functions = new Map<string, HostFunction>(this.#options.functions ?? []);

    // func_get_args() reads the arguments of the call in progress, so it
    // cannot be a plain builtin: it is bound per call, here, where they
    // are known. Several hooks are variadic and use it to pass their
    // arguments on untouched.
    // define() is how every page script announces what it is before
    // common.inc.php reads those constants back. defined() is how the
    // modules test for them.
    // See #commonIncProgram: the observable effects of
    // include/common.inc.php that a Worker can still have.
    // The cache directory, and template reads. Everything else that
    // touches the filesystem is refused in host-environment.ts.
    const isCachePath = (path: string): boolean => path.includes("gamedata/cache/");
    functions.set("file_put_contents", values => {
      const path = toStringValue(values[0] ?? null);
      const data = toStringValue(values[1] ?? null);
      if (!isCachePath(path)) {
        throw new Error(
          `Refusing to write ${path}: a Worker has no filesystem, and only ` +
            `gamedata/cache is held in memory.`
        );
      }
      // FILE_APPEND is 8 in PHP; the captcha cache never uses it, but
      // getting it wrong would silently truncate rather than append.
      const append = toBool(values[2] ?? false) && (Number(values[2]) & 8) !== 0;
      const existing = append ? this.#cacheFiles.get(path) ?? "" : "";
      this.#cacheFiles.set(path, existing + data);
      this.#cachePrograms.delete(path);
      return data.length;
    });
    functions.set("file_get_contents", values => {
      const path = toStringValue(values[0] ?? null);
      if (this.#cacheFiles.has(path)) return this.#cacheFiles.get(path) as string;
      // The templates are real content the Worker has, served through the
      // same loader the include statements use.
      const template = this.#options.loadTemplate?.(path) ??
        this.#options.loadTemplate?.(path.replace(/^.*?(?=\.\/templates\/)/, ""));
      return template ?? false;
    });
    functions.set("file_exists", values => {
      const path = toStringValue(values[0] ?? null);
      if (this.#cacheFiles.has(path)) return true;
      return (this.#options.loadTemplate?.(path) ??
        this.#options.loadTemplate?.(path.replace(/^.*?(?=\.\/templates\/)/, ""))) !== undefined;
    });

    /**
     * render_page($page) without the HTTP round trip.
     *
     * help.php, rank.php, end.php and news.php are each one line:
     * `echo render_page('command_help')`. In the original that POSTs to
     * the site's own command.php over the network and returns the body,
     * because PHP has no other way for one request to run another.
     *
     * A Worker does: command.php is right here. Running it in process
     * gives the same bytes without a self-request, which would in any
     * case be refused -- a Worker calling its own public hostname is a
     * loop the platform does not allow.
     *
     * The forwarded request is built as render_page builds it: the page
     * name, the current $_POST, and the cookies it chooses to pass on.
     */
    functions.set("render_page", values => {
      const page = toStringValue(values[0] ?? null);
      const program = LEGACY_PAGE_SCRIPTS["/command.php"];
      if (!program) throw new Error("command.php is not compiled; render_page cannot forward.");

      const asPairs = (name: string): (readonly [string, string])[] => {
        const value = this.#globals.get(name);
        if (!(value instanceof PhpArray)) return [];
        return value.pairs().map(([key, entry]) => [String(key), toStringValue(entry)] as const);
      };
      const post: (readonly [string, string])[] = [["page", page], ...asPairs("_POST")];
      const extra = values[1];
      if (extra instanceof PhpArray) {
        for (const [key, entry] of extra.pairs()) post.push([String(key), toStringValue(entry)]);
      }

      // A nested run needs its own globals and constants, exactly as the
      // separate PHP process the original forks would have.
      const nested = new LegacyModuleRuntime(this.store, this.#options);
      for (const table of this.#moduleTables) nested.registerModule(table);
      return nested.runPageScript(program, {
        method: "POST",
        uri: "/command.php",
        post,
        cookies: asPairs("_COOKIE")
      }).output;
    });

    functions.set("__dts_common_inc__", () => {
      this.#constants.set("GAMENAME", "bra");
      this.#constants.set("STYLEID", "1");
      this.#constants.set("TEMPLATEID", "1");
      this.#constants.set("TPLDIR", "./templates/default");
      // MOD_<NAME> for every enabled module, which is what the original's
      // loop over gamedata/modules.list.php defines. The registry is
      // generated from that same list.
      for (const module of LEGACY_MODULES) {
        if (module.enabled) this.#constants.set(`MOD_${module.name.toUpperCase()}`, true);
      }
      // The import list the original uses for a non-game page. game.php
      // imports more, and reaches this through CURSCRIPT.
      const curscript = toStringValue(this.#constants.get("CURSCRIPT") ?? null);
      const imported = curscript === "game" && !this.#constants.has("LOAD_CORE_ONLY")
        ? ["input", "sys", "map", "player", "logger", "itemmain"]
        : ["input", "sys", "map"];
      for (const module of imported) this.#importInto(scope, module);
      // The input module's init() is the original's register_globals
      // emulation: it promotes $_COOKIE, $_POST and $_REQUEST to globals.
      // It is the one init that depends on the request, so it is the one
      // that has to run per request rather than being represented by the
      // captured post-load module state.
      if (this.has("input\\init", "")) this.call("input\\init", [], "", "");
      return true;
    });

    functions.set("define", values => {
      const name = toStringValue(values[0] ?? null);
      if (this.#constants.has(name)) return false;
      this.#constants.set(name, values[1] ?? null);
      return true;
    });
    functions.set("defined", values => this.#constants.has(toStringValue(values[0] ?? null)));
    functions.set("constant", values => {
      const name = toStringValue(values[0] ?? null);
      if (!this.#constants.has(name)) {
        throw new Error(`Undefined constant ${name} passed to constant().`);
      }
      return this.#constants.get(name) ?? null;
    });

    functions.set("func_get_args", () => {
      const array = new PhpArray();
      // PHP hands func_get_args() values, not references, even where the
      // parameter was declared by reference.
      for (const value of callArgs) {
        array.push(value instanceof PhpRef ? value.slot.get() : value);
      }
      return array;
    });
    functions.set("func_num_args", () => callArgs.length);

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

    // gencode/gdecode are the original's storage format for the columns
    // that hold structured data -- roomvars, gamevars, noisevars. The
    // implementations are byte-identical to PHP's, which matters because
    // array_update() writes a column only when its value differs from the
    // one it read.
    functions.set("gdecode", values => gdecode(values[0] ?? null));
    functions.set("gencode", values => gencode(values[0] ?? null));

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
