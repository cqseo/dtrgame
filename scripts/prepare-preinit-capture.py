#!/usr/bin/env python3
"""Prepare an instrumented PRIVATE copy of an isolated original checkout.

This never changes the source tree or runs PHP automatically. Use a disposable
DB/read-only fixture connection in the copy before invoking the printed command.
Do not point a capture at a production web root. The committed capture was made
with PHP 8.2.35 from /opt/dts-sandbox/parity/legacy-dts on 2026-11-02.
"""
import argparse
import json
import re
import shutil
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('destination', type=Path)
args = parser.parse_args()
source, destination = args.source.resolve(), args.destination.resolve()
if not source.is_dir() or destination.exists() or source == destination or source in destination.parents:
    parser.error('Source must exist; destination must be a new directory outside it.')
if str(source).startswith('/www/') or str(destination).startswith('/www/'):
    parser.error('Use an isolated checkout, never a production web root.')
shutil.copytree(source, destination)
destination.chmod(0o700)
template = destination / 'include/modules/modules.init.template.php'
text = template.read_text()
needle = 'if (!$___TEMP_DRY_RUN) init();'
if text.count(needle) != 1:
    raise RuntimeError('Original initialization marker changed.')
template.write_text(text.replace(needle, r'\dtr_capture_preinit(__NAMESPACE__,get_defined_vars(),$___TEMP_a);' + '\n\t' + needle))
config = destination / 'include/modulemng/modulemng.config.php'
if config.exists():
    config.chmod(0o600)
    config.write_text(re.sub(r'(\$___MOD_CODE_ADV[12]\s*=\s*)[01](\s*;)', r'\g<1>0\2', config.read_text()))
# Reuse the exact credential filter and lossless typed-value encoder used by
# the post-init capture. Do NOT use ___TEMP_DRY_RUN: modules.func.php resets it.
reference = Path(__file__).with_name('php-module-vars-reference.php').read_text()
helpers = reference[reference.index('function looks_like_secret'):reference.index('$modules = [];')]
root_literal = "'" + str(destination).replace('\\', '\\\\').replace("'", "\\'") + "/'"
driver = '''<?php
error_reporting(0);
'''+helpers+r'''
function dtr_capture_preinit($module,$vars,$prior){
  $module=strtolower($module); global $dtr_preinit_values,$dtr_preinit_skipped;
  foreach(array_diff(array_keys($vars),$prior) as $name){
    if(strpos($name,'___')===0)continue;
    if(looks_like_secret($module,$name)){$dtr_preinit_skipped[]="$module.$name";continue;}
    $dtr_preinit_values[$module][$name]=encode_value($vars[$name]);
  }
}
$dtr_preinit_values=[];$dtr_preinit_skipped=[];
define('IN_GAME',true);define('CURSCRIPT','index');define('NO_SYS_UPDATE',true);
$___MOD_CODE_ADV1=0;$___MOD_CODE_ADV2=0;
define('GAME_ROOT',ROOT_LITERAL);chdir(GAME_ROOT);
require GAME_ROOT.'include/common.inc.php';
ob_clean();
echo json_encode(['modules'=>$dtr_preinit_values,'skipped'=>array_values(array_unique($dtr_preinit_skipped))],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
'''.replace('ROOT_LITERAL', root_literal)
driver_path = destination / 'dtr-capture-preinit.php'
driver_path.write_text(driver)
driver_path.chmod(0o600)
print(json.dumps({'prepared_driver': str(driver_path), 'required_php': '8.2.35',
                  'next_step': 'Use the isolated fixture connection, then run PHP driver and verify no player/database mutations.'}))
