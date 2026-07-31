# Landing Page｜视觉验收 Round 01

## 结论

当前 Landing Page 完成 **V1（桌面主要结构、内容层级与亮暗主题）**。它已具备可审查的 Figma 双证据、浏览器截图、自动化交互检查与独立 Git 分支；尚未宣称完成 V2/V3/V4 的逐像素叠图、所有断点原稿对照和无障碍细节审查。

## 设计证据

| 项目 | Light | Dark |
| --- | --- | --- |
| Figma section | [`419:5349`](https://www.figma.com/design/hoN23Dj67OVv6D0drKYY24/Group-5?node-id=419-5349&m=dev) | 同一 section |
| Desktop Frame | `419:3705` | `419:4934` |
| 原稿尺寸 | 1440 × 4432px | 1440 × 4432px |
| 本地原稿截图 | `evidence/landing-figma-light-1440.png` | `evidence/landing-figma-dark-1440.png` |
| 生产浏览器截图 | `evidence/landing-v1-light-1440.png` | `evidence/landing-v1-dark-1440.png` |

本轮以 Figma 节点的结构化数据和同节点截图为准；旧仓库只用于复用工程结构、资源和已经验证过的通用组件。

## V0 → V1 变更

- 修复视觉截图未滚动时，视口外的 reveal 区块显示为空白的问题；验收截图会先完整滚动页面，使所有内容进入可见状态。
- 依据节点 `419:3796`，将 Popular Course Strip 的悬浮文字面板改为距底部 16px，并采用原稿文本 `Ethics of Algorithm`。
- Recommended Course Card 的静态初始状态统一保持折叠；仅在 hover 或键盘 focus 时展开内容与操作按钮。
- 使用 Figma 的原稿文案更新 Explore Domains 六张卡片。
- 依据节点 `419:3858`，重写 FAQ 标题的字体顺序、40px 行高及 48px 间距。
- 对齐分类网格的两行高度、FAQ 节奏和 Footer 的 545px 高度；1440px 页面总高与原稿同为 4432px。
- 修复 390px 宽度下 FAQ 标题产生的横向溢出；移动端改为 30px 可换行标题。

## 验收结果

| 检查项 | 结果 |
| --- | --- |
| 1440px / Light | 通过；完整页面高度 4432px，全部 reveal 区块可见 |
| 1440px / Dark | 通过；完整页面高度 4432px，Footer 545px |
| 1024px / Light & Dark | 通过自动化渲染与主题切换 |
| 390px / Light & Dark | 通过无横向溢出检查与主题切换 |
| TypeScript | `npm run typecheck` 通过 |
| Production build | `npm run build` 通过 |
| Playwright | `tests/e2e/landing.spec.ts`：5 / 5 通过 |

## 本轮边界与下一轮

- Figma 当前提供的是 1440px 的亮/暗 Desktop Frame；1024px 和 390px 仅按稳定布局与无溢出验收，不标注为像素级匹配。
- 下一轮应建立叠图或差异图，逐项确认字体字距、图片裁切、颜色透明度、图标线宽和 hover/focus 状态，并在具备移动原稿后提升到 V2/V3。
- 本轮不接入 AI API；Landing Chatbox 仅保留静态交互，符合静态页面先验收的项目决策。

## 可追溯性

- 基线提交：`9d5e48e`（public rebuild repository 记录）
- 工作分支：`codex/page-landing`
- 本轮提交：`feat(landing): align first Figma page round`（以 `git log` 的最终 Commit ID 为准）。
