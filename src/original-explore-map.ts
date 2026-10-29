/**
 * Source-driven BASE implementations of ACFUN DTS core/map + base/explore.
 *
 * This is NOT the full game: skill/weather/instance overrides are injected as
 * hooks, and the original event/trap/metman/itemmain discovery chains still
 * require individual module implementations and full integration.
 *
 * PHP source: include/modules/core/map/main.php
 *             include/modules/base/explore/main.php
 */
export type OriginalPlsNo = string | number;
export interface OriginalMapState {
  arealist: readonly OriginalPlsNo[];
  areanum: number;
  areaadd: number;
  hack: boolean;
  plsinfo: Readonly<Record<string, string>>;
  areainfo: Readonly<Record<string, string>>;
}
export interface OriginalExploreState {
  pls: OriginalPlsNo;
  sp: number;
  log: string;
  mode: string;
  command: string;
}
export interface OriginalExploreHooks<T extends OriginalExploreState> {
  // Full $chprocess overrides must be injected, not skipped.
  calculateMoveSpCost?: (state: T) => number;
  calculateSearchSpCost?: (state: T) => number;
  checkCanEnter?: (place: OriginalPlsNo, state: T) => boolean;
  moveToArea?: (state: T, place: OriginalPlsNo) => T | Promise<T>;
  searchArea?: (state: T) => T | Promise<T>;
}
function phpLooseEqual(a:OriginalPlsNo,b:OriginalPlsNo):boolean {
  if(typeof a===typeof b)return a===b;
  // Original 2010-era map ids are integer indices, with get_var_input
  // returning strings; PHP '5' == 5 is true.
  if(typeof a==="number" && typeof b==="string")
    return /^\s*[+-]?\d+\s*$/.test(b) && a===Number(b.trim());
  if(typeof b==="number" && typeof a==="string")
    return /^\s*[+-]?\d+\s*$/.test(a) && b===Number(a.trim());
  return false;
}
export function originalMapAvailable(map:OriginalMapState,place:OriginalPlsNo):boolean {
  return map.arealist.some(p=>phpLooseEqual(p,place));
}
export function originalMapForbidden(map:OriginalMapState,place:OriginalPlsNo,wave=0):boolean {
  // PHP array_slice(arealist,0,areanum + wave*areaadd).
  const limit=map.areanum+wave*map.areaadd;
  const end=limit<0?Math.max(map.arealist.length+limit,0):limit;
  return map.arealist.slice(0,end).some(p=>phpLooseEqual(p,place));
}
export function originalMapCanEnter(map:OriginalMapState,place:OriginalPlsNo):boolean {
  return originalMapAvailable(map,place) && (!originalMapForbidden(map,place)||map.hack);
}
export function originalMapWaveNumber(map:OriginalMapState,areaOnStartCount:number):number {
  return Math.max(0,Math.floor((map.areanum-areaOnStartCount)/map.areaadd));
}
export function originalMapCheckPlace(map:OriginalMapState,place:OriginalPlsNo):OriginalPlsNo {
  if(originalMapAvailable(map,place))return place;
  // PHP get_all_plsno sorts the array; caller must supply sorted arealist
  // or the desired actual source order after game-info parsing.
  const sorted=[...map.arealist].sort((a,b)=>Number(a)-Number(b));
  if(!sorted.length)throw new RangeError("Original map has no available places");
  return sorted[0]!;
}
export function originalMapCurrentForbidden(map:OriginalMapState,wave=0):OriginalPlsNo[] {
  const limit=map.areanum+wave*map.areaadd;
  const end=limit<0?Math.max(map.arealist.length+limit,0):limit;
  return map.arealist.slice(0,end);
}
export function originalMapCurrentSafe(map:OriginalMapState,wave=0):OriginalPlsNo[] {
  const limit=map.areanum+wave*map.areaadd;
  return map.arealist.slice(limit);
}
export function originalAllowMove<T extends OriginalExploreState>(
 state:T,map:OriginalMapState,to:OriginalPlsNo,
 hooks:OriginalExploreHooks<T>={}
):{cost:number|false;state:T} {
  const allowed=hooks.checkCanEnter??((p:OriginalPlsNo)=>originalMapCanEnter(map,p));
  if(to==="main"||!originalMapAvailable(map,to))
    return {cost:false,state:{...state,log:state.log+"请选择正确的移动地点。<br>"}};
  if(phpLooseEqual(state.pls,to))
    return {cost:false,state:{...state,log:state.log+"相同地点，不需要移动。<br>"}};
  if(!allowed(to,state))
    return {cost:false,state:{...state,log:state.log+(map.plsinfo[String(to)]??"")+"是禁区，还是离远点吧！<br>"}};
  const cost=Math.max(hooks.calculateMoveSpCost?.(state)??15,1);
  if(state.sp<=cost)
    return {cost:false,state:{...state,log:state.log+
      '体力不足，不能移动！<br><span class="yellow b">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试移动。</span><br>'}};
  return {cost,state};
}
export function originalAllowSearch<T extends OriginalExploreState>(
 state:T,map:OriginalMapState,hooks:OriginalExploreHooks<T>={}
):{cost:number|false;state:T} {
  const allowed=hooks.checkCanEnter??((p:OriginalPlsNo)=>originalMapCanEnter(map,p));
  if(!allowed(state.pls,state))
    return {cost:false,state:{...state,log:state.log+
      (map.plsinfo[String(state.pls)]??"")+"是禁区，还是赶快逃跑吧！<br>"}};
  const cost=Math.max(1,hooks.calculateSearchSpCost?.(state)??15);
  if(state.sp<=cost)
    return {cost:false,state:{...state,log:state.log+
      '体力不足，不能探索！<br><span class="yellow b">请选择行动菜单的「睡眠」恢复体力，或使用背包里的体力恢复物品，再尝试探索。</span><br>'}};
  return {cost,state};
}
export async function originalMove<T extends OriginalExploreState>(
 state:T,map:OriginalMapState,to:OriginalPlsNo,hooks:OriginalExploreHooks<T>={}
):Promise<{moved:boolean;state:T}> {
  const checked=originalAllowMove(state,map,to,hooks);
  if(checked.cost===false)return {moved:false,state:checked.state};
  const cost=checked.cost;
  let next={...checked.state,sp:checked.state.sp-cost,
    log:checked.state.log+'你消耗<span class="yellow b">'+cost+'</span>点体力，移动到了'+
       (map.plsinfo[String(to)]??"")+'。<br>',pls:to};
  next={...next,log:next.log+(map.areainfo[String(next.pls)]??"")+'<br>'};
  const result=hooks.moveToArea?await hooks.moveToArea(next as T,to):next;
  return {moved:true,state:result as T};
}
export async function originalSearch<T extends OriginalExploreState>(
 state:T,map:OriginalMapState,hooks:OriginalExploreHooks<T>={}
):Promise<{searched:boolean;state:T}> {
  const checked=originalAllowSearch(state,map,hooks);
  if(checked.cost===false)return {searched:false,state:checked.state};
  const cost=checked.cost;
  const next={...checked.state,sp:checked.state.sp-cost,
    log:checked.state.log+'消耗<span class="yellow b">'+cost+'</span>点体力，你搜索着周围的一切……<br>'};
  const result=hooks.searchArea?await hooks.searchArea(next as T):next;
  return {searched:true,state:result as T};
}
export async function originalExploreAct<T extends OriginalExploreState>(
 state:T,map:OriginalMapState,moveto:OriginalPlsNo,hooks:OriginalExploreHooks<T>={}
):Promise<T> {
  if(state.mode!=="command")return state;
  if(state.command==="move")return (await originalMove(state,map,moveto,hooks)).state;
  if(state.command==="search")return (await originalSearch(state,map,hooks)).state;
  return state;
}