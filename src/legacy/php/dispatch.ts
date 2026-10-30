/**
 * The original's hook dispatch, ported from modules.func.php.
 *
 * Every hooked function starts with `if (eval(__MAGIC__)) return
 * $___RET_VALUE;`. That prologue does two things, and getting either wrong
 * changes which implementation runs:
 *
 *   hook_register($module, $func) pushes $module onto
 *   $module_hook_list[$func], and records both directions:
 *     PFUNC[previous\func] = module\func   (who overrides me)
 *     CFUNC[module\func]   = previous\func (who I override)
 *
 *   The prologue then checks PFUNC for the function it is running in. If
 *   something overrides this implementation, and the caller is not that
 *   overrider, the call is redirected to end($module_hook_list[$func]) —
 *   the newest implementation — and its result returned. Otherwise
 *   $chprocess is set to CFUNC, the implementation this one replaced, or to
 *   '__MODULE_NULLFUNCTION__' when there is none.
 *
 * The effect is that calling any implementation by name enters the chain at
 * the newest, while `$chprocess(...)` walks one step older. The caller test
 * is what stops that from looping.
 *
 * Registration order is module load order, so the chain is built in the
 * order the original loads modules and the last one registered wins.
 */

export const NULL_FUNCTION = "__MODULE_NULLFUNCTION__";

/** Splits `map\get_all_plsno` into its module and bare function name. */
export function splitQualified(qualified: string): { module: string; name: string } {
  const trimmed = qualified.replace(/^\\+/, "");
  const cut = trimmed.indexOf("\\");
  if (cut === -1) return { module: "", name: trimmed.toLowerCase() };
  return { module: trimmed.slice(0, cut).toLowerCase(), name: trimmed.slice(cut + 1).toLowerCase() };
}

export const qualify = (module: string, name: string): string =>
  `${module.toLowerCase()}\\${name.toLowerCase()}`;

/**
 * The chains, one per bare function name, in registration order.
 *
 * Nothing here knows how to run a function; it only answers which
 * implementation a call should enter, which keeps the rule testable on its
 * own against the original.
 */
export class HookChains {
  /** Bare function name to its implementations, oldest first. */
  readonly #chains = new Map<string, string[]>();

  /** Mirrors hook_register(): appends and links to the previous. */
  register(module: string, name: string): void {
    const bare = name.toLowerCase();
    const chain = this.#chains.get(bare) ?? [];
    const qualified = qualify(module, bare);
    if (chain.includes(qualified)) {
      throw new Error(`${qualified} is already registered for ${bare}.`);
    }
    chain.push(qualified);
    this.#chains.set(bare, chain);
  }

  /** The implementations of a bare name, oldest first. */
  chain(name: string): readonly string[] {
    return this.#chains.get(name.toLowerCase()) ?? [];
  }

  /** end($module_hook_list[$func]): the implementation a bare call enters. */
  newest(name: string): string | undefined {
    const chain = this.chain(name);
    return chain[chain.length - 1];
  }

  /** PFUNC: the implementation that overrides `qualified`, if any. */
  overriddenBy(qualified: string): string | undefined {
    const { name } = splitQualified(qualified);
    const chain = this.chain(name);
    const at = chain.indexOf(qualified.replace(/^\\+/, "").toLowerCase());
    if (at === -1) return undefined;
    return chain[at + 1];
  }

  /** CFUNC: the implementation `qualified` overrides, for $chprocess. */
  parentOf(qualified: string): string {
    const { name } = splitQualified(qualified);
    const chain = this.chain(name);
    const at = chain.indexOf(qualified.replace(/^\\+/, "").toLowerCase());
    if (at <= 0) return NULL_FUNCTION;
    return chain[at - 1] as string;
  }

  names(): readonly string[] {
    return [...this.#chains.keys()];
  }
}

/** What the __MAGIC__ prologue decided for one call. */
export type Dispatch =
  /** Run this implementation's own body, with $chprocess bound to `parent`. */
  | { readonly kind: "run"; readonly chprocess: string }
  /** Hand the call to `target` and return what it returns. */
  | { readonly kind: "redirect"; readonly target: string };

/**
 * Resolves the prologue for `qualified`, called from `caller`.
 *
 * `caller` is the fully qualified name of the function making the call, or
 * undefined at the top level, which is what debug_backtrace() reports.
 */
export function resolveDispatch(
  chains: HookChains,
  qualified: string,
  caller: string | undefined
): Dispatch {
  const self = qualified.replace(/^\\+/, "").toLowerCase();
  const child = chains.overriddenBy(self);

  // "Something overrides me, and I was not called by it" — so the call
  // belongs at the newest implementation instead of here.
  if (child !== undefined && caller?.toLowerCase() !== child) {
    const newest = chains.newest(splitQualified(self).name);
    // Only redirect somewhere else; a chain of one cannot redirect to itself.
    if (newest !== undefined && newest !== self) return { kind: "redirect", target: newest };
  }

  return { kind: "run", chprocess: chains.parentOf(self) };
}
