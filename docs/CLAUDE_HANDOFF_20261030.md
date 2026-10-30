# ACFUN 大逃杀 TypeScript 迁移交接文档

**交接日期：2026-10-30（Asia/Shanghai）**  
**仓库：`https://github.com/cqseo/dtrgame`**

## 1. 唯一有效的最终验收标准

原版 **ACFUN 大逃杀 1:1 还原**：界面、图片、文字、账号、房间、战斗、技能、道具、全部玩法和数值都不变；只将 PHP/MySQL 底层迁移为 TypeScript + Cloudflare + Supabase，并且能够完整游玩。

不得改版、换皮、简化、更改数值、改文案或用新 UI 代替旧 UI。不得因为基础内核能运行就宣称已完成。完整约束见 `docs/ORIGINAL_GAME_1_TO_1_CONTRACT.md`。

## 2. 当前真实进度

| 项目 | 当前状态 |
|---|---|
| 原版加载器模块 | 744 |
| 启用模块 | 735 |
| 完整通过 1:1 验收 | **0** |
| 部分移植 | **34**（原写 37，与生成器不符，已按 `legacy-module-migration.json` 更正） |
| 待移植 | **710**（原写 707） |
| 已移植 hook 实现 | **56 / 5,235（1.07%）** |
| 自动化测试 | **154 passed**；7 个 PHP oracle 断言已真实执行并通过（此前一直 skipped） |
| TypeScript 检查 | 通过 |
| Cloudflare dry-run build | 通过，641.80 KiB / gzip 80.95 KiB |
| 正式 Cloudflare 发布 | **未发布**，当前版本不可完整游玩 |

“部分移植”只代表已翻译并测试了该模块的一部分 hook，不代表整个模块完成。完整清单见 `docs/TYPESCRIPT_PORT_STATUS.md` 和 `docs/legacy-module-migration.json`。

## 3. 已完成的基础设施

1. **PHP 兼容内核**
   - 原 loader 顺序、强制依赖图、newest-first hook dispatch。
   - `$chprocess` 父链调用，包括重复调用和改参调用。
   - PHP 引用语义、请求全局变量、可回滚 RNG checkpoint、事务状态和执行追踪。
   - 已生成 3,211 个 hook 名、5,235 个实现、505 条重载链。

2. **Cloudflare Durable Object 运行时**
   - `LegacyRoomDurableObject` 与 `LegacyGameDurableObject`。
   - 比赛状态版本化；命令、战斗、尸体搜索在单个事务内提交。
   - Durable Object 丢失本地状态时可从 Supabase 恢复最新快照。

3. **Supabase 快照层**
   - 新项目 ref：`qtjcjmpapjsgrrgtfica`。
   - URL：`https://qtjcjmpapjsgrrgtfica.supabase.co`。
   - 私有 schema/table：`dtr_runtime.match_snapshots`。
   - RPC：`dtr_match_load` / `dtr_match_save`。
   - RLS 已开，客户端无权限，只允许 service role 执行。
   - 迁移：`supabase/migrations/202610300001_dtr_runtime_match_snapshots.sql`。
   - 不要修改或删除现有 `acfun_legacy`。QA schema 是 `acfun_runtime_qa_20261029`。

4. **已接入命令内核的部分玩法**
   - 移动、搜索、冷却、休息、姿态/策略、伤口。
   - 地图物品发现/移除/拾取/合并/背包满分支。
   - 背包使用/移动/合并，食物效果，武器/护甲/饰品装备、交换、卸下、丢弃。
   - 异常状态药品、弹药装填、道具合成。
   - 遇敌、可见性、先攻权、尸体保护，队伍创建/加入/退出。
   - 双玩家攻击事务：命中/伤害、武器消耗/损坏、熟练度/经验、死亡、击杀计数、距离、反击。
   - 尸体金钱、销毁、物品转移的原子提交。

## 4. 原版真值来源

- 宝塔服务器：`VM-0-10-opencloudos`。
- 原版实时源码：`/www/wwwroot/dts-game-test`。
- 原 UI 备份：`/opt/dts-sandbox/backups/legacy-ui-reference-20261028/original-full-ui-only.tar.gz`。
- UI 备份 SHA-256：`52abb75a53fa27fb5ab2bfabc08f612b691917ed7dbc48ea1fdc266227f094dc`。
- UI hash manifest：`/opt/dts-sandbox/backups/legacy-ui-reference-20261028/full-ui-manifest.json`。
- 本地捕获的原版源：仓库相邻目录 `../legacy-dts`。
- PHP 参考解释器：**必须是 PHP 8.2.x**。线上 nginx 走 `php-cgi-82.sock`（8.2.35），此前文档写的 `php8.3` 会引入次版本语义差异，不得用于黄金样本。
- 服务器端冻结只读副本：`/opt/dts-sandbox/parity/legacy-dts`（已 `chmod -R a-w`，4,395 文件，与本地副本一致）。
- `tools/php-remote` 通过 SSH 桥接宝塔主机上的 8.2.35；`npm run test:php-parity` 默认使用它，并在非 8.2 版本上直接拒绝运行。
- 已验证 1,565 个原版展示文件 hash/length 全部一致，不得自行改动原素材。

如果 Claude 所在环境没有 `../legacy-dts`，必须从宝塔原路径重新拉取一份只读副本，不要在线修改 PHP 来迎合 TypeScript。

## 5. Cloudflare 配置

- 新 Cloudflare account ID：`c7e30e39bf58e1ad33871164f3cd1818`。
- staging Worker：`dtrgame-original-1to1-staging`。
- Durable Object bindings：`ROOMS` / `GAMES`。
- migrations：`v1 LegacyRoomDurableObject`，`v2 LegacyGameDurableObject`。
- 配置：`wrangler.jsonc`。
- 原 QA Worker 配置：`wrangler.original-qa.jsonc`。
- 只通过已授权的 Cloudflare 插件/API 发布；不要加 GitHub Actions 自动发布。
- **在全部 parity gate 通过前不要替换正式入口。**

当前入口：

- 真正可玩的 PHP 原版：`https://dts.zhangyingyin.top/`
- 原 Cloudflare 入口（当前跳转 PHP）：`https://dtrgame.dearpassengerscrew-new.workers.dev/`
- 静态原 UI staging：`https://dtrgame-original-1to1-staging.dearpassengerscrew-new.workers.dev/`

## 6. 环境密钥和安全约束

- Worker 需要 secret：`SUPABASE_SECRET_KEY`。
- 只能通过 Cloudflare secret 配置，**不得写入仓库、日志、交接文档或前端**。
- 前端不得拿到 service-role/secret key。
- 不得重置现有 Durable Object 生产数据或 Supabase 数据。
- 本文档不包含任何密钥。

## 7. 接手后立即执行

```bash
git clone https://github.com/cqseo/dtrgame.git
cd dtrgame
npm ci
npm run verify
```

如果在现有工作目录继续：

```bash
cd /workspace/scratch/d647e4b072a2/dtrgame-sync
git status --short
npm run check
npm test
npm run build
```

常用生成/审计命令：

```bash
npm run audit:legacy
npm run generate:legacy
npm run generate:hooks
npm run generate:migration
npm run test:php-parity
```

任何模块完成后都应：

1. 对照 `/www/wwwroot/dts-game-test` 的实际 PHP hook 链。
2. 建立 PHP 黄金样本，比较返回值、日志、RNG 消耗顺序、玩家/地图/房间持久化差异。
3. 覆盖成功、失败、边界、回滚、并发分支。
4. 通过 `npm run verify`。
5. 更新 `docs/TYPESCRIPT_PORT_STATUS.md` 和 `docs/legacy-module-migration.json`，且只根据实际 parity 结果改状态。

## 8. 推荐的剩余工作顺序

### P0：先建立可量化的完整 parity 闭环

1. 为每个启用模块生成“hook 实现→PHP fixture→TS fixture→差异”清单。
2. 完成原 PHP 请求黄金样本驱动器，不只测纯函数。
3. 将模块状态与测试 fixture 强绑定，防止人工把 partial 改成 complete。

### P1：打通一个原版最小完整对局

1. 原版 URL/router：`index.php` / `login.php` / `register.php` / `game.php` / `roomcmd.php` / `roomupdate.php` / `command.php` 等。
2. 原 cookie/session/login/register/account 数据语义。
3. 房间创建、加入、准备、开局、刷新、结束。
4. 角色创建、初始道具、移动/搜索/遇敌/战斗/死亡/胜利/存档恢复。
5. 用原 JS 直接调用新 Worker，不改 `game.20240318.js` 和 `common.20240301.js`。

### P2：补齐全部玩法模块

1. 先完成命令/道具/战斗的所有 hook，包括强化药、陷阱、异常、护甲耐久、特殊属性、技能/卡牌/社团/成就/副本。
2. 再按 loader 顺序完成剩余 707 个 partial/pending 模块。
3. 补齐聊天、回放、排名、用户中心、管理/后台 daemon 等全链路。

### P3：原版页面与视觉 1:1

1. 实现 PHP 模板指令兼容：`{template}` / `{lang}` / `<!--{if}-->` / `{eval}` / `{loop}` / 变量插值。
2. 使用原 1,565 个展示文件，不改 HTML ID/class、CSS、JS、素材和顺序。
3. 对登录前、登录后、房间、对局、死亡/结算等所有状态做 desktop/mobile 截图 diff。

### P4：数据迁移、并发、灾备和发布

1. 完成 124 个原玩家字段及所有房间/比赛/排名/回放数据迁移。
2. 压测 Durable Object 分片、Supabase RPC 与快照保留策略。
3. 验证重放、断线恢复、重复请求、版本冲突、DO 重启、Supabase 短时故障。
4. 备份、回滚、流量切换演练通过后，才能将 Cloudflare 正式入口从 PHP 切到 TypeScript。

## 9. 明确的未完成项和当前卡点

- 最大工作量不是“换语言”，而是 735 个动态 PHP 模块的 hook 语义、运行顺序、隐藏数值和页面响应的逐条 1:1 验证。
- 当前还没有完整的账号→房间→开局→对局→结束 E2E 闭环。
- 当前 Worker 的 PHP POST 请求仍应对未实现部分返回 501，不得假装成可玩。
- 当前还没有任何模块达到“全 hook + PHP fixture + UI fixture”的 complete 验收。
- 支付、登录优化、分销不在本阶段。用户已明确：先完成游戏所有功能，再完善 Stripe/登录/分销。

## 10. 最终发布硬门槛

以下全部通过前，不得声称完成：

- 原静态素材 hash 全部一致。
- 原公共 URL 和原 JS 请求全部工作。
- 原模板在所有状态下等价渲染。
- 735 个启用模块的所有相关 hook 都有 PHP/TS parity fixture。
- desktop/mobile 视觉 diff 通过。
- 全模式 E2E 完成，包括账号、房间、战斗、技能、道具、死亡、胜利、断线恢复。
- 玩家数据迁移、备份、回滚、压测、故障演练通过。
- `npm run verify` 通过，Cloudflare staging 真实浏览器验收通过。

---

**给 Claude 的一句话：请把 PHP 原版当作可执行规格，以模块和 hook 为最小单位逐条做黄金样本 parity；不要重写玩法，不要换 UI，不要在 735 个模块、原页面和 E2E 门槛全部通过前发布或声称完成。**
