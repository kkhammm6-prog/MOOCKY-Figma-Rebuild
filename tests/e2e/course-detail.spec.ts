import { expect, test } from "@playwright/test";

test("course structure expands and collapses by module", async ({ page }) => {
  await page.goto("/courses/nature-architecture");

  const firstModule = page.getByRole("button", { name: /Patterns in Living Systems/ });
  const secondModule = page.getByRole("button", { name: /Materials and Microclimates/ });
  const thirdModule = page.getByRole("button", { name: /Regenerative Spatial Strategy/ });

  await expect(firstModule).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Branching, shells, and growth logic")).toBeVisible();
  await expect(secondModule).toHaveAttribute("aria-expanded", "false");
  await expect(thirdModule).toHaveAttribute("aria-expanded", "false");

  await secondModule.click();
  await expect(firstModule).toHaveAttribute("aria-expanded", "false");
  await expect(secondModule).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Detailing for moisture, repair, and material aging")).toBeVisible();

  await secondModule.click();
  await expect(secondModule).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Detailing for moisture, repair, and material aging")).toHaveCount(0);

  await thirdModule.focus();
  await page.keyboard.press("Space");
  await expect(thirdModule).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Measuring regeneration through feedback loops")).toBeVisible();
});
