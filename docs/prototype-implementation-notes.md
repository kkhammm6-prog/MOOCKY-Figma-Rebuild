# Prototype Implementation Notes

This document records implementation lessons from the MOOCKY landing and AI chat prototype. It is not a design-system authority.

## Figma MCP Workflow

- Use Figma MCP before implementation when exact node evidence exists. Screenshots are useful for visual parity, but MCP adds structure: node sizes, Auto Layout padding, gap, constraints, text, layer hierarchy, component states, variables, motion values, and asset URLs.
- Future Figma-backed modifications and new page creation must use the double-evidence workflow: MCP/Inspect for exact specs before coding, then screenshots/Playwright for visual acceptance after coding.
- Do not infer spacing-sensitive values such as padding, gap, radius, constraints, or motion from screenshots alone when MCP/Inspect evidence is available.
- If MCP/Inspect is unavailable, use a supplied Figma inspect screenshot for exact values or record the missing evidence before claiming parity.
- Treat new prototype nodes as page-scoped references unless they are already listed as approved system evidence.
- Download MCP assets into `public/assets/figma` before coding so the prototype does not depend on short-lived Figma URLs.

## Token And Styling Translation

- Keep `docs/design-system.md` as the normative design source and map Figma values to existing semantic tokens first.
- Tailwind can help with layout translation, but MOOCKY-specific behavior should stay in semantic classes and CSS variables.
- Replace non-system Figma font fallbacks with the approved families: `Cormorant Infant`, `Gayathri`, `DM Serif Text`, and `Geist`.

## Interaction Rules

- Default interaction motion uses `160ms ease-out`.
- Use opacity plus slight vertical movement for reveal-on-view entrance.
- Use borders, surface contrast, spacing, and typography before shadows.
- For AI answer actions and chips, render dedicated JSON fields directly instead of parsing Markdown.

## AI API Shape

- The prototype route calls OpenAI or Kimi from the server only.
- `OPENAI_API_KEY` and `MOONSHOT_API_KEY` must remain server-side.
- `OPENAI_MODEL` and `MOONSHOT_MODEL` can override the defaults.
- For demo speed, Kimi thinking is disabled by default with `thinking: { type: "disabled" }`.
- To restore real provider reasoning, set `MOONSHOT_THINKING_MODE=enabled`; only then should the stream forward `reasoning_content` as UI `reasoning_delta`.
- The UI owns thinking animation, thought duration, feedback state, and full-screen threshold behavior.

## Reuse Boundary

- Button remains the only global component family.
- Landing cards, FAQ, Chatbox, and AI page structures are reusable prototype components, but they should not be promoted to design-system components without explicit confirmation.
