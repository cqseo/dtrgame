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
      let called = false;
      return hook.handler(context, () => {
        if (called) throw new Error(`Legacy module ${hook.module} called chprocess more than once.`);
        called = true;
        return dispatch(index + 1);
      });
    };
    return dispatch(0);
  }
}
