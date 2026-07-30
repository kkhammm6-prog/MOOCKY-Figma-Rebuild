# Public Course Detail Page Design Record

Status: production course-detail archetype.

Route:

- Default review page: `/courses/cognitive-interface-architecture`
- Course-specific data route: `/courses/{course-slug}`
- Legacy prototype URL: `/prototypes/public-course-detail?course={course-slug}` redirects to `/courses/{course-slug}` and must not host a duplicate page implementation.

Reuse principle:

- The page design is fixed.
- Reuse must not change layout, section order, spacing, button kinds, sticky purchase-card behavior, footer type, typography system, card treatments, or responsive rules.
- Per-course reuse may only replace course data: title, category label, subtitle, summary, rating text, instructor profile, course modules, learning outcomes, outcome icons, AI prompt text, about/testimonial copy, and the course promotional image asset.

Fixed page structure:

- Guest marketing Navi Bar.
- Breadcrumb row.
- Two-column hero with the global display-title pair on the left and a `4:3` promotional image on the right.
- Two-column body with the main content column and sticky purchase panel.
- Instructor card.
- Course Structure accordion list.
- Learning Outcomes cards using the category-card hover language.
- AI study companion value panel using the existing blurred category gradient background.
- Text-only Architect's Vision block.
- Architect Testimonials cards.
- CompactProductFooter.

Motion behavior:

- Course-detail sections use the shared `reveal-on-view` runtime for the same calm opacity and upward-translate entrance used elsewhere in the product.
- The compact footer remains excluded from viewport reveal.

Course promotional image workflow:

- Each course owns one `4:3` image asset under `public/assets/generated`.
- Prompt style target: match the original course-promotion image language: clean editorial lighting, translucent subject/model, layered glass/study-plane composition, restrained palette.
- Course-specific image variants may add subtle noise and gentle blur, but should not switch into a new art direction unless explicitly approved.
- Image must contain no text, logos, or watermarks.
- Image should support the course title semantically without changing the page layout.

Nature Architecture validation course:

- Slug: `nature-architecture`
- Source entry point: homepage Nature Architecture card.
- Detail URL: `/courses/nature-architecture`
- Promotional image asset: `/assets/generated/nature-architecture-course-promo.png`
- Prompt:

```text
Course promotional image for Nature Architecture: a translucent biomorphic pavilion model arranged over layered glass study planes, soft daylight, premium editorial composition, quiet blue-green and warm botanical accents, subtle film grain and gentle depth blur, no text.
```

Ethics of Adaptive Algorithms validation course:

- Slug: `ethics-of-adaptive-algorithms`
- Source entry point: homepage Popular Course Strip item `Ethics of Adaptive Algorithms`.
- Detail URL: `/courses/ethics-of-adaptive-algorithms`
- Promotional image asset: `/assets/generated/ethics-adaptive-algorithms-course-promo-imagegen.png`
- Prompt:

```text
Course promotional image for Ethics of Adaptive Algorithms: a translucent decision lattice and algorithmic accountability model arranged over layered glass study planes, adaptive feedback loops shown as delicate etched pathways, soft daylight, premium editorial composition, quiet blue-green foundation with warm amber ethical review accents, subtle film grain and gentle depth blur, no text.
```
