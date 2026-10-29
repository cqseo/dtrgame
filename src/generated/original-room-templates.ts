// Generated from PHP template compiler output.
import { phpTruthy,phpString,phpBinary,phpOffset,phpNumber,phpIterable,roomTemplateCall,roomTemplateDynamicCall } from "../original-room-template-runtime";
import type { OriginalTemplateContext,OriginalTemplateConstants,OriginalTemplateReadAsset,OriginalTemplateSet } from "../original-room-template-runtime";

// templates/default/header.htm SHA256 3f76e472b94d0e2f95f02feb2c202280191e912b0174b35378c245549c2f7572
function render_header(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">\n<html>\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=";
out+=phpString(v["charset"]);
out+="\">\n<meta http-equiv=\"pragma\" content=\"no-cache\">\n<meta http-equiv='expires' content='0'>\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n<title> ";
out+=phpString(v["gtitle"]);
out+=" </title>";
if(phpTruthy((v["extrahead"] != null))){
out+=phpString(v["extrahead"]);
}
out+="<link rel=\"icon\" href=\"favicon.ico\"><!-- 32×32 -->\n<link rel=\"apple-touch-icon\" href=\"apple-touch-icon.png\"><!-- 180×180 -->\n<link rel=\"manifest\" href=\"site.webmanifest\">\n\n<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_1.20240331.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_card.20240207.css\">";
if(phpTruthy((phpTruthy(phpBinary("==",v["u_templateid"],2)) || phpTruthy(roomTemplateCall("defined",["IN_REPLAY"],v,constants,readAssetText,templates))))){
out+="<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_2.20240311.css\">";
}
out+="<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_buttons.20240219.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_glowbuttons.20230807.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/dts-mobile.20261027.css?v=20261027-batch\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_bubblebox.20240223.css\">";
if(phpTruthy(phpBinary("==",constants["CURSCRIPT"],"messages"))){
out+="<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_messages.20230712.css\">";
}
if(phpTruthy(phpBinary("==",constants["CURSCRIPT"],"user_profile"))){
out+="<link rel=\"stylesheet\" type=\"text/css\" href=\"gamedata/css/style_ach.20230901.css\">";
}
out+="<!-- jScrollPanel Utility Start -->\n<!--<link type=\"text/css\" href=\"include/javascript/jScrollPane/jquery.jscrollpane.css\" rel=\"stylesheet\" media=\"all\" />\n<link type=\"text/css\" href=\"include/javascript/jScrollPane/jquery.jscrollpane.lozenge.css\" rel=\"stylesheet\" media=\"all\" />\n<script type=\"text/javascript\" src=\"include/javascript/jScrollPane/jquery.mousewheel.js\"></script>\n<script type=\"text/javascript\" src=\"include/javascript/jScrollPane/mwheelIntent.js\"></script>\n<script type=\"text/javascript\" src=\"include/javascript/jScrollPane/jquery.jscrollpane.js\"></script>-->\n\n<script type=\"text/javascript\" src=\"include/javascript/jquery-1.12.4.min.js\"></script>\n<script type=\"text/javascript\" id=\"sourcecode\">\njQuery.noConflict();\n</script>\n<!-- jScrollPanel Utility End -->\n\n<script type=\"text/javascript\" src=\"include/javascript/common.20240301.js?v=20261027-batch\"></script>\n<script type=\"text/javascript\" src=\"include/javascript/game.20240318.js?ux=20261027-batch\"></script>";
if(phpTruthy((phpTruthy(phpBinary("==",v["u_templateid"],2)) || phpTruthy(roomTemplateCall("defined",["IN_REPLAY"],v,constants,readAssetText,templates))))){
out+="<script type=\"text/javascript\" src=\"include/javascript/interface_2.20230924.js\"></script>";
}
out+="<!-- gzip Decode Utility Start -->\n<script type=\"text/javascript\" src=\"include/javascript/gzip.util.js\"></script>\n<!-- gzip Decode Utility End -->\n\n<!-- Game Word Data Lib Start -->";

if(phpTruthy(v["___MOD_CODE_ADV3"])){
out+="<script type=\"text/javascript\" src=";
void ((v["___TEMP_curdatalibname"]=roomTemplateCall("file_get_contents",[phpBinary(".",constants["GAME_ROOT"],"./gamedata/javascript/datalib.current.txt")],v,constants,readAssetText,templates)));
out+=phpString(phpBinary(".",phpBinary(".","\"gamedata/javascript/",v["___TEMP_curdatalibname"]),"\""));
out+="></script>";
}
out+="<!-- Game Word Data Lib End -->\n\n<!-- jQuery Load Script Utility -->\n<script type=\"text/javascript\" src=\"include/javascript/jquery.cachedScript.js\"></script>\n<!-- jQuery Load Script Utility End -->\n\n</head>\n<BODY ";
if(phpTruthy(phpBinary("==",constants["CURSCRIPT"],"game"))){
out+="onkeyup=\"hotkey(event);\"";
if(phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(v["gamestate"]))) && phpTruthy(phpBinary(">=",v["gamestate"],40))))){
out+="style=\"background-image:url('img/PB2.gif');\"";
}
}
out+=">\n<div class=\"title\" > ";
out+=phpString(v["gtitle"]);
out+=" ";
if(phpTruthy(phpBinary("==",v["u_templateid"],2))){
out+="TEST INTERFACE";
}
out+="</div><div class=\"headerlink\" >\n<a href=\"index.php\">>>首页</a>";
if(phpTruthy((phpTruthy((v["cuser"] != null)) && phpTruthy((v["cpass"] != null))))){
out+="<a href=\"messages.php\">>>站内邮件";
if(phpTruthy(!phpTruthy(!phpTruthy(v["new_messages"])))){
out+="<span class=\"L5 b\">NEW!</span>";
}
out+="</a>\n<a href=\"user_profile.php\">>>帐号资料</a>";
}else{
out+="<a href=\"register.php\">>>账号注册</a>";
}
out+="<a href=\"game.php\">>>进入游戏</a>\n<a href=\"map.php\">>>战场地图</a>\n<a href=\"news.php\">>>进行状况</a>\n<a href=\"alive.php\">>>当前幸存</a>\n<a href=\"winner.php\">>>历史优胜</a>\n<a href=\"rank.php\">>>玩家排行</a>\n<a href=\"help.php\">>>游戏帮助</a>\n<a href=\"logistics.php\">>>刺激市场</a>\n<a href=\"admin.php\">>>游戏管理</a>\n<a href=\"";
out+=phpString(v["bbsurl"]);
out+="\" target=\"_blank\">>>官方讨论区</a>\n<a href=\"";
out+=phpString(v["homepage"]);
out+="\" target=\"_blank\">>>官方网站</a>\n<!--[if lt IE 7]> <div style=' clear: both; height: 59px; padding:0 0 0 15px; position: relative;'> <a href=\"http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode\"><img src=\"http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0027_Simplified Chinese.jpg\" border=\"0\" height=\"42\" width=\"820\" alt=\"You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today.\" /></a></div> <![endif]-->\n\n</div><div id=\"fmsgbox-container\"></div><div id=\"hidden-fmsgbox-container\" style=\"display:none;\"></div><div id=\"hidden-persistent-fmsgbox-container\"></div><div style=\"text-align:center\">\n";
return out;
}

// templates/default/footer.htm SHA256 89d1521b8248d1e90999fffd6dd741c52da1782cb7ffe30d5d4e52237f0d46e3
function render_footer(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+="<!-- 悬浮提示功能 -->\r\n<div id=\"hoverHintMsg\">\r\n<div id=\"hoverHintMsgInner\" class=\"noselect\">\r\n</div>\r\n</div>\r\n<script>\r\nfloating_hint();\r\n</script>";
void ((v["noclick"]=(phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(v["page"]))) && phpTruthy(phpBinary("==","command_game",v["page"]))))?1:0)));
out+="<div style=\"width:100%;position:relative;\">\r\n<div><hr></div>";
if(phpTruthy(v["noclick"])){
out+="<div style=\"position:absolute;width:100%;height:75px;z-index:5\"></div>";
}
out+="<div style=\"float:left;text-align:left\">\r\n<div>\r\n<a href=\"http://en.wikipedia.org/wiki/Wikipedia:CC-BY-SA\"><img src=\"img/cc-by-sa.png\" style=\"width:96px;height:32px;\"></a>\r\n</div><div id=\"copyright\">\r\n<span>ACFUN大逃杀、电波大逃杀或常磐大逃杀之源代码遵循 <a class=\"evergreen b\" href=\"http://en.wikipedia.org/wiki/Wikipedia:CC-BY-SA\">知识共享 署名-相同方式共享 3.0协议</a>；<br>\r\n游戏背景、剧情及原创角色设定遵循 <b class=\"evergreen b\">知识共享 署名-非商业性使用-相同方式共享 3.0协议</b>。<br></span>\r\n</div>\r\n</div><div style=\"float:right;text-align:right\">\r\n<div>\r\n<span class=\"b\">感谢所有为这个游戏做出贡献的人！</span><br><br>";
if(phpTruthy(!phpTruthy(v["noclick"]))){
out+="<a class=\"evergreen b\" href=\"donate.php\">>>>ACFUN大逃杀的历史及捐助页面<<<</a>";
}
out+="</div>";
if(phpTruthy(!phpTruthy(v["noclick"]))){
out+="<div id=\"credits1\">\r\n<a onclick=\"$('credits1').style.display='none';$('credits2').style.display='block';\">>>>点此展开 常磐大逃杀电波版 制作者及鸣谢列表<<<</a>\r\n</div><div id=\"credits2\" class=\"ver\" style=\"display:none\">\r";
out+=phpString(v["gamecredits"]);
out+="</div>\r\n<br>";
}
out+="<div style=\"float: right;width:80px;clear:right;\">\r\n<!-- Histats.com  START  (standard)-->\r\n<script type=\"text/javascript\">document.write(unescape(\"%3Cscript src=%27http://s10.histats.com/js15_gif.js%27 type=%27text/javascript%27%3E%3C/script%3E\"));</script>\r\n<a href=\"http://www.histats.com\" target=\"_blank\" title=\"site hit counter\" >\r\n<script  type=\"text/javascript\" >\r\ntry {Histats.startgif(1,1323746,4,10043,\"\");\r\nHistats.track_hits();} catch(err){};\r\n</script>\r\n</a>\r\n<noscript>\r\n<a href=\"http://www.histats.com\" alt=\"site hit counter\" target=\"_blank\" ><div id=\"histatsC\"><img border=\"0\" src=\"http://s4is.histats.com/stats/i/1323746.gif?1323746&amp;103\"></div></a>\r\n</noscript>\r\n<!-- Histats.com  END  -->\r\n</div>\r\n</div><div id=\"error\" style=\"float:left;text-align:left;clear:left;\">\r";
out+=phpString(v["error"]);
out+="</div>\r\n\r\n</div>\r\n</body>\r\n</html>";
return out;
}

// templates/default/index.htm SHA256 dede059373f4ea158393cadfe9c5bcf43ca3eb41390cd50c5f7d09339c7bd436
function render_index(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+=templates["header"]!(v,constants,readAssetText,templates);
out+="<table align=\"center\" style=\"text-align:center;border:0;padding:0;\">\n<tr>\n<td><span class=\"yellow b\">游戏版本：</span></td>\n<td style=\"text-align:left;\"><span class=\"evergreen b\">";
out+=phpString(v["gameversion"]);
out+="</span></td>\n<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>\n<td style=\"text-align:center;padding:0 0 0 25px;\"><span class=\"yellow b\">站长留言</span></td>\n</tr>\n<tr>\n<td><span class=\"yellow b\">当前时刻：</span></td>\n<td style=\"text-align:left;\"><span class=\"evergreen b\">";
out+=phpString(v["month"]);
out+="月";
out+=phpString(v["day"]);
out+="日 星期";
out+=phpString(phpOffset(v["week"],(phpString(v["wday"]))));
out+=" ";
out+=phpString(v["hour"]);
out+=":";
out+=phpString(v["min"]);
out+="</span></td>\n<td></td>\n<td rowspan=\"3\" style=\"width:520px; height:100%; vertical-align:top;text-align:left;\">\n<span class=\"evergreen b\">";
out+=phpString(v["adminmsg"]);
out+="</span>\t\t\n</td>\n</tr>\n<tr>\n<td><span class=\"yellow b\">系统状况：</span></td>\n<td style=\"text-align:left;\"><span class=\"evergreen b\">";
out+=phpString(v["systemmsg"]);
out+="</span></td>\n<td></td>\n</tr>\n<tr>\n<td><span class=\"yellow b\">游戏情报：</span></td>\n<td style=\"text-align:left;\">\n<span class=\"evergreen b\">\n<span class=\"evergreen2\">";
if(phpTruthy(roomTemplateCall("room_check_subroom",[v["room_prefix"]],v,constants,readAssetText,templates))){
out+="<span class=\"yellow b\">";
out+=phpString(phpBinary(".",phpBinary(".","房间&nbsp;",roomTemplateCall("room_prefix2id",[v["room_prefix"]],v,constants,readAssetText,templates)),"&nbsp;"));
out+="</span>";
}else{
out+="第 ";
out+=phpString(v["gamenum"]);
out+=" 回游戏 ";
}
if(phpTruthy(v["gametype"])){
out+=phpString(phpOffset(v["gtinfo"],v["gametype"]));
}
out+=" ";
if(phpTruthy(phpBinary("!=",v["gametype"],17))){
out+=phpString(phpOffset(v["gstate"],v["gamestate"]));
}
out+="</span>\n</span>\n</td>\n<td></td>\n\n</tr>\n<tr>\n<td colspan=\"2\" style=\"vertical-align:top;\">\n<div>";
if(phpTruthy(phpBinary(">",v["gamestate"],10))){
out+="本局游戏已经进行  <span id=\"timing\"></span><script type=\"text/javascript\">updateTime('timing',";
out+=phpString(v["timing"]);
out+=",1,1000,'hh:mm:ss');</script><br> ";
if(phpTruthy(v["hplayer"])){
out+="当前最高伤害 ";
out+=phpString(v["hplayer"]);
out+=" (";
out+=phpString(v["hdamage"]);
out+=")<br>";
}
}else{
if(phpTruthy(phpBinary(">",v["starttime"],v["now"]))){
out+="下局游戏开始于  <span id=\"timing\"></span><script type=\"text/javascript\">updateTime('timing',";
out+=phpString(v["timing"]);
out+=",0,1000,'hh:mm:ss');</script>   后<br>";
}else{
out+="下局游戏开始时间  <span id=\"timing\"></span>未定<br>";
}
if(phpTruthy(v["hplayer"])){
out+="上局最高伤害 ";
out+=phpString(v["hplayer"]);
out+=" (";
out+=phpString(v["hdamage"]);
out+=")<br>";
}
}
out+="</div><div>";
if(phpTruthy(!phpTruthy(roomTemplateCall("room_check_subroom",[v["room_prefix"]],v,constants,readAssetText,templates)))){
out+="上局结果：<span id=\"lastwin\">";
out+=phpString(phpOffset(v["gwin"],v["winmode"]));
out+="</span>";
if(phpTruthy(v["winner"])){
out+="，优胜者：<span id=\"lastwinner\">";
out+=phpString(v["winner"]);
out+="</span>";
}
}
out+="</div>";
if(phpTruthy(phpBinary("==",v["gamestate"],0))){
out+="<div style=\"margin:8px 0;padding:8px 10px;background:#2b2632;border:1px solid #735979;border-radius:5px;color:#ecdaf3;line-height:1.7;\">\n当前房间没有正在进行的对局。以下是游戏内保存的历史状态快照，<strong>不能当成上一局最终禁区数或死亡人数</strong>；最终胜负请以结算页面和优胜记录为准。\n</div>\n禁区间隔：";
out+=phpString(v["areaintv"]);
out+=" 分钟；每次增加：";
out+=phpString(v["areaadd"]);
out+=" 个<br>\n历史禁区快照：";
out+=phpString(v["areanum　历史死亡快照："]);
out+=phpString(v["deathnum"]);
out+="<br>";
}else{
out+="禁区间隔时间： ";
out+=phpString(v["areaintv"]);
out+=" 分钟 ， ";
out+=phpString(v["arealimit"]);
out+=" 禁后停止激活<br>\n每次增加禁区： ";
out+=phpString(v["areaadd"]);
out+=" 个 ， 当前禁区数： ";
out+=phpString(v["areanum"]);
out+="<br>\n自动逃避禁区功能：";
if(phpTruthy((phpTruthy(v["areaesc"]) && phpTruthy(phpBinary("<",v["gamestate"],40))))){
out+="<span class=\"yellow b\">开放</span>";
}else{
out+="<span class=\"red b\">关闭</span>";
}
out+="<br>\n<span class=\"red b\">注意：进入连斗后，自动逃避功能自动关闭。</span><br><br>\n激活人数：<span id=\"validnum\">";
out+=phpString(v["validnum"]);
out+="</span>\n生存人数：<span id=\"alivenum\">";
out+=phpString(v["alivenum"]);
out+="</span>\n死亡总数：<span id=\"deathnum\">";
out+=phpString(v["deathnum"]);
out+="</span>";
}
out+="<br />";
if(phpTruthy(v["cuser"])){
out+="<br />欢迎你，";
out+=phpString(v["cuser"]);
out+="！\n<form method=\"post\" name=\"togame\" action=\"game.php\">\n<input type=\"hidden\" name=\"mode\" value=\"main\">\n<input type=\"submit\" name=\"enter\" value=\"进入游戏\">\n</form>\n\n<form method=\"post\" name=\"quitgame\" action=\"game.php\">\n<input type=\"hidden\" name=\"mode\" value=\"quit\">\n<input type=\"submit\" name=\"quit\" value=\"账号退出\">\n</form>";
}else{
out+="<form method=\"post\" name=\"login\" action=\"login.php\">\n<input type=\"hidden\" name=\"mode\" value=\"main\">\n账号<input type=\"text\" name=\"username\" size=\"20\" maxlength=\"20\" value=\"";
out+=phpString(v["cuser"]);
out+="\">\n密码<input type=\"password\" name=\"password\" size=\"20\" maxlength=\"24\" autocomplete=\"current-password\">\n<input type=\"submit\" name=\"enter\" value=\"登录\">\n                <div style=\"font-size:12px;color:#c3d3df;margin-top:7px;\">忘记密码？可使用已保存的账号恢复码前往 <a href=\"recovery.php\">密码恢复页面</a> 自助重置；没有恢复码的旧账号仍需管理员核验。</div>\n</form>";
}
out+="</td>\n<td></td>\n<td rowspan=\"2\" style=\"width:400px; vertical-align:top;text-align:left;\">";
out+=templates["roomlist"]!(v,constants,readAssetText,templates);
out+="<div>\n<span class=\"evergreen\" style=\"font-size:16px;line-height:32px;\">如果你是新玩家，请先体验<a href=\"roomcmd.php?command=newroom&amp;para1=7\" class=\"red b\" style=\"font-size:16px;\"> 教程模式 </a>！\n也可在<a href=\"roomcmd.php?command=newroom&amp;para1=13\" class=\"lightblue b\" style=\"font-size:16px;\"> 蹲站模式 </a>获得别样乐趣！\n</span>\n</div>\n</td>\n</tr>\n</table>";
out+=templates["footer"]!(v,constants,readAssetText,templates);
return out;
}

// templates/default/room.htm SHA256 db8733e29893085b8223079557915bdc4b9e0870e4343130e0db71a512dd35bd
function render_room(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+=phpString(roomTemplateCall("bubblebox_start",["id:persistent-roommain;height:460;width:740;scroll-bar:0;"],v,constants,readAssetText,templates));
out+="<div id=\"roommain\">\n</div><div id=\"roomchatarea\">\n<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td valign=\"top\" style=\"text-align: left\" height=\"1px\" colspan=5>\n<div class=\"b3\" style=\"margin-left:22px; margin-right:22px; text-align:left;\">";
if(phpTruthy(roomTemplateCall("in_array",[Math.trunc(phpNumber(phpOffset(v["roomdata"],"roomtype"))),[0,1,2,3,4,14]],v,constants,readAssetText,templates))){
out+="            <span class=\"red b\" style=\"line-height:20px; \">系统提示: PVP房间严禁挂机/多账号/假赛，违者一律封号一周处理。</span>\n            ";
}else{
out+="            <span class=\"grey b\" style=\"line-height:20px;\">提示：本模式的目标与规则请查看房间设置和帮助说明。</span>\n            ";
}
out+="</div><div style=\"margin-left:22px; margin-right:22px; background-color:rgba(17,17,17,0.5); *BACKGROUND:rgb(17,17,17); *filter:alpha(opacity=50); BORDER: #000 0px none; color: #fff; text-align: center; border-right: #111 1px solid;font:10pt '微软雅黑' serif;\">\n<div id=\"chatlist\" class=\"chatlist\" >\n<div id=\"chatlist-content\" class=\"gscroll\" style=\"width:100%; height:120px; max-height:120px; overflow:auto;\">\n<p id=\"chatdata-text\" style=\"margin:0 0 0 0; text-align:left; line-height:20px;\">\n</p>\n</div>\n</div>\n</div> \n</td>\n</tr>\n<tr>\n<td height=\"5\" colspan=5>\n<div class=\"b3\" style=\"margin-left:22px; margin-right:22px; height:5px;\"></div>\n</td>\n</tr>\n<tr>\n<td height=\"35\" colspan=5>\n<div class=\"b3\" style=\"margin-left:22px; margin-right:22px;\">\n<form type=\"post\" id=\"sendchat\" name=\"sendchat\" action=\"chat.php\" onsubmit=\"$('command').value='newchat';$('para1').value=$('chatmsg').value; $('chatmsg').value=''; postCmd('roomcmd','roomcmd.php');return false;\" >\n<input type=\"text\" id=\"chatmsg\" name=\"chatmsg\" maxlength=\"60\" style=\"width:450px\">\n<button type=\"button\" onClick=\"$('command').value='newchat';$('para1').value=$('chatmsg').value; $('chatmsg').value=''; postCmd('roomcmd','roomcmd.php');return false;\">发送</button>\n</form>\n</div>\n</td>\n</tr>\n<tr></tr>\n</table>\n<br>\n<div style=\"float:right;text-align:right;\">\n<span class=\"grey b\">房间编号:&nbsp;</span><span><span class=\"grey b\">";
out+=phpString(v["room_prefix"]);
out+="</span></span>&nbsp;&nbsp;\n<span class=\"grey b\">服务器连接状态:&nbsp;</span><span id=\"connect-status-text\"><span class=\"grey b\">正在连接..</span></span><br>\n<br>\n</div>\n</div>\n<form method=\"post\" id=\"roomcmd\" name=\"roomcmd\" style=\"display:none;\">\n<input type=\"hidden\" id=\"timestamp\" name=\"timestamp\" value=\"0\"> \n<input type=\"hidden\" id=\"command\" name=\"command\" value=\"\">\n<input type=\"hidden\" id=\"para1\" name=\"para1\" value=\"\">\n<input type=\"hidden\" id=\"para2\" name=\"para2\" value=\"\">\n<input type=\"hidden\" id=\"para3\" name=\"para3\" value=\"\">\n</form>";
out+=phpString(roomTemplateCall("bubblebox_end",[],v,constants,readAssetText,templates));
out+=templates["room_setmode"]!(v,constants,readAssetText,templates);
out+="<img style=\"display:none;\" type=\"hidden\" src=\"img/blank.png\" onload=\"bubblebox_show('persistent-roommain'); room_get_update(); \">\n";
return out;
}

// templates/default/roomlist.htm SHA256 c9b933c58a4701b3f3e7ec06b76b20a58d381773a13b5eb51a3814df00c3a7af
function render_roomlist(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+="<span class=\"evergreen b\">房间列表：</span><br>\n<span class=\"grey\" style=\"font-size:12px;line-height:1.6;\">下表显示各房间当前状态；房间号可能重复使用，不代表同一局。正在游戏中的房间与等待中的房间操作不同。</span><br>\n<div style=\"height:5px;\">&nbsp;</div><div class=\"gscroll\" style=\"width:520px;max-height:300px;\"> ";
if(phpTruthy(phpBinary("==",roomTemplateCall("count",[v["shroomlist"]],v,constants,readAssetText,templates),0))){
out+="当前没有任何房间。";
if(phpTruthy((phpTruthy(v["cuser"]) && phpTruthy(v["cpass"])))){
out+="<input type=\"button\" onClick=\"bubblebox_show('persistent-newroombox');\" value=\"新建一个房间\">";
}
out+="<br>";
}else{
out+="<table CellSpacing=0 CellPadding=0>\n<tr>\n<td class=\"b1\" width=\"30px\">编号</td>\n<td class=\"b1\" width=\"80px\">游戏模式</td>\n<td class=\"b1\" width=\"60px\">状态</td>\n<td class=\"b1\" width=\"60px\">活跃人数</td>\n<td class=\"b1\" width=\"130px\">创建者/房主</td>\n<td class=\"b1\" width=\"100px\">运行时间</td>\n<td class=\"b1\" width=\"50px\">操作</td>\n</tr>";
if(phpTruthy(roomTemplateCall("is_array",[v["shroomlist"]],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(v["shroomlist"])){v["value"]=___value;
out+="<tr>\n<td class=\"b3\" height=\"30px\">";
out+=phpString(phpOffset(v["value"],"id"));
out+="</td>\n<td class=\"b3\">";
out+=phpString(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["value"],"roomtype")),"name"));
out+="</td>\n<td class=\"b3\">";
if(phpTruthy((phpTruthy(phpBinary(">=",phpOffset(v["value"],"status"),10)) && phpTruthy(phpBinary("<",phpOffset(v["value"],"status"),40))))){
out+="<span class=";
if(phpTruthy(phpBinary("==",phpOffset(v["value"],"nowplayer"),phpOffset(v["value"],"maxplayer")))){
out+="\"grey b\"";
}else{
out+="\"lime b\"";
}
out+=">等待中</span>";
}else{
out+="<span class=";
if(phpTruthy(phpBinary("==",phpOffset(v["value"],"gamestate"),20))){
out+="\"lime b\"";
}else{
out+="\"grey b\"";
}
out+=">";
out+=phpString(phpOffset(v["gstate"],phpOffset(v["value"],"gamestate")));
out+="</span>";
}
out+="</td>\n<td class=\"b3\">";
if(phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["value"],"roomtype")),"without-ready"))){
if(phpTruthy(!phpTruthy(phpOffset(v["value"],"nowplayer")))){
out+="<span class=\"grey b\">";
}else{
out+="<span class=\"white b\">";
}
out+=phpString(phpOffset(v["value"],"nowplayer"));
}else{
if(phpTruthy((phpTruthy(phpBinary(">=",phpOffset(v["value"],"status"),10)) && phpTruthy(phpBinary("<",phpOffset(v["value"],"status"),40))))){
if(phpTruthy(phpBinary("==",phpOffset(v["value"],"nowplayer"),phpOffset(v["value"],"maxplayer")))){
out+="<span class=\"grey b\">";
}else{
if(phpTruthy(phpBinary("==",phpBinary("+",phpOffset(v["value"],"nowplayer"),1),phpOffset(v["value"],"maxplayer")))){
out+="<span class=\"red b\" style=\"color:#ff0022;\">";
}else{
if(phpTruthy(phpBinary("==",phpBinary("+",phpOffset(v["value"],"nowplayer"),2),phpOffset(v["value"],"maxplayer")))){
out+="<span class=\"yellow b\">";
}else{
out+="<span class=\"white b\">";
}
}
}
out+=phpString(phpOffset(v["value"],"nowplayer"));
out+="/";
out+=phpString(phpOffset(v["value"],"maxplayer"));
out+="</span>";
}else{
out+="<span class=\"grey b\">-</span>";
}
}
out+="</td>\n<td class=\"b3\">";
if(phpTruthy((phpTruthy(!phpTruthy(phpOffset(phpOffset(v["value"],"roomdata"),"roomfounder"))) || phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["value"],"roomtype")),"soleroom"))))){
out+="-";
}else{
out+=phpString(phpOffset(phpOffset(v["value"],"roomdata"),"roomfounder"));
}
if(phpTruthy((phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(phpOffset(v["value"],"roomdata"),"player"),"0"),"name")))) && phpTruthy(!phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["value"],"roomtype")),"soleroom"))))) && phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(phpOffset(v["value"],"roomdata"),"player"),"0"),"name"),phpOffset(phpOffset(v["value"],"roomdata"),"roomfounder")))))){
out+=" / ";
out+=phpString(phpOffset(phpOffset(phpOffset(phpOffset(v["value"],"roomdata"),"player"),"0"),"name"));
}
out+="</td>\n<td class=\"b3\">";
void ((v["t"]=phpOffset(v["value"],"runningtime")));
out+=phpString(phpBinary(".",phpBinary(".",(phpTruthy(phpBinary(">=",v["t"],3600))?phpBinary(".",roomTemplateCall("floor",[phpBinary("/",v["t"],3600)],v,constants,readAssetText,templates),"小时"):""),roomTemplateCall("floor",[phpBinary("/",phpBinary("%",v["t"],3600),60)],v,constants,readAssetText,templates)),"分钟"));
out+="</td>\n<td class=\"b3\">";
if(phpTruthy((phpTruthy(!phpTruthy(v["cuser"])) || phpTruthy(!phpTruthy(v["cpass"]))))){
out+="<span class=\"grey b\">-</span>";
}else{
if(phpTruthy(roomTemplateCall("room_check_subroom",[v["room_prefix"]],v,constants,readAssetText,templates))){
if(phpTruthy(phpBinary("==",phpOffset(v["value"],"id"),v["room_id"]))){
out+="<input type=\"button\" style=\"width:46px\" onclick=\"room_quit();\" value=\"退出\" />";
}else{
out+="<span class=\"grey b\">-</span>";
}
}else{
out+="<input type=\"button\" style=\"width:46px\" onclick=\"room_enter(";
out+=phpString(phpOffset(v["value"],"id"));
out+=");\" value=\"";
if(phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["value"],"roomtype")),"without-ready"))){
out+="进入";
}else{
if(phpTruthy((phpTruthy((phpTruthy((phpTruthy(phpBinary(">=",phpOffset(v["value"],"status"),10)) && phpTruthy(phpBinary("<",phpOffset(v["value"],"status"),40)))) && phpTruthy(phpBinary("<",phpOffset(v["value"],"nowplayer"),phpOffset(v["value"],"maxplayer"))))) || phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(phpOffset(v["value"],"validlist")))) && phpTruthy(roomTemplateCall("in_array",[v["cuser"],phpOffset(v["value"],"validlist")],v,constants,readAssetText,templates))))))){
out+="进入";
}else{
out+="旁观";
}
}
out+="\" />";
}
}
out+="</td>\n</tr>";
}
}
out+="</table>";
}
out+="</div><div style=\"height:5px;\">&nbsp;</div>";
if(phpTruthy((phpTruthy(!phpTruthy(v["cuser"])) || phpTruthy(!phpTruthy(v["cpass"]))))){
out+="你尚未登陆，请先登陆。";
}else{
if(phpTruthy(roomTemplateCall("room_check_subroom",[v["room_prefix"]],v,constants,readAssetText,templates))){
out+="你现在在房间";
out+=phpString(roomTemplateCall("room_prefix2id",[v["room_prefix"]],v,constants,readAssetText,templates));
out+=" 中。";
if(phpTruthy((phpTruthy((phpOffset(v["roomlist"],roomTemplateCall("substr",[v["room_prefix"],1],v,constants,readAssetText,templates)) != null)) && phpTruthy(phpBinary(">=",phpOffset(phpOffset(v["roomlist"],roomTemplateCall("substr",[v["room_prefix"],1],v,constants,readAssetText,templates)),"status"),40))))){
out+="这个房间正在游戏中，请进入游戏。<br>\n如果你在游戏中已阵亡，你也可以<input type=\"button\" style=\"width:80px\" onclick=\"room_quit();\" value=\"退出房间\" />然后加入其他房间。<br>";
}else{
out+="<br><br>";
out+=templates["room"]!(v,constants,readAssetText,templates);
}
}else{
out+="你不在任何一个房间中。<br>\n请选择一个房间进入，或<input type=\"button\" onClick=\"bubblebox_show('persistent-newroombox');\" value=\"新建一个房间\" />";
}
}
out+=templates["room_newroom"]!(v,constants,readAssetText,templates);
out+="<div style=\"height:5px;\">&nbsp;</div>";
return out;
}

// templates/default/roommain.htm SHA256 7cc42dc04edbafcc0eba3722de21f5f137918778121bc6162944f83eaf72de4d
function render_roommain(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
if(phpTruthy(phpBinary("!=",phpOffset(v["roomdata"],"readystat"),2))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=40px colspan=2>\n<span style=\"font-size:30px; line-height:40px;\">房间";
out+=phpString(v["room_id"]);
out+="&nbsp;-&nbsp; ";
out+=phpString(roomTemplateCall("room_get_vars",[v["roomdata"],"name"],v,constants,readAssetText,templates));
out+="</span>\n    <div style=\"font-size:12px;color:#c3dbe9;line-height:1.5;\">进入房间≠已入座；点击空座位后，等待全员到齐再准备。点击操作后请等反馈，不要重复提交。</div>";
if(phpTruthy(phpBinary("==",v["upos"],0))){
out+="<div style=\"position:absolute; top:14px; right: 120px;\">\n<div class=\"glow_buttons\" onclick=\"bubblebox_show('persistent-rmeditbox');\">修改模式</div>\n</div>";
}
out+="<div style=\"position:absolute; top:14px; right: 16px;\">\n<div class=\"glow_buttons red\" onclick=\"$('command').value='leave';postCmd('roomcmd','roomcmd.php');\">离开房间</div>\n</div>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=8px colspan=2>\n</td>\n</tr>\n<tr>\n<td width=515px>";
out+=templates["roomteam"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" width=85px>";
if(phpTruthy(roomTemplateCall("room_get_vars",[v["roomdata"],"without-ready"],v,constants,readAssetText,templates))){
if(phpTruthy(phpBinary("==",v["upos"],0))){
out+="<div class=\"glow_buttons h50 yellow\" onclick=\"$('command').value='start';postCmd('roomcmd','roomcmd.php');\">开始</div>";
}else{
out+="<div class=\"glow_buttons h50 grey forbidden\">开始</div>";
}
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"readystat"),1)) && phpTruthy(phpBinary(">=",v["upos"],0)))) && phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["upos"]),"ready")))))){
out+="<div class=\"glow_buttons h50 yellow\" onclick=\"$('command').value='ready';postCmd('roomcmd','roomcmd.php');\">准备</div>";
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"readystat"),1)) && phpTruthy(phpBinary(">=",v["upos"],0)))) && phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["upos"]),"ready"))))){
out+="<div class=\"glow_buttons h50 lime forbidden\">准备</div>";
}else{
out+="<div class=\"glow_buttons h50 grey forbidden\">准备</div>";
}
}
}
out+="</td>\n</tr>\n<tr>\n<td class=\"b3\" height=7px colspan=2>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=20px colspan=2>";
if(phpTruthy((phpTruthy(phpBinary(">",roomTemplateCall("room_get_vars",[v["roomdata"],"pnum"],v,constants,readAssetText,templates),2)) && phpTruthy((phpTruthy(roomTemplateCall("room_creater_check",[v["upos"]],v,constants,readAssetText,templates)) || phpTruthy(phpBinary("==",v["upos"],roomTemplateCall("room_team_leader_check",[v["roomdata"],v["upos"]],v,constants,readAssetText,templates)))))))){
out+="<div class=\"glow_buttons\" style=\"float:left;left:25px;width:90px;\" onclick=\"$('command').value='pos_disable';$('para1').value='all';postCmd('roomcmd','roomcmd.php');\">";
if(phpTruthy(roomTemplateCall("room_creater_check",[v["upos"]],v,constants,readAssetText,templates))){
out+="禁用所有空位";
}else{
out+="禁用本队空位";
}
out+="</div>";
}
if(phpTruthy((phpTruthy(phpBinary(">",v["upos"],0)) && phpTruthy(!phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),"0"),"name"))))))){
out+="<div style=\"margin:8px 4px;padding:9px 12px;background:#30251d;border:1px solid #e5a05b;border-radius:5px;color:#ffe8bb;text-align:left;\">\n房主连续5分钟不在等待大厅时，可由已入座玩家接管（房主在线时无法接管）。\n<input type=\"button\" class=\"cmdbutton\" value=\"接管离线房间\" style=\"margin-left:9px;\"\nonclick=\"$('command').value='takeover';postCmd('roomcmd','roomcmd.php');\" />\n</div>";
}
out+="<span style=\"20px\" id=\"room_banner\">";
if(phpTruthy(phpBinary("!=",phpOffset(v["roomdata"],"readystat"),1))){
if(phpTruthy(phpBinary("==",v["upos"],-phpNumber(1)))){
out+="<span class=\"yellow b\">请点击一个空位置以进入。</span>";
}else{
out+="当前房间尚未满员，暂不能准备或开始。等待其他玩家入座；点击空位置可换座位。房主换出0号位会交出房主权限。";
}
}else{
void ((v["kicktimeleft"]=phpBinary("+",phpBinary("-",phpOffset(v["roomdata"],"kicktime"),roomTemplateCall("time",[],v,constants,readAssetText,templates)),1)));
if(phpTruthy(phpBinary(">=",v["upos"],0))){
if(phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["upos"]),"ready")))){
out+="<span class=\"yellow b\">请点击“准备”按钮，<span id=\"roomkick_timer\">";
out+=phpString(v["kicktimeleft"]);
out+="</span>秒后没有准备的玩家将被自动踢出房间。</span>";
}else{
out+="请等待其他人准备，<span id=\"roomkick_timer\">";
out+=phpString(v["kicktimeleft"]);
out+="</span>秒后没有准备的玩家将被自动踢出房间。";
}
}else{
out+="<span id=\"roomkick_timer\">";
out+=phpString(v["kicktimeleft"]);
out+="</span>秒后没有准备的玩家将被自动踢出房间。";
}
}
out+="</span>\n</td>\n</tr>\n<tr>\n<td height=15px colspan=2>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" colspan=\"2\">";
if(phpTruthy(phpBinary("!==",null,roomTemplateCall("room_get_vars",[v["roomdata"],"game-option"],v,constants,readAssetText,templates)))){
void ((v["game_option"]=roomTemplateCall("room_get_vars",[v["roomdata"],"game-option"],v,constants,readAssetText,templates)));
if(phpTruthy(roomTemplateCall("is_array",[v["game_option"]],v,constants,readAssetText,templates))){
for(const [___key,___value] of phpIterable(v["game_option"])){v["gokey"]=___key;v["goval"]=___value;
out+="<div>\n<span class=\"white b\">";
out+=phpString(phpOffset(v["goval"],"title"));
out+="</span> ";
if(phpTruthy(phpBinary("==",phpOffset(v["goval"],"type"),"number"))){
void ((v["current_go"]=roomTemplateCall("room_get_vars",[v["roomdata"],"current_game_option"],v,constants,readAssetText,templates)));
void ((v["nval"]=Math.trunc(phpNumber(phpOffset(v["current_go"],v["gokey"])))));
out+="<input type=\"number\" name=\"";
out+=phpString(v["gokey"]);
out+="\" id=\"";
out+=phpString(v["gokey"]);
out+="\" value=\"";
out+=phpString(v["nval"]);
out+="\" min=\"";
out+=phpString(phpOffset(v["goval"],"min"));
out+="\" max=\"";
out+=phpString(phpOffset(v["goval"],"max"));
out+="\" style=\"width:50px\"";
if(phpTruthy(!phpTruthy(phpOffset(v["goval"],"tip-need-ok")))){
out+="onclick=\"$('command').value='game-option';$('para1').value='";
out+=phpString(v["gokey"]);
out+="';$('para2').value=document.getElementById('";
out+=phpString(v["gokey"]);
out+="').value;postCmd('roomcmd','roomcmd.php');\"";
}
out+=">";
if(phpTruthy(phpOffset(v["goval"],"tip-need-ok"))){
out+="&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"确认\" onclick=\"$('command').value='game-option';$('para1').value='";
out+=phpString(v["gokey"]);
out+="';$('para2').value=document.getElementById('";
out+=phpString(v["gokey"]);
out+="').value;postCmd('roomcmd','roomcmd.php');\">\n&nbsp;&nbsp;&nbsp;当前";
out+=phpString(phpOffset(v["goval"],"title"));
out+="已设置为<span class=\"yellow b\">";
out+=phpString(v["nval"]);
out+="</span>";
}
}else{
if(phpTruthy(roomTemplateCall("is_array",[phpOffset(v["goval"],"options")],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(phpOffset(v["goval"],"options"))){v["oval"]=___value;
out+="<input type=\"";
out+=phpString(phpOffset(v["goval"],"type"));
out+="\" name=\"";
out+=phpString(v["gokey"]);
out+="\" id=\"";
out+=phpString(v["gokey"]);
out+="_";
out+=phpString(phpOffset(v["oval"],"value"));
out+="\"\nonchange=\"$('command').value='game-option';$('para1').value='";
out+=phpString(v["gokey"]);
out+="';$('para2').value='";
out+=phpString(phpOffset(v["oval"],"value"));
out+="';postCmd('roomcmd','roomcmd.php');\"";
if(phpTruthy(phpBinary("==",phpOffset(v["oval"],"value"),phpOffset(phpOffset(v["roomdata"],"current_game_option"),v["gokey"])))){
out+="checked";
}
out+=">\n<a onclick=\"$('";
out+=phpString(v["gokey"]);
out+="_";
out+=phpString(phpOffset(v["oval"],"value"));
out+="').click();\" title=\"";
out+=phpString(phpOffset(v["oval"],"title"));
out+="\">";
out+=phpString(phpOffset(v["oval"],"name"));
out+="</a>&nbsp;&nbsp;&nbsp;";
}
}
}
if(phpTruthy((phpTruthy(!phpTruthy(!phpTruthy(phpOffset(v["goval"],"tip-function")))) && phpTruthy(roomTemplateCall("function_exists",[phpOffset(v["goval"],"tip-function")],v,constants,readAssetText,templates))))){
void ((v["tip_box_height"]=(phpTruthy(!phpTruthy(!phpTruthy(phpOffset(v["goval"],"tip-box-height"))))?phpOffset(v["goval"],"tip-box-height"):"50px")));
out+="<div class=\"gscroll\" style=\"padding:5px 0; text-align:center;overflow-x:hidden; overflow-y:auto;height:";
out+=phpString(v["tip_box_height"]);
out+="\">";
out+=phpString(roomTemplateDynamicCall(phpOffset(v["goval"],"tip-function"),[Math.trunc(phpNumber(phpOffset(roomTemplateCall("room_get_vars",[v["roomdata"],"current_game_option"],v,constants,readAssetText,templates),"lvl")))],v,constants,readAssetText,templates));
out+="</div>";
}
out+="</div>";
}
}
}
out+="</td>\n</tr>\n<tr>\n<td height=15px colspan=5>\n</td>\n</tr>\n</table>";
}else{
out+="<table CellSpacing=0 CellPadding=0 width=100% height=398px>\n<tr><td height=398px class=\"b3\">\n<span class=\"yellow b\">游戏即将开始，请等待几秒钟，页面将自动跳转至游戏界面<br>\n如果页面很久都没有跳转，请手动 <a href=\"game.php\">点击这里</a> 进入游戏<br></span>\n</td></tr></table>";
}
return out;
}

// templates/default/roomteam.htm SHA256 df50ec4a24d7927b1ce917ebe758712dc2405d6594e013481f7cfcf1b921b016
function render_roomteam(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
if(phpTruthy((phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),0)) || phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),14))))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=5px colspan=5>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=25px width=70px>\n</td>\n<td class=\"b3\" height=25px width=150px>\n<span style=\"color:#ff0022;\">红队</span>\n</td>\n<td class=\"b3\" height=25px width=70px>\n</td>\n<td class=\"b3\" height=25px width=150px>\n<span style=\"color:#5900ff;\">蓝队</span>\n</td>\n<td class=\"b3\" height=25px width=70px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=70px>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px width=70px>\n</td>";
void ((v["i"]=1));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px width=70px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=10px colspan=5>\n</td>\n</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),1))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#ff0022;\">红队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[0,4],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[0,4],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td class=\"b3\" id=\"room-position-";
out+=phpString(v["i"]);
out+="\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#5900ff;\">蓝队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[5,9],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[5,9],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),2))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#ff0022;\">红队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[0,4],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[0,4],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td class=\"b3\" id=\"room-position-";
out+=phpString(v["i"]);
out+="\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#5900ff;\">蓝队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[5,9],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[5,9],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#8cff00;\">绿队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[10,14],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[10,14],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),3))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#ff0022;\">红队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[0,4],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[0,4],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td class=\"b3\" id=\"room-position-";
out+=phpString(v["i"]);
out+="\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#5900ff;\">蓝队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[5,9],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[5,9],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#8cff00;\">绿队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[10,14],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[10,14],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:#ffc700;\">黄队</span>\n</td>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[15,19],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[15,19],v,constants,readAssetText,templates))){v["i"]=___value;
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
}
}
out+="</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),4))){
out+="<!--<div style=\"margin:10px\">\n<ul class=\"roomteam-ul\" style=\"list-style-type:none;\">\n<li style=\"display:block;\">\n<div style=\"float:left\">\n\n</div>\n</li>\n</ul>\n</div>-->\n<table CellSpacing=0 CellPadding=0 width=100%>";
if(phpTruthy(roomTemplateCall("is_array",[roomTemplateCall("range",[0,phpBinary("-",roomTemplateCall("room_get_vars",[v["roomdata"],"pnum"],v,constants,readAssetText,templates),1)],v,constants,readAssetText,templates)],v,constants,readAssetText,templates))){
for(const [,___value] of phpIterable(roomTemplateCall("range",[0,phpBinary("-",roomTemplateCall("room_get_vars",[v["roomdata"],"pnum"],v,constants,readAssetText,templates),1)],v,constants,readAssetText,templates))){v["i"]=___value;
void ((v["lp"]=phpOffset(roomTemplateCall("room_get_vars",[v["roomdata"],"leader-position"],v,constants,readAssetText,templates),v["i"])));
void ((v["tcolor"]=phpOffset(roomTemplateCall("room_get_vars",[v["roomdata"],"color"],v,constants,readAssetText,templates),v["lp"])));
void ((v["tname"]=phpOffset(roomTemplateCall("room_get_vars",[v["roomdata"],"teamID"],v,constants,readAssetText,templates),v["lp"])));
if(phpTruthy(phpBinary("==",phpBinary("%",v["i"],5),0))){
out+="<tr>\n<td class=\"b3\" height=40px width=20px>\n</td>\n<td class=\"b3\" height=40px width=40px>\n<span style=\"color:";
out+=phpString(v["tcolor"]);
out+=";\">";
out+=phpString(v["tname"]);
out+="</span>\n</td>";
}
out+="<td class=\"b3\" id=\"room-position-";
out+=phpString(v["i"]);
out+="\" width=90px align=center style=\"position:relative;\">";
out+=templates["roomslot_s"]!(v,constants,readAssetText,templates);
out+="</td>";
if(phpTruthy(phpBinary("==",phpBinary("%",v["i"],5),4))){
out+="</tr>";
}
}
}
out+="</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),5))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=10px colspan=5>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" colspan=3 height=25px width=310px>\n<span style=\"color:#ff9933;\">本模式可以熟悉游戏，也可以尝试在1禁前尽可能获取金钱</span>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=250>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\">\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=15px colspan=5>\n</td>\n</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),6))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=10px colspan=7>\n<span style=\"color:#ff9933;\">本模式中可以完成解离相关成就 限制时间为4禁 注意2禁会进入连斗</span>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=25px width=65px>\n</td>\n<td class=\"b3\" height=25px width=80px>\n<span style=\"color:#ff0022;\">攻坚</span>\n</td>\n<td class=\"b3\" height=25px width=70px>\n</td>\n<td class=\"b3\" height=25px width=80px>\n<span style=\"color:#5900ff;\">副手</span>\n</td>\n<td class=\"b3\" height=25px width=70px>\n</td>\n<td class=\"b3\" height=25px width=80px>\n<span style=\"color:#8cff00;\">辅助</span>\n</td>\n<td class=\"b3\" height=25px width=65px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=65px>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=80px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px width=70px>\n</td>";
void ((v["i"]=1));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=80px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px width=70px>\n</td>";
void ((v["i"]=2));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=80px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px width=65px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=15px colspan=5>\n</td>\n</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),8))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=10px colspan=5>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=25px width=310px colspan=3>\n<span style=\"color:#ff9933;\">本模式允许其他玩家随时加入，NPC、地图道具与标准模式有区别。此外，本模式偶尔会测试新功能。</span>\n</td>\n\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=250px>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=15px colspan=5>\n</td>\n</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),9))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=10px colspan=5>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=25px width=310px colspan=3>\n<span style=\"color:#ff9933;\">本模式节奏大大快于其他模式！允许其他玩家随时加入。</span>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=250px>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\" height=40px>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=15px colspan=5>\n</td>\n</tr>\n</table>";
}
if(phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"roomtype"),11))){
out+="<table CellSpacing=0 CellPadding=0 width=100%>\n<tr>\n<td class=\"b3\" height=10px colspan=5>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" colspan=3 height=90px width=310px>\n<span style=\"color:#ff9933;\">本模式胜利条件为完成幻境解离结局，限时2禁，商店部分强化道具于0禁提前出售。</span><br><br>\n<span class=\"red b\">注意：本模式供熟练玩家挑战自我，切糕奖励随难度增加<br>进阶16及以上难度难度较高，需要小心应对</span>\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=40px width=250>\n</td>";
void ((v["i"]=0));
out+="<td id=\"room-position-";
out+=phpString(v["i"]);
out+="\" class=\"b3\" width=150px align=center style=\"position:relative;\">";
out+=templates["roomslot"]!(v,constants,readAssetText,templates);
out+="</td>\n<td class=\"b3\">\n</td>\n</tr>\n<tr>\n<td class=\"b3\" height=15px colspan=5>\n</td>\n</tr>\n</table>";
}
return out;
}

// templates/default/roomslot.htm SHA256 6546f9699dd78392800bf1704e1a49d22b2e17b47c34d5b465932414a043026d
function render_roomslot(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
if(phpTruthy(!phpTruthy((v["tmp_cannot_forbid"] != null)))){
void ((v["tmp_cannot_forbid"]=roomTemplateCall("room_get_vars",[v["roomdata"],"cannot-forbid"],v,constants,readAssetText,templates)));
}
if(phpTruthy(phpBinary("==",v["upos"],-phpNumber(1)))){
if(phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 darkgrey forbidden\">(已禁入)</div>";
}else{
if(phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}else{
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 evergreen\" onclick=\"$('command').value='pos_enter';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">";
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="成为房主";
}else{
if(phpTruthy((phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"leader-position"),v["i"]),v["i"])) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="成为队长";
}else{
out+="进入位置";
}
}
out+="</div>";
}
}
}else{
if(phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 darkgrey forbidden\">(已禁入)</div>";
}else{
if(phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 grey\" onclick=\"";
if(phpTruthy((phpTruthy(phpBinary("==",v["upos"],0)) && phpTruthy(phpBinary("!=",v["i"],0))))){
out+="if(!window.confirm('离开0号房主位置将交出房主权限，确定换座位吗？')) return;";
}
out+="$('command').value='pos_enter';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">";
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="空房主位置";
}else{
if(phpTruthy((phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"leader-position"),v["i"]),v["i"])) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="空队长位置";
}else{
out+="空位置";
}
}
out+="</div>";
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"readystat"),1)) && phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),"")))) && phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"ready"))))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 evergreen forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}else{
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w140 h30 forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}
}
}
}
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="<div style=\"position:absolute;left:110px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 lime forbidden\">房主</div>\n</div>";
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",v["upos"],0)) || phpTruthy(phpBinary("==",v["upos"],roomTemplateCall("room_team_leader_check",[v["roomdata"],v["i"]],v,constants,readAssetText,templates))))) && phpTruthy(phpBinary("!=",v["i"],v["upos"]))))){
if(phpTruthy((phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))) && phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))))){
out+="<div style=\"position:absolute;left:110px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 red\" onclick=\"$('command').value='pos_kick';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n踢出\n</div>\n</div>";
}else{
if(phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden")))){
if(phpTruthy(!phpTruthy(v["tmp_cannot_forbid"]))){
out+="<div style=\"position:absolute;left:110px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 red\" onclick=\"$('command').value='pos_disable';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n禁用\n</div>\n</div>";
}
}else{
out+="<div style=\"position:absolute;left:110px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 evergreen\" onclick=\"$('command').value='pos_enable';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n启用\n</div>\n</div>";
}
}
}
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("!=",v["upos"],0)) && phpTruthy(phpBinary("==",v["i"],roomTemplateCall("room_team_leader_check",[v["roomdata"],v["i"]],v,constants,readAssetText,templates))))) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="<div style=\"position:absolute;left:110px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 lime forbidden\">队长</div>\n</div>";
}
}
return out;
}

// templates/default/roomslot_s.htm SHA256 3c0b0d906bb61cb5cb8d4d8e43e36ce7fe5f63c807fe717bbd27e2cc763f51ac
function render_roomslot_s(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
if(phpTruthy(phpBinary("==",v["upos"],-phpNumber(1)))){
if(phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 darkgrey forbidden\">(已禁入)</div>";
}else{
if(phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}else{
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 evergreen\" onclick=\"$('command').value='pos_enter';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">";
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="成为房主";
}else{
if(phpTruthy((phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"leader-position"),v["i"]),v["i"])) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="成为队长";
}else{
out+="进入位置";
}
}
out+="</div>";
}
}
}else{
if(phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 darkgrey forbidden\">(已禁入)</div>";
}else{
if(phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 grey\" onclick=\"$('command').value='pos_enter';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">";
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="空房主位置";
}else{
if(phpTruthy((phpTruthy(phpBinary("==",phpOffset(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"leader-position"),v["i"]),v["i"])) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="空队长位置";
}else{
out+="空位置";
}
}
out+="</div>";
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",phpOffset(v["roomdata"],"readystat"),1)) && phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),"")))) && phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"ready"))))){
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 evergreen forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}else{
out+="<div id=\"pos";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w115 h30 forbidden\">";
out+=phpString(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"));
out+="</div>";
}
}
}
}
if(phpTruthy(phpBinary("==",v["i"],0))){
out+="<div style=\"position:absolute;left:75px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 lime forbidden\">房主</div>\n</div>";
}else{
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("==",v["upos"],0)) || phpTruthy(phpBinary("==",v["upos"],roomTemplateCall("room_team_leader_check",[v["roomdata"],v["i"]],v,constants,readAssetText,templates))))) && phpTruthy(phpBinary("!=",v["i"],v["upos"]))))){
if(phpTruthy((phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden"))) && phpTruthy(phpBinary("!=",phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"name"),""))))){
out+="<div style=\"position:absolute;left:75px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 red\" onclick=\"$('command').value='pos_kick';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n踢出\n</div>\n</div>";
}else{
if(phpTruthy(!phpTruthy(phpOffset(phpOffset(phpOffset(v["roomdata"],"player"),v["i"]),"forbidden")))){
out+="<div style=\"position:absolute;left:75px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 red\" onclick=\"$('command').value='pos_disable';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n禁用\n</div>\n</div>";
}else{
out+="<div style=\"position:absolute;left:75px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 evergreen\" onclick=\"$('command').value='pos_enable';$('para1').value=";
out+=phpString(v["i"]);
out+=";postCmd('roomcmd','roomcmd.php');\">\n启用\n</div>\n</div>";
}
}
}
if(phpTruthy((phpTruthy((phpTruthy(phpBinary("!=",v["upos"],0)) && phpTruthy(phpBinary("==",v["i"],roomTemplateCall("room_team_leader_check",[v["roomdata"],v["i"]],v,constants,readAssetText,templates))))) && phpTruthy(phpOffset(phpOffset(v["roomtypelist"],phpOffset(v["roomdata"],"roomtype")),"show-team-leader"))))){
out+="<div style=\"position:absolute;left:75px;top:19px;\">\n<div id=\"action";
out+=phpString(v["i"]);
out+="\" class=\"glow_buttons w35 h15 lime forbidden\">队长</div>\n</div>";
}
}
return out;
}

// templates/default/room_newroom.htm SHA256 563354b3785b0f071c9524e94ecc39f6f2385a65f7d59a1616c2f6944858e958
function render_room_newroom(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+=phpString(roomTemplateCall("bubblebox_start",["id:persistent-newroombox;height:425;width:310;scroll-bar:1;cancellable:1;"],v,constants,readAssetText,templates));
out+="<div id=\"loading\"></div><div style=\"text-align:center;\">\n<span style=\"line-height:32px;\">创建新房间：</span>\n    <div style=\"font-size:12px;line-height:1.6;color:#e0e2e9;text-align:left;margin:4px 8px 10px;\">\n      同一账号最多同时创建 <strong>";
out+=phpString(v["max_private_room_num"]);
out+="</strong> 个未结束的非常驻房间；部分模式另有同类型限制。<br>\n      「SOLO模式」实际为<strong>双人1v1</strong>，需两名玩家入座并准备；进入房间后仍须点击空座位。\n    </div>";

if(phpTruthy(roomTemplateCall("is_array",[v["roomtypelist"]],v,constants,readAssetText,templates))){
for(const [___key,___value] of phpIterable(v["roomtypelist"])){v["i"]=___key;v["value"]=___value;
if(phpTruthy((phpTruthy(roomTemplateCall("check_room_available",[v["value"]],v,constants,readAssetText,templates)) && phpTruthy(!phpTruthy(phpOffset(v["value"],"soleroom")))))){
out+="<div>";
void ((v["bname"]=roomTemplateCall("str_replace",["\"","'",phpOffset(v["value"],"name")],v,constants,readAssetText,templates)));
out+="<a class=\"b_button bc_black\" onclick=\"\nwindow.location.href='roomcmd.php?command=newroom&para1='+";
out+=phpString(v["i"]);
out+=";\n$('loading').style.display='block'\" style=\"margin:3px;width:85px\">";
out+=phpString(v["bname"]);
out+="</a>\n</div>";
}
}
}
out+="</div>";
out+=phpString(roomTemplateCall("bubblebox_end",[],v,constants,readAssetText,templates));
return out;
}

// templates/default/room_setmode.htm SHA256 6ff6bb0f59f38bda045f3b91fc91cd4c5a44d3cf5a797965133f628b70cfd29b
function render_room_setmode(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+=phpString(roomTemplateCall("bubblebox_start",["id:persistent-rmeditbox;height:280;width:200;scroll-bar:0;"],v,constants,readAssetText,templates));
out+="<div id=\"loading3\"></div><div style=\"text-align:center;\">\n<span style=\"line-height:32px;\">设置游戏模式：</span>";

if(phpTruthy(roomTemplateCall("is_array",[v["roomtypelist"]],v,constants,readAssetText,templates))){
for(const [___key,___value] of phpIterable(v["roomtypelist"])){v["i"]=___key;v["value"]=___value;
if(phpTruthy((phpTruthy((phpTruthy(roomTemplateCall("check_room_available",[v["value"]],v,constants,readAssetText,templates)) && phpTruthy(!phpTruthy(phpOffset(v["value"],"soleroom"))))) && phpTruthy(!phpTruthy(phpOffset(v["value"],"without-ready")))))){
out+="<div>";
void ((v["bname"]=roomTemplateCall("str_replace",["\"","'",phpOffset(v["value"],"name")],v,constants,readAssetText,templates)));
out+="<a class=\"b_button bc_black\" onclick=\"\n$('loading3').style.display='block';\n$('command').value='rmsetmode';\n$('para1').value=";
out+=phpString(v["i"]);
out+="; \npostCmd('roomcmd','roomcmd.php'); \nsleep(1000);\nbubblebox_show('persistent-roommain');\n$('loading3').style.display='none';\n\" style=\"margin:3px;width:85px\">";
out+=phpString(v["bname"]);
out+="</a>\n</div>";
}
}
}
out+="<div>\n<a class=\"b_button bc_black\" onclick=\"bubblebox_show('persistent-roommain');\" style=\"margin:3px;width:85px\">返回</a>\n</div>\n</div>";
out+=phpString(roomTemplateCall("bubblebox_end",[],v,constants,readAssetText,templates));
return out;
}

// templates/default/bubblebox_start.htm SHA256 b58a881245e6eeb01f1772747a03946cff115e2b407632be7d860dcbd05e9260
function render_bubblebox_start(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+="<div id=\"fmsgbox";
out+=phpString(v["bbox_id"]);
out+="\" style=\"display:none\">\n\n<!--构建半透明外缘-->\n<div class=\"bubblebox_positioner\" style=\"z-index:calc(";
out+=phpString(v["bbox_z_index_base"]);
out+=" + 3);\">\n<div class=\"bubblebox_positioner_inner\" style=\"z-index:calc(";
out+=phpString(v["bbox_z_index_base"]);
out+=" + 4); \nmargin-top:";
out+=phpString(v["bbox_positioner_inner_margin_top"]);
out+="px; \nmargin-left:";
out+=phpString(v["bbox_positioner_inner_margin_left"]);
out+="px;\nmin-width:";
out+=phpString(v["bbox_positioner_inner_min_width"]);
out+="px; \nmax-width:";
out+=phpString(v["bbox_positioner_inner_max_width"]);
out+="px; \nmin-height:";
out+=phpString(v["bbox_positioner_inner_min_height"]);
out+="px;\nmax-height:";
out+=phpString(v["bbox_positioner_inner_max_height"]);
out+="px;\">\n</div>\n</div>\n<!--END-->\n\n<!--构建文本框-->\n<!--全屏背景降低+跳出点击区-->\n<div class=\"bubblebox_positioner bubblebox_screen_fader\" style=\"z-index:calc(";
out+=phpString(v["bbox_z_index_base"]);
out+=" + 3);\" ";
if(phpTruthy(!phpTruthy(!phpTruthy(v["bbox_change_to"])))){
out+=" onclick=\"bubblebox_show('";
out+=phpString(v["bbox_change_to"]);
out+="');bubblebox_hide('";
out+=phpString(v["bbox_id"]);
out+="');\"";
}else{
if(phpTruthy(!phpTruthy(!phpTruthy(v["bbox_cancellable"])))){
out+=" onclick=\"bubblebox_hide('";
out+=phpString(v["bbox_id"]);
out+="');\"";
}
}
out+=">\n<div class=\"bubblebox_screen_fader_inner\" style=\"z-index:calc(";
out+=phpString(v["bbox_z_index_base"]);
out+=" + 5);\nmargin-top:";
out+=phpString(v["bbox_screen_fader_inner_margin_top"]);
out+="px; \nmargin-left:";
out+=phpString(v["bbox_screen_fader_inner_margin_left"]);
out+="px;\nmin-width:";
out+=phpString(v["bbox_screen_fader_inner_min_width"]);
out+="px;\nmax-width:";
out+=phpString(v["bbox_screen_fader_inner_max_width"]);
out+="px;\nmin-height:";
out+=phpString(v["bbox_screen_fader_inner_min_height"]);
out+="px;\nmax-height:";
out+=phpString(v["bbox_screen_fader_inner_max_height"]);
out+="px;\nfilter:alpha(opacity=";
out+=phpString(roomTemplateCall("round",[phpBinary("*",v["bbox_opacity"],100)],v,constants,readAssetText,templates));
out+=");\nopacity:";
out+=phpString(v["bbox_opacity"]);
out+=";\" \nonclick=\"if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true; \"\n>\n<div class=\"bubblebox_container\" style=\"z-index:calc(";
out+=phpString(v["bbox_z_index_base"]);
out+=" + 6);\nmargin-left:";
out+=phpString(v["bbox_margin_left"]);
out+="px;\nmargin-top:";
out+=phpString(v["bbox_margin_top"]);
out+="px;\nmargin-right:0px;\nmargin-bottom:";
out+=phpString(v["bbox_margin_bottom"]);
out+="px;\nmin-height:";
out+=phpString(v["bubblebox_container_min_height"]);
out+="px;\nmax-height:";
out+=phpString(v["bubblebox_container_max_height"]);
out+="px;\"\n>\n<div class=\"bubblebox_container_inner gscroll ";
if(phpTruthy(v["bbox_scroll_bar"])){
out+="scroll-pane";
out+=phpString(v["bbox_id"]);
}
out+="\" style=\"max-height:";
out+=phpString(v["bbox_height"]);
out+="px;width:";
out+=phpString(v["bbox_width"]);
out+="px; \">\n<!--END-->";
return out;
}

// templates/default/bubblebox_end.htm SHA256 f89cc1a27268dc4d8d0660a1f1c88d83cf061b0c3761c4dd26db0edba5ae3c13
function render_bubblebox_end(v:OriginalTemplateContext,constants:OriginalTemplateConstants,readAssetText:OriginalTemplateReadAsset,templates:OriginalTemplateSet):string{
let out="";
if(phpTruthy(!phpTruthy(roomTemplateCall("defined",["IN_GAME"],v,constants,readAssetText,templates)))){
throw new Error(phpString("Access Denied"));
}
out+="                </div>\n            </div>\n        </div>\n    </div>\n</div>";
return out;
}

export const originalRoomTemplates:OriginalTemplateSet={
"header":render_header,
"footer":render_footer,
"index":render_index,
"room":render_room,
"roomlist":render_roomlist,
"roommain":render_roommain,
"roomteam":render_roomteam,
"roomslot":render_roomslot,
"roomslot_s":render_roomslot_s,
"room_newroom":render_room_newroom,
"room_setmode":render_room_setmode,
"bubblebox_start":render_bubblebox_start,
"bubblebox_end":render_bubblebox_end
};

export const originalRoomTemplateConstants:OriginalTemplateConstants={"IN_GAME":true,"CURSCRIPT":"index","MOD_INPUT":true,"MOD_SYS":true,"MOD_MAP":true,"MOD_BMP_UTIL":true,"MOD_GAMEFLOW_BASE":true,"MOD_PLAYER":true,"MOD_GAMEFLOW_ANTIAFK":true,"MOD_LOGGER":true,"MOD_SKILLBASE":true,"MOD_REPLAY":true,"MOD_MAP_DISPLAY":true,"MOD_EXPLORE":true,"MOD_NOISE":true,"MOD_LVLCTL":true,"MOD_BUFFICONS":true,"MOD_SKILL4":true,"MOD_NPC":true,"MOD_ITEMMAIN":true,"MOD_ELORATING":true,"MOD_METMAN":true,"MOD_ITEMMIX":true,"MOD_ITEMSHOP":true,"MOD_EDIBLE":true,"MOD_BOXES":true,"MOD_SCPDRINK":true,"MOD_ITEM_UB":true,"MOD_ITEM_UEE":true,"MOD_APM":true,"MOD_ITEM_ADDAREA":true,"MOD_RADAR":true,"MOD_RANDNPC":true,"MOD_NPC_PICK_ITEM":true,"MOD_CORPSE":true,"MOD_TRAP":true,"MOD_ITEMMIX_SYNC":true,"MOD_ITEM_UEE_EXTRA":true,"MOD_ENEMY":true,"MOD_GAMEFLOW_DUEL":true,"MOD_ITEMMIX_OVERLAY":true,"MOD_TEAM":true,"MOD_BATTLE":true,"MOD_ITEM_MISC":true,"MOD_GAMEFLOW_COMBO":true,"MOD_ADVTEAM":true,"MOD_ATTACK":true,"MOD_INSTANCE0":true,"MOD_WEAPON":true,"MOD_NPCCHAT":true,"MOD_EX_VANISH":true,"MOD_CLUBBASE":true,"MOD_WEP_N":true,"MOD_WEP_P":true,"MOD_WEP_K":true,"MOD_WEP_C":true,"MOD_WEP_D":true,"MOD_WEP_F":true,"MOD_ITEM_UM":true,"MOD_MAPATTR":true,"MOD_WOUND":true,"MOD_SKILL2":true,"MOD_SKILL3":true,"MOD_ITEM_UV":true,"MOD_SKILL21":true,"MOD_SKILL533":true,"MOD_SKILL11":true,"MOD_SKILL10":true,"MOD_SKILL305":true,"MOD_SKILL306":true,"MOD_SKILL324":true,"MOD_SKILL328":true,"MOD_SKILL330":true,"MOD_SKILL411":true,"MOD_SKILL413":true,"MOD_SKILL308":true,"MOD_SKILL309":true,"MOD_SKILL317":true,"MOD_SKILL319":true,"MOD_SKILL320":true,"MOD_SKILL431":true,"MOD_SKILL22":true,"MOD_SKILL316":true,"MOD_SKILL321":true,"MOD_SKILL310":true,"MOD_SKILL311":true,"MOD_SKILL312":true,"MOD_SKILL314":true,"MOD_SKILL443":true,"MOD_SKILL477":true,"MOD_SKILL479":true,"MOD_SKILL327":true,"MOD_SKILL437":true,"MOD_SKILL442":true,"MOD_SKILL452":true,"MOD_SKILL459":true,"MOD_SKILL1001":true,"MOD_SKILL204":true,"MOD_SKILL485":true,"MOD_SKILL486":true,"MOD_SKILL488":true,"MOD_SKILL52":true,"MOD_SKILL71":true,"MOD_SKILL414":true,"MOD_SKILL519":true,"MOD_SKILL520":true,"MOD_SKILL446":true,"MOD_SKILL447":true,"MOD_SKILL453":true,"MOD_SKILL455":true,"MOD_SKILL456":true,"MOD_SKILL253":true,"MOD_SKILL483":true,"MOD_SKILL1002":true,"MOD_SKILL499":true,"MOD_SKILL69":true,"MOD_SKILL18":true,"MOD_SKILL15":true,"MOD_SKILL16":true,"MOD_SKILL17":true,"MOD_SKILL13":true,"MOD_SKILL14":true,"MOD_SKILL480":true,"MOD_SKILL1011":true,"MOD_SKILL1010":true,"MOD_SKILL39":true,"MOD_SKILL29":true,"MOD_SKILL421":true,"MOD_SKILL40":true,"MOD_CLUB1":true,"MOD_CLUB2":true,"MOD_CLUB3":true,"MOD_CLUB4":true,"MOD_CLUB5":true,"MOD_CLUB9":true,"MOD_CLUB10":true,"MOD_CLUB99":true,"MOD_CLUB17":true,"MOD_CLUB20":true,"MOD_CLUB13":true,"MOD_CLUB14":true,"MOD_SKLEARN_UTIL":true,"MOD_CLUB6":true,"MOD_CLUB8":true,"MOD_CLUB7":true,"MOD_CLUB11":true,"MOD_CLUB19":true,"MOD_SKILL58":true,"MOD_CLUB24":true,"MOD_CLUB18":true,"MOD_SKILL211":true,"MOD_SKILL212":true,"MOD_SKILL214":true,"MOD_SKILL234":true,"MOD_SKILL235":true,"MOD_SKILL420":true,"MOD_SKILL424":true,"MOD_SKILL428":true,"MOD_CLUB21":true,"MOD_SKILL240":true,"MOD_SKILL241":true,"MOD_SKILL247":true,"MOD_SKILL454":true,"MOD_SKILL457":true,"MOD_SKILL249":true,"MOD_SKILL250":true,"MOD_SKILL460":true,"MOD_SKILL461":true,"MOD_SKILL251":true,"MOD_SKILL255":true,"MOD_SKILL462":true,"MOD_SKILL257":true,"MOD_SKILL474":true,"MOD_SKILL484":true,"MOD_SKILL491":true,"MOD_CLUB97":true,"MOD_SKILL267":true,"MOD_SKILL268":true,"MOD_CLUB94":true,"MOD_CLUB95":true,"MOD_CLUB96":true,"MOD_SKILL494":true,"MOD_SKILL495":true,"MOD_SKILL501":true,"MOD_SKILL83":true,"MOD_SKILL256":true,"MOD_SKILL433":true,"MOD_SKILL221":true,"MOD_SKILL41":true,"MOD_SKILL45":true,"MOD_SKILL46":true,"MOD_SKILL60":true,"MOD_SKILL61":true,"MOD_SKILL62":true,"MOD_SKILL63":true,"MOD_SKILL64":true,"MOD_SKILL66":true,"MOD_SKILL74":true,"MOD_SKILL213":true,"MOD_SKILL216":true,"MOD_SKILL404":true,"MOD_SKILL405":true,"MOD_SKILL406":true,"MOD_SKILL400":true,"MOD_SKILL402":true,"MOD_SKILL401":true,"MOD_SKILL225":true,"MOD_SKILL226":true,"MOD_SKILL229":true,"MOD_SKILL408":true,"MOD_SKILL409":true,"MOD_SKILL415":true,"MOD_SKILL412":true,"MOD_SKILL416":true,"MOD_SKILL419":true,"MOD_SKILL423":true,"MOD_SKILL239":true,"MOD_SKILL438":true,"MOD_SKILL439":true,"MOD_SKILL440":true,"MOD_SKILL449":true,"MOD_SKILL450":true,"MOD_SKILL464":true,"MOD_SKILL466":true,"MOD_SKILL469":true,"MOD_SKILL470":true,"MOD_SKILL471":true,"MOD_SKILL473":true,"MOD_SKILL262":true,"MOD_SKILL263":true,"MOD_SKILL264":true,"MOD_SKILL476":true,"MOD_SKILL269":true,"MOD_SKILL78":true,"MOD_SKILL496":true,"MOD_SKILL506":true,"MOD_SKILL515":true,"MOD_SKILL516":true,"MOD_CLUB15":true,"MOD_SKILL518":true,"MOD_SKILL84":true,"MOD_SKILL527":true,"MOD_SKILL528":true,"MOD_SKILL529":true,"MOD_SKILL531":true,"MOD_SKILL532":true,"MOD_SKILL552":true,"MOD_SKILL1012":true,"MOD_SKILL553":true,"MOD_SKILL555":true,"MOD_SKILL560":true,"MOD_SKILL534":true,"MOD_SKILL561":true,"MOD_SKILL556":true,"MOD_SKILL275":true,"MOD_SKILL276":true,"MOD_SKILL536":true,"MOD_SKILL565":true,"MOD_SKILL537":true,"MOD_SKILL569":true,"MOD_SKILL571":true,"MOD_SKILL572":true,"MOD_SKILL577":true,"MOD_SKILL581":true,"MOD_SKILL582":true,"MOD_SKILL583":true,"MOD_SKILL589":true,"MOD_SKILL590":true,"MOD_SKILL539":true,"MOD_SKILL591":true,"MOD_SKILL594":true,"MOD_SKILL574":true,"MOD_SKILL702":true,"MOD_SKILL704":true,"MOD_SKILL703":true,"MOD_SKILL706":true,"MOD_SKILL708":true,"MOD_SKILL301":true,"MOD_SKILL307":true,"MOD_SKILL318":true,"MOD_SKILL322":true,"MOD_SKILL323":true,"MOD_SKILL715":true,"MOD_SKILL586":true,"MOD_SKILL902":true,"MOD_SKILL907":true,"MOD_SKILL904":true,"MOD_SKILL801":true,"MOD_SKILL802":true,"MOD_SKILL716":true,"MOD_SKILL718":true,"MOD_SKILL717":true,"MOD_SKILL719":true,"MOD_SKILL85":true,"MOD_SKILL952":true,"MOD_SKILL951":true,"MOD_SKILL724":true,"MOD_CLUB25":true,"MOD_SKILL95":true,"MOD_CLUB26":true,"MOD_SKILL725":true,"MOD_SKILL804":true,"MOD_SKILL728":true,"MOD_SKILL735":true,"MOD_SKILL736":true,"MOD_SKILL110":true,"MOD_CLUB27":true,"MOD_SKILL1013":true,"MOD_SKILL743":true,"MOD_SKILL744":true,"MOD_SKILL_TEMP":true,"MOD_SKILL606":true,"MOD_WEP_G":true,"MOD_WEP_J":true,"MOD_SKILL273":true,"MOD_SKILL209":true,"MOD_SKILL5":true,"MOD_SKILL6":true,"MOD_SKILL7":true,"MOD_SKILL8":true,"MOD_SKILL9":true,"MOD_POISON":true,"MOD_ARMOR":true,"MOD_REST":true,"MOD_ITEM_UC":true,"MOD_SKILL12":true,"MOD_SKILL223":true,"MOD_EVENT":true,"MOD_SKILL710":true,"MOD_SKILL745":true,"MOD_NPCCHAT_BUBBLE":true,"MOD_ITEM_SLIP":true,"MOD_SKILL331":true,"MOD_SKILL19":true,"MOD_SKILL79":true,"MOD_SKILL31":true,"MOD_SKILL242":true,"MOD_SKILL53":true,"MOD_SKILL55":true,"MOD_SKILL72":true,"MOD_SKILL227":true,"MOD_SKILL472":true,"MOD_SKILL564":true,"MOD_SKILL475":true,"MOD_SKILL59":true,"MOD_SKILL425":true,"MOD_SKILL427":true,"MOD_SKILL260":true,"MOD_SKILL261":true,"MOD_SKILL274":true,"MOD_SKILL511":true,"MOD_SKILL545":true,"MOD_SKILL403":true,"MOD_SKILL203":true,"MOD_AMMUNITION":true,"MOD_SKILL901":true,"MOD_ARMOR_ART":true,"MOD_SKILL23":true,"MOD_SKILL517":true,"MOD_SKILL407":true,"MOD_SKILL32":true,"MOD_SKILL202":true,"MOD_SKILL445":true,"MOD_SKILL557":true,"MOD_POSE":true,"MOD_SKILL1":true,"MOD_SKILL562":true,"MOD_SKILL600":true,"MOD_SKILL487":true,"MOD_SKILL20":true,"MOD_SKILL426":true,"MOD_SKILL492":true,"MOD_SKILL723":true,"MOD_SKILL24":true,"MOD_SKILL33":true,"MOD_SKILL579":true,"MOD_TACTIC":true,"MOD_SKILL906":true,"MOD_WEATHER":true,"MOD_NPCINFO":true,"MOD_SKILL502":true,"MOD_SKILL599":true,"MOD_CARDBASE":true,"MOD_INSTANCE6":true,"MOD_SKILL42":true,"MOD_ADDNPC":true,"MOD_SKILL245":true,"MOD_SKILL252":true,"MOD_SKILL270":true,"MOD_SKILL588":true,"MOD_ATTRBASE":true,"MOD_INSTANCE8":true,"MOD_INSTANCE7":true,"MOD_KUJIBASE":true,"MOD_SET_GAMETYPE":true,"MOD_GTYPE6":true,"MOD_SKILL67":true,"MOD_SKILL584":true,"MOD_SKILL592":true,"MOD_SKILL541":true,"MOD_NPC_ACTION":true,"MOD_SKILL720":true,"MOD_GET_QIEGAO_IN_BATTLE":true,"MOD_SKILL734":true,"MOD_SKILL749":true,"MOD_SKILL43":true,"MOD_ITEMNUMLIST":true,"MOD_SKILL56":true,"MOD_SKILL435":true,"MOD_SKILL329":true,"MOD_SKILL512":true,"MOD_ADDNPC_EVENT":true,"MOD_SKILL961":true,"MOD_SUPPLYCRATE_EVENT":true,"MOD_SKILL593":true,"MOD_SKILL731":true,"MOD_ITEM_RANDSKILLS":true,"MOD_SKILL490":true,"MOD_SKILL430":true,"MOD_WEP_B":true,"MOD_EX_PHY_DEF":true,"MOD_RAGE":true,"MOD_SKILL30":true,"MOD_SKILL441":true,"MOD_SKILL259":true,"MOD_EX_RAPID_ATTR":true,"MOD_EX_ATTR_SILENCER":true,"MOD_EX_DMG_ATT":true,"MOD_EX_ATTR_CHARGE":true,"MOD_EX_HP_DEF":true,"MOD_EX_DIRECT":true,"MOD_EX_SECKILL":true,"MOD_EX_CURSED":true,"MOD_EX_DEF_DOWN":true,"MOD_EX_ARMOR_CRACK":true,"MOD_EX_ATTR_DIGIT":true,"MOD_EX_WEAPON_CRACK":true,"MOD_SKILL568":true,"MOD_SKILL585":true,"MOD_SKILL705":true,"MOD_EX_USELOG":true,"MOD_SKILL89":true,"MOD_SKILL96":true,"MOD_SKILL102":true,"MOD_SKILL103":true,"MOD_SKILL104":true,"MOD_SKILL732":true,"MOD_SKILL1000":true,"MOD_SKILL711":true,"MOD_SKILL1007":true,"MOD_SKILL418":true,"MOD_SKILL1003":true,"MOD_RANDMIX":true,"MOD_GTYPE1":true,"MOD_SKILL57":true,"MOD_SKILL436":true,"MOD_SKILL729":true,"MOD_SKILL107":true,"MOD_DUALWEP":true,"MOD_WEP_B_EXTRA_RELOADING":true,"MOD_SKILL28":true,"MOD_SKILL254":true,"MOD_SKILL535":true,"MOD_SKILL37":true,"MOD_SKILL73":true,"MOD_SKILL410":true,"MOD_SKILL570":true,"MOD_INSTANCE9":true,"MOD_SKILL258":true,"MOD_SKILL444":true,"MOD_SKILL207":true,"MOD_SKILL65":true,"MOD_SKILL49":true,"MOD_SKILL201":true,"MOD_SKILL248":true,"MOD_EX_RAPID_DEF":true,"MOD_SKILL82":true,"MOD_SKILL50":true,"MOD_SKILL741":true,"MOD_SKILL578":true,"MOD_EX_ATTR_TRAP":true,"MOD_SKILL422":true,"MOD_SKILL230":true,"MOD_SKILL222":true,"MOD_SKILL218":true,"MOD_SKILL217":true,"MOD_SKILL219":true,"MOD_EX_DMG_DEF":true,"MOD_EX_DMG_NULLIFY":true,"MOD_SKILL25":true,"MOD_SKILL44":true,"MOD_SKILL47":true,"MOD_SKILL48":true,"MOD_SKILL54":true,"MOD_SKILL205":true,"MOD_SKILL75":true,"MOD_SKILL76":true,"MOD_SKILL210":true,"MOD_SKILL238":true,"MOD_SKILL434":true,"MOD_SKILL448":true,"MOD_SKILL463":true,"MOD_SKILL465":true,"MOD_SKILL478":true,"MOD_SKILL521":true,"MOD_SKILL522":true,"MOD_SKILL523":true,"MOD_SKILL524":true,"MOD_SKILL525":true,"MOD_SKILL526":true,"MOD_SKILL90":true,"MOD_SKILL93":true,"MOD_SKILL803":true,"MOD_SKILL232":true,"MOD_SKILL432":true,"MOD_SKILL558":true,"MOD_SKILL513":true,"MOD_ITEM_UU":true,"MOD_ITEM_UMB":true,"MOD_SKILL726":true,"MOD_SKILL105":true,"MOD_SKILL727":true,"MOD_ITEM_RECIPE":true,"MOD_SKILL580":true,"MOD_ACHIEVEMENT_BASE":true,"MOD_OPENING":true,"MOD_ENDING":true,"MOD_SONG":true,"MOD_EXTRA_EVENT":true,"MOD_NEWS_OBSERVE":true,"MOD_SKILL429":true,"MOD_SKILL108":true,"MOD_SKILL109":true,"MOD_SKILL111":true,"MOD_EMPOWERS":true,"MOD_SKILL70":true,"MOD_SKILL246":true,"MOD_SKILL598":true,"MOD_EX_MHP_TEMP_UP":true,"MOD_INSTANCE_CLOSE_BUTTON":true,"MOD_SKILL514":true,"MOD_SKILL206":true,"MOD_MIRACLETRAP":true,"MOD_SKILL231":true,"MOD_SKILL742":true,"MOD_SKILL220":true,"MOD_SKILL224":true,"MOD_SKILL243":true,"MOD_SKILL208":true,"MOD_SKILL215":true,"MOD_SKILL271":true,"MOD_SKILL112":true,"MOD_TUTORIAL":true,"MOD_SKILL51":true,"MOD_SKILL493":true,"MOD_RANDRECIPE":true,"MOD_SKILL100":true,"MOD_SKILL101":true,"MOD_SKILL98":true,"MOD_SKILL99":true,"MOD_SKILL97":true,"MOD_SKILL302":true,"MOD_SKILL303":true,"MOD_SKILL304":true,"MOD_SKILL325":true,"MOD_SKILL326":true,"MOD_SKILL315":true,"MOD_SKILL313":true,"MOD_SKILL300":true,"MOD_SKILL332":true,"MOD_SKILL333":true,"MOD_SKILL334":true,"MOD_SKILL335":true,"MOD_SKILL336":true,"MOD_SKILL337":true,"MOD_SKILL338":true,"MOD_SKILL339":true,"MOD_SKILL340":true,"MOD_SKILL341":true,"MOD_SKILL342":true,"MOD_SKILL343":true,"MOD_SKILL344":true,"MOD_SKILL345":true,"MOD_SKILL346":true,"MOD_SKILL347":true,"MOD_SKILL348":true,"MOD_SKILL349":true,"MOD_SKILL350":true,"MOD_SKILL353":true,"MOD_SKILL354":true,"MOD_SKILL355":true,"MOD_SKILL356":true,"MOD_SKILL357":true,"MOD_SKILL358":true,"MOD_SKILL359":true,"MOD_SKILL360":true,"MOD_SKILL364":true,"MOD_ACTIVITY_RANKING":true,"MOD_APRILFOOL2018":true,"MOD_SKILL367":true,"MOD_SKILL368":true,"MOD_SKILL369":true,"MOD_SKILL370":true,"MOD_SKILL530":true,"MOD_SKILL372":true,"MOD_SKILL373":true,"MOD_SKILL374":true,"MOD_SKILL377":true,"MOD_SKILL378":true,"MOD_SKILL380":true,"MOD_SKILL375":true,"MOD_SKILL382":true,"MOD_SKILL351":true,"MOD_SKILL352":true,"MOD_SKILL504":true,"MOD_USER_SETTINGS":true,"MOD_SKILL740":true,"MOD_INSTANCE3":true,"MOD_EX_ALTERNATIVE":true,"MOD_SKILL182":true,"MOD_COOLDOWN":true,"MOD_SKILL458":true,"MOD_SKILL498":true,"MOD_EX_ATTR_SONG":true,"MOD_SKILL181":true,"MOD_SKILL376":true,"MOD_SKILL381":true,"MOD_SKILL88":true,"MOD_SKILL91":true,"MOD_SKILL92":true,"MOD_SKILL739":true,"MOD_SKILL747":true,"MOD_INSTANCE11":true,"MOD_WEPCHANGE":true,"MOD_SKILL77":true,"MOD_SKILL379":true,"MOD_SKILL244":true,"MOD_SKILL508":true,"MOD_SKILL233":true,"MOD_SMARTMIX":true,"MOD_SKILL371":true,"MOD_SKILL363":true,"MOD_INSTANCE5":true,"MOD_SKILL361":true,"MOD_SKILL362":true,"MOD_SKILL365":true,"MOD_LOGISTICS":true,"MOD_AUTOPOWER":true,"MOD_SKILL601":true,"MOD_SKILL602":true,"MOD_SKILL603":true,"MOD_ITEM_UYS":true,"MOD_SEARCHMEMORY":true,"MOD_SKILL738":true,"MOD_SKILL87":true,"MOD_SKILL94":true,"MOD_SKILL68":true,"MOD_INSTANCE_QUIT_BUTTON":true,"MOD_SKILL497":true,"MOD_SKILL503":true,"MOD_SKILL559":true,"MOD_SKILL544":true,"MOD_SKILL366":true,"MOD_SKILL721":true,"MOD_SKILL228":true,"MOD_SKILL236":true,"MOD_SKILL237":true,"MOD_SKILL35":true,"MOD_SKILL467":true,"MOD_SKILL468":true,"MOD_SKILL481":true,"MOD_SKILL482":true,"MOD_SKILL596":true,"MOD_SKILL595":true,"MOD_SKILL500":true,"MOD_BLESSSTONE":true,"MOD_SKILL701":true,"MOD_ITEM_EXT_ARMOR":true,"MOD_SKILL567":true,"MOD_SKILL80":true,"MOD_SKILL551":true,"MOD_SKILL554":true,"MOD_SKILL1006":true,"MOD_SKILL542":true,"MOD_SKILL905":true,"MOD_SKILL605":true,"MOD_SKILL563":true,"MOD_SKILL36":true,"MOD_SKILL38":true,"MOD_SKILL34":true,"MOD_SKILL538":true,"MOD_EX_PHY_NULLIFY":true,"MOD_EX_EQUIPSKILL":true,"MOD_EX_STORAGE":true,"MOD_ITEM_ARMOR_EMPOWER":true,"MOD_ITEM_UVO_EXTRA":true,"MOD_SKILL272":true,"MOD_SKILL707":true,"MOD_EX_RESIDUE":true,"MOD_SKILL576":true,"MOD_SKILL575":true,"MOD_SKILL597":true,"MOD_SKILL713":true,"MOD_SKILL712":true,"MOD_SKILL587":true,"MOD_SKILL543":true,"MOD_SKILL733":true,"MOD_SKILL183":true,"MOD_SKILL566":true,"MOD_SKILL604":true,"MOD_EX_GENDER_ATTR":true,"MOD_EX_ATTR_PIERCE":true,"MOD_SKILL903":true,"MOD_SKILL730":true,"MOD_SKILL746":true,"MOD_SKILL505":true,"MOD_SKILL960":true,"MOD_SKILL964":true,"MOD_SKILL106":true,"MOD_SKILL709":true,"MOD_SKILL722":true,"MOD_SKILL737":true,"MOD_SKILL714":true,"MOD_EX_PURITY":true,"MOD_SKILL26":true,"MOD_SKILL265":true,"MOD_SKILL507":true,"MOD_SKILL113":true,"MOD_INSTANCE10":true,"MOD_SKILL748":true,"MOD_SKILL27":true,"MOD_SKILL489":true,"MOD_SKILL266":true,"MOD_SKILL81":true,"MOD_SKILL509":true,"MOD_SKILL510":true,"MOD_SKILL962":true};

export const originalLobbyDefaults:OriginalTemplateContext={"max_private_room_num":3,"gstate":{"0":"<font color=\"grey\">已结束</font>","5":"正在准备","10":"即将开始","20":"开放激活","30":"人数已满","40":"<font color=\"yellow\">连斗中</font>","50":"<font color=\"red\">死斗中</font>"},"gwin":["程序故障","全部死亡","最后幸存","锁定解除","无人参加","核弹引爆","GM中止","幻境解离","挑战结束"],"gtinfo":{"0":"标准模式","1":"<font class=\"cyan\">除错挑战</font>","2":"<font class=\"orange\">周五活动</font>","3":"<font class=\"lime\">宝石乱斗</font>","4":"自选卡片","5":"幻界叫唤","6":"随机卡片","10":"SOLO模式","13":"<font class=\"vermilion\">试炼模式</font>","14":"组队模式","15":"<font class=\"yellow\">伐木挑战</font>","16":"<font class=\"green\">解离模式</font>","17":"教程模式","18":"<font class=\"cyan\">荣耀模式</font>","19":"<font class=\"red\">极速模式</font>","20":"<font class=\"gold\">肉鸽模式</font>","21":"<font class=\"ltazure\">蹲站模式</font>"},"gameversion":"N.E.W. v2.3.8","gamecredits":"\t<a href=\"https://github.com/winddramon/dts/\">DTS N.E.W. v2.3.8 developed by sillycross, Lein, Yoshiko_G, NazoBlaster, </a><br>\n\t<a>and illustrated by KHIBIKI, noui, 菌菌子, サークル　うどんワンタン, 浅水爆弾, けそ, mtkkk. 部分图像资源由 wdhwg001 提供. </a><br>\n\t<a href=\"http://www.jewel-s.jp/\">部分图像资源采用了JewelSaviorFREE[http://www.jewel-s.jp/]的免费素材 </a><br>\n\t<a>部分图像资源使用了ChatGPT、文心一言生成的素材 </a><br>\n\t<a href=\"http://www.amarilloviridian.com\">Reconsituted from 常磐大逃杀 GE600 by 冴月 麟, Yoshiko_G, sillycross, Lein. </a><br>\n\t<a>生存游戏 - BRA简体版V3.0.2 translated by azazil@loongyou.com </a><br>\n\t<a href=\"http://www.b-r-u.net/\">BRU (Battle Royale Ultimate) V0.22 </a><br>\n\t<a>特别鸣谢：h_7, 苹果姐姐, Martin_Chloride, 清理大师, 邪教徒, Sunset Cloudy </a> \n\t<a>感谢所有为这个游戏做出贡献的人 </a>","areainterval":[30],"areaadd":4,"arealimit":2,"areaesc":0};
