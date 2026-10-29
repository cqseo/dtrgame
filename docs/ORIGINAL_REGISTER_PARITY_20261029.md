# 2026-10-29 ACFUN 原版 1:1 迁移 — 注册验证的纯函数对等里程碑

## 严格范围
此提交仅移植原版 PHP 的注册验证码/验证题 **算法**，不重写、不简化客户端、不修改正式网站及数据库；不代表账号注册接口已经可用，也不代表 735 个已启用玩法模块已经完成。

## 原版依据
- 宝塔正式源码 `/www/wwwroot/dts-game-test/include/global.func.php` 中 `fatenum_create`。
- 宝塔正式源码 `/www/wwwroot/dts-game-test/include/user.func.php` 中 `register_fatenum_create`、`register_random_create`、`register_verification_question_get`。
- 实际运行站点的 `gamedata/cache/vqpool.php`，共 497 条；提交到 `src/generated/legacy-vq-pool.ts`，顺序、文字不可随意变更。
- 原版的分钟、日期、时区通过 `LegacyRegistrationContext` 显式传入，不能用 Cloudflare Worker 所在时区替代。

## 已执行校验
在 `VM-0-10-opencloudos` 的隔离目录 `/opt/dts-port-workbench-20261029` 中，从原版 PHP 文件自动提取函数并 `eval`，而非手写另一份 PHP 模拟代码；读取原版语料缓存只读，不访问玩家数据。

- 23 条随机数及随机种子 golden fixtures：TypeScript 全部匹配 PHP。
- 128 条完整中文验证题、选项顺序、正确选项测试：全部匹配 PHP。
- 其中 8 条完整题目 fixtures 与 23 条基础 fixtures 已固定在 `test/original-verification.test.ts`，可供仓库回归。
- 必须注意 PHP 64 位整数溢出后的浮点数转字符串会出现 `E+` 科学记数法；已加入兼容处理，不可直接改用 JS `Number.toString()`。

## 后续工作及发布门槛
1. 把原版游客注册模板的动态变量、服务端 `register.php` 表单请求/错误信息与现有协议完全对应；不能只提供一个不同样式的注册页。
2. 在隔离数据库核对 124 个原版玩家字段，完整实现账号持久化、Cookie/会话、旧账号导入与无损回滚。
3. 实现 `roomcmd.php`、`command.php`、房间及 daemon 状态机与全部 735 个已启用模块，逐项制作 PHP golden fixtures。
4. 只有原版 URL、HTML/CSS/JS、图片、账号、房间、技能、道具、数值、战斗、结算、存档和全模式实战均对等通过，才能对外宣称 1:1 已完成。

**发布状态**：仅开发分支；Cloudflare 正式入口和 PHP 原版站点未切换，玩家数据未动。

## 独立 Cloudflare Worker 实际运行验收（2026-10-29）
- Worker：`dtrgame-original-verification-qa-20261029`（与正式 `dtrgame` 完全分开）。
- 在线只读自检：`https://dtrgame-original-verification-qa-20261029.dearpassengerscrew-new.workers.dev/__selftest`
- 部署使用 Cloudflare API 连接器；打包为纯 JavaScript，原 PHP 不参与执行。
- 实测 HTTP 200，返回 `pass: true`、`phpSourceFixtureChecks: 31`、`corpusCount: 497`、`errors: []`、`gamePlayable: false`、`productionDataAccess: false`。
- 独立宝塔开发工作区：TypeScript `tsc --noEmit` 成功；Vitest 32 项通过。
- 更广泛的开发对照：PHP 原源码生成 23 条随机种子案例及 128 条完整题目案例，TypeScript 全部一致。
- **这不是游戏发布环境**：它没有玩家数据库绑定，只有 `GET /__selftest`，其他路径返回 404。

