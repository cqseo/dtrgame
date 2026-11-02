import {describe,expect,it} from 'vitest';
// @ts-expect-error test-only Node builtin
import {readFileSync} from 'node:fs';
import {createLegacyModuleRuntime} from '../src/legacy/php/compiled-modules';
import {parseModuleFile} from '../src/legacy/php/parser';
import {compilePhpModuleFile} from '../src/legacy/module-compiler';

const cases=JSON.parse(readFileSync('scripts/reference/php-mechanisms.json','utf8')) as Array<{name:string;source:string;definitions?:string}>;
const golden=JSON.parse(readFileSync('scripts/reference/php-mechanisms-8.2.35.json','utf8')) as {php:string;results:Array<{name:string;value:unknown;output:string}>};
describe('request mechanisms against unmodified PHP 8.2.35',()=>{
  it.each(cases)('$name',test=>{
    const runtime=createLegacyModuleRuntime();
    if(test.definitions)runtime.registerModule(compilePhpModuleFile(test.definitions));
    const expected=golden.results.find(r=>r.name===test.name)!;
    const actual=runtime.runPageScript(parseModuleFile('<?php '+test.source));
    expect(actual).toEqual({value:expected.value,output:expected.output});
  });
});
