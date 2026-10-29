import { LEGACY_MODULES, type LegacyModuleName } from "../generated/legacy-registry";

export type LegacyHookHandler<TContext, TResult> = (context: TContext, next: () => TResult) => TResult;

interface RegisteredLegacyHook<TContext, TResult> {
  module: LegacyModuleName;
  order: number;
  handler: LegacyHookHandler<TContext, TResult>;
}

const moduleOrder = new Map<string, number>(LEGACY_MODULES.map(({ name, order }) => [name, order]));

/**
 * TypeScript equivalent of modules.func.php hook_register()/chprocess.
 * PHP dispatches into the last registered implementation first; chprocess calls
 * the previous implementation, so handlers execute in descending module order.
 */
export class LegacyHookPipeline<TContext, TResult> {
  readonly #hooks: RegisteredLegacyHook<TContext, TResult>[] = [];

  register(module: LegacyModuleName, handler: LegacyHookHandler<TContext, TResult>): this {
    const order = moduleOrder.get(module);
    if (order === undefined) throw new Error(`Unknown legacy module: ${module}`);
    if (this.#hooks.some((hook) => hook.module === module)) throw new Error(`Legacy module ${module} already registered this hook.`);
    this.#hooks.push({ module, order, handler });
    this.#hooks.sort((left, right) => right.order - left.order);
    return this;
  }

  modules(): readonly LegacyModuleName[] {
    return this.#hooks.map(({ module }) => module);
  }

  run(context: TContext, base: (context: TContext) => TResult): TResult {
    const dispatch = (index: number): TResult => {
      const hook = this.#hooks[index];
      if (!hook) return base(context);
      // The PHP loader permits more than one $chprocess() call in one module.
      // Each call restarts the immediate parent chain with the same context.
      return hook.handler(context, () => dispatch(index + 1));
    };
    return dispatch(0);
  }
}

export type LegacyHookArguments = readonly unknown[];

/** Mutable box for PHP parameters declared with &. */
export interface LegacyReference<T> { value: T; }
export function legacyRef<T>(value: T): LegacyReference<T> { return { value }; }
export function isLegacyRef<T = unknown>(value: unknown): value is LegacyReference<T> {
  return typeof value === "object" && value !== null && Object.hasOwn(value, "value");
}

export interface LegacyHookCallContext<TState extends object> {
  readonly functionName: string;
  readonly module: LegacyModuleName;
  readonly session: LegacyExecutionSession<TState>;
  /** PHP $chprocess(...): invoke the immediate previous implementation. */
  next<TResult = unknown>(...args: LegacyHookArguments): TResult;
  /** Call another hook through its newest registered implementation. */
  call<TResult = unknown>(functionName: string, ...args: LegacyHookArguments): TResult;
}

export type LegacyCompatibleHook<TState extends object> = (
  context: LegacyHookCallContext<TState>,
  ...args: LegacyHookArguments
) => unknown;

export interface LegacyModuleAdapter<TState extends object> {
  readonly name: LegacyModuleName;
  readonly hooks?: Readonly<Record<string, LegacyCompatibleHook<TState>>>;
  init?(kernel: LegacyCompatibilityKernel<TState>): void;
}

export type LegacyTraceEvent =
  | { type: "enter"; functionName: string; module: LegacyModuleName; depth: number; args: LegacyHookArguments }
  | { type: "next"; functionName: string; module: LegacyModuleName; depth: number; args: LegacyHookArguments }
  | { type: "return"; functionName: string; module: LegacyModuleName; depth: number; value: unknown }
  | { type: "throw"; functionName: string; module: LegacyModuleName; depth: number; error: unknown }
  | { type: "commit" | "rollback"; depth: number };

export interface LegacyCheckpointableRandom {
  snapshot(): unknown;
  restore(snapshot: unknown): void;
}

function isCheckpointableRandom(value: unknown): value is LegacyCheckpointableRandom {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<LegacyCheckpointableRandom>;
  return typeof candidate.snapshot === "function" && typeof candidate.restore === "function";
}

function restoreObject(target: object, snapshot: object): void {
  for (const key of Reflect.ownKeys(target)) Reflect.deleteProperty(target, key);
  Object.defineProperties(target, Object.getOwnPropertyDescriptors(snapshot));
}

function traceClone<T>(value: T): T {
  try { return structuredClone(value); }
  catch { return value; }
}

/** Transaction snapshot clone that preserves request-local callbacks by identity. */
function checkpointClone<T>(value: T, seen = new Map<object, unknown>()): T {
  if (typeof value !== "object" || value === null) return value;
  const cached = seen.get(value);
  if (cached !== undefined) return cached as T;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);
    for (const [key, entry] of value) result.set(checkpointClone(key, seen), checkpointClone(entry, seen));
    return result as T;
  }
  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);
    for (const entry of value) result.add(checkpointClone(entry, seen));
    return result as T;
  }
  if (ArrayBuffer.isView(value)) return structuredClone(value);
  if (value instanceof ArrayBuffer) return value.slice(0) as T;
  const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if ("value" in descriptor) descriptor.value = checkpointClone(descriptor.value, seen);
    Object.defineProperty(result, key, descriptor);
  }
  return result as T;
}

/** Request/room-local state shared by every translated legacy module. */
export class LegacyExecutionSession<TState extends object> {
  readonly globals: Record<string, unknown>;
  readonly output: string[] = [];
  readonly trace: LegacyTraceEvent[] = [];
  #depth = 0;

  constructor(
    readonly state: TState,
    options: {
      globals?: Record<string, unknown>;
      now?: () => number;
      random?: unknown;
      trace?: boolean;
    } = {}
  ) {
    this.globals = options.globals ?? {};
    this.now = options.now ?? Date.now;
    this.random = options.random;
    this.tracing = options.trace ?? false;
  }

  readonly now: () => number;
  readonly random: unknown;
  readonly tracing: boolean;

  get depth(): number { return this.#depth; }
  enter(): number { return this.#depth++; }
  leave(): void { this.#depth -= 1; }
  append(html: string): void { this.output.push(html); }

  /**
   * Atomic mutation boundary used around one original command.
   * Player/room globals and generated HTML are restored on failure.
   */
  transaction<TResult>(operation: () => TResult): TResult {
    const stateSnapshot = checkpointClone(this.state);
    const globalsSnapshot = checkpointClone(this.globals);
    const outputLength = this.output.length;
    const randomSnapshot = isCheckpointableRandom(this.random) ? this.random.snapshot() : undefined;
    try {
      const result = operation();
      if (result instanceof Promise) throw new TypeError("Legacy state transactions must be synchronous; persist after commit.");
      if (this.tracing) this.trace.push({ type: "commit", depth: this.depth });
      return result;
    } catch (error) {
      restoreObject(this.state, stateSnapshot);
      restoreObject(this.globals, globalsSnapshot);
      this.output.length = outputLength;
      if (randomSnapshot !== undefined && isCheckpointableRandom(this.random)) this.random.restore(randomSnapshot);
      if (this.tracing) this.trace.push({ type: "rollback", depth: this.depth });
      throw error;
    }
  }
}

interface RegisteredCompatibleHook<TState extends object> {
  readonly module: LegacyModuleName;
  readonly order: number;
  readonly handler: LegacyCompatibleHook<TState>;
}

/**
 * Compatibility implementation of hook_register(), newest-function dispatch,
 * and PHP $chprocess parent calls. Registrations are always ordered from the
 * captured modules.list.php, independent of TypeScript import order.
 */
export class LegacyCompatibilityKernel<TState extends object> {
  readonly #functions = new Map<string, RegisteredCompatibleHook<TState>[]>();
  readonly #loadedModules = new Set<LegacyModuleName>();

  register(functionName: string, module: LegacyModuleName, handler: LegacyCompatibleHook<TState>): this {
    const normalized = functionName.toLowerCase();
    if (!normalized) throw new TypeError("Legacy hook function name cannot be empty.");
    const moduleInfo = LEGACY_MODULES.find((entry) => entry.name === module);
    if (!moduleInfo) throw new Error(`Unknown legacy module: ${module}`);
    if (!moduleInfo.enabled) throw new Error(`Disabled legacy module cannot register hooks: ${module}`);
    const hooks = this.#functions.get(normalized) ?? [];
    if (hooks.some((hook) => hook.module === module)) throw new Error(`Legacy module ${module} already registered ${normalized}.`);
    hooks.push({ module, order: moduleInfo.order, handler });
    hooks.sort((left, right) => left.order - right.order);
    this.#functions.set(normalized, hooks);
    return this;
  }

  loadModules(adapters: readonly LegacyModuleAdapter<TState>[]): this {
    for (const adapter of adapters) {
      if (!moduleOrder.has(adapter.name)) throw new Error(`Unknown legacy module: ${adapter.name}`);
      if (!LEGACY_MODULES.find((entry) => entry.name === adapter.name)?.enabled) throw new Error(`Disabled legacy module cannot be loaded: ${adapter.name}`);
    }
    const ordered = [...adapters].sort((left, right) => moduleOrder.get(left.name)! - moduleOrder.get(right.name)!);
    for (const adapter of ordered) {
      if (this.#loadedModules.has(adapter.name)) throw new Error(`Legacy module ${adapter.name} was loaded more than once.`);
      this.#loadedModules.add(adapter.name);
      adapter.init?.(this);
      for (const [functionName, handler] of Object.entries(adapter.hooks ?? {})) this.register(functionName, adapter.name, handler);
    }
    return this;
  }

  loadedModules(): readonly LegacyModuleName[] {
    return [...this.#loadedModules].sort((left, right) => moduleOrder.get(left)! - moduleOrder.get(right)!);
  }

  implementations(functionName: string): readonly LegacyModuleName[] {
    return (this.#functions.get(functionName.toLowerCase()) ?? []).map(({ module }) => module);
  }

  registrations(): readonly { functionName: string; module: LegacyModuleName }[] {
    const result: { functionName: string; module: LegacyModuleName }[] = [];
    for (const [functionName, hooks] of this.#functions) {
      for (const { module } of hooks) result.push({ functionName, module });
    }
    return result;
  }

  has(functionName: string): boolean {
    return (this.#functions.get(functionName.toLowerCase())?.length ?? 0) > 0;
  }

  call<TResult = unknown>(session: LegacyExecutionSession<TState>, functionName: string, ...args: LegacyHookArguments): TResult {
    const normalized = functionName.toLowerCase();
    const hooks = this.#functions.get(normalized);
    if (!hooks?.length) throw new Error(`No legacy implementation registered for ${normalized}.`);
    const dispatch = (index: number, callArgs: LegacyHookArguments): unknown => {
      const hook = hooks[index];
      if (!hook) throw new Error(`Legacy function ${normalized} has no parent implementation.`);
      const depth = session.enter();
      if (session.tracing) session.trace.push({ type: "enter", functionName: normalized, module: hook.module, depth, args: traceClone(callArgs) });
      const context: LegacyHookCallContext<TState> = {
        functionName: normalized,
        module: hook.module,
        session,
        next: <TNext = unknown>(...nextArgs: LegacyHookArguments): TNext => {
          if (session.tracing) session.trace.push({ type: "next", functionName: normalized, module: hook.module, depth, args: traceClone(nextArgs) });
          return dispatch(index - 1, nextArgs) as TNext;
        },
        call: <TCall = unknown>(nestedName: string, ...nestedArgs: LegacyHookArguments): TCall => this.call<TCall>(session, nestedName, ...nestedArgs)
      };
      try {
        const value = hook.handler(context, ...callArgs);
        if (session.tracing) session.trace.push({ type: "return", functionName: normalized, module: hook.module, depth, value: traceClone(value) });
        return value;
      } catch (error) {
        if (session.tracing) session.trace.push({ type: "throw", functionName: normalized, module: hook.module, depth, error });
        throw error;
      } finally {
        session.leave();
      }
    };
    return dispatch(hooks.length - 1, args) as TResult;
  }

  command<TResult = unknown>(session: LegacyExecutionSession<TState>, functionName: string, ...args: LegacyHookArguments): TResult {
    return session.transaction(() => this.call<TResult>(session, functionName, ...args));
  }
}
