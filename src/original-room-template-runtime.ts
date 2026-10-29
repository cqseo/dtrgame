import {phpTruthy,phpString,phpBinary,phpOffset,phpNumber, type TemplateContext,type TemplateConstants,type TemplateReadAsset} from './original-template-runtime';
import {originalRoomVariable,type OriginalWaitingRoom} from './original-room-state';
import {originalRoomTypes} from './generated/original-room-types';
export {phpTruthy,phpString,phpBinary,phpOffset,phpNumber};
export type OriginalTemplateContext=TemplateContext;
export type OriginalTemplateConstants=TemplateConstants;
export type OriginalTemplateReadAsset=TemplateReadAsset;
export type OriginalTemplateSet=Record<string,(v:TemplateContext,c:TemplateConstants,r:TemplateReadAsset,t:OriginalTemplateSet)=>string>;
export function phpIterable(value:unknown):[string|number,unknown][] {
  if(value===null||typeof value!=='object')return [];
  return Object.entries(value).map(([k,v])=>[/^(0|[1-9]\d*)$/.test(k)?Number(k):k,v]);
}
function room(value:unknown):OriginalWaitingRoom {
  if(!value||typeof value!=='object'||!('roomtype' in value)||!('player' in value))throw new Error('Missing room template context');
  return value as OriginalWaitingRoom;
}
const clubTips=['称号固定为解离攻坚','可任意选择一个称号','称号固定为走路萌物'];
const debuffTips=['','等级上限-100','全息幻象受到伤害-15%','杏仁豆腐、黑幕、真职人、电波幽灵受到伤害-15%','初始体力上限-200','初始生命上限-50','陷阱遭遇率+20%','商店物品售价+25%','初始生命上限-50','使用命体回复道具效果-30%','受到最终伤害+10%','记忆上限-20','开局金钱-1000元','开局5分钟内攻击无法获得熟练度','开局获得一个诅咒道具','数据碎片造成伤害+25%','受伤或受到异常状态20秒内无法去除','视野上限-4','受伤或受到异常状态时-10生命上限','受到最终伤害+10%','开局进入连斗','受到最终伤害+15%','开局获得一个诅咒道具','无法使用干扰设备，使用探测仪器极大概率失败','无法使用视野和记忆','剧情BOSS和英灵殿NPC造成的伤害+25%','无法装备身体防具','物品/角色发现率-20%','抹消基础失效率变为10%','控伤基础失效率变为15%','先制率-20%，命中率-20%'];
export function roomTemplateDynamicCall(name:unknown,args:unknown[],v:TemplateContext,c:TemplateConstants,r:TemplateReadAsset,t:OriginalTemplateSet):unknown {
  if(name!=='get_instance3_debuff_tips')throw new Error('Unported dynamic template function');
  const level=Math.trunc(phpNumber(args[0]));
  let text=phpString(clubTips[Math.floor(Math.max(level-1,0)/10)])+'<br>';
  for(let i=1;i<=level;i++)text+=phpString(debuffTips[i])+'<br>';
  return text;
}
function bubbleContext(style: string):TemplateContext {
  const props:Record<string,string|number>={id:'',height:100,width:100,'z-index-base':10,'offset-x':0,'offset-y':0,opacity:0.95,cancellable:0,'change-to':'','scroll-bar':0,'border-width-x':5,'border-width-y':5,'margin-top':8,'margin-bottom':8,'margin-left':8,'margin-right':4};
  for(const field of style.split(';')) {const i=field.indexOf(':');if(i<0)continue;const key=field.slice(0,i).trim();if(Object.hasOwn(props,key))props[key]=field.slice(i+1).replace(/:/g,'').trim();}
  const v:TemplateContext={};for(const [k,value]of Object.entries(props))v['bbox_'+k.replace(/-/g,'_')]=value;
  const num=(k:string)=>phpNumber(props[k]), h=num('height'),w=num('width'),mx=num('margin-left')+num('margin-right'),my=num('margin-top')+num('margin-bottom'),bx=num('border-width-x')*2,by=num('border-width-y')*2;
  for(const [prefix,x,y]of [['bbox_positioner_inner',w+bx+mx,h+by+my],['bbox_screen_fader_inner',w+mx,h+my]] as const){
    v[prefix+'_margin_top']=num('offset-y')-Math.ceil(y/2);v[prefix+'_margin_left']=num('offset-x')-Math.ceil(x/2);
    v[prefix+'_min_width']=v[prefix+'_max_width']=x;v[prefix+'_min_height']=v[prefix+'_max_height']=y;
  }
  v.bubblebox_container_min_height=v.bubblebox_container_max_height=h+my;
  return v;
}
export function roomTemplateCall(name:string,args:unknown[],v:TemplateContext,c:TemplateConstants,read:TemplateReadAsset,templates:OriginalTemplateSet):unknown {
  switch(name){
    case 'defined':return Object.hasOwn(c,phpString(args[0]));
    case 'file_get_contents':return read(phpString(args[0]));
    case 'time':return v.__renderNow ?? Math.floor(Date.now()/1000);
    case 'is_array':return args[0]!==null&&typeof args[0]==='object';
    case 'count':return phpIterable(args[0]).length;
    case 'in_array':return phpIterable(args[1]).some(([,item])=>phpBinary('==',args[0],item));
    case 'floor':return Math.floor(phpNumber(args[0]));
    case 'round':{const n=phpNumber(args[0]),factor=10**phpNumber(args[1]);return Math.sign(n)*Math.round(Math.abs(n)*factor)/factor;}
    case 'substr':{const str=phpString(args[0]),start=Math.trunc(phpNumber(args[1]));return args.length<3?str.slice(start):str.slice(start,start+Math.trunc(phpNumber(args[2])));}
    case 'str_replace':return phpString(args[2]).split(phpString(args[0])).join(phpString(args[1]));
    case 'range':{const start=Math.trunc(phpNumber(args[0])),end=Math.trunc(phpNumber(args[1])),step=start<=end?1:-1;if(Math.abs(end-start)>10000)throw new Error('Template range too large');return Array.from({length:Math.abs(end-start)+1},(_,i)=>start+i*step);}
    case 'room_check_subroom':return phpTruthy(args[0])&&phpString(args[0]).startsWith('s');
    case 'room_prefix2id':return phpString(args[0]).startsWith('s')?Math.trunc(phpNumber(phpString(args[0]).slice(1))):0;
    case 'room_get_vars':return originalRoomVariable(room(args[0]),phpString(args[1]),originalRoomTypes);
    case 'room_creater_check':return phpBinary('==',args[0],0);
    case 'room_team_leader_check':return phpOffset(originalRoomVariable(room(args[0]),'leader-position',originalRoomTypes),args[1]);
    case 'function_exists':return args[0]==='get_instance3_debuff_tips';
    case 'check_room_available':{
      const t=args[0] as Record<string,unknown>,now=phpNumber(v.__renderNow ?? v.now ?? Math.floor(Date.now()/1000));
      return phpTruthy(t.available)&&(!phpTruthy(t['available-start'])||now>=phpNumber(t['available-start']))&&(!phpTruthy(t['available-end'])||now<=phpNumber(t['available-end']))&&(!phpTruthy(t['req-mod'])||Object.hasOwn(c,'MOD_'+phpString(t['req-mod']).toUpperCase()));
    }
    case 'bubblebox_start':return templates.bubblebox_start!(bubbleContext(phpString(args[0])),c,read,templates);
    case 'bubblebox_end':return templates.bubblebox_end!({},c,read,templates);
  }
  throw new Error('Unported room template function: '+name);
}
