/** Native equivalent of hook_register + __MAGIC__ (modules.func.php).
 * Registration order follows modules.list.php; cross-module calls redirect to
 * the last override unless the caller is the target's immediate override.
 * Parent calls and request state are explicit, safe across awaited I/O.
 */
export interface OriginalHookDefinition {module:string;name:string;magic:boolean;}
export type OriginalHookCatalog=Readonly<Record<string,readonly OriginalHookDefinition[]>>;
export interface OriginalModuleContext {
  readonly module:string;readonly functionName:string;
  readonly state:Record<string,unknown>;
  call(module:string,name:string,...args:unknown[]):Promise<unknown>;
  parent(...args:unknown[]):Promise<unknown>;
}
export type OriginalModuleFunction=(context:OriginalModuleContext,...args:unknown[])=>unknown|Promise<unknown>;
export class OriginalModuleMissing extends Error {}
export class OriginalModuleDispatcher {
  private readonly implementations=new Map<string,OriginalModuleFunction>();
  constructor(private readonly catalog:OriginalHookCatalog,readonly state:Record<string,unknown>={}){}
  register(module:string,name:string,implementation:OriginalModuleFunction):void {
    const ns=module.toLowerCase(),fn=name.toLowerCase(),key=ns+'\\'+fn;
    if(!this.catalog[fn]?.some(h=>h.module.toLowerCase()===ns))throw new Error('Function is not in the installed module catalog: '+key);
    if(this.implementations.has(key))throw new Error('Duplicate module implementation: '+key);
    this.implementations.set(key,implementation);
  }
  missing(name:string):string[]{
    return (this.catalog[name.toLowerCase()]??[]).map(h=>h.module.toLowerCase()+'\\'+h.name.toLowerCase()).filter(key=>!this.implementations.has(key));
  }
  async call(module:string,name:string,...args:unknown[]):Promise<unknown>{return this.invoke(module,name,args,null,0);}
  private async invoke(module:string,name:string,args:unknown[],caller:string|null,depth:number):Promise<unknown>{
    if(depth>500)throw new Error('Original hook recursion limit exceeded');
    const ns=module.toLowerCase(),fn=name.toLowerCase(),chain=this.catalog[fn];
    if(!chain)throw new OriginalModuleMissing('Unknown source hook: '+fn);
    const index=chain.findIndex(h=>h.module.toLowerCase()===ns);
    if(index<0)throw new OriginalModuleMissing('Unknown source module function: '+ns+'\\'+fn);
    const entry=chain[index]!,parentOverride=chain[index+1];
    if(entry.magic&&parentOverride&&caller!==parentOverride.module.toLowerCase()+'\\'+fn)
      return this.invoke(chain[chain.length-1]!.module,fn,args,ns+'\\'+fn,depth+1);
    const key=ns+'\\'+fn,implementation=this.implementations.get(key);
    if(!implementation)throw new OriginalModuleMissing('Unported source module function: '+key);
    const context:OriginalModuleContext={module:ns,functionName:fn,state:this.state,
      call:(target,hook,...parameters)=>this.invoke(target,hook,parameters,key,depth+1),
      parent:(...parameters)=>index===0?Promise.resolve(null):this.invoke(chain[index-1]!.module,fn,parameters,key,depth+1)};
    return implementation(context,...args);
  }
}
