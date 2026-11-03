/** Source compilation and representation-only repacking share one emitter. */
export function renderCompiledFunction(fn){
  const {program,...metadata}=fn;
  return 'lazyOriginalFunction('+JSON.stringify(metadata)+','+JSON.stringify(JSON.stringify(program))+')';
}
