/**
 * Original ACFUN DTS cooldown/main.php and cooldown.config.php behavior.
 * All times in milliseconds. Pure functions, deterministic clocks, no IO.
 * Does not bypass the original pre_act/act/post_act $chprocess dispatch chain.
 */
export const ORIGINAL_COOLDOWN_CONFIG = {
  enabled: true,
  showTimer: true,
  moveMs: 650,
  searchMs: 650,
  itemUseMs: 250
} as const;

export interface OriginalCooldownState {
  cdsec:number;
  cdmsec:number;
  cmdcdtime:number;
  rmcdtime:number;
  mode:string;
  log:string;
}

export function originalCooldownBegin(cdsec:number,cdmsec:number,mode="command",log=""):OriginalCooldownState {
  return {cdsec,cdmsec,cmdcdtime:0,rmcdtime:0,mode,log};
}

/** cooldown\\set_coldtime(): keep the largest assigned duration. */
export function originalSetCooldown(state:OriginalCooldownState,ms:number, enabled=true,forced=false):OriginalCooldownState {
  return (enabled||forced) && state.cmdcdtime < ms
    ? {...state,cmdcdtime:ms} : state;
}

/** PHP cdover=cdsec*1000+cdmsec, nowmtime=floor(getmicrotime()*1000). */
export function originalCooldownRemaining(state:OriginalCooldownState,nowMs:number):number {
  const ended=state.cdsec*1000+state.cdmsec;
  const now=Math.floor(nowMs);
  return now>=ended ? 0 : ended-now;
}
export function originalCheckCooldown(state:OriginalCooldownState,nowMs:number,enabled=true):{
  blocked:boolean;state:OriginalCooldownState
} {
  if (!enabled) return {blocked:false,state};
  const remaining=originalCooldownRemaining(state,nowMs);
  if (remaining>0) {
    return {blocked:true,state:{
      ...state,rmcdtime:remaining,mode:"command",
      log:state.log+'<span class="yellow b">冷却时间尚未结束！</span><br>'
    }};
  }
  return {blocked:false,state:{...state,rmcdtime:0}};
}

/** Called before the actual parent $chprocess action, not a replacement. */
export function originalCooldownBeforeAction(
 state:OriginalCooldownState,
 action:"move"|"search"|"itemUse",
 nowMs:number,enabled=true
):{blocked:boolean;state:OriginalCooldownState} {
 const checked=originalCheckCooldown(state,nowMs,enabled);
 if(checked.blocked||!enabled)return checked;
 const ms=action==="move"?ORIGINAL_COOLDOWN_CONFIG.moveMs
   :action==="search"?ORIGINAL_COOLDOWN_CONFIG.searchMs
   :ORIGINAL_COOLDOWN_CONFIG.itemUseMs;
 return {blocked:false,state:originalSetCooldown(checked.state,ms,enabled)};
}

/** Original post_act(): use *page start time*, not completion time, for new CD. */
export function originalCooldownPostAct(
  state:OriginalCooldownState,pageStartMs:number,nowMs:number,enabled=true
):OriginalCooldownState {
  if (!enabled) return state;
  if (state.cmdcdtime!==0) {
    const end=Math.floor(pageStartMs)+state.cmdcdtime;
    const cdsec=Math.floor(end/1000);
    const cdmsec=Math.trunc(end%1000);
    return {...state,cdsec,cdmsec,
      rmcdtime:Math.floor(nowMs)>=end?0:end-Math.floor(nowMs)};
  }
  return {...state,rmcdtime:originalCooldownRemaining(state,nowMs)};
}
/** prepare_response_content includes timer value; initial response does not. */
export function originalCooldownResponse(
 state:OriginalCooldownState,nowMs:number,hp:number,
 initial=false,showTimer=true,enabled=true
):{remaining:number;timer?:number;log:string} {
 if(!enabled) return {remaining:state.rmcdtime,log:state.log};
 const remaining=originalCooldownRemaining(state,nowMs);
 const display=hp>0 && showTimer && remaining>0;
 const whole=Math.trunc(remaining/1000);
 const tenths=Math.trunc((remaining%1000)/100);
 const log=display
   ? state.log+'行动冷却时间：<span id="timer" class="yellow b">'+whole+'.'+tenths+
     '</span>秒<script type="text/javascript">demiSecTimerStarter('+remaining+');</script><br>'
   : state.log;
 if(!initial && showTimer && remaining>0)return {remaining,timer:remaining,log};
 return {remaining,log};
}