# Lumen Atlas Decisions v0.1

This file records implementation decisions made while turning the landing page into the design-system seed page.

## 2026-04-26: Treat Landing as Seed Page

Decision: The landing page is no longer just a prototype page. It is the v0.1 seed page for Lumen Atlas.

Implications:

- Every UI change must be classified before implementation.
- Reusable styles and structures must be promoted into the design system instead of living only in page CSS.
- After each UI tuning round, update:
  - `design-system/tokens.json`
  - `design-system/components.md`
  - `design-system/layout-rules.md`
  - `design-system/interaction-rules.md`
  - `design-system/decisions.md`
- Ambiguous patterns go to `design-system/candidates.md`.

## 2026-04-26: Display Pair Optical Alignment

Classification: `reusable component` + `design token`

Decision: The DisplayTitle first word receives a shared optical correction of `translateY(-0.18em)`.

Reason: Browser layout treats the Cormorant and Gayathri spans as separate boxes. The fonts have different vertical metrics, so mathematical center alignment makes the Cormorant first word look too low. The correction belongs to the DisplayTitle component and token set, not to a page-specific title.

Affected components:

- Hero DisplayTitle
- FAQ DisplayTitle
- Footer DisplayTitle

Implementation update: DisplayTitle is now a size-adjustable reusable component. Named sizes remain preferred, custom sizing is clamped to keep every segment at or above `42px`, and the confirmed ratio is encoded in component CSS variables: remainder size `0.85` of first-word size, first tracking about `-0.05em`, remainder tracking about `-0.015em`, inline gap minimum `10px` with optional upward scaling around `0.125em`, and first-word optical offset `-0.18em`.

## 2026-04-26: Surface Role Split

Classification: `design token`

Decision: Split the former broad translucent/frost usage into `surface.footer` and `surface.mediaOverlay`.

Reason: The footer surface and media foreground capsules share a similar alpha value in the seed page, but they are different semantic roles and may diverge in future pages. The implementation keeps a temporary legacy alias for unclassified AI rail surfaces until that pattern is audited separately.

## 2026-04-26: Icon Source Rule

Classification: `reusable component` + `design token`

Decision: All action and utility icons must come from Lucide. CSS-only icons, text glyph icons, ad hoc SVG paths, and non-Lucide image assets are not allowed unless explicitly promoted as brand marks.

Reason: The seed page had CSS-drawn plus bars in the Chatbox import trigger. That was a design-system violation, so the trigger has been migrated to Lucide `Plus` with `16px` size and `1.5px` stroke.

## 2026-04-26: Default Border Stroke

Classification: `design token`

Decision: Default component stroke width is `0.5px`. Use `1px` only when a confirmed component or contrast need requires it.

Reason: The design language should feel softer and more precise than default browser `1px` borders. Heavier strokes must be documented as component-specific exceptions.

Implementation update: Existing ordinary component outlines in the seed page now use the shared `--stroke-default` token. The avatar overlap ring remains a documented `3px` component-specific exception.

## 2026-04-26: Landing Section Rhythm

Classification: `layout rule`

Decision: The default landing section gap is `100px`; FAQ to footer is a confirmed `12px` exception.

Reason: The Figma landing reference uses generous discovery spacing while keeping the footer visually attached to the FAQ ending.

## 2026-04-26: Explore Domain Hover

Classification: `interaction/state rule`

Decision: Superseded by the 2026-04-27 Category Card Hover And Icon Pipeline decision. DomainTile hover now swaps to the approved gradient image surface.

Reason: The newer approved reference changed the category-card interaction to a gradient hover surface with text contrast treatment.

## 2026-04-26: Playwright Acceptance

Classification: `interaction/state rule` + implementation governance

Decision: UI updates must be checked with Playwright at `1440px`, `1024px`, and `390px` when the local app can be built and opened.

Reason: The seed page is used to validate reusable layout and component rules across desktop and narrow responsive states.

Superseded acceptance detail: the 2026-04-27 Dual-Mode Reference Acceptance decision requires these captures and assertions in both light and dark mode.

## 2026-04-26: Auxiliary Action Button Component

Classification: `reusable component` + `design token`

Decision: `Button/AuxiliaryAction` and `Button/PrimaryAction` are implemented through the reusable React `Button` component, with the trailing Lucide `arrow-up-right` owned by the component.

Reason: The seed page had repeated auxiliary action buttons using page-level image arrows. Those arrows could become invisible on light surfaces because the image asset did not inherit the Button text color. The reusable component now renders the fixed action icon with `currentColor`, preserving the approved Button visual while keeping action-icon ownership in the Button family.

Affected buttons:

- Header `Log In`
- Social proof `Explore more`
- Section heading `More` actions
- Featured course `Register Now`

Follow-up implementation note: legacy `arrow-up-right*.svg` icon names are also routed through the inline Lucide icon in the prototype `Icon` helper. This prevents unmigrated or cached action instances from rendering white image-asset arrows on white Button surfaces.

## 2026-04-26: Reveal Hydration Fallback

Classification: `interaction/state rule`

Status: Superseded by the confirmed 2026-04-27 staggered reveal rule.

Decision: Section reveal content is visible by default. The runtime adds `reveal-pending` only to sections below the initial viewport, while first-viewport sections are immediately marked visible.

Reason: Local preview and browser automation can capture the page before IntersectionObserver applies `is-visible`. If the CSS hides all reveal sections by default, the prototype can appear blank or nearly invisible even though the app is healthy.

## 2026-04-27: Staggered Section Reveal

Classification: `interaction/state rule` + `design token`

Decision: Promote staggered viewport reveal to a confirmed interaction rule. Reveal items are visible by default, transition from `opacity 0 -> 1` and `translateY(14px) -> 0` only while marked `reveal-pending`, and same-batch reveal items enter top-to-bottom with a `160ms` stagger capped at `320ms`.

Confirmed behavior:

- Runtime evaluates first-viewport reveal items immediately on mount, so initial content reveals without waiting for user scroll.
- The landing hero copy and Chatbox/prompt group are separate reveal items.
- Section-level components remain the default reveal boundary; split children only when they carry separate reading moments.
- Footer is excluded from viewport reveal on every interface.
- Reduced-motion users bypass translate movement and stagger delay, with content immediately visible.

Reason: The confirmed `160ms` stagger made the entrance motion perceptible without feeling delayed. Splitting the hero copy and Chatbox creates a clearer first-viewport reading sequence. Footer reveal feels abrupt because the footer is a page-ending anchor rather than a browsing content module.

## 2026-04-28: Default Reveal Runtime For New Pages

Classification: `interaction/state rule`

Decision: New pages and prototypes must reuse the shared `ViewportRevealRuntime` and apply `reveal-on-view` to browsed section-level components by default when created, previewed, or deployed. Page-local keyframes or CSS overrides must not replace the shared `.reveal-on-view` opacity, translate, transition, or stagger behavior. Footer components remain excluded.

Reason: The redeem preview had section-level `reveal-on-view` classes but a local preview animation overrode the confirmed staggered runtime, making the page feel static and inconsistent with Landing. Making the runtime a default page-assembly requirement keeps new surfaces aligned without needing a separate reminder.

## 2026-04-28: Reveal History Restore Safety

Classification: `interaction/state rule`

Decision: The shared reveal runtime must restore all owned reveal items to visible during `pagehide` and persisted `pageshow` events. The base `.reveal-on-view` class remains visible; only `reveal-pending` may hide content before viewport entry.

Reason: Browser Back/Forward cache can restore a page after React has reset imperative classes to the authored `reveal-on-view` class. If the base class itself is transparent, returning from a course detail page can leave landing sections invisible even though navigation succeeded.

## 2026-04-27: Figma MCP And Screenshot Double Evidence

Classification: implementation governance

Decision: Future Figma-backed modifications, component parity work, and new page creation must use a double-evidence workflow. MCP/Inspect is required before implementation for exact specs, and screenshots/Playwright are required after implementation for visual acceptance.

Required evidence:

- MCP/Inspect: exact node or variant, Auto Layout padding and gap, dimensions, constraints, typography, fills, variables, component states, assets, and motion values when available.
- Screenshot/Playwright: final composition, spacing, font size, color, alignment, radius, shadow, interaction state, responsive behavior, and Light/Dark Mode checks when themed.

Reason: Screenshot-only implementation can look close while missing spacing-sensitive values, as shown by the `PopularCourseStrip` capsule padding drift. MCP/Inspect anchors exact structure; screenshots catch final rendering and browser behavior.

Implementation update:

- `docs/design-system.md` records the double-evidence rule as normative evidence handling.
- `AGENTS.md` adds the required execution workflow for future Codex work.
- `docs/prototype-implementation-notes.md` records the practical implementation guidance.

## 2026-04-26: Text Primitive

Classification: `primitive component` + `design token`

Decision: Establish `Text` as the reusable typography primitive. It controls font family, size, weight, line height, letter spacing, and semantic tone, while parent components own layout.

Confirmed rules:

- Ordinary body text uses `Geist Regular`.
- Body sizes are `14px / 20px` and `12px / 16px`.
- `16px / 20px` Geist Regular is reserved for section labels or documented special copy.
- Geist defaults to `400`; heavier weights require a specific emphasis or state reason.
- `DM Serif Text` may be used by Text for module/card/panel title roles and small serif captions.
- `DisplayTitle` is not part of Text because it owns the two-font display pair and optical alignment.

Reason: The seed page has repeated typography roles across landing, FAQ, cards, footer, and AI surfaces. Locking these as Text variants prevents page-level typography drift while keeping layout responsibilities in parent components.

## 2026-04-26: Recommended Course Card Hover

Classification: `interaction/state rule` + `reusable component`

Decision: Tune the landing `RecommendationCard` to match the user-approved Figma component/prototype references `348:8253` and `348:8271`.

Confirmed behavior:

- Cards are collapsed by default; the first card is no longer pre-expanded.
- The collapsed card keeps the image-first composition with a bottom pill. The reference minimum is `264px x 60px`, with `19px` bottom offset.
- The collapsed pill may grow wider for longer real titles so text remains intact while preserving the Figma minimum for `Nature Architecture`.
- Hover/focus expands the lower surface to a `280px` bottom panel over `160ms ease-out`.
- The animated collapsed pill resolves its radius to `30px`, the half-height equivalent of the `60px` pill, so browser interpolation does not create an oversized oval.
- The implementation keeps title, content, metadata, and action button in stable internal slots; hover does not swap from row layout to column layout.
- The title crossfades/translates from `Geist 20px` to `DM Serif Text 24px`.
- Supporting copy, provider, rating, and review metadata fade in with slight upward movement using a `32ms` reveal delay inside the `160ms` interaction.
- The Lucide `arrow-up-right` action rotates from a rightward collapsed posture to an up-right expanded posture.

Reason: The prior implementation felt like a hard transition, partly because hover changed the internal layout mode immediately and partly because an unbounded pill radius ballooned during interpolation. The updated implementation follows the Figma smart-animation parameters and keeps the landing section usable as the seed state.

Reuse boundary: This card is reusable inside landing/discovery recommendation modules. Reuse outside that scope remains open until confirmed by future pages.

## 2026-04-26: Layout Rules Scope

Classification: `layout rule`

Decision: `design-system/layout-rules.md` records page structure and responsive assembly, not only visual measurements.

Reason: Future pages need reusable shell, section, grid, rail, and responsive handoff rules so implementation can scale through known structures instead of recreating one-off page layout in CSS.

Confirmed scope:

- Layout rules describe shells, regions, section rhythm, token references, responsive behavior, and open layout questions.
- Component specs describe component boundaries and props.
- Tokens provide machine-readable dimensions and spacing.
- Typography primitives and components do not own page placement.

## 2026-04-27: Dark Primary Text Token

Classification: `design token`

Decision: Update the dark-mode counterpart to light `#3E332E` from `#F2E1CA` to the lower-saturation warm light `#EDE8E1`.

Reason: The dark primary text color should keep the warm Lumen Atlas relationship to the light primary brown while reducing saturation for calmer dark-mode contrast across headings, primary action text, and AI reading text that currently inherits the dark primary role.

Implementation scope:

- `docs/design-system.md` defines the normative role.
- `tokens.json` and `design-system/tokens.json` encode the machine-readable token.
- `app/globals.css` applies the runtime CSS variable `--text-primary-dark`.

## 2026-04-28: Compact Course Default Paused Layout

Classification: `one-off page-specific style` + focused Figma evidence

Decision: The `/course` default paused state follows user-approved node `685:13043`: the main course column starts with a full-width `810px x 200px` brand gradient banner, then shifts to an editorial split with the `Neural Architecture` title and lesson description on the left and a compact `400:240` real video component on the right.

Reason: The prior implementation used the full video-player layout while the page was paused, which made the default state read like a playback surface with a paused button. The Figma reference treats the initial pause state as a compact course-detail overview; the full controls return only after playback starts.

Implementation note: The real YouTube player remains mounted in the media component; while paused, the control bar is hidden and the only foreground control is `Button/floatingResume` from focused node `260:2199`.

## 2026-04-27: Button Icon CurrentColor Pipeline

Classification: `reusable component` + `interaction/state rule` + `design token`

Decision: Button icons must enter the component as controlled Lucide icon names and render through `LumenIcon`. The Button component no longer accepts arbitrary icon nodes, image assets, or page-level SVG icons. All Button icons use `currentColor`, `16px`, and `1.5px` stroke unless a documented Button kind defines a special case.

Reason: The previous implementation path allowed raw icon nodes and page-level image assets to bypass the Button color contract. That made some icons stay fixed when the surrounding Button text changed across light mode, dark mode, hover, or focus-visible states.

Implementation scope:

- `app/components/LumenIcon.tsx` centralizes supported Lucide icons and normalizes legacy `.svg` names during migration.
- `app/components/Button.tsx` owns Button icon rendering and the fixed `arrow-up-right` action icon.
- `app/globals.css` explicitly keeps Button icon color and stroke tied to `currentColor`.
- `tests/e2e/landing.spec.ts` checks that Button icons are inline SVG, not image assets, and that their computed color equals the owning control color before and after dark-mode toggle.

## 2026-04-27: Chatbox Send Foreground Contract

Classification: `interaction/state rule`

Decision: Chatbox and AI Prompt Field send actions keep the Lucide arrow on `currentColor`, but the owning circular send button must explicitly set the semantic surface contrast foreground: white on light accent fills and black on dark accent fills.

Reason: Migrating the send arrow from a fixed image asset to `currentColor` correctly made it inherit from the button. The send button previously set only its background, so in light mode it inherited the page primary text color and turned the arrow dark. The correct fix is to set the send button foreground, not to give the icon a separate hardcoded color.

## 2026-04-28: Global Tag Component

Classification: `reusable component` + `design token`

Decision: Promote the Figma `Label` component from node `762:15058` as the global `Tag` component. The component supports `default`, `compact`, and `line` densities, controlled Lucide icons, and alpha-based `success`, `info`, `accent`, and `neutral` tones.

Reason: Public course detail and future metadata surfaces need a repeatable label system that does not borrow one-off structure-diagram pills or page-local colors. The Figma component confirms density, padding, gap, typography, transparent color relationships, and line-mode behavior, making it safe to promote as a shared component.

Implementation scope:

- `docs/design-system.md` records the normative Tag rules and evidence boundary.
- `docs/component-specs.md`, `tokens.json`, `design-system/tokens.json`, and `design-system/components.md` define the implementation companion and machine-readable values.
- `app/components/Tag.tsx` and `.lumen-tag*` CSS implement the reusable component.
- The isolated public course detail prototype now uses `Tag` for the hero category label instead of a page-local solid blue pill.

## 2026-04-27: Chatbox Empty Send State

Classification: `interaction/state rule`

Decision: Landing Chatbox send is disabled while the trimmed input is empty. The disabled empty state uses the same lighter neutral fill as `cardGuideAction` hover, keeps the semantic foreground/icon contrast, and does not route to `/ai`.

Reason: The previous empty state looked active and could submit the placeholder-style prompt. The new state makes the interaction explicit: no typed content means no send action, while ready-to-send returns to the normal neutral default with hover feedback.

Follow-up: Chatbox also submits from the textarea with `Enter` once trimmed input exists. `Shift+Enter` remains reserved for multiline composition.

## 2026-04-27: Neutral Action Button System

Classification: `reusable component` + `design token` + `interaction/state rule`

Decision: Rename the temporary Figma `Button/New` kind to `Button/NeutralAction` in the design system. Use `primaryAction` as the single brown filled action per interface surface, and use `neutralAction` for repeated secondary filled actions such as `More`, `Explore more`, `Register Now`, and newsletter subscribe.

Reason: Repeating brown action buttons made the landing page feel more ornamental and visually noisy. The neutral filled action keeps repeated controls legible and more tool-like while reserving the brown accent for one clear primary action.

Implementation update:

- `app/components/Button.tsx` adds `neutralAction` and `cardGuideAction`.
- `neutralAction` default fill is `rgba(0,5,9,0.89)` and hover fill is `rgba(0,7,20,0.62)`.
- `cardGuideAction` now uses the same neutral fill behavior with fixed Lucide `arrow-right`.
- Landing repeated action buttons and newsletter subscribe use the neutral treatment.

## 2026-04-27: Category Card Hover And Icon Pipeline

Classification: `reusable component` + `design token` + `interaction/state rule`

Decision: Update the landing `DomainTile` to follow the new `Button/CategoryCard` behavior from node `419:5349`.

Confirmed behavior:

- Cards show description text by default.
- Padding is equal on all sides at `28px`.
- Hover swaps the quiet surface to a unique gradient image asset selected from node `226:2326`; visible cards do not reuse the same hover asset.
- Hover background image layer uses `12px` blur after prototype readability tuning.
- Hover title and description use `rgba(255,255,255,0.9)` with text shadow `0px 0px 4px rgba(0,0,0,0.2)`.
- Category icons render as inline Lucide vectors through `LumenIcon` in a square intrinsic box.

Reason: The old DomainTile hover only recolored text and icons, which did not match the updated category-card interaction. The icon path also allowed mask/image insertion that could stretch or blur icons. Inline Lucide rendering keeps icon geometry crisp and color inherited from the component state.

## 2026-04-27: Course Card Color Components

Classification: `reusable component` + `design token` + `interaction/state rule`

Decision: Extract the landing `Most Popular` course strips and `Recommended For You` cards into reusable card components, with theme-specific color tokens from node `419:5349`.

Confirmed behavior:

- `PopularCourseStrip` uses `rgba(255,255,255,0.8)` / `#1C2024` in light mode and `rgba(29,29,33,0.78)` / `#EDEEF0` in dark mode.
- `RecommendedCourseCard` uses a white panel with `#3E332E` title/meta and `#60646C` body in light mode.
- `RecommendedCourseCard` uses a black panel with `#EDE8E1` title/meta and `#B0B4BA` body in dark mode.
- `PopularCourseStrip` foreground capsule uses `60px` height, `20px` left padding, `16px` top/right/bottom padding, and `16px` gap from the Figma Auto Layout reference.
- Compact card actions use theme-aware `neutralAction` fills and hover in both modes.
- Right-column `PopularCourseStrip` and `RecommendedCourseCard` use the full card as the accessible link target; compact circular actions are visual affordances inside the link. The left featured Most Popular card remains excluded from this rule.
- Compact circular action hover is scoped to the affordance itself, not the whole card, so broad card hover does not overstate the action control.

Reason: The card implementations still depended on generic surface and accent tokens, so the landing reference color changes were not reusable and dark mode produced black controls on dark surfaces.

Follow-up: The first reusable pass matched the strip visually from screenshots but left the capsule padding too tight. Auto Layout values must be checked from Figma or supplied inspection screenshots for spacing-sensitive component details.

Implementation update:

- `app/components/CourseCards.tsx` owns `PopularCourseStrip` and `RecommendedCourseCard`.
- `app/prototype-components.tsx` consumes those components instead of page-local card markup.
- `app/globals.css`, `tokens.json`, and `design-system/tokens.json` define the theme-specific card and action variables.

## 2026-04-27: Dual-Mode Reference Acceptance

Classification: `interaction/state rule` + implementation governance

Decision: Prototype UI acceptance must compare both light and dark modes against the approved reference. For the landing seed page, Playwright must assert reference colors and hover states for neutral actions, course strips, category cards, recommendation cards, and key icons before final output.

Reason: A light-only acceptance pass missed dark-mode controls and card surfaces that stayed black or lacked hover feedback. Dual-mode checks prevent future theme drift from hiding in the same components.

Implementation update:

- `tests/e2e/landing.spec.ts` now captures `1440px`, `1024px`, and `390px` screenshots for both light and dark mode.
- The same test asserts action default/hover colors, course-strip colors, category-card default/hover colors, and recommendation-card expanded colors in both modes.

## 2026-04-27: FAQ Chevron Lucide Size Exception

Classification: `reusable component`

Decision: FAQAccordion indicators use Lucide `chevron-down` with a `24px` viewport and `1.5px` stroke. The icon still inherits `currentColor`.

Reason: The old Figma FAQ chevron asset had a `12px × 7.4px` filled viewBox. After moving the control to Lucide, keeping the CSS box at `12px × 7.4px` compressed the Lucide 24×24 viewport and made the drawn chevron visually too small. A `24px` Lucide viewport preserves a comparable drawn footprint without returning to a non-Lucide image asset.

## 2026-04-27: Canonical Logo Vector

Classification: `reusable component` + `design token`

Decision: Promote the Reference `MOOCKY` header mark from live text plus a separate sparkle icon to the canonical `LogoLockup` vector. The approved source is node `429:5935`, exported as SVG outlines with a `97px × 32px` viewBox.

Reason: Browser text rendering and font availability can shift the wordmark away from the Reference. A vector outline locks the wordmark shape and sparkle placement while allowing implementation to recolor the mark through `currentColor` for dark-theme contrast.

Implementation update:

- `app/components/LogoMark.tsx` renders the inline SVG for React usage.
- `public/assets/figma/moocky-logo.svg` keeps the static exported asset.
- Header `LogoLockup` uses the fixed `97px × 32px` frame and no longer rebuilds the mark from text plus `sparkle.svg`.

## 2026-04-28: Featured Popular Pill Overlay Alignment

Classification: `one-off page-specific style` + `reusable component candidate`

Decision: The landing `Most Popular` featured card foreground pill reuses the existing course-strip translucent surface and `8px` backdrop blur strategy while `PopularFeatureCard` remains a candidate, not a confirmed reusable component.

Reason: The pill sits directly over complex course imagery like the right-column `PopularCourseStrip` capsules. Reusing the existing media-foreground surface keeps the landing section visually coherent without adding a new token, radius, shadow, or component rule.

Implementation update:

- `app/globals.css` maps `.featured-popular-pill` to `--course-strip-surface`, `--course-strip-text`, and `backdrop-filter: blur(8px)`.

## 2026-04-28: Navi Bar Login Demo State

Classification: `reusable component` + `interaction/state rule` + `design token`

Decision: Implement focused Figma node `429:6308` as a prototype Navi Bar state switch. The guest state keeps the existing landing header cluster, while clicking `Log In` swaps the right side to the authenticated preview with a `300px` header search field, grouped utility icons, and circular profile action.

Reason: The user requested a simple demo interaction without a real login flow. Treating this as a demo state keeps the production `MarketingHeader` and `LearningHeader` ownership model intact while still matching the uploaded Navi Bar component.

Implementation update:

- `app/prototype-components.tsx` stores the local demo auth state inside `MarketingHeader`.
- `app/components/LumenIcon.tsx` adds the needed Lucide `search`, `bell`, `coins`, and `circle-user` icons.
- `app/globals.css` adds header search and grouped utility control styles using seed tokens.
- `app/components/AuthenticatedHeaderControls.tsx` routes the `coins` utility to `/redeem` for the connected reward redemption surface.

## 2026-04-28: Redeem Route Promotion

Classification: `layout rule` + `interaction/state rule`

Decision: Promote the reward redemption surface from `/prototypes/redeem-preview` to the product route `/redeem`. The authenticated header coins utility must point to `/redeem`; the legacy prototype URL may redirect to `/redeem` through routing config but must not host a duplicate page implementation under `app/prototypes/*`.

Reason: The page is now formally enabled in the main prototype navigation. Keeping an enabled page under `/prototypes` blurs exploration and product surfaces, and makes future deployment routing harder to reason about.

## 2026-04-28: Header Search Active Input

Classification: `reusable component` + `interaction/state rule`

Decision: Promote the authenticated preview `HeaderSearchField` from an inert search-shaped button to a real activatable input. Clicking or focusing the field activates it; entering non-empty text and pressing `Enter` routes to `/ai?question={encodedInput}`.

Reason: The Navi Bar demo should show the authenticated search affordance as an actual learner-intent entry, not a static placeholder. On narrow previews, the field expands from the `32px` search icon and temporarily hides utility/profile controls so typing remains usable.

Implementation update:

- `app/prototype-components.tsx` adds the stateful `HeaderSearchField`.
- `app/globals.css` adds active/focused/filled search styles and narrow active expansion.

## 2026-04-28: AI Chat Workspace With Real Reasoning

Classification: `reusable component` + `layout rule` + `interaction/state rule`

Decision: Implement `/ai` as the AI Chat Workspace from user-approved Figma node `375:3335`, with real Kimi `reasoning_content` streamed into a separate reasoning panel during Thinking.

Confirmed behavior:

- Sidebar expands to `350px` and collapses to `60px`; collapsed controls stack vertically.
- The main conversation column is `800px` and centered in the remaining workspace.
- Focused dark mode follows AI Chat Page references `375:4694`, `375:4875`, `375:4776`, `375:5204`, and `513:8444`.
- New Chat, Personalized Suggestion, and Career Path create typed conversations with mode-specific instructions.
- Conversation records persist only in versioned `sessionStorage` during the active browser session; prototype first use does not restore old local records.
- Thinking uses the Figma-backed sparkle/glow animation from `457:7130` and `491:7957`.
- Provider reasoning is visible while Thinking and collapses after the final answer; no fake reasoning is generated when provider reasoning is missing.
- Follow-up chips submit immediately as the next message.
- Personalized Suggestion is the fixed course-card output mode. New Chat and Career Path keep card output disabled in the current demo.

Reason: The AI Chat Page is a new AI-first workspace rather than a disposable prototype state. Real provider reasoning needs a dedicated surface so transparency does not contaminate final answer content or the structured response contract.

Implementation update:

- `app/ai/AiChatPage.tsx` owns the workspace UI and local persistence.
- `app/api/moocky-ai/stream/route.ts` streams `reasoning_delta`, `content_delta`, `done`, and `error` SSE events.
- `docs/ai-system-prompt.md` now requires `courseRecommendationCards` and keeps provider reasoning outside `answerMarkdown`.

## 2026-04-28: Prototype Chat Records Are Session-Only

Classification: `interaction/state rule`

Decision: During the prototype phase, AI Chat conversation records are stored in `sessionStorage` only and the default workspace starts with an empty record list.

Reason: Persistent local records made a first-time product visit look like a returning-user state. Session-only records keep the sidebar useful during one browser session without carrying old prototype conversations into the next visit.

## 2026-04-28: AI Chat Default Layout Reference Update

Classification: `reusable component` + `layout rule` + `interaction/state rule`

Decision: Promote user-approved Figma node `559:8583` as the current Default and Default/Dark reference for the AI Chat Workspace layout, while retaining `375:3335` for additional AI states.

## 2026-04-28: AI Chat Record Row Density

Classification: `reusable component`

Decision: Align AI Chat sidebar conversation records to the user-provided Figma Inspect screenshot and latest product correction: compact fill-width rows with `32px` height, `12px` padding, `12px` internal gap, `12px` radius, explicit Geist `14px / 16px`, transparent default fill, and the AI Chat active surface for hover/current.

Reason: The previous record row inherited generic sidebar list density and read more like a chip/control stack than the Figma record list item.

## 2026-04-28: AI Chat Record Mode Marker Tone

Classification: `reusable component` + `design token`

Decision: Set the AI Chat sidebar record special-mode marker to solid black with light-mode `0.27` opacity applied to the whole SVG icon.

Reason: The previous marker inherited the main AI text color and felt like a primary action beside the record title. Moving 27% from stroke color alpha to element opacity keeps the marker secondary while avoiding darker overlap artifacts where Lucide strokes cross.

## 2026-04-28: AI Chat Mode Icon Hover Backing

Classification: `reusable component`

Decision: Match the focused AI Chat Sidebar Figma reference for the three conversation mode buttons: the row itself highlights on hover/focus/current, and the `28px` icon slot gains a circular backing (`#fff` in light mode, `#000` in dark mode) while the Lucide glyph remains `16px / 1.5px`.

Reason: The previous implementation only changed the row background, leaving the icon as a bare glyph. The Figma hover reference includes a distinct circular support behind the icon.

## 2026-04-28: AI Chat Compact Sidebar Collapse

Classification: `reusable component` + `interaction/state rule`

Decision: Update the AI Chat Sidebar collapse state to match user-approved focused Figma node `575:10098`: expanded remains `350px` wide and full workspace height; collapsed becomes a `60px x 100px` compact rail containing only the top-control stack. The internal collapsed stack is `36px x 76px` with `2px` padding and `8px` gap. Collapse/expand transitions width, flex-basis, height, and padding together while the lower sidebar content fades and clips away.

Reason: The previous collapse kept a full-height `60px` rail, which did not match the focused reference and made the animation feel like a hard layout snap instead of a natural tightening.

Confirmed behavior:

- Sidebar remains `350px` expanded with `12px` internal padding and a `36px` top control row.
- Sidebar top controls are `32px` circular Lucide icon controls; the default page keeps a visible back control and uses panel-style collapse/expand affordances.
- Default mode icons follow the reference with the user-corrected Personalized Suggestion icon: `badge-plus` for New Chat, `chess-pawn` for Personalized Suggestion, and `road` for Career Path.
- Mode icon alignment uses a `28px` slot with the Lucide glyph kept at the default `16px / 1.5px` visual size.
- The main body and Chatbox were originally confirmed at `800px` wide in the desktop Figma layout.

Reason: The new Figma frame supersedes earlier default-layout assumptions with a clearer light/dark default reference and tighter Sidebar control treatment.

## 2026-04-28: AI Chat Main Body Width Trial

Classification: `layout rule`

Decision: Trial a narrower AI Chat main body at `720px` for the desktop prototype. The bottom AI composer follows the same width through the shared AI Chat main-width token.

Reason: The `800px` Figma reference felt too wide in browser review. `720px` is a reversible prototype tuning value intended to evaluate reading rhythm and composer scale before promoting it as final parity guidance.

## 2026-04-28: AI Chat Thinking Focused Refinement

Classification: `interaction/state rule`

Decision: Treat user-approved Figma node `598:10430` and the supplied recordings as the focused Thinking reference. Thinking now uses the `32px` circular clipped glyph with a `13.337px` sparkle, a `30px` radial glow, and the confirmed `1400ms` four-phase loop. Live reasoning is shown inline beneath `Thinking...`; after answering, provider reasoning returns to the collapsible panel.

Reason: The previous revision kept the glyph circular but the animation phase mapping no longer matched the original recording, and a fixed `40px` submitted-question bubble could compress longer prompts. The focused Thinking reference clarifies the status typography, live reasoning density, and stable bubble behavior while preserving the current `720px` main body width trial.

## 2026-04-28: AI Chat Answer Metadata Stack

Classification: `interaction/state rule`

Decision: Render completed answer metadata rows inside a dedicated answer metadata stack with explicit `6px` gap.

Reason: Keeping the collapsed reasoning panel and thought-duration line as adjacent margin-dependent blocks made the completion transition visually fragile. The explicit stack preserves the compact Figma-like density while preventing the two status rows from appearing overlapped.

## 2026-04-28: AI Chat Answer Metadata Either-Or

Classification: `interaction/state rule`

Decision: Completed answers must show a single duration/status treatment. If provider reasoning exists, render the collapsed `Reasoning · elapsed` panel; if provider reasoning is absent, render the `Thought for elapsed` fallback line. Do not render both for the same answer.

Reason: The previous stack rule fixed vertical overlap but still allowed duplicate duration labels when real reasoning was present. The either-or rule preserves transparency for Kimi reasoning while keeping no-reasoning providers from looking broken.

## 2026-04-28: AI Chat Answered Static Icon

Classification: `interaction/state rule`

Decision: In the Answered state, keep the same `32px` marker slot as Thinking, but replace the animated glyph with a static `13.337px` Lucide sparkle matching the Thinking animation's visible star size. The completed answer must not retain the radial glow, animated shell, or any running animation from the Thinking state.

Reason: The completed marker should settle without a visible size jump. Separating the DOM for active and completed states prevents residual CSS animation from continuing after reasoning finishes, while matching the visible glyph size makes the transition feel continuous.

## 2026-04-28: AI Chat Finalizing Keeps Thinking Motion

Classification: `interaction/state rule`

Decision: Keep the Thinking marker animation and `Thinking...` live status active during `finalizing`; switch to the static Answered sparkle only after the final answer response is ready to render. Do not show a separate `Finalizing answer...` row in the demo UI.

Reason: `finalizing` is still part of the waiting-for-answer moment. A separate finalizing label lasted too long in demos and made the state change feel noisy, while the unified Thinking surface keeps the wait understandable.

## 2026-04-28: AI Chat Answer Typewriter Reveal

Classification: `interaction/state rule`

Decision: Reveal `answerMarkdown` with a parsed-text typewriter effect after the structured answer response is available. The animation uses an `8ms` tick and caps long answers around `3200ms`; reduced-motion users receive the full answer immediately.

Reason: The API returns a structured JSON envelope, so the UI should own the perceived answer release without exposing raw Markdown syntax or contaminating the response contract. A restrained typewriter makes demos feel more alive while keeping the final answer readable.

## 2026-04-28: AI Chat Mixed Text And Card Sequencing

Classification: `interaction/state rule`

Decision: In AI Chat answers that include both `answerMarkdown` and `courseRecommendationCards`, render the cards and post-answer affordances only after the parsed-text typewriter reveal completes. Existing loaded answers and reduced-motion users may see the complete answer stack immediately. The card strip enters with the existing `160ms ease-out` motion.

Reason: Course cards are visually heavier than inline answer text. Deferring them until the written explanation has finished prevents the cards from popping in mid-sentence or shifting follow-up controls during the main reveal.

## 2026-04-28: AI Chat Personalized Card Mode

Classification: `interaction/state rule` + `reusable component`

Decision: Disable course recommendation cards for New Chat and Career Path in the current AI Chat demo. Personalized Suggestion normal answers are the fixed card-output mode and always render four cards: Nature Architecture plus three additional course cards. The card strip is a horizontal carousel; browse controls appear on card-area hover/focus and use the focused Figma `260:2199` floating style with directional arrow icons.

Reason: Cards were appearing too frequently in general chat. Constraining them to Personalized Suggestion makes the mode distinction clearer, while the carousel supports the larger four-card set without widening the main body.

## 2026-04-28: AI Chat Answered Chips And Actions Alignment

Classification: `layout rule` + `interaction/state rule`

Decision: In the AI Chat Answered state, align follow-up chips and the answer action bar to the same content-column left edge as the answer body. The answer row keeps the focused `598:10961` geometry of a `32px` AI marker and `10px` gap, while the post-answer controls use the focused density: `12px` answer stack gap, `4px` chip wrap gap, and a `2px` padded action pill with `28px` icon buttons.

Reason: The previous inherited spacing made chips and answer actions read as a separate, looser row and visually too far right compared with the focused Answered reference. Returning the post-answer controls to the answer content column preserves the current `720px` main body trial while matching the reference rhythm.

## 2026-04-28: Data Panel Metric Value Typography

Classification: `reusable component` + `design token` + `typography special case`

Decision: Promote the MyProgress four-stat data panel treatment into a confirmed `DataPanelMetricValue` special case. The central metric value may use `Geist Semibold 32px / 40px`, even though normal Geist UI text remains capped at `20px`.

Confirmed boundary:

- Use only inside data panels, metric cards, compact dashboard stat panels, and learning progress summaries.
- Values must be numeric or extremely short status-like data, such as counts, percentages, durations, scores, or 1-2 word value labels.
- Labels, helper copy, trend text, and actions remain within the normal Geist `12px` to `20px` UI range.
- Do not use this style for editorial titles, card titles, paragraph copy, CTA labels, or decorative large numerals outside a data panel.
- If the value wraps or needs sentence-like content, fall back to the normal UI type range.

Reason: The MyProgress prototype needs scan-first metric emphasis in the center data panels. Treating the number as a metric value, not a title, preserves dashboard legibility without weakening the broader typography rule that Geist should not become a generic large display face.

## 2026-04-28: Compact Course Detail Demo

Classification: `layout rule` + `interaction/state rule` + `reusable component`

Decision: Treat Figma nodes `685:13042`, `685:12069`, `260:2593`, and `695:14157` as focused evidence for the compact `Neural Architecture / Transformers & Attention` course-detail demo. Use a compact product footer instead of the large newsletter footer. The course page defaults to Discussion, uses a Course Progress/MOOCKY AI rail tab switch, shifts to AI on pause, and keeps newly posted discussion messages only in the current page session.

Reason: The page is a dense learning workspace, not a marketing surface. Keeping the lesson, AI support, and discussion visible requires compact density, progressive disclosure, and a lighter footer while preserving the existing Lumen Atlas type, radius, icon, button, and AI answer rules.

## 2026-04-28: Compact Course Detail Tabs And Instructor

Classification: `reusable component` + `one-off page-specific style`

Decision: Align the compact course main-column tabs and Instructor module to focused node `685:13043` children `695:13985` and `695:13995`.

Confirmed behavior:

- `CompactCourseTabs` uses the exact `364px x 36px` segmented pill geometry with two `179px x 32px` slots, outer and active-slot strokes, and Lucide `info` / `bubbles` icons.
- The Course Detail instructor card uses initials instead of a photo avatar. Initials are derived from the first two displayed name words and set in `DM Serif Text`.
- The visual structure follows the focused Figma reference, while the demo copy uses real author information for `Grant Sanderson`: `Mathematics educator`, concise bullet facts about Stanford mathematics/computer science study and visual math/Manim lesson creation, plus `Website` / `Lesson` pill actions.

Reason: The previous implementation used a generic tab shell and a photo-based instructor card, which visually diverged from the compact course reference and made the Course Detail state read like a different prototype.

## 2026-04-28: Compact Discussion Thread Reply Action

Classification: `reusable component` + `interaction/state rule`

Decision: Freeze compact course Discussion reply actions as default-transparent pills. The inline `Reply` action uses a `24px` minimum height, pill radius, Geist Regular `12px / 16px`, muted text, and no icon. Hover and keyboard focus reveal only a subtle low-contrast backing plus stronger text; the action must not use accent brown, primary-action fill, or neutral filled action treatment.

Reason: In comment threads, reply is a low-commitment inline affordance rather than the primary page action. The transparent pill keeps the touch target readable and consistent with the public/timestamp pill-control language while avoiding the visual noise of repeated filled buttons.

## 2026-04-28: MyProgress Metric And Progress Entry Motion

Classification: `interaction/state rule` + `reusable component`

Decision: MyProgress data-panel metrics use a restrained count-up from `0` only on first viewport entry. Numeric central values animate directly; the nonnumeric at-risk status keeps its `Statistics` value stable while the `34% confidence` helper metric counts up on first entry. Course and focus progress bars use the neutral action fill instead of accent brown, percent labels use Geist Regular in the same neutral role, and fills animate from `0` to target only on first viewport entry. Cognitive insight circular gauges use the same neutral fill, animate their arc from `0` to target only on first entry, and use the same `6px` visual stroke thickness as the paired linear progress bars. When a progress indicator sits inside a `reveal-on-view` component, the fill starts only after that component's fade/translate reveal has completed.

Reason: The page should feel alive when learners first encounter the metric area without becoming performative every time they scroll. Neutral progress treatment reduces repeated brown accent weight, while regular percent labels keep progress numbers from competing with the larger data-panel metrics.

## 2026-04-28: Isolated Public Course Detail Prototype

Classification: `one-off page-specific style` + candidate `layout rule` + candidate `reusable component`

Decision: Create the public course-detail surface first as an isolated prototype at `/prototypes/public-course-detail`, then promote it to the production route `/courses/{course-slug}` once the homepage course card is connected. The page uses the existing guest Navi Bar language, a generated course-promotion image in the hero, a desktop sticky purchase panel, `Enroll` CTAs that route to the existing playback page for now, and the compact product footer.

Reason: This page represents the public course evaluation path, not the confirmed My Progress to course playback flow. Keeping it isolated during review allowed the public-course architecture, sticky enrollment panel, generated promotional course imagery, and future checkout assumptions to be reviewed before product routing was enabled.

## 2026-04-28: Public Course Detail Data-Only Reuse

Classification: `layout rule` candidate + `reusable component` candidate

Decision: Public course detail reuse keeps the current page design fixed. Individual course pages may only swap data fields: course title, category label, subtitle, summary, rating copy, instructor profile, course modules, learning outcomes, outcome icons, AI prompt text, about/testimonial copy, and the generated promotional course image. The first validation course is `Nature Architecture`, linked from the homepage card to `/courses/nature-architecture`.

Reason: The prototype needs a repeatable workflow for every homepage course card without redesigning the public detail page each time. Freezing the layout preserves the approved UI/UX while letting course semantics drive copy, instructor identity, icons, and image prompts.

## 2026-04-28: Public Course Detail Route Promotion

Classification: `layout rule`

Decision: Production-ready public course details must live at `/courses/{course-slug}`. The former `/prototypes/public-course-detail` URL is retained only as a redirect, including query-based legacy links such as `/prototypes/public-course-detail?course=nature-architecture`.

Reason: The course detail page is now connected from homepage course cards and belongs to the deployable product surface. Keeping the interactive implementation under `/prototypes` would conflict with the production routing rule and blur prototype review paths with customer-facing pages.

## 2026-04-28: Visible AI Answer Delta Stream

Classification: `interaction/state rule`

Decision: The shared MOOCKY AI stream may emit `answer_delta` events extracted from the provider's `answerMarkdown` JSON field before the final structured envelope is complete. AI Chat and Course Rail render those deltas as the visible busy Markdown body, while context tags, follow-up chips, course recommendation cards, answer actions, persistence, and conversation titles remain final-envelope responsibilities. If deltas made the answer body visible, the final envelope must not replay the parsed typewriter; cards and post-answer affordances appear immediately after the final body is validated.

Reason: The API contract still needs a structured JSON envelope for reliable UI metadata, but waiting for the full object makes the answer feel slower than the provider stream. Separating visible body deltas from final metadata lets learners see useful text early without exposing raw JSON or rendering incomplete chips/cards.

## 2026-04-28: Application-Composed Personalized Suggestion Cards

Classification: `interaction/state rule`

Decision: Personalized Suggestion course cards are composed by the application from the fixed demo card set after the final answer envelope, rather than generated as full provider `courseRecommendationCards`. The provider should recommend course directions in `answerMarkdown` and keep `courseRecommendationCards` empty.

Reason: Generating four complete card objects after the answer body adds a visible delay at the end of the stream. The current demo already normalizes Personalized Suggestion to a fixed four-card set, so moving card composition to the application preserves the UI contract while reducing provider output length.

## 2026-04-28: Personalized Suggestion Cards Ready Event

Classification: `interaction/state rule`

Decision: The stream may emit `cards_ready` for application-composed Personalized Suggestion cards as soon as the provider's `answerMarkdown` string is complete, before the final JSON envelope is fully closed. The UI renders those cards below the live answer body, while follow-up chips, answer actions, title, and persistence still wait for `done`.

Reason: Even after removing provider-generated card objects, the model may spend a short tail producing title, chips, and JSON closing fields. Releasing fixed cards at the visible end of the answer matches the intended rhythm: answer streams first, cards appear at the end, final metadata settles quietly afterward.

## 2026-04-28: Stable Stream-To-Final Answer Reconciliation

Classification: `interaction/state rule`

Decision: When an answer has already rendered `answer_delta` text, final `done` reconciliation must keep the answer body in the plain Markdown render path and keep any `cards_ready` carousel in the same render slot. The no-reasoning thought-duration line reserves its vertical slot while the answer is still streaming, then becomes visible after final completion.

Reason: Swapping the streamed body into the fallback typewriter component, remounting the card carousel, and inserting the thought-duration line all in the same frame caused a visible flash when the answer completed. Stable render slots preserve continuity while still allowing final chips, actions, title, and persistence to settle after validation.
