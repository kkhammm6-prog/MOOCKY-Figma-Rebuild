# Lumen Atlas Candidates v0.1

Use this file for patterns that may become reusable but are not confirmed enough to promote permanently.

## Candidate Classification Rule

Record a pattern here when:

- it may appear on two or more pages, but evidence is incomplete
- it currently depends heavily on landing-page content
- its state model is not fully confirmed
- the implementation exists, but the design-system boundary is unclear

Do not silently hardcode these patterns into a page as permanent design language.

## MostPopularSection

Potential category: `layout rule` + `reusable section composition`

Current status: candidate.

Reason: The sticky-left/progressive-right course list could apply to future discovery pages, but the current content and imagery are landing-specific.

Needs confirmation:

- Whether the social proof card is part of the reusable section or page content.
- Whether the 720/400 split applies outside landing discovery.

## LandingHeroWithAIEntry

Potential category: `reusable section composition`

Current status: candidate.

Reason: The pattern combines DisplayTitle, concise marketing copy, Chatbox, and AI chips. It is likely reusable for marketing surfaces, but future pages may need different hierarchy.

Needs confirmation:

- Whether all marketing pages should use AI entry in the first viewport.
- Whether prompt chips are a hero-only treatment or a generic AI entry affordance.

## FooterFullComposition

Potential category: `reusable component`

Current status: prototype component extracted; candidate for design-system promotion.

Reason: The full footer composition is now shared by Landing and the connected redeem prototype, but it still mixes brand title, newsletter, link column, and social row content.

Needs confirmation:

- Whether social row layout is global.
- Whether footer DisplayTitle copy changes per page or remains fixed.

## PopularFeatureCard

Potential category: `reusable component`

Current status: candidate.

Reason: The `600px x 160px` pill panel and large media background are strong and reusable-looking, but the exact card may be specific to the Most Popular landing section.

Current landing use:

- The foreground pill reuses the existing media foreground strategy from `PopularCourseStrip`: theme-aware translucent course-strip surface plus `8px` backdrop blur over the course image.
- No new color, blur, radius, or shadow token is introduced for the large featured card.

Needs confirmation:

- Whether other pages use the same large pill panel.
- Whether the DM Serif Text italic treatment is only for this card or a broader media-card title style.

## RecommendationCardReuseBeyondLanding

Potential category: `reusable component`

Current status: candidate.

Reason: The tuned `RecommendationCard` interaction is confirmed for the landing `Recommended For You` section through user-approved nodes `348:8253` and `348:8271`, but its reuse outside landing/discovery recommendation modules has not been confirmed.

Needs confirmation:

- Whether the collapsed pill to expanded `280px` panel interaction should be used on course detail, AI recommendation chips, or future browse pages.
- Whether future non-landing dark variants should reuse the landing dark card colors confirmed in node `419:5349`.
- Whether long-title collapsed pill growth remains acceptable in every future recommendation context.

## AIWorkspaceRailSurface

Potential category: `design token` + `reusable component`

Current status: candidate.

Reason: The current AI sidebar still uses the temporary translucent surface alias while footer and media overlay roles have been split into `surface.footer` and `surface.mediaOverlay`. The AI rail may need its own semantic role, but that should be confirmed from AI workspace evidence before promotion.

Needs confirmation:

- Whether AI workspace rails should be translucent, solid, or tied to `surface.base`.
- Whether the same rail surface is used in course pages, chat pages, and other learning workspaces.

## AIChatWorkspaceDarkReference

Potential category: `design token` + `theme rule`

Current status: promoted to focused evidence on 2026-04-28.

Reason: The user confirmed that the Figma file includes true Dark references for the AI Chat Page. The implementation now maps AI Chat Workspace dark mode to focused Figma nodes `375:4694`, `375:4875`, `375:4776`, `375:5204`, and `513:8444`.

Remaining open detail:

- Whether reasoning panels need a distinct dark surface or should stay unframed text surfaces.

## NonBodyTextRoles

Potential category: `design token` + `primitive component variant`

Current status: candidate.

Reason: The seed page still contains useful text sizes that are not ordinary body text, including hero supporting copy, image-backed course strip titles, and some recommendation metadata. These should not be promoted until their reuse boundary is clearer.

Needs confirmation:

- Whether hero supporting copy should become a reusable `support-18` Text variant.
- Whether `Geist 20px / 24px` course strip labels are a Text primitive role or a `PopularCourseStrip` component-specific title rule.
- Whether recommendation descriptive copy at `16px / 20px` is a reusable special copy role or local to expanded recommendation cards.

## PublicCourseDetailShell

Potential category: `layout rule` + `reusable page archetype`

Current status: candidate.

Reason: The isolated public course-detail prototype uses a course-marketing detail structure that is distinct from the confirmed compact course-detail learning workspace. It is for public visitors evaluating a course before a future checkout flow exists.

Current isolated prototype use:

- Route: `/courses/{course-slug}`; legacy `/prototypes/public-course-detail?course={course-slug}` URLs redirect to the production route without keeping a duplicate prototype implementation.
- Non-authenticated Navi Bar uses the existing guest marketing header language, without a new header variant.
- Hero uses the display-title pair, public course summary, rating, `Enroll` CTA, and a generated course-promotion image asset instead of a simulated course-player screenshot or abstract hero image.
- Body uses a two-column desktop layout with a sticky purchase panel on the right.
- AI companion value panel reuses a `226:2326` category-card gradient asset as a blurred `12px` background layer; text outside the foreground capsules uses the category-card hover white foreground plus `0px 0px 4px rgba(0,0,0,0.2)` text shadow.
- Learning outcome cards use the confirmed `categoryCard` visual treatment: equal `28px` padding, Lucide icons in the shared LumenIcon pipeline, unique `226:2326` gradient hover assets, `12px` blurred hover background layer, and white foreground text with the category-card text shadow on hover.
- Reuse rule: the page design is fixed; per-course reuse only changes course data, generated image asset, and course-relevant Lucide icons.
- `Enroll` currently routes to the existing course playback page; future production work may route to checkout first.
- The page uses `CompactProductFooter`, matching the compact footer decision from the main course prototype.

Needs confirmation:

- Whether the public course detail page also needs an authenticated-but-not-enrolled state.
- Whether the sticky purchase panel remains visible through all body sections or stops before the final CTA/footer.
- Whether the AI companion gradient panel should become a reusable marketing/value-callout pattern or remain page-specific.
- Whether the public course outcome card should be promoted as a `LearningOutcomeCategoryCard` variant or remain a page-specific adaptation of `categoryCard`.
- Whether `CoursePriceValue`, `CoursePreviewHero`, `CoursePurchasePanel`, `SyllabusPreviewAccordion`, `LearningOutcomeCard`, and `CourseTestimonialStrip` should be promoted as reusable components.
- Whether generated course-promotion image assets should become a reusable asset pattern or be replaced by real course media stills.

## RewardStoreShell

Potential category: `layout rule` + `reusable page archetype`

Current status: active product surface; reusable archetype still candidate.

Reason: The redeem surface treats reward redemption as a discovery-led marketing/store surface rather than a compact account dashboard. It is now reachable from the authenticated Navi Bar coins entry on the product route `/redeem`, while the reusable page archetype remains a candidate until more reward surfaces reuse it.

Current product use:

- Route: `/redeem`.
- Authenticated Navi Bar coins utility routes to this page.
- Page header with reward balance and section anchors remains local to the redeem surface.
- Hero uses the display-title pair and large product imagery to establish the reward-store narrative before showing account details.
- Physical merchandise rewards lead the page; digital credits and course access are demoted into a secondary boost section.
- Curated reward categories use horizontal `RewardCategoryStrip` candidates: borderless left image crop, right-side quiet text panel, and landing `categoryCard`-style hover image reveal using local mesh-gradient assets from Figma node `226:2326`.
- Milestone cards use unsigned point values and keep the circular sequence marker fixed at the card's upper-left corner, separate from the title/value copy stack.
- Redemption history remains available as a lower-priority account module near the bottom of the page.
- Reward merchandise imagery is stored as local bitmap assets under `public/assets/redeem/`.

Needs confirmation:

- Whether the production redeem page should be a marketing shell, authenticated account shell, or a hybrid of both.
- Whether physical reward categories become first-class product inventory or remain prototype-only visual examples.
- Whether `RewardDropHero`, `RewardBentoCard`, `DigitalRewardBoost`, `RewardCategoryStrip`, `MilestonePath`, and `RedemptionHistoryStatement` should be promoted into reusable components.
- Whether this page should support dark mode before being connected to the authenticated coins entry.
