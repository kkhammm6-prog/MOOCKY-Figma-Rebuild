# Lumen Atlas Component Specs

## Rules of Use

- [`design-system.md`](./design-system.md) is the authority. This document is derivative.
- `Button` and `Tag` are globally unified component families.
- All other components are scene-scoped unless promoted by the design system.
- When a state or rule is not confirmed, record it in `Open Questions` instead of inventing it.
- Dark-state evidence in this file may only come from approved dark reference frames `180:1596`, `180:1831`, and `180:1880`, or user-approved focused component references for the component being documented, such as `762:15058` for Tag.
- All rounded component containers must use `60%` corner smoothing.
- Regular component radii are limited to `16px`, `8px`, and `pill`; any other radius must be documented as a special case.
- All icons must come from Lucide. The default icon spec is `16px` size with `1.5px` stroke; other sizes or strokes are special cases.
- Components must not use shadows by default.
- When a component sits directly over a complex gradient, image, or media background, use a translucent surface plus `8px` backdrop blur instead of a drop shadow.
- Translucent blur layering is for foreground controls and compact overlays only; normal quiet surfaces should use surface, border, and spacing.
- Component UI text using `Geist` defaults to Regular and must not exceed `20px`.
- The only confirmed Geist text above `20px` is `DataPanelMetricValue`: `Geist Semibold 32px / 40px`, used only for short central values inside data panels.
- Geist Semibold and Bold are allowed only for emphasis, active states, numeric emphasis, or hierarchy separation; do not use other Geist weights.
- Use the display-title pair for an independent page or interface main title when the surface also has multiple subordinate section titles.
- Use `Geist Regular 16px` in shallow brown for unbacked subordinate section titles so they stay visually secondary.
- `DM Serif Text` is limited to module-like backed card or panel titles and must not exceed `40px`.

## Page Density Guidance

These notes implement the page-level density rules in [`design-system.md`](./design-system.md). They do not create a shared density API for scene-scoped components.

- Landing components use `relaxed discovery density`: one clear job per section, generous spacing, strong media-to-text hierarchy, concise summaries, and shallow metadata.
- Course main-column components use `moderate study density`: readable lesson-first content, compact metadata, and supporting detail staged through tabs or discrete modules.
- Course header and right-rail components use `compact support density`: short labels, skimmable lists, small chips, progress states, and AI prompts that stay secondary to the lesson.
- Density variants should not be exposed as generic props unless a component already has confirmed visual variants.
- Do not increase density by shrinking typography below confirmed roles, removing accessible spacing, adding shadows, or turning quiet surfaces into decorative panels.

## AI Chat Workspace

### Purpose

Host AI conversations that begin from non-course AI entry points.

### Evidence

- Figma node `559:8583` for the current Default and Default/Dark AI Chat Page layout.
- Figma node `375:3335` for Sidebar Collapse, Thinking, Answered, and Answered Cards states.
- Figma nodes `375:4694`, `375:4875`, `375:4776`, `375:5204`, and `513:8444` for the focused Dark equivalents of the AI Chat Workspace.
- Figma node `457:7130` for Thinking animation timing and sparkle/glow construction.
- Figma node `491:7957` for compact Thinking visual style.
- Figma node `598:10430`, user-approved as a focused Thinking state reference for Thinking layout, dark counterpart, submitted-question bubble, and composer placement.
- Figma node `598:10961`, user-approved as a focused Answered state reference for the static AI icon slot, answer metadata rhythm, answer body density, follow-up chips, actions, and composer placement.

### Structure

- global `LogoLockup` header
- collapsible left sidebar
- centered `720px` main conversation column
- default prompt chips
- user question bubble
- assistant answer row with Thinking glyph, reasoning panel, answer body, follow-up chips, and answer actions
- bottom AI composer

### Rules

- Sidebar expands to `350px` and collapses to `60px`; collapsed controls stack vertically.
- Collapsed AI Chat sidebar height is `100px`, not full workspace height; it wraps only the two top controls from focused Figma node `575:10098`.
- Collapsed top-control stack is `36px x 76px` with `2px` padding and `8px` vertical gap.
- Collapse/expand motion transitions sidebar width, flex-basis, height, and padding; hidden sidebar content fades/clips away during collapse.
- Main conversation column and bottom AI composer are trialed at `720px` wide for the desktop prototype.
- Sidebar top controls are `32px` circular Lucide icon controls; default layout uses a visible back control and a sidebar panel collapse/expand control.
- Default sidebar conversation-mode icons follow the focused Figma/user-corrected reference: `badge-plus` for New Chat, `chess-pawn` for Personalized Suggestion, and `road` for Career Path.
- Sidebar mode rows reserve a `28px` icon slot for Figma alignment, while the Lucide glyph remains the default `16px / 1.5px` visual size inside that slot.
- Sidebar mode row hover, focus-visible, and current states add the Figma circular icon backing around the `28px` slot: light `#fff`, dark `#000`.
- Sidebar record rows are compact fill-width controls: `32px` high, `12px` padding, `12px` internal gap, `12px` radius, explicit Geist `14px / 16px`, transparent by default, and AI Chat active surface on hover/current.
- Sidebar record mode markers use solid black with `0.27` opacity in light mode so special conversation types remain visible but visually secondary, without self-overlap darkening inside Lucide strokes.
- The main column stays centered in the remaining workspace after the sidebar.
- Kimi `reasoning_content` may be rendered only in the separate reasoning panel, not inside `answerMarkdown`.
- During Thinking, live reasoning is expanded inline beneath `Thinking...` and streams real provider reasoning when available.
- After the answer completes, the reasoning panel defaults collapsed and can be reopened.
- If no provider reasoning is available, show only the Thinking status fallback; do not fabricate reasoning.
- Answered state keeps the same `32px` marker slot as Thinking, but the static visible sparkle must match the Thinking glyph body at `13.337px`.
- Answer body reveal uses live `answer_delta` when available. If no visible deltas streamed before the final envelope, use a typewriter effect over parsed readable text, not raw Markdown syntax. The default tick is `8ms`, capped around `3200ms`, and reduced-motion shows the full answer immediately. Course recommendation cards and post-answer affordances appear after the visible answer completes.
- `cards_ready` may render application-composed Personalized Suggestion cards before the final envelope, after the visible answer body has completed.
- Streamed-to-final reconciliation must keep the answer body and card carousel mounted in stable positions, with the thought-duration slot reserved before final completion.
- Answer body uses `Geist Regular 14px / 24px`; answer subheads use `DM Serif Text 16px`.
- The answered content stack uses a `12px` vertical gap between metadata, tags, answer body, cards, follow-up chips, and actions. Follow-up chips start at the answer body left edge, wrap with `4px` row/column gap, and keep `32px` height with `12px` horizontal padding.
- The answer action bar starts at the same answer body left edge and uses a `2px` padded pill group with `2px` internal gap and `28px` icon buttons.
- Follow-up chips are real submit controls and must be disabled while the composer is disabled.
- Answer action buttons must provide visible text feedback after click; Copy must write the answer text to the clipboard.
- Personalized Suggestion answers render compact course recommendation cards as an application-composed fixed output mode. The demo card set must include `Nature Architecture` plus three additional cards. New Chat and Career Path keep cards empty unless a future state explicitly re-enables them.
- Personalized Suggestion card strips use a horizontal carousel. Browse controls reuse the focused floating treatment from Figma node `260:2199`: `32px` circle, `16px` Lucide icon, translucent panel default, `4px` backdrop blur, and solid/glow hover.

## LogoLockup

### Purpose

Represent the canonical MOOCKY brand mark.

### Structure

- fixed vector wordmark outlines
- attached sparkle mark inside the same `97px` by `32px` viewBox
- Reference-aligned internal placement from node `429:5935`

### States

- default light
- default dark, confirmed in approved landing and learning dark frames

### Props

- `theme`: `light | dark`
- `size`: `header | compact | display`
- `href`: optional destination

### Reuse Rules

- Use for global brand entry points.
- Keep sparkle attached to the wordmark.
- Use the exported vector asset or `LogoMark` component; do not rebuild the mark as live text plus a separate icon.
- Header usage preserves the `97px` by `32px` Reference frame so the next control begins after the confirmed `10px` header gap.
- Light-theme color is `#3E332E`; implementation may use `currentColor` for dark-theme contrast without changing the logo geometry.

### Prohibited Uses

- Do not use sparkle alone as the primary logo.
- Do not replace the lockup with ad hoc typographic treatments.
- Do not add the Reference source logo font to the product typography system.

### Open Questions

- Exact responsive behavior for very narrow headers.

## Icon

### Purpose

Render action and utility symbols from the approved Lucide source.

### Structure

- Lucide icon source
- `16px` default size
- `1.5px` default stroke
- inherited `currentColor` for interactive controls

### Reuse Rules

- Prefer `lucide-react` for interactive icons that need inherited color, precise size, or state animation.
- Do not draw icons with CSS bars, text glyphs, ad hoc SVG paths, or non-Lucide image assets.
- Controls must receive icons through a controlled icon name or shared icon primitive, not arbitrary SVG/IMG nodes, so theme color changes flow through `currentColor`.
- Brand marks, such as the MOOCKY sparkle lockup, must be documented as exceptions.

## DataPanel

### Purpose

Summarize a compact product or learning metric in dashboard-like learning surfaces.

### Evidence

- User-approved MyProgress prototype metric panels, 2026-04-28.

### Structure

- panel shell
- optional Lucide icon
- short label
- central metric value
- optional helper copy or trend text

### Reuse Rules

- Use for compact dashboard stat panels, progress summaries, and learning metric cards.
- The central metric value may use the `DataPanelMetricValue` type style: `Geist Semibold 32px / 40px`.
- Metric values must be short numeric or status-like data, such as counts, percentages, durations, scores, or 1-2 word value labels.
- Numeric values may count up from `0` on the first viewport entry only. Nonnumeric status values remain stable; if a status panel's meaningful metric is in helper copy, that numeric helper may count up instead.
- Labels, helper copy, trend text, and actions stay within the normal Geist `12px` to `20px` UI range.
- Use Lucide icons through the shared `LumenIcon` pipeline at the default `16px / 1.5px` unless a future component variant confirms another size.
- Use the regular `16px` radius, normal component border rules, and no shadow by default.

### Prohibited Uses

- Do not use `DataPanelMetricValue` for editorial titles, card titles, paragraph copy, CTA labels, or decorative numerals outside a data panel.
- Do not allow the metric value to wrap; reduce the content length or fall back to the normal UI type range.

## Tag

### Purpose

Render compact labels for metadata, status, category, and low-emphasis contextual navigation.

### Evidence

- Figma node `762:15058`, approved only for the Tag component.

### Structure

- pill or line container
- short text label
- optional controlled Lucide icon, defaulting to `arrow-up-right`

### States

- densities: `default`, `compact`, `line`
- tones: `success`, `info`, `accent`, `neutral`
- interactive rendering may be link or button, but no extra visual state is confirmed beyond focus-visible accessibility

### Props

- `density`: `default | compact | line`
- `tone`: `success | info | accent | neutral`
- `label`: string
- `icon`: controlled Lucide icon name or hidden icon
- `href`: optional link destination
- `as`: optional semantic rendering, such as `span` or `button`

### Reuse Rules

- Use `default` for relaxed labels in heroes, modules, and larger cards.
- Use `compact` for dense rails, card metadata, and constrained groups.
- Use `line` for inline metadata or secondary navigation where a filled capsule would add too much surface.
- Text uses Geist Regular `12px / 16px`; do not bold or enlarge Tag labels.
- Keep the default `4px` gap between label and icon.
- Use tone families as alpha systems: transparent background, same-family border, and same-family foreground.
- Render icons through `LumenIcon` with `16px / 1.5px` and `currentColor`.
- Keep copy short and one-line.

### Prohibited Uses

- Do not use Tag as a primary CTA, form submit, or Button substitute.
- Do not use raw image icons, custom SVG, bold typography, shadows, or non-pill radius.
- Do not put long course descriptions, marketing claims, or multi-line content inside Tag.

### Open Questions

- Full hover, selected, disabled, loading, and removable states.
- Whether future tones should map to a fixed semantic status palette or remain component-scoped alpha tones.

## ViewportReveal

### Purpose

Introduce section-level content with a calm top-to-bottom entrance sequence.

### Structure

- reveal item shell
- runtime visible state
- optional same-batch stagger order

### States

- pending
- visible
- reduced motion

### Reuse Rules

- Default motion is `opacity 0 -> 1` and `translateY(14px) -> 0` over `300ms ease-out`.
- Reveal items are visible by default and become temporarily hidden only when runtime applies `reveal-pending`.
- Runtime must process first-viewport reveal items immediately on mount, so the initial viewport reveals without waiting for scroll.
- Reveal items are visible before runtime processing; `reveal-pending` is the only state that hides an item before its viewport entry.
- Runtime must restore reveal items to visible on `pagehide` and persisted `pageshow` so browser Back from a detail page cannot leave cached sections transparent.
- New pages and prototypes must mount `ViewportRevealRuntime` once, unless the surrounding app shell already runs `useRevealOnView`.
- Multiple reveal items entering in the same batch use a top-to-bottom `160ms` stagger capped at `320ms`.
- Apply reveal to section-level components by default. Split important first-viewport groups only when they create separate reading moments, such as landing hero copy followed by the Chatbox/prompt group.
- When creating, previewing, or deploying a new page, opt section-level browsing content into `reveal-on-view` by default unless the request explicitly asks for no entrance motion.
- Do not implement page-local reveal keyframes or CSS rules that override the shared `.reveal-on-view` opacity, transform, transition, or delay behavior.
- Do not apply to Footer components; footers must remain stable page-ending anchors.
- Reduced-motion mode shows content immediately without translate movement or stagger delay.

## DisplayTitle

### Purpose

Render independent page or identity-level titles with the strict two-font display pair.

### Structure

- first word: `Cormorant Infant Medium Italic`
- remainder: `Gayathri Thin`
- first-word optical offset: `translateY(-0.18em)`

### Props

- `firstWord`: string
- `remainder`: string
- `size`: `large | medium | compact | mobile`
- `firstSizePx`: optional custom first-word size for exploratory layouts

### Reuse Rules

- Use named sizes before custom sizes.
- Preserve the scalable ratio: remainder size `0.85` of first-word size, first tracking about `-0.05em`, remainder tracking about `-0.015em`, inline gap minimum `10px` with optional upward scaling around `0.125em`.
- Clamp custom sizing so no rendered segment falls below `42px`.
- Do not override first-word and remainder spans separately in page CSS.

## Button

### Purpose

Provide the single globally unified action family across MOOCKY.

### Evidence

- Figma node `257:2062`
- The node is approved only for Button purposes, names, states, locked visuals, dark variants, and Button-specific special cases.

### Structure

- container
- label
- optional leading icon
- optional trailing icon
- optional compound input area for `newsletterCompound`
- optional grouped icon cells for `panelIconGroup`

### States

- themes: `light`, `dark`
- confirmed interaction states: `default`, `hover`
- default hover motion: `160ms ease-out`

### Props

- `kind`: `standaloneIcon | auxiliaryAction | primaryAction | neutralAction | cardGuideAction | aiChatFunctionChip | aiQuestionPromptChip | searchPrompt | panelIconGroup | newsletterCompound | panelStandaloneIcon | floatingResume | categoryCard`
- `theme`: `light | dark`
- `state`: `default | hover`
- `label`: optional, required for text buttons and chips
- `icon`: optional controlled Lucide icon name; editable only for non-action icons
- `disabled`: boolean
- `loading`: boolean
- `href`: optional

### Kinds

| Kind | Use |
| --- | --- |
| `standaloneIcon` | Independent circular icon button for important isolated actions, such as nav mode switching and profile entry. |
| `auxiliaryAction` | Secondary action button, often paired with `primaryAction`; must keep the right-side `arrow-up-right` icon because it signals a jump/action. |
| `primaryAction` | Single brown filled main action for an interface surface; follows the same structure as `auxiliaryAction` and appears on the right when both are present. |
| `neutralAction` | Neutral filled repeated action button for `More`, `Explore more`, subscribe-style actions, and other secondary actions that should not introduce more theme color. |
| `cardGuideAction` | Compact neutral guide button used with card capsule or prompt compositions to encourage navigation. |
| `aiChatFunctionChip` | Chip below an AI chatbox to suggest what AI can do. |
| `aiQuestionPromptChip` | Chip above an AI chatbox to guide the user toward a question. |
| `searchPrompt` | Fixed-width search/prompt button; copy may be generated, but must stay short and fit the field. |
| `panelIconGroup` | Grouped compact icon buttons for multiple functions inside one panel. |
| `newsletterCompound` | Email input plus subscribe action used in the newsletter footer. |
| `panelStandaloneIcon` | Standalone icon variant for white or quiet panels, with a special hover color plus stroke emphasis. |
| `floatingResume` | Floating foreground button over complex media or gradient backgrounds, currently the course pre-play video action. |
| `categoryCard` | Card-like button for learning categories, using a square Lucide icon, compact title, and default description. |

### Reuse Rules

- Use the same button family in marketing and learning surfaces.
- Express page differences through variant and context, not separate button systems.
- Preserve approved Button colors, visual style, padding strategy, circular button dimensions, long-button height, and hover effects.
- Use `primaryAction` at most once per interface surface; subsequent filled action buttons use `neutralAction`.
- Text labels and non-action icons may change to fit content.
- Button implementations must not accept arbitrary icon nodes. Use the shared `LumenIcon`/Lucide-name pipeline so icons inherit the Button `currentColor` in light mode, dark mode, hover, and focus-visible states.
- Action icons that communicate navigation or behavior must stay fixed, including the right-side `arrow-up-right` for `auxiliaryAction`, `primaryAction`, and `neutralAction`, and the `arrow-right` for `cardGuideAction`.
- Implement fixed action icons inside the reusable Button component, not as page-level image assets.
- Do not render Button icons through `<img>` assets; they must inherit `currentColor`.
- When a Button sits on complex media or gradient art, use the approved translucent background plus backdrop blur treatment.
- `floatingResume` is the approved `260:2199` Button shadow exception: `32px` circle, `rgba(255,255,255,0.8)`, `4px` backdrop blur, `16px` Lucide icon, and documented hover glow.
- `newsletterCompound` must implement input hover and action-button hover separately, even though the current Figma component library documents the behavior without separate variants.
- `newsletterCompound` uses `neutralAction` styling for the subscribe action.
- `neutralAction` and `cardGuideAction` are theme-aware: light mode uses `rgba(0,5,9,0.89)` default, `rgba(0,7,20,0.62)` hover, and `rgba(255,255,255,0.9)` foreground; dark mode uses `rgba(252,253,255,0.937)` default, `rgba(241,247,254,0.71)` hover, and `rgba(0,0,0,0.84)` foreground.
- `categoryCard` shows description text by default, uses equal `28px` padding, and changes to a unique `12px` blurred gradient image hover background selected from node `226:2326`.
- `categoryCard` hover text uses `rgba(255,255,255,0.9)` plus text shadow `0px 0px 4px rgba(0,0,0,0.2)`.
- `categoryCard` icons must come through the shared Lucide/LumenIcon path in a square intrinsic box so icons do not stretch or blur when added to the component.
- `aiChatFunctionChip` and `aiQuestionPromptChip` hover uses `neutral-alpha/2` (`rgba(0,0,85,0.02)`) in light theme, removes the visible border, and does not inherit generic hover lift. In dark theme, hover uses the approved dark active surface and no visible border.
- Button labels, chips, and action copy use `Geist`. `DM Serif Text` is reserved for module or module-like card/panel titles, not Button text, even when the module is capsule-shaped.

### Prohibited Uses

- Do not create separate marketing and learning button families.
- Do not encode scene identity with new button geometry.
- Do not change locked Button colors, padding, dimensions, hover effects, or dark variants while only changing content.
- Do not replace action icons with unrelated icons.
- Do not use Button evidence to define unrelated component rules.

### Open Questions

- Exact focus-visible styling for each Button kind.
- Disabled, loading, and pressed states beyond the confirmed `default` and `hover` variants.

## MarketingHeader

### Purpose

Provide brand-first navigation for landing and marketing-facing surfaces.

### Structure

- logo lockup
- primary navigation
- secondary actions
- optional login / explore actions

### States

- default light
- default dark, confirmed in approved landing dark frame `180:1596`
- demo authenticated preview, confirmed only by user-approved focused Navi Bar reference `429:6308`
- compact responsive state: open question

### Props

- `navItems`
- `secondaryActions`
- `theme`
- `sticky`: boolean
- `demoAuthenticated`: boolean, prototype-only

### Reuse Rules

- Use on landing pages and future marketing shells.
- Keep the header visually light and editorially aligned.
- Keep navigation shallow; route dense utility controls to the learning header or future product shells.
- The authenticated preview may be used for prototype demos where clicking `Log In` swaps the right cluster from guest actions to the compact learning-style utility cluster.
- In the demo stage, that preview state persists in the browser after one `Log In` click so Landing and AI workspace headers remain authenticated across route changes and reloads until local storage is cleared.
- On narrow demo previews, preserve the `Log In` action so the state-switching interaction remains reachable; the primary Explore CTA may be hidden first.

### Prohibited Uses

- Do not reuse this as the authenticated learning header.
- Do not treat the demo authenticated preview as a production authentication state machine.
- Do not overload with dense utility controls.

### Open Questions

- Exact mobile collapse pattern.

## LearningHeader

### Purpose

Provide utility-first navigation and quick access for study surfaces.

### Structure

- logo lockup
- learning context entry
- compact search / intent field
- utility icon cluster
- account entry

### States

- default light, including the user-approved focused Navi Bar preview `429:6308`
- default dark, confirmed in approved course dark frames `180:1831` and `180:1880`
- compact responsive state: open question

### Props

- `contextLabel`
- `searchPlaceholder`
- `utilityActions`
- `profileAction`
- `theme`

### Reuse Rules

- Use on authenticated learning pages.
- Preserve high scanability and compact density.
- Keep controls short and action-oriented; do not introduce marketing hero copy into the header.
- The focused `429:6308` preview uses `LogoLockup`, `MyProgress`, a `300px` `HeaderSearchField`, a three-item utility icon group, and a circular profile entry.
- In the authenticated header, the `coins` utility opens `/redeem` as the rewards redemption surface.

### Prohibited Uses

- Do not merge with marketing navigation logic.
- Do not add brand-hero content into this shell.

### Production Routing

- Production-enabled pages must be promoted out of `/prototypes` before connected navigation points to them.
- A connected product route may keep a legacy prototype redirect in routing config, but it must not keep a duplicate implementation under `app/prototypes/*`.

### Open Questions

- Exact mobile navigation collapse behavior.

## HeroPromptField

### Purpose

Capture high-level learner intent on hero and onboarding-like surfaces.

### Structure

- prompt shell
- text field or pseudo-input
- submit action

### States

- default light
- default dark, confirmed in approved landing dark frame `180:1596`
- empty disabled send
- active / focused: partially confirmed
- loading / submitting: open question

### Props

- `placeholder`
- `submitAction`
- `theme`
- `intentContext`

### Reuse Rules

- Use on hero and intent-capture surfaces.
- Pair with suggestion chips when the page needs guided starting points.
- Keep the surrounding hero density relaxed: one primary prompt field, one action path, and a small set of short intent chips.
- The landing hero submit action uses `Button/CardGuideAction`: neutral black default fill, slightly lighter neutral hover fill, and Lucide `arrow-right` inheriting `currentColor`.
- The landing hero submit action is disabled while the trimmed input is empty; the disabled visual uses the same lighter neutral fill as hover and cannot submit or route.
- `Enter` submits when trimmed input exists; `Shift+Enter` inserts a line break.
- When used as an AI surface, share the confirmed AI interaction states while focusing responses toward course recommendation and platform explanation.
- Course recommendation chips may appear when AI guidance makes them useful.

### Prohibited Uses

- Do not reuse as the compact learning header search.
- Do not turn it into a generic form field without the intent-capture framing.

### Open Questions

- Validation, error, and loading treatments.

## HeaderSearchField

### Purpose

Provide compact intent or search entry inside the learning header.

### Structure

- compact rounded field
- leading search icon
- placeholder text

### States

- default light, including the focused `429:6308` Navi Bar preview
- default dark, confirmed in approved course dark frames `180:1831` and `180:1880`
- focused / active input
- filled
- submitting through Enter

### Props

- `placeholder`
- `value`
- `theme`
- `widthMode`
- `onSubmit`

### Reuse Rules

- Keep compact and header-scoped.
- The `429:6308` preview fixes the desktop field width at `300px` with a Lucide `search` icon and `Tell us what you want to achieve` placeholder.
- The field must activate to a real input on click/focus.
- Non-empty `Enter` submits to the AI workspace using `/ai?question={encodedInput}`.
- On narrow authenticated previews, collapse to a `32px` icon until active, then expand while the utility/profile cluster steps aside.
- Use for utility search and learning goals inside the study shell.
- When used as an AI surface, share the confirmed AI interaction states while adapting density for the header.
- AI responses in this surface should stay compact and guide the learner toward relevant courses or platform understanding.

### Prohibited Uses

- Do not replace the hero prompt field with this component.
- Do not use as a primary page CTA module.

### Open Questions

- Search result reveal pattern and mobile behavior.

## GoalChip

### Purpose

Offer short guided prompts or intent shortcuts.

### Structure

- pill container
- optional icon
- short label

### States

- default light
- default dark, confirmed as outlined prompt chips in approved AI rail frame `180:1880`
- selected: open question
- hover / pressed: open question

### Props

- `label`
- `icon`
- `context`: `hero | ai-suggestion`
- `theme`

### Reuse Rules

- Use for suggestion-level actions.
- Keep copy short and intent-led.

### Prohibited Uses

- Do not use as a primary CTA.
- Do not overload with long explanatory copy.

### Open Questions

- Whether chips can become persistent filters or remain ephemeral suggestions only.

## SegmentedControl

### Purpose

Switch between closely related views inside a shared content region.

### Structure

- outer segmented shell
- segment items
- active indicator
- optional utility icon

### States

- active item
- inactive item
- approved dark learning variants confirmed in `180:1831` and `180:1880`
- hover / focus-visible: open question

### Props

- `items`
- `activeItem`
- `context`: `lesson-tabs | rail-mode-switch`
- `theme`
- `utilityAction`: optional

### Reuse Rules

- Share the behavior pattern across scenes.
- Keep visuals scene-scoped unless later promoted.

### Prohibited Uses

- Do not assume a single cross-scene visual implementation.
- Do not replace primary navigation with segmented controls.

### Open Questions

- Exact focus and keyboard interaction spec.

## DomainTile

### Purpose

Surface a compact learning domain or benefit area.

### Structure

- card shell
- icon
- title
- visible default description

### States

- default light
- default dark, confirmed in approved landing and learning dark frames
- highlighted: partially confirmed in some contexts

### Props

- `icon`
- `title`
- `description`: required in landing domain cards
- `theme`
- `tone`

### Reuse Rules

- Use as a compact educational taxonomy or benefit tile.
- Landing domain cards show a short description by default.
- Use equal `28px` padding in the confirmed landing `categoryCard` treatment.
- On hover, replace the quiet surface with a unique gradient image selected from node `226:2326`, blur the hover background image layer by `12px`, and do not reuse a hover image within the same visible group.
- Hover title and description use `rgba(255,255,255,0.9)` with text shadow `0px 0px 4px rgba(0,0,0,0.2)`.
- Add icons through the shared Lucide/LumenIcon pipeline in a square intrinsic box; do not add category icons as stretched image layers, masks, or raster assets.
- In landing contexts, prefer short titles and one-line descriptions over metadata-heavy tiles.

### Prohibited Uses

- Do not overload with heavy metadata.
- Do not convert into a generic dashboard stat card.

### Open Questions

- Whether selectable or purely navigational variants are needed.

## LandingFeaturedCourseModule

### Purpose

Show a high-emphasis featured course cluster on marketing surfaces.

### Structure

- section label
- primary feature block
- companion vertical or stacked cards
- optional more action

### States

- default light
- default dark, confirmed in approved landing dark frame `180:1596`

### Props

- `sectionLabel`
- `primaryCourse`
- `secondaryCourses`
- `moreAction`
- `theme`

### Reuse Rules

- Use for curated editorial discovery.
- Preserve asymmetry and visual hierarchy.
- Keep the module lighter than a full catalog: feature a small number of high-signal courses instead of exposing dense browse controls.

### Prohibited Uses

- Do not flatten into equal-weight card grids.
- Do not use as a generic search results list.

### Open Questions

- Carousel/overflow behavior at smaller breakpoints.

## PopularCourseStrip

### Purpose

Represent an image-backed popular course row in the landing `Most Popular` list.

### Structure

- media image
- whole-card link target
- blurred foreground capsule
- course title
- circular Lucide `arrow-up-right` visual action affordance

### Props

- `title`
- `imageSrc`
- `imageAlt`: optional
- `href`: optional, defaults to the course entry route

### Reuse Rules

- Use the reusable `PopularCourseStrip` component path at `app/components/CourseCards.tsx`.
- Light capsule surface is `rgba(255,255,255,0.8)` with `#1C2024` title text.
- Dark capsule surface is `rgba(29,29,33,0.78)` with `#EDEEF0` title text.
- Foreground capsule layout uses `60px` height, `20px` left padding, `16px` top/right/bottom padding, and `16px` gap.
- The full strip is clickable/focusable; do not leave only the circular affordance interactive.
- The circular affordance uses the theme-aware `neutralAction` colors, including hover in both modes only when the pointer is over the affordance itself.
- Icons must render through `LumenIcon` and inherit `currentColor`; do not use image arrow assets.

## RecommendedCourseCard

### Purpose

Represent a course recommendation in browse and discovery contexts.

### Structure

- media area
- whole-card link target
- collapsed lower pill or expanded lower panel
- title layer
- description block
- provider metadata
- rating / review metadata
- circular Lucide `arrow-up-right` action

### States

- editorial full-card
- image-first overlay-pill card
- compact recommendation style
- collapsed default
- expanded hover / focus-within
- approved dark landing-card colors confirmed in `419:5349`

### Props

- `title`
- `description`
- `imageSrc`
- `imageAlt`: optional
- `provider`: optional
- `rating`: optional
- `reviews`: optional
- `href`: optional
- `theme`: inherited from the page theme

### Reuse Rules

- Treat recommendation cards as a family, not a single locked layout.
- Preserve strong media-to-text hierarchy.
- Keep landing-card summaries concise and metadata shallow; move syllabus, lesson progress, and detailed requirements into course-detail surfaces.
- For the landing `Recommended For You` card, use nodes `348:8253` and `348:8271` only as focused evidence for this card interaction; use node `419:5349` for light/dark card color.
- Default state is collapsed for every card; do not keep a first card expanded only to demonstrate the design.
- Collapsed lower pill uses `60px` height and `264px` minimum width. It may grow wider for longer real course titles so text remains intact.
- Light mode panel surface is `#FFFFFF`; title/provider/meta text is `#3E332E`; description text is `#60646C`.
- Dark mode panel surface is `#000000`; title/provider/meta text is `#EDE8E1`; description text is `#B0B4BA`.
- The animated collapsed pill resolves its radius to half the collapsed height (`30px`) so the hover interpolation stays panel-like instead of ballooning from an unbounded pill radius.
- Expanded lower panel height is `280px` and is pinned to the bottom edge of the card.
- Keep panel children in stable absolute slots through hover/focus; do not change flex direction or force a layout-mode swap at the trigger.
- The title transitions from `Geist 20px` to `DM Serif Text 24px`; description, provider, and rating metadata fade in with a slight upward motion.
- The panel geometry owns the full `160ms ease-out` motion. Nested title/content transitions may be shorter within that window: `120ms` title, `90ms` collapsed-title exit, `128ms` content reveal, `16ms` title switch delay, and `32ms` content reveal delay.
- The action icon remains Lucide `arrow-up-right`; in the collapsed state it is rotated into a rightward posture, then rotates to the up-right posture on expansion.
- The full card is clickable/focusable; do not leave only the circular affordance interactive.
- The circular affordance uses theme-aware `neutralAction` colors and must expose hover in light and dark mode only when the pointer is over the affordance itself.
- Interaction motion is `160ms ease-out`, matching the Figma smart-animation reference.

### Prohibited Uses

- Do not convert into dense utility tables.
- Do not use unapproved image treatments outside the gradient/media rules.
- Do not add hover lift or card shadows to this interaction.

### Open Questions

- Whether this specific hover expansion should be reused outside landing recommendation sections.
- Cross-page dark variants beyond the landing card reference remain open.

## FAQAccordion

### Purpose

Reveal short explanatory answers in a calm, low-friction format.

### Structure

- item shell
- question row
- indicator icon
- optional answer body

### States

- collapsed light
- collapsed dark, confirmed in approved landing dark frame `180:1596`
- expanded

### Props

- `items`
- `allowMultiple`: open question
- `theme`

### Reuse Rules

- Use for short explanatory Q&A on marketing or support-adjacent surfaces.
- Keep answer density restrained.
- Prefer progressive disclosure over showing multiple long answers at once on landing pages.
- Use Lucide `chevron-down` for the indicator. This is a documented icon-size exception: render it in a `24px` viewport with `1.5px` stroke so the drawn chevron keeps the intended `12px × 7.4px` visual footprint.

### Prohibited Uses

- Do not use as a substitute for complex documentation navigation.
- Do not turn into nested accordions.

### Open Questions

- Single-open versus multi-open behavior.

## InstructorCard

### Purpose

Provide a compact profile of the course instructor and supporting credibility.

### Structure

- avatar
- name
- role
- supporting bullet facts
- outbound or contact actions

### States

- default
- dark variant, confirmed in approved course dark frames `180:1831` and `180:1880`

### Props

- `avatar`
- `name`
- `role`
- `facts`
- `actions`
- `theme`

### Reuse Rules

- Use inside learning and course-detail contexts.
- Keep the card concise and credibility-led.

### Prohibited Uses

- Do not expand into a full profile page template.
- Do not overload with unrelated social proof.

### Open Questions

- Whether a compact inline variant is needed for smaller screens.

## CurriculumRail

### Purpose

Provide progress tracking and lesson navigation within the learning shell.

### Structure

- rail shell
- rail mode segmented control
- progress bar
- curriculum header
- progress summary chip
- list of lesson items
- collapse action

### States

- progress mode light
- progress mode dark, confirmed in approved course dark frame `180:1831`
- item states: `completed`, `current`, `upcoming`
- collapsed rail action

### Props

- `items`
- `completedCount`
- `totalCount`
- `activeItemId`
- `theme`

### Reuse Rules

- Use as the study-progress rail inside the learning shell.
- Keep it sticky on desktop when layout permits.
- Use a tight desktop sticky offset of about `12px`, matching the compact rail's bottom breathing room in sticky states.
- When a sticky discussion composer appears in the paired main column, use the same desktop sticky offset so both pinned surfaces align at the top edge.
- In collapsed Course Progress state, let the rail fit the visible curriculum content so the bottom panel edge sits near the Expand/Collapse control.
- For expanded progress lists and AI rail states, calculate dynamic viewport height from the rail's current visible top gap so the bottom remains about `12px` inside the viewport at the top of the page and while sticky; keep collapsed Course Progress as content-fit. Desktop course grids may reserve extra lower sticky scope so the rail is not pushed upward before the compact footer enters.
- Keep list items compact but readable; each item should make lesson state, title, and immediate progress legible at a glance.
- In compact course pages, pair the progress rail with the AI rail through a two-tab rail header. The active tab changes text color and moves a `2px` underline measured from the active tab slot rather than swapping the rail shell.
- Compact curriculum rails may default to a clipped list and expose a bottom Expand/Collapse button with the shared `160ms ease-out` hover behavior.
- Linear progress bars and circular gauges use the neutral action role for fill color, not accent brown. Percent labels use Geist Regular and the same neutral role.
- Progress fills may animate from `0` to target on the first viewport entry only. If the owning card or module uses viewport reveal, start the fill after the reveal transition has completed. Reduced-motion users receive the final fill immediately.
- Circular gauges should match the visual stroke thickness of the paired linear bar unless a future focused reference confirms a thicker gauge.

### Prohibited Uses

- Do not repurpose as a generic sidebar navigation.
- Do not remove progress context from the rail.

### Open Questions

- Exact mobile presentation beyond drawer/tab guidance.

## AICompanionRail

### Purpose

Provide contextual AI support as a secondary learning surface.

### Evidence

- Figma node `260:2775`
- The node is approved for the AI answered rail state: rail header, user message bubble, AI answer block, bottom AI Prompt Field, and top operation buttons.

### Structure

- rail shell
- rail mode segmented control
- contextual rail header
- AI status row
- starter prompt chip area
- conversation stack
- AI Prompt Field
- optional answer action button group

### States

- AI mode idle light
- AI mode idle dark, confirmed in approved course dark frame `180:1880`
- AI mode with starter prompts, confirmed in approved light and dark AI rail frames
- AI Prompt Field ready, confirmed in approved light and dark AI rail frames
- shared AI interaction states: `idle`, `promptSuggested`, `composerFocused`, `composing`, `sending`, `streaming`, `answered`, `error`, `emptyContext`
- answered state, confirmed in node `260:2775`
- refusal state, confirmed by conversation decision and implemented through `AIAnswerBlock`

### Props

- `statusLabel`
- `promptSuggestions`
- `composerPlaceholder`
- `messages`
- `answerBlocks`
- `contextTags`
- `followUpPrompts`
- `answerActions`
- `theme`
- `conversationState`

### Reuse Rules

- Use as the canonical current AI companion surface.
- Keep the AI visually supportive, not dominant over lesson content.
- Keep starter prompts short and contextual.
- In compact course pages, AI prompt chips are generated from the current lesson context and timestamp. Do not use a fixed chip template when the lesson context changes; idle rail chips should rescan the current course context on a short interval and refresh from timestamp, active chapter, nearby concepts, playback state, and the next chapter.
- While media is playing, the compact AI rail may show `Watching with you...` with a restrained animated ellipsis. When media pauses, the rail may switch to the AI tab and change the status prompt to `Questions?`.
- The compact AI rail may expose a full-answer/expand action after an answer; that action should hand off the current question, answer, timestamp, and course context to the AI Chat Page instead of regenerating the answer.
- Compact discussion nested reply connectors use a subtle `0.5px` translucent stroke; in light mode use transparent black instead of white so reply depth remains visible over pale backgrounds.
- Hide starter prompt chips while the learner is typing; show them again when the field is cleared.
- Hide prompt chips during the send instant.
- Show follow-up chips after an answer and reuse the `aiQuestionPromptChip` Button kind.
- During playing states, bias AI copy and status toward the currently playing course content.
- For paused or browsing states, AI may answer broader learning questions but should guide the learner back toward useful course context.
- Hero prompt and header search share the same AI interaction states, but remain separate surface variants with their own density and layout.
- Prototype GPT API implementations must use the system prompt and structured response contract in [`ai-system-prompt.md`](./ai-system-prompt.md).
- Render `answerMarkdown` inside AI answer UI and render `contextTags`, `followUpChips`, and `courseRecommendationCards` through their dedicated UI elements.
- Handle long answers through the confirmed visual-height rule and optional full-screen action.
- Transcript-linked responses and generated study artifacts remain future patterns until confirmed.

### Prohibited Uses

- Do not let the rail replace the lesson as the main viewport focus.
- Do not invent chat paradigms not confirmed by the system.
- Do not reuse node `260:2775` to define non-AI page layout or non-AI components.
- Do not add regenerate as a v1 answer action.
- Do not parse chips, context tags, or course recommendations out of unstructured Markdown when using the GPT API prototype.

### Open Questions

- Dark variants for AI edge states beyond the confirmed core rail views and focused AI Chat Workspace references.
- Transcript-linked selected-context states.
- Specialized answer-card types for summaries, quizzes, key terms, career advice, and research applications.
- Detailed error taxonomy beyond the generic `error` and `refusal` handling.

## AIAnswerBlock

### Purpose

Render an AI response as a readable answer block inside an AI conversation surface.

### Evidence

- Figma node `260:2775`

### Structure

- Lucide `sparkle` identity marker
- collapsed reasoning panel or thought-duration line
- context metadata line
- answer body
- optional follow-up chips
- optional answer action button group

### States

- `thinking`
- `streaming`
- `answered`
- `refusal`
- `overlong`
- feedback selected: `none | thumbsUp | thumbsDown`

### Props

- `thoughtLabel`
- `contextTags`: `currentLesson`, `timestamp`, `courseTitle`
- `body`
- `followUpPrompts`
- `actions`
- `feedbackState`
- `isOverlong`
- `theme`

### Reuse Rules

- Treat this as an answer block, not a generic chat card.
- Use Lucide `sparkle` as the AI marker; do not detach the MOOCKY logo sparkle for this purpose.
- Use the confirmed `text.aiAnswer` reading color in light AI conversation surfaces.
- Use collapsed reasoning and thought-duration as an either-or treatment: provider reasoning shows `Reasoning · elapsed`; missing provider reasoning falls back to `Thought for elapsed`.
- Place context metadata as a second line below the duration/status treatment.
- Include `Current lesson`, `timestamp`, and `course title` as the confirmed v1 metadata set when context is available.
- Express personalization through wording rather than a persistent visual badge.
- Use the same answer-block structure for refusal responses; explain the refusal reason and guide the learner back toward useful course context.
- If the answer can be read with modest rail scrolling, keep it in the rail.
- If the answer is visually too tall for comfortable rail reading, expose a full-screen action.
- Determine overlong state by visual height, not by word count.

### Prohibited Uses

- Do not use this block as a general marketing card.
- Do not create specialized answer-card variants without confirmation.
- Do not add regenerate to the v1 action set.
- Do not show full-screen entry for every answer.

### Open Questions

- Exact visual-height threshold for `overlong`.
- Dark-mode treatment for all answer-block edge states.
- Future specialized answer card types.

## AIQuestionBubble

### Purpose

Render the learner's submitted question inside AI conversation surfaces.

### Structure

- right-aligned pill bubble
- question text

### States

- sent

### Props

- `text`
- `theme`

### Reuse Rules

- User questions are right-aligned.
- AI responses are left-aligned through `AIAnswerBlock`.
- Use `Geist Regular` at compact reading size, no larger than `20px`, and the confirmed light text color from node `260:2775`.
- Use `40px` as the minimum height, not a fixed height, so long submitted prompts can wrap without vertical compression.

### Prohibited Uses

- Do not reuse as a generic chat bubble outside AI surfaces.
- Do not use muted placeholder color for submitted user text.

### Open Questions

- Dark-mode submitted-question text color and surface treatment.

## AIThinkingIndicator

### Purpose

Show that AI is preparing or streaming a response without creating a heavy loading experience.

### Structure

- Lucide `sparkle`
- `Thinking...` status text
- live provider reasoning text or `Checking Context...`

### States

- thinking
- streaming

### Props

- `statusLabel`
- `theme`

### Reuse Rules

- Use the Lucide `sparkle`.
- Show `Thinking...` during the thinking state.
- Use the focused `32px` circular clipped glyph with a `13.337px` sparkle and `30px` glow.
- Follow the confirmed `1400ms` four-phase loop: `300ms` hold, `200ms` transition, `200ms` transition, `300ms` hold, `200ms` transition, `200ms` transition back.
- Keep the Thinking animation and `Thinking...` live status active through `finalizing`; do not render a separate `Finalizing answer...` line in the demo UI.
- On Answered, keep the same `32px` marker slot, replace the animated Thinking glyph with a plain static `13.337px` Lucide sparkle, and remove the glow/animated shell entirely.
- If the stream emits `answer_delta`, render the partial `answerMarkdown` body immediately with `aria-busy=true` while keeping tags, cards, follow-up chips, and answer actions hidden until the final envelope arrives.
- If the stream emits `cards_ready`, render the fixed course cards below the live answer body before follow-up chips and answer actions.
- If `answer_delta` made body text visible, do not replay the parsed typewriter after the final envelope; release any remaining post-answer affordances immediately with the final body. If no body text streamed, reveal `answerMarkdown` with the AI Chat typewriter timing and render cards only after that fallback reveal completes.
- Keep streaming visually restrained and reveal text progressively.

### Prohibited Uses

- Do not use the MOOCKY logo sparkle as the thinking marker.
- Do not introduce heavy spinner or full-panel loading treatments for normal thinking.

### Open Questions

- Exact animation duration, glow color, and scale range.

## AIAnswerActions

### Purpose

Provide compact answer-level actions after an AI response.

### Structure

- Button `panelIconGroup`
- Lucide action icons

### States

- default
- hover, inherited from Button behavior where confirmed
- feedback selected: `thumbsUp | thumbsDown`

### Props

- `actions`: `copy | save | thumbsUp | thumbsDown | fullScreen`
- `feedbackState`
- `theme`

### Reuse Rules

- Use the existing Button group component logic.
- Use Lucide icons for all actions.
- Confirmed v1 actions are copy, save, thumbs up, thumbs down, and full-screen when needed.
- Preserve the selected feedback state.
- Treat thumbs up and thumbs down as mutually exclusive.

### Prohibited Uses

- Do not include regenerate in v1.
- Do not use non-Lucide icons.

### Open Questions

- Exact icon choices for save and full-screen if multiple Lucide options fit.

## DiscussionThread

### Purpose

Show compact course discussion messages with nested replies, likes, timestamp attachments, and reply affordances.

### Structure

- comment avatar
- author/time metadata
- optional timestamp media card
- comment body
- like action
- compact reply action
- optional nested reply stack

### Reuse Rules

- Use for compact course discussion surfaces where seeded and session-only comments appear together.
- Seeded messages must form a coherent lesson conversation. Nested replies should answer, clarify, or extend their parent comment.
- Reply actions are default-transparent compact pills with `24px` minimum height, pill radius, Geist Regular `12px / 16px`, and muted text.
- Reply actions reveal only a subtle low-contrast backing and stronger text on hover/focus. Do not use accent fill, primary-action color, or icons for this reply affordance.
- Nested reply connectors use a quiet `0.5px` visual stroke and align with compact reply avatars.

### Prohibited Uses

- Do not use the global primary action button treatment for inline comment replies.
- Do not seed unrelated generic praise comments when the page is demonstrating course discussion.

## LessonMediaPanel

### Purpose

Present the active lesson media state within the learning shell.

### Structure

- media frame
- cover or live media
- playback controls
- auxiliary control cluster

### States

- paused / cover-led, confirmed in approved light and dark paused course frames
- playing / live-media, confirmed in approved light and dark playing course frames

### Props

- `mediaType`
- `coverAsset`
- `playbackState`
- `controls`
- `theme`

### Reuse Rules

- Use as the main lesson media surface in course pages.
- Switch from gradient-led to real media when the lesson becomes active.
- Preserve the lesson media as the main density anchor; avoid surrounding it with competing cards or redundant controls.
- A compact course page may show the media in a secondary left/right study layout only before first playback starts, while retaining playback identity and a floating play control.
- After first playback starts, paused course media should resume from the local bottom control bar instead of showing the floating pre-play control again.
- Course video implementations that embed YouTube may crop and edge-mask the iframe inside the local video shell so native YouTube chrome stays visually subordinate to MOOCKY controls.
- YouTube iframe implementations must keep the mounted iframe viewport at `16:9` and cover-size it inside the local shell rather than stretching it to the shell ratio.
- Paused YouTube native chrome may be hidden with non-interactive local masks; after first playback, do not swap back to a static placeholder or floating play overlay.
- Play/pause controls should use one activation event and may compare local state with the real YouTube player state before choosing play or pause.
- The first-play handoff should animate transform and size with synchronized start timing: the gradient banner compresses upward and the video immediately moves from the lower-right compact position into the large upper media position. After playback starts, the course title/details are scoped to the Course Detail tab so Discussion can hide them. Later pauses keep the large stacked layout.

### Prohibited Uses

- Do not use decorative gradients as a replacement for real active media.
- Do not invent extra control groups not grounded in the design system.

### Open Questions

- Full playback state matrix and advanced accessibility behaviors.

## FooterNewsletter

### Purpose

Provide a large brand-touchpoint footer with newsletter capture and legal/social links.

### Structure

- editorial heading
- supporting copy
- email field
- subscribe button
- legal links
- social handles

### States

- default light
- dark variant, confirmed in approved landing and course dark frames

### Props

- `headline`
- `supportingCopy`
- `emailPlaceholder`
- `legalLinks`
- `socialLinks`
- `theme`

### Reuse Rules

- Use on marketing and approved learning surfaces where a brand-touchpoint footer is appropriate.
- Footer components must not opt into `ViewportReveal`.
- Preserve the strict editorial heading treatment: first word in `Cormorant Infant Medium Italic` with `-4px`, remaining words in `Gayathri Thin` with `-1px`, optically size-matched.
- Do not use the editorial heading treatment below `42px`; switch to the appropriate small-title rule.

### Prohibited Uses

- Do not force this footer into dense productivity workspaces.
- Do not reduce it to a generic utility footer without explicit design confirmation.
- Do not add viewport reveal, staggered entrance, or scroll-in fade to footer components.

### Open Questions

## CompactProductFooter

### Purpose

End dense learning workspaces without adding a large marketing/newsletter module.

### Structure

- small brand lockup
- compact legal/help links
- compact social handles or product links
- implementation uses `app/components/CompactProductFooter.tsx` with `app/components/CompactProductFooter.module.css`

### States

- light
- dark

### Reuse Rules

- Use on compact course-detail pages and dense product learning workspaces.
- Keep the footer stable and out of viewport reveal.
- Do not use display typography, newsletter fields, large CTA panels, or decorative imagery.

### Prohibited Uses

- Do not replace the landing or marketing footer when the page needs a brand-touchpoint module.

- Future lightweight product-footer pattern for denser internal product areas.
