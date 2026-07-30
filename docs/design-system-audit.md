# MOOCKY Design System Audit

## Scope

This document audits only the following three desktop high-fidelity Figma nodes:

- Landing page: `42:93`
- Course page, video paused / progress rail: `60:551`
- Course page, video playing / AI rail: `100:3535`

It does **not** define missing pages, mobile behavior, or unseen brand strategy.

### Status legend

- `confirmed`: directly visible in the provided high-fidelity screens or their Figma structure
- `inferred`: a cautious, reusable interpretation of repeated patterns across the screens
- `open question`: not stable enough to lock into the design system yet

## Design Principles

| Observation | Status | Evidence / note |
| --- | --- | --- |
| The UI relies on a calm, low-chrome canvas with hierarchy created by type, spacing, and imagery rather than heavy shadows or hard containers. | `confirmed` | All three screens use an off-white page background, white panels, light borders, and almost no visible drop shadows. |
| Public browsing and logged-in learning views belong to the same visual family rather than separate brands. | `confirmed` | Landing, paused course, and playing course views share the same palette, typography mix, pill controls, and repeated footer block. |
| Large editorial headlines are reserved for key page identity moments; the rest of the UI is intentionally restrained and utility-led. | `confirmed` | Landing hero and course title use display typography; navigation, cards, filters, tabs, metadata, and side panels use compact UI type. |
| Rounded geometry is a core organizing rule, especially for pills, chips, inputs, icon buttons, and cards. | `confirmed` | Repeated radii include full-pill shapes, `12px`, `16px`, and `28px`. |
| The system appears to distinguish browsing/exploration states from active learning states through content density and media treatment. | `inferred` | Landing emphasizes discovery cards and abstract cover art; course pages emphasize reading, watching, progress, and AI support. |
| The product likely wants AI to feel embedded beside learning rather than replacing the course surface. | `inferred` | The AI mode occupies a persistent right rail while the main lesson content remains visible. |
| Whether this balance should be formalized as a product principle for all future pages is not yet clear. | `open question` | Only one course and one landing flow are visible. |

## Visual Language

| Observation | Status | Evidence / note |
| --- | --- | --- |
| Base visual tone is warm-neutral rather than pure grayscale. | `confirmed` | Primary dark text and accents use brown-tinted values such as `#3E332E`, `#826855`, `#8B7C71`, `#86817D`. |
| Surfaces alternate between soft off-white canvas and near-white panels. | `confirmed` | Background uses `#F7F7F7`; cards and controls use `#FFFFFF` or `rgba(255,255,255,0.9)`. |
| Borders are subtle and light, often semi-transparent, and do more work than shadows. | `confirmed` | Repeated border colors include `rgba(0,0,45,0.09)`, `rgba(0,0,47,0.15)`, and `#E8E8EC`. |
| The visual system mixes editorial display type with practical sans-serif UI text. | `confirmed` | Headings use `Cormorant Infant` + `Gayathri`; UI copy uses `Geist`; some card titles use `DM Serif Text`. |
| Outline-style icons are used as functional accents rather than decorative illustrations. | `confirmed` | Lucide-style icons repeat across header, pills, filters, tabs, status, media controls, and AI rail. |
| Abstract blurred gradient imagery is a repeated course-browse motif. | `confirmed` | Landing hero sections, popular cards, recommended cards, and paused course banner all use blurred, painterly color fields. |
| Real imagery is introduced when the user is actively watching or engaging with course content. | `confirmed` | The playing state switches the main media from abstract cover art to an instructor video still. |
| The blurred gradient art may be a placeholder system for course covers rather than a final brand asset style. | `open question` | It repeats strongly, but only on browse/paused states; we do not know whether real course art will replace it. |
| The canonical brand wordmark treatment is not settled. | `open question` | Landing header uses `Gabarito` for `MOOCKY`; course headers use `Geist` for the same wordmark. |
| The canonical product spelling is not settled. | `open question` | The UI shows `MOOCKY`, but the footer copyright line shows `MOOCY`. |

## Design Tokens Draft

Draft token names below are for implementation convenience only. The names are inferred; the values are taken from the comps.

### Color Tokens

| Candidate token | Observed value | Status | Evidence / note |
| --- | --- | --- | --- |
| `color.bg.canvas` | `#F7F7F7` | `confirmed` | Main page background on landing and course pages. |
| `color.surface.primary` | `#FFFFFF` / `rgba(255,255,255,0.9)` | `confirmed` | Cards, pills, header controls, right rail, footer surface. |
| `color.text.primary` | `#3E332E` | `confirmed` | Main headings, primary CTA text, strong labels. |
| `color.text.secondary` | `#86817D` | `confirmed` | Section labels, muted text, input placeholder styling. |
| `color.text.body` | `#595C5D` / `#60646C` | `confirmed` | Course descriptions and FAQ answers. |
| `color.accent.primary` | `#826855` | `confirmed` | Filled CTA pills, selected accents, active indicator. |
| `color.accent.secondary` | `#8B7C71` | `confirmed` | Smaller accent buttons and circular action buttons. |
| `color.accent.deep` | `#815E46` | `confirmed` | Current-progress text in the paused curriculum rail. |
| `color.success.bg` | `#E6F6EB` | `confirmed` | Live-learning status chip background. |
| `color.success.fg` | `rgba(0,146,75,0.64)` | `confirmed` | Live state and completed curriculum metadata. |
| `color.border.soft` | `rgba(0,0,45,0.09)` | `confirmed` | Card, chip, and rail borders. |
| `color.border.medium` | `rgba(0,0,47,0.15)` | `confirmed` | Dividers, tab outlines, stronger control outlines. |
| `color.overlay.translucent` | `rgba(255,255,255,0.8)` | `confirmed` | Video overlay controls and some panel treatments. |
| A neutral ramp with warmer undertones is likely more important than a cold gray ramp. | `inferred` | Most neutrals lean brown/stone rather than blue-gray. |
| Dark mode or alternate theme tokens are not defined by the provided screens. | `open question` | One moon icon appears in the player controls, but no alternate theme comp is shown. |

### Typography Tokens

| Candidate token | Observed value | Status | Evidence / note |
| --- | --- | --- | --- |
| `font.display.serifItalic` | `Cormorant Infant Medium Italic` | `confirmed` | Landing hero, course title, footer heading. |
| `font.display.sansLight` | `Gayathri Thin` | `confirmed` | Display title pairing in landing and course pages. |
| `font.display.sansRegular` | `Gayathri Regular` | `confirmed` | Mixed display word treatment in landing and footer. |
| `font.ui.default` | `Geist Regular` | `confirmed` | Navigation, buttons, body copy, chips, metadata, tabs, inputs. |
| `font.ui.strong` | `Geist SemiBold / Bold` | `confirmed` | Emphasis inside body copy, some labels, supporting emphasis. |
| `font.feature.serif` | `DM Serif Text` | `confirmed` | Course card titles, FAQ questions, some supporting headings. |
| `font.brand.alt` | `Gabarito SemiBold` | `confirmed` | Landing wordmark and `+` badge in header. |
| `font.meta.alt` | `Inter Regular` | `confirmed` | Footer copyright line only. |
| `type.size.display.lg` | `80px` | `confirmed` | Major display words like `Design`, `Neural`, `Follow`. |
| `type.size.display.md` | `68px` / `72px` | `confirmed` | Secondary display words paired with the serif italic. |
| `type.size.heading.sm` | `24px` | `confirmed` | Featured card title on landing. |
| `type.size.sectionTitle` | `16px` | `confirmed` | Section labels such as `Instructor`, `Why Take This Course?`, `Most Popular This Week`. |
| `type.size.body.md` | `14px` | `confirmed` | Body copy, question chips, metadata, FAQ answers. |
| `type.size.body.sm` | `12px` | `confirmed` | Pills, compact controls, placeholders, timestamps. |
| `type.size.ui.lg` | `20px` | `confirmed` | Some FAQ question titles and floating course title pills. |
| The canonical brand type stack is not settled. | `open question` | `Gabarito`, `Geist`, and `Inter` all appear in brand-adjacent places. |

### Radius, Border, and Spacing Tokens

| Candidate token | Observed value | Status | Evidence / note |
| --- | --- | --- | --- |
| `radius.full` | `99px` / `9999px` | `confirmed` | Buttons, chips, search, filters, footer input, tab groups. |
| `radius.sm` | `8px` | `confirmed` | Small media and inline panels. |
| `radius.md` | `12px` | `confirmed` | Curriculum items, some internal cards. |
| `radius.lg` | `16px` | `confirmed` | Cards, FAQ rows, featured blocks, content panels. |
| `radius.xl` | `28px` | `confirmed` | AI right rail container. |
| `border.width.default` | `1px` | `confirmed` | Most cards, chips, inputs, and panels. |
| `border.width.subtle` | `0.5px` | `confirmed` | Some segmented controls and light-outline tabs on the playing page. |
| `space.2`, `space.4`, `space.8`, `space.12`, `space.16`, `space.20`, `space.24`, `space.32`, `space.48`, `space.80`, `space.100` | observed across the screens | `confirmed` | These values repeat in padding, gaps, control spacing, and section separation. |
| The spacing system likely follows a mostly 4px-derived rhythm with a few 10px / 14px / 28px exceptions. | `inferred` | Many values cluster around 4-based steps, but there are exceptions in compact controls. |
| Motion tokens are not recoverable from the static comps alone. | `open question` | No timing, easing, or transition spec is visible. |

## Layout System Draft

| Observation | Status | Evidence / note |
| --- | --- | --- |
| Desktop artboards are designed at `1440px` width. | `confirmed` | Footer container explicitly uses `w-[1440px]`; screen captures align with desktop artboard proportions. |
| A centered top navigation shell uses an inner width around `1132px`. | `confirmed` | Landing and course headers both use `w-[1132px]`. |
| Landing content uses a centered single-column flow with generous vertical section gaps. | `confirmed` | Landing main content uses `max-w-[1212px]`, `px-[40px]`, and repeated `gap-[100px]`. |
| Course pages use a two-column study layout: main content area plus a sticky right rail. | `confirmed` | Both course states show a wide left column and a `384px` sticky right panel. |
| The course layout gap between main content and right rail is `12px`. | `confirmed` | Visible in both course page structures. |
| The main learning content column is approximately `810px` wide in the paused state. | `confirmed` | Explicit in the Figma structure for the paused course page. |
| Section headings often sit inside small padded rows before the content block begins. | `confirmed` | Repeated in `Most Popular`, `Explore Domains`, `Instructor`, `Why Take This Course?`, and FAQ. |
| Footer is a reusable large-format block with two horizontal bands: newsletter/legal links, then social handles. | `confirmed` | The same footer appears on landing and both course states. |
| Sticky behavior is part of the intended desktop layout. | `confirmed` | Header and right rail are marked sticky in course page structure. |
| The design system probably needs at least two shells: public/discovery shell and authenticated/learning shell. | `inferred` | Shared visual language, but different header contents and page structure. |
| Tablet/mobile collapse rules are not available yet. | `open question` | No smaller breakpoints or alternative frames were provided. |
| Grid rules for card carousels and overflow on landing are not fully defined. | `open question` | The recommended course strip appears horizontally clipped; behavior is not specified. |

## Reusable Component Inventory

| Component | Observed states / variants | Status | Evidence / note |
| --- | --- | --- | --- |
| Global header | public landing header; authenticated learning header | `confirmed` | Same spacing language, different actions and utilities. |
| Wordmark block | brand text + sparkle mark | `confirmed` | Repeats in landing and course headers. |
| Pill button | text only; text + icon; icon only; filled; outlined/white | `confirmed` | `Log In`, `Explore MOOCKY`, `Subscribe`, `More`, `Linkedin`, `Contact me`, icon-only actions. |
| Search / prompt field | compact header search; large landing prompt card; footer newsletter input | `confirmed` | Three related but distinct input forms. |
| Choice chip | icon + text pill for quick actions | `confirmed` | Landing quick intents and AI suggested prompts both use pill chips. |
| Segmented control / tab switcher | landing not shown; course detail/discussion tabs; progress/AI rail tabs | `confirmed` | Both course states use segmented groups with active indicators. |
| Course card | featured editorial card; floating pill title on image; recommended course card | `confirmed` | Multiple card compositions on landing. |
| Domain / benefit tile | icon + short title; optional description | `confirmed` | Landing domain tiles and course benefit tiles share the same family. |
| Accordion row | expanded FAQ item; collapsed FAQ item | `confirmed` | Landing FAQ section. |
| Instructor card | avatar, name, role, bullet facts, outbound actions | `confirmed` | Same structure in both course states. |
| Curriculum list item | completed; current; upcoming | `confirmed` | Paused course right rail shows three clear visual states. |
| Right rail container | progress mode; AI mode | `confirmed` | Same footprint, different internal content. |
| Media panel | paused poster/video teaser; active player with control strip | `confirmed` | Both course states. |
| Footer newsletter block | heading, supporting copy, email field, subscribe button, legal/social lists | `confirmed` | Repeated verbatim across surfaces. |
| Pagination / carousel controls for landing collections | not enough evidence | `open question` | Cards overflow, but no explicit carousel state or arrows are fully defined. |
| Form validation, error, disabled, loading, and empty states | not shown | `open question` | No negative or edge states are included in the provided comps. |

## Interaction Pattern Hypotheses

| Observation | Status | Evidence / note |
| --- | --- | --- |
| The right rail is intended to stay visible while the user scrolls the lesson. | `confirmed` | Sticky positioning is defined for the rail. |
| Users can switch between progress tracking and AI assistance without leaving the lesson page. | `inferred` | Two rail states share the same position, dimensions, and segmented switch affordance. |
| The chevrons-right-left icon likely toggles the rail mode or swaps panel emphasis. | `inferred` | It sits adjacent to the two rail tabs in the paused view. |
| Landing intent chips likely prefill or steer the large prompt card. | `inferred` | They sit directly under the hero prompt area and are phrased as user goals. |
| The AI prompt suggestion chips likely inject canned questions into the composer. | `inferred` | They are phrased as ready-to-send prompts and sit above the AI input area. |
| FAQ rows likely expand/collapse inline. | `inferred` | One row is open and the others are closed with directional indicators. |
| Curriculum items likely open lesson units and indicate completion/current state. | `inferred` | Each row has title, metadata, and visual status treatment. |
| The learning video likely supports subtitles, fullscreen/expand, settings, theme, and volume controls. | `confirmed` | These icons are present in the playing-state control strip. |
| Whether the AI rail is synchronized to playback time, transcript position, or selected lesson text is not defined. | `open question` | No transcript or time-linked messages are shown. |
| Whether the FAQ allows multiple rows open at once is not defined. | `open question` | Only one expanded example is shown. |
| Hover, focus, pressed, and keyboard states are not visible. | `open question` | Only default visual states are provided. |

## Content Style Observations

| Observation | Status | Evidence / note |
| --- | --- | --- |
| Display copy is short and identity-setting; utility copy is concise and task-oriented. | `confirmed` | `Design Your Knowledge`, `Neural Architecture`, and `Follow Where We Are` contrast with short labels like `Instructor`, `More`, and `Subscribe`. |
| Section naming is plain and descriptive rather than metaphorical. | `confirmed` | `Most Popular This Week`, `Explore Domains`, `Recommended For You`, `Instructor`, `Why Take This Course?`, `Course Detail`. |
| CTA labels are direct verbs or verb phrases. | `confirmed` | `Log In`, `Explore MOOCKY`, `Subscribe`, `Contact me`, `More`. |
| Educational copy mixes editorial phrasing with operational metadata. | `confirmed` | Course descriptions are expressive, while timestamps, review counts, and completion labels remain factual. |
| AI prompt copy is written as first-person learner intent. | `confirmed` | `Boost My Career Path`, `Build My Interest`, `What is transformer?`, `Inspire me how I could apply this to my research.` |
| The voice appears calm and non-gamified rather than aggressively motivational. | `inferred` | Copy avoids streaks, badges, hype language, or progress celebration graphics. |
| Grammar and naming consistency are not production-ready yet. | `open question` | Examples include `MOOCY` vs `MOOCKY`, `What is transformer?`, and `Ask anything you curious in this context...`. |
| Whether display headlines should always use title case and mixed-script typography is not settled. | `open question` | It is consistent in the three screens, but the sample size is small. |

## Priority Open Questions Before Formalizing the System

| Question | Status | Why it blocks systemization |
| --- | --- | --- |
| What is the canonical brand spelling: `MOOCKY` or `MOOCY`? | `open question` | Naming must be fixed before token, component, and content libraries are locked. |
| What is the canonical wordmark font: `Gabarito`, `Geist`, or another approved logo asset? | `open question` | Header and footer reuse depend on a stable brand asset. |
| Are the blurred abstract course covers final art direction or temporary placeholders? | `open question` | This affects media guidelines, card templates, and content operations. |
| What are the responsive rules for landing, course split layout, and footer? | `open question` | Current evidence is desktop-only. |
| Should the AI rail be a persistent course-level pattern or a contextual optional panel? | `open question` | This changes shell layout, component architecture, and navigation rules. |
| What are the missing interactive states: hover, focus, loading, error, disabled, empty, success? | `open question` | A reusable design system cannot be production-ready without them. |

