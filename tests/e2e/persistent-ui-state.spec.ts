import { expect, test } from "@playwright/test";

test("theme and demo login state persist when navigating between product pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);

  await page.goto("/courses/nature-architecture");
  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);
  await expect(page.getByRole("link", { name: "MyProgress" })).toHaveAttribute("href", "/my-progress");

  await page.getByRole("link", { name: "MyProgress" }).click();
  await expect(page).toHaveURL(/\/my-progress$/);
  await expect(page.locator("[class*='prototypeRoot']")).toHaveClass(/themeDark/);
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);

  await page.goto("/ai");
  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);
});
