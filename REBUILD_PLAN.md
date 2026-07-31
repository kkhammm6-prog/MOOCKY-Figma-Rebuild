# MOOCKY Figma Rebuild 执行计划

> 状态：前置准备  
> 建立日期：2026-07-30  
> 当前阶段：Phase 3 / 4 — Landing Page 实现与 V1 视觉验收

## 1. 项目目标

以 MOOCKY 的 Figma 高保真原稿为主要设计证据，参考现有 GitHub、Notion 项目记录和线上网站，从静态页面开始重新实现产品界面，通过多轮视觉验收逐步收敛到高保真版本，最后部署到独立的 rebuild 项目和域名。静态页面与视觉验收完成后，再单独接入 AI API。

这次重建需要同时保留两条可追溯链路：

1. 产品链路：研究与需求 → Figma → 设计系统 → 页面实现 → 视觉验收 → 部署 → AI。
2. 工程链路：分支 → Commit → Pull Request → Tag → Deployment。

## 2. 已确认决策

| 项目 | 决策 |
| --- | --- |
| GitHub 仓库 | `MOOCKY-Figma-Rebuild` |
| 仓库权限 | Public |
| 项目起点 | 复制当前 MOOCKY 工程结构与 Lumen Atlas 设计系统 |
| Git 历史 | 不复制旧仓库历史，从新的初始提交开始 |
| Notion 父页面 | [MOOCKYAI 项目进度](https://app.notion.com/p/3ad947162667809fa35decaf52a3b881) |
| Notion 执行页 | [MOOCKY Figma Rebuild｜设计还原与部署记录](https://app.notion.com/p/3ad94716266781faaa7cc9c9d1fb3ead) |
| Figma 文件 | [Group 5](https://www.figma.com/design/hoN23Dj67OVv6D0drKYY24/Group-5?m=dev) |
| Figma 目标区域 | `HI-FI example` |
| 部署 | 新建独立 rebuild 项目和域名，不覆盖旧站 |
| AI 实现顺序 | 静态页面与视觉验收完成后再接入 AI API |

## 3. 参考资料与证据优先级

实现冲突时按以下顺序判断：

1. 目标 Figma Frame 的结构化设计数据与同节点截图。
2. `docs/design-system.md` 和 `tokens.json`。
3. `docs/component-specs.md` 与 `design-system/`。
4. 新 Notion 计划中的已确认决策。
5. 现有线上网站的内容、路径和交互行为。
6. 旧 GitHub 仓库的实现代码。

旧代码只作为工程结构和行为参考，不能替代 Figma 证据，也不能直接证明本次重建已经完成。

### 参考入口

- 旧 GitHub：<https://github.com/kkhammm6-prog/MOOCKY-AI-Enhanced-Online-Learning-Platform>
- 旧线上网站：<https://moocky-ai.vercel.app/course>
- 新 Notion 父页面：<https://app.notion.com/p/3ad947162667809fa35decaf52a3b881>
- 新 Notion 执行页：<https://app.notion.com/p/3ad94716266781faaa7cc9c9d1fb3ead>
- Figma：<https://www.figma.com/design/hoN23Dj67OVv6D0drKYY24/Group-5?m=dev>

## 4. 基线策略

当前目录是旧项目工程快照的新 Git 起点：

- 保留 Next.js、React、TypeScript、Playwright 配置。
- 保留字体、公共资源、共享组件和 Lumen Atlas 设计系统。
- 不复制旧 `.git` 历史。
- 不复制旧 `portfolio/`，避免把之前的作品集结果当成本次过程证据。
- 不复制旧 `memory.md`，避免旧部署状态影响 rebuild 项目。
- 旧页面代码暂时保留为实现参考；每个页面只有在完成本轮 Figma 双证据实现和验收后，才标记为“Rebuilt”。
- AI 页面和 API 代码暂时不作为本轮验收对象；AI 阶段开始时重新审计并单独提交。

## 5. 范围

### 当前范围

- 建立独立 GitHub 私有仓库。
- 建立 Notion 执行计划和进度记录。
- 建立 Figma 页面清单与节点证据表。
- 逐页完成静态高保真实现。
- 建立响应式与主题状态。
- 建立 Playwright 视觉验收流程。
- 部署到独立 rebuild 项目。
- 静态版本完成后接入 AI API。

### 当前不包含

- 覆盖旧线上网站。
- 在静态页面验收前接入 AI API。
- 在缺少节点级 Figma 证据时声称像素级还原。
- 把旧仓库已有页面直接计为本次重建成果。

## 6. 实施阶段

### Phase 0 — Foundation

- [x] 确认仓库、Notion、Figma、部署和 AI 顺序。
- [x] 创建不含旧 Git 历史的本地项目基线。
- [x] 保留工程骨架与 Lumen Atlas 设计系统。
- [x] 创建 GitHub 公开仓库并推送 `main`、`codex/foundation` 与 `v0.1-planning`。
- [x] 创建 Notion 执行计划。
- [x] 为首个目标 Frame 获取包含 `node-id` 的 Figma 链接：Landing Page section `419:5349`。
- [x] 创建 `v0.1-planning` Tag。

**退出标准**：GitHub、Notion 与本地仓库相互链接；首个目标节点可被 Figma MCP 精确读取。**已达成。**

### Phase 1 — Figma Inventory

- [ ] 列出 `HI-FI example` 中所有待实现页面。
- [ ] 为每个页面记录 Desktop、Tablet、Mobile 与主题状态。
- [ ] 记录每个目标 Frame 的 `node-id`、截图和实现状态。
- [ ] 区分设计系统组件、页面局部组件和一次性样式。
- [ ] 建立页面实现顺序。

**产出**：页面清单、节点证据表、组件复用表、资源清单。

### Phase 2 — Design System Alignment

- [ ] 对照 Figma Variables 与现有 `tokens.json`。
- [ ] 确认字体、颜色、间距、圆角、边框、阴影和动效。
- [ ] 确认 Button、Tag、Header、Footer、Course Card 等组件边界。
- [ ] 把重复出现的模式提升到设计系统。
- [ ] 记录 Figma 与旧实现之间的差异。

**产出**：更新后的设计 token、组件规范和设计决策。

### Phase 3 — Page-by-Page Rebuild

每个页面使用独立分支和独立验收记录：

1. 获取目标节点的 Figma `get_design_context`。
2. 获取同一节点截图。
3. 复用设计系统 token 和组件。
4. 完成页面结构和静态内容。
5. 完成交互状态。
6. 完成响应式和主题。
7. 进入视觉验收。

推荐顺序：

1. Landing / Home。
2. Course 页面。
3. Course Detail。
4. Progress / Dashboard。
5. AI Chat 静态界面。
6. 其他辅助页面。

实际顺序以 `HI-FI example` 的页面清单为准。

### Phase 4 — Visual QA

视觉还原按成熟度逐轮推进：

| 等级 | 目标 |
| --- | --- |
| V0 | 页面可访问、区块完整、没有阻断错误 |
| V1 | 主要布局、内容层级和路由一致 |
| V2 | 字体、颜色、间距、圆角和组件样式一致 |
| V3 | Hover、Focus、Loading、Empty、Error、主题和响应式一致 |
| V4 | 完成作品集展示所需的细节精修与最终验收 |

固定视口：

- Desktop：1440px
- Compact Desktop：1024px
- Mobile：390px
- Light Mode 与 Dark Mode（Figma 提供对应证据时）

每轮最多集中修复一类问题，并记录：

- `P0`：结构、功能、溢出、路由错误。
- `P1`：明显的布局、字体、颜色和组件差异。
- `P2`：1–4px、图标、阴影、裁切和动画细节。

Playwright 临时产物不进入 Git；具有作品集价值的对比图需要人工筛选后放入 `docs/visual-qa/evidence/`。

### Phase 5 — Rebuild Deployment

- [ ] 本地完成 `typecheck`、`build` 和 Playwright 验收。
- [ ] 创建独立部署项目。
- [ ] 首次发布 Preview。
- [ ] 验证路由、资源、字体、响应式和主题。
- [ ] 发布 Production。
- [ ] 确认 rebuild 稳定域名返回成功状态。
- [ ] 创建正式版本 Tag。

目标项目名：`moocky-ai-rebuild`。最终域名取决于部署平台可用性，不能在创建前视为已确认。

### Phase 6 — AI API

该阶段仅在静态界面达到 V3 及以上后开始：

- [ ] 重新确认模型供应商和模型。
- [ ] 定义消息、结构化输出和流式传输协议。
- [ ] 配置服务端环境变量。
- [ ] 实现 Loading、Thinking、Streaming、Answered、Error 和 Refusal。
- [ ] 添加 API 与浏览器验收。
- [ ] 创建独立 AI Preview 和发布版本。

## 7. Git 版本管理

### 长期分支

- `main`：仅保存通过验收、可部署的版本。
- `codex/foundation`：当前前置准备分支。

### 工作分支

- `codex/figma-inventory`
- `codex/page-<page-name>`
- `codex/qa-<page-name>`
- `codex/ai-chat`
- `codex/release-<version>`

每个分支只处理一个可说明的目标，不在同一提交中混入无关页面。

### Commit 规范

```text
chore: establish independent rebuild baseline
docs: add Figma rebuild implementation plan
feat(course): implement Figma structure
fix(course): align spacing and typography after visual QA
test(course): add responsive Playwright coverage
docs(qa): record course visual comparison round 2
release: prepare rebuild production deployment
```

### Tag 规范

| Tag | 含义 |
| --- | --- |
| `v0.1-planning` | 仓库、计划和证据链建立 |
| `v0.2-foundation` | Figma 清单和设计系统对齐 |
| `v0.x-<page>` | 单个页面完成 V3 验收 |
| `v1.0-static` | 静态产品完成并部署 |
| `v1.1-ai` | AI API 完成并部署 |

每个 Tag 对应一个明确 Commit；不使用 Tag 代替正常提交。

## 8. 目录与证据约定

```text
docs/
├── figma-inventory.md
├── implementation-log.md
├── decisions.md
└── visual-qa/
    ├── <page>-round-01.md
    ├── <page>-round-02.md
    └── evidence/
        ├── <page>-figma.png
        └── <page>-browser-vN.png
```

每次视觉验收记录至少包含：

- Figma 文件、目标节点和截图来源。
- Git Commit。
- 浏览器视口和主题。
- 当前成熟度等级。
- P0、P1、P2 差异。
- 本轮已修复项。
- 尚未匹配项及原因。
- 下一轮目标。

## 9. 完成标准

静态版本完成需要同时满足：

- 所有范围内页面拥有节点级 Figma 证据。
- 所有页面至少达到 V3。
- 关键展示页面达到 V4。
- 1440px、1024px 和 390px 没有阻断问题。
- 关键交互状态完成验收。
- TypeScript 检查和生产构建通过。
- Playwright 核心流程通过。
- 独立 rebuild 生产域名可访问。
- GitHub Commit、Tag、Notion 记录和部署版本能够相互追溯。

## 10. 当前阻塞与待确认

### Figma 节点链接

当前 Figma MCP 能读取文件，但顶层只识别到 `Test` 和 `Components` 两个 Page，尚未从元数据中定位到名为 `HI-FI example` 的节点。开始 Phase 1 前，需要在 Figma 中选中首个目标页面 Frame，复制包含 `node-id` 的链接。

示例：

```text
https://www.figma.com/design/hoN23Dj67OVv6D0drKYY24/Group-5?node-id=123-456&m=dev
```

### GitHub 与部署

- GitHub 私有仓库尚需创建并获得远程地址。
- rebuild 部署项目和域名将在静态版本接近可预览时创建。
- AI 模型供应商在 Phase 6 前确认。

## 11. 下一步

1. 完成 GitHub 私有仓库和 Notion 计划创建。
2. 提交并标记 `v0.1-planning`。
3. 获取首个 `HI-FI example` 页面 Frame 的节点级链接。
4. 建立 Figma 页面清单。
5. 从第一个页面开始 V0 → V4 的实现与验收循环。
