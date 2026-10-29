/** Source: base/metman/main.php. Base module only; installed skill overrides
 * must be supplied by the module dispatcher before any production release. */
export interface OriginalEncounterPlayer extends Record<string, unknown> {
  pid:number; pls:number; hp:number; name:string;
}
export interface OriginalEncounterState {
  pid:number; pls:number; mode:string; log:string; hideflag:boolean;
}
export function originalPhpTruthy(value:unknown):boolean {
  if(Array.isArray(value))return value.length>0;
  return value!==undefined && value!==null && value!==false && value!==0 && value!=="" && value!=="0";
}
export function originalCorpseHasLoot(p:OriginalEncounterPlayer):boolean {
  if(Number(p.corpse_clear_flag)===1)return false;
  if(originalPhpTruthy(p.weps) && (p.wepk!=="WN" || Number(p.wepe)>0))return true;
  if(originalPhpTruthy(p.arbs) && (p.arbk!=="DN" || Number(p.arbe)>0))return true;
  return ["money","arhs","aras","arfs","arts","itms1","itms2","itms3","itms4","itms5","itms6"]
    .some(k=>originalPhpTruthy(p[k]));
}
export function originalPlayerDiscoverFilter(p:OriginalEncounterPlayer):boolean {
  return p.hp>0 || originalCorpseHasLoot(p);
}
/** This count deliberately includes non-cleared EMPTY corpses, as MySQL does. */
export function originalMeetmanRate(mode:string,count:number):number {
  if(!Number.isSafeInteger(count)||count<0)throw new RangeError("Invalid encounter population");
  if(count===0 && ["search","move","search2"].includes(mode))return 50;
  const extra=Math.min(count*3,30);
  if(mode==="search")return 20+extra;
  if(mode==="move")return 40+extra;
  if(mode==="search2")return 100;
  return 0;
}
type MaybePromise<T>=T|Promise<T>;
export interface OriginalPlayerDiscoveryPorts<P extends OriginalEncounterPlayer> {
  listCandidates:(place:number,selfId:number)=>Promise<P[]>;
  /** Must run the original fetch/update effects; a raw SQL read alone is insufficient. */
  fetchPlayer:(id:number)=>Promise<P>;
  savePlayer:(player:P)=>MaybePromise<void>;
  updateSdata:()=>MaybePromise<void>;
  meetAlternative:(player:P)=>MaybePromise<void>;
  shuffle:(players:readonly P[])=>P[];
  random99:()=>number;
  findOdds?:(player:P)=>MaybePromise<number>;
  hideOdds?:(player:P)=>MaybePromise<number>;
  filter?:(player:P)=>MaybePromise<boolean>;
  checkCorpse?:(player:P)=>MaybePromise<boolean>;
}
export async function originalDiscoverPlayer<S extends OriginalEncounterState,P extends OriginalEncounterPlayer>(
  state:S,ports:OriginalPlayerDiscoveryPorts<P>
):Promise<{state:S;found:boolean;encountered:P|null}> {
  const rows=await ports.listCandidates(state.pls,state.pid);
  const eligible:P[]=[];
  for(const p of rows)if(await (ports.filter??originalPlayerDiscoverFilter)(p))eligible.push(p);
  if(!eligible.length){
    state.log+='<span class="yellow b">周围一个人都没有。</span><br>';
    state.mode="command";
    // Source returns before resetting hideflag on an empty candidate list.
    return {state,found:false,encountered:null};
  }
  const candidates=ports.shuffle(eligible);
  state.hideflag=false;
  for(const candidate of candidates){
    const p=await ports.fetchPlayer(candidate.pid);
    if(originalPhpTruthy(p.infochanged))await ports.savePlayer(p);
    if(p.pls===state.pls){
      let discovered:boolean;
      if(p.hp>0){
        const find=await (ports.findOdds?.(p)??70);
        const hide=await (ports.hideOdds?.(p)??0);
        const dice=ports.random99();
        if(!Number.isInteger(dice)||dice<0||dice>99)throw new RangeError("Invalid encounter RNG draw");
        discovered=dice<find-hide;
        if(!discovered)state.hideflag=true;
      }else discovered=await (ports.checkCorpse?.(p)??true);
      if(discovered){
        // meetman() updates current player, then fetches the enemy AGAIN.
        await ports.updateSdata();
        const encountered=await ports.fetchPlayer(p.pid);
        await ports.meetAlternative(encountered);
        return {state,found:true,encountered};
      }
    }else state.log+='你发现了'+p.name+'，但对方匆匆离去，你追之不及。<br>';
  }
  state.log+=state.hideflag?'似乎有人隐藏着……<br>':
    '<span class="yellow b">周围一个人都没有，但你觉得应该有人的……</span><br>';
  state.mode="command";
  return {state,found:false,encountered:null};
}
