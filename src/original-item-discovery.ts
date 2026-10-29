/**
 * Original ACFUN DTS base/itemmain/main.php discover_item and focus_item.
 *
 * The database adapter is injected so no real account/room data is touched.
 * Side effects must occur in the same caller-controlled transaction.
 * Additional card/skill/instance overrides of discover_item/filter/focus
 * still require source-order integration before full module acceptance.
 */
export interface OriginalMapItem {
 iid: number;
 pls: string|number;
 itm: string;
 itmk: string;
 itme: string|number;
 itms: string|number;
 itmsk: string;
}
export interface OriginalItemFinding {
 pls:string|number;
 mode:string;
 log:string;
 itm0:string;
 itmk0:string;
 itme0:string|number;
 itms0:string|number;
 itmsk0:string;
}
export interface OriginalItemDiscoveryPort<S extends OriginalItemFinding> {
 /** Original SELECT * FROM mapitem WHERE pls='$pls' (no ORDER BY). */
 loadItems: (place:string|number)=>Promise<readonly OriginalMapItem[]>|readonly OriginalMapItem[];
 /** Called when iid > 0. Return false to abort on lost concurrent claim. */
 deleteItem: (iid:number)=>Promise<boolean>|boolean;
 /** Exact PHP shuffle result must be supplied, no invented choice/RNG. */
 shuffle:(pool:OriginalMapItem[])=>OriginalMapItem[];
 /** Original itemfind() is the actual item confirmation/display path. */
 onItemFind:(state:S)=>Promise<S>|S;
 /** Base discover_extra_item is a no-op; extra modules inject overrides. */
 onExtraItems?:(state:S,remaining:OriginalMapItem[])=>Promise<S>|S;
 filter?:(item:OriginalMapItem)=>boolean;
}
export interface OriginalItemDiscoverResult<S> {
 state:S; found:boolean;selectedId?:number;acceptedPool:number;
}
function phpTruthy(value:unknown):boolean {
 return value!==null && value!==undefined && value!==false &&
   value!==0 && value!=="" && value!=="0";
}
export async function originalDiscoverItem<S extends OriginalItemFinding>(
 initial:S,port:OriginalItemDiscoveryPort<S>
):Promise<OriginalItemDiscoverResult<S>>{
 const items=await port.loadItems(initial.pls);
 if(items.length<=0){
  return {state:{...initial,mode:"command",
    log:initial.log+'<span class="yellow b">周围找不到任何物品。</span><br>'},
    found:false,acceptedPool:0};
 }
 const pool=items.filter(port.filter??(()=>true));
 const shuffled=port.shuffle([...pool]);
 if(shuffled.length!==pool.length ||
    new Set(shuffled).size!==shuffled.length ||
    shuffled.some(x=>!pool.includes(x)))
   throw new Error("Invalid original PHP shuffle permutation");
 const chosen=shuffled[0];
 if(!chosen){
  return {state:{...initial,mode:"command",
    log:initial.log+"但是什么都没有发现。<br>"},found:false,acceptedPool:pool.length};
 }
 const iid=Number(chosen.iid);
 if(!Number.isSafeInteger(iid) || iid<0)throw new RangeError("Invalid original mapitem iid");
 if(iid>0 && !(await port.deleteItem(iid)))
  throw new Error("Original selected mapitem is already claimed");
 let state={...initial,itm0:chosen.itm,itmk0:chosen.itmk,
  itme0:chosen.itme,itms0:chosen.itms,itmsk0:chosen.itmsk} as S;
 if(phpTruthy(state.itms0)){
  state=await port.onItemFind(state);
  if(port.onExtraItems)state=await port.onExtraItems(state,shuffled.slice(1));
  return {state,found:true,selectedId:iid,acceptedPool:pool.length};
 }
 return {state:{...state,mode:"command",
  log:state.log+"但是什么都没有发现。<br>"},
  found:false,selectedId:iid,acceptedPool:pool.length};
}