import {it,expect} from 'vitest';
import {decodeOriginalEncounterRow,SupabaseOriginalEncounterStore} from '../src/original-supabase-encounter';
import type {PgLegacyClient,PgParameter} from '../src/original-supabase-db';
it('normalizes unsigned int PG strings without changing original text fields',()=>{
  expect(decodeOriginalEncounterRow({pid:7,pls:3,hp:'4294967295',name:'角色',weps:'∞',itms1:'0'}))
    .toEqual({pid:7,pls:3,hp:4294967295,name:'角色',weps:'∞',itms1:'0'});
  for(const hp of ['',null,'0garbage',-1,'4294967296'])expect(()=>decodeOriginalEncounterRow({pid:7,pls:3,hp,name:'角色'})).toThrow();
});
it('uses the original room and separates population count from loot filtering',async()=>{
  const calls:{sql:string;args:readonly PgParameter[]}[]=[];
  const db:PgLegacyClient={async query<T extends Record<string,unknown>>(sql:string,args:readonly PgParameter[]){
    calls.push({sql,args});return {rows:(sql.includes('count(*)')?[{count:'2'}]:[{pid:7,pls:3,hp:'0',name:'角色',corpse_clear_flag:0}]) as unknown as T[],rowCount:1};
  }};
  const s=new SupabaseOriginalEncounterStore(db,8,'qa-only');
  expect((await s.listCandidates(3,1))[0]?.hp).toBe(0);
  expect(await s.meetRate('search',3,1)).toBe(26);
  expect(calls[0]?.sql).toContain('acfun_legacy."s8_players"');
  expect(calls[0]?.args).toEqual([3,1]);
  expect(calls[1]?.sql).toContain('(hp>0 OR corpse_clear_flag!=1)');
  expect(()=>new SupabaseOriginalEncounterStore(db,7,'qa-only')).toThrow();
  await expect(s.listCandidates(999,1)).rejects.toThrow();
});
