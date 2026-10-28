# ACFUN 大逃杀 — 原版 1:1 底层迁移

**唯一目标：原版原样，后台从 PHP/MySQL 迁移到 TypeScript/Cloudflare，页面、文案、素材、数值、流程和全部实际启用模块不得更改。**

“无限轮回 · MUGEN LOOP”的独立 UI、教程与简化游戏引擎已经从本项目主线移除；旧版源码存档在 `archive/mugen-loop-before-original-only-20261028`，不再部署运行。

## 可玩地址与开发环境

- **目前真正可玩的原版**：[dts.zhangyingyin.top](https://dts.zhangyingyin.top/)（仍由原有 PHP 后端运行）。
- **原 Cloudflare 入口**：[dtrgame.dearpassengerscrew-new.workers.dev](https://dtrgame.dearpassengerscrew-new.workers.dev/)：临时直接跳转到上面的可玩原版，不伪称后端已经迁移。
- **原版页面及素材暂存**：[dtrgame-original-1to1-staging.dearpassengerscrew-new.workers.dev](https://dtrgame-original-1to1-staging.dearpassengerscrew-new.workers.dev/)：原版游客页，原始文件 720/720 字节校验一致；功能未移植完，仍不可玩。

## 代码结构

- `src/index.ts`：只有原版 URL/资产入口。尚未实现的 PHP 请求明确返回 501，不构造虚假的游戏功能。
- `src/original-protocol.ts`：与原版 PHP `gencode()` / `gdecode()` 兼容的 gzip + Base64 + JSON；已用旧版 PHP 真实样本验收。
- `src/baota-item-tables.ts`、`src/legacy-recipes.ts`：从实际宝塔导出的物品与 465 条配方源数据。数据导入不等于相关玩法完成。
- `docs/ORIGINAL_GAME_1_TO_1_CONTRACT.md`：验收标准与不可更改项。
- `docs/LEGACY_INSTALLED_MODULES_20261028.csv`：原版 735 启用 / 9 停用模块。
- `scripts/original-playability-gate.mjs`：阻止仅上传静态页面就宣称可玩。

## 本地验证

```bash
npm ci
npm run verify
```

**仅通过 Cloudflare 插件发布。没有 GitHub Actions 或自动部署。** 正式 Worker 的 Durable Object 数据与 Supabase 绑定已保留，没有重置。切换前需完成全部原版后端请求、真实游戏对局及存档一致性验证。