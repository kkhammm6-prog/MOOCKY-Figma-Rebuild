# Lumen Atlas Layout Rules v0.1

This file captures reusable page structure for the Lumen Atlas seed implementation. It records how pages are assembled: shells, regions, section rhythm, responsive handoff, and ownership boundaries.

Layout rules are not component specs and not one-off visual values. Use existing tokens for dimensions and spacing; update `docs/design-system.md` first if a new normative rule is needed.

## Rule Format

Category: `layout rule`

Each reusable layout rule should include:

- `Applies to`: page archetype, shell, section, or region.
- `Structure`: named regions and their hierarchy.
- `Token references`: dimensions, gaps, gutters, and spacing values from `tokens.json` or `design-system/tokens.json`.
- `Responsive behavior`: how the structure preserves hierarchy at narrow widths.
- `Open questions`: unresolved breakpoints, alternate states, or evidence gaps.

## Layout Ownership

Category: `layout rule`

- Page shells own page-level grid, max width, gutters, and background.
- Sections own vertical rhythm, heading-to-content spacing, and section-local grids.
- Modules own internal padding and grouping.
- Components own their own internal composition only.
- Typography primitives such as `Text` must not own margin, padding, width, section gap, card placement, sticky behavior, or responsive layout.
- If a placement rule appears on two or more pages, promote it here or record it in `candidates.md` before encoding it permanently.

## Confirmed Shells

Category: `layout rule`

### Marketing Shell

Applies to: landing and discovery-oriented marketing pages.

Structure:

- Page uses a centered vertical shell on `bg.canvas`.
- Header sits above the hero and uses the shared marketing header width.
- Main content is a vertical sequence of discovery sections.
- Footer is a full-width brand-touchpoint module attached after the final content section.

Token references:

- Page max width: `layout.page.maxWidth` / `1440px`.
- Marketing content max width: `layout.marketing.contentMaxWidth` / `1212px`.
- Header inner width: `layout.header.innerWidth` / `1132px`.
- Header logo lockup: `layout.brand.logoLockupWidth` / `97px` by `layout.brand.logoLockupHeight` / `32px`.
- Header left cluster keeps the `10px` gap after the fixed logo lockup before the utility action.
- Focused Navi Bar demo reference `429:6308` keeps the same `1132px` shell for both guest and authenticated preview states.
- Authenticated preview right cluster uses a `300px` header search field, `12px` cluster gaps, a `32px` utility panel shell, and `28px` icon controls.
- Narrow authenticated previews collapse the header search to a `32px` icon until activated; the active input expands to `size.header.searchActiveMobileWidth` and temporarily hides utility/profile controls.
- Desktop page gutter: `space.scale.40` or `spacing.pageGutter.desktop`.
- Narrow page gutter: `space.scale.20` or `spacing.pageGutter.narrow`.

Responsive behavior:

- Preserve the order `header -> hero -> discovery sections -> FAQ -> footer`.
- Multi-column landing grids stack vertically on narrow screens.
- Sticky section behavior is disabled when the section collapses to one column.
- The first viewport must keep the brand/learner-intent moment and primary AI prompt readable before any reveal animation.
- The Navi Bar demo keeps `Log In` visible on narrow guest headers so the prototype interaction remains reachable; the primary Explore CTA may collapse out before login.

Open questions:

- Exact tablet and mobile breakpoint thresholds remain unresolved unless confirmed by implementation evidence.

### Learning Shell

Applies to: confirmed course pages and learning workspace pages.

Structure:

- Utility header sits above the learning body.
- Desktop body uses a two-column study layout.
- Main lesson/content column stays primary.
- Right rail is secondary support for progress and AI.
- Rail content may switch between progress and AI states without replacing the main lesson.

Token references:

- Main column width: `layout.learning.mainColumnWidth` / `810px`.
- Support rail width: `layout.learning.railWidth` / `384px`.
- Column gap: `layout.learning.columnGap` / `12px`.

Responsive behavior:

- The right rail collapses into a drawer or tab-based access pattern on small screens.
- Main lesson content remains first in reading order.
- Rail/support content must not become the first viewport focus unless a future design explicitly promotes that pattern.

### Compact Course Detail Shell

Applies to: compact course-detail pages.

Structure:

- Authenticated header.
- Breadcrumb and compact two-column learning body.
- Main lesson column with default paused-state banner, compact media/title metadata split, and bottom Course Detail/Discussion tabs.
- Sticky right rail with Course Progress/MOOCKY AI tabs.
- Compact product footer after the learning body.

Token references:

- Main column range: `724px` to `810px`.
- Paused-state banner: `810px x 200px` within the main column.
- Paused-state compact media: `400:240` aspect thumbnail paired with the editorial title/metadata column.
- Support rail width: `390px`.
- Column gap: `12px`.
- Rail and panel radius: regular `16px`; AI rail answered state may use the focused compact rail special-case radius from the reference.

Responsive behavior:

- Below the two-column threshold, stack main content before the rail.
- Disable sticky rail when stacked.
- Keep Discussion and Course Detail in the main column rather than moving them into the rail.

Open questions:

- Exact production breakpoint for rail drawer behavior remains unresolved.

Open questions:

- Exact rail-collapse breakpoint.
- Whether non-course AI workspaces use the same shell or need a separate confirmed shell.

## Section Rhythm

Category: `layout rule`

Applies to: vertical page sections and repeated content regions.

Structure:

- Major marketing sections use the generous landing rhythm.
- Section heading rows precede their content and should not be recreated as ad hoc text margins.
- Related card groups, course lists, and compact rail groups use section-local grid/list spacing.
- FAQ and footer are intentionally close in the seed landing page.

Token references:

- Default landing section gap: `space.scale.100` or `spacing.sectionGap`.
- FAQ to footer gap exception: `space.scale.12` or `spacing.faqToFooterGap`.
- Section heading row height: `32px`.
- Section heading to content gap: `space.scale.12`.
- Dense list gaps may use compact scale values such as `space.scale.2`, `space.scale.4`, or `space.scale.12` only inside list/rail components.

Responsive behavior:

- Vertical section order remains stable across breakpoints.
- Multi-column sections become single-column before content becomes cramped.
- Section rhythm may tighten on narrow screens, but hierarchy must remain legible.

Open questions:

- Whether future product dashboards need a separate compact section rhythm.

## Confirmed Section Structures

Category: `layout rule`

### Landing Hero

Applies to: marketing first viewport and intent-capture surfaces.

Structure:

- `DisplayTitle`
- one short supporting copy block
- centered AI prompt stack
- optional prompt chips below or around the prompt field

Token references:

- Hero prompt width: `layout.marketing.heroPromptWidth` / `800px`.
- Header to hero gap: `spacing.headerToHeroGap` / `12px`.

Responsive behavior:

- Keep the AI prompt reachable and readable on mobile.
- Prompt chips may wrap or reduce density, but the primary prompt remains visible.

Open questions:

- Whether every marketing hero should include AI entry.

### Most Popular Split

Applies to: seed landing discovery section.

Structure:

- Desktop uses two columns.
- Left column carries sticky editorial/supporting content.
- Right column carries the course strip list.
- Sticky behavior pins from the section title/top, not from the card bottom.
- Right-column items are reusable `PopularCourseStrip` components; component extraction must preserve the `400px x 240px` strip geometry and the centered foreground capsule placement.

Token references:

- Left column range: `500px` to `720px`.
- Right column width: `400px`.
- Column gap: `space.scale.12`.

Responsive behavior:

- Below `1040px`, collapse to one column and disable sticky behavior.

Open questions:

- Whether the 720/400 split applies outside landing discovery remains a candidate decision.

### Domain Grid

Applies to: seed landing domain exploration.

Structure:

- Desktop grid uses three equal columns.
- Each tile remains a peer item, not a nested card inside another card.
- Confirmed landing tiles use the `categoryCard` treatment with equal `28px` internal padding and a stable content stack of icon, title, and description.

Token references:

- Column gap: `space.scale.16` or `spacing.gridColumnGap`.
- Row gap: `space.scale.12`.
- Category card padding: `component.button.categoryCard.padding` / `28px`.

Responsive behavior:

- Below `1040px`, collapse to one column.

### Recommendation Grid

Applies to: seed landing recommendation modules.

Structure:

- Desktop grid uses three equal columns.
- Cards share a stable height to prevent hover or expanded content from shifting the row.
- Recommendation card expansion is internal to the card; child layer positioning must not change the surrounding grid or row metrics.
- Cards are reusable `RecommendedCourseCard` components; reuse must preserve the grid track, card height, and internal absolute panel slots.

Token references:

- Gap: `space.scale.12` or `spacing.cardGap`.
- Card height: `450px`.
- At the confirmed desktop shell, the three-column grid yields a `369.333px` card width, matching the focused Figma card reference.
- Expanded recommendation panel height and content-safe collapsed pill width belong to the card interaction rule and must not change the row height.

Responsive behavior:

- Below `1040px`, collapse to one column.

Open questions:

- Carousel and overflow behavior for future recommendation rails remains unresolved.

### FAQ Layout

Applies to: FAQ sections.

Structure:

- FAQ section centers one question list under the section title.
- Rows remain part of one list, not independent floating cards.

Token references:

- FAQ max width: `768px`.
- Inner FAQ list width: `layout.marketing.faqWidth` / `720px`.
- Section padding: `space.scale.40 space.scale.24 space.scale.80`.
- Title to list gap: `space.scale.32`.

Responsive behavior:

- List width becomes fluid within the page gutter.

### Footer Layout

Applies to: long-form newsletter footer.

Structure:

- Footer is full width.
- Footer uses a two-level structure: main content row and social row.
- Footer is a stable page-ending anchor and must not be wrapped in `ViewportReveal` or any staggered entrance motion.
- Main row contains brand statement/newsletter content and link/navigation content.
- Social row sits below the main row.

Token references:

- Footer outer width: `layout.footer.outerWidth` / `1440px`.
- Footer inner width: `layout.footer.innerWidth` / `1320px`.
- Desktop padding: `space.scale.80 space.scale.60`.
- Mobile padding: `space.scale.64 space.scale.24`.

Responsive behavior:

- Footer rows stack vertically on narrow screens.
- Newsletter controls may wrap, but the compound input/action relationship stays intact.

Open questions:

- Whether the full footer composition is global remains a candidate decision.

### Compact Product Footer Layout

Applies to: compact product and learning workspaces.

Structure:

- Small brand row.
- Compact legal/product links.
- Compact social or support handles.

Responsive behavior:

- Rows wrap or stack without changing the footer into a marketing CTA.
- Footer never uses viewport reveal.

## Responsive Strategy

Category: `layout rule`

- The system is desktop-first, but hierarchy must survive responsive simplification.
- Responsive changes should preserve page intent rather than invent a new desktop structure.
- Two-column layouts become one-column before content becomes cramped.
- Cards and repeated modules stack vertically on mobile.
- Sticky behavior is disabled when its region no longer has a stable adjacent column.
- Rail or sidebar-like support regions collapse into drawer, tab, or top-access patterns only when confirmed by the relevant archetype.
- Do not promote a new breakpoint as global from one page. Record it as page or section evidence until repeated.

## Open Layout Questions

Category: `layout rule`

- Exact responsive breakpoint thresholds for mobile, tablet, desktop, and wide layouts.
- Whether future app-like workspaces use a left sidebar, top navigation, or learning rail variant.
- Whether AI-first workspace pages become a new shell archetype or remain a candidate extension of the learning shell.
- Whether compact product dashboards need a separate density and section rhythm.

## AI Chat Workspace Shell

Category: `layout rule`

Structure:

- global header at `52px`
- workspace begins after a `10px` vertical gap
- left sidebar: `350px` expanded, `60px` collapsed
- collapsed sidebar height: `100px`
- sidebar internal padding: `12px`
- sidebar top control row: `36px` high with `32px` circular icon controls
- collapsed sidebar top-control stack: `36px x 76px`, `2px` padding, `8px` vertical gap
- sidebar conversation record row: fill width, `32px` high, `12px` padding, `12px` internal gap, explicit Geist `14px / 16px`
- main conversation column: `720px`
- main column centered in remaining workspace after the sidebar
- answered AI row: `32px` marker slot, `10px` gap, and a left-aligned answer content column whose chips and actions share the answer body left edge
- bottom composer: `720px x 120px`

Responsive behavior:

- On tablet and mobile widths, the AI Chat Page uses the collapsed-sidebar geometry so the main conversation remains visible.
- Main conversation width may shrink to the viewport, but fixed-format controls must not resize from dynamic text.
