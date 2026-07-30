# Lumen Atlas Design System

## Authority

This document is the single source of truth for Lumen Atlas, the MOOCKY design system.

- If this document conflicts with [`component-specs.md`](./component-specs.md), this document wins.
- [`tokens.json`](../tokens.json) is the machine-readable expression of the rules defined here.
- [`design-system-audit.md`](./design-system-audit.md) is an evidence archive, not a normative source.
- [`ai-system-prompt.md`](./ai-system-prompt.md) is the prototype runtime prompt and API response contract for MOOCKY AI.
- [`AGENTS.md`](../AGENTS.md) is an execution guide for Codex and must not override system rules.

## Evidence Scope

This system is grounded in the following confirmed Figma evidence:

- Landing page: `42:93`
- Course page, paused / progress rail: `60:551`
- Course page, playing / AI rail: `100:3535`
- Landing page, dark mode: `180:1596`
- Course page, paused / progress rail, dark mode: `180:1831`
- Course page, playing / AI rail, dark mode: `180:1880`
- Gradient asset library sample: `173:1582`
- Confirmed conversation decisions captured after the audit

Only these six page nodes plus the approved gradient appendix and explicitly confirmed focused references may be used as system evidence.

- Other frames in the same Figma file are exploratory and non-authoritative by default.
- They must not be used to infer new rules unless the user explicitly approves them later.
- Figma-backed implementation must use both structured MCP/Inspect evidence and visual screenshot evidence. MCP/Inspect is required for exact node structure, Auto Layout spacing, dimensions, constraints, variables, typography, component states, and assets. Screenshots are required for final visual parity, composition, responsive behavior, and interaction verification.
- If exact MCP/Inspect evidence is unavailable for a Figma-backed change, do not infer spacing, padding, gap, radius, motion, or constraints from screenshots alone. Record the missing evidence as a gap or ask for an inspect screenshot before claiming parity.

Focused references are narrow by definition:

- Node `74:594` is approved only as evidence for the translucent foreground surface plus `8px` backdrop blur strategy over complex gradient/media backgrounds.
- It must not be used to infer unrelated typography, color, radius, layout, or component-system rules.
- Node `257:2062` is approved only as evidence for the Button component library: Button purposes, naming, states, locked visuals, dark variants, and Button-specific special cases.
- It must not be used to infer unrelated page layout, non-button components, typography rules outside Button usage, or new global visual foundations.
- Node `260:2775` is approved only as evidence for the AI answered rail state: AI rail header, user message bubble, AI answer block, bottom AI Prompt Field, and top operation buttons.
- It must not be used to infer unrelated non-AI components, non-AI page layout, global typography rules, or new visual foundations outside AI conversation surfaces.
- Nodes `348:8253` and `348:8271` are approved only as evidence for the `RecommendedCourseCard` landing-section hover interaction: collapsed media card state, expanded lower panel state, title transition, metadata reveal, arrow rotation, and the `160ms ease-out` smart-animation behavior.
- They must not be used to infer unrelated page layout, global card systems, typography rules outside this recommendation card, or dark-mode values.
- Node `419:5349` is approved only as the landing-page update reference for reduced repeated accent usage, `neutralAction` placement, `PopularCourseStrip` color, `RecommendedCourseCard` light/dark color, and the `Explore Domains` `categoryCard` default/hover behavior.
- It also confirms the landing header `LogoLockup` geometry through child node `429:5935`.
- It must not be used to infer unrelated global layout or non-button components outside the landing card components, landing domain section, and header logo.
- Node `429:5935` is approved only as evidence for the canonical MOOCKY header logo lockup: `97px` by `32px` frame, fixed wordmark outlines, attached `8px` sparkle, and Reference-aligned internal placement.
- It must not be used to introduce `Gabarito` as a product UI typeface or to infer unrelated typography rules.
- Node `762:15058` is approved only as evidence for the global `Tag` component: `Default`, `Compact`, and `Line` density, transparent tone relationships, padding, gap, border, typography, and the default Lucide `arrow-up-right` affordance.
- It must not be used to infer unrelated page labels, course taxonomy, Button behavior, page layout, typography outside Tag usage, or global dark-mode foundations beyond the Tag component.
- Node `429:6308` is a user-approved focused reference for the Navi Bar demo states only: guest header actions, authenticated preview actions, `300px` compact header search, grouped utility icons, profile entry, and click-through login state switching.
- For the demo stage, the click-through login state is sticky within the browser: after `Log In` is clicked once, demo headers that use this preview keep the authenticated cluster across route changes and reloads until local storage is cleared.
- It must not be used to merge the production `MarketingHeader` and `LearningHeader` ownership model or to infer unrelated navigation, page layout, typography, or dark-mode values.
- Node `226:2326` is approved only as the source image-asset library for `categoryCard` hover gradient backgrounds.
- It must not be used to infer new global gradient families or decorative gradient usage outside confirmed category-card hover states.
- Node `559:8583` is approved as the current AI Chat Page default-layout reference: expanded sidebar UI, default and dark default page layout, 800px centered main conversation column, default prompt chips, and bottom AI composer placement.
- Node `375:3335` remains approved only for the AI Chat Page additional workspace states: Sidebar Collapse, Thinking, Answered, and Answered Cards page states.
- Nodes `375:4694`, `375:4875`, `375:4776`, `375:5204`, and `513:8444` are approved only for the AI Chat Page dark-theme equivalents of those same workspace states.
- Node `457:7130` is approved only for the AI Chat Page Thinking sparkle/glow animation timing and construction.
- Node `491:7957` is approved only for the compact Thinking sparkle/glow visual style.
- Node `598:10430` is a user-approved focused reference for the AI Chat Thinking page state and dark counterpart; use it only for Thinking layout, Thinking typography, the submitted-question bubble, and the bottom composer placement.
- Node `598:10961` is a user-approved focused reference for the AI Chat Answered page state and dark counterpart; use it only for the answered static AI icon, answer metadata rhythm, answer body density, follow-up chips, answer actions, and bottom composer placement.
- These AI Chat Page nodes must not be used to infer unrelated global layout, typography, dark-mode values, or non-AI surfaces.
- Nodes `685:13042`, `685:12069`, and `685:13043` are user-approved references for the compact Course Detail page layout only: lesson media placement, default paused-state banner plus real compact video treatment, `Neural Architecture` title treatment, `Transformers & Attention` breadcrumb/content context, main/rail width rhythm, bottom content tabs, compact instructor/course-detail modules, and compact footer replacement decision.
- Node `260:2593` is user-approved as the compact course right-rail component reference only: Course Progress/MOOCKY AI tab switch, collapsed and expanded curriculum lists, AI idle rail, answered AI rail, light and dark rail color/density, rail operation buttons, and bottom composer shape.
- Node `695:14157` is user-approved as the Discussion structure reference only: My Notes control, sticky discussion composer, attachment/AI-check/public/timestamp/send controls, threaded comments, and timestamp media cards.
- Do not use `685:13042`, `685:12069`, `260:2593`, or `695:14157` to infer unrelated marketing layout, global typography, landing-card rules beyond the already confirmed category-card hover behavior, or new global dark-mode foundations.

This document defines:

- global foundations
- confirmed page archetypes
- extension rules for future wireframes

This document does not invent full-page patterns for screens that have not been designed yet.

## Brand Foundations

### Canonical Identity

- Design system name must be written as `Lumen Atlas`.
- `Lumen Atlas` names the design system, not the learner-facing product brand.
- Brand name must be written as `MOOCKY`.
- The canonical logo is the `MOOCKY` wordmark plus the sparkle mark as a single lockup.
- The canonical header logo uses the vector-outlined lockup exported from Reference node `429:5935`.
- The header lockup frame is `97px` by `32px`; the wordmark shape and sparkle placement are fixed by the SVG viewBox rather than recreated with live text.
- The landing light-theme logo color is `text.primary` / `#3E332E`; theme variants may recolor the fixed vector through `currentColor` for contrast, but must not alter the geometry.
- The sparkle mark must not be detached and used as a replacement logo.

### Visual Intent

MOOCKY combines editorial identity with calm product utility.

- Editorial expression should lead identity-setting moments.
- Product utility should lead task-heavy interfaces.
- The system should feel intelligent, warm, and spatially calm rather than loud or gamified.

### Editorial Boundary

Editorial display typography is not limited to the hero only, but it must remain attached to one of the following:

- page-defining titles
- brand-defining statements
- section-level identity moments

Editorial type must not become the default style for dense product UI, system labels, or operational controls.

## Core Design Principles

### 1. Calm Surfaces, Strong Hierarchy

- Use spacing, typography, and image treatment before introducing chrome.
- Default surfaces should remain light, quiet, and minimally ornamented.
- Borders should carry more hierarchy than shadows in the light theme.

### 2. Editorial Identity, Product Restraint

- Use expressive display typography for brand moments.
- Use compact, highly legible UI typography for navigation, metadata, forms, and controls.
- Avoid overextending editorial styling into dense product flows.

### 3. Rounded, Soft Geometry

- Rounded geometry is foundational across buttons, pills, fields, cards, rails, and overlays.
- The system should feel soft and intelligent rather than sharp or industrial.

### 4. AI as a Core Product Capability

- AI is a global product capability, not a decorative add-on.
- The currently confirmed AI surface is the course companion rail.
- Future AI surfaces must inherit the same design logic: assistive, embedded, and contextual.
- AI also appears in the hero prompt and header search surfaces, where its job is to recommend courses and explain the platform while guiding the learner toward relevant course content.
- AI interaction states are shared across AI surfaces, but the course rail, hero prompt, and header search are surface variants rather than one fully reused component.
- The AI Chat Page is an AI-first workspace for prompts submitted outside course interior pages. It may display provider-supplied `reasoning_content` in a separate Thinking reasoning panel, while final answer content still comes from the structured JSON response envelope.
- AI Chat sidebar collapse follows the focused Sidebar reference `575:10098`: the expanded sidebar is `350px` wide and full workspace height; the collapsed sidebar is a compact `60px x 100px` rail that only wraps the two top controls.
- AI Chat collapsed sidebar controls use a `36px x 76px` internal stack, `2px` padding, `8px` gap, and two `32px` circular controls.
- AI Chat sidebar collapse motion transitions width, flex basis, height, and padding together so the rail naturally tightens instead of snapping to a full-height strip.
- AI Chat main body is currently trialed at `720px` wide in the desktop prototype; the bottom composer follows the same width even when focused Figma Thinking references show the original `800px` column.
- AI Chat sidebar mode rows use a `28px` icon slot with a transparent default surface; hover, focus-visible, and current states add a circular icon backing (`#fff` in light, `#000` in dark) inside the highlighted row.
- AI Chat sidebar conversation records use compact fill-width rows: `32px` height, `12px` padding, `12px` internal gap, `12px` radius, explicit Geist `14px / 16px`, transparent default fill, and the active/hover surface from the AI Chat sidebar reference.
- AI Chat sidebar record mode markers use solid black with `0.27` opacity in light mode, rather than alpha in the stroke color, so crossing SVG strokes do not locally double-darken.
- AI Chat Answered follow-up chips and answer actions align to the same answer content column from focused node `598:10961`: the answer row keeps the `32px` AI marker plus `10px` gap, chips wrap with `4px` row/column gap, and the action group uses `28px` icon buttons inside a `2px` padded pill group.

### 5. Brand Gradients Are Assets, Not Decoration

- Abstract stripe/mesh gradients are part of the official brand language.
- They are not placeholder art.
- They must be treated as named brand assets with controlled usage.

## Visual Language

### Surface Hierarchy

#### Light Theme

- `canvas` is warm off-white.
- `surface` is white or near-white.
- `border` is subtle and semi-transparent.
- `shadow` is absent by default and only appears as an explicitly documented special case.

#### Dark Theme

- Dark mode is in scope.
- Dark mode must follow the approved dark reference frames only, not automatic inversion.
- Approved dark reference frames are `180:1596`, `180:1831`, and `180:1880`; AI Chat Page dark mode additionally uses the focused page references `559:8583`, `375:4694`, `375:4875`, `375:4776`, `375:5204`, and `513:8444`; Tag dark component values may use the user-approved focused component reference `762:15058`.
- Other dark explorations in the same Figma file must not be used as evidence.

### Iconography

- All icons must come from Lucide: https://lucide.dev and https://github.com/lucide-icons/lucide.
- Default icon size is `16px`.
- Default icon stroke width is `1.5px`.
- Icons should support scanning and action recognition.
- Icons must not become decorative clutter.
- Any non-`16px` icon size or non-`1.5px` stroke must be treated as a special case tied to a confirmed component need.
- `FAQAccordion` chevrons are a documented size exception: use a `24px` Lucide `chevron-down` viewport with `1.5px` stroke so the drawn chevron keeps the older `12px × 7.4px` visual footprint after migrating away from filled SVG assets.
- Do not create action icons with CSS-only shapes, text glyphs, custom SVG paths, or non-Lucide image assets. This includes common controls such as plus, close, arrows, chevrons, save, copy, and feedback icons unless the design system explicitly promotes a brand mark.
- Interactive icons must inherit `currentColor` from their owning control unless a documented component exception says otherwise.
- When an icon changes state, use the relevant Lucide icon as the source and animate transform, opacity, color, or stroke. For example, an import trigger must use Lucide `plus` and may rotate into a close posture; it must not be drawn from CSS bars.

### Media Language

- Browse and recommendation surfaces may use approved abstract gradient assets.
- Active lesson playback may use real media.
- Real media should signal active engagement.
- Brand gradients should signal discovery, identity, and thematic atmosphere.

## Foundation Rules

### Color System

#### Light Theme Roles

- `bg.canvas`: page background
- `surface.base`: default card and control surface
- `surface.footer`: long-form newsletter footer surface
- `surface.mediaOverlay`: translucent capsule surfaces placed over media or gradient assets
- `surface.overlay`: general translucent overlays and compact floating chrome
- `text.primary`: primary heading and strong action text
- `text.secondary`: secondary headings and muted labels
- `text.body`: paragraph copy and descriptive text
- `text.aiAnswer`: component-scoped AI answer and user-question reading text in light AI conversation surfaces
- `border.soft`: subtle structure
- `border.medium`: stronger separators and outlines
- `accent.brand`: main filled CTA and active accent
- `accent.support`: softer secondary brand brown
- `status.success`: live/completed learning status

#### Dark Theme Roles

- `bg.canvas`: shared dark page canvas
- `surface.shell`: deep shell and footer shell
- `surface.base`: default dark panel, pill, and rail item surface
- `surface.footer`: dark footer shell surface from approved dark references
- `surface.mediaOverlay`: dark media-overlay capsule surface from approved dark references
- `surface.active`: differentiated active dark item surface
- `text.primary`: low-saturation warm light headline and primary action text; dark counterpart to light `#3E332E` is `#EDE8E1`
- `text.secondary`: warm subdued labels and supporting text
- `text.muted`: cool muted inactive lesson and suggestion text
- `text.placeholder`: dark input placeholder text
- `border.soft`: lowest-contrast structural border
- `border.medium`: clearer dark-theme separator and outline
- `accent.brand`: dark-theme gold action and emphasis
- `accent.brandMuted`: softer gold metadata emphasis
- `status.successBg`: dark learning success surface
- `status.successFg`: dark learning success text

#### Color Rules

- Do not introduce cold neutral ramps as a default replacement for the warm system.
- Do not introduce extra brand accent families beyond the approved system.
- Use semantic roles in implementation; do not style directly from raw color picks unless extending the token source.
- `text.aiAnswer` is a component-scoped AI conversation special case from node `260:2775`; it does not create a general cold neutral ramp for product UI.

### Gradient System

#### Approved v1 Family

The v1 core brand gradient family is the warm spectral set:

- yellow
- blue
- red
- gold

These appear as multiple approved image assets and variants.

#### Gradient Rules

- Use gradient assets via tokens, not ad hoc CSS approximations.
- Treat each approved gradient as a named brand asset.
- Use gradients primarily in discovery, marketing, and learning-atmosphere moments.
- Do not use gradients as generic panel backgrounds in dense utility UI unless the pattern is explicitly confirmed.

#### Not Yet in v1

- Purple/pink/blue gradient families are not part of the v1 default family.
- They may be added later, but are not current defaults.

### Typography System

#### Typeface Roles

- `display title first word`: `Cormorant Infant`
- `display title remainder`: `Gayathri`
- `module title`: `DM Serif Text`
- `ui text`: `Geist`

No other font family is permitted in the design system.

The MOOCKY logo is a brand asset exception: its shape originates from Reference vector outlines and is not implemented as live product UI text. Do not add the source logo font to the type system.

#### Role Rules

- `Cormorant Infant` + `Gayathri` form a strict editorial display pair and must not be treated as interchangeable standalone display fonts.
- Display titles must set the first word in `Cormorant Infant Medium Italic` with `-4px` letter spacing.
- Display titles must set all remaining words in `Gayathri Thin` with `-1px` letter spacing.
- Display-title font sizes must be optically matched so the Cormorant first word and the Gayathri remainder appear the same visual height.
- Display-title sizing must preserve optical balance between the first word and the remainder. Use the confirmed scalable component ratio instead of independently sizing each span: remainder size is `0.85` of first-word size, first-word tracking is about `-0.05em`, remainder tracking is about `-0.015em`, the inline gap is at least `10px` and may scale upward at about `0.125em` of the first-word size, and the first-word optical offset remains `-0.18em`.
- Display titles must not be used when any part of the display-title pair would be smaller than `42px`.
- When an interface has one independent main title plus multiple smaller section titles, the independent main title uses the display-title pair.
- Do not use a full display title in only `Cormorant Infant`, only `Gayathri`, or `DM Serif Text`.
- `Geist` is the default UI typeface.
- `Geist Regular` at `16px` with shallow brown coloring is used for unbacked section labels such as `Most Popular This Week` and `Explore Domains`.
- `DM Serif Text` is used for titles inside supported modules and module-like backed card or panel surfaces, such as `Explore Domains` cards, `Recommended For You` cards, and capsule-shaped foreground panels.
- `DM Serif Text` module/card/panel titles must not exceed `40px`; larger titles must use the display-title pair.
- Button labels, chips, action copy, and compact control text use `Geist`, even when the surrounding module or panel has a capsule shape.
- `Geist Regular` is the default and should cover the vast majority of UI text.
- The only approved non-regular Geist weights are `Semibold` and `Bold`, used sparingly for emphasis, active states, numeric emphasis, or hierarchy separation.
- Do not use Geist Thin, Medium, Extrabold, or other intermediate/heavy weights in product UI.
- Geist text must not exceed `20px`. Any text larger than `20px` must use either the display-title pair or `DM Serif Text` as an approved module/card/panel title.
- `DataPanelMetricValue` is the only confirmed Geist-above-`20px` special case. It uses `Geist Semibold`, `32px / 40px`, only for short metric values inside data panels, metric cards, and compact dashboard stat panels.
- `DataPanelMetricValue` content must be numeric or extremely short status-like data, such as counts, percentages, durations, scores, or 1-2 word value labels. Do not use it for sentences, editorial titles, card titles, labels, or helper copy.
- Numeric `DataPanelMetricValue` content may count up from `0` the first time the data panel enters the viewport. Nonnumeric status values remain stable; if a status panel's meaningful metric appears in helper copy, that numeric helper may use the same first-entry count-up behavior. Reduced-motion users receive final values immediately.
- If a data value needs to wrap, contains long prose, or cannot remain visually stable at `32px`, fall back to the normal Geist `12px` to `20px` UI range or a confirmed module title role.
- Font families outside `Cormorant Infant`, `Gayathri`, `DM Serif Text`, and `Geist` must not appear in product UI, design docs, or implementation tokens.
- Do not recreate the MOOCKY logo with live text, alternate font stacks, CSS letter spacing, or a detached Lucide sparkle; use the fixed `LogoLockup` vector asset/component.

#### Type Hierarchy

- Large display titles should dominate identity moments.
- Large display titles must use the strict first-word Cormorant plus remaining-word Gayathri construction.
- Large display titles must not use any text segment below `42px`; use a small-title rule instead.
- In pages with one main title and several subordinate section titles, reserve the display-title pair for the main title.
- Subordinate section titles outside modules use the unbacked section-label treatment: `Geist Regular`, `16px`, shallow brown, so they do not compete with the main title.
- Titles inside supported modules and module-like backed card or panel surfaces use `DM Serif Text`.
- Module/card/panel titles in `DM Serif Text` use `40px` as the maximum size.
- Button text, including CTA labels inside those modules, remains `Geist`.
- Geist UI text uses a `12px` to `20px` range: `12px` for compact metadata, `14px` for chips/buttons/secondary labels, `16px` for default UI copy and section labels, `18px` for larger readable support copy, and `20px` as the maximum compact UI heading size.
- Data panel metric values are the narrow exception to the Geist `20px` ceiling: use `Geist Semibold 32px / 40px` only for the central value in a confirmed data panel. Surrounding labels, captions, helper copy, and actions remain within the normal Geist `12px` to `20px` range.
- Body copy should remain short, readable, and moderate in density.
- Small labels should support controls, metadata, and secondary guidance.

### Spacing, Radius, Border, Shadow

#### Border And Stroke

- Default component stroke width is `0.5px`.
- Use `1px` stroke only when explicitly required for a confirmed component, dense utility separation, or accessibility contrast.
- Use thicker strokes only as component-specific special cases, such as avatar rings or media overlays, and document the reason before reuse.
- Do not silently convert border visibility into shadows. Prefer stroke, spacing, and surface contrast.

#### Spacing

- Spacing should follow a reusable scale, not one-off values.
- Prefer tokenized spacing over page-specific spacing decisions.
- Section spacing must remain generous on marketing surfaces and more compact in learning surfaces.

#### Content Density

Content density describes how much information a viewport or module asks the learner to process. It is a page-level hierarchy rule, not a token category, and not a license to shrink type, reduce accessible spacing, or add extra chrome.

The current approved pages establish three density modes:

- `relaxed discovery density`: landing and marketing modules; one primary idea per section, generous section rhythm, high media-to-text contrast, and shallow metadata.
- `moderate study density`: the course main column; lesson-first content, readable explanatory text, compact metadata, and clear progression from media to course detail.
- `compact support density`: learning header and course right rail; short labels, skimmable lists, chips, progress, and AI prompts that support the main lesson without becoming the main focus.

#### Landing Page Density

- Landing pages should feel editorial and discovery-led, not operational.
- The first viewport should prioritize a single brand or learner-intent moment plus one primary prompt or action cluster.
- Intent chips, course cards, FAQ rows, and recommendation modules should guide exploration progressively rather than expose all course detail at once.
- Course cards on landing surfaces should use concise summaries and a small amount of metadata; deeper syllabus, lesson, progress, or AI-support detail belongs on course pages.
- Landing sections may contain multiple cards, but each section should keep one clear job: introduce a domain, feature a course, answer questions, or capture interest.
- Avoid dashboard-style panel mosaics, dense filter systems, heavy metadata stacks, and competing CTAs as the default landing impression.

#### Course Page Density

- Course pages should feel study-led and task-ready, not like a second marketing page.
- The main column must keep the lesson media, course title, course detail, instructor, and learning rationale in a readable hierarchy.
- The right rail may be denser than the main column because it carries progress and AI support, but it must remain skimmable through short labels, list states, chips, and clear grouping.
- Learning progress indicators, including linear bars and circular gauges, use a restrained neutral fill: `action.neutral` in light mode and its dark counterpart in dark mode. Percent labels use Geist Regular and the same neutral role, not accent brown emphasis.
- Progress fills may animate from `0` to the target value the first time the relevant learning card or progress module enters the viewport. If the owning card or module uses viewport reveal, the progress fill starts after that component's opacity/translate reveal has completed; reduced-motion users receive the final fill immediately.
- Circular progress gauges should use the same visual stroke thickness as the matching linear progress bar unless a focused component reference confirms otherwise.
- Supporting details should be staged through tabs, segmented controls, accordions, or rails instead of appearing as one uninterrupted dense block.
- Course metadata should clarify the learner's current state and next action; it should not compete with the lesson media or editorial course title.
- AI content in the course shell should stay contextual and assistive. Long AI answers, transcripts, or generated study artifacts require explicit future patterns before becoming dense default rail content.
- Compact course AI composer prompt text uses `14px / 20px` body styling so placeholder copy does not compete with rail chips or answer content.
- Compact course pages may use a tighter study shell than marketing pages when the active lesson, support rail, and discussion all need to be visible in one workflow.
- In compact course pages, Discussion may be the default bottom tab when learner participation is the primary demo behavior; Course Detail remains available as the paired tab.
- Compact discussion reply connectors should use a visible but quiet `0.5px` translucent line: light mode uses transparent black rather than white so nested replies remain legible on pale discussion backgrounds.
- Compact discussion reply actions use a default-transparent pill, not a filled brand button. Keep the action at `24px` minimum height, Geist Regular `12px / 16px`, muted text by default, and a subtle low-contrast backing only on hover or keyboard focus.
- Seeded compact discussion demos should read like a coherent classroom thread: comments and nested replies must build on course context, timestamps, questions, clarifications, or notes rather than filling the list with unrelated praise.
- After playback starts in compact course pages, the large course title, subtitle, live count, lesson description, and current-context summary belong inside Course Detail instead of the always-visible media stack, so switching to Discussion hides course description content and prioritizes conversation.
- Compact course rail tabs move the active `2px` underline from the measured tab column rather than from a fixed offset, so the indicator stays attached to Course Progress or MOOCKY AI at every rail width.
- Compact discussion composers may use a translucent foreground surface with `12px` backdrop blur when they sit sticky above threaded messages; when paired with the compact course right rail, the sticky composer group aligns to the rail's sticky top. The My Notes filter sits below the composer as its own row and remains sticky with the composer so their relative spacing does not change while scrolling. Public/timestamp toggles default to unchecked transparent pill controls with visible checkbox marks inside each pill; hover reveals a subtle backing, and the checked state keeps a quiet accent backing while showing the checkbox mark. Mouse click focus must not preserve the pill backing after a control is unchecked; keyboard focus uses a subtle outline instead of the hover fill.
- Compact discussion AI checks are manually triggered from the sparkle control. While the request is pending, the same control expands just enough to show `Thinking` beside the sparkle. The result renders as a compact structured status block with `Verdict`, `Why`, and `Fix`, not as a raw long paragraph. After the result appears, the sparkle control becomes an `x` close control so the learner can dismiss the AI check without clearing the typed note.
- The compact left/right course overview is a one-time pre-play state. After the learner starts the video once, pausing keeps the large stacked lesson layout. The first-play transition should start banner compression, video movement, and title/copy expansion on the same frame: the gradient banner compresses upward, the compact video moves from lower-right to upper-left/large media placement, and the title/copy slides open rather than using a simple opacity swap or delayed video handoff.
- Course video fullscreen controls must invoke the browser Fullscreen API on the full video shell so the real media and local controls enter and exit fullscreen together.
- Course video embeds that rely on YouTube must keep the iframe viewport at native `16:9` and cover-size it inside the local shell. Do not stretch the iframe to the shell's arbitrary ratio, because YouTube will letterbox inside its own viewport and make the real video appear smaller than the MOOCKY frame.
- When YouTube draws unavoidable native chrome such as paused-state play markers, titles, or watermarks, use a non-interactive local mask over those chrome zones while keeping the real iframe mounted. Do not replace the active lesson with a static placeholder after playback has started.
- Course video play/pause controls use a single click activation path and may read the underlying player state before toggling. Do not bind the same toggle to both `pointerdown` and `click`, because that can double-trigger playback on deployed browsers.
- A compact product footer is preferred for dense learning workspaces when the large newsletter footer would compete with the lesson workflow.

#### Density Handoff

- Landing answers `What can I explore here?`; course pages answer `Where am I, what should I do next, and what support is available?`
- A course preview may appear on the landing page, but it should be visually and textually lighter than the same course's detail page.
- Density should increase through information prioritization, grouping, and progressive disclosure, not through smaller typography, tighter unreadable spacing, extra shadows, or decorative containers.

#### Padding

Padding follows three rough tiers:

- `12px`: long buttons and elongated action controls.
- `16px`: cards and standard component containers.
- `24px`: larger modules and broader content containers.

These tiers are starting points, not rigid box math. The core padding rule is that the contents must sit comfortably and completely within the container's visual center.

- Optical centering may override equal mathematical padding when typography, icons, media, pill geometry, or component density makes the content feel off-center.
- Padding may be micro-adjusted from the tier value to keep the content visually centered, but the adjustment must remain close to the spacing scale and should not create a new regular padding tier.
- When a component needs a repeated micro-adjustment, document it as a component-specific padding special case instead of silently normalizing it across the system.

#### Radius

- All rounded corners must use `60%` corner smoothing.
- The regular radius set is `16px`, `8px`, and `pill`.
- `16px`: primary radius for most cards, modules, rails, panels, inputs, and controls.
- `8px`: secondary radius matched to the `16px` system, used for compact media, icon containers, and small inline elements.
- `pill`: regular radius category for capsule buttons, chips, rounded fields, and pill controls.
- Any radius value outside `16px`, `8px`, and `pill` must be documented as a special case before use.

#### Border

- `0.5px`: default structural outline for component strokes.
- `1px`: emphasis or contrast exception only when visually confirmed.
- `2px`: strong emphasis only when visually confirmed and documented as a component-specific exception.

#### Shadow

- Normal surfaces must not use shadows by default.
- Light theme defaults to no shadow use unless a special case is explicitly documented.
- Approved dark frames rely on surface contrast and borders before shadow depth.
- Shadows must never substitute for spacing or hierarchy.
- Future prototypes must not add ambient card, button, rail, panel, input, or control shadows as a default layer strategy.

#### Translucent Blur Layering

When a foreground component needs legibility and depth over complex gradient, image, or media backgrounds, use a translucent surface plus background blur instead of a shadow.

- The confirmed strategy is a translucent component background with `8px` backdrop blur and no drop shadow.
- Use this for foreground controls, floating buttons, compact labels, and media/gradient overlays that sit directly on visually complex backgrounds.
- In light theme, prefer existing translucent surface roles such as `surface.mediaOverlay`, `surface.footer`, or `surface.overlay` before adding new color tokens.
- Do not use translucent blur as generic decoration on normal quiet surfaces.
- Do not use it to turn dense utility UI into glass panels.
- If the component is not in front of a complex background, prefer a normal surface, border, and spacing.
- Dark-theme translucent blur values must come from approved dark evidence or be recorded as a gap.

### Motion And Reveal

- Section reveal uses `opacity 0 -> 1` and `translateY(14px) -> 0` over `300ms ease-out`.
- Reveal items are visible by default; the runtime applies `reveal-pending` only to items that should wait for viewport entry, then replaces it with the visible state.
- Runtime must evaluate first-viewport items immediately on mount; do not wait for user scroll before revealing the initial viewport.
- Runtime must restore reveal items to visible on browser history restoration (`pageshow` from the back/forward cache) and before page caching (`pagehide`) so native Back never returns to a transparent section.
- Every new page or prototype must mount the shared `ViewportRevealRuntime` once, unless an existing shell already owns `useRevealOnView`.
- When multiple reveal items enter the viewport in the same batch, sort them by vertical position and apply a top-to-bottom stagger of `160ms` per item, capped at `320ms`.
- Apply reveal to section-level components by default. Important first-viewport groups may split into separate reveal items when they carry separate reading moments, such as landing hero copy and the Chatbox/prompt group.
- When creating, previewing, or deploying a new page, apply this reveal treatment to browsed section-level components by default unless the request explicitly disables entrance motion.
- Do not replace the shared reveal with page-local keyframes or CSS overrides on `.reveal-on-view`.
- Do not apply viewport reveal to any Footer. Footer is a page-ending anchor and must remain visually stable when reached.
- For reduced-motion users, bypass translate movement and stagger delay so reveal content is immediately visible.

### Production Route Promotion

- When a page is formally enabled for product use, it must live on a product route outside `/prototypes`.
- Do not leave production-enabled page files under `app/prototypes/*`.
- Update every connected navigation entry, header utility, CTA, and documented route to the product route at the same time.
- Legacy prototype URLs may redirect to the product route through routing config, but they must not continue to host a duplicate page implementation.
- Prototype routes remain only for isolated exploration, review, or unconnected future-state demos.

## Layout System

Layout rules describe page assembly, hierarchy, and responsive handoff. They are not a dump of visual values.

- Use [`../design-system/layout-rules.md`](../design-system/layout-rules.md) as the seed implementation layer for reusable page structure.
- A reusable layout rule should name its shell or section role, structural regions, token references, responsive behavior, and unresolved gaps.
- Layout rules must reference existing tokens for dimensions, spacing, and gutters rather than introducing page-local numbers.
- Do not use component styles or typography primitives to create layout. Parent shells, sections, and modules own placement, width, spacing, sticky behavior, and responsive stacking.

### Confirmed Desktop Widths

- Desktop artboard width: `1440px`
- Header inner width: `1132px`
- Marketing content max width: `1212px`
- Learning content column: `810px`
- Learning rail width: `384px`
- Learning two-column gap: `12px`

### Marketing Shell

- Centered content shell
- Generous vertical spacing
- Editorial first impression
- Discovery modules, recommendation modules, FAQ, newsletter footer

### Learning Shell

- Utility-first header
- Two-column desktop layout
- Sticky right rail
- Main media or lesson content on the left
- Progress / AI support on the right
- Compact course-detail implementations may use a `724px` to `810px` main column paired with a `390px` support rail and `12px` column gap, matching the focused compact course references.
- Compact course right rails keep collapsed Course Progress content-fit; expanded Course Progress and MOOCKY AI states use the current viewport-visible top gap to calculate dynamic height, preserving about `12px` bottom breathing room both at the top of the page and while sticky. The desktop learning grid may reserve lower sticky scope so the rail does not get pushed upward before the compact footer enters.
- On narrow screens, the rail remains after the main lesson in reading order and may become full-width instead of sticky.

### Footer Rule

- The long-form newsletter footer is a brand-touchpoint module.
- It is valid on marketing and learning surfaces already confirmed in the approved light and dark frames.
- Footer must not use viewport reveal or staggered entrance motion on any interface.
- Future dense product workspaces may adopt a lighter product footer when those pages are designed.
- Compact course pages use a product footer: short legal/social links, small brand lockup, no newsletter headline, no large display type, and no reveal animation.

## Responsive Strategy

- The system is desktop-first.
- Learning rail collapses on small screens into a drawer or tab-based access pattern.
- Responsive behavior may simplify layout, but it must not destroy the underlying hierarchy.
- Until breakpoint thresholds are formally confirmed, responsiveness should preserve pattern intent rather than invent new desktop rules.

## Accessibility Baseline

- Core text must meet AA contrast requirements.
- Core interactive elements must meet AA contrast requirements.
- Focus visibility is mandatory for core interactive elements.
- Decorative or auxiliary elements may be visually softer if they do not block comprehension or task completion.
- Accessibility fixes must preserve meaning first, visual fidelity second.

This document does not yet define a full media accessibility policy for captions, transcripts, and advanced playback accommodations.

## Content and Voice

### Brand Voice

- The overall product voice is editorial, thoughtful, and confident.
- The product should not sound gamified, salesy, or overloaded with hype.

### UI Voice

- Section names should remain concrete and legible.
- CTA copy should remain direct.
- AI prompts may use first-person learner intent.
- Product UI must stay readable even when brand voice is expressive.

### Language Baseline

- English is the current content baseline for the design system.
- Future multilingual expansion should extend from the same hierarchy, not rebuild it.

## Component Governance

### Global vs Scene-Scoped Components

- `Button` and `Tag` are globally unified component families.
- All other components are scene-scoped by default.
- Visual similarity does not automatically imply a shared implementation API.

### Button System

The Button family is the global action system for MOOCKY. It is purpose-based, not page-based: marketing and learning surfaces must reuse the same Button kinds instead of creating separate button languages.

#### Button Evidence

- The approved Button library evidence is Figma node `257:2062`.
- Light and dark Button variants in that node are authoritative for Button visuals.
- Button evidence must not override broader foundation rules unless the rule is explicitly Button-specific.

#### Button API

Button implementations should expose these design-level props:

- `kind`: `standaloneIcon | auxiliaryAction | primaryAction | neutralAction | cardGuideAction | aiChatFunctionChip | aiQuestionPromptChip | searchPrompt | panelIconGroup | newsletterCompound | panelStandaloneIcon | floatingResume | categoryCard`
- `theme`: `light | dark`
- `state`: `default | hover`
- `icon`: optional controlled Lucide icon name for non-action leading icons

The currently confirmed Button states are `default` and `hover`. Focus-visible remains mandatory for accessibility, but its exact visual treatment is not yet confirmed by Button evidence.

#### Button Global Rules

- Button colors, visual style, padding strategy, circular button sizes, long-button heights, and hover effects are locked to the approved Button library.
- `primaryAction` is the only brown filled action in the light Button family and must appear at most once per interface surface.
- Repeated action buttons that would otherwise compete with `primaryAction` use `neutralAction`.
- Editable Button content is limited to text labels and non-action icons.
- Button icon props must accept controlled Lucide icon names only. Do not pass raw `ReactNode`, `<img>`, page-level SVG assets, or ad hoc inline SVG into Button.
- All Button icons must render through the shared icon primitive and inherit `currentColor` from the Button text color in both light and dark modes.
- Action icons that communicate behavior are not editable unless the Button kind explicitly allows it.
- Auxiliary and primary action buttons must use the `arrow-up-right` action icon on the right.
- Button copy should remain short, direct, and action-oriented.
- Search prompt copy may vary, but it must stay brief, marketing-oriented, and fit inside the fixed prompt field.
- Default hover motion transitions from the default component to the hover component with `160ms ease-out`.
- Dark Button variants must follow the provided dark Button library variants directly. `neutralAction` and `cardGuideAction` invert to the light neutral fill in dark mode so repeated controls remain visible against the dark canvas.

#### Button Kinds

| Kind | Purpose |
| --- | --- |
| `standaloneIcon` | Independent icon action for important isolated actions such as nav mode switching and profile entry. |
| `auxiliaryAction` | Secondary jump/action button, usually paired with `primaryAction`; right-side `arrow-up-right` is required. |
| `primaryAction` | The single brown filled main action for an interface surface; when paired with `auxiliaryAction`, it appears on the right for easier reach. |
| `neutralAction` | Neutral filled repeated jump/action button for `More`, `Explore more`, subscribe-style actions, and similar secondary actions that should not add more theme color. |
| `cardGuideAction` | Small neutral guide action, usually paired with an internal card capsule or prompt field to encourage navigation. |
| `aiChatFunctionChip` | Chip below the AI chatbox that suggests possible AI capabilities. |
| `aiQuestionPromptChip` | Chip above the AI chatbox that guides the user toward asking a question. |
| `searchPrompt` | Fixed-width search/prompt button with a short generated marketing-style phrase. |
| `panelIconGroup` | Compact icon group for multiple functions inside one panel; hover adds the approved light color change behind the active icon. |
| `newsletterCompound` | Compound email input plus guided subscribe action, used in the newsletter footer. |
| `panelStandaloneIcon` | `standaloneIcon` variant for white or quiet panels; hover adds both approved color and stroke emphasis. |
| `floatingResume` | Floating foreground control over complex media or gradient backgrounds, currently used for the course pre-play video action. |
| `categoryCard` | Category button/card for introducing learning domains with a square Lucide icon, title, and default description. |

#### Button Special Cases

- `newsletterCompound` has two independent hover targets in implementation: input hover affects only the input, and action-button hover affects only the button. The current Figma library documents this behavior but does not add separate variants.
- `newsletterCompound` uses `neutralAction` styling for its subscribe action. Light default is `rgba(0,5,9,0.89)`, light hover is `rgba(0,7,20,0.62)`, and light foreground is `rgba(255,255,255,0.9)`. Dark default is `rgba(252,253,255,0.937)`, dark hover is `rgba(241,247,254,0.71)`, and dark foreground is `rgba(0,0,0,0.84)`.
- `floatingResume` is the approved Button shadow exception from focused node `260:2199`. Its default state is a `32px` circular icon control with `rgba(255,255,255,0.8)`, `4px` backdrop blur, and a `16px` Lucide icon. Its hover state uses a solid white fill plus `0px 0px 8px rgba(255,255,255,0.8)` glow, and the icon color changes with the hover state.
- `neutralAction` and `cardGuideAction` share the same theme-aware neutral fills; `cardGuideAction` keeps the fixed Lucide `arrow-right`.
- `categoryCard` shows a description by default, uses equal `28px` padding on all sides, and uses a `25.666px` square Lucide icon box.
- `categoryCard` hover replaces the quiet surface with a unique image asset selected from node `226:2326`; visible cards in the same group must not reuse the same hover image.
- `categoryCard` hover applies `12px` blur to the gradient image background layer, changes text to the approved light foreground, and adds text shadow `0px 0px 4px rgba(0,0,0,0.2)` for title and description contrast.
- `categoryCard` icons must render through the shared Lucide/LumenIcon pipeline in a square intrinsic box; do not add category icons as stretched image layers or CSS masks.
- `aiChatFunctionChip` and `aiQuestionPromptChip` use the shallow chip hover from node `257:2062`: light hover fill is `neutral-alpha/2` (`rgba(0,0,85,0.02)`) with no visible border and no hover lift. Dark hover uses the approved dark active surface with no visible border.

### Tag System

The Tag family is the global compact labeling system for metadata, status, category, and short contextual labels. It is not a Button replacement and must not carry primary actions.

#### Tag Evidence

- The approved Tag evidence is Figma node `762:15058`.
- The node is approved only for Tag density, padding, layout, typography, alpha color relationships, and default icon treatment.

#### Tag API

Tag implementations should expose these design-level props:

- `density`: `default | compact | line`
- `tone`: `success | info | accent | neutral` or a future documented alpha tone
- `icon`: optional controlled Lucide icon name; default is `arrow-up-right`
- `label`: short text content

#### Tag Global Rules

- `Default` density is `32px` tall with `12px` left padding, `10px` right padding, `4px` gap, a `1px` tone border, and a transparent tone fill.
- `Compact` density is `24px` tall with `10px` left padding, `8px` right padding, `4px` gap, the default `0.5px` tone border, and a lighter transparent tone fill.
- `Line` density is `16px` tall, has no fill or border, keeps the `4px` label-to-icon gap, and underlines only the text label.
- Tag text uses `Geist Regular 12px / 16px`; do not use bold text or display typography inside tags.
- Tag radius is `pill`.
- The default icon is Lucide `arrow-up-right`, `16px`, `1.5px`, inheriting `currentColor`.
- Tone construction must keep background, border, and foreground inside the same semantic color family. Background fills stay transparent/alpha so the tag can sit on white, dark, media-overlay, and quiet panel surfaces without becoming a solid badge.
- Interactive tags may render as links or buttons, but they remain secondary navigation/metadata affordances. Use `Button` for CTAs, commands, form submission, or actions that need Button state semantics.
- Tag copy must stay short enough to fit in one line. Long explanatory copy belongs in body text or a card/module, not inside Tag.

#### Tag Densities

| Density | Purpose |
| --- | --- |
| `default` | Hero, section, card, or module labels where the label can breathe. |
| `compact` | Dense rails, table-like rows, card metadata, and narrow grouped labels. |
| `line` | Inline metadata links or minimal labels where a filled capsule would add too much chrome. |

### AI Interaction System

AI interaction behavior is shared across AI surfaces, while visual composition remains surface-specific.

#### Confirmed States

The v1 shared AI interaction states are:

- `idle`
- `promptSuggested`
- `composerFocused`
- `composing`
- `sending`
- `streaming`
- `answered`
- `error`
- `emptyContext`

These states apply to the course AI rail, hero prompt, and header search. The hero prompt and header search use the same interaction logic but may adapt layout and density because their primary jobs are course recommendation and platform introduction.

#### Course AI Behavior

- The course AI rail is not always bound strictly to the current course, but it should guide the learner back toward course context when useful.
- In playing states, AI should be more focused on the currently playing lesson content than in paused or browsing states.
- The AI status row changes with context; do not lock a single status label for all states.
- Compact course AI prompt chips should rescan lesson context on a short interval while the rail is idle, then regenerate suggestions from the current timestamp, chapter, nearby concepts, playback state, and next chapter instead of staying frozen on the first generated set.
- Current dark-mode coverage for AI edge states is incomplete and must be extended only from approved dark evidence or future confirmation.

#### Conversation Composition

- User questions appear as right-aligned message bubbles.
- AI responses appear as a left-aligned `AIAnswerBlock` with a Lucide `sparkle` identity marker.
- The confirmed light-theme user-question and AI-answer reading text color is `text.aiAnswer` from node `260:2775`.
- The AI Prompt Field hides starter prompt chips while the learner is typing and shows them again when the field is cleared.
- Hero prompt send actions use the `cardGuideAction` Button treatment from node `257:2062`: neutral black default fill, lighter neutral hover fill, and Lucide `arrow-right` inheriting `currentColor`.
- Hero prompt send actions are disabled while the trimmed input is empty; the empty disabled state uses the same lighter neutral fill as `cardGuideAction` hover and must not route to chat.
- Hero prompt textareas submit with `Enter` when trimmed input exists; `Shift+Enter` remains available for line breaks.
- Course-rail AI Prompt Field send actions may continue to follow the confirmed course AI evidence until a future focused Button update replaces that surface.
- During `sending`, the AI Prompt Field is disabled only for the send instant; prompt chips are hidden.
- After an answer, follow-up chips appear after the answer block and reuse the `aiQuestionPromptChip` Button kind.
- In the AI Chat Answered workspace, follow-up chips and answer actions start on the same left edge as the answer body content column; do not add extra left offset or independent top margins after the answer body.
- AI Prompt Field error and special states should appear inside the field unless a future confirmed state requires a separate treatment.

#### Thinking And Streaming

- Thinking state must display a `Thinking...` status in DM Serif Text Italic `12px / 16px`, followed by live provider reasoning or `Checking Context...` in Geist `12px / 18px`.
- The thinking marker uses the Lucide `sparkle`, not the MOOCKY logo sparkle.
- The focused Thinking marker uses a `32px` circular clipped glyph, a `13.337px` Lucide sparkle, and a `30px` radial glow. The loop is `1400ms`: hold frame 1 for `300ms`, animate `200ms` to frame 2, animate `200ms` to frame 3, hold `300ms`, animate `200ms` to frame 4, then animate `200ms` back to frame 1.
- The Thinking marker animation and `Thinking...` status continue through `finalizing`; do not show a separate `Finalizing answer...` row in the demo UI.
- When Thinking completes, the animated marker must be replaced by a static Lucide sparkle inside the same `32px` marker slot. The visible static sparkle uses the same `13.337px` glyph size as the Thinking animation so the transition does not visibly jump. It must not keep the glow, animated shell, or any running CSS animation.
- User question bubbles use a `40px` minimum height rather than fixed height, so longer prompts grow vertically instead of being compressed.
- No separate reduced-motion version is required in v1.
- Streaming should stay visually restrained: show the thinking/status affordance and reveal answer text progressively rather than introducing a heavy loading treatment.
- When the AI stream provides `answer_delta` events extracted from `answerMarkdown`, render those deltas as the live answer body before the final structured envelope is complete. Keep context tags, follow-up chips, course cards, answer actions, and persisted conversation metadata pending until the final envelope arrives.
- In Personalized Suggestion, the stream may emit `cards_ready` after the `answerMarkdown` string completes. Render those application-composed course cards immediately below the live answer body while follow-up chips, answer actions, title, and persistence continue to wait for the final envelope.
- If `answer_delta` already made answer text visible, the final envelope must not replay the parsed-text typewriter; replace the temporary body with the final body at full readable length and release cards/actions immediately.
- Final envelope reconciliation must not remount already visible answer body or course-card nodes. Reserve the no-reasoning thought-duration slot during live streamed answers so the final duration label does not cause a completion-frame jump.
- When no `answer_delta` was rendered before the final envelope, reveal `answerMarkdown` with a restrained typewriter effect. The reveal operates on readable text nodes after Markdown parsing, so Markdown syntax markers such as `##` or `**` must not flash onscreen. Use an `8ms` tick capped around `3200ms`; respect reduced-motion by showing the full answer immediately.
- When an answer mixes final `answerMarkdown` with `courseRecommendationCards`, hold the cards and post-answer affordances until the answer text has either streamed visibly or completed the fallback typewriter reveal.
- New Chat and Career Path answers keep `courseRecommendationCards` empty in the current demo. Personalized Suggestion normal answers are the fixed application-composed card-output mode: attach Nature Architecture plus three additional course cards after the final envelope instead of asking the provider to generate full card objects.
- Personalized Suggestion card strips are horizontal carousels. On card-area hover or focus-within, show a Figma `260:2199`-aligned floating browse button at the right edge when more cards are available; after browsing right, expose the left browse button as well.

#### AI Answer Block

- `AIAnswerBlock` is the confirmed answer-block concept, not a generic chat card.
- Completed answer metadata must choose one duration/status treatment: provider reasoning renders as a collapsed `Reasoning · elapsed` panel; when no provider reasoning exists, use a `Thought for elapsed` fallback line.
- Do not render collapsed reasoning and `Thought for...` at the same time for the same answer.
- A second metadata line below the duration/status treatment must support `Current lesson`, `timestamp`, and `course title`.
- Completed answer metadata must render inside an explicit metadata stack with stable spacing; do not rely on neighboring margins that can visually overlap during state transitions.
- Personalization is expressed through answer wording, not through a persistent visual label.
- Refusal responses use the same `AIAnswerBlock` pattern, explain the reason, and should redirect the learner toward useful course context when appropriate.
- Specialized answer cards such as summaries, quizzes, key terms, career advice, or research applications remain future patterns until confirmed.

#### Long Answers And Actions

- Long-answer handling is determined by visual height, not word count.
- If an answer can be read with a modest scroll inside the rail, do not show a full-screen entry.
- If an answer becomes visually too long for comfortable rail reading, expose a full-screen answer action.
- Answer actions use the existing Button group logic and Lucide icons.
- Confirmed answer actions are copy, save, thumbs up, thumbs down, and full-screen when needed.
- Regenerate is not a confirmed v1 answer action.
- Thumbs up and thumbs down are mutually exclusive and must preserve the selected feedback state.

#### Runtime Prompt Contract

- Prototype GPT API implementations must use the system prompt and response contract in [`ai-system-prompt.md`](./ai-system-prompt.md).
- Use structured JSON as the API response envelope, with learner-facing rich text inside `answerMarkdown`.
- Streaming transports may emit `answer_delta` events for the `answerMarkdown` field before the final envelope, but the final model contract remains the structured JSON envelope.
- Streaming transports may emit application-composed `cards_ready` events for fixed Personalized Suggestion cards after the visible answer body completes.
- The model generates follow-up chips directly. Personalized Suggestion course cards are composed by the application from the fixed card set so card metadata does not delay answer streaming.
- The UI owns thinking animation, thought-duration display, selected feedback state, answer action buttons, and visual-height handling for full-screen answers.
- The model must follow the learner's input language.
- The model must not expose hidden reasoning or `Thought for...` text in `answerMarkdown`.

### Promotion Rule

A scene component may become global only when both conditions are true:

- it repeats across multiple page domains
- the user explicitly confirms that its behavior and visual boundary should be shared

### Popular Course Strip

The landing `Most Popular` right-column course strip is a reusable image-backed list card.

- The foreground capsule uses the shared `8px` backdrop blur strategy over media.
- The foreground capsule uses Figma Auto Layout spacing: `60px` height, `20px` left padding, `16px` top/right/bottom padding, and `16px` gap between title and action.
- Light mode capsule surface is `rgba(255,255,255,0.8)` with `#1C2024` title text.
- Dark mode capsule surface is `rgba(29,29,33,0.78)` with `#EDEEF0` title text.
- The compact `arrow-up-right` action uses the theme-aware `neutralAction` action color: black fill in light mode and light fill in dark mode.
- The full strip is the link target for pointer and keyboard access; the compact circular action is a visual affordance inside that target, not the only clickable element.
- The compact action affordance owns its hover fill in both modes only when the pointer is over the affordance itself; hovering the broader strip must not trigger the affordance hover fill.
- Implementation should use the reusable `PopularCourseStrip` component so future course lists inherit the same surface, text, action, and icon-color behavior.

### Recommended Course Card Interaction

The landing `Recommended For You` course card is a scene-scoped reusable recommendation component. Current approved interaction evidence is limited to nodes `348:8253` and `348:8271`; light/dark color evidence for the landing card comes from node `419:5349`.

- Cards default to the collapsed image-first state; no card is expanded by default.
- The collapsed lower pill uses a `60px` height, `264px` minimum width, theme-aware panel surface, pill radius, `20px` Geist title, and a `32px` circular Lucide `arrow-up-right` action rotated into the rightward default posture.
- Light mode panel surface is `#FFFFFF`, title/provider/meta text is `#3E332E`, and supporting body text is `#60646C`.
- Dark mode panel surface is `#000000`, title/provider/meta text is `#EDE8E1`, and supporting body text is `#B0B4BA`.
- For this animated pill, resolve the pill radius as the geometric half-height (`30px`) instead of animating from an unbounded `9999px` radius; this preserves the same collapsed shape while avoiding an oversized oval during smart-animation interpolation.
- Real course titles may make the collapsed pill wider than `264px` so text stays intact; do not shrink or truncate title copy to preserve the reference minimum width.
- On hover or focus-within, the lower surface expands to a `280px` panel pinned to the card bottom, with `20px` left padding and `16px` top/right/bottom padding.
- The title transitions from Geist to `DM Serif Text 24px`; supporting summary, provider, rating, and review metadata enter with opacity and slight upward motion.
- The arrow rotates into its up-right action posture as the panel expands.
- The full card is the link target for pointer and keyboard access; the compact circular action is a visual affordance inside that target, not the only clickable element.
- The compact action affordance uses the theme-aware `neutralAction` action color and must expose hover in both light and dark mode only when the pointer is over the affordance itself; hovering the broader card must not trigger the affordance hover fill.
- The panel geometry uses `160ms ease-out`, matching the Figma smart-animation reference.
- Keep child layers in stable slots through the hover state; do not swap from row layout to column layout at the trigger moment.
- Title and supporting content may use shorter nested transitions inside the same `160ms` window: title in `120ms`, collapsed title exit in `90ms`, content in `128ms`, with a `16ms` title switch delay and `32ms` content reveal delay.
- Do not add hover lift or shadow to this card.

## Confirmed Page Archetypes

### 1. Marketing / Landing Shell

Must include:

- editorial brand entry
- discovery-oriented content modules
- controlled use of gradient art
- spacious section rhythm

Must avoid:

- dense product chrome
- dashboard-style panel mosaics as the default first impression

### 2. Learning / Course Shell

Must include:

- utility header
- lesson-first content hierarchy
- contextual support in a secondary rail
- authenticated rewards access through the header coins utility; the current product route is `/redeem`

Must avoid:

- marketing-style hero overload inside the study workspace
- decorative surfaces that weaken task clarity

### 3. AI as a Global Capability

The currently confirmed AI pattern is a companion rail in the learning shell.

Future AI surfaces:

- may appear elsewhere in the product
- must still feel contextual and supportive
- must not silently replace the current learning-first hierarchy without explicit design confirmation
- may share the same AI interaction states while adapting density and composition by surface

Confirmed additional AI entry surfaces:

- Hero prompt AI supports course recommendation and platform explanation.
- Header search AI supports compact learning intent and course/platform guidance.
- Header search activation uses a real input state; submitting non-empty text routes to the AI workspace with the learner intent preserved as the `question` query.
- These entry surfaces are not full component reuse of the course rail; they are unified-style variants.

## Extension Protocol For Future Wireframes

When a future page is introduced through a wireframe:

1. Map it to an existing archetype first.
2. Reuse existing foundations and the global button family.
3. Prefer scene-scoped components that already match the page domain.
4. If the wireframe requires a new rule or module, label it `Proposed Pattern`.
5. For any Figma-backed page or component, capture MCP/Inspect evidence before implementation and screenshot evidence after implementation.
6. Do not promote a `Proposed Pattern` into the system until it is confirmed through a new high-fidelity design or direct user approval.

### Extension Deliverable Rule

For future collaboration:

- wireframes become high-fidelity designs using the current system
- Figma-backed work uses a double-evidence workflow: MCP/Inspect for exact specs, screenshots/Playwright for visual acceptance
- new patterns remain provisional until confirmed
- the system grows by promotion, not by assumption
- dark-mode conclusions must come from approved dark reference frames or a direct user-approved focused reference for the component being changed
- prototypes should use no shadows by default and use translucent `8px` backdrop-blur foreground surfaces only when needed over complex backgrounds

## Open Questions

These items remain intentionally unresolved and must not be silently decided in code or documentation:

- Exact responsive breakpoint thresholds for mobile, tablet, desktop, and wide layouts
- Full approved gradient library beyond the v1 warm spectral family
- Whether purple/pink/blue gradients should become a secondary approved family
- Full localization strategy beyond the current English baseline
- Full interaction-state matrices for non-button components, including hover, loading, and error behaviors
- Full media accessibility policy for captions, transcripts, and advanced playback support
- Carousel and overflow behavior for future recommendation rails outside the currently shown examples
- Dark-mode evidence for AI edge states beyond the confirmed core rail views and the focused AI Chat Page references
- Specialized AI answer-card types such as summaries, quizzes, key terms, career advice, and research applications
