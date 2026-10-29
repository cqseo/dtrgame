import {it,expect} from 'vitest';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
import {registerOriginalStartingItems,originalCompoundAttribute,type OriginalAdmissionPlayer} from '../src/original-starting-items';
import {OriginalModuleDispatcher} from '../src/original-module-dispatch';
import {originalHookCatalog} from '../src/generated/original-hook-catalog';
const f=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync(new URL('./fixtures/original-starting-items-php.json.gz.base64',import.meta.url),'utf8'),'base64')).toString()) as {files:Record<string,string[]>;eloratedModes:number[];cases:{gametype:number;level:number;input:OriginalAdmissionPlayer;rolls:[number,number,number][];result:OriginalAdmissionPlayer}[]};
const paths:Record<string,string>={itemmain:'base/itemmain',instance7:'extra/instance/instance7_tutorial',instance8:'extra/instance/instance8_proud',instance9:'extra/instance/instance9_rush',instance11:'extra/instance/instance11_observe',instance10:'extra/instance/instance10_rogue'};
for(const [i,c]of f.cases.entries())it(`original admission inventory ${i}: mode ${c.gametype}, level ${c.level}`,async()=>{
  const d=new OriginalModuleDispatcher(originalHookCatalog),rolls=[...c.rolls],input=structuredClone(c.input);
  registerOriginalStartingItems(d,{gametype:c.gametype,level:c.level,eloratedModes:f.eloratedModes,
    randomInt:(min,max)=>{const roll=rolls.shift();expect(roll?.slice(0,2)).toEqual([min,max]);return roll![2];},
    readPool:(module,file)=>{const path='include/modules/'+paths[module]+'/config/'+file+'.config.php';const pool=f.files[path];if(!pool)throw new Error('Missing oracle pool '+path);return pool;}});
  expect(d.missing('init_enter_battlefield_items')).toEqual([]);
  expect(await d.call('itemmain','init_enter_battlefield_items',input)).toEqual(c.result);
  expect(input).toEqual(c.input);expect(rolls).toHaveLength(0);
});
it('encodes nested composite attributes until no source marker remains',()=>{
  const result=originalCompoundAttribute('^res_<:comp_itmsk:>{x^res_<:comp_itmsk:>{PB2}1}1');
  expect(result).not.toContain('<:comp_itmsk:>');expect(result).toMatch(/^\^res_[A-Za-z)!@#$%\-~*(+/=]+1$/);
});
