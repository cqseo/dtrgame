import type {CompiledPhpFunction} from '../module-compiler';
import type {Statement} from '../template/ast';

// Executable code is still the captured original AST. JSON delays allocating
// every function body until it is actually called, without runtime codegen.
// Eviction releases only immutable syntax, never a player's mutable state.
const programs=new Map<CompiledPhpFunction,{program:readonly Statement[];weight:number}>();
const maximumWeight=2_000_000;
let retainedWeight=0;

export function lazyOriginalFunction(metadata:Omit<CompiledPhpFunction,'program'>,encoded:string):CompiledPhpFunction{
  const fn:CompiledPhpFunction={...metadata,get program(){
    const cached=programs.get(fn);
    if(cached){programs.delete(fn);programs.set(fn,cached);return cached.program;}
    const program=JSON.parse(encoded) as readonly Statement[];
    if(encoded.length<=maximumWeight){
      while(retainedWeight+encoded.length>maximumWeight&&programs.size){
        const oldest=programs.keys().next().value!;
        retainedWeight-=programs.get(oldest)!.weight;programs.delete(oldest);
      }
      programs.set(fn,{program,weight:encoded.length});retainedWeight+=encoded.length;
    }
    return program;
  }};
  return fn;
}
