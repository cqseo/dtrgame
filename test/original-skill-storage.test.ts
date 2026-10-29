import {it,expect}from 'vitest';import fs from 'node:fs';
import {originalSkillLoad,originalSkillSave,type OriginalSkillState}from '../src/original-skill-storage';
const f=JSON.parse(fs.readFileSync(new URL('./fixtures/original-skill-storage-php.json',import.meta.url),'utf8'))as{cases:{skills:[number,number][];parameters:[string,string|number|boolean|null][];saved:[string,string];loadedSkills:[number,number][];loadedParameters:[string,string][]}[]};
for(const [i,c]of f.cases.entries())it(`source skill storage ${i}`,()=>{
 const state:OriginalSkillState={acquired:new Map(c.skills),parameters:new Map(c.parameters)};
 expect(originalSkillSave(state)).toEqual(c.saved);const loaded=originalSkillLoad(...c.saved);
 expect([...loaded.acquired]).toEqual(c.loadedSkills);expect([...loaded.parameters]).toEqual(c.loadedParameters);
});
it('rejects malformed source skill strings',()=>{expect(()=>originalSkillLoad('a','')).toThrow();expect(()=>originalSkillLoad('a/','')).toThrow();expect(()=>originalSkillLoad('','YQ==,Yg==')).toThrow();});
