# Figma 页面清单

> 本清单从 `Group 5` 的 `HI-FI example` 开始增量维护；未记录的页面不视为已纳入本次重建范围。

| 排序 | 页面 | Figma 节点 | 尺寸 / 状态 | 当前实现状态 | 证据 |
| --- | --- | --- | --- | --- | --- |
| 1 | Landing Page | [Section `419:5349`](https://www.figma.com/design/hoN23Dj67OVv6D0drKYY24/Group-5?node-id=419-5349&m=dev) | Light `419:3705`、Dark `419:4934`；1440 × 4432px | V1 已完成 | `docs/visual-qa/landing-round-01.md` |

## Landing Page 组件证据

| 区域 | Figma 节点 | 复用组件 / 实现 |
| --- | --- | --- |
| Header | `419:3706`、`429:5935` | `MarketingHeader`、`LogoMark` |
| Hero Prompt | `419:3727` | `Chatbox`、Prompt Chips |
| Most Popular | `419:3751`、`419:3796` | `PopularCourseStrip` |
| Explore Domains | `419:3801` | `domain-tile` |
| Recommended For You | `419:3846`、`419:3854` | `RecommendedCourseCard` |
| FAQ | `419:3857`、`419:3858` | `FAQAccordion` |
| Footer | `419:3865` | `SiteFooter` |

## 状态定义

- **V1**：1440px 原稿的主要结构、内容层级、亮暗主题与关键展示状态已对齐；1024px/390px 通过稳定布局检查。
- 后续需有断点级 Figma 原稿或视觉差异图，才将页面升至 V2/V3/V4。
