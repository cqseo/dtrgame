import type { HostFunction } from "../template/builtins";
import { PhpArray, PhpBytes,phpConcat,phpStringBytes,phpStringFromBytes,toStringValue,type PhpValue } from "../template/values";

export interface LegacyVirtualFile { content: string; mtime: number; encoding?: 'base64'; mode?:number; }
class DirectoryHandle {cursor=0;closed=false;constructor(readonly names:string[]) {}}
/** Request working copy. Its mutations must commit with the game's SQL
 * changes; it never accesses the host filesystem or remote URLs. */
export class LegacyVirtualFilesystem {
  readonly files: Map<string,LegacyVirtualFile>;
  readonly directories = new Set<string>(["", "gamedata", "gamedata/tmp", "gamedata/bak", "gamedata/tmp/replay"]);
  readonly readonlyPaths:Set<string>;
  constructor(readonly readonlyFiles: Readonly<Record<string,string>>, files: Readonly<Record<string,LegacyVirtualFile>> = {}, readonly now=0, options:{directories?:Iterable<string>;readonlyPaths?:Iterable<string>}={}) {
    this.readonlyPaths=new Set([...(options.readonlyPaths??[])].map(p=>this.path(p)));
    for(const dir of options.directories??[])this.directories.add(this.path(dir));
    this.files=new Map(Object.entries(files).map(([k,v])=>[this.path(k),{...v}]));
    for(const file of [...Object.keys(readonlyFiles),...this.files.keys(),...this.readonlyPaths]) this.#parents(file);
  }
  path(value: string): string {
    const path=value.replaceAll('\\','/').replace(/^\/+/, '').split('/').filter(s=>s && s!=='.');
    if(path.includes('..') || value.includes('\0') || /:\/\//.test(value)) throw new Error('Invalid original virtual path.');
    return path.join('/');
  }
  #parents(file: string) { const parts=this.path(file).split('/'); parts.pop(); while(parts.length){this.directories.add(parts.join('/'));parts.pop();} }
  read(path:string):string|PhpBytes|false {
    const key=this.path(path),file=this.files.get(key);
    if(file?.encoding==='base64')return new PhpBytes(Uint8Array.from(atob(file.content),c=>c.charCodeAt(0)));
    return file?.content ?? this.readonlyFiles[key] ?? false;
  }
  exists(path:string):boolean {const key=this.path(path);return this.read(key)!==false||this.directories.has(key)||this.readonlyPaths.has(key);}
  write(path:string,content:string|PhpBytes,append=false):void {
    const key=this.path(path);
    if(!/^(?:gamedata\/(?:tmp|bak|javascript|replays|cache)\/|log\.txt$)/.test(key)||Object.hasOwn(this.readonlyFiles,key))throw new Error(`Write outside original game state: ${key}`);
    this.#parents(key);const value=append?phpConcat(this.read(key)||'',content):content;
    if(value instanceof PhpBytes){
      let binary='';for(let i=0;i<value.bytes.length;i+=8192)binary+=String.fromCharCode(...value.bytes.subarray(i,i+8192));
      this.files.set(key,{content:btoa(binary),encoding:'base64',mtime:this.now});
    }else this.files.set(key,{content:value,mtime:this.now});
  }
  entries(path:string,type=''):string[]|null {
    const dir=this.path(path);if(!this.directories.has(dir))return null;
    const prefix=dir?dir+'/':'';const result=new Set<string>();
    for(const full of [...this.directories,...Object.keys(this.readonlyFiles),...this.files.keys(),...this.readonlyPaths]){
      if(!full.startsWith(prefix)||full===dir)continue;
      const name=full.slice(prefix.length).split('/')[0]!;const isDir=this.directories.has(prefix+name);
      if(!type||(type==='dir'&&isDir)||(!isDir&&name.split('.').pop()===type))result.add(name);
    }return [...result];
  }
  snapshot():Record<string,LegacyVirtualFile>{return Object.fromEntries([...this.files].map(([k,v])=>[k,{...v}]));}
  state(){return {files:this.snapshot(),directories:[...this.directories].filter(d=>/^gamedata(?:\/(?:tmp|bak|javascript|replays|cache)(?:\/.*)?)?$/.test(d))};}
  functions():Map<string,HostFunction>{
    const text=(v:unknown)=>toStringValue(v as never);
    const f=new Map<string,HostFunction>();
    f.set('file_exists',a=>this.exists(text(a[0])));
    f.set('is_dir',a=>this.directories.has(this.path(text(a[0]))));
    f.set('filemtime',a=>this.files.get(this.path(text(a[0])))?.mtime??(this.exists(text(a[0]))?0:false));
    f.set('file_get_contents',a=>{const data=this.read(text(a[0]));if(data===false)return false;const bytes=phpStringBytes(data),offset=Number(a[3]??0),start=offset<0?Math.max(bytes.length+offset,0):offset;return phpStringFromBytes(bytes.slice(start,a[4]===undefined||a[4]===null?undefined:start+Number(a[4])));});
    f.set('file_put_contents',a=>{const data=a[1] instanceof PhpBytes?a[1]:text(a[1]);this.write(text(a[0]),data,(Number(a[2]??0)&8)!==0);return phpStringBytes(data).length;});
    f.set('readover',a=>this.read(text(a[0]))||'');
    f.set('openfile',a=>{const data=this.read(text(a[0]))||'';const lines=toStringValue(data).match(/[^\n]*\n|[^\n]+$/g)??[];const out=new PhpArray();lines.forEach(x=>out.push(x));return out;});
    f.set('writeover',a=>{this.write(text(a[0]),a[1] instanceof PhpBytes?a[1]:text(a[1]),/^a/.test(text(a[2]??'rb+')));return null;});
    f.set('gdir',a=>{const entries=this.entries(text(a[0]),text(a[1]??''));if(entries===null)return null;const out=new PhpArray();entries.forEach(x=>out.push(x));return out;});
    f.set('opendir',a=>{const entries=this.entries(text(a[0]));return entries===null?false:new DirectoryHandle(['.','..',...entries]) as unknown as PhpValue;});
    f.set('readdir',a=>{const handle=a[0] as unknown;if(!(handle instanceof DirectoryHandle)||handle.closed)return false;return handle.names[handle.cursor++]??false;});
    f.set('closedir',a=>{const handle=a[0] as unknown;if(handle instanceof DirectoryHandle)handle.closed=true;return null;});
    f.set('rmdir',a=>{const path=this.path(text(a[0]));if(!this.directories.has(path)||(this.entries(path)?.length??0)>0)return false;return this.directories.delete(path);});
    f.set('chmod',a=>{const path=this.path(text(a[0])),mode=Number(a[1]);if(!Number.isInteger(mode)||mode<0||mode>4095)return false;const file=this.files.get(path);if(!file)return false;file.mode=mode;return true;});
    f.set('touch',a=>{const path=text(a[0]);this.write(path,this.read(path)||'');return true;});
    f.set('unlink',a=>{const path=this.path(text(a[0]));if(Object.hasOwn(this.readonlyFiles,path))throw new Error('Cannot remove immutable game source.');return this.files.delete(path);});
    f.set('create_dir',a=>{const path=this.path(text(a[0]));this.#parents(path+'/file');this.directories.add(path);return true;});
    f.set('mkdir',a=>{const path=this.path(text(a[0]));this.#parents(path+'/file');this.directories.add(path);return true;});
    f.set('copy',a=>{const data=this.read(text(a[0]));if(data===false)return false;this.write(text(a[1]),data);return true;});
    f.set('rename',a=>{const from=this.path(text(a[0]));const data=this.read(from);if(data===false)return false;this.write(text(a[1]),data);this.files.delete(from);return true;});
    f.set('filesize',a=>{const data=this.read(text(a[0]));return data===false?false:phpStringBytes(data).length;});
    return f;
  }
}
