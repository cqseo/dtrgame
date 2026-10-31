/**
 * The original's module variable storage, with the reference semantics it
 * actually has.
 *
 * `eval(import_module('map'))` expands to, verbatim:
 *
 *     global $___LOCAL_MAP__VARS__plsinfo;
 *     $plsinfo = &$___LOCAL_MAP__VARS__plsinfo;
 *
 * so an imported name is an alias, not a copy, and a module function that
 * writes `$plsinfo` changes the module's variable for everything that runs
 * afterwards. `get_var_in_module()` likewise returns `& $GLOBALS[...]`.
 * Copying values instead would make every such write vanish, which is the
 * kind of silent difference this port exists to avoid.
 *
 * So a variable is a slot, and a function scope can alias one of its names
 * to a slot owned by somewhere else.
 */
import { LEGACY_MODULE_VARS } from "../../generated/legacy-module-vars";
import { PhpArray, type PhpValue } from "../template/values";

/** A readable, writable location: a module variable, or a caller's local. */
export interface Slot {
  get(): PhpValue;
  set(value: PhpValue): void;
}

/**
 * Marks a value as "bind to this slot" rather than "copy this value".
 *
 * `$a = &$b` and `$ret = & get_var_in_module(...)` both produce one of
 * these, and assignment binds instead of copying when it sees one.
 */
export class PhpRef {
  constructor(readonly slot: Slot) {}
}

/**
 * A PHP exception, which is the only object the original constructs.
 *
 * It carries the class name so `catch (Exception $e)` can match what was
 * thrown, and the message so `$e->getMessage()` can return it. It is not
 * an Error subclass: it travels as a PHP value, and PhpThrow carries it.
 */
export class PhpException {
  constructor(
    readonly className: string,
    readonly message: string
  ) {}
}

/** Carries a PhpException through the interpreter's own control flow. */
export class PhpThrow extends Error {
  constructor(readonly exception: PhpException) {
    super(exception.message);
    this.name = "PhpThrow";
  }
}

/**
 * The live `___LOCAL_<MODULE>__VARS__<name>` globals.
 *
 * Seeded from the generated table, which is itself read out of a full module
 * load of the original, then mutated as the game runs.
 */
export class ModuleVariableStore {
  readonly #modules = new Map<string, Map<string, PhpValue>>();

  /**
   * Starts from the original's post-load values. They are copied, deeply for
   * arrays, so one request's writes cannot leak into the next.
   */
  static fromOriginal(): ModuleVariableStore {
    const store = new ModuleVariableStore();
    for (const [module, variables] of Object.entries(LEGACY_MODULE_VARS)) {
      const scope = new Map<string, PhpValue>();
      for (const [name, value] of Object.entries(variables)) {
        scope.set(name, value instanceof PhpArray ? value.clone() : value);
      }
      store.#modules.set(module.toLowerCase(), scope);
    }
    return store;
  }

  /** Whether the module exists, which is what `defined('MOD_X')` reports. */
  has(module: string): boolean {
    return this.#modules.has(module.toLowerCase());
  }

  names(module: string): readonly string[] {
    return [...(this.#modules.get(module.toLowerCase())?.keys() ?? [])];
  }

  get(module: string, name: string): PhpValue {
    return this.#modules.get(module.toLowerCase())?.get(name) ?? null;
  }

  set(module: string, name: string, value: PhpValue): void {
    const key = module.toLowerCase();
    let scope = this.#modules.get(key);
    if (!scope) {
      scope = new Map();
      this.#modules.set(key, scope);
    }
    scope.set(name, value);
  }

  /**
   * A slot for one module variable.
   *
   * Reading an undefined module variable gives null, as PHP gives null for
   * an undefined global, and writing creates it.
   */
  slot(module: string, name: string): Slot {
    return {
      get: () => this.get(module, name),
      set: value => this.set(module, name, value)
    };
  }
}

/**
 * A function's variable scope, in which some names are aliases.
 *
 * It is a Map so the renderer can use it unchanged; the overrides route
 * aliased names to their slot instead of to local storage.
 */
export class ModuleScope extends Map<string, PhpValue> {
  readonly #aliases = new Map<string, Slot>();

  /** Binds `name` to `slot`, as `$name = &$target` does. */
  alias(name: string, slot: Slot): void {
    this.#aliases.set(name, slot);
    // A local of the same name is gone: the name now means the slot.
    super.delete(name);
  }

  /** A slot for one of this scope's own names, for passing by reference. */
  slotFor(name: string): Slot {
    const existing = this.#aliases.get(name);
    if (existing) return existing;
    return {
      get: () => super.get(name) ?? null,
      set: value => {
        super.set(name, value);
      }
    };
  }

  override get(name: string): PhpValue | undefined {
    const alias = this.#aliases.get(name);
    return alias ? alias.get() : super.get(name);
  }

  override set(name: string, value: PhpValue): this {
    const alias = this.#aliases.get(name);
    if (alias) alias.set(value);
    else super.set(name, value);
    return this;
  }

  override has(name: string): boolean {
    return this.#aliases.has(name) || super.has(name);
  }

  override delete(name: string): boolean {
    // `unset($x)` breaks the alias without disturbing what it pointed at,
    // which is what PHP does to a reference.
    const wasAliased = this.#aliases.delete(name);
    return super.delete(name) || wasAliased;
  }

  override get size(): number {
    return super.size + this.#aliases.size;
  }

  // Map's iteration methods return an iterator, not an iterable. Handing
  // back the array itself satisfies TypeScript through the cast and then
  // fails at run time: `for (const x of scope)` calls [Symbol.iterator]()
  // and needs a .next() on what comes back, which an array has not. That
  // broke every read of $GLOBALS.
  override keys(): MapIterator<string> {
    return this.#entries()
      .map(([key]) => key)
      [Symbol.iterator]() as unknown as MapIterator<string>;
  }

  override values(): MapIterator<PhpValue> {
    return this.#entries()
      .map(([, value]) => value)
      [Symbol.iterator]() as unknown as MapIterator<PhpValue>;
  }

  override entries(): MapIterator<[string, PhpValue]> {
    return this.#entries()[Symbol.iterator]() as unknown as MapIterator<[string, PhpValue]>;
  }

  override [Symbol.iterator](): MapIterator<[string, PhpValue]> {
    return this.entries();
  }

  override forEach(
    callback: (value: PhpValue, key: string, map: Map<string, PhpValue>) => void,
    thisArg?: unknown
  ): void {
    for (const [key, value] of this.#entries()) callback.call(thisArg, value, key, this);
  }

  /** Locals first, then aliases, which is the order they were introduced. */
  #entries(): [string, PhpValue][] {
    const all: [string, PhpValue][] = [];
    for (const [key, value] of super.entries()) all.push([key, value]);
    for (const [key, slot] of this.#aliases) all.push([key, slot.get()]);
    return all;
  }
}
