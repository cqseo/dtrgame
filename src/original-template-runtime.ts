/** PHP 7 scalar semantics used by the compiled account templates. */
export type TemplateContext = Record<string, unknown>;
export type TemplateConstants = Readonly<Record<string, string | number | boolean>>;
export type TemplateReadAsset = (path: string) => string;
export function phpTruthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length !== 0;
  if (value !== null && typeof value === 'object') return Object.keys(value).length !== 0;
  return value !== undefined && value !== null && value !== false && value !== 0 && value !== '' && value !== '0';
}
export function phpString(value: unknown): string {
  if (value === undefined || value === null || value === false) return '';
  if (value === true) return '1';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  throw new TypeError('Non-scalar template output requires a source port');
}
export function phpOffset(value: unknown, offset: unknown): unknown {
  if (value === null || typeof value !== 'object') return undefined;
  const key = phpString(offset);
  return Object.hasOwn(value, key) ? (value as TemplateContext)[key] : undefined;
}
export function phpNumber(value: unknown): number {
  const match = phpString(value).match(/^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)/i);
  return match ? Number(match[1]) : 0;
}
export function phpBinary(op: string, left: unknown, right: unknown): unknown {
  if (op === '.') return phpString(left) + phpString(right);
  if (op === '!==') return left !== right && !(left == null && right == null);
  if (op === '===') return left === right || (left == null && right == null);
  if (op === '!=') return !phpBinary('==', left, right);
  if (op === '==') {
    if (typeof left === 'boolean' || typeof right === 'boolean') return phpTruthy(left) === phpTruthy(right);
    if (left == null || right == null) return phpString(left) === phpString(right);
    if (typeof left === 'number' || typeof right === 'number') return phpNumber(left) === phpNumber(right);
    const numeric = /^[\s]*[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
    if (typeof left === 'string' && typeof right === 'string' && numeric.test(left) && numeric.test(right)) return Number(left) === Number(right);
    return left === right;
  }
  if (op === '>=') return phpNumber(left) >= phpNumber(right);
  if (op === '<=') return phpNumber(left) <= phpNumber(right);
  if (op === '>') return phpNumber(left) > phpNumber(right);
  if (op === '<') return phpNumber(left) < phpNumber(right);
  if (op === '+') return phpNumber(left) + phpNumber(right);
  if (op === '-') return phpNumber(left) - phpNumber(right);
  if (op === '*') return phpNumber(left) * phpNumber(right);
  if (op === '/') return phpNumber(left) / phpNumber(right);
  if (op === '%') return Math.trunc(phpNumber(left)) % Math.trunc(phpNumber(right));
  throw new Error('Unported template operator: ' + op);
}
