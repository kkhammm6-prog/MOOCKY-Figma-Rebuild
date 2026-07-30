# Lumen Atlas Interaction Rules v0.1

This file records reusable interaction and state behavior. Do not encode these behaviors only inside one page component if they can recur.

## Motion Durations

Category: `interaction/state rule`

- Button and compact component hover: `160ms ease-out`.
- Section reveal on viewport entry: `300ms ease-out`.
- Section reveal stagger step: `160ms`.
- Section reveal stagger cap: `320ms`.
- Sidebar collapse/expand: `160ms ease-out`.
- FAQ expansion: `160ms ease-out`.
- Chatbox import menu: `160ms ease-out`.
- Recommendation panel expansion: `160ms ease-out`.

## Viewport Reveal

Category: `interaction/state rule`

- Browsed sections enter with opacity and upward translate.
- Current seed motion: `opacity 0 -> 1`, `translateY(14px) -> 0`, `300ms ease-out`.
- Reveal items are visible by default; `reveal-pending` is the only runtime state that hides an item before viewport entry.
- Runtime must evaluate first-viewport reveal items immediately on mount; initial visibility must not wait for user scroll.
- Runtime must restore reveal items to visible on `pagehide` and persisted `pageshow`, so browser Back/Forward cache restoration never returns a page with transparent reveal sections.
- New pages and prototypes must mount the shared `ViewportRevealRuntime` once, unless their parent shell already owns the reveal hook.
- When multiple reveal items enter the viewport in the same batch, sort by vertical position and apply `160ms` top-to-bottom stagger, capped at `320ms`.
- Reveal should be applied to section-level components, not every small child; important first-viewport groups may split into separate reveal items when they create separate reading moments.
- The landing hero copy and Chatbox/prompt group are separate reveal items.
- Creating, previewing, or deploying a new page should automatically reuse this reveal pattern for browsed section-level components unless explicitly disabled.
- Page-local keyframes or CSS overrides must not replace the shared `.reveal-on-view` opacity, translate, transition, or stagger behavior.
- Do not apply viewport reveal to Footer components on any interface.
- Reduced-motion mode bypasses translate movement and stagger delay so reveal content is immediately visible.

## Data Panel Count-Up

Category: `interaction/state rule`

- Numeric `DataPanelMetricValue` content may animate from `0` to the final value on the panel's first viewport entry only.
- The count-up should use restrained easing around `900ms`; it is supportive motion, not a gamified reward burst.
- Nonnumeric status values remain stable. If the panel's meaningful metric is in helper copy, the numeric helper may use the same count-up behavior.
- Leaving and re-entering the viewport must not reset or replay the count-up.
- Reduced-motion mode renders the final value immediately.

## Learning Progress Fill

Category: `interaction/state rule`

- Learning progress fills, including linear bar widths and circular gauge arcs, may animate from `0` to their target value on the first viewport entry only.
- The target value is still the semantic progress value; animation must not change the reported percentage.
- When the progress indicator sits inside a `reveal-on-view` card or module, fill starts after the owning reveal transition has completed so the component appears first and the bar grows second.
- Leaving and re-entering the viewport must not reset or replay the fill motion.
- Reduced-motion mode renders the final fill immediately.

## Theme Toggle

Category: `interaction/state rule`

- `MarketingHeader` theme toggle switches the whole page between light and dark.
- Theme state persists in local storage.
- Dark mode must use confirmed dark tokens; do not derive by automatic inversion.
- Landing card and action checks must be performed in both light and dark mode against node `419:5349` before a prototype UI update is considered accepted.
- In the Navi Bar demo from focused node `429:6308`, clicking `Log In` switches the header from the guest action cluster to the authenticated preview cluster without invoking a real login flow.
- During the demo stage, the `Log In` switch is a sticky browser state: after one click, Landing and AI workspace Navi Bars keep the authenticated cluster across route changes and reloads until local storage is cleared.
- After the demo switch, the theme toggle moves into the grouped utility panel and keeps the same page-level theme behavior.
- In the authenticated header, clicking the `coins` utility opens `/redeem`.
- Authenticated header search activates as a real input on click/focus.
- Empty header search activation only focuses the field; non-empty `Enter` submission opens the AI workspace with the entered text as the encoded `question` query.
- `Escape` clears and collapses the active header search field.

## Production Route Promotion

Category: `interaction/state rule`

- When a page becomes formally connected to product navigation, the navigation target must be a product route outside `/prototypes`.
- Legacy prototype URLs may redirect to the product route, but the interactive page implementation must not remain duplicated under `app/prototypes/*`.

## Button Hover

Category: `interaction/state rule`

- Default hover uses the purpose-specific surface/accent token.
- `primaryAction` remains the single brown filled action per interface surface.
- `neutralAction` uses `rgba(0,5,9,0.89)` by default and lightens to `rgba(0,7,20,0.62)` on hover in light mode.
- In dark mode, `neutralAction` uses `rgba(252,253,255,0.937)` by default and `rgba(241,247,254,0.71)` on hover, with `rgba(0,0,0,0.84)` text/icon color.
- `cardGuideAction` uses the same theme-aware neutral hover behavior and keeps a fixed Lucide `arrow-right`.
- Button icons inherit `currentColor`, so light/dark mode and hover only change the owning Button color.
- Auxiliary, primary, and neutral action arrows inherit `currentColor`, so hover only follows the Button color transition.
- Button icon regression tests must reject SVG/IMG image assets inside buttons and verify inline SVG icon color equals the owning control color before and after dark-mode toggle.
- Do not add lift or ambient shadow to normal buttons.
- `newsletterCompound` keeps input hover and action hover separate.
- `newsletterCompound` subscribe uses `neutralAction` color behavior.

## Tag Interaction

Category: `interaction/state rule`

- Tag visual evidence from node `762:15058` confirms `default`, `compact`, and `line` density, but does not confirm hover, selected, disabled, loading, or removable states.
- Non-interactive tags render as static labels.
- Interactive tags may render as links or buttons only for secondary metadata/navigation behavior; use Button for CTAs and command actions.
- Interactive tags must expose focus-visible affordance for accessibility while preserving the same alpha tone, pill radius, icon color, and typography.
- Do not add hover lift, shadow, solid fills, or Button-style action behavior to Tag unless a future focused component state confirms it.

## Popular Course Strip Hover

Category: `interaction/state rule`

- Evidence is limited to node `419:5349` for the landing light/dark course-strip color treatment.
- The foreground capsule uses `60px` height, `20px` left padding, `16px` top/right/bottom padding, and `16px` gap.
- The full strip is the pointer and keyboard target; the circular action affordance is not the only interactive area.
- Course strip action affordance hover uses the theme-aware `neutralAction` hover in both modes only when the pointer is over the affordance itself.
- The image strip itself does not use lift, shadow, or extra dark overlays as hover feedback.
- The foreground capsule stays blurred over media and uses theme-specific surface/text colors.

## Category Card Hover

Category: `interaction/state rule`

- Evidence is limited to user-approved node `419:5349` for landing placement and node `226:2326` for hover image assets.
- Default state shows icon, title, and description on a quiet surface.
- Trigger: hover or focus-visible.
- Hover state swaps the surface to a unique gradient image selected from node `226:2326`; cards in the same visible group must not reuse the same hover asset.
- Hover background image layer uses `12px` blur.
- Hover title and description use `rgba(255,255,255,0.9)` and text shadow `0px 0px 4px rgba(0,0,0,0.2)`.
- Category icons remain Lucide vectors through `LumenIcon`; do not animate or insert stretched image/mask icons as part of the hover.
- Motion uses the shared `160ms ease-out` button hover duration.

## Text States

Category: `interaction/state rule`

- Text itself has no hover, active, loading, disabled, empty, or error behavior.
- Interactive text behavior belongs to the owning component, such as Button, Link, Chip, FAQAccordion, or FooterNewsletter.
- Text color changes must use semantic tones or inherited `currentColor`; raw colors are not allowed inside Text instances.

## Chatbox States

Category: `interaction/state rule`

- `default`: while the trimmed input is empty, landing send button is disabled, non-clickable, and uses the `cardGuideAction` hover fill.
- `readyToSend`: landing send button keeps `cardGuideAction` neutral fill; hover lightens to the neutral hover fill.
- The send button icon inherits `currentColor` from the owning Button treatment.
- `importOpen`: Lucide `Plus` rotates into a close posture and import menu slides/fades in over `160ms ease-out`.
- Submit from landing creates/continues a chat session and routes to `/ai` only when trimmed input text exists.
- `Enter` submits when trimmed input exists; `Shift+Enter` keeps multiline composition available.

## Recommendation Card Hover

Category: `interaction/state rule`

- Evidence is limited to user-approved Figma nodes `348:8253` and `348:8271`.
- Light/dark color evidence for the landing card is node `419:5349`.
- Trigger: hover or focus/focus-within on the full card link target.
- Action: change from collapsed recommendation card to expanded recommendation card.
- Animation: smart-animation-equivalent CSS transitions, `160ms ease-out`.
- Default state: every recommendation card is collapsed.
- Collapsed lower pill: `60px` height, `264px` minimum width, `19px` bottom offset, geometric pill radius (`30px`, half the collapsed height) for clean interpolation.
- Collapsed pill may grow wider for longer real titles; do not truncate or reduce typography to force the reference minimum width.
- Expanded panel: `280px` height, pinned to the lower card edge.
- Panel, title, body, metadata, and action colors must resolve from the theme-specific recommendation-card tokens in both light and dark mode.
- Title crossfades/translates from Geist `20px` to `DM Serif Text 24px`.
- Description, provider, rating, and reviews fade in with a slight upward translate.
- Lucide `arrow-up-right` rotates from the collapsed rightward posture to the expanded up-right posture.
- The circular action affordance uses theme-aware `neutralAction` fills and exposes hover in both modes only when the pointer is over the affordance itself.
- The full card must be clickable/focusable; do not leave only the circular affordance interactive.
- Keep panel children in stable slots during the transition; do not swap flex direction or layout mode at hover start.
- Nested transitions stay inside the `160ms` interaction window: title `120ms`, collapsed title exit `90ms`, content `128ms`, title switch delay `16ms`, content reveal delay `32ms`.
- No hover lift or shadow.

## FAQ Accordion

Category: `interaction/state rule`

- One item may be open by default.
- Clicking an item toggles its answer.
- Chevron rotates with the same component motion duration and keeps the FAQAccordion `24px` Lucide viewport size through state changes.
- Answer reveal uses layout-safe expansion, not absolute positioning.

## AI Answer Surface

Category: `interaction/state rule`

- Supported states: `idle`, `promptSuggested`, `composerFocused`, `composing`, `sending`, `streaming`, `finalizing`, `answered`, `error`, `emptyContext`.
- AI answer blocks own Thinking animation, metadata, copy/save/feedback actions, and full-screen threshold behavior.
- Markdown body renders from `answerMarkdown`; chips and context tags render from structured fields.
- AI Chat Workspace Thinking may stream real provider `reasoning_content` inline beneath the Thinking status. Do not synthesize fake reasoning text when the provider does not return it.
- Reasoning is expanded inline while Thinking and collapsed after Answered, with a user-controlled reopen affordance.
- The Thinking marker animation and `Thinking...` status continue during `finalizing`; do not render a separate `Finalizing answer...` line in the demo UI.
- `answer_delta` events are the visible streaming text channel for `answerMarkdown`; render them as the busy Markdown body before the final structured envelope arrives.
- `cards_ready` events are allowed only for application-composed Personalized Suggestion cards and may render after the visible answer body completes, before the final envelope's follow-up/action metadata.
- If `answer_delta` already made the body visible, do not replay the parsed readable-text typewriter after the final envelope. If no body text streamed, fall back to the parsed typewriter and do not animate raw Markdown syntax into view.
- Final envelope reconciliation must preserve already-mounted answer body and course-card nodes; do not remount the card strip or swap the answer body component when the same answer has already streamed visibly.
- Mixed text-and-card answers defer course cards and post-answer affordances until the answer text has either streamed visibly or completed the fallback typewriter reveal.
- Course cards are disabled for New Chat and Career Path in the current demo. Personalized Suggestion normal answers always show the application-composed fixed four-card set: Nature Architecture plus three additional course cards.
- Personalized Suggestion cards use a horizontal carousel. The right browse button appears on hover/focus when overflow exists; after the learner scrolls right, the left browse button appears as well. Browse controls follow the Figma `260:2199` floating treatment.
- Answered follow-up chips and answer actions align to the answer body content column, not to an independent centered row. The content stack uses the focused Answered reference density: `12px` vertical stack gap, `4px` chip wrap gap, and a `2px` padded action pill.
- Follow-up chips submit the chip label as the next user message and are disabled during `sending`, `streaming`, and `finalizing`.
- AI Chat submitted-question bubbles use `min-height: 40px` rather than a fixed height so long prompts can wrap without being vertically compressed.
- After Answered, the duration/status metadata is either collapsed `Reasoning · elapsed` or `Thought for elapsed`, never both for the same answer. The chosen row renders in the explicit metadata stack, not as a margin-dependent neighboring block.

## Compact Course Interactions

Category: `interaction/state rule`

- Compact course rail tabs switch with a sliding `2px` underline and active/inactive text color transitions; the underline follows the measured active tab slot rather than a fixed page offset.
- Course Progress rail starts collapsed when the focused course context needs the AI and main lesson to remain visible.
- The curriculum Expand/Collapse control uses the shared `160ms ease-out` hover behavior and swaps arrow direction with the label.
- Playing lesson state shows `Watching with you...`; the ellipsis animates one dot at a time and respects reduced motion.
- Idle compact AI rail prompt chips rescan the current lesson context on a short interval and refresh while no question, answer, input draft, or send state is active.
- Pausing lesson media may automatically switch the rail to AI and update the prompt to `Questions?`.
- Default paused state presents the compact course-detail overview from focused node `685:13043`; after playback starts, returning to pause uses the same compact media layout while allowing the rail to switch into AI questions.
- Paused media layout changes animate transform and dimensions together so the main column moves naturally instead of crossfading between separate layouts.
- Course video fullscreen controls call the browser Fullscreen API on the complete video shell, not only the iframe, so real media and local controls enter and exit fullscreen together.
- Course video play/pause controls use one activation event and should reconcile with the real player state before toggling, avoiding duplicate `pointerdown` plus `click` handlers on the same control.
- Compact course bottom tabs use a segmented white capsule that slides between Course Detail and Discussion while tab text changes color.
- After playback starts, switching from Course Detail to Discussion hides the large course title and lesson description because those elements are tab-scoped Course Detail content.
- Discussion may show preseeded demo messages while newly sent messages persist only in the current page session.
- Timestamp attachments render as compact media cards; hover or focus-visible reveals the timestamp label.
- Discussion composer public/timestamp toggles are independent checkboxes rendered inside transparent pill controls by default, and reveal a low-contrast backing on hover/focus.
- Discussion AI check requests keep feedback in the initiating sparkle control by expanding it to `Thinking`; completed feedback should be concise and structured as `Verdict`, `Why`, and `Fix` for compact composer space. Once the feedback is visible, the initiating control changes to an `x` close action that dismisses the feedback while preserving the draft note.
- Discussion reply actions use a default-transparent compact pill. Hover/focus may reveal a subtle low-contrast backing and stronger text, but the action must not use accent fill or primary-action color.
- Seeded discussion threads should be authored as a logical lesson conversation with nested replies that answer, clarify, or extend the parent comment.
- Sticky discussion composers share the compact course rail top offset so their pinned position aligns with the right rail; the My Notes row sticks with the composer rather than scrolling independently.

## AI Chat Thinking Animation

Category: `interaction/state rule`

- Evidence: user-approved focused Thinking node `598:10430`, animation construction nodes `457:7130` and `491:7957`, and supplied reference recordings.
- The glyph container is a `32px` circular clipped frame.
- The Lucide `sparkle` renders at `13.337px` and alternates between brown and white.
- The glow is a `30px` radial brown circle that moves from the lower-right clipped crescent to centered full circle to upper-left clipped crescent to centered full circle.
- Timing is a `1400ms` loop: frame 1 holds `300ms`, transitions `200ms` to frame 2, transitions `200ms` to frame 3, frame 3 holds `300ms`, transitions `200ms` to frame 4, and transitions `200ms` back to frame 1.
- Thinking live text uses `Thinking...` in DM Serif Text Italic `12px / 16px`; live reasoning/fallback uses Geist `12px / 18px`.
- On Answered, keep the same `32px` marker slot but replace the animated Thinking glyph with a static `13.337px` Lucide sparkle, matching the visible Thinking star size. Do not keep an inactive animated shell or glow in the DOM for the completed answer.
