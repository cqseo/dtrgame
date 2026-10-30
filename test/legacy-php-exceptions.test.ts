import { describe, expect, it } from "vitest";
import { ModuleParser } from "../src/legacy/php/parser";
import { ModuleScope, PhpException } from "../src/legacy/php/module-store";
import { createTemplateContext, executeCompiledFunctionProgram } from "../src/legacy/template/render";

/**
 * Covers try/catch/finally and `new Exception`.
 *
 * The module tree has no try blocks, but command.php wraps the whole
 * request in one and prints the message, so the game loop cannot run
 * without these. They are checked here rather than against the PHP oracle
 * because what matters is the control flow, which is the same in both and
 * does not depend on any of the original's data.
 */
function run(source: string): { value: unknown; output: string } {
  const program = new ModuleParser(`<?php ${source}`).parseProgram();
  return executeCompiledFunctionProgram(
    program,
    createTemplateContext({
      variables: new ModuleScope(),
      globals: new ModuleScope(),
      loadTemplate: () => undefined
    })
  );
}

describe("PHP exceptions", () => {
  it("catches what it threw and binds the catch variable", () => {
    const result = run(`
      try {
        throw new Exception('boom');
      } catch (Exception $e) {
        echo $e->getMessage();
      }
    `);
    expect(result.output).toBe("boom");
  });

  it("runs finally whether or not anything was thrown", () => {
    expect(run("try { echo 'a'; } finally { echo 'b'; }").output).toBe("ab");
    expect(
      run("try { throw new Exception('x'); } catch (Exception $e) { echo 'c'; } finally { echo 'd'; }")
        .output
    ).toBe("cd");
  });

  it("runs finally even when the body returns, and keeps the return value", () => {
    // command.php returns out of its try, so a finally that was skipped
    // would lose the cleanup that follows.
    const result = run("try { echo 'a'; return 7; } finally { echo 'b'; }");
    expect(result.output).toBe("ab");
    expect(result.value).toBe(7);
  });

  it("skips a catch whose type does not match and lets the throw escape", () => {
    expect(() => run("try { throw new Exception('x'); } catch (DomainException $e) { echo 'no'; }"))
      .toThrowError("x");
  });

  it("catches a bare Throwable, and a union of types", () => {
    expect(run("try { throw new Exception('t'); } catch (Throwable $e) { echo 'caught'; }").output)
      .toBe("caught");
    expect(
      run("try { throw new Exception('u'); } catch (DomainException|Exception $e) { echo 'both'; }")
        .output
    ).toBe("both");
  });

  it("refuses to construct anything that is not an exception", () => {
    // The original builds no other objects, so an attempt to is a gap in
    // the port rather than something to approximate with an empty value.
    expect(() => run("$x = new SomeModel();")).toThrowError(/only exceptions are supported/);
  });

  it("carries the class name and message as a value", () => {
    const result = run("$e = new RuntimeException('deep'); echo $e->getMessage();");
    expect(result.output).toBe("deep");
    expect(new PhpException("RuntimeException", "deep").className).toBe("RuntimeException");
  });
});
