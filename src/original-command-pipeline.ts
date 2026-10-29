/**
 * Original include/pages/command_act.php action ordering, without fake game
 * logic. The injected hooks are actual module-chain boundaries; no individual
 * module is called "complete" until its own $chprocess chain is ported.
 *
 * Source executes: init → pre_act → [if allowed act] → post_act →
 * prepare_response_content → parse_interface_profile →
 * parse_interface_gameinfo → gencode/emit response → update_sdata →
 * before_last_player_save_event → player_save. Player data release/locks are
 * handled by command.php OUTSIDE this function.
 */
export interface OriginalCommandHooks<TState,TResponse> {
  initPlayerData(state:TState):Promise<TState>|TState;
  preAct(state:TState):Promise<TState>|TState;
  getActionFields(state:TState):{hp:number;state:number};
  act(state:TState):Promise<TState>|TState;
  postAct(state:TState):Promise<TState>|TState;
  prepareResponse(state:TState):Promise<TResponse>|TResponse;
  parseProfile(state:TState,response:TResponse):Promise<TResponse>|TResponse;
  parseGameInfo(state:TState,response:TResponse):Promise<TResponse>|TResponse;
  encodeResponse(response:TResponse):Promise<string>|string;
  emitResponse(encoded:string):Promise<void>|void;
  updateSdata(state:TState):Promise<TState>|TState;
  beforeLastSave(state:TState):Promise<TState>|TState;
  savePlayer(state:TState):Promise<void>|void;
}
export async function executeOriginalCommandAct<TState,TResponse>(
  gamestate:number, initialState:TState, hooks:OriginalCommandHooks<TState,TResponse>
):Promise<{state:TState;response:TResponse;encoded:string;acted:boolean}> {
  let state=await hooks.initPlayerData(initialState);
  state=await hooks.preAct(state);
  const fields=hooks.getActionFields(state);
  const acted=gamestate>=20 && fields.hp>0 && fields.state<=3;
  if(acted)state=await hooks.act(state);
  state=await hooks.postAct(state);
  let response=await hooks.prepareResponse(state);
  response=await hooks.parseProfile(state,response);
  response=await hooks.parseGameInfo(state,response);
  const encoded=await hooks.encodeResponse(response);
  await hooks.emitResponse(encoded);
  state=await hooks.updateSdata(state);
  state=await hooks.beforeLastSave(state);
  await hooks.savePlayer(state);
  return {state,response,encoded,acted};
}
/**
 * Original source response is sent before the last player_save hook, which
 * means client receipt alone is not evidence of a committed DB update.
 * In a Cloudflare fetch handler, saving should be fully awaited before the
 * response is returned, to avoid a dropped save at isolate shutdown.
 * For production, this HTTP transport ordering needs separate source-UI
 * compatibility verification; the function above documents the PHP order.
 */