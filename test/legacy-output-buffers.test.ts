import {expect,it} from 'vitest';
import {createLegacyModuleRuntime} from '../src/legacy/php/compiled-modules';
import {parseModuleFile} from '../src/legacy/php/parser';

it('shares PHP response buffers across nested original functions and page includes',()=>{
  const runtime=createLegacyModuleRuntime();
  expect(runtime.runPageScript(parseModuleFile('<?php ob_start(); echo "hello"; ob_end_flush();')).output).toBe('hello');
  runtime.runPageScript(parseModuleFile('<?php ob_start(); echo "before";'));
  expect(runtime.runPageScript(parseModuleFile('<?php echo "after"; ob_end_flush();')).output).toBe('beforeafter');
});
