const PAGE="<!doctype html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <meta name=\"color-scheme\" content=\"dark\" />\n    <meta name=\"theme-color\" content=\"#0f0f23\" />\n    <title>无限轮回 · MUGEN LOOP</title>\n    <link rel=\"stylesheet\" href=\"/styles.css?v=0.4.0\" />\n  </head>\n  <body>\n    <a class=\"skip-link\" href=\"#main-content\">跳到主要内容</a>\n    <div class=\"scanlines\" aria-hidden=\"true\"></div>\n    <header class=\"topbar\">\n      <a class=\"brand\" href=\"#top\" aria-label=\"无限轮回首页\">\n        <span class=\"brand-mark\" aria-hidden=\"true\">ML</span>\n        <span><strong>無限輪廻</strong><small>MUGEN LOOP // DTR PROTOCOL</small></span>\n      </a>\n      <nav class=\"nav\" aria-label=\"主导航\">\n        <a class=\"is-active\" href=\"#lobby\">大厅</a><a href=\"#rooms\">对局</a><a href=\"#archive\">记录</a><a href=\"#help\">规则</a>\n      </nav>\n      <div class=\"net-state\" id=\"network-state\" role=\"status\"><span class=\"signal\" aria-hidden=\"true\"></span><span>连接中</span></div>\n    </header>\n\n    <main class=\"page\" id=\"main-content\" tabindex=\"-1\">\n      <section class=\"hero pixel-panel\" id=\"lobby\">\n        <div>\n          <p class=\"kicker\">CYCLE 0001 · TEST GATE OPEN</p>\n          <h1><span>无限轮回</span><small>生存不是终点，只是下一轮的入场券。</small></h1>\n          <p class=\"hero-copy\">基于旧版文字大逃杀规则推进逐模块迁移，保留房间、探索、战斗与禁区节奏。当前仍为玩法开发测试版，尚未开放付费。</p>\n        </div>\n        <dl class=\"cycle-card\" aria-label=\"当前轮回状态\">\n          <div><dt>轮回编号</dt><dd>#0001</dd></div><div><dt>阶段</dt><dd class=\"mint\">准备中</dd></div>\n          <div><dt>在线房间</dt><dd>03</dd></div><div><dt>服务器时刻</dt><dd id=\"server-clock\">--:--:--</dd></div>\n        </dl>\n      </section>\n\n      <div class=\"lobby-grid\">\n        <div class=\"main-stack\">\n          <section class=\"pixel-panel system-panel\" aria-labelledby=\"system-title\">\n            <header class=\"section-head\"><div><p class=\"section-code\">SYS // STATUS</p><h2 id=\"system-title\">系统状况</h2></div><span class=\"tag\">GAMEPLAY BETA 0.2</span></header>\n            <div class=\"system-grid\">\n              <div><span>游戏版本</span><strong>RE:BUILD 0.2.0</strong></div><div><span>世界状态</span><strong class=\"mint\">玩法开放</strong></div>\n              <div><span>数据库</span><strong id=\"db-state\">检测中</strong></div><div><span>实时通道</span><strong id=\"socket-state\">检测中</strong></div>\n            </div>\n            <div class=\"system-message\" id=\"system-message\" role=\"status\">正在读取边缘节点状态……</div>\n          </section>\n\n          <section class=\"pixel-panel rooms-panel\" id=\"rooms\" aria-labelledby=\"rooms-title\">\n            <header class=\"section-head\"><div><p class=\"section-code\">ROOM // MATCHMAKING</p><h2 id=\"rooms-title\">房间列表</h2></div><button class=\"text-button\" id=\"refresh-rooms\" type=\"button\">重新检测</button></header>\n            <p class=\"section-note\">三种模式均可直接游玩；房间状态会实时保存，断线重连后继续当前轮回。</p>\n            <table class=\"room-table\">\n              <thead><tr><th>编号</th><th>模式</th><th>状态</th><th>人数</th><th>区域</th><th>运行时间</th><th>操作</th></tr></thead>\n              <tbody>\n                <tr>\n                  <td data-label=\"编号\">01</td><td data-label=\"模式\"><strong class=\"coral\">教程轮回</strong></td><td data-label=\"状态\"><span class=\"status-badge ready\">开放激活</span></td>\n                  <td data-label=\"人数\" id=\"tutorial-count\">0 / 1</td><td data-label=\"区域\">新宿废层</td><td data-label=\"运行时间\">常驻</td><td data-label=\"操作\"><button class=\"room-action\" data-room=\"tutorial\" type=\"button\">进入</button></td>\n                </tr>\n                <tr>\n                  <td data-label=\"编号\">02</td><td data-label=\"模式\"><strong class=\"coral\">标准大逃杀</strong></td><td data-label=\"状态\"><span class=\"status-badge waiting\">开放中</span></td>\n                  <td data-label=\"人数\" id=\"standard-count\">0 / 8</td><td data-label=\"区域\">轮回城区</td><td data-label=\"运行时间\" id=\"standard-turn\">TURN 0</td><td data-label=\"操作\"><button class=\"room-action\" data-room=\"standard-main-v2\" data-mode=\"standard\" type=\"button\">进入</button></td>\n                </tr>\n                <tr>\n                  <td data-label=\"编号\">03</td><td data-label=\"模式\"><strong class=\"cyan\">无限试炼</strong></td><td data-label=\"状态\"><span class=\"status-badge waiting\">开放中</span></td>\n                  <td data-label=\"人数\" id=\"infinite-count\">0 / 8</td><td data-label=\"区域\">第零候车室</td><td data-label=\"运行时间\" id=\"infinite-turn\">TURN 0</td><td data-label=\"操作\"><button class=\"room-action\" data-room=\"infinite-main-v2\" data-mode=\"infinite\" type=\"button\">进入</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </section>\n\n          <section class=\"pixel-panel tutorial-console\" id=\"tutorial-console\" aria-labelledby=\"tutorial-title\" hidden>\n            <header class=\"section-head\"><div><p class=\"section-code\">TRAINING // LIVE</p><h2 id=\"tutorial-title\">基础行动训练</h2></div><span class=\"tag\" id=\"tutorial-status\">进行中</span></header>\n            <div class=\"tutorial-stats\" aria-label=\"玩家状态\">\n              <div><span>生命</span><strong id=\"tutorial-hp\">-- / --</strong></div><div><span>体力</span><strong id=\"tutorial-sp\">-- / --</strong></div>\n              <div><span>区域</span><strong id=\"tutorial-area\">--</strong></div><div><span>状态</span><strong id=\"tutorial-condition\">--</strong></div>\n            </div>\n            <div class=\"tutorial-objective\"><span>当前目标</span><strong id=\"tutorial-objective\">等待房间状态……</strong></div>\n            <p class=\"tutorial-log\" id=\"tutorial-log\" role=\"status\">身份验证后开始训练。</p>\n            <div class=\"tutorial-actions\" aria-label=\"教程行动\">\n              <button type=\"button\" data-tutorial-action=\"tutorial_move\">移动到旧站台</button>\n              <button type=\"button\" data-tutorial-action=\"tutorial_search\">探索</button>\n              <button type=\"button\" data-tutorial-action=\"tutorial_pickup\">拾取发现物</button>\n              <button type=\"button\" data-tutorial-action=\"tutorial_use_ration\">使用异常补给</button>\n              <button type=\"button\" data-tutorial-action=\"tutorial_use_purifier\">使用净化针剂</button>\n            </div>\n          </section>\n\n          <section class=\"pixel-panel game-console\" id=\"game-console\" aria-labelledby=\"game-console-title\" hidden>\n            <header class=\"section-head\"><div><p class=\"section-code\" id=\"game-mode-code\">SURVIVAL // INFINITE</p><h2 id=\"game-console-title\">无限试炼控制台</h2></div><span class=\"tag\" id=\"game-phase\">待机</span></header>\n            <div class=\"game-stats\" aria-label=\"对局状态\">\n              <div><span>生命</span><strong id=\"game-hp\">--</strong></div><div><span>体力</span><strong id=\"game-sp\">--</strong></div>\n              <div><span>等级</span><strong id=\"game-level\">--</strong></div><div><span>经验</span><strong id=\"game-exp\">--</strong></div>\n              <div><span>LOOP</span><strong id=\"game-money\">--</strong></div><div><span>波次</span><strong id=\"game-wave\">--</strong></div>\n              <div><span>击杀</span><strong id=\"game-kills\">--</strong></div><div><span>周目</span><strong id=\"game-cycle\">--</strong></div>\n            </div>\n            <div class=\"game-location\"><span>当前位置</span><strong id=\"game-area\">--</strong><small id=\"game-zone\">安全区域</small><small id=\"game-weather\">天气 --</small><small id=\"game-area-timer\">封锁倒计时 --</small></div>\n            <p class=\"game-notice\" id=\"game-notice\" role=\"status\">进入房间后同步对局状态。</p>\n            <div class=\"game-columns\">\n              <div>\n                <h3>35 地区地图</h3><p class=\"game-map-hint\" id=\"game-map-note\">恢复旧版区域与禁区规则中……</p><div class=\"map-actions\" id=\"game-map\"></div>\n                <h3>遭遇</h3><div class=\"encounter-card\" id=\"game-encounter\">暂未发现敌人或物品。</div>\n                <div class=\"game-actions\">\n                  <button type=\"button\" data-game-action=\"game_search\">探索</button><button type=\"button\" data-game-action=\"game_attack\">攻击</button>\n                  <button type=\"button\" data-game-action=\"game_flee\">撤离</button><button type=\"button\" data-game-action=\"game_pickup\">拾取</button>\n                  <button type=\"button\" data-game-action=\"game_rest\">休息</button><button type=\"button\" data-game-action=\"game_restart\">重新轮回</button>\n                </div>\n              </div>\n              <div>\n                <h3>装备与背包（6 格）</h3><div class=\"equipment\" id=\"game-equipment\"></div><div class=\"equipment\" id=\"game-armor-parts\"></div><div class=\"equipment\" id=\"game-proficiencies\"></div><div class=\"inventory\" id=\"game-inventory\"></div>\n                <h3>战术姿态</h3><div class=\"tactic-list\"><button type=\"button\" data-game-tactic=\"balanced\">均衡</button><button type=\"button\" data-game-tactic=\"aggressive\">强攻</button><button type=\"button\" data-game-tactic=\"defensive\">防守</button><button type=\"button\" data-game-tactic=\"scavenge\">搜刮</button></div>\n                <div id=\"game-team-panel\"><h3>组队（最多 5 人）</h3><div class=\"team-actions\" id=\"game-team-actions\"></div></div><div id=\"game-craft-panel\"><h3>道具合成</h3><div class=\"craft-actions\" id=\"game-craft-actions\"></div></div><div id=\"game-shop\" hidden><h3>区域商店</h3><div class=\"shop-list\" id=\"game-shop-list\"></div></div>\n                <div id=\"game-targets\" hidden><h3>同区域玩家</h3><div class=\"target-list\" id=\"game-target-list\"></div></div>\n                <div id=\"game-corpses\" hidden><h3>遗留战利品</h3><div class=\"corpse-list\" id=\"game-corpse-list\"></div></div>\n                <h3>本轮排行</h3><ol class=\"game-ranking\" id=\"game-ranking\"></ol>\n              </div>\n            </div>\n            <h3>行动记录</h3><ol class=\"game-log\" id=\"game-log\" aria-live=\"polite\"></ol>\n            <form class=\"game-chat\" id=\"game-chat-form\"><label class=\"sr-only\" for=\"game-chat-input\">房间消息</label><input id=\"game-chat-input\" maxlength=\"200\" placeholder=\"输入房间消息\" autocomplete=\"off\" /><button type=\"submit\">发送</button></form>\n          </section>\n\n          <section class=\"pixel-panel archive-panel\" id=\"archive\" aria-labelledby=\"archive-title\">\n            <header class=\"section-head\"><div><p class=\"section-code\">LOG // LAST CYCLE</p><h2 id=\"archive-title\">最近记录</h2></div></header>\n            <ol class=\"event-log\"><li><time>NOW</time><span>标准大逃杀与无限试炼逐步恢复旧版玩法。</span></li><li><time>PASS</time><span>战斗、禁区、商店、掉落与断线恢复验收通过。</span></li><li><time>PASS</time><span>边缘实时房间与数据隔离验收通过。</span></li></ol>\n          </section>\n        </div>\n\n        <aside class=\"side-stack\">\n          <section class=\"pixel-panel login-panel\" aria-labelledby=\"login-title\">\n            <header class=\"section-head compact\"><div><p class=\"section-code\">PLAYER // ACCESS</p><h2 id=\"login-title\">玩家接入</h2></div></header>\n            <form id=\"login-form\" novalidate>\n              <label for=\"login-email\">邮箱 <span class=\"required\">必填</span></label><input id=\"login-email\" name=\"email\" type=\"email\" autocomplete=\"email\" placeholder=\"player@example.com\" required />\n              <label for=\"login-password\">密码 <span class=\"required\">必填</span></label><input id=\"login-password\" name=\"password\" type=\"password\" autocomplete=\"current-password\" placeholder=\"至少 8 位\" minlength=\"8\" required />\n              <div class=\"auth-actions\"><button class=\"primary-button\" type=\"submit\">进入轮回</button><button class=\"secondary-button\" id=\"signup-button\" type=\"button\">创建账号</button></div>\n              <button class=\"text-button logout-button\" id=\"logout-button\" type=\"button\" hidden>退出账号</button>\n              <p class=\"form-note\" id=\"login-note\" aria-live=\"polite\">玩法开发阶段可直接以游客身份进入；正式账号稍后统一完善。</p>\n            </form>\n          </section>\n\n          <section class=\"pixel-panel trial-panel\" aria-labelledby=\"trial-title\">\n            <p class=\"section-code\">DAILY // TRIAL</p><h2 id=\"trial-title\">今日试炼</h2><div class=\"trial-poster\" aria-hidden=\"true\"><span>零</span><i></i></div>\n            <h3>終電のない駅</h3><p>列车不会抵达。收集三枚记忆碎片，在禁区收缩前找到离站方式。</p>\n            <dl class=\"reward-list\"><div><dt>危险度</dt><dd>★★★☆☆</dd></div><div><dt>基础奖励</dt><dd>120 LOOP</dd></div></dl>\n          </section>\n\n          <section class=\"pixel-panel notice-panel\" id=\"help\" aria-labelledby=\"notice-title\">\n            <p class=\"section-code\">NOTICE // TEST</p><h2 id=\"notice-title\">测试须知</h2>\n            <ul><li>教程、标准大逃杀、无限试炼为开发测试版，原版功能仍在迁移中。</li><li>游客可直接进入，账号、支付与分销将在玩法定版后完善。</li><li>商业素材全部采用原创或明确授权版本。</li></ul>\n          </section>\n        </aside>\n      </div>\n\n      <footer class=\"footer\"><span>WORKING TITLE · 無限輪廻</span><span>Cloudflare Workers · Durable Objects · Supabase</span></footer>\n    </main>\n    <script type=\"module\" src=\"/app.js?v=0.4.0\"></script>\n  </body>\n</html>\n";
const CSS="@import url(\"https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@600;700&display=swap\");\n\n:root {\n  color-scheme: dark;\n  --bg: #0f0f23; --surface: #17172c; --surface-2: #20203a; --ink: #f8fafc; --muted: #a7a9bf;\n  --indigo: #6e63ff; --border: #5147b8; --mint: #7ee2a8; --cyan: #69d8ef; --coral: #ff8b70;\n  --amber: #f3c969; --danger: #ef646f;\n  font-family: \"Noto Sans JP\", system-ui, sans-serif; background: var(--bg); color: var(--ink); font-synthesis: none;\n}\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; }\nbody { margin: 0; min-width: 320px; min-height: 100vh; background: linear-gradient(rgba(15,15,35,.94),rgba(15,15,35,.98)), repeating-linear-gradient(90deg,transparent 0 31px,rgba(110,99,255,.12) 31px 32px), repeating-linear-gradient(0deg,transparent 0 31px,rgba(110,99,255,.1) 31px 32px); }\nbutton, input { font: inherit; } button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; } a { color: inherit; text-decoration: none; } button { cursor: pointer; }\nbutton:disabled { cursor: wait; opacity: .55; }\n:focus-visible { outline: 3px solid var(--amber); outline-offset: 3px; }\n.skip-link { position: fixed; left: 12px; top: 8px; z-index: 30; padding: 10px 14px; color: #101019; background: var(--amber); transform: translateY(-150%); transition: transform .18s ease-out; }\n.skip-link:focus { transform: translateY(0); }\n.scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 20; opacity: .18; background: repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.28) 3px 4px); }\n.topbar { position: sticky; top: 0; z-index: 10; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; min-height: 72px; padding: 10px clamp(16px,4vw,56px); border-bottom: 1px solid var(--border); background: rgba(15,15,35,.94); backdrop-filter: blur(12px); }\n.brand { display: flex; align-items: center; gap: 12px; min-height: 48px; }\n.brand-mark { display: grid; place-items: center; width: 44px; height: 44px; border: 2px solid var(--ink); background: var(--indigo); box-shadow: 4px 4px 0 #080811; font-weight: 900; }\n.brand strong { display: block; font: 700 1.05rem/1.2 \"Noto Serif JP\",serif; letter-spacing: .12em; }\n.brand small { display: block; margin-top: 4px; color: var(--muted); font: 700 .62rem/1 monospace; letter-spacing: .08em; }\n.nav { display: flex; justify-content: center; gap: 4px; }\n.nav a { display: grid; place-items: center; min-width: 64px; min-height: 44px; padding: 0 12px; color: var(--muted); font-size: .88rem; border-bottom: 2px solid transparent; transition: color .18s,background .18s,border-color .18s; }\n.nav a:hover, .nav a.is-active { color: var(--ink); background: #242343; border-color: var(--cyan); }\n.net-state { display: flex; align-items: center; gap: 8px; color: var(--muted); font: 700 .75rem/1 monospace; }\n.signal { width: 10px; height: 10px; background: var(--amber); box-shadow: 0 0 12px currentColor; }\n.net-state.is-online { color: var(--mint); } .net-state.is-online .signal { background: var(--mint); }\n.net-state.is-offline { color: var(--danger); } .net-state.is-offline .signal { background: var(--danger); }\n.page { width: min(1240px,calc(100% - 32px)); margin: 0 auto; padding: 28px 0 56px; }\n.pixel-panel { position: relative; border: 1px solid var(--border); background: linear-gradient(145deg,rgba(31,31,60,.94),rgba(20,20,42,.96)); box-shadow: 5px 5px 0 #080811; }\n.pixel-panel::before { content: \"\"; position: absolute; inset: 6px; pointer-events: none; border: 1px solid rgba(126,226,168,.07); }\n.hero { display: grid; grid-template-columns: 1fr minmax(260px,.42fr); gap: 28px; align-items: end; padding: clamp(24px,5vw,54px); overflow: hidden; }\n.hero::after { content: \"輪\"; position: absolute; right: 22%; top: -38px; color: rgba(110,99,255,.08); font: 900 14rem/1 \"Noto Serif JP\",serif; transform: rotate(8deg); }\n.kicker, .section-code { margin: 0 0 8px; color: var(--cyan); font: 700 .68rem/1.3 monospace; letter-spacing: .14em; }\nh1, h2, h3, p { position: relative; z-index: 1; }\nh1 { margin: 0; font: 700 clamp(2.5rem,7vw,5.8rem)/.95 \"Noto Serif JP\",serif; letter-spacing: .08em; text-shadow: 4px 4px 0 #19165e; }\nh1 small { display: block; margin-top: 20px; font: 700 clamp(.92rem,2vw,1.2rem)/1.5 \"Noto Sans JP\",sans-serif; letter-spacing: .08em; text-shadow: none; color: var(--mint); }\n.hero-copy { max-width: 680px; margin: 22px 0 0; color: #c9cbda; line-height: 1.8; }\n.cycle-card { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; margin: 0; border: 1px solid #5b55a4; background: rgba(10,10,24,.58); }\n.cycle-card div { padding: 15px; border-right: 1px solid #3a3768; border-bottom: 1px solid #3a3768; }\n.cycle-card div:nth-child(even) { border-right: 0; } .cycle-card div:nth-child(n+3) { border-bottom: 0; }\n.cycle-card dt { color: var(--muted); font-size: .72rem; } .cycle-card dd { margin: 5px 0 0; font: 700 .92rem/1.3 monospace; }\n.lobby-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(280px,340px); gap: 18px; margin-top: 18px; }\n.main-stack, .side-stack { display: grid; gap: 18px; align-content: start; }\n.system-panel, .rooms-panel, .archive-panel, .login-panel, .trial-panel, .notice-panel { padding: 22px; }\n.section-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 16px; }\n.section-head h2, .trial-panel h2, .notice-panel h2 { margin: 0; font: 700 1.22rem/1.2 \"Noto Serif JP\",serif; letter-spacing: .08em; }\n.tag { padding: 5px 8px; border: 1px solid #5e568b; color: var(--amber); background: #131329; font: 700 .65rem/1 monospace; }\n.system-grid { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid #39376a; }\n.system-grid div { padding: 14px; border-right: 1px solid #39376a; } .system-grid div:last-child { border-right: 0; }\n.system-grid span { display: block; color: var(--muted); font-size: .72rem; } .system-grid strong { display: block; margin-top: 6px; font: 700 .8rem/1.3 monospace; }\n.system-message { margin-top: 12px; padding: 10px 12px; border-left: 3px solid var(--indigo); color: #cacbe0; background: rgba(9,9,24,.55); font-size: .8rem; line-height: 1.6; }\n.mint { color: var(--mint)!important; } .cyan { color: var(--cyan)!important; } .coral { color: var(--coral)!important; }\n.text-button { min-height: 44px; padding: 0 14px; border: 1px solid #5550a0; color: var(--cyan); background: #17172c; }\n.text-button:hover { background: #292751; }\n.section-note { margin: -5px 0 14px; color: var(--muted); font-size: .78rem; line-height: 1.65; }\n.room-table { width: 100%; border-collapse: collapse; font-size: .8rem; }\n.room-table th { padding: 10px 8px; border: 1px solid #343261; color: #d9dafe; background: #302d66; text-align: left; }\n.room-table td { padding: 11px 8px; border: 1px solid #323054; background: rgba(11,11,27,.46); }\n.room-table tbody tr:hover td { background: rgba(48,45,102,.32); }\n.status-badge { display: inline-flex; align-items: center; min-height: 26px; padding: 0 7px; border: 1px solid currentColor; font-size: .68rem; font-weight: 700; }\n.status-badge.ready { color: var(--mint); } .status-badge.waiting { color: var(--amber); }\n.room-action { min-width: 64px; min-height: 44px; border: 1px solid var(--indigo); color: var(--ink); background: #2b285c; box-shadow: 3px 3px 0 #090912; }\n.room-action:active { transform: translate(3px,3px); box-shadow: none; }\n.event-log { list-style: none; margin: 0; padding: 0; }\n.event-log li { display: grid; grid-template-columns: 54px 1fr; gap: 12px; padding: 10px 0; border-top: 1px dashed #39375d; color: #c9cad8; font-size: .8rem; }\n.event-log time { color: var(--cyan); font: 700 .76rem/1.5 monospace; }\n.login-panel form { display: grid; gap: 9px; }\n.login-panel label { color: #d9daec; font-size: .78rem; font-weight: 700; }\n.required { margin-left: 5px; color: var(--coral); font-size: .68rem; }\n.login-panel input { width: 100%; min-height: 46px; padding: 0 12px; border: 1px solid #504c83; border-radius: 0; color: var(--ink); background: #0d0d21; }\n.login-panel input::placeholder { color: #6f7088; }\n.primary-button { min-height: 48px; margin-top: 8px; border: 1px solid #f59a58; color: #160d08; background: var(--coral); box-shadow: 4px 4px 0 #080811; font-weight: 900; letter-spacing: .08em; }\n.primary-button:active { transform: translate(4px,4px); box-shadow: none; }\n.auth-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n.secondary-button { min-height: 48px; margin-top: 8px; border: 1px solid var(--cyan); color: var(--cyan); background: #12132c; font-weight: 900; }\n.secondary-button:hover { background: #20234b; }\n.logout-button { width: 100%; }\n.form-note { min-height: 38px; margin: 4px 0 0; color: var(--muted); font-size: .72rem; line-height: 1.6; } .form-note.is-error { color: var(--coral); }\n.tutorial-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; margin-bottom: 14px; background: var(--line); border: 1px solid var(--line); }\n.tutorial-stats > div { display: grid; gap: 5px; padding: 12px; background: #111127; }\n.tutorial-stats span, .tutorial-objective span { color: var(--muted); font-size: .7rem; letter-spacing: .08em; }\n.tutorial-stats strong { color: var(--mint); font-size: .86rem; }\n.tutorial-objective { display: grid; gap: 7px; padding: 14px; border-left: 3px solid var(--cyan); background: #12152c; }\n.tutorial-objective strong { font-size: .9rem; line-height: 1.6; }\n.tutorial-log { min-height: 48px; margin: 12px 0; padding: 10px 12px; color: #d4d4e7; background: #0b0b1a; border: 1px dashed #45426f; line-height: 1.6; }\n.tutorial-actions { display: flex; flex-wrap: wrap; gap: 8px; }\n.tutorial-actions button { min-height: 44px; padding: 0 13px; border: 1px solid #5550a0; color: var(--cyan); background: #17172c; font-weight: 800; }\n.tutorial-actions button:not(:disabled):hover { background: #292751; }\n.game-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; margin-bottom: 14px; border: 1px solid var(--line); background: var(--line); }\n.game-stats > div { display: grid; gap: 4px; padding: 10px 12px; background: #111127; }\n.game-stats span, .game-location span { color: var(--muted); font-size: .66rem; letter-spacing: .08em; }\n.game-stats strong { color: var(--mint); font-size: .9rem; }\n.game-location { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-left: 3px solid var(--cyan); background: #12152c; }\n.game-location strong { color: var(--cyan); } .game-location small { margin-left: auto; color: var(--mint); }\n.game-notice { min-height: 46px; margin: 12px 0; padding: 10px 12px; border: 1px dashed #45426f; background: #0b0b1a; line-height: 1.6; }\n.game-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }\n.game-columns h3, .game-console > h3 { margin: 14px 0 8px; color: #dadbef; font-size: .82rem; letter-spacing: .08em; }\n.map-actions, .game-actions, .target-list, .tactic-list { display: flex; flex-wrap: wrap; gap: 8px; }\n.map-actions button, .game-actions button, .inventory button, .shop-list button, .target-list button, .tactic-list button, .corpse-list button, .equipment button { min-height: 42px; padding: 0 11px; border: 1px solid #5550a0; color: var(--cyan); background: #17172c; font-weight: 800; }\n.tactic-list button.is-active { border-color: var(--mint); color: var(--mint); background: #172b2b; }\n.map-actions button.warn { border-color: var(--coral); color: var(--coral); }\n.encounter-card, .equipment { min-height: 54px; padding: 11px 12px; border: 1px solid #3d3b65; background: #101025; line-height: 1.6; }\n.inventory, .shop-list, .corpse-list { display: grid; gap: 7px; margin-top: 8px; }\n.inventory-row, .shop-row, .corpse-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 9px 10px; border: 1px solid #333157; background: #0e0e20; }\n.inventory-row small, .shop-row small { color: var(--muted); }\n.inventory-controls { display: flex; gap: 5px; }\n.inventory-controls button { min-width: 46px; }\n.game-log { max-height: 190px; overflow: auto; margin: 0; padding: 10px 10px 10px 32px; border: 1px solid #333157; background: #090919; }\n.game-log li { padding: 5px 0; color: #c7c8dc; line-height: 1.5; }\n.game-ranking { margin: 0; padding: 8px 8px 8px 34px; border: 1px solid #333157; background: #090919; }\n.game-ranking li { padding: 6px 4px; color: #aeb0c9; line-height: 1.4; }\n.game-ranking li.is-self { color: var(--mint); font-weight: 800; }\n.game-chat { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 9px; }\n.game-chat input { min-height: 44px; padding: 0 12px; border: 1px solid #45426f; color: var(--ink); background: #0b0b1a; }\n.game-chat button { min-height: 44px; padding: 0 18px; border: 1px solid var(--cyan); color: var(--cyan); background: #17172c; font-weight: 900; }\n.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }\n.trial-poster { position: relative; display: grid; place-items: center; aspect-ratio: 16/8; margin: 16px 0; overflow: hidden; border: 1px solid #4d497b; background: radial-gradient(circle at 65% 35%,#5b2e53,transparent 28%),linear-gradient(135deg,#17172c,#282454 50%,#111125); }\n.trial-poster::before, .trial-poster::after { content: \"\"; position: absolute; background: var(--coral); }\n.trial-poster::before { width: 140%; height: 3px; transform: rotate(-17deg); opacity: .65; } .trial-poster::after { width: 3px; height: 140%; transform: rotate(23deg); opacity: .45; }\n.trial-poster span { z-index: 1; font: 900 4rem/1 \"Noto Serif JP\",serif; color: rgba(248,250,252,.9); text-shadow: 4px 4px 0 #302d66; }\n.trial-poster i { position: absolute; inset: 12px; border: 1px solid rgba(105,216,239,.3); }\n.trial-panel h3 { margin: 0 0 8px; color: var(--amber); letter-spacing: .08em; }\n.trial-panel > p:not(.section-code), .notice-panel li { color: #c5c6d6; font-size: .78rem; line-height: 1.75; }\n.reward-list { margin: 14px 0 0; } .reward-list div { display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px dashed #3b395e; }\n.reward-list dt { color: var(--muted); font-size: .74rem; } .reward-list dd { margin: 0; color: var(--mint); font: 700 .74rem/1.5 monospace; }\n.notice-panel ul { margin: 14px 0 0; padding-left: 20px; }\n.footer { display: flex; justify-content: space-between; gap: 16px; margin-top: 22px; padding: 14px 4px; color: #73758e; font: 700 .64rem/1.5 monospace; letter-spacing: .06em; }\n@media (max-width: 920px) {\n  .topbar { grid-template-columns: 1fr auto; } .nav { grid-column: 1/-1; justify-content: flex-start; overflow-x: auto; }\n  .lobby-grid { grid-template-columns: 1fr; } .side-stack { grid-template-columns: repeat(2,minmax(0,1fr)); } .notice-panel { grid-column: 1/-1; }\n  .system-grid { grid-template-columns: repeat(2,1fr); } .system-grid div:nth-child(2) { border-right: 0; } .system-grid div:nth-child(-n+2) { border-bottom: 1px solid #39376a; }\n}\n@media (max-width: 720px) {\n  .page { width: min(100% - 20px,1240px); padding-top: 10px; } .topbar { gap: 8px; padding-inline: 10px; }\n  .brand small { display: none; } .net-state span:last-child { display: none; } .nav { margin-inline: -10px; padding-inline: 10px; overflow: visible; } .nav a { flex: 1; min-width: 0; padding-inline: 9px; }\n  .hero { grid-template-columns: 1fr; padding: 26px 20px; } h1 { font-size: clamp(2.35rem,14vw,4rem); }\n  .system-panel, .rooms-panel, .archive-panel, .login-panel, .trial-panel, .notice-panel { padding: 18px 14px; }\n  .side-stack { grid-template-columns: 1fr; } .notice-panel { grid-column: auto; }\n  .room-table, .room-table tbody { display: block; } .room-table thead { position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px; overflow: hidden; }\n  .room-table tr { display: grid; grid-template-columns: repeat(2,1fr); margin-bottom: 12px; border: 1px solid #403d72; }\n  .room-table td { display: grid; grid-template-columns: 72px 1fr; align-items: center; min-height: 48px; border: 0; border-bottom: 1px solid #302e52; }\n  .room-table td::before { content: attr(data-label); color: var(--muted); font-size: .68rem; }\n  .room-table td:nth-child(2), .room-table td:nth-child(5), .room-table td:last-child { grid-column: 1/-1; } .room-table td:last-child { border-bottom: 0; } .room-action { width: 100%; }\n  .section-note, .trial-panel > p:not(.section-code), .notice-panel li, .room-table, .form-note { font-size: 1rem; }\n  .tutorial-stats { grid-template-columns: 1fr 1fr; }\n  .tutorial-actions { display: grid; grid-template-columns: 1fr; }\n  .game-stats { grid-template-columns: 1fr 1fr; }\n  .game-columns { grid-template-columns: 1fr; }\n  .game-actions, .map-actions { display: grid; grid-template-columns: 1fr 1fr; }\n  .event-log li { font-size: .95rem; }\n  .footer { flex-direction: column; }\n}\n@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *,*::before,*::after { animation-duration: .01ms!important; transition-duration: .01ms!important; } }\n\n/* Legacy 35-region travel selector: bounded scroll area to avoid pushing combat below the fold. */\n.map-actions { max-height: 284px; overflow-y: auto; padding: 8px; border: 1px solid #333157; border-radius: 4px; align-content: start; }\n.game-map-hint { color: var(--muted); font-size: .77rem; margin: 0 0 8px; line-height: 1.5; }\n.map-actions button[aria-current=\"location\"] { border-color: var(--cyan); background: #192b35; color: #defcff; }\n@media (max-width: 640px) { .map-actions { max-height: 320px; } }\n\n/* Additional legacy systems */\n.team-actions,.craft-actions{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}.team-actions button,.craft-actions button{min-height:42px;padding:8px 12px;background:#17172c;border:1px solid #5550a0;color:var(--cyan);font-weight:700}.team-actions button:disabled,.craft-actions button:disabled{opacity:.45;cursor:not-allowed}#game-weather{display:block;font-size:.8rem;color:var(--mint)}#game-proficiencies,#game-armor-parts{font-size:.79rem;line-height:1.7}\n";
const APP="const byId = (id) => document.getElementById(id);\nconst networkState = byId(\"network-state\");\nconst dbState = byId(\"db-state\");\nconst socketState = byId(\"socket-state\");\nconst systemMessage = byId(\"system-message\");\nconst authStorageKey = \"mugen-loop-auth-v1\";\nconst guestStorageKey = \"mugen-loop-guest-v1\";\nlet authSession = null;\nlet tutorialSocket = null;\nlet tutorialState = null;\nlet gameSocket = null;\nlet gameView = null;\nlet activeGameRoom = null;\nlet guestId = sessionStorage.getItem(guestStorageKey);\nif (!guestId) {\n  guestId = crypto.randomUUID();\n  sessionStorage.setItem(guestStorageKey, guestId);\n}\n\nfunction setAuthSession(session) {\n  authSession = session?.access_token ? session : null;\n  if (authSession) sessionStorage.setItem(authStorageKey, JSON.stringify(authSession));\n  else sessionStorage.removeItem(authStorageKey);\n  renderAuth();\n}\n\nfunction renderAuth() {\n  const email = byId(\"login-email\");\n  const password = byId(\"login-password\");\n  const actions = document.querySelector(\".auth-actions\");\n  const logout = byId(\"logout-button\");\n  const note = byId(\"login-note\");\n  const loggedIn = Boolean(authSession?.access_token);\n  email.disabled = loggedIn; password.disabled = loggedIn;\n  actions.hidden = loggedIn; logout.hidden = !loggedIn;\n  note.classList.remove(\"is-error\");\n  if (loggedIn) {\n    email.value = authSession.user?.email ?? \"\"; password.value = \"\";\n    note.textContent = `已验证：${authSession.user?.email ?? \"轮回玩家\"}`;\n  } else {\n    note.textContent = \"玩法开发阶段可直接以游客身份进入；正式账号稍后统一完善。\";\n  }\n}\n\nfunction setAuthBusy(busy) {\n  document.querySelectorAll(\"#login-form button\").forEach((button) => { button.disabled = busy; });\n  byId(\"login-form\").setAttribute(\"aria-busy\", String(busy));\n}\n\nasync function authRequest(mode, payload = {}, accessToken = \"\") {\n  const response = await fetch(`/api/auth/${mode}`, {\n    method: \"POST\",\n    headers: {\n      \"content-type\": \"application/json\",\n      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})\n    },\n    body: mode === \"logout\" ? undefined : JSON.stringify(payload)\n  });\n  const data = await response.json().catch(() => ({}));\n  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || \"认证请求失败\");\n  return data;\n}\n\nfunction normalizeSession(data) {\n  if (!data?.access_token) return null;\n  return { ...data, expires_at: data.expires_at ?? Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600) };\n}\n\nasync function restoreAuth() {\n  try { authSession = JSON.parse(sessionStorage.getItem(authStorageKey) || \"null\"); } catch { authSession = null; }\n  if (authSession?.refresh_token && (authSession.expires_at ?? 0) <= Math.floor(Date.now() / 1000) + 60) {\n    try { setAuthSession(normalizeSession(await authRequest(\"refresh\", { refreshToken: authSession.refresh_token }))); }\n    catch { setAuthSession(null); }\n  } else renderAuth();\n}\n\nfunction updateAreaTimer() {\n  const target = byId(\"game-area-timer\");\n  if (!target || !gameView?.world?.areaDueAt) return;\n  const remaining = Math.max(0, Math.ceil((gameView.world.areaDueAt - Date.now()) / 1000));\n  const minutes = String(Math.floor(remaining / 60)).padStart(2, \"0\");\n  const seconds = String(remaining % 60).padStart(2, \"0\");\n  target.textContent = `下一次禁区封锁：${minutes}:${seconds}`;\n  target.className = remaining <= 60 ? \"coral\" : \"mint\";\n}\n\nfunction updateClock() {\n  byId(\"server-clock\").textContent = new Intl.DateTimeFormat(\"zh-CN\", {\n    timeZone: \"Asia/Shanghai\", hour: \"2-digit\", minute: \"2-digit\", second: \"2-digit\", hour12: false\n  }).format(new Date());\n}\n\nfunction checkSocket() {\n  return new Promise((resolve) => {\n    const protocol = location.protocol === \"https:\" ? \"wss:\" : \"ws:\";\n    const socket = new WebSocket(`${protocol}//${location.host}/api/rooms/lobby-preview/socket`);\n    const timeout = window.setTimeout(() => { socket.close(); socketState.textContent = \"超时\"; resolve(); }, 5000);\n    socket.addEventListener(\"open\", () => socket.send(JSON.stringify({ type: \"ping\", at: Date.now() })));\n    socket.addEventListener(\"message\", (event) => {\n      try {\n        const message = JSON.parse(event.data);\n        if (message.type === \"pong\") {\n          socketState.textContent = \"已连接\"; socketState.className = \"mint\";\n          clearTimeout(timeout); socket.close(); resolve();\n        }\n      } catch { /* Ignore non-protocol frames and wait for pong. */ }\n    });\n    socket.addEventListener(\"error\", () => { clearTimeout(timeout); socketState.textContent = \"异常\"; resolve(); }, { once: true });\n  });\n}\n\nfunction gameModeForRoom(roomId) {\n  if (roomId.startsWith(\"standard\")) return \"standard\";\n  if (roomId.startsWith(\"infinite\")) return \"infinite\";\n  return null;\n}\n\nfunction observeRoom(roomId, label) {\n  const protocol = location.protocol === \"https:\" ? \"wss:\" : \"ws:\";\n  if (roomId === \"tutorial\" && tutorialSocket) tutorialSocket.close();\n  const gameMode = gameModeForRoom(roomId);\n  if (gameMode && gameSocket) gameSocket.close();\n  const socket = new WebSocket(`${protocol}//${location.host}/api/rooms/${roomId}/socket`);\n  if (roomId === \"tutorial\") tutorialSocket = socket;\n  if (gameMode) {\n    if (activeGameRoom !== roomId) byId(\"game-log\").replaceChildren();\n    gameSocket = socket; activeGameRoom = roomId;\n  }\n  const timeout = window.setTimeout(() => { socket.close(); systemMessage.textContent = `${label}身份验证超时，请重试。`; }, 8000);\n  systemMessage.textContent = `正在验证 ${label} 的玩家身份……`;\n  const expectedPlayerId = authSession?.user?.id ?? `guest:${guestId}`;\n  socket.addEventListener(\"open\", () => socket.send(JSON.stringify(authSession?.access_token\n    ? { type: \"auth\", accessToken: authSession.access_token }\n    : { type: \"guest\", guestId })));\n  socket.addEventListener(\"message\", (event) => {\n    try {\n      const message = JSON.parse(event.data);\n      if (message.type === \"room_event\" && message.event?.type === \"player_joined\" && message.event.player?.id === expectedPlayerId) {\n        clearTimeout(timeout); systemMessage.textContent = `${label}身份验证成功，房间状态已同步。`;\n        if (roomId === \"tutorial\") {\n          byId(\"tutorial-console\").hidden = false;\n          sendTutorialAction(\"tutorial_start\");\n          byId(\"tutorial-console\").scrollIntoView({ behavior: matchMedia(\"(prefers-reduced-motion: reduce)\").matches ? \"auto\" : \"smooth\", block: \"start\" });\n        } else if (gameMode) {\n          byId(\"game-console\").hidden = false;\n          byId(\"game-console-title\").textContent = gameMode === \"standard\" ? \"标准大逃杀控制台\" : \"无限试炼控制台\";\n          byId(\"game-mode-code\").textContent = gameMode === \"standard\" ? \"SURVIVAL // BATTLE ROYALE\" : \"SURVIVAL // INFINITE\";\n          sendGameAction(\"game_enter\", { mode: gameMode });\n          byId(\"game-console\").scrollIntoView({ behavior: matchMedia(\"(prefers-reduced-motion: reduce)\").matches ? \"auto\" : \"smooth\", block: \"start\" });\n        } else socket.close();\n      } else if (message.type === \"tutorial_state\") {\n        renderTutorial(message.state, message.log, message.error);\n      } else if (message.type === \"room_event\" && message.event?.type === \"action\" && message.event.tutorial) {\n        renderTutorial(message.event.tutorial, message.event.log);\n      } else if (message.type === \"game_state\") {\n        renderGame(message.view, message.log, message.error, message.history);\n      } else if (message.type === \"error\" && message.code === \"auth_invalid\") {\n        clearTimeout(timeout); setAuthSession(null); systemMessage.textContent = \"登录状态已失效，请重新登录。\"; socket.close();\n      }\n    } catch { /* Ignore malformed frames. */ }\n  });\n  socket.addEventListener(\"error\", () => { clearTimeout(timeout); systemMessage.textContent = `${label}实时通道连接失败。`; }, { once: true });\n}\n\nfunction sendGameAction(action, payload) {\n  if (!gameSocket || gameSocket.readyState !== WebSocket.OPEN) {\n    byId(\"game-notice\").textContent = \"对局通道未连接，请重新进入无限试炼。\";\n    return;\n  }\n  gameSocket.send(JSON.stringify({ type: \"action\", commandId: crypto.randomUUID(), action, ...(payload ? { payload } : {}) }));\n}\n\nfunction appendGameLog(text, isError = false) {\n  if (!text) return;\n  const entry = document.createElement(\"li\");\n  entry.textContent = text;\n  if (isError) entry.className = \"coral\";\n  const log = byId(\"game-log\");\n  log.prepend(entry);\n  while (log.children.length > 20) log.lastElementChild.remove();\n}\n\nfunction actionButton(label, onClick, className = \"\") {\n  const button = document.createElement(\"button\");\n  button.type = \"button\"; button.textContent = label; button.className = className; button.addEventListener(\"click\", onClick);\n  return button;\n}\n\nfunction renderGame(view, log = \"对局状态已同步。\", error = \"\", history = []) {\n  if (!view?.player) return;\n  gameView = view;\n  updateAreaTimer();\n  const { player, world, areas, shop, targets, corpses, ranking } = view;\n  const area = areas.find(({ id }) => id === player.area);\n  byId(\"game-hp\").textContent = `${player.hp} / ${player.maxHp}`;\n  byId(\"game-sp\").textContent = `${player.sp} / ${player.maxSp}`;\n  byId(\"game-level\").textContent = player.level;\n  byId(\"game-exp\").textContent = `${player.exp} / ${player.level * 100}`;\n  byId(\"game-money\").textContent = player.money;\n  byId(\"game-wave\").textContent = player.wave;\n  byId(\"game-kills\").textContent = player.kills;\n  byId(\"game-cycle\").textContent = world.cycle;\n  byId(\"game-area\").textContent = area?.name ?? player.area;\n  byId(\"game-phase\").textContent = !player.alive ? \"已死亡\" : world.phase === \"finished\" ? \"已结算\" : `TURN ${world.turn}`;\n  const warnings = new Set(world.warningAreas ?? (world.warningArea ? [world.warningArea] : []));\n  const warning = warnings.has(player.area);\n  byId(\"game-zone\").textContent = world.forbidden.includes(player.area) ? \"禁区\" : warning ? \"即将封锁\" : \"安全区域\";\n  byId(\"game-zone\").className = warning || world.forbidden.includes(player.area) ? \"coral\" : \"mint\";\n  byId(\"game-weather\").textContent = `天气：${world.weather?.name ?? \"多云\"}`;\n  byId(\"game-notice\").textContent = error ? `${log}（${error}）` : log;\n  if (!byId(\"game-log\").children.length && history.length) {\n    [...history].reverse().forEach((entry) => appendGameLog(entry.kind === \"chat\" ? `玩家：${entry.text}` : entry.text));\n  }\n  appendGameLog(log, Boolean(error));\n\n  byId(\"game-map-note\").textContent = `共 ${areas.length} 个地区 · 可进入 ${areas.filter(({ id }) => !world.forbidden.includes(id)).length} 个 · 下一波预警 ${warnings.size} 个 · 移动消耗 15 SP`;\n  const map = byId(\"game-map\"); map.replaceChildren();\n  for (const destination of areas) {\n    const closed = world.forbidden.includes(destination.id);\n    const current = destination.id === player.area;\n    const warningSoon = warnings.has(destination.id);\n    const label = `${destination.grid} · ${destination.name}${closed ? \" · 禁区\" : warningSoon ? \" · 预警\" : current ? \" · 当前\" : \"\"}`;\n    const button = actionButton(label, () => sendGameAction(\"game_move\", { to: destination.id }), warningSoon || closed ? \"warn\" : \"\");\n    button.disabled = closed || current || !player.alive || Boolean(player.enemy);\n    if (current) button.setAttribute(\"aria-current\", \"location\");\n    map.append(button);\n  }\n\n  const encounter = byId(\"game-encounter\");\n  if (player.enemy) encounter.textContent = `${player.enemy.name} · HP ${player.enemy.hp}/${player.enemy.maxHp} · 攻击 ${player.enemy.attack} · 防御 ${player.enemy.defense}`;\n  else if (player.pendingItem) encounter.textContent = `发现物：${player.pendingItem.name} · ${player.pendingItem.kind} · 效果 ${player.pendingItem.power}`;\n  else encounter.textContent = \"暂未发现敌人或物品。\";\n\n  const availability = {\n    game_search: player.alive && !player.enemy && !player.pendingItem,\n    game_attack: player.alive && Boolean(player.enemy),\n    game_flee: player.alive && Boolean(player.enemy),\n    game_pickup: player.alive && Boolean(player.pendingItem),\n    game_rest: player.alive && !player.enemy,\n    game_restart: !player.alive || world.phase === \"finished\"\n  };\n  document.querySelectorAll(\"[data-game-action]\").forEach((button) => { button.disabled = !availability[button.dataset.gameAction]; });\n\n  const equipment = byId(\"game-equipment\"); equipment.replaceChildren();\n  const equipmentText = document.createElement(\"span\");\n  equipmentText.textContent = `武器：${player.weapon ? `${player.weapon.name}（威力 ${player.weapon.power} / 耐久 ${player.weapon.durability}）` : \"徒手\"}　护甲：${player.armor ? `${player.armor.name}（防御 ${player.armor.power} / 耐久 ${player.armor.durability}）` : \"无\"}　状态：${player.status === \"poisoned\" ? \"中毒\" : \"正常\"}`;\n  equipment.append(equipmentText);\n  if (player.weapon) equipment.append(actionButton(\"卸下武器\", () => sendGameAction(\"game_unequip\", { slot: \"weapon\" })));\n  if (player.armor) equipment.append(actionButton(\"卸下护甲\", () => sendGameAction(\"game_unequip\", { slot: \"armor\" })));\n  const armorParts = byId(\"game-armor-parts\"); armorParts.replaceChildren();\n  const slotLabels = { head: \"头部\", arms: \"手臂\", legs: \"腿部\" };\n  for (const [slot, label] of Object.entries(slotLabels)) {\n    const item = player.armorParts?.[slot];\n    armorParts.append(document.createTextNode(`${label}：${item ? item.name + \"（\" + item.power + \" 防御）\" : \"无\"}　`));\n    if (item) armorParts.append(actionButton(\"卸下\", () => sendGameAction(\"game_unequip\", { slot })));\n  }\n  const proficiencyNode = byId(\"game-proficiencies\"); proficiencyNode.replaceChildren();\n  const proficiencyNames = { wp: \"殴\", wk: \"斩\", wg: \"射\", wc: \"投\", wd: \"爆\", wf: \"灵\" };\n  proficiencyNode.textContent = Object.entries(proficiencyNames).map(([key, name]) => `${name}熟 ${player.proficiencies?.[key] ?? 0}`).join(\" · \");\n  const teamNode = byId(\"game-team-actions\"); teamNode.replaceChildren();\n  const currentTeam = player.teamId;\n  if (currentTeam) {\n    teamNode.append(document.createTextNode(`当前队伍：${(world.teams?.[currentTeam] ?? []).length}/5 人　`));\n    teamNode.append(actionButton(\"退出队伍\", () => sendGameAction(\"game_team_leave\")));\n  } else {\n    const create = actionButton(\"创建队伍（200 SP）\", () => sendGameAction(\"game_team_create\"));\n    create.disabled = player.sp <= 200 || !player.alive; teamNode.append(create);\n    for (const [teamId, members] of Object.entries(world.teams ?? {})) {\n      const join = actionButton(`加入队伍（${members.length}/5，100 SP）`, () => sendGameAction(\"game_team_join\", { teamId }));\n      join.disabled = members.length >= 5 || player.sp <= 100 || !player.alive;\n      teamNode.append(join);\n    }\n  }\n  const craftNode = byId(\"game-craft-actions\"); craftNode.replaceChildren();\n  for (const recipe of view.recipes ?? []) {\n    const available = recipe.ingredients.every((id) => player.inventory.some((item) => item.catalogId === id));\n    const button = actionButton(`合成 ${recipe.result}`, () => sendGameAction(\"game_craft\", { result: recipe.result }));\n    button.disabled = !available || !player.alive || Boolean(player.enemy);\n    craftNode.append(button);\n  }\n  const inventory = byId(\"game-inventory\"); inventory.replaceChildren();\n  inventory.setAttribute(\"aria-label\", `六格背包，已使用 ${player.inventory.length} / 6 格`);\n  if (!player.inventory.length) inventory.textContent = \"背包为空。\";\n  for (const item of player.inventory) {\n    const row = document.createElement(\"div\"); row.className = \"inventory-row\";\n    const info = document.createElement(\"div\");\n    const name = document.createElement(\"strong\"); name.textContent = item.name;\n    const detail = document.createElement(\"small\"); detail.textContent = ` ${item.kind} · 效果 ${item.power} · 耐久 ${item.durability}`;\n    info.append(name, detail);\n    const controls = document.createElement(\"div\"); controls.className = \"inventory-controls\";\n    if ([\"weapon\", \"armor\"].includes(item.kind)) controls.append(actionButton(\"装备\", () => sendGameAction(\"game_equip\", { instanceId: item.instanceId })));\n    if ([\"heal\", \"stamina\", \"antidote\"].includes(item.kind)) controls.append(actionButton(\"使用\", () => sendGameAction(\"game_use\", { instanceId: item.instanceId })));\n    if (item.kind === \"trap\") controls.append(actionButton(\"设置陷阱\", () => sendGameAction(\"game_trap_place\", { instanceId: item.instanceId })));\n    if (area?.shop) controls.append(actionButton(\"出售\", () => sendGameAction(\"game_shop_sell\", { instanceId: item.instanceId })));\n    controls.append(actionButton(\"丢弃\", () => sendGameAction(\"game_discard\", { instanceId: item.instanceId })));\n    row.append(info, controls); inventory.append(row);\n  }\n\n  const shopPanel = byId(\"game-shop\"); shopPanel.hidden = !area?.shop;\n  const shopList = byId(\"game-shop-list\"); shopList.replaceChildren();\n  if (area?.shop) for (const product of shop) {\n    const row = document.createElement(\"div\"); row.className = \"shop-row\";\n    const info = document.createElement(\"div\");\n    const name = document.createElement(\"strong\"); name.textContent = product.name;\n    const detail = document.createElement(\"small\"); detail.textContent = ` ${product.kind} · 效果 ${product.power} · ${product.price} LOOP`;\n    info.append(name, detail);\n    const buy = actionButton(\"购买\", () => sendGameAction(\"game_shop_buy\", { catalogId: product.catalogId }));\n    buy.disabled = !player.alive || player.money < product.price || player.inventory.length >= 6;\n    row.append(info, buy); shopList.append(row);\n  }\n\n  const targetPanel = byId(\"game-targets\"); targetPanel.hidden = targets.length === 0;\n  const targetList = byId(\"game-target-list\"); targetList.replaceChildren();\n  for (const target of targets) targetList.append(actionButton(`Lv.${target.level} 玩家 · HP ${target.hp}/${target.maxHp}`, () => sendGameAction(\"game_attack\", { targetId: target.id })));\n\n  document.querySelectorAll(\"[data-game-tactic]\").forEach((button) => {\n    button.classList.toggle(\"is-active\", button.dataset.gameTactic === player.tactic);\n    button.disabled = !player.alive;\n  });\n\n  const corpsePanel = byId(\"game-corpses\"); corpsePanel.hidden = corpses.length === 0;\n  const corpseList = byId(\"game-corpse-list\"); corpseList.replaceChildren();\n  for (const corpse of corpses) {\n    const row = document.createElement(\"div\"); row.className = \"corpse-row\";\n    const info = document.createElement(\"div\");\n    const title = document.createElement(\"strong\"); title.textContent = \"玩家遗留物\";\n    const detail = document.createElement(\"small\"); detail.textContent = ` ${corpse.money} LOOP · ${corpse.items.length} 件物品`;\n    info.append(title, detail);\n    const controls = document.createElement(\"div\"); controls.className = \"inventory-controls\";\n    if (corpse.money > 0) controls.append(actionButton(\"取 LOOP\", () => sendGameAction(\"game_loot\", { corpseId: corpse.id })));\n    for (const item of corpse.items) controls.append(actionButton(`取 ${item.name}`, () => sendGameAction(\"game_loot\", { corpseId: corpse.id, instanceId: item.instanceId })));\n    row.append(info, controls); corpseList.append(row);\n  }\n\n  const rankingList = byId(\"game-ranking\"); rankingList.replaceChildren();\n  for (const entry of ranking ?? []) {\n    const row = document.createElement(\"li\");\n    const identity = entry.id === player.id ? \"你\" : `玩家 ${entry.rank}`;\n    row.textContent = `${identity} · ${entry.alive ? \"存活\" : \"淘汰\"} · Lv.${entry.level} · ${entry.kills} 击杀 · 波次 ${entry.wave}`;\n    if (entry.id === player.id) row.className = \"is-self\";\n    rankingList.append(row);\n  }\n}\n\nfunction sendTutorialAction(action) {\n  if (!tutorialSocket || tutorialSocket.readyState !== WebSocket.OPEN) {\n    byId(\"tutorial-log\").textContent = \"教程通道未连接，请重新点击“观测”。\";\n    return;\n  }\n  const payload = action === \"tutorial_move\" ? { to: \"旧站台\" } : undefined;\n  tutorialSocket.send(JSON.stringify({\n    type: \"action\",\n    commandId: crypto.randomUUID(),\n    action,\n    ...(payload ? { payload } : {})\n  }));\n}\n\nfunction renderTutorial(state, log = \"状态已同步。\", error = \"\") {\n  tutorialState = state;\n  byId(\"tutorial-hp\").textContent = `${state.hp} / ${state.maxHp}`;\n  byId(\"tutorial-sp\").textContent = `${state.sp} / ${state.maxSp}`;\n  byId(\"tutorial-area\").textContent = state.area;\n  byId(\"tutorial-condition\").textContent = state.status === \"poisoned\" ? \"中毒\" : \"正常\";\n  byId(\"tutorial-condition\").className = state.status === \"poisoned\" ? \"coral\" : \"mint\";\n  byId(\"tutorial-objective\").textContent = state.objective;\n  byId(\"tutorial-log\").textContent = error ? `${log}（${error}）` : log;\n  byId(\"tutorial-status\").textContent = state.completed ? \"已完成\" : `STEP ${state.step + 1}`;\n  const enabledAt = {\n    tutorial_move: [0], tutorial_search: [1, 3], tutorial_pickup: [2, 4], tutorial_use_ration: [5], tutorial_use_purifier: [6]\n  };\n  document.querySelectorAll(\"[data-tutorial-action]\").forEach((button) => {\n    button.disabled = state.completed || !enabledAt[button.dataset.tutorialAction].includes(state.step);\n  });\n}\n\nasync function checkWorker() {\n  const refreshButton = byId(\"refresh-rooms\");\n  refreshButton.disabled = true;\n  refreshButton.setAttribute(\"aria-busy\", \"true\");\n  networkState.className = \"net-state\";\n  networkState.lastElementChild.textContent = \"连接中\";\n  dbState.textContent = \"检测中\"; socketState.textContent = \"检测中\";\n  systemMessage.textContent = \"正在读取边缘节点状态……\";\n  try {\n    const [healthResponse, catalogResponse, tutorialResponse, standardResponse, infiniteResponse] = await Promise.all([\n      fetch(\"/api/health\", { cache: \"no-store\" }), fetch(\"/api/catalog\", { cache: \"no-store\" }),\n      fetch(\"/api/rooms/tutorial/state\", { cache: \"no-store\" }), fetch(\"/api/rooms/standard-main-v2/state\", { cache: \"no-store\" }),\n      fetch(\"/api/rooms/infinite-main-v2/state\", { cache: \"no-store\" })\n    ]);\n    if (!healthResponse.ok) throw new Error(\"health_failed\");\n    const health = await healthResponse.json();\n    const catalog = catalogResponse.ok ? await catalogResponse.json() : { items: [] };\n    const tutorialRoom = tutorialResponse.ok ? await tutorialResponse.json() : { connected: 0 };\n    const standardRoom = standardResponse.ok ? await standardResponse.json() : { alive: 0, turn: 0 };\n    const infiniteRoom = infiniteResponse.ok ? await infiniteResponse.json() : { alive: 0, turn: 0 };\n    networkState.classList.add(\"is-online\"); networkState.lastElementChild.textContent = \"边缘在线\";\n    dbState.textContent = health.dependencies.supabase ? \"已连接\" : \"待配置\";\n    dbState.className = health.dependencies.supabase ? \"mint\" : \"\";\n    systemMessage.textContent = `Worker 正常 · 商品目录 ${catalog.items?.length ?? 0} 项 · Stripe ${health.dependencies.stripe ? \"已连接\" : \"待接入\"}`;\n    byId(\"tutorial-count\").textContent = `${Math.min(tutorialRoom.connected ?? 0, 1)} / 1`;\n    byId(\"standard-count\").textContent = `${standardRoom.alive ?? 0} / 8`;\n    byId(\"standard-turn\").textContent = `TURN ${standardRoom.turn ?? 0}`;\n    byId(\"infinite-count\").textContent = `${infiniteRoom.alive ?? 0} / 8`;\n    byId(\"infinite-turn\").textContent = `TURN ${infiniteRoom.turn ?? 0}`;\n    await checkSocket();\n  } catch {\n    networkState.classList.add(\"is-offline\"); networkState.lastElementChild.textContent = \"连接失败\";\n    dbState.textContent = \"未知\"; socketState.textContent = \"未知\";\n    systemMessage.textContent = \"边缘节点暂时无法响应，请稍后重新检测。\";\n  } finally {\n    refreshButton.disabled = false;\n    refreshButton.removeAttribute(\"aria-busy\");\n  }\n}\n\nbyId(\"refresh-rooms\").addEventListener(\"click\", checkWorker);\ndocument.querySelectorAll(\".room-action\").forEach((button) => button.addEventListener(\"click\", () => {\n  const label = button.dataset.room === \"tutorial\" ? \"教程轮回\" : button.dataset.mode === \"standard\" ? \"标准大逃杀\" : \"无限试炼\";\n  observeRoom(button.dataset.room, label);\n}));\nbyId(\"login-form\").addEventListener(\"submit\", async (event) => {\n  event.preventDefault();\n  if (!event.currentTarget.reportValidity()) return;\n  const note = byId(\"login-note\"); setAuthBusy(true); note.classList.remove(\"is-error\"); note.textContent = \"正在验证账号……\";\n  try {\n    const data = await authRequest(\"login\", { email: byId(\"login-email\").value, password: byId(\"login-password\").value });\n    setAuthSession(normalizeSession(data));\n  } catch (error) {\n    note.classList.add(\"is-error\"); note.textContent = error.message === \"invalid_credentials\" ? \"邮箱或密码不正确。\" : `登录失败：${error.message}`;\n  } finally { setAuthBusy(false); }\n});\n\nbyId(\"signup-button\").addEventListener(\"click\", async () => {\n  const form = byId(\"login-form\"); if (!form.reportValidity()) return;\n  const note = byId(\"login-note\"); setAuthBusy(true); note.classList.remove(\"is-error\"); note.textContent = \"正在创建测试账号……\";\n  try {\n    const data = await authRequest(\"signup\", { email: byId(\"login-email\").value, password: byId(\"login-password\").value });\n    const session = normalizeSession(data);\n    if (session) setAuthSession(session);\n    else note.textContent = \"账号已创建，请查收验证邮件后再登录。正式开放前需要配置自有 SMTP。\";\n  } catch (error) {\n    note.classList.add(\"is-error\"); note.textContent = `注册失败：${error.message}`;\n  } finally { setAuthBusy(false); }\n});\n\nbyId(\"logout-button\").addEventListener(\"click\", async () => {\n  const token = authSession?.access_token; setAuthBusy(true);\n  try { if (token) await authRequest(\"logout\", {}, token); } catch { /* Local logout still clears the session. */ }\n  finally { setAuthSession(null); setAuthBusy(false); }\n});\n\ndocument.querySelectorAll(\"[data-tutorial-action]\").forEach((button) => button.addEventListener(\"click\", () => {\n  sendTutorialAction(button.dataset.tutorialAction);\n}));\n\ndocument.querySelectorAll(\"[data-game-action]\").forEach((button) => button.addEventListener(\"click\", () => {\n  sendGameAction(button.dataset.gameAction);\n}));\n\ndocument.querySelectorAll(\"[data-game-tactic]\").forEach((button) => button.addEventListener(\"click\", () => {\n  sendGameAction(\"game_tactic\", { tactic: button.dataset.gameTactic });\n}));\n\nbyId(\"game-chat-form\").addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const input = byId(\"game-chat-input\");\n  const text = input.value.trim();\n  if (text) { sendGameAction(\"game_chat\", { text }); input.value = \"\"; }\n});\n\nupdateClock(); setInterval(() => { updateClock(); updateAreaTimer(); }, 1000); restoreAuth(); checkWorker();\n";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/protocol.ts
var MAX_ROOM_ID_LENGTH = 48;
var MAX_MESSAGE_BYTES = 8 * 1024;
var MAX_PLAYER_ID_LENGTH = 64;
var MAX_COMMAND_ID_LENGTH = 96;
var MAX_ACTION_LENGTH = 48;
var MAX_ACCESS_TOKEN_LENGTH = 8 * 1024;
function isValidRoomId(value) {
  return value.length > 0 && value.length <= MAX_ROOM_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(value);
}
__name(isValidRoomId, "isValidRoomId");
function isValidPlayerId(value) {
  return value.length > 0 && value.length <= MAX_PLAYER_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(value);
}
__name(isValidPlayerId, "isValidPlayerId");
function isValidCommandId(value) {
  return value.length > 0 && value.length <= MAX_COMMAND_ID_LENGTH && /^[a-zA-Z0-9:_-]+$/.test(value);
}
__name(isValidCommandId, "isValidCommandId");
function parseClientMessage(raw) {
  if (new TextEncoder().encode(raw).byteLength > MAX_MESSAGE_BYTES) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const message = value;
    if (message.type === "ping" && typeof message.at === "number" && Number.isFinite(message.at)) {
      return { type: "ping", at: message.at };
    }
    if (message.type === "auth" && typeof message.accessToken === "string" && message.accessToken.length > 20 && message.accessToken.length <= MAX_ACCESS_TOKEN_LENGTH) {
      return { type: "auth", accessToken: message.accessToken };
    }
    if (message.type === "guest" && typeof message.guestId === "string" && isValidPlayerId(message.guestId)) {
      return { type: "guest", guestId: message.guestId };
    }
    if (message.type === "action" && typeof message.commandId === "string" && isValidCommandId(message.commandId) && typeof message.action === "string" && message.action.length > 0 && message.action.length <= MAX_ACTION_LENGTH) {
      return {
        type: "action",
        commandId: message.commandId,
        action: message.action,
        ...Object.hasOwn(message, "payload") ? { payload: message.payload } : {}
      };
    }
    return null;
  } catch {
    return null;
  }
}
__name(parseClientMessage, "parseClientMessage");

// src/tutorial.ts
var TUTORIAL_MOVE_COST = 15;
var TUTORIAL_SEARCH_COST = 15;
var objectives = [
  "\u79FB\u52A8\u5230\u76F8\u90BB\u533A\u57DF\uFF0C\u719F\u6089\u79FB\u52A8\u7684\u4F53\u529B\u6D88\u8017\u3002",
  "\u5728\u5F53\u524D\u533A\u57DF\u63A2\u7D22\u4E00\u6B21\u3002",
  "\u62FE\u53D6\u521A\u521A\u53D1\u73B0\u7684\u7EDD\u7F18\u8155\u7532\u3002",
  "\u518D\u6B21\u63A2\u7D22\uFF0C\u5BFB\u627E\u8865\u7ED9\u3002",
  "\u62FE\u53D6\u5F02\u5E38\u8865\u7ED9\u3002",
  "\u4F7F\u7528\u5F02\u5E38\u8865\u7ED9\uFF0C\u89C2\u5BDF\u9053\u5177\u53EF\u80FD\u4EA7\u751F\u7684\u8D1F\u9762\u6548\u679C\u3002",
  "\u4F7F\u7528\u51C0\u5316\u9488\u5242\u89E3\u9664\u4E2D\u6BD2\u3002",
  "\u57FA\u7840\u884C\u52A8\u8BAD\u7EC3\u5B8C\u6210\u3002"
];
var item = /* @__PURE__ */ __name((id, name) => ({ id, name }), "item");
function createTutorialState() {
  return {
    step: 0,
    hp: 100,
    maxHp: 100,
    sp: 120,
    maxSp: 120,
    area: "\u7B2C\u96F6\u5019\u8F66\u5BA4",
    status: "normal",
    inventory: [item("purifier", "\u51C0\u5316\u9488\u5242")],
    pendingItem: null,
    objective: objectives[0],
    completed: false
  };
}
__name(createTutorialState, "createTutorialState");
function fail(state, code, log) {
  return { ok: false, state, code, log };
}
__name(fail, "fail");
function advance(state, step, log) {
  return { ok: true, state: { ...state, step, objective: objectives[step] ?? objectives.at(-1), completed: step >= 7 }, log };
}
__name(advance, "advance");
function applyTutorialAction(current, action, payload) {
  if (action === "tutorial_start") {
    const state2 = current ?? createTutorialState();
    return { ok: true, state: state2, log: current ? "\u8BAD\u7EC3\u72B6\u6001\u5DF2\u6062\u590D\u3002" : "\u57FA\u7840\u884C\u52A8\u8BAD\u7EC3\u5F00\u59CB\u3002" };
  }
  const state = current;
  if (!state) return fail(createTutorialState(), "tutorial_not_started", "\u8BF7\u5148\u5F00\u59CB\u6559\u7A0B\u3002 ");
  if (action === "tutorial_move") {
    if (state.step !== 0) return fail(state, "wrong_tutorial_step", state.objective);
    const destination = typeof payload === "object" && payload && typeof payload.to === "string" ? payload.to : "";
    const allowed = ["\u65E7\u7AD9\u53F0", "\u4FE1\u53F7\u5ECA"];
    if (!allowed.includes(destination) || destination === state.area) return fail(state, "invalid_destination", "\u8BF7\u9009\u62E9\u53EF\u5230\u8FBE\u7684\u76F8\u90BB\u533A\u57DF\u3002 ");
    if (state.sp <= TUTORIAL_MOVE_COST) return fail(state, "insufficient_sp", "\u4F53\u529B\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u79FB\u52A8\u3002 ");
    return advance({ ...state, area: destination, sp: state.sp - TUTORIAL_MOVE_COST }, 1, `\u6D88\u8017 ${TUTORIAL_MOVE_COST} \u70B9\u4F53\u529B\uFF0C\u79FB\u52A8\u5230${destination}\u3002`);
  }
  if (action === "tutorial_search") {
    if (state.step !== 1 && state.step !== 3) return fail(state, "wrong_tutorial_step", state.objective);
    if (state.sp <= TUTORIAL_SEARCH_COST) return fail(state, "insufficient_sp", "\u4F53\u529B\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u63A2\u7D22\u3002 ");
    const found = state.step === 1 ? item("insulated_bracer", "\u7EDD\u7F18\u8155\u7532") : item("unstable_ration", "\u5F02\u5E38\u8865\u7ED9");
    return advance({ ...state, sp: state.sp - TUTORIAL_SEARCH_COST, pendingItem: found }, state.step + 1, `\u6D88\u8017 ${TUTORIAL_SEARCH_COST} \u70B9\u4F53\u529B\uFF0C\u53D1\u73B0\u4E86${found.name}\u3002`);
  }
  if (action === "tutorial_pickup") {
    if (state.step !== 2 && state.step !== 4 || !state.pendingItem) return fail(state, "nothing_to_pickup", state.objective);
    const found = state.pendingItem;
    return advance({ ...state, inventory: [...state.inventory, found], pendingItem: null }, state.step + 1, `\u5DF2\u62FE\u53D6${found.name}\u3002`);
  }
  if (action === "tutorial_use_ration") {
    if (state.step !== 5 || !state.inventory.some(({ id }) => id === "unstable_ration")) return fail(state, "item_unavailable", state.objective);
    return advance({ ...state, hp: Math.max(1, state.hp - 20), status: "poisoned", inventory: state.inventory.filter(({ id }) => id !== "unstable_ration") }, 6, "\u5F02\u5E38\u8865\u7ED9\u4F7F\u751F\u547D\u964D\u4F4E 20\uFF0C\u5E76\u9644\u52A0\u4E2D\u6BD2\u72B6\u6001\u3002 ");
  }
  if (action === "tutorial_use_purifier") {
    if (state.step !== 6 || !state.inventory.some(({ id }) => id === "purifier")) return fail(state, "item_unavailable", state.objective);
    return advance({ ...state, status: "normal", inventory: state.inventory.filter(({ id }) => id !== "purifier") }, 7, "\u4E2D\u6BD2\u5DF2\u89E3\u9664\uFF0C\u57FA\u7840\u884C\u52A8\u8BAD\u7EC3\u5B8C\u6210\u3002 ");
  }
  return fail(state, "unsupported_tutorial_action", "\u6559\u7A0B\u4E0D\u652F\u6301\u8FD9\u4E2A\u884C\u52A8\u3002 ");
}
__name(applyTutorialAction, "applyTutorialAction");

// src/game.ts
var LEGACY_AREAS=[
  { id: "zone_0", legacyId: 0, name: "无月之影", grid: "B-2", itemFind: -15, encounter: 20, initiative: -5, shop: true, dangerous: true },
  { id: "zone_1", legacyId: 1, name: "端点", grid: "A-6", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_2", legacyId: 2, name: "RF高校", grid: "H-3", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_3", legacyId: 3, name: "雪之镇", grid: "B-6", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_4", legacyId: 4, name: "索拉利斯", grid: "F-10", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_5", legacyId: 5, name: "指挥中心", grid: "D-6", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_6", legacyId: 6, name: "梦幻馆", grid: "H-6", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_7", legacyId: 7, name: "清水池", grid: "F-3", itemFind: 10, encounter: 0, initiative: 0 },
  { id: "zone_8", legacyId: 8, name: "白穗神社", grid: "E-10", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_9", legacyId: 9, name: "墓地", grid: "J-4", itemFind: 0, encounter: 5, initiative: 0 },
  { id: "zone_10", legacyId: 10, name: "麦斯克林", grid: "I-8", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_11", legacyId: 11, name: "对天使用作战本部", grid: "D-8", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_12", legacyId: 12, name: "夏之镇", grid: "F-9", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_13", legacyId: 13, name: "三体星", grid: "H-4", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_14", legacyId: 14, name: "光坂高校", grid: "H-8", itemFind: 5, encounter: 0, initiative: 0, shop: true },
  { id: "zone_15", legacyId: 15, name: "守矢神社", grid: "G-1", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_16", legacyId: 16, name: "常磐森林", grid: "I-2", itemFind: -5, encounter: 0, initiative: 0 },
  { id: "zone_17", legacyId: 17, name: "常磐台中学", grid: "A-5", itemFind: -10, encounter: 0, initiative: -5 },
  { id: "zone_18", legacyId: 18, name: "秋之镇", grid: "G-4", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_19", legacyId: 19, name: "精灵中心", grid: "D-4", itemFind: 0, encounter: 0, initiative: 0, medical: true },
  { id: "zone_20", legacyId: 20, name: "春之镇", grid: "I-7", itemFind: 15, encounter: 0, initiative: 0 },
  { id: "zone_21", legacyId: 21, name: "圣Gradius学园", grid: "F-7", itemFind: 10, encounter: 0, initiative: 0 },
  { id: "zone_22", legacyId: 22, name: "初始之树", grid: "J-6", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_23", legacyId: 23, name: "幻想世界", grid: "A-8", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_24", legacyId: 24, name: "永恒的世界", grid: "C-9", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_25", legacyId: 25, name: "妖精驿站", grid: "D-2", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_26", legacyId: 26, name: "冰封墓场", grid: "A-1", itemFind: -10, encounter: 0, initiative: 0 },
  { id: "zone_27", legacyId: 27, name: "花菱商厦", grid: "F-8", itemFind: 5, encounter: 0, initiative: 0, shop: true },
  { id: "zone_28", legacyId: 28, name: "FARGO前基地", grid: "E-1", itemFind: -5, encounter: 0, initiative: 0 },
  { id: "zone_29", legacyId: 29, name: "风祭森林", grid: "F-5", itemFind: 5, encounter: 0, initiative: 0 },
  { id: "zone_30", legacyId: 30, name: "天使队移动格纳库", grid: "F-6", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_31", legacyId: 31, name: "和田町研究所", grid: "J-1", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_32", legacyId: 32, name: "ＳＣＰ研究设施", grid: "J-2", itemFind: -10, encounter: 10, initiative: -10, dangerous: true },
  { id: "zone_33", legacyId: 33, name: "雏菊之丘", grid: "F-4", itemFind: 0, encounter: 0, initiative: 0 },
  { id: "zone_34", legacyId: 34, name: "英灵殿", grid: "J-10", itemFind: -15, encounter: 20, initiative: -10, dangerous: true }
];
var GAME_AREAS=LEGACY_AREAS.map(a=>({id:a.id,name:a.name,grid:a.grid,itemFind:a.itemFind,encounter:a.encounter,initiative:a.initiative,shop:a.shop===true}));
var WEATHER=[
  { name: "晴天", find: 10, encounter: 10, initiative: 10, attack: 10, defense: 10 },
  { name: "大晴", find: 20, encounter: 20, initiative: 20, attack: 10, defense: 30 },
  { name: "多云", find: 0, encounter: 0, initiative: 0, attack: 0, defense: 0 },
  { name: "小雨", find: -2, encounter: -2, initiative: -5, attack: -5, defense: 0 },
  { name: "暴雨", find: -3, encounter: -3, initiative: -10, attack: -10, defense: -3 },
  { name: "台风", find: -10, encounter: -10, initiative: -20, attack: -20, defense: -15 },
  { name: "雷雨", find: -7, encounter: -7, initiative: -15, attack: -15, defense: -10 },
  { name: "下雪", find: 5, encounter: 5, initiative: 0, attack: 0, defense: 0 },
  { name: "起雾", find: -10, encounter: -10, initiative: -7, attack: 0, defense: -20 },
  { name: "浓雾", find: -20, encounter: -20, initiative: -10, attack: 7, defense: -30 },
  { name: "瘴气", find: 0, encounter: 0, initiative: -10, attack: 20, defense: -50 },
  { name: "龙卷风", find: -7, encounter: -7, initiative: -5, attack: -7, defense: -5 },
  { name: "暴风雪", find: -5, encounter: -5, initiative: 0, attack: -20, defense: -20 },
  { name: "冰雹", find: -30, encounter: -30, initiative: -5, attack: -5, defense: -3 },
  { name: "离子暴", find: -5, encounter: -5, initiative: -20, attack: -10, defense: -20 },
  { name: "辐射尘", find: -20, encounter: -20, initiative: -5, attack: -10, defense: 5 },
  { name: "臭氧洞", find: 0, encounter: 0, initiative: 0, attack: -10, defense: -30 },
  { name: "极光", find: 20, encounter: 20, initiative: 20, attack: 10, defense: 30 }
];
var TEAM_RULES={createSp:200,joinSp:100,maxMembers:5};
var CRAFT_RECIPES=[
  { ingredients: ["rice_stew", "matsutake"], result: "matsutake_rice" },
  { ingredients: ["curry", "bread"], result: "curry_bread" }
];
function weatherAttack(base,id){return Math.max(1,Math.round(base*(100+(WEATHER[id]??WEATHER[2]).attack)/100))}
function weatherDefense(base,id){return Math.max(0,Math.round(base*(100+(WEATHER[id]??WEATHER[2]).defense)/100))}
function weaponFamily(id){if(/rifle|gun|pistol|bullet|bow|射/i.test(id))return "wg";if(/blade|sword|knife|斩/i.test(id))return "wk";if(/grenade|bomb|爆/i.test(id))return "wd";if(/spirit|magic|灵/i.test(id))return "wf";if(/throw|投/i.test(id))return "wc";return "wp";}
var catalog=[
  { catalogId: "folding_baton", name: "折叠短棍", kind: "weapon", power: 9, durability: 18, price: 0 },
  { catalogId: "signal_blade", name: "信号切断刃", kind: "weapon", power: 17, durability: 14, price: 520 },
  { catalogId: "loop_rifle", name: "轮回脉冲枪", kind: "weapon", power: 25, durability: 10, price: 980 },
  { catalogId: "fiber_vest", name: "纤维护甲", kind: "armor", power: 5, durability: 20, price: 420 },
  { catalogId: "station_shell", name: "站务员外壳", kind: "armor", power: 10, durability: 15, price: 850 },
  { catalogId: "healing_gel", name: "应急凝胶", kind: "heal", power: 35, durability: 1, price: 160 },
  { catalogId: "energy_cell", name: "体力电池", kind: "stamina", power: 45, durability: 1, price: 140 },
  { catalogId: "purifier", name: "净化针剂", kind: "antidote", power: 0, durability: 1, price: 120 },
  { catalogId: "helmet", name: "基础头盔", kind: "armor", armorSlot: "head", power: 3, durability: 15, price: 200 },
  { catalogId: "armguards", name: "防护臂甲", kind: "armor", armorSlot: "arms", power: 2, durability: 15, price: 180 },
  { catalogId: "legguards", name: "防护腿甲", kind: "armor", armorSlot: "legs", power: 3, durability: 15, price: 200 },
  { catalogId: "tripwire", name: "简易绊索陷阱", kind: "trap", power: 12, durability: 1, price: 120 },
  { catalogId: "rice_stew", name: "杂炊", kind: "material", power: 0, durability: 1, price: 35 },
  { catalogId: "matsutake", name: "松茸", kind: "material", power: 0, durability: 1, price: 60 },
  { catalogId: "curry", name: "咖喱", kind: "material", power: 0, durability: 1, price: 40 },
  { catalogId: "bread", name: "面包", kind: "material", power: 0, durability: 1, price: 30 },
  { catalogId: "matsutake_rice", name: "松茸御饭", kind: "heal", power: 120, durability: 10, price: 0 },
  { catalogId: "curry_bread", name: "咖喱面包", kind: "heal", power: 140, durability: 2, price: 0 }
];
var areaById = /* @__PURE__ */ __name((id) => GAME_AREAS.find((area) => area.id === id) ?? GAME_AREAS[1], "areaById");
var clone = /* @__PURE__ */ __name((value) => structuredClone(value), "clone");
function nextRandom(world) {
  world.seed = Math.imul(world.seed, 1664525) + 1013904223 >>> 0;
  return world.seed / 4294967296;
}
__name(nextRandom, "nextRandom");
function makeItem(world, definition) {
  const suffix = Math.floor(nextRandom(world) * 16777215).toString(36);
  return { ...definition, instanceId: `${definition.catalogId}_${world.turn}_${suffix}` };
}
__name(makeItem, "makeItem");
function createGameWorld(seed = 20261028, mode = "infinite") {
  return { mode, phase: "waiting", cycle: 1, turn: 0, seed: seed >>> 0, forbidden: ["zone_0"], warningArea: null, warningAreas: [], players: {}, corpses: [], winnerId: null };
}
__name(createGameWorld, "createGameWorld");
function createPlayer(world, playerId) {
  return {
    id: playerId,
    hp: 100,
    maxHp: 100,
    sp: 120,
    maxSp: 120,
    level: 1,
    exp: 0,
    money: 300,
    area: "zone_1",
    status: "normal",
    tactic: "balanced",
    alive: true,
    kills: 0,
    wave: 1,
    inventory: [makeItem(world, catalog.find(({ catalogId }) => catalogId === "healing_gel")), makeItem(world, catalog.find(({ catalogId }) => catalogId === "purifier"))],
    weapon: makeItem(world, catalog[0]),
    armor: null,
    pendingItem: null,
    enemy: null
  };
}
__name(createPlayer, "createPlayer");
function failure(world, playerId, code, text) {
  return { ok: false, world, code, event: { kind: "error", playerId, text } };
}
__name(failure, "failure");
function success(world, playerId, kind, text, targetId) {
  return { ok: true, world, event: { kind, playerId, text, ...targetId ? { targetId } : {} } };
}
__name(success, "success");
function parseString(payload, key) {
  return typeof payload === "object" && payload && typeof payload[key] === "string" ? payload[key] : "";
}
__name(parseString, "parseString");
function applyPoison(player) {
  if (player.status !== "poisoned" || !player.alive) return "";
  player.hp = Math.max(0, player.hp - 5);
  if (player.hp === 0) player.alive = false;
  return " \u4E2D\u6BD2\u9020\u6210 5 \u70B9\u751F\u547D\u635F\u5931\u3002";
}
__name(applyPoison, "applyPoison");
function levelUp(player) {
  let text = "";
  while (player.exp >= player.level * 100) {
    player.exp -= player.level * 100;
    player.level += 1;
    player.maxHp += 12;
    player.maxSp += 8;
    player.hp = player.maxHp;
    player.sp = player.maxSp;
    text += ` \u7B49\u7EA7\u63D0\u5347\u81F3 ${player.level}\u3002`;
  }
  return text;
}
__name(levelUp, "levelUp");
var OLD_AREAS={"zero_station":"zone_1","old_platform":"zone_2","signal_corridor":"zone_3","shinjuku_ruins":"zone_4","memory_market":"zone_14","terminal_roof":"zone_27"};
function normalizeSavedArea(id){return LEGACY_AREAS.some(a=>a.id===id)?id:(OLD_AREAS[id]??"zone_1");}
function normalizeSavedWorldAreas(world){for(const p of Object.values(world.players))p.area=normalizeSavedArea(p.area);for(const c of world.corpses??[])c.area=normalizeSavedArea(c.area);world.forbidden=[...new Set((world.forbidden??[]).map(normalizeSavedArea))];world.warningAreas=(world.warningAreas??(world.warningArea?[world.warningArea]:[])).map(normalizeSavedArea);world.warningArea=world.warningAreas[0]??null;return world;}

function tickAreaClock(w, now=Date.now()) {
 upgradeWorld(w);
 if(w.phase!=="active")return "";
 const messages=[];
 for(let k=0;k<32&&now>=w.areaDueAt&&w.phase==="active";k++){
  if(!w.warningAreas.length){
   const eligible=GAME_AREAS.map(a=>a.id).filter(id=>!w.forbidden.includes(id));
   for(let j=0;j<4&&eligible.length;j++){const idx=Math.floor(nextRandom(w)*eligible.length);w.warningAreas.push(eligible.splice(idx,1)[0]);}
  }
  const closed=[...w.warningAreas];w.forbidden=[...new Set([...w.forbidden,...closed])];
  w.warningAreas=[];w.warningArea=null;w.areaWarned=false;
  for(const p of Object.values(w.players))if(p.alive&&closed.includes(p.area)){p.hp=0;p.alive=false}
  w.weatherId=Math.floor(nextRandom(w)*WEATHER.length);
  messages.push("新增禁区："+closed.map(id=>areaById(id).name).join("、")+"，天气："+WEATHER[w.weatherId].name+"。");
  w.areaDueAt+=1800000;
  if(w.forbidden.length>=35){
   if(w.mode==="infinite"){w.cycle++;w.forbidden=["zone_0"];messages.push("进入第"+w.cycle+"周目。");}
   else{w.phase="finished";messages.push("所有地区已封锁，游戏结束。");}
  }
 }
 if(w.phase==="active"&&!w.areaWarned&&now>=w.areaDueAt-60000){
  const eligible=GAME_AREAS.map(a=>a.id).filter(id=>!w.forbidden.includes(id));
  for(let j=0;j<4&&eligible.length;j++){const idx=Math.floor(nextRandom(w)*eligible.length);w.warningAreas.push(eligible.splice(idx,1)[0]);}
  w.warningArea=w.warningAreas[0]??null;w.areaWarned=true;
  if(w.warningAreas.length)messages.push("提前60秒禁区预警："+w.warningAreas.map(id=>areaById(id).name).join("、")+"。");
 }
 return messages.join(" ");
}
function nextAreaAlarmAt(w,now=Date.now()){
 if(w.phase!=="active")return null;
 return Math.max(now+10,w.areaWarned?w.areaDueAt:w.areaDueAt-60000);
}
function advanceWorld(world){
 world.turn++;
 const players=Object.values(world.players),alive=players.filter(p=>p.alive);
 if(world.mode==="standard"&&players.length>1&&alive.length<=1){
  world.phase="finished";world.winnerId=alive[0]?.id??null;
  return world.winnerId?" 对局结束，最后幸存者已产生。":" 对局结束，无人生还。";
 }
 return "";
}
__name(advanceWorld, "advanceWorld");
function spawnEnemy(world, player) {
  const names = ["\u5931\u771F\u5DE1\u68C0\u5458", "\u7A7A\u58F3\u4E58\u5BA2", "\u9006\u884C\u6267\u884C\u4F53", "\u8BB0\u5FC6\u730E\u72AC"];
  const scale = player.level + player.wave + world.cycle - 2;
  const maxHp = 38 + scale * 12;
  return {
    id: `enemy_${world.turn}_${Math.floor(nextRandom(world) * 99999)}`,
    name: names[Math.floor(nextRandom(world) * names.length)],
    hp: maxHp,
    maxHp,
    attack: 7 + scale * 3,
    defense: 2 + scale,
    rewardExp: 35 + scale * 14,
    rewardMoney: 45 + scale * 20
  };
}
__name(spawnEnemy, "spawnEnemy");
function combatNpc(world, player) {
  const enemy = player.enemy;
  const weaponPower = player.weapon?.power ?? 3;
  const tacticAttack = player.tactic === "aggressive" ? 5 : player.tactic === "defensive" ? -2 : 0;
  const k=weaponFamily(player.weapon?.catalogId??"fist");
  const damage=Math.max(1,weatherAttack(weaponPower+player.level*2+tacticAttack+Math.floor((player.proficiencies?.[k]??0)/20),world.weatherId)-weatherDefense(enemy.defense,world.weatherId)+Math.floor(nextRandom(world)*6));
  enemy.hp = Math.max(0, enemy.hp - damage);
  if (player.weapon) {
    player.weapon.durability -= 1;
    if (player.weapon.durability <= 0) player.weapon = null;
  }
  let text = `\u4F60\u5BF9${enemy.name}\u9020\u6210 ${damage} \u70B9\u4F24\u5BB3\u3002`;
  if (enemy.hp === 0) {
    player.exp += enemy.rewardExp;
    player.money += enemy.rewardMoney;
    player.kills += 1;
    player.wave += 1;
    player.enemy = null;
    text += ` \u76EE\u6807\u5DF2\u6E05\u9664\uFF0C\u83B7\u5F97 ${enemy.rewardExp} \u7ECF\u9A8C\u548C ${enemy.rewardMoney} LOOP\u3002${levelUp(player)}`;
    return text;
  }
  const defense=weatherDefense((player.armor?.power??0)+Object.values(player.armorParts??{}).reduce((v,a)=>v+(a?.power??0),0),world.weatherId)+(player.tactic==="defensive"?5:player.tactic==="aggressive"?-2:0);
  const counter = Math.max(1, enemy.attack - defense + Math.floor(nextRandom(world) * 5));
  player.hp = Math.max(0, player.hp - counter);
  if (player.armor) {
    player.armor.durability -= 1;
    if (player.armor.durability <= 0) player.armor = null;
  }
  if (player.hp === 0) player.alive = false;
  return `${text} ${enemy.name}\u53CD\u51FB\u9020\u6210 ${counter} \u70B9\u4F24\u5BB3\u3002`;
}
__name(combatNpc, "combatNpc");
function applyGameAction(input, playerId, action, payload) {
  const requestedMode = parseString(payload, "mode") === "standard" ? "standard" : "infinite";
  const world = normalizeSavedWorldAreas(clone(input ?? createGameWorld(20261028, requestedMode)));
  if (action === "game_enter") {
    if (!world.players[playerId] && Object.values(world.players).filter(({ alive }) => alive).length >= 8) {
      return failure(world, playerId, "room_full", "\u623F\u95F4\u4EBA\u6570\u5DF2\u6EE1\u3002 ");
    }
    if (!world.players[playerId]) world.players[playerId] = createPlayer(world, playerId);
    if (world.phase === "waiting") {
      world.phase = "active";
      world.winnerId = null;
    }
    return success(world, playerId, "entered", world.mode === "standard" ? "\u5DF2\u8FDB\u5165\u6807\u51C6\u5927\u9003\u6740\u3002 " : "\u5DF2\u8FDB\u5165\u65E0\u9650\u8BD5\u70BC\u3002 ");
  }
  const player = world.players[playerId];
  if (!player) return failure(world, playerId, "game_not_entered", "\u8BF7\u5148\u8FDB\u5165\u5BF9\u5C40\u3002 ");
  if (action === "game_chat") {
    const text = parseString(payload, "text").trim();
    if (!text || text.length > 200) return failure(world, playerId, "invalid_chat", "\u6D88\u606F\u957F\u5EA6\u5FC5\u987B\u4E3A 1\u2013200 \u4E2A\u5B57\u7B26\u3002 ");
    return success(world, playerId, "chat", text);
  }
  if (action === "game_restart") {
    const wasFinished = world.phase === "finished";
    if (wasFinished) {
      for (const id of Object.keys(world.players)) world.players[id] = createPlayer(world, id);
      world.corpses = [];
    } else world.players[playerId] = createPlayer(world, playerId);
    world.phase = "active";
    world.winnerId = null;
    if (wasFinished || Object.values(world.players).every((entry) => entry.id === playerId || !entry.alive)) {
      world.cycle += 1;
      world.turn = 0;
      world.forbidden = ["zone_0"];
      world.warningAreas = [];
      world.warningArea = null;
    }
    return success(world, playerId, "restarted", "\u8F6E\u56DE\u91CD\u542F\uFF0C\u89D2\u8272\u72B6\u6001\u5DF2\u91CD\u7F6E\u3002 ");
  }
  if (!player.alive) {
    return failure(world, playerId, "player_dead", "\u89D2\u8272\u5DF2\u6B7B\u4EA1\uFF0C\u8BF7\u91CD\u65B0\u5F00\u59CB\u8F6E\u56DE\u3002 ");
  }
  if (world.phase === "finished" && action !== "game_loot") return failure(world, playerId, "game_finished", "\u672C\u5C40\u5DF2\u7ECF\u7ED3\u675F\u3002 ");
  if (world.forbidden.includes(player.area)) {
    player.hp = 0;
    player.alive = false;
    return success(world, playerId, "zone_death", "\u4F60\u505C\u7559\u5728\u7981\u533A\uFF0C\u8F6E\u56DE\u7EC8\u6B62\u3002 ");
  }
  let transition;
  if (action === "game_move") {
    const to = parseString(payload, "to");
    if (!GAME_AREAS.some(a=>a.id===to)||player.area===to) return failure(world,playerId,"invalid_destination","请选择其他有效地区。 ");
    if (world.forbidden.includes(to)) return failure(world, playerId, "forbidden_destination", "\u76EE\u6807\u533A\u57DF\u5DF2\u7ECF\u5C01\u9501\u3002 ");
    if (player.enemy) return failure(world, playerId, "enemy_present", "\u906D\u9047\u654C\u4EBA\u65F6\u65E0\u6CD5\u79FB\u52A8\uFF0C\u8BF7\u5148\u6218\u6597\u6216\u64A4\u79BB\u3002 ");
    if (player.sp <= 15) return failure(world, playerId, "insufficient_sp", "\u4F53\u529B\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u79FB\u52A8\u3002 ");
    player.sp -= 15;
    player.area = to;
    transition = success(world, playerId, "moved", `\u6D88\u8017 15 \u70B9\u4F53\u529B\uFF0C\u79FB\u52A8\u5230${areaById(to).name}\u3002`);
  } else if (action === "game_search") {
    if (player.enemy || player.pendingItem) return failure(world, playerId, "unresolved_encounter", "\u8BF7\u5148\u5904\u7406\u5F53\u524D\u53D1\u73B0\u7269\u6216\u654C\u4EBA\u3002 ");
    if (player.sp <= 15) return failure(world, playerId, "insufficient_sp", "\u4F53\u529B\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u63A2\u7D22\u3002 ");
    player.sp -= 15;
    const roll = nextRandom(world);
    const areaRules=areaById(player.area);const itemThreshold=Math.max(0.1,Math.min(0.8,(player.tactic==="scavenge"?68:50)/100+(areaRules.itemFind+(WEATHER[world.weatherId]??WEATHER[2]).find)/100));const enemyThreshold=Math.min(.98,Math.max(itemThreshold,(88+areaRules.encounter+(WEATHER[world.weatherId]??WEATHER[2]).encounter)/100));
    if (roll < itemThreshold) {
      const lootPool = catalog.slice(1);
      player.pendingItem = makeItem(world, lootPool[Math.floor(nextRandom(world) * lootPool.length)]);
      transition = success(world, playerId, "found_item", `\u63A2\u7D22\u53D1\u73B0\u4E86${player.pendingItem.name}\u3002`);
    } else if (roll < enemyThreshold) {
      player.enemy = spawnEnemy(world, player);
      transition = success(world, playerId, "found_enemy", `\u906D\u9047${player.enemy.name}\u3002`);
    } else {
      const foundMoney = 40 + Math.floor(nextRandom(world) * 120);
      player.money += foundMoney;
      transition = success(world, playerId, "found_money", `\u53D1\u73B0 ${foundMoney} LOOP\u3002`);
    }
  } else if (action === "game_pickup") {
    if (!player.pendingItem) return failure(world, playerId, "nothing_to_pickup", "\u5F53\u524D\u6CA1\u6709\u53EF\u62FE\u53D6\u7269\u54C1\u3002 ");
    if (player.inventory.length >= 6) return failure(world, playerId, "inventory_full", "\u80CC\u5305\u5DF2\u6EE1\uFF0C\u8BF7\u5148\u4F7F\u7528\u6216\u4E22\u5F03\u7269\u54C1\u3002 ");
    const found = player.pendingItem;
    player.inventory.push(found);
    player.pendingItem = null;
    transition = success(world, playerId, "picked_up", `\u5DF2\u62FE\u53D6${found.name}\u3002`);
  } else if (action === "game_discard") {
    const instanceId = parseString(payload, "instanceId");
    const before = player.inventory.length;
    player.inventory = player.inventory.filter((entry) => entry.instanceId !== instanceId);
    if (player.inventory.length === before) return failure(world, playerId, "item_not_found", "\u80CC\u5305\u4E2D\u6CA1\u6709\u8BE5\u7269\u54C1\u3002 ");
    transition = success(world, playerId, "discarded", "\u7269\u54C1\u5DF2\u4E22\u5F03\u3002 ");
  } else if (action === "game_equip") {
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected || selected.kind !== "weapon" && selected.kind !== "armor") return failure(world, playerId, "item_not_equippable", "\u8BE5\u7269\u54C1\u65E0\u6CD5\u88C5\u5907\u3002 ");
    player.inventory.splice(index, 1);
    if (selected.kind === "weapon") {
      if (player.weapon) player.inventory.push(player.weapon);
      player.weapon = selected;
    } else {
      if (player.armor) player.inventory.push(player.armor);
      player.armor = selected;
    }
    transition = success(world, playerId, "equipped", `\u5DF2\u88C5\u5907${selected.name}\u3002`);
  } else if (action === "game_unequip") {
    const slot = parseString(payload, "slot");
    if (player.inventory.length >= 6) return failure(world, playerId, "inventory_full", "\u80CC\u5305\u5DF2\u6EE1\uFF0C\u65E0\u6CD5\u5378\u4E0B\u88C5\u5907\u3002 ");
    if (slot === "weapon" && player.weapon) {
      const selected = player.weapon;
      player.weapon = null;
      player.inventory.push(selected);
      transition = success(world, playerId, "unequipped", `\u5DF2\u5378\u4E0B${selected.name}\u3002`);
    } else if (slot === "armor" && player.armor) {
      const selected = player.armor;
      player.armor = null;
      player.inventory.push(selected);
      transition = success(world, playerId, "unequipped", `\u5DF2\u5378\u4E0B${selected.name}\u3002`);
    } else return failure(world, playerId, "slot_empty", "\u8BE5\u88C5\u5907\u680F\u4E3A\u7A7A\u3002 ");
  } else if (action === "game_use") {
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected || !["heal", "stamina", "antidote"].includes(selected.kind)) return failure(world, playerId, "item_not_usable", "\u8BE5\u7269\u54C1\u65E0\u6CD5\u4F7F\u7528\u3002 ");
    player.inventory.splice(index, 1);
    if (selected.kind === "heal") player.hp = Math.min(player.maxHp, player.hp + selected.power);
    if (selected.kind === "stamina") player.sp = Math.min(player.maxSp, player.sp + selected.power);
    if (selected.kind === "antidote") player.status = "normal";
    transition = success(world, playerId, "used_item", `\u5DF2\u4F7F\u7528${selected.name}\u3002`);
  } else if (action === "game_attack") {
    const targetId = parseString(payload, "targetId");
    if (targetId) {
      if (world.mode !== "standard") return failure(world, playerId, "pvp_disabled", "\u65E0\u9650\u8BD5\u70BC\u4E2D\u65E0\u6CD5\u653B\u51FB\u5176\u4ED6\u73A9\u5BB6\u3002 ");
      const target = world.players[targetId];
      if (!target?.alive || target.area !== player.area || targetId === playerId) return failure(world, playerId, "invalid_target", "\u76EE\u6807\u4E0D\u5728\u5F53\u524D\u533A\u57DF\u3002 ");
      const attackBonus = player.tactic === "aggressive" ? 5 : player.tactic === "defensive" ? -2 : 0;
      const defenseBonus = target.tactic === "defensive" ? 5 : target.tactic === "aggressive" ? -2 : 0;
      const damage=Math.max(1,weatherAttack((player.weapon?.power??3)+player.level*2+attackBonus,world.weatherId)-weatherDefense((target.armor?.power??0)+Object.values(target.armorParts??{}).reduce((v,a)=>v+(a?.power??0),0),world.weatherId)-defenseBonus+Math.floor(nextRandom(world)*6));
      target.hp = Math.max(0, target.hp - damage);
      if (player.weapon) {
        player.weapon.durability -= 1;
        if (player.weapon.durability <= 0) player.weapon = null;
      }
      if (target.hp === 0) {
        target.alive = false;
        player.kills += 1;
        player.exp += 80;
        const corpseMoney = Math.floor(target.money / 2);
        target.money -= corpseMoney;
        const corpseItems = [...target.inventory, ...target.weapon ? [target.weapon] : [], ...target.armor ? [target.armor] : []];
        target.inventory = [];
        target.weapon = null;
        target.armor = null;
        world.corpses.push({ id: `corpse_${world.turn}_${targetId}`, playerId: targetId, area: target.area, money: corpseMoney, items: corpseItems });
      }
      transition = success(world, playerId, "pvp_attack", `\u5BF9\u76EE\u6807\u9020\u6210 ${damage} \u70B9\u4F24\u5BB3\u3002${target.alive ? "" : ` \u76EE\u6807\u5DF2\u51FA\u5C40\uFF0C\u9057\u7559\u4E86\u53EF\u641C\u7D22\u7684\u6218\u5229\u54C1\u3002${levelUp(player)}`}`, targetId);
    } else {
      if (!player.enemy) return failure(world, playerId, "no_enemy", "\u5F53\u524D\u6CA1\u6709\u53EF\u653B\u51FB\u7684\u654C\u4EBA\u3002 ");
      transition = success(world, playerId, "npc_attack", combatNpc(world, player));
    }
  } else if (action === "game_rest") {
    if (player.enemy) return failure(world, playerId, "enemy_present", "\u906D\u9047\u654C\u4EBA\u65F6\u65E0\u6CD5\u4F11\u606F\u3002 ");
    player.sp = Math.min(player.maxSp, player.sp + 30);
    player.hp = Math.min(player.maxHp, player.hp + 10);
    transition = success(world, playerId, "rested", "\u77ED\u6682\u4F11\u6574\uFF0C\u6062\u590D 30 \u4F53\u529B\u548C 10 \u751F\u547D\u3002 ");
  } else if (action === "game_shop_buy") {
    if (!areaById(player.area).shop) return failure(world, playerId, "shop_unavailable", "\u5F53\u524D\u533A\u57DF\u6CA1\u6709\u5546\u5E97\u3002 ");
    if (player.inventory.length >= 6) return failure(world, playerId, "inventory_full", "\u80CC\u5305\u5DF2\u6EE1\u3002 ");
    const catalogId = parseString(payload, "catalogId");
    const selected = catalog.find((entry) => entry.catalogId === catalogId && entry.price > 0);
    if (!selected) return failure(world, playerId, "unknown_product", "\u5546\u5E97\u6CA1\u6709\u8FD9\u4E2A\u7269\u54C1\u3002 ");
    if (player.money < selected.price) return failure(world, playerId, "insufficient_money", "LOOP \u4E0D\u8DB3\u3002 ");
    player.money -= selected.price;
    player.inventory.push(makeItem(world, selected));
    transition = success(world, playerId, "purchased", `\u8D2D\u4E70\u4E86${selected.name}\u3002`);
  } else if (action === "game_shop_sell") {
    if (!areaById(player.area).shop) return failure(world, playerId, "shop_unavailable", "\u5F53\u524D\u533A\u57DF\u6CA1\u6709\u5546\u5E97\u3002 ");
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected) return failure(world, playerId, "item_not_found", "\u80CC\u5305\u4E2D\u6CA1\u6709\u8BE5\u7269\u54C1\u3002 ");
    const value = Math.max(10, Math.floor(selected.price * 0.5));
    player.inventory.splice(index, 1);
    player.money += value;
    transition = success(world, playerId, "sold", `\u51FA\u552E${selected.name}\uFF0C\u83B7\u5F97 ${value} LOOP\u3002`);
  } else if (action === "game_loot") {
    const corpseId = parseString(payload, "corpseId");
    const corpse = world.corpses.find((entry) => entry.id === corpseId && entry.area === player.area);
    if (!corpse) return failure(world, playerId, "corpse_not_found", "\u5F53\u524D\u533A\u57DF\u6CA1\u6709\u8FD9\u5177\u9057\u7559\u7269\u3002 ");
    const instanceId = parseString(payload, "instanceId");
    if (!instanceId && corpse.money > 0) {
      const amount = corpse.money;
      corpse.money = 0;
      player.money += amount;
      transition = success(world, playerId, "looted_money", `\u4ECE\u9057\u7559\u7269\u4E2D\u53D6\u5F97 ${amount} LOOP\u3002`);
    } else {
      if (player.inventory.length >= 6) return failure(world, playerId, "inventory_full", "\u80CC\u5305\u5DF2\u6EE1\u3002 ");
      const index = corpse.items.findIndex((entry) => entry.instanceId === instanceId);
      const selected = corpse.items[index];
      if (!selected) return failure(world, playerId, "loot_not_found", "\u9057\u7559\u7269\u4E2D\u6CA1\u6709\u8BE5\u7269\u54C1\u3002 ");
      corpse.items.splice(index, 1);
      player.inventory.push(selected);
      transition = success(world, playerId, "looted_item", `\u4ECE\u9057\u7559\u7269\u4E2D\u53D6\u5F97${selected.name}\u3002`);
    }
    if (corpse.money === 0 && corpse.items.length === 0) world.corpses = world.corpses.filter(({ id }) => id !== corpse.id);
  } else if (action === "game_tactic") {
    const tactic = parseString(payload, "tactic");
    if (!["balanced", "aggressive", "defensive", "scavenge"].includes(tactic)) return failure(world, playerId, "invalid_tactic", "\u65E0\u6548\u6218\u672F\u3002 ");
    player.tactic = tactic;
    const labels = { balanced: "\u5747\u8861", aggressive: "\u5F3A\u653B", defensive: "\u9632\u5B88", scavenge: "\u641C\u522E" };
    transition = success(world, playerId, "tactic_changed", `\u6218\u672F\u5207\u6362\u4E3A${labels[player.tactic]}\u3002`);
  } else if (action === "game_flee") {
    if (!player.enemy) return failure(world, playerId, "no_enemy", "\u5F53\u524D\u6CA1\u6709\u9700\u8981\u64A4\u79BB\u7684\u654C\u4EBA\u3002 ");
    if (nextRandom(world) < 0.65) {
      player.enemy = null;
      transition = success(world, playerId, "fled", "\u6210\u529F\u8131\u79BB\u6218\u6597\u3002 ");
    } else {
      const damage=Math.max(1,player.enemy.attack-(player.armor?.power??0)-Object.values(player.armorParts??{}).reduce((v,a)=>v+(a?.power??0),0));
      player.hp = Math.max(0, player.hp - damage);
      if (player.hp === 0) player.alive = false;
      transition = success(world, playerId, "flee_failed", `\u64A4\u79BB\u5931\u8D25\uFF0C\u53D7\u5230 ${damage} \u70B9\u4F24\u5BB3\u3002`);
    }
  } else {
    return failure(world, playerId, "unsupported_game_action", "\u4E0D\u652F\u6301\u7684\u6E38\u620F\u884C\u52A8\u3002 ");
  }
  if (transition.ok) {
    transition.event.text += applyPoison(player);
    transition.event.text += advanceWorld(world);
  }
  return transition;
}
__name(applyGameAction, "applyGameAction");

function upgradeWorld(w){
 w.weatherId??=2;w.teams??={};w.traps??=[];w.areaDueAt??=Date.now()+1800000;w.areaWarned??=(w.warningAreas?.length>0);
 for(const p of Object.values(w.players??{})){p.proficiencies??={wp:0,wk:0,wg:0,wc:0,wd:0,wf:0};if(p.maxSp<300){p.maxSp=300;p.sp=300;}p.armorParts??={};p.teamId??=null;}
 return w;
}
const originalGameAction=applyGameAction;
applyGameAction=function(input,playerId,action,payload){
 const world=upgradeWorld(structuredClone(input??createGameWorld(20261028,"infinite")));
 const p=world.players[playerId];
 const arg=(key)=>typeof payload?.[key]==="string"?payload[key]:"";
 const fail=(code,text)=>failure(world,playerId,code,text);
 const succeed=(kind,text)=>{const r=success(world,playerId,kind,text);r.event.text+=applyPoison(p);r.event.text+=advanceWorld(world);return r;};
 if(p&&!p.alive&&action!=="game_restart")return fail("player_dead","角色已死亡，无法操作。");
 if(p&&world.phase==="finished"&&action!=="game_restart")return fail("game_finished","本局已经结束。");
 if(p&&world.forbidden.includes(p.area)&&action.startsWith("game_")&&action!=="game_restart"){p.hp=0;p.alive=false;return success(world,playerId,"zone_death","你停留在禁区，轮回终止。");}
 if(action==="game_team_create"&&p){
  if(p.teamId)return fail("already_in_team","你已经加入队伍。");
  if(p.sp<=200)return fail("insufficient_sp","组队需要200体力。");
  const id="team_"+playerId+"_"+world.cycle;if(world.teams[id])return fail("team_exists","队伍已经存在。");
  p.sp-=200;p.teamId=id;world.teams[id]=[playerId];return succeed("team_created","队伍创建成功。");
 }
 if(action==="game_team_join"&&p){
  if(p.teamId)return fail("already_in_team","你已经加入队伍。");
  const members=world.teams[arg("teamId")];if(!members)return fail("team_missing","没有此队伍。");
  if(members.length>=5)return fail("team_full","队伍人数已满。");
  if(p.sp<=100)return fail("insufficient_sp","加入队伍需要100体力。");
  members.push(playerId);p.teamId=arg("teamId");p.sp-=100;return succeed("team_joined","成功加入队伍。");
 }
 if(action==="game_team_leave"&&p){
  if(!p.teamId)return fail("team_missing","你不在队伍中。");
  const id=p.teamId,remaining=(world.teams[id]??[]).filter(x=>x!==playerId);
  if(remaining.length)world.teams[id]=remaining;else delete world.teams[id];p.teamId=null;return succeed("team_left","已退出队伍。");
 }
 if(action==="game_craft"&&p){
  if(p.enemy)return fail("enemy_present","战斗时不能合成。");
  const recipe=CRAFT_RECIPES.find(x=>x.result===arg("result"));if(!recipe)return fail("unknown_recipe","配方不存在。");
  const used=new Set();
  for(const item of recipe.ingredients){const index=p.inventory.findIndex((it,i)=>!used.has(i)&&it.catalogId===item);if(index<0)return fail("missing_ingredient","缺少合成材料。");used.add(index)}
  const def=catalog.find(x=>x.catalogId===recipe.result);if(!def)return fail("unknown_recipe","合成产物不存在。");
  for(const ix of [...used].sort((a,b)=>b-a))p.inventory.splice(ix,1);
  const item=makeItem(world,def);p.inventory.push(item);return succeed("crafted","合成成功："+item.name+"。");
 }
 if(action==="game_trap_place"&&p){
  const i=p.inventory.findIndex(it=>it.instanceId===arg("instanceId")&&it.kind==="trap");if(i<0)return fail("trap_missing","没有可用的陷阱。");
  const item=p.inventory.splice(i,1)[0];world.traps.push({id:item.instanceId,area:p.area,owner:playerId,power:item.power});return succeed("trap_placed","已设置陷阱。");
 }
 if(action==="game_trap_detect"&&p){const n=world.traps.filter(t=>t.area===p.area).length;return succeed("trap_detected","探测到"+n+"处陷阱。");}
 if(action==="game_equip"&&p){
  const i=p.inventory.findIndex(it=>it.instanceId===arg("instanceId"));const item=p.inventory[i];
  if(item?.kind==="armor"&&item.armorSlot&&item.armorSlot!=="body"){
   p.inventory.splice(i,1);const old=p.armorParts[item.armorSlot];if(old)p.inventory.push(old);p.armorParts[item.armorSlot]=item;return succeed("equipped","装备："+item.name+"。");
  }
 }
 if(action==="game_unequip"&&p&&["head","arms","legs"].includes(arg("slot"))){
  if(p.inventory.length>=6)return fail("inventory_full","背包已满。");const slot=arg("slot"),item=p.armorParts[slot];if(!item)return fail("slot_empty","装备栏为空。");
  delete p.armorParts[slot];p.inventory.push(item);return succeed("unequipped","卸下："+item.name+"。");
 }
 if(action==="game_attack"&&p?.teamId&&arg("targetId")&&world.players[arg("targetId")]?.teamId===p.teamId)return fail("friendly_fire","不能攻击队友。");
 if(action==="game_use"&&p){
  const it=p.inventory.find(x=>x.instanceId===arg("instanceId"));
  if(it&&it.durability>1&&["heal","stamina","antidote"].includes(it.kind)){
   it.durability--;if(it.kind==="heal")p.hp=Math.min(p.maxHp,p.hp+it.power);
   if(it.kind==="stamina")p.sp=Math.min(p.maxSp,p.sp+it.power);
   if(it.kind==="antidote")p.status="normal";
   return succeed("used_item","已使用："+it.name+"。");
  }
 }
 const count=world.forbidden.length;
 const result=originalGameAction(world,playerId,action,payload);
 upgradeWorld(result.world);
 if(result.ok){
  const next=result.world,q=next.players[playerId];
  if(action==="game_enter"&&q&&q.maxSp<300){q.sp=300;q.maxSp=300;}
  if(action==="game_restart"){
    next.areaDueAt=Date.now()+1800000;next.areaWarned=false;
    if(world.phase==="finished"){next.teams={};next.traps=[];}
    else if(p?.teamId&&next.teams[p.teamId]){
      const remaining=next.teams[p.teamId].filter(x=>x!==playerId);
      if(remaining.length)next.teams[p.teamId]=remaining;else delete next.teams[p.teamId];
    }
  }
  if(action==="game_attack"&&q){const k=weaponFamily(q.weapon?.catalogId??"fist");q.proficiencies[k]=Math.min(999,q.proficiencies[k]+1);}
  if(action==="game_move"&&q){
   const trap=next.traps.find(t=>t.area===q.area&&t.owner!==playerId);
   if(trap&&nextRandom(next)<.25){q.hp=Math.max(0,q.hp-trap.power);if(q.hp===0)q.alive=false;next.traps=next.traps.filter(t=>t.id!==trap.id);result.event.text+=" 触发陷阱，损失"+trap.power+"生命。";}
  }
  if(next.forbidden.length>count){next.weatherId=Math.floor(nextRandom(next)*WEATHER.length);result.event.text+=" 天气变为"+WEATHER[next.weatherId].name+"。";}
 }
 return result;
};
const originalView=getGameView;
getGameView=function(w,id){const v=originalView(upgradeWorld(structuredClone(w)),id);v.world.weatherId=w.weatherId??2;v.world.weather=WEATHER[v.world.weatherId]??WEATHER[2];v.world.teams=w.teams??{};v.world.areaDueAt=w.areaDueAt??Date.now()+1800000;v.recipes=CRAFT_RECIPES;return v;};

function getGameView(world, playerId) {
  world = normalizeSavedWorldAreas(clone(world));
  const player = world.players[playerId];
  const ranking = Object.values(world.players).sort((a, b) => Number(b.alive) - Number(a.alive) || b.kills - a.kills || b.level - a.level || b.wave - a.wave || a.id.localeCompare(b.id)).map(({ id, alive, kills, level, wave }, index) => ({ rank: index + 1, id, alive, kills, level, wave }));
  return {
    player,
    world: { mode: world.mode, phase: world.phase, cycle: world.cycle, turn: world.turn, forbidden: world.forbidden, warningArea: world.warningArea, warningAreas: world.warningAreas, winnerId: world.winnerId },
    areas: GAME_AREAS,
    shop: catalog.filter(({ price }) => price > 0),
    corpses: world.corpses.filter((corpse) => player && corpse.area === player.area),
    targets: world.mode === "standard" ? Object.values(world.players).filter((target) => target.id !== playerId && target.alive && player && target.area === player.area).map(({ id, hp, maxHp, level }) => ({ id, hp, maxHp, level })) : [],
    ranking
  };
}
__name(getGameView, "getGameView");

// src/index.ts
var ROOM_STATE_KEY = "room-state-v1";
var MAX_RECENT_COMMANDS = 256;
function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}
__name(json, "json");
async function proxyAuth(request, env, mode) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ error: "auth_not_configured" }, { status: 503 });
  }
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > 16 * 1024) return json({ error: "request_too_large" }, { status: 413 });
  let payload = {};
  if (mode !== "logout") {
    try {
      const parsed = await request.json();
      if (!parsed || typeof parsed !== "object") throw new Error("invalid");
      payload = parsed;
    } catch {
      return json({ error: "invalid_request" }, { status: 400 });
    }
  }
  let endpoint = "/auth/v1/logout";
  let upstreamBody;
  if (mode === "login" || mode === "signup") {
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload.password === "string" ? payload.password : "";
    if (!email || email.length > 254 || password.length < 8 || password.length > 128) {
      return json({ error: "invalid_credentials_format" }, { status: 400 });
    }
    endpoint = mode === "login" ? "/auth/v1/token?grant_type=password" : "/auth/v1/signup";
    upstreamBody = { email, password };
  } else if (mode === "refresh") {
    const refreshToken = typeof payload.refreshToken === "string" ? payload.refreshToken : "";
    if (!refreshToken || refreshToken.length > 4096) return json({ error: "invalid_refresh_token" }, { status: 400 });
    endpoint = "/auth/v1/token?grant_type=refresh_token";
    upstreamBody = { refresh_token: refreshToken };
  }
  const headers = new Headers({ apikey: env.SUPABASE_PUBLISHABLE_KEY });
  if (upstreamBody) headers.set("content-type", "application/json");
  if (mode === "logout") {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "auth_required" }, { status: 401 });
    headers.set("authorization", authorization);
  }
  const upstream = await fetch(new URL(endpoint, env.SUPABASE_URL), {
    method: "POST",
    headers,
    ...upstreamBody ? { body: JSON.stringify(upstreamBody) } : {}
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
__name(proxyAuth, "proxyAuth");
async function validateAccessToken(env, accessToken) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) return null;
  const response = await fetch(new URL("/auth/v1/user", env.SUPABASE_URL), {
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) return null;
  const user = await response.json();
  if (!user || typeof user !== "object" || typeof user.id !== "string") return null;
  return { id: user.id };
}
__name(validateAccessToken, "validateAccessToken");
function routeRoomSocket(request, env, roomId) {
  if (!isValidRoomId(roomId)) return json({ error: "invalid_room_id" }, { status: 400 });
  if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
    return json({ error: "websocket_upgrade_required" }, { status: 426 });
  }
  const id = env.GAME_ROOMS.idFromName(roomId);
  const headers = new Headers(request.headers);
  headers.set("x-dtr-room-id", roomId);
  return env.GAME_ROOMS.get(id).fetch(new Request(request, { headers }));
}
__name(routeRoomSocket, "routeRoomSocket");
function routeRoomState(request, env, roomId) {
  if (!isValidRoomId(roomId)) return json({ error: "invalid_room_id" }, { status: 400 });
  const id = env.GAME_ROOMS.idFromName(roomId);
  const headers = new Headers(request.headers);
  headers.set("x-dtr-room-id", roomId);
  headers.set("x-dtr-operation", "state");
  return env.GAME_ROOMS.get(id).fetch(new Request(request, { headers }));
}
__name(routeRoomState, "routeRoomState");
async function getPublicCatalog(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ error: "supabase_not_configured" }, { status: 503 });
  }
  const endpoint = new URL("/rest/v1/game_items", env.SUPABASE_URL);
  endpoint.searchParams.set("select", "id,sku,name,item_type,config");
  endpoint.searchParams.set("active", "eq.true");
  endpoint.searchParams.set("order", "sku.asc");
  const response = await fetch(endpoint, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY
    }
  });
  if (!response.ok) {
    return json({ error: "catalog_unavailable" }, { status: 502 });
  }
  return json({ items: await response.json() }, {
    headers: { "cache-control": "public, max-age=60, s-maxage=300" }
  });
}
__name(getPublicCatalog, "getPublicCatalog");
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "dtrgame",
        environment: env.APP_ENV,
        dependencies: {
          supabase: Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY),
          stripe: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET)
        }
      });
    }
    if (url.pathname === "/api/catalog" && request.method === "GET") {
      return getPublicCatalog(env);
    }
    const authMatch = url.pathname.match(/^\/api\/auth\/(login|signup|refresh|logout)$/);
    if (authMatch?.[1]) return proxyAuth(request, env, authMatch[1]);
    const roomStateMatch = url.pathname.match(/^\/api\/rooms\/([^/]+)\/state$/);
    if (roomStateMatch?.[1] && request.method === "GET") return routeRoomState(request, env, roomStateMatch[1]);
    const match = url.pathname.match(/^\/api\/rooms\/([^/]+)\/socket$/);
    if (match?.[1]) return routeRoomSocket(request, env, match[1]);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, { status: 404 });
    if (url.pathname === "/styles.css") return new Response(CSS, { headers: { "content-type": "text/css; charset=utf-8", "cache-control": "public, max-age=300" } });
    if (url.pathname === "/app.js") return new Response(APP, { headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "public, max-age=300" } });
    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};
var GameRoom = class {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.ready = this.state.blockConcurrencyWhile(async () => {
      this.room = await this.state.storage.get(ROOM_STATE_KEY) ?? this.room;
    });
  }
  state;
  env;
  static {
    __name(this, "GameRoom");
  }
  room = { sequence: 0, players: {}, recentCommandIds: [] };
  ready;
  snapshot() {
    return {
      type: "room_snapshot",
      sequence: this.room.sequence,
      players: Object.values(this.room.players)
    };
  }
  broadcast(message) {
    const encoded = JSON.stringify(message);
    for (const peer of this.state.getWebSockets()) {
      if (peer.readyState === WebSocket.OPEN) peer.send(encoded);
    }
  }
  async persist() {
    await this.state.storage.put(ROOM_STATE_KEY, this.room);
  }
  sendGameViews(log, error) {
    if (!this.room.game) return;
    for (const peer of this.state.getWebSockets()) {
      const attachment = peer.deserializeAttachment();
      if (peer.readyState === WebSocket.OPEN && attachment?.playerId && this.room.game.players[attachment.playerId]) {
        peer.send(JSON.stringify({ type: "game_state", view: getGameView(this.room.game, attachment.playerId), history: this.room.gameHistory?.slice(-30) ?? [], ...log ? { log } : {}, ...error ? { error } : {} }));
      }
    }
  }
  async fetch(request) {
    await this.ready;
    if(this.room.game?.phase==="active"){
      const notice=tickAreaClock(this.room.game);
      if(notice){await this.persist();this.sendGameViews(notice);}
      const due=nextAreaAlarmAt(this.room.game);
      if(due)await this.state.storage.setAlarm(due);
    }
    const roomId = request.headers.get("x-dtr-room-id");
    if (!this.room.roomId && roomId) {
      this.room.roomId = roomId;
      await this.persist();
    }
    if (request.headers.get("x-dtr-operation") === "state") {
      const gamePlayers = Object.values(this.room.game?.players ?? {});
      return json({
        roomId: this.room.roomId,
        connected: this.state.getWebSockets().length,
        joined: gamePlayers.length,
        alive: gamePlayers.filter(({ alive }) => alive).length,
        phase: this.room.game?.phase ?? "waiting",
        turn: this.room.game?.turn ?? 0,
        cycle: this.room.game?.cycle ?? 1
      });
    }
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return json({ error: "websocket_upgrade_required" }, { status: 426 });
    }
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.state.acceptWebSocket(server);
    server.serializeAttachment({ connectedAt: Date.now() });
    server.send(JSON.stringify(this.snapshot()));
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(socket, raw) {
    await this.ready;
    if (typeof raw !== "string") {
      socket.close(1003, "Text messages only");
      return;
    }
    const message = parseClientMessage(raw);
    if (!message) {
      socket.send(JSON.stringify({ type: "error", code: "invalid_message" }));
      return;
    }
    if (message.type === "ping") {
      socket.send(JSON.stringify({ type: "pong", at: message.at, sequence: this.room.sequence }));
      return;
    }
    if (message.type === "auth" || message.type === "guest") {
      const authenticatedUser = message.type === "auth" ? await validateAccessToken(this.env, message.accessToken) : null;
      if (message.type === "auth" && !authenticatedUser) {
        socket.send(JSON.stringify({ type: "error", code: "auth_invalid" }));
        return;
      }
      if (message.type === "guest" && this.env.APP_ENV !== "test") {
        socket.send(JSON.stringify({ type: "error", code: "guest_disabled" }));
        return;
      }
      const now = Date.now();
      const playerId = authenticatedUser?.id ?? `guest:${message.type === "guest" ? message.guestId : ""}`;
      const existing = this.room.players[playerId];
      this.room.players[playerId] = {
        id: playerId,
        joinedAt: existing?.joinedAt ?? now,
        lastSeenAt: now
      };
      const attachment2 = socket.deserializeAttachment() ?? { connectedAt: now };
      socket.serializeAttachment({ ...attachment2, playerId, ...authenticatedUser ? { authenticatedAt: now } : {} });
      this.room.sequence += 1;
      await this.persist();
      this.broadcast({ type: "room_event", sequence: this.room.sequence, event: { type: "player_joined", player: this.room.players[playerId] } });
      const tutorialState = this.room.tutorialPlayers?.[playerId];
      if (this.room.roomId === "tutorial" && tutorialState) {
        socket.send(JSON.stringify({ type: "tutorial_state", state: tutorialState, log: "\u8BAD\u7EC3\u72B6\u6001\u5DF2\u6062\u590D\u3002" }));
      }
      if (this.room.roomId !== "tutorial" && this.room.game?.players[playerId]) {
        socket.send(JSON.stringify({ type: "game_state", view: getGameView(this.room.game, playerId), history: this.room.gameHistory?.slice(-30) ?? [], log: "\u5BF9\u5C40\u72B6\u6001\u5DF2\u6062\u590D\u3002" }));
      }
      return;
    }
    const attachment = socket.deserializeAttachment();
    const player = attachment?.playerId ? this.room.players[attachment.playerId] : void 0;
    if (!attachment?.playerId || !player) {
      socket.send(JSON.stringify({ type: "error", code: "auth_required" }));
      return;
    }
    if (this.room.recentCommandIds.includes(message.commandId)) {
      socket.send(JSON.stringify({ type: "command_ack", commandId: message.commandId, duplicate: true, sequence: this.room.sequence }));
      return;
    }
    let tutorialResult;
    let gameResult;
    if (message.action.startsWith("tutorial_")) {
      if (this.room.roomId !== "tutorial") {
        socket.send(JSON.stringify({ type: "error", code: "tutorial_room_required" }));
        return;
      }
      tutorialResult = applyTutorialAction(this.room.tutorialPlayers?.[attachment.playerId], message.action, message.payload);
      if (!tutorialResult.ok) {
        socket.send(JSON.stringify({ type: "tutorial_state", state: tutorialResult.state, error: tutorialResult.code, log: tutorialResult.log }));
        return;
      }
      this.room.tutorialPlayers ??= {};
      this.room.tutorialPlayers[attachment.playerId] = tutorialResult.state;
    }
    if (message.action.startsWith("game_")) {
      if (this.room.roomId === "tutorial") {
        socket.send(JSON.stringify({ type: "error", code: "game_room_required" }));
        return;
      }
      const gamePayload = message.action === "game_enter" ? { mode: this.room.roomId?.startsWith("standard") ? "standard" : "infinite" } : message.payload;
      gameResult = applyGameAction(this.room.game, attachment.playerId, message.action, gamePayload);
      if (!gameResult.ok) {
        socket.send(JSON.stringify({ type: "game_state", view: getGameView(gameResult.world, attachment.playerId), error: gameResult.code, log: gameResult.event.text }));
        return;
      }
      this.room.game = gameResult.world;
      const notice=tickAreaClock(this.room.game);
      if(notice)gameResult.event.text+=" "+notice;
      const due=nextAreaAlarmAt(this.room.game);
      if(due)await this.state.storage.setAlarm(due);
    }
    this.room.recentCommandIds.push(message.commandId);
    this.room.recentCommandIds = this.room.recentCommandIds.slice(-MAX_RECENT_COMMANDS);
    this.room.sequence += 1;
    player.lastSeenAt = Date.now();
    if (gameResult) {
      this.room.gameHistory ??= [];
      this.room.gameHistory.push({ sequence: this.room.sequence, ...gameResult.event, at: Date.now() });
      this.room.gameHistory = this.room.gameHistory.slice(-100);
    }
    await this.persist();
    if (gameResult) {
      this.broadcast({ type: "game_event", sequence: this.room.sequence, event: gameResult.event });
      this.sendGameViews(gameResult.event.text);
      return;
    }
    this.broadcast({
      type: "room_event",
      sequence: this.room.sequence,
      event: {
        type: "action",
        playerId: attachment.playerId,
        action: message.action,
        payload: message.payload,
        commandId: message.commandId,
        ...tutorialResult ? { tutorial: tutorialResult.state, log: tutorialResult.log } : {}
      }
    });
  }
  async alarm() {
    await this.ready;
    if(!this.room.game)return;
    const notice=tickAreaClock(this.room.game);
    if(notice){
      this.room.sequence+=1;
      this.room.gameHistory??=[];
      this.room.gameHistory.push({sequence:this.room.sequence,kind:"area_clock",playerId:"system",text:notice,at:Date.now()});
      this.room.gameHistory=this.room.gameHistory.slice(-100);
      await this.persist();
      this.broadcast({type:"game_event",sequence:this.room.sequence,event:{kind:"area_clock",playerId:"system",text:notice}});
      this.sendGameViews(notice);
    }
    const due=nextAreaAlarmAt(this.room.game);
    if(due)await this.state.storage.setAlarm(due);
  }
  async webSocketClose(socket, code, reason, wasClean) {
    socket.close(code, reason || (wasClean ? "closed" : "disconnected"));
  }
};
export {
  GameRoom,
  index_default as default
};
//# sourceMappingURL=index.js.map
