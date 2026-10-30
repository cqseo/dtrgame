/** AST for the PHP subset the original's compiled templates contain. */

export type Expression =
  | { kind: "literal"; value: string | number | boolean | null }
  | { kind: "interpolate"; parts: readonly Expression[] }
  | { kind: "variable"; name: string }
  | { kind: "variableVariable"; name: Expression }
  | { kind: "constant"; name: string }
  | { kind: "index"; target: Expression; index: Expression | null }
  | { kind: "property"; target: Expression; name: string }
  /**
   * Every `->` in the original's 1,661 module files is on the database
   * object, which it calls eleven methods on; see
   * docs/WHY_COMPILE_THE_MODULES.md.
   */
  | { kind: "methodCall"; target: Expression; name: string; args: readonly Expression[] }
  /**
   * A call on something other than a bare name, which in the module tree is
   * almost always `$chprocess(...)`: the way an override calls the
   * implementation it replaced.
   */
  | { kind: "dynamicCall"; callee: Expression; args: readonly Expression[] }
  /** The right-hand side of `$a = &$b`, which binds rather than copies. */
  | { kind: "reference"; target: Expression }
  | { kind: "call"; callee: string; args: readonly Expression[] }
  | { kind: "unary"; operator: string; operand: Expression }
  | { kind: "binary"; operator: string; left: Expression; right: Expression }
  | { kind: "assign"; operator: string; target: Expression; value: Expression }
  | { kind: "incdec"; operator: "++" | "--"; prefix: boolean; target: Expression }
  | { kind: "ternary"; condition: Expression; then: Expression | null; otherwise: Expression }
  | { kind: "array"; entries: readonly { key: Expression | null; value: Expression }[] }
  | { kind: "isset"; targets: readonly Expression[] }
  | { kind: "empty"; target: Expression }
  | { kind: "list"; targets: readonly (Expression | null)[] };

export type Statement =
  | { kind: "inlineHtml"; text: string }
  | { kind: "echo"; values: readonly Expression[] }
  | { kind: "expression"; expression: Expression }
  | {
      kind: "if";
      branches: readonly { condition: Expression; body: readonly Statement[] }[];
      otherwise: readonly Statement[];
    }
  | {
      kind: "foreach";
      subject: Expression;
      keyVariable: Expression | null;
      valueVariable: Expression;
      byReference: boolean;
      body: readonly Statement[];
    }
  | { kind: "include"; template: Expression }
  | { kind: "exit"; value: Expression | null }
  | { kind: "return"; value: Expression | null }
  | { kind: "break"; levels: number }
  | { kind: "continue"; levels: number }
  | { kind: "unset"; targets: readonly Expression[] }
  | { kind: "block"; body: readonly Statement[] }
  // Module-level constructs. Compiled templates contain none of these; the
  // original's module files are made almost entirely of them.
  | { kind: "namespace"; name: string; body: readonly Statement[] | null }
  | {
      kind: "functionDeclaration";
      name: string;
      parameters: readonly Parameter[];
      body: readonly Statement[];
    }
  /** A real `global $x;`, which templates discard but modules depend on. */
  | { kind: "global"; names: readonly Expression[] }
  | {
      kind: "for";
      initializers: readonly Expression[];
      conditions: readonly Expression[];
      updates: readonly Expression[];
      body: readonly Statement[];
    }
  | { kind: "while"; condition: Expression; body: readonly Statement[] }
  | { kind: "doWhile"; condition: Expression; body: readonly Statement[] }
  | {
      kind: "switch";
      subject: Expression;
      cases: readonly { test: Expression | null; body: readonly Statement[] }[];
    }
  | { kind: "throw"; value: Expression };

export interface Parameter {
  readonly name: string;
  /** 3,509 of the original's parameters are by-reference. */
  readonly byReference: boolean;
  readonly variadic: boolean;
  readonly defaultValue: Expression | null;
}
