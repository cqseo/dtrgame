import {readFileSync} from 'node:fs';
// Both inputs are captured/generated original data. Provisioning empty
// schema copies is a storage adaptation, never a change to room limits.
export function originalRoomSlots(){
  const module=readFileSync('src/generated/legacy-room-types.ts','utf8');
  const config=JSON.parse(module.slice(module.indexOf('=')+1,module.lastIndexOf(' as const;')));
  const limit=config.maxRoomNum+Object.values(config.roomTypes).filter(room=>room.soleroom).length;
  const source=readFileSync('src/generated/legacy-schema.sql','utf8');
  const slots=[];
  for(let room=1;room<=limit;room++)for(const kind of ['chat','log','mapitem','maptrap','newsinfo','players','shopitem']){
    const name=`acbra2_s${room}_${kind}`;
    if(source.includes(`CREATE TABLE IF NOT EXISTS "${name}"`))continue;
    const template=`acbra2_s1_${kind}`;
    const block=new RegExp('CREATE TABLE IF NOT EXISTS "'+template+'" \\([\\s\\S]*?\\n\\);(?:\\nCREATE [^\\n]+;)*').exec(source)?.[0];
    if(!block)throw new Error('Original room blueprint is absent: '+template);
    slots.push({name,sql:block.replaceAll(template,name)});
  }
  return {limit,slots};
}
