import {expect,it} from 'vitest';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
// @ts-expect-error test-only Node builtin
import {createHash} from 'node:crypto';
import {COMPILED_MODULE_NAMES,COMPILED_MODULE_TABLES} from '../src/generated/legacy-compiled-index';
import {LEGACY_COMPILED_GLOBALS} from '../src/generated/legacy-compiled-globals';

it('decodes every original function to the exact AST captured before the representation change',()=>{
  const baseline=JSON.parse(readFileSync('docs/original-function-ast-digests.json','utf8')) as {baseline:string;tables:Array<{file:string;functions:number;sha256:string}>};
  expect(baseline.baseline).toBe('cf0f27185fdad0ce58b6d6a7509f64403e715913');
  const tables=new Map(COMPILED_MODULE_NAMES.map((name,i)=>['legacy-compiled-'+name+'.ts',COMPILED_MODULE_TABLES[i]!]));
  tables.set('legacy-compiled-globals.ts',LEGACY_COMPILED_GLOBALS);
  expect(tables.size).toBe(736);
  expect([...tables.keys()].sort()).toEqual(baseline.tables.map(table=>table.file));
  // Keep an active syntax tree while enough other bodies load to exercise
  // eviction. An executing function must remain valid even if it is evicted.
  const first=Object.values(COMPILED_MODULE_TABLES[0]!)[0]!,active=first.program;
  for(const expected of baseline.tables){
    const table=tables.get(expected.file)!;
    expect(Object.keys(table).length,expected.file).toBe(expected.functions);
    expect(createHash('sha256').update(JSON.stringify(table)).digest('hex'),expected.file).toBe(expected.sha256);
  }
  expect(first.program).toEqual(active);
},120_000);
