/** Insertion-ordered PHP arrays used where JS numeric object-key sorting changes
 * skill execution and random selection. Deleted bucket positions stay visible
 * to the PHP array_rand implementation until an explicit compaction operation.
 */
export type PhpKey=number|string;
export type PackedPhpValue=null|string|number|boolean|{array:[PhpKey,PackedPhpValue][]};
export class OriginalPhpArray extends Map<PhpKey,unknown>{
  private buckets:(PhpKey|null)[]=[];
  constructor(entries?:Iterable<readonly[PhpKey,unknown]>){super();if(entries)for(const [k,v]of entries)this.set(k,v);}
  override set(key:PhpKey,value:unknown):this{key=this.key(key);if(!this.has(key))this.buckets.push(key);return super.set(key,value);}
  override get(key:PhpKey):unknown{return super.get(this.key(key));}
  override has(key:PhpKey):boolean{return super.has(this.key(key));}
  override delete(key:PhpKey):boolean{key=this.key(key);if(!super.delete(key))return false;const i=this.buckets.indexOf(key);if(i>=0)this.buckets[i]=null;return true;}
  override clear():void{super.clear();this.buckets=[];}
  private key(key:PhpKey):PhpKey{return typeof key==='string'&&/^-?(?:0|[1-9]\d*)$/.test(key)&&key!=='-0'&&Number.isSafeInteger(Number(key))?Number(key):key;}
  bucketKeys():readonly(PhpKey|null)[]{return this.buckets;}
  static unpack(value:PackedPhpValue):unknown {
    if(value!==null&&typeof value==='object'){const array=new OriginalPhpArray();for(const [k,v]of value.array)array.set(k,OriginalPhpArray.unpack(v));return array;}return value;
  }
  static pack(value:unknown):PackedPhpValue{
    if(value instanceof Map)return {array:[...value].map(([k,v])=>[k,OriginalPhpArray.pack(v)])};
    if(value==null)return null;
    if(['string','number','boolean'].includes(typeof value))return value as string|number|boolean;
    if(Array.isArray(value))return {array:value.map((v,i)=>[i,OriginalPhpArray.pack(v)])};
    if(typeof value==='object')return {array:Object.entries(value).map(([k,v])=>[k,OriginalPhpArray.pack(v)])};
    throw new Error('Cannot pack PHP value');
  }
}
