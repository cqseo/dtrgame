/** The original 30-second room socket wait, expressed as DO subscriptions.
 * Subscribe checks a generation captured before the state read, closing the
 * read/subscribe race. No room queue or SQL transaction is held while idle. */
export class OriginalRoomSubscribers {
  version=0;
  readonly #listeners=new Set<()=>void>();
  notify(){this.version++;for(const wake of [...this.#listeners])wake();}
  wait(since:number,signal?:AbortSignal,timeout=30_000):Promise<boolean>{
    if(since!==this.version)return Promise.resolve(true);
    if(signal?.aborted)return Promise.resolve(false);
    return new Promise(resolve=>{
      const finish=(changed:boolean)=>{
        clearTimeout(timer);this.#listeners.delete(wake);signal?.removeEventListener('abort',abort);resolve(changed);
      };
      const wake=()=>finish(true),abort=()=>finish(false);
      const timer=setTimeout(()=>finish(false),timeout);
      this.#listeners.add(wake);signal?.addEventListener('abort',abort,{once:true});
    });
  }
}
