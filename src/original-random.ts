/** PHP 7.4 default MT19937 + unbiased php_mt_rand_range semantics.
 * Algorithm checked against php-src PHP-7.4 ext/standard/{mt_rand,array}.c
 * and executable fixtures from the source server's PHP binary.
 * Gameplay only: never use for passwords, session IDs or security tokens.
 */
export interface OriginalRandomSnapshot {state:number[];index:number;draws:number;}
export class OriginalPhpRandom {
  private readonly state=new Uint32Array(624);private index=624;draws=0;
  constructor(seed:number){
    if(!Number.isSafeInteger(seed))throw new RangeError('Invalid PHP random seed');
    this.state[0]=seed>>>0;
    for(let i=1;i<624;i++){const p=this.state[i-1]!;this.state[i]=(Math.imul(1812433253,p^(p>>>30))+i)>>>0;}
  }
  static restore(snapshot:OriginalRandomSnapshot):OriginalPhpRandom {
    if(snapshot.state.length!==624||!Number.isInteger(snapshot.index)||snapshot.index<0||snapshot.index>624||!Number.isSafeInteger(snapshot.draws)||snapshot.draws<0||snapshot.state.some(n=>!Number.isInteger(n)||n<0||n>0xffffffff))throw new RangeError('Invalid random snapshot');
    const r=new OriginalPhpRandom(0);r.state.set(snapshot.state);r.index=snapshot.index;r.draws=snapshot.draws;return r;
  }
  snapshot():OriginalRandomSnapshot{return {state:Array.from(this.state),index:this.index,draws:this.draws};}
  private next():number{
    if(this.index===624){
      for(let i=0;i<624;i++){const y=(this.state[i]!&0x80000000)|(this.state[(i+1)%624]!&0x7fffffff);this.state[i]=(this.state[(i+397)%624]!^(y>>>1)^((y&1)?0x9908b0df:0))>>>0;}
      this.index=0;
    }
    let y=this.state[this.index++]!;y^=y>>>11;y^=(y<<7)&0x9d2c5680;y^=(y<<15)&0xefc60000;this.draws++;return (y^(y>>>18))>>>0;
  }
  raw31():number{return this.next()>>>1;}
  int(min:number,max:number):number{
    if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max))throw new RangeError('Unsafe PHP random bounds');
    if(min>max)[min,max]=[max,min]; // rand() accepts reversed bounds in PHP 7.4.
    const span=BigInt(max)-BigInt(min);let result:bigint;
    if(span<=0xffffffffn){
      let value=this.next();const size=Number(span)+1;
      if(size===0x100000000)return min+value;
      if((size&(size-1))===0)return min+((value&(size-1))>>>0);
      const limit=0xffffffff-(0xffffffff%size)-1;
      while(value>limit)value=this.next();
      return min+value%size;
    }
    const next64=()=>BigInt(this.next())<<32n|BigInt(this.next());
    result=next64();const size=span+1n;
    if((size&(size-1n))===0n)result&=size-1n;
    else{const maximum=0xffffffffffffffffn,limit=maximum-maximum%size-1n;while(result>limit)result=next64();result%=size;}
    return Number(BigInt(min)+result);
  }
  shuffle<T>(values:readonly T[]):T[]{
    const result=[...values];for(let i=result.length-1;i>0;i--){const j=this.int(0,i);[result[i],result[j]]=[result[j]!,result[i]!];}return result;
  }
  /** array_rand on PHP hash buckets, retaining deleted slots when supplied.
   * A bucket list is required: compacting holes changes random draw consumption.
   */
  arrayKeys<K extends string|number>(buckets:readonly (K|null)[],count=1):K|K[]{
    const keys=buckets.filter((key):key is K=>key!==null),available=keys.length;
    if(!available||!Number.isInteger(count)||count<1||count>available)throw new RangeError('Invalid source array_rand request');
    if(count===1){
      if(available<buckets.length-(buckets.length>>>1))return keys[this.int(0,available-1)]!;
      for(;;){const key=buckets[this.int(0,buckets.length-1)];if(key!==null&&key!==undefined)return key;}
    }
    const inverted=count>(available>>>1),required=inverted?available-count:count,selected=new Set<number>();
    while(selected.size<required)selected.add(this.int(0,available-1));
    return keys.filter((_key,i)=>selected.has(i)!==inverted);
  }
}
