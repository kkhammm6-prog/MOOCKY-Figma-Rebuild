# AGENTS

## Purpose

This file gives Codex execution rules for Lumen Atlas, the MOOCKY design system. It is not a restatement of the full system.

This repository is the independent MOOCKY Figma rebuild. The copied implementation is a reference baseline, not evidence that a page has been rebuilt. A page becomes rebuilt only after node-specific Figma context, same-node screenshot evidence, implementation, and browser acceptance are recorded for this repository.

## Source Priority

1. `docs/design-system.md`
2. `docs/component-specs.md`
3. `tokens.json`
4. `design-system/tokens.json`
5. `design-system/components.md`
6. `design-system/layout-rules.md`
7. `design-system/interaction-rules.md`
8. `design-system/decisions.md`
9. `design-system/candidates.md`
10. This file

If a rule changes, update the source of truth first.

## Core Execution Rules

- Treat `docs/design-system.md` as the only normative design source.
- Treat `docs/component-specs.md` as an implementation companion, not an authority.
- Treat `tokens.json` as the machine-readable contract for implementation.
- Treat `design-system/*` as the v0.1 seed implementation layer that translates the normative system into reusable tokens, components, layout rules, interaction rules, decisions, and candidates.
- Do not invent missing design rules in code.

## Skill Dispatch Rules

Codex should proactively use the relevant project Skills based on task intent. Do not wait for the user to manually mention a Skill when a trigger below matches. Load only the minimal Skills needed for the current task.

- Use `figma-implement-design` and the Figma plugin when the task includes a Figma URL, node ID, selected Figma frame, wireframe implementation, component parity, or visual comparison against Figma. Respect the Figma Evidence Whitelist in this file.
- Use `frontend-skill` when building or tuning landing pages, prototypes, app UI, games, visually led pages, motion, imagery, hierarchy, or first-viewport composition.
- Use `redesign-existing-projects` when optimizing future wireframe designs, upgrading existing pages or prototypes, auditing generic AI design patterns, or applying premium UI polish without changing the existing tech stack.
- Use `minimalist-ui` when Codex must autonomously complete missing design details, sparse wireframes, or underspecified UI states; apply it only as an art-direction aid that keeps the result aligned with the current design system, source priority, tokens, component rules, and project style.
- Use `build-web-apps:react-best-practices` when writing, reviewing, or refactoring React/Next.js components, pages, hooks, data fetching, performance, bundle size, or rendering behavior.
- Use `playwright-interactive` for iterative local UI QA, visual inspection, responsive checks, stateful browser debugging, and repeated frontend verification during implementation.
- Use `playwright` for one-off browser automation, snapshots, screenshots, form flows, data extraction, or CLI-first browser checks.
- Use `browser-use:browser` during acceptance when the in-app browser is the clearest verification surface, especially if Playwright acceptance exposes a visual, interaction, localhost, or current-tab issue that needs direct inspection or debugging.
- Use Vercel plugin capabilities when the task involves Vercel deployment, project settings, build logs, environment variables, preview URLs, CI/CD, or Vercel-specific framework behavior.

When multiple Skills match, use them in this order:

1. Design source / Figma evidence
2. Frontend art direction, redesign audit, and design-system rules
3. React/Next.js implementation quality
4. Browser verification, Browser Use issue inspection, and Playwright acceptance

After any prototype UI update, run Playwright acceptance when the app can be built and opened locally. If acceptance reveals a visual or interaction issue that benefits from the Codex in-app browser, use `browser-use:browser` as part of the verification loop. Report any skipped Skill or verification step with the reason.

When creating, previewing, or deploying a new frontend page or prototype, apply the confirmed `ViewportRevealRuntime` plus section-level `reveal-on-view` treatment by default unless the user explicitly asks to disable entrance motion. Do not use page-local reveal keyframes or CSS overrides in place of the shared reveal system, and continue to exclude Footer components from viewport reveal.

When a page is formally connected to the main product navigation, promote it out of `/prototypes` before deployment. Connected production surfaces must use a product route such as `/redeem`; keep old prototype URLs only as routing redirects, not as duplicate page implementations under `app/prototypes/*`.

## Deployment Rules

- Never deploy this repository over the legacy MOOCKY project or its domains.
- The rebuild must use a new deployment project. The planned project name is `moocky-ai-rebuild`; treat the final project identifier and domain as unconfirmed until the deployment platform returns them.
- Run type checking, the production build, and relevant Playwright acceptance before production deployment.
- Use preview deployments during implementation. Promote to production only after the target milestone acceptance is recorded.
- After deployment, verify the returned rebuild URL before reporting completion.
- Record every production deployment URL, date, Git commit, version tag, and acceptance status below.

### Latest Rebuild Deployment

- Not deployed yet.

## Seed Page Execution Rules

The current landing page is the Lumen Atlas v0.1 seed page, not a disposable prototype.

Before every UI change, classify the change as exactly one of:

- `design token`
- `reusable component`
- `layout rule`
- `interaction/state rule`
- `one-off page-specific style`

If a style, structure, or behavior may be reused on two or more pages, do not leave it only in the current page implementation. Promote it into the design-system seed layer or record it as a candidate.

Do not hardcode colors, font sizes, radii, shadows, spacing, or motion values for the convenience of one page. Reuse existing tokens first; if a new reusable value is needed, add it to the design-system token layer and document the decision.

After each UI tuning round, update all applicable seed files:

- `design-system/tokens.json`
- `design-system/components.md`
- `design-system/layout-rules.md`
- `design-system/interaction-rules.md`
- `design-system/decisions.md`

If a pattern may become reusable but is not confirmed enough to promote, add it to `design-system/candidates.md` before encoding it as a permanent rule.

The goal is that future pages can be assembled from tokens, components, and layout rules instead of rewriting styles.

## Figma Evidence Whitelist

Only the following Figma nodes are approved as system evidence:

- `42:93`
- `60:551`
- `100:3535`
- `180:1596`
- `180:1831`
- `180:1880`
- `173:1582`
- `257:2062`
- `260:2775`
- `348:8253`
- `348:8271`
- `419:5349`
- `429:5935`
- `762:15058`
- `226:2326`

If a node is outside this whitelist, treat it as exploratory and non-authoritative unless the user explicitly approves it later.

Focused supporting references:

- `74:594` is approved only for the translucent foreground surface plus `8px` backdrop blur strategy over complex gradient/media backgrounds.
- Do not use `74:594` to infer unrelated typography, color, radius, layout, or component rules.
- `257:2062` is approved only for the Button component library: Button purposes, naming, states, locked visuals, dark variants, and Button-specific special cases.
- Do not use `257:2062` to infer unrelated page layout, non-button components, typography rules outside Button usage, or new global visual foundations.
- `260:2775` is approved only for the AI answered rail state: AI rail header, user message bubble, AI answer block, bottom AI Prompt Field, and top operation buttons.
- Do not use `260:2775` to infer unrelated non-AI components, non-AI page layout, global typography rules, or new visual foundations outside AI conversation surfaces.
- `348:8253` and `348:8271` are approved only for the landing `RecommendedCourseCard` hover interaction: collapsed card state, expanded lower panel, title transition, metadata reveal, arrow rotation, and `160ms ease-out` smart-animation behavior.
- Do not use `348:8253` or `348:8271` to infer unrelated page layout, global card-system rules, typography outside this card, or dark-mode values.
- `419:5349` is approved only for the landing update reference: reduced repeated accent usage, `neutralAction` placement, `PopularCourseStrip` color, `RecommendedCourseCard` light/dark color, `Explore Domains` `categoryCard` default/hover behavior, and the header `LogoLockup` through child node `429:5935`.
- Do not use `419:5349` to infer unrelated page layout, non-button components outside the landing card components, landing domain section, and header logo, or global typography.
- `429:5935` is approved only for the canonical MOOCKY header logo lockup: `97px` by `32px` frame, fixed wordmark outlines, attached sparkle, and Reference-aligned internal placement.
- Do not use `429:5935` to introduce `Gabarito` as a product UI typeface or infer unrelated typography rules.
- `762:15058` is approved only for the global `Tag` component: `Default`, `Compact`, and `Line` density, transparent tone relationships, padding, gap, border, typography, and the default Lucide `arrow-up-right` affordance.
- Do not use `762:15058` to infer unrelated page labels, course taxonomy, Button behavior, page layout, typography outside Tag usage, or global dark-mode foundations beyond the Tag component.
- `226:2326` is approved only as the image-asset source for `categoryCard` hover gradients.
- Do not use `226:2326` to infer new global gradient families or unrelated decorative gradient usage.

## Working With New Wireframes

When the user provides a new wireframe:

1. Classify it against the current archetypes first.
2. Reuse existing foundations and tokens before introducing anything new.
3. Reuse the global Button and Tag families where they apply.
4. Treat all other non-button/non-tag components as scene-scoped unless promoted by the design system.
5. If the wireframe or page reference is Figma-backed, use the Figma MCP double-evidence workflow before implementation.
6. If a needed pattern is missing, mark it as `Proposed Pattern` or `Open Question` instead of silently inventing it.

## Figma MCP Double-Evidence Workflow

For future modifications, component parity work, and new page creation that reference Figma:

1. Use Figma MCP/Inspect before coding for the exact node or variant being implemented.
2. Capture structured specs from MCP/Inspect for Auto Layout padding, gap, dimensions, constraints, typography, fills, variables, component state names, assets, and motion values when available.
3. Capture or fetch a screenshot of the same node or variant as the visual reference.
4. Implement from the structured specs first, mapping values to existing tokens before adding new ones.
5. Verify in browser screenshots with Playwright after implementation, including `1440px`, `1024px`, and `390px`, and both Light Mode and Dark Mode whenever the surface supports themes.
6. Compare screenshots by spacing, font size, color, alignment, border radius, shadow, interaction state, and responsive behavior.
7. Do not claim full parity when either MCP/Inspect specs or screenshot verification are missing. State the missing evidence and the closest completed check.

Screenshot-only implementation is allowed only for exploratory sketches or when the user explicitly confirms there is no inspectable Figma evidence. Spacing-sensitive values such as padding, gap, radius, constraints, and motion must not be inferred from screenshots alone when MCP/Inspect evidence exists.

## Theme Rules

- Do not derive dark mode by inversion.
- Read dark mode only from approved dark reference frames: `180:1596`, `180:1831`, and `180:1880`, or a direct user-approved focused reference such as `419:5349` for the landing card components and `762:15058` for Tag.
- Do not use other dark experiments in the same Figma file as evidence.
- If a dark value is missing locally, document the gap instead of filling it from unapproved frames.

## Display Typography Rules

- Large editorial titles must use the strict two-font construction from `docs/design-system.md`.
- Set only the first word in `Cormorant Infant Medium Italic` with `-4px` letter spacing.
- Set the remaining words in `Gayathri Thin` with `-1px` letter spacing and optically matched size.
- Do not use this display-title construction below `42px`.
- Use the display-title pair for an independent page or interface main title when the surface also has multiple subordinate section titles.
- Use `Geist Regular 16px` in shallow brown for unbacked section labels.
- Use that shallow brown Geist section-label style for subordinate section titles outside modules so they do not compete with the main title.
- Use `DM Serif Text` for titles inside backed modules and module-like card or panel surfaces.
- Do not set `DM Serif Text` module/card/panel titles above `40px`; larger titles must use the display-title pair.
- Use `Geist` for Button labels, chips, action copy, and compact control text, including CTA labels inside capsule-shaped modules.
- Use `Geist Regular` for the vast majority of UI text.
- Use Geist `Semibold` and `Bold` only for emphasis, active states, numeric emphasis, or hierarchy separation.
- Do not use Geist Thin, Medium, Extrabold, or other Geist weights.
- Do not set Geist text above `20px`; use the display-title pair or `DM Serif Text` module/card/panel titles for larger text.
- Do not create full display titles in only `Cormorant Infant`, only `Gayathri`, or `DM Serif Text`.
- Do not introduce font families outside `Cormorant Infant`, `Gayathri`, `DM Serif Text`, and `Geist`.
- Treat the MOOCKY logo as a fixed vector brand asset, not live typography; do not add the Reference source logo font to the product type system.

## Radius And Icon Rules

- Use `60%` corner smoothing for every rounded corner.
- Treat `16px`, `8px`, and `pill` as the only regular radius choices.
- Use `16px` for most cards, modules, rails, panels, inputs, and controls.
- Use `8px` for compact media, icon containers, and small inline elements.
- Use `pill` for capsule buttons, chips, rounded fields, and pill controls.
- Document any other radius as a special case before using it.
- Use Lucide for all icons: https://lucide.dev and https://github.com/lucide-icons/lucide.
- Default icons are `16px` with `1.5px` stroke.
- Treat any other icon size or stroke width as a special case tied to a confirmed component need.

## Padding Rules

- Use three rough padding tiers: `12px` for long buttons and elongated action controls, `16px` for cards and standard component containers, and `24px` for larger modules and broader content containers.
- Treat these tiers as starting points, not rigid box math.
- The core rule is visual centering: content must sit comfortably and completely within the container's perceived center.
- Micro-adjust padding when typography, icons, media, pill geometry, or density makes equal mathematical padding feel off-center.
- Keep micro-adjustments close to the spacing scale, and document repeated adjustments as component-specific special cases instead of creating new regular padding tiers.

## Button Rules

- Use the purpose-based Button kinds from `docs/design-system.md`; do not fall back to generic `brand`, `surface`, `ghost`, or `icon-only` variants as the source of truth.
- Preserve approved Button colors, visual style, padding strategy, circular button dimensions, long-button height, dark variants, and hover effects from `257:2062`.
- `Button/PrimaryAction` is the only brown filled action and may appear at most once per interface surface.
- Repeated filled actions use `Button/NeutralAction`, the design-system name for the former temporary `Button/New`.
- `Button/NeutralAction` uses default `rgba(0,5,9,0.89)`, hover `rgba(0,7,20,0.62)`, and foreground `rgba(255,255,255,0.9)`.
- Editable Button content is limited to text labels and non-action icons.
- Keep action icons that communicate behavior fixed, including the right-side `arrow-up-right` on auxiliary and primary action buttons.
- Keep the right-side `arrow-up-right` fixed on `neutralAction`; keep `arrow-right` fixed on `cardGuideAction`.
- Default Button hover motion is `160ms ease-out` from default to hover.
- `newsletterCompound` must implement input hover and action-button hover separately, even though the Figma library documents the behavior without separate variants.
- `newsletterCompound` subscribe uses the `neutralAction` treatment.
- `floatingResume` is the approved Button shadow exception: translucent fill plus `8px` backdrop blur by default, and the documented `0px 0px 8px` glow on hover.
- `categoryCard` shows description text by default, uses equal `28px` padding, and on hover swaps to a unique gradient image asset selected from `226:2326`.
- `categoryCard` hover background image layer uses `12px` blur.
- `categoryCard` hover title and description use text shadow `0px 0px 4px rgba(0,0,0,0.2)`.
- `categoryCard` icons must render through the shared Lucide/LumenIcon vector pipeline in a square intrinsic box; do not use stretched image layers, CSS masks, or raster assets for category icons.
- Figma Button component naming should use `Button/<Purpose>/<Theme>` and variants should use `State=Default` and `State=Hover`.

## AI State Rules

- Use the confirmed shared AI interaction states: `idle`, `promptSuggested`, `composerFocused`, `composing`, `sending`, `streaming`, `answered`, `error`, and `emptyContext`.
- Treat course rail, hero prompt, and header search as AI surface variants that share state logic but adapt density and layout.
- Use right-aligned user question bubbles and left-aligned `AIAnswerBlock` responses with Lucide `sparkle`.
- Use `text.aiAnswer` for light-theme AI submitted-question and answer reading text.
- Thinking state must show `Thinking`; use Lucide `sparkle` with restrained glow, rotation, and scale pulse.
- Hide starter prompt chips while the learner is typing or sending; show them again when the field is cleared; after an answer, show follow-up chips.
- `AIAnswerBlock` supports `Current lesson`, `timestamp`, and `course title` metadata, copy/save/thumbs up/thumbs down actions, and full-screen only for visually overlong answers.
- Do not add regenerate to AI answer actions unless the design system is updated.
- Use refusal responses inside `AIAnswerBlock`; explain the reason and guide back toward useful course context.
- For GPT API prototypes, use `docs/ai-system-prompt.md` as the system prompt and structured response contract.
- Render `answerMarkdown` as rich answer content; render chips and context tags from dedicated JSON fields, not by parsing Markdown.
- The UI owns Thinking animation, thought-duration display, answer actions, feedback state, and full-screen threshold decisions.

## Shadow And Blur Rules

- Use no shadows by default in generated prototypes and implementation.
- Do not add ambient card, button, rail, panel, input, or control shadows as a normal depth strategy.
- Use borders, spacing, surface contrast, and typography before considering any shadow.
- When foreground controls sit over complex gradient, image, or media backgrounds, use a translucent component background plus `8px` backdrop blur instead of a shadow.
- Translucent blur layering is for foreground controls, compact overlays, floating buttons, and labels on complex backgrounds.
- Do not use translucent blur as generic decoration on quiet surfaces or dense utility UI.
- Document any actual shadow as a special case before using it.

## Gradient Rules

- Brand gradients are controlled assets, not freeform decoration.
- Use only approved gradient asset families from `tokens.json`.
- Do not approximate approved gradients with ad hoc CSS unless the design system is updated to permit that.
- v1 defaults to the warm spectral core family only.

## Prototype Playwright Acceptance

After completing any prototype UI update, run a Playwright acceptance pass before final output whenever the local app can be built and opened.

1. Open the local page with Playwright.
2. Capture screenshots at `1440px`, `1024px`, and `390px` viewport widths in both Light Mode and Dark Mode.
3. Compare both Light Mode and Dark Mode screenshots against the available reference screenshots or approved Figma reference for the updated page or component.
4. List visual differences by category:
   - `spacing`
   - `font size`
   - `color`
   - `alignment`
   - `border radius`
   - `shadow`
   - `responsive behavior`
5. Fix confirmed differences without changing unrelated sections or components.
6. Verify hover/focus states in both modes for every updated interactive component.
7. Repeat the Playwright screenshot comparison loop up to 3 rounds.
8. In the final response, report any differences that still cannot be fully matched.

If reference screenshots are missing or incomplete, state that clearly, use the closest available Figma or browser evidence, and do not claim full visual parity. Keep Playwright artifacts out of version control; use ignored output such as `test-results`, `playwright-report`, or `output/playwright`.

## Documentation Rules

- If a design-system rule changes, update `docs/design-system.md` before updating any derivative file.
- If a component boundary changes, update `docs/component-specs.md` after the system document.
- Never let `tokens.json` encode unresolved assumptions.
