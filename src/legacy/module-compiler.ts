/**
 * Turns the original's module source into the ASTs the runtime executes.
 *
 * Functions are located by parsing the file, not by searching it. A regular
 * expression cannot read a parameter list containing a parenthesis — the
 * original writes `= array()` and `= foo()` — and cannot tell a declaration
 * from the same text inside a string or a comment. ModuleParser reads all
 * 1,661 module files and finds exactly the 6,081 declarations PHP's own
 * tokenizer counts; see docs/WHY_COMPILE_THE_MODULES.md.
 *
 * Parsing happens at build time. The ASTs are checked in, so the Worker
 * never performs runtime code generation.
 */
import type { Expression, Statement } from "./template/ast";
import { collectDeclaredFunctions } from "./php/parser";

export interface CompiledPhpParameter {
  readonly name: string;
  readonly byReference: boolean;
  readonly variadic: boolean;
  /**
   * The default as an expression rather than a literal, because the
   * original's defaults include `array()` and named constants, which have
   * no literal form.
   */
  readonly defaultValue: Expression | null;
}

export interface CompiledPhpFunction {
  readonly namespace: string;
  readonly name: string;
  readonly parameters: readonly CompiledPhpParameter[];
  readonly program: readonly Statement[];
}

/** Compiles every function a module file declares, in source order. */
export function compilePhpModuleFile(source: string): CompiledPhpFunction[] {
  return collectDeclaredFunctions(source).map(declared => ({
    namespace: declared.namespace,
    name: declared.name,
    parameters: declared.parameters.map(parameter => ({
      name: parameter.name,
      byReference: parameter.byReference,
      variadic: parameter.variadic,
      defaultValue: parameter.defaultValue
    })),
    program: declared.body
  }));
}

/**
 * Compiles one named function out of a module file.
 *
 * The namespace is checked rather than assumed: a file can declare more than
 * one namespace, and silently compiling the wrong module's function would be
 * a behaviour change no test would catch.
 */
export function compilePhpModuleFunction(
  source: string,
  namespace: string,
  functionName: string
): CompiledPhpFunction {
  const declared = compilePhpModuleFile(source).filter(
    candidate => candidate.name === functionName
  );
  if (declared.length === 0) {
    throw new SyntaxError(`Function ${namespace}\\${functionName} was not found.`);
  }
  const matching = declared.find(candidate => candidate.namespace === namespace);
  if (!matching) {
    throw new SyntaxError(
      `Function ${functionName} exists but in namespace ` +
        `${declared.map(candidate => candidate.namespace).join(", ")}, not ${namespace}.`
    );
  }
  return matching;
}
