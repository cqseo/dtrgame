/**
 * Original ACFUN DTS include/modules/core/player/main.php kill() base phases.
 *
 * This is a source-ordered state machine with REQUIRED external hooks for
 * source save_gameinfo, revive_sequence, revive_process, deathnews and messages.
 * No pretend global gameplay effects: unprovided hooks are a hard error.
 *
 * Character and game data updates are staged in memory here; caller MUST run
 * callbacks and player saves in one serialized, transactionally safe room.
 */
export interface OriginalKillPlayer {
 pid:number;
 type:number;
 hp:number;
 state:number;
 bid:number;
 name:string;
 killnum:number;
 npckillnum:number;
 endtime:number;
 attackwith:string;
 sourceless?:number;
 rivival_news?:readonly unknown[];
 [key:string]:unknown;
}
export interface OriginalKillCounters {
 deathnum:number;alivenum:number;
}
export interface OriginalKillHooks {
 getKillMessage:(attacker:OriginalKillPlayer)=>string|Promise<string>;
 saveGameInfo:(counters:OriginalKillCounters)=>void|Promise<void>;
 setReviveSequence:(attacker:OriginalKillPlayer,victim:OriginalKillPlayer)=>void|Promise<void>;
 processRevive:(attacker:OriginalKillPlayer,victim:OriginalKillPlayer,counters:OriginalKillCounters)=>void|Promise<void>;
 deathNews:(attacker:OriginalKillPlayer,victim:OriginalKillPlayer)=>void|Promise<void>;
 revivePostDeathNews:(announcement:readonly unknown[])=>void|Promise<void>;
}
export interface OriginalKillResult {
 attacker:OriginalKillPlayer;victim:OriginalKillPlayer;
 counters:OriginalKillCounters;message:string;
 phases:string[];
}
/**
 * Kill source: death count and alive count change BEFORE revive callbacks.
 * Original revive may undo those values later, using plugin registered rules.
 */
export async function originalPlayerKillBase(
 attackSource:OriginalKillPlayer,
 defeated:OriginalKillPlayer,
 initialCounters:OriginalKillCounters,
 now:number,hooks:OriginalKillHooks
):Promise<OriginalKillResult> {
 if(!Number.isFinite(now)||now<0)throw new RangeError("Invalid game clock");
 if(!Number.isSafeInteger(attackSource.pid)||!Number.isSafeInteger(defeated.pid))
  throw new RangeError("Invalid original player id");
 const same=attackSource.pid===defeated.pid;
 // Original references: when both pa/pd are the same PHP reference,
 // mutations must be visible from BOTH aliases.
 const a={...attackSource};
 const v=same?a:{...defeated};
 const counters={...initialCounters};
 const phases:string[]=[];
 v.hp=0;
 if(!v.sourceless)v.bid=a.pid;
 const message=same?"":await hooks.getKillMessage(a);
 if(v.type===0&&!same)a.killnum++;
 else if(v.type>0)a.npckillnum++;
 counters.deathnum++;
 if(v.type===0)counters.alivenum--;
 v.endtime=now;
 phases.push("save_gameinfo");
 await hooks.saveGameInfo(counters);
 // Source copied victim BEFORE potential revival and retained its original
 // state; only hp is later overwritten to reflect revived state for news.
 const deathSnapshot={...v};
 phases.push("set_revive_sequence");
 await hooks.setReviveSequence(a,v);
 phases.push("revive_process");
 await hooks.processRevive(a,v,counters);
 deathSnapshot.hp=v.hp;
 phases.push("deathnews");
 await hooks.deathNews(a,deathSnapshot);
 if(v.rivival_news?.length){
  phases.push("revive_post_deathnews");
  await hooks.revivePostDeathNews(v.rivival_news);
 }
 return {attacker:a,victim:v,counters,message,phases};
}
