/** AST for the PHP subset the original's compiled templates contain. */

export type Expression =
  | { kind: "literal"; value: string | number | boolean | null }
  | { kind: "interpolate"; parts: readonly Expression[] }
  | { kind: "variable"; name: string }
  | { kind: "variableVariable"; name: Expression }
  | { kind: "constant"; name: string }
  | { kind: "index"; target: Expression; index: Expression | null }
  | { kind: "property"; target: Expression; name: string }
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
  | { kind: "block"; body: readonly Statement[] };
