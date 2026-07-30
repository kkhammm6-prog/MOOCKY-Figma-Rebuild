# Lumen Atlas Components v0.1

This file is the seed registry for reusable MOOCKY components. It is synchronized after UI tuning and must stay consistent with `tokens.json`, `layout-rules.md`, and `interaction-rules.md`.

## Classification Rule

Before changing UI, classify the change as one of:

- `design token`
- `reusable component`
- `layout rule`
- `interaction/state rule`
- `one-off page-specific style`

If a style or structure can plausibly appear on two or more pages, do not leave it only in a page file. Promote it here or record it in `candidates.md`.

## Text

Category: `primitive component`

Purpose: render reusable typography roles without owning layout.

Rules:

- Text controls font family, size, weight, line height, letter spacing, and semantic color tone.
- Text must not own margin, padding, width, section gap, card placement, sticky behavior, or responsive layout.
- Default ordinary body text uses `Geist Regular`.
- Ordinary body sizes are `14px / 20px` and `12px / 16px`.
- `16px / 20px` Geist Regular is reserved for section labels or explicitly documented special copy, not default body copy.
- Geist defaults to `400`; heavier Geist weights require a documented emphasis, active state, numeric emphasis, or hierarchy need.
- `metric-value-32` is the only confirmed Geist text variant above `20px`; it is reserved for short central values inside `DataPanel`.
- `DM Serif Text` is allowed inside Text only for module/card/panel title roles and small serif captions. It does not replace `DisplayTitle`.
- `DisplayTitle` remains a separate component because it combines two font families, optical alignment, and paired sizing.
- Text colors use semantic tones, never raw color values.

Current variants:

| Variant | Font | Size / line-height | Weight | Use |
| --- | --- | --- | --- | --- |
| `body-14` | Geist | `14px / 20px` | `400` | normal explanatory body |
| `body-12` | Geist | `12px / 16px` | `400` | metadata, dense helper copy |
| `label-16` | Geist | `16px / 20px` | `400` | section labels |
| `button-12` | Geist | `12px / 16px` | `400` | button labels |
| `chip-14` | Geist | `14px / 16px` | `400` | chips |
| `caption-12` | Geist | `12px / 16px` | `400` | captions and legal/meta copy |
| `metric-value-32` | Geist | `32px / 40px` | `600` | short central value inside `DataPanel` |
| `module-title-16` | DM Serif Text | `16px / 22px` | `400` | compact module title |
| `module-title-20` | DM Serif Text | `20px / 24px` | `400` | FAQ and module title |
| `module-title-24` | DM Serif Text | `24px / 28px` | `400` | expanded card title |
| `module-title-40-italic` | DM Serif Text Italic | `40px / 40px` | `400` | featured module title |
| `module-statement-20` | DM Serif Text | `20px / 27px` | `400` | short editorial module statement |
| `serif-caption-12-italic` | DM Serif Text Italic | `12px / 16px` | `400` | AI thought/meta caption |

Current tones:

- `primary`
- `body`
- `muted`
- `soft`
- `accent`
- `inverse`
- `ai`
- `inherit`

Recommended API shape:

```ts
type TextProps = {
  as?: React.ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  children: React.ReactNode;
};
```

## DisplayTitle

Category: `reusable component`

Purpose: page-defining and section-defining editorial titles using the strict two-font display pair.

Structure:

- first word: `Cormorant Infant`, italic, medium, `-4px` tracking
- remainder: `Gayathri`, thin, `-1px` tracking
- first word optical correction: `translateY(-0.18em)`
- named sizes: `large` = `80px / 68px`, `medium` = `58px / 49.3px`, `compact` and `mobile` = `50px / 42.5px`

Rules:

- Use only for independent page/interface main titles or identity-level section titles.
- Do not use below `42px`.
- Do not replace the pair with only `Cormorant Infant`, only `Gayathri`, or `DM Serif Text`.
- Treat optical alignment as a component rule, not a page-specific patch.
- Expose size as a component input or named variant, not as separate page CSS for each title.
- Preserve the confirmed visual ratio when resizing: remainder size is `0.85` of the first-word size unless a specific Figma frame confirms another ratio.
- Scale tracking proportionally in fluid/custom sizes: first-word tracking is approximately `-0.05em`; remainder tracking is approximately `-0.015em`.
- Keep the inline gap at least `10px`; larger custom sizes may scale it upward at approximately `0.125em` of the first-word size.
- Keep the first-word optical offset proportional at `-0.18em`.
- Clamp custom sizes so no rendered segment falls below the `42px` minimum.

Recommended API shape:

```ts
type DisplayTitleProps = {
  firstWord: string;
  remainder: string;
  size?: "large" | "medium" | "compact" | "mobile";
  firstSizePx?: number;
};
```

Use named sizes for confirmed frames. Use `firstSizePx` only for exploratory layouts, then promote the resulting size to a named token if reused.

## AIChatWorkspace

Category: `reusable component` + `layout rule` + `interaction/state rule`

Purpose: AI-first chat workspace entered from non-course AI prompts.

Rules:

- Evidence is limited to Figma `559:8583` for the current Default and Default/Dark layout, Figma `375:3335` for additional AI Chat states, focused dark references `375:4694`, `375:4875`, `375:4776`, `375:5204`, `513:8444`, Thinking animation references `457:7130`, `491:7957`, user-approved focused Thinking state reference `598:10430`, and user-approved focused Answered state reference `598:10961`.
- Sidebar uses `350px` expanded width and a focused `60px x 100px` collapsed rail from Figma `575:10098`.
- Collapsed top controls sit in a `36px x 76px` vertical stack with `2px` padding and `8px` gap.
- Collapse/expand transitions width, flex-basis, height, and padding together; non-header content fades and clips away.
- Sidebar top controls are `32px` circular icon controls; the default layout keeps the back control visible and uses panel-style collapse/expand affordances.
- Default conversation-mode icons are `badge-plus`, `chess-pawn`, and `road` through `LumenIcon`.
- Mode rows reserve a `28px` icon slot for alignment, while the Lucide glyph remains the default `16px / 1.5px` visual size inside the slot.
- Mode row hover, focus-visible, and current states add a circular icon backing around the `28px` slot: `#fff` in light mode and `#000` in dark mode.
- Conversation record rows use a compact fill-width form: `32px` height, `12px` padding, `12px` internal gap, `12px` radius, explicit Geist `14px / 16px`, transparent default fill, and the AI Chat active surface for hover/current.
- Conversation record mode markers use solid black with light-mode `0.27` opacity as secondary metadata treatment, preventing darker overlap artifacts where Lucide strokes cross.
- Main conversation column is trialed at `720px` and centered in the remaining workspace; the bottom composer follows the same width.
- Default prompt chips are visible only before the active conversation has messages.
- Thinking state uses the approved `32px` circular clipped sparkle/glow animation, displays `Thinking...`, and streams provider `reasoning_content` inline as `12px / 18px` live reasoning.
- Reasoning is expanded while streaming and collapsed after the final answer.
- The Thinking animation and `Thinking...` live status stay active during `finalizing`; the demo UI does not show a separate finalizing row.
- Answered state keeps the `32px` marker slot but replaces the animated glyph with a static `13.337px` Lucide sparkle matching the Thinking animation's visible star; no glow or animation remains active after completion.
- Completed answer metadata uses one duration/status row: collapsed `Reasoning · elapsed` when provider reasoning exists, or `Thought for elapsed` when it does not.
- Live `answer_delta` text renders as the visible `answerMarkdown` body with `aria-busy=true`; final-only metadata and affordances wait for the `done` envelope.
- Live `cards_ready` payloads may render application-composed Personalized Suggestion cards below the visible body before final metadata arrives.
- Answer body uses live deltas when available. If no visible deltas streamed, reveal with the parsed-text typewriter fallback: `8ms` tick, capped near `3200ms`, reduced-motion disabled.
- When a streamed answer becomes final, keep the answer body and card carousel mounted in the same render slots. Reserve the no-reasoning thought-duration slot during live streaming so the final duration label does not shift the whole answer block.
- Mixed text-and-card answers show course cards after the answer body has either streamed visibly or completed the fallback reveal; the card strip uses the standard `160ms ease-out` entrance.
- Answer body uses `Geist 14px / 24px`; answer subheads use `DM Serif Text 16px`.
- Follow-up chips submit immediately as the next user message.
- Answer actions provide text feedback after click; Copy writes the answer body to the clipboard.
- Personalized Suggestion renders compact `300px x 240px` course cards as an application-composed fixed four-card output mode: Nature Architecture plus three additional cards. New Chat and Career Path do not render course cards in the current demo.
- Personalized Suggestion course cards sit in a horizontal carousel with no card hover motion. Carousel browse controls use the focused Figma `260:2199` floating treatment with arrow icons substituted for browse direction.

Implementation:

- React page component path: `app/ai/AiChatPage.tsx`.
- Stream endpoint path: `app/api/moocky-ai/stream/route.ts`; event types include `reasoning_delta`, `answer_delta`, `cards_ready`, `content_delta`, `done`, and `error`.

## Icon

Category: `primitive component`

Purpose: render action and utility symbols from the approved Lucide source.

Rules:

- All action and utility icons must come from Lucide unless the design system explicitly defines a brand mark such as the MOOCKY sparkle lockup.
- Prefer `lucide-react` for interactive icons that need inherited `currentColor`, precise size, or precise stroke width.
- Do not draw icons with CSS bars, text glyphs, ad hoc SVG paths, or non-Lucide image assets.
- Interactive controls must receive icons through controlled Lucide icon names or the shared `LumenIcon` primitive; arbitrary SVG/IMG nodes are not allowed for Button icons.
- Default size is `16px`; default stroke width is `1.5px`.
- State changes should animate transform, opacity, color, or stroke on the Lucide icon source.
- The Chatbox import trigger must use Lucide `plus`; rotating it into a close posture is allowed, but constructing it from CSS spans is not allowed.

## DataPanel

Category: `reusable component`

Purpose: show a compact learning or product metric that needs faster scanning than ordinary body text.

Structure:

- panel shell
- optional Lucide icon
- label
- central metric value
- optional helper copy or trend text

Rules:

- Use for dashboard stat panels, progress summaries, and compact learning metric cards.
- The central value uses Text variant `metric-value-32`: `Geist Semibold 32px / 40px`.
- The central value must be numeric or extremely short status-like data: counts, percentages, durations, scores, or 1-2 word value labels.
- Numeric values may count up from `0` on the panel's first viewport entry only. Nonnumeric status values stay stable; numeric helper metrics may count up when they are the panel's meaningful metric.
- Labels, helper copy, trend text, and actions remain in the normal Geist `12px` to `20px` UI range.
- Use regular `16px` card/panel radius, default component border rules, and no shadow by default.
- Icons render through `LumenIcon` with the default Lucide `16px / 1.5px` spec unless a future variant documents a special size.
- If the value wraps, needs a sentence, or behaves like a title, do not use `metric-value-32`.

## Tag

Category: `reusable component` + `design token`

Purpose: render short metadata, status, category, and contextual labels through one global alpha-tone system.

Rules:

- Evidence is limited to Figma node `762:15058`.
- Density variants are `default`, `compact`, and `line`.
- `default` is `32px` high with `12px` start padding, `10px` end padding, `4px` gap, and a `1px` tone border.
- `compact` is `24px` high with `10px` start padding, `8px` end padding, `4px` gap, and the default `0.5px` tone border.
- `line` is `16px` high with no fill, no border, no horizontal padding, and an underline on the text label only.
- Text uses Geist Regular `12px / 16px`; Tag text must not use bold, serif, or display typography.
- Radius is `pill`.
- The default icon is Lucide `arrow-up-right`; icons render through `LumenIcon` at `16px / 1.5px` and inherit `currentColor`.
- Tone values use alpha backgrounds, same-family borders, and same-family foregrounds so tags stay consistent on light, dark, media-overlay, and quiet panel surfaces.
- `Tag` is not a Button substitute. Use it for labels and secondary metadata/navigation, not primary CTAs or command controls.

Implementation:

- React component path: `app/components/Tag.tsx`.
- CSS rules path: `app/globals.css` (`.lumen-tag`, `.lumen-tag-default`, `.lumen-tag-compact`, `.lumen-tag-line`, `.lumen-tag-tone-*`).

## LearningProgressIndicator

Category: `reusable component`

Purpose: show compact course, module, or skill confidence completion inside learning cards, rails, and progress summaries.

Structure:

- muted progress track, linear or circular
- neutral fill
- adjacent or nearby percent label

Rules:

- Use `action.neutral` for the fill in light mode and the corresponding dark neutral action role in dark mode.
- Percent labels use Geist Regular with the neutral action role, not accent-brown emphasis.
- Circular gauges use the same visual stroke thickness as the matching linear progress bar unless a focused component reference confirms a special case.
- The fill may animate from `0` to the target value on the first viewport entry only.
- Reduced-motion users see the final fill immediately.

## CompactCourseRail

Category: `reusable component` + `interaction/state rule`

Purpose: combine course progress and contextual AI support inside compact course pages.

Rules:

- The top rail tabs are Course Progress and MOOCKY AI.
- Active tab uses the primary text tone and a sliding `2px` underline; inactive tab uses the soft/muted tone.
- The active underline is measured from the two tab columns, not a hard-coded left offset, so it remains centered under Course Progress or MOOCKY AI as the rail width changes.
- Course Progress supports collapsed and expanded curriculum list states.
- Collapsed Course Progress rails fit their content height instead of reserving a full sticky panel; expanded progress and AI states use a dynamic viewport-limited height.
- Desktop sticky offset should be tight and visually symmetric with the rail bottom breathing room; the compact course rail uses its current visible top gap and keeps expanded/AI states about `12px` from the viewport bottom at the page top and while sticky.
- Desktop compact course grids may reserve lower sticky scope so expanded/AI rail states do not get pushed upward before the compact footer enters.
- MOOCKY AI supports playing, paused, thinking, answered, and error/fallback states while reusing the AI Answer Surface rules.
- AI prompt chips come from current lesson context instead of a fixed starter template, and idle rails rescan context on a short interval so suggestions can change as the lesson timestamp and active chapter change.
- Compact rail AI composer textarea and placeholder use Geist Regular `14px / 20px` body styling so the prompt stays subordinate to chips and answers.
- Compact discussion Public/timestamp controls default to unchecked transparent pill controls; hover reveals the pill backing, checked state preserves a quiet accent backing, and the checkbox stroke remains visually aligned with the default `1.5px` Lucide icon system rather than appearing bold. Pointer focus after clicking does not keep the hover backing once unchecked; keyboard focus is indicated by a subtle outline.
- Answer expansion hands off the existing answer to the AI Chat Workspace instead of forcing regeneration.

## CompactCoursePausedHero

Category: `one-off page-specific style`

Purpose: present the default `/course` pre-play state as a compact course-detail overview before the learner starts the lesson.

Rules:

- Applies only before the first playback starts; after the learner starts the video once, later pauses keep the large stacked lesson layout.
- Starts with the approved brand-gradient banner from focused node `685:13043`.
- Uses the approved two-font `Neural Architecture` display title in the left description column.
- Keeps the media as the real mounted video component in a compact `400:240` frame, with the control bar hidden while paused.
- Uses the reusable `Button/floatingResume` treatment from focused node `260:2199` as the only pre-play media foreground control.
- Keeps the YouTube iframe mounted so play/resume can transition into real playback without swapping to a placeholder image.
- After first playback starts, later pauses do not show the floating foreground play control; learners resume through the local bottom control bar.
- The mounted YouTube iframe may be cropped and edge-masked inside the local video shell so native YouTube chrome does not compete with MOOCKY controls.
- The mounted YouTube iframe keeps a `16:9` viewport and cover-sizes inside the local media shell; do not stretch the iframe itself to non-video shell proportions.
- Paused native YouTube title, watermark, or center play chrome may be hidden with a non-interactive local mask while keeping the real iframe mounted.
- First-play transition should start all major motion on the same frame: compress the gradient banner upward, move the compact video from the lower-right study position into the large upper media position, and slide/expand the title/copy instead of using a simple opacity swap or a delayed video handoff.

## CompactCourseTabs

Category: `reusable component` + `interaction/state rule`

Purpose: switch compact course main-column content between Course Detail and Discussion.

Rules:

- Uses the focused node `695:13985` geometry: `364px x 36px` outer pill, `2px` padding, `2px` internal gap, and two `179px x 32px` tab slots.
- Outer pill and active slot both use `0.5px` neutral-alpha stroke and `pill` radius.
- Active slot uses the panel solid surface and primary text; inactive slot uses the muted accent-alpha text tone.
- Course Detail uses Lucide `info`; Discussion uses Lucide `bubbles`.
- The active slot may slide between tabs; the stable end states must match the Figma dimensions.
- After playback starts, Course Detail owns the large course title, subtitle, live count, lesson description, and current lesson context summary; Discussion hides those elements and shows only discussion-specific content.

## CompactCourseInstructorCard

Category: `one-off page-specific style`

Purpose: show the compact course instructor profile in Course Detail.

Rules:

- Uses the focused node `695:13995` structure: `810px` full-width panel, `16px` padding, `12px` internal gap, `16px` radius, and no extra border.
- Avatar is not a photo. It is a `40px` pure-color circular initials badge.
- Initials are derived from the first two words of the displayed instructor name and rendered in `DM Serif Text 14px / 14px`.
- The current Course Detail demo uses real author information for `Grant Sanderson`: `Mathematics educator` plus concise bullet facts about Stanford mathematics/computer science study and visual math/Manim lesson creation.
- Right actions are two `32px` pill controls: neutral `Website` and accent-filled `Lesson`, both with the fixed Lucide `arrow-up-right`.

## DiscussionComposer

Category: `reusable component` + `interaction/state rule`

Purpose: collect course discussion posts and notes in compact learning pages.

Rules:

- Supports My Notes filtering, public/private intent, optional current timestamp, upload affordance, AI correctness check, and send.
- My Notes filtering sits below the composer in a dedicated single row, typically right-aligned, instead of sharing the composer control row.
- The AI check is manually triggered. While pending, the sparkle control expands into a compact `Thinking` pill so the waiting state is visible inside the clicked control.
- AI check results render as a compact structured status block with `Verdict`, `Why`, and `Fix`; do not render the raw AI markdown as one long paragraph in the composer.
- After an AI check result is visible, the same control changes from Lucide `sparkle` to Lucide `x` and dismisses only the AI check result when clicked.
- Demo composer avatars use a generated placeholder glyph or initials treatment, not a generated user photo.
- The placeholder text area is visually part of the composer surface, without an inner bordered input shell.
- Sticky discussion composers use a translucent foreground surface with `12px` backdrop blur when layered over threaded comments.
- When My Notes appears beneath the sticky composer, the composer and My Notes row stick as one dock so their relative spacing is preserved while scrolling.
- In a two-column compact course shell, sticky discussion composers align their top offset with the compact course rail instead of using a separate header-like offset.
- Placeholder copy uses compact Geist `12px / 16px` so the empty composer stays visually quiet.
- Placeholder text starts at the same horizontal edge as the bottom control group and aligns vertically with the top of the avatar placeholder.
- Public/private and timestamp toggles render as default-transparent pill controls with a visible checkbox mark inside each pill; hover/focus adds only a subtle backing so the pill shape appears without turning into a filled button.
- Default height should stay compact enough for the first seeded messages to remain visible below the sticky composer.
- Demo pages may seed public discussion messages while new posts live only for the current page session.
- Timestamp attachments render as compact media cards with hover/focus timestamp reveal.
- Nested reply connectors use a quiet `0.5px` translucent stroke; light mode uses transparent black rather than white so the thread depth is readable on pale discussion backgrounds without becoming a divider.

## DiscussionThread

Category: `reusable component` + `interaction/state rule`

Purpose: show compact course discussion messages, nested replies, likes, and reply affordances.

Rules:

- Top-level comments and nested replies must form a readable course-context conversation, not an arbitrary feed. Seeded demos should include questions, clarifications, timestamp references, and learner notes that logically respond to the lesson.
- Reply actions are compact transparent pills: `24px` minimum height, pill radius, Geist Regular `12px / 16px`, muted text, and no icon.
- Reply actions do not use accent brown or primary-action fill. Hover/focus reveals only a subtle low-contrast backing so the control reads as available without competing with the composer send action.
- Nested reply avatars stay compact and align to the same spacing rhythm as top-level avatars.
- Nested reply connectors stay at a quiet `0.5px` visual stroke and must remain readable in light mode without becoming a heavy divider.

## CompactProductFooter

Category: `reusable component`

Purpose: close dense learning/product workspaces without the large newsletter footer.

Rules:

- Use the canonical `LogoLockup`/brand mark at compact scale.
- Use compact legal, help, product, and social links.
- Do not include display typography, newsletter input, CTA panel, decorative imagery, or viewport reveal.

Implementation:

- Component path: `app/components/CompactProductFooter.tsx`
- Styles path: `app/components/CompactProductFooter.module.css`

## Button

Category: `reusable component`

Purpose: the global action family.

Current implemented kinds:

- `standaloneIcon`: circular icon button, `32px`
- `auxiliaryAction`: secondary capsule action with fixed Lucide `arrow-up-right`
- `primaryAction`: single brown filled capsule action with fixed Lucide `arrow-up-right`
- `neutralAction`: repeated neutral filled capsule action with fixed Lucide `arrow-up-right`
- `cardGuideAction`: neutral circular guide action with fixed Lucide `arrow-right`
- `aiChatFunctionChip`: compact AI/function chip
- `floatingResume`: `32px` media foreground pre-play control from node `260:2199`

Rules:

- Use Geist for all labels.
- Use `primaryAction` at most once per interface surface; repeated filled actions use `neutralAction`.
- Preserve locked action icons.
- Render every Button icon through `LumenIcon` so it inherits the Button `currentColor` across light mode, dark mode, hover, and focus-visible states.
- Do not pass raw `ReactNode`, `<img>`, page-level SVG assets, or custom inline SVG as a Button icon.
- Render action arrows inside the reusable `Button` component, not as page-level image assets.
- During migration, legacy `arrow-up-right*.svg` icon names must resolve to the same Lucide `arrow-up-right` inline icon so they inherit `currentColor`.
- `neutralAction` uses default `rgba(0,5,9,0.89)`, hover `rgba(0,7,20,0.62)`, and foreground `rgba(255,255,255,0.9)`.
- `cardGuideAction` uses the same neutral fills as `neutralAction` and owns the fixed `arrow-right`.
- `newsletterCompound` uses `neutralAction` styling for its subscribe action.
- Hover motion uses `160ms ease-out`.
- Do not invent ad hoc color variants in page CSS; add a purpose-based kind first.

Implementation:

- React component path: `app/components/Button.tsx`.
- Icon primitive path: `app/components/LumenIcon.tsx`.
- The component owns the fixed trailing action icon for `auxiliaryAction`, `primaryAction`, and `neutralAction`, and the fixed guide icon for `cardGuideAction`.

## LogoLockup

Category: `reusable component`

Purpose: canonical MOOCKY wordmark plus attached sparkle mark.

Rules:

- Use the fixed vector outline asset exported from Reference node `429:5935`.
- Header lockup dimensions are `97px` by `32px`.
- The sparkle stays attached to the wordmark.
- The wordmark and sparkle placement are locked by the SVG viewBox; do not rebuild the logo from live text plus an icon.
- Light usage renders in `#3E332E`; theme variants may use `currentColor` for contrast without changing geometry.
- Do not use the sparkle alone as the primary logo.

Implementation:

- React component path: `app/components/LogoMark.tsx`.
- Canonical static SVG path: `public/assets/figma/moocky-logo.svg`.

## MarketingHeader

Category: `reusable component`

Purpose: brand-first marketing navigation.

Structure:

- `LogoLockup`
- left utility action
- guest right action cluster with theme toggle, login, primary CTA
- prototype-only authenticated preview cluster with `HeaderSearchField`, utility icon group, and profile action

Rules:

- Header height is `52px`.
- Inner width is `1132px` on desktop.
- Theme toggle owns whole-page light/dark switching.
- The focused Navi Bar reference `429:6308` is approved only for demo state switching: clicking `Log In` swaps the guest cluster to the authenticated preview cluster without a real auth flow.
- Do not treat the authenticated preview as the production learning header boundary.

Implementation:

- React demo implementation path: `app/prototype-components.tsx`.

## HeaderSearchField

Category: `reusable component`

Purpose: compact learning-intent entry inside navigation.

Rules:

- Use only in header-scale utility contexts.
- Desktop preview width from focused node `429:6308` is `300px`.
- Height follows the compact Button height: `32px`.
- Leading icon uses Lucide `search` through `LumenIcon`.
- Placeholder text uses compact Geist `12px / 16px`.
- Activating the field focuses a real text input.
- Filled state preserves the typed value; `Escape` clears and collapses the field when appropriate.
- `Enter` submits non-empty text to the AI workspace as `/ai?question={encodedInput}`.
- On narrow authenticated previews, the inactive field collapses to a `32px` search icon and expands to the documented active mobile width while utility/profile controls step aside.
- Do not replace the larger landing `Chatbox` with this component.

## HeaderUtilityPanel

Category: `reusable component`

Purpose: group compact header utility actions without repeating filled buttons.

Rules:

- Container height is `32px`.
- Container padding is `2px`, internal gap is `2px`.
- Child controls are `28px` circular icon buttons.
- Default icons use Lucide `bell`, `coins`, and `eclipse` at `16px / 1.5px`.
- The `coins` control opens the current rewards product route at `/redeem`.
- The `eclipse` control continues to own theme switching when the authenticated preview is visible.

## Chatbox

Category: `reusable component`

Purpose: AI entry field that can route from landing to the AI chat surface.

States:

- default
- import open
- ready to send

Rules:

- Width `800px`, height `120px`.
- The import trigger uses Lucide `plus` and rotates into a close posture over `160ms ease-out`; it must not be drawn from CSS-only bars.
- Landing send action uses `cardGuideAction`: neutral black fill, slightly lighter neutral hover, and Lucide `arrow-right`.
- Empty landing send action is disabled, non-clickable, and uses the same lighter neutral fill as hover until trimmed input text exists.
- `Enter` submits the Chatbox when trimmed input exists; `Shift+Enter` keeps multiline composition available.
- Send action foreground and icon inherit `currentColor` from the Button treatment.

## SectionHeadingRow

Category: `reusable component`

Purpose: low-emphasis row title plus optional compact action.

Rules:

- Label uses Geist Regular `16px`, shallow brown.
- Use for subordinate section titles outside backed modules.
- Do not use DisplayTitle for these labels unless the section is an identity moment.

## PopularCourseStrip

Category: `reusable component`

Purpose: image-backed course strip with foreground capsule label.

Rules:

- Course title uses Geist Regular `20px`.
- Capsule surface uses `8px` backdrop blur over media.
- Capsule layout uses `60px` height, `20px` left padding, `16px` top/right/bottom padding, and `16px` gap.
- Light capsule surface is `rgba(255,255,255,0.8)` with `#1C2024` title text.
- Dark capsule surface is `rgba(29,29,33,0.78)` with `#EDEEF0` title text.
- The full strip is the clickable/focusable link target; the circular Lucide `arrow-up-right` is a visual action affordance inside that target.
- Arrow affordance uses theme-aware `neutralAction` fills and only changes to hover fill when the pointer enters the affordance itself.
- React component path: `app/components/CourseCards.tsx` (`PopularCourseStrip`).

## DomainTile

Category: `reusable component`

Purpose: compact learning domain card with icon, DM Serif Text title, and short proof copy.

Rules:

- Card surface uses `surface.base`, `16px` radius, no shadow.
- Default state includes a visible short description.
- Padding is equal on all sides at `28px`.
- Hover swaps the quiet surface for a unique gradient image asset from node `226:2326`, blurred by `12px`; do not reuse a hover image within the same visible group.
- Hover title and description use `rgba(255,255,255,0.9)` plus `0px 0px 4px rgba(0,0,0,0.2)` text shadow.
- Icons render through `LumenIcon` in a square intrinsic box, not through CSS masks, stretched SVG frames, or raster assets.
- Copy must stay short enough to preserve the fixed density.

## RecommendationCard

Category: `reusable component`

Purpose: image-backed course recommendation with an expanding lower panel.

States:

- collapsed pill
- expanded/hover

Rules:

- All cards are collapsed by default.
- Focused interaction evidence is limited to Figma nodes `348:8253` and `348:8271`; landing light/dark color evidence comes from `419:5349`.
- Card height is `450px`; card padding is `10px`; card radius is `16px`; no shadow.
- Collapsed pill height is `60px`; minimum width is `264px`; bottom offset is `19px`; padding is `16px 16px 16px 20px`.
- Light panel surface is `#FFFFFF`; title/provider/meta text is `#3E332E`; body text is `#60646C`.
- Dark panel surface is `#000000`; title/provider/meta text is `#EDE8E1`; body text is `#B0B4BA`.
- Collapsed pill radius is resolved as `30px` for this animated surface, equivalent to a `60px` pill but smoother than interpolating from `9999px`.
- Collapsed pill may grow wider than `264px` for real course titles so text does not truncate.
- Expanded panel height is `280px` and is pinned to the card bottom.
- Panel children keep stable internal slots through hover/focus; do not change flex direction or layout mode at the trigger.
- Title transitions from `Geist 20px` to `DM Serif Text 24px`.
- Description, provider, rating, and review metadata fade in with slight upward motion.
- The full card is the clickable/focusable link target; the `32px` circular Lucide `arrow-up-right` is a visual action affordance inside that target.
- The action affordance uses theme-aware `neutralAction` fills and only changes to hover fill when the pointer enters the affordance itself; collapsed state rotates the icon into a rightward posture, expanded state rotates it to up-right.
- Panel motion uses `160ms ease-out`; nested title/content timing uses `120ms` title, `90ms` collapsed-title exit, `128ms` content reveal, `16ms` title switch delay, and `32ms` content reveal delay.
- Do not add hover lift or card shadow.

Implementation:

- React component path: `app/components/CourseCards.tsx` (`RecommendedCourseCard`).
- CSS rules path: `app/globals.css` (`.recommendation-card`, `.recommendation-panel`, `.recommendation-title-*`, `.recommendation-meta`).

## FAQAccordion

Category: `reusable component`

Purpose: question list with expandable answers.

Rules:

- Question text uses `DM Serif Text`.
- Arrow rotates over `160ms ease-out`.
- Indicator uses Lucide `chevron-down` in a `24px` viewport with `1.5px` stroke. This is a documented size exception that preserves the old `12px × 7.4px` visual footprint after moving away from filled SVG assets.
- Answer expansion uses the shared component motion duration.

## FooterNewsletter

Category: `reusable component`

Purpose: newsletter input plus subscribe action inside the site footer.

Rules:

- Input hover and subscribe hover are separate states.
- No ambient shadow.
- DisplayTitle inside footer inherits the shared DisplayTitle optical alignment.
- Footer must not use `ViewportReveal`, staggered entrance, or scroll-in fade.
