/**
 * Cloudflare Worker-compatible port of the actual PHP login.php password checks.
 * Staging-only. DB records come exclusively from the isolated D1 migration store.
 * It does NOT proxy or depend on PHP, and it never stores raw passwords.
 */
const MD5_SHIFTS=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
const MD5_K=Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0);
function legacyMd5Bytes(text){
  const input=new TextEncoder().encode(text);
  const length=Math.ceil((input.length+9)/64)*64;
  const msg=new Uint8Array(length);msg.set(input);msg[input.length]=128;
  const bits=BigInt(input.length)*8n;
  for(let i=0;i<8;i++)msg[length-8+i]=Number((bits>>BigInt(i*8))&255n);
  let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
  const x=new Uint32Array(16);
  for(let pos=0;pos<msg.length;pos+=64){
    for(let i=0;i<16;i++){const at=pos+i*4;x[i]=(msg[at]|(msg[at+1]<<8)|(msg[at+2]<<16)|(msg[at+3]<<24))>>>0;}
    let a=a0,b=b0,c=c0,d=d0;
    for(let i=0;i<64;i++){
      let f,g;
      if(i<16){f=(b&c)|(~b&d);g=i;}
      else if(i<32){f=(d&b)|(~d&c);g=(5*i+1)%16;}
      else if(i<48){f=b^c^d;g=(3*i+5)%16;}
      else{f=c^(b|~d);g=(7*i)%16;}
      const n=(a+f+MD5_K[i]+x[g])>>>0;
      a=d;d=c;c=b;b=(b+((n<<MD5_SHIFTS[i])|(n>>>(32-MD5_SHIFTS[i]))))>>>0;
    }
    a0=(a0+a)>>>0;b0=(b0+b)>>>0;c0=(c0+c)>>>0;d0=(d0+d)>>>0;
  }
  return [a0,b0,c0,d0].map(v=>[0,8,16,24].map(k=>((v>>>k)&255).toString(16).padStart(2,"0")).join("")).join("");
}
function legacyEqualDigest(a,b){
  let different=a.length^b.length;
  for(let i=0;i<Math.max(a.length,b.length);i++)different|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return different===0;
}
function legacyLoginError(reason,status=401){
  // Transitional staging error. The original game's error.php template remains to be ported.
  const response=new Response("原版账号验证失败："+reason,{status,headers:{"content-type":"text/plain;charset=utf-8","cache-control":"no-store"}});
  return response;
}
async function handleOriginalLogin(request,env){
  if(!env.LEGACY_DB)return legacyLoginError("原版账号数据库未配置",503);
  const type=request.headers.get("content-type")||"";
  if(!type.startsWith("application/x-www-form-urlencoded"))return legacyLoginError("不支持的提交类型",415);
  if(Number(request.headers.get("content-length")||"0")>8192)return legacyLoginError("提交内容过长",413);
  const raw=await request.text();
  if(raw.length>8192)return legacyLoginError("提交内容过长",413);
  const form=new URLSearchParams(raw);
  if(form.get("mode")==="quit"){
    const h=new Headers({location:"index.php","cache-control":"no-store"});
    h.append("set-cookie","bra_user=; Path=/; Max-Age=0; Secure; SameSite=Lax");
    h.append("set-cookie","bra_pass=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax");
    return new Response(null,{status:303,headers:h});
  }
  const username=form.get("username")??"",password=form.get("password")??"";
  if(!username||!password)return legacyLoginError("用户名或密码为空");
  if([...username].length>15||/[\s?+'|,<>&;#"]|\p{C}/u.test(username))return legacyLoginError("用户名不合法");
  if([...password].length>24)return legacyLoginError("密码过长");
  const account=await env.LEGACY_DB.prepare("SELECT username,password,groupid,roomid FROM legacy_users WHERE username = ? LIMIT 1").bind(username).first();
  if(!account)return legacyLoginError("用户不存在");
  if(Number(account.groupid)<=0)return legacyLoginError("账户已禁用",403);
  const cookiePassword=legacyMd5Bytes(password),stored=legacyMd5Bytes(account.username+cookiePassword);
  if(!legacyEqualDigest(stored,account.password)&&!legacyEqualDigest(cookiePassword,account.password))return legacyLoginError("密码错误");
  const now=Date.now(),expiry=new Date(now+15*86400000).toUTCString();
  await env.LEGACY_DB.prepare("UPDATE legacy_users SET lastvisit = ?,roomid = 0 WHERE username = ?").bind(Math.floor(now/1000),account.username).run();
  const headers=new Headers({location:"index.php","cache-control":"no-store"});
  headers.append("set-cookie","bra_user="+encodeURIComponent(account.username)+"; Path=/; Expires="+expiry+"; Secure; SameSite=Lax");
  headers.append("set-cookie","bra_pass="+cookiePassword+"; Path=/; Expires="+expiry+"; Secure; HttpOnly; SameSite=Lax");
  return new Response(null,{status:303,headers});
}
