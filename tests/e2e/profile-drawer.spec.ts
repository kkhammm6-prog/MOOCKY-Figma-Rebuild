import { expect, test } from "@playwright/test";

test("authenticated learner can open and close the persistent profile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.setItem("moocky-demo-authenticated-v1", "true");
    window.localStorage.setItem("moocky-theme", "dark");
  });
  await page.reload();

  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);
  await expect(page.getByRole("button", { name: "Open learner profile" })).toBeVisible();

  await page.getByRole("button", { name: "Open learner profile" }).click();
  const drawer = page.getByRole("dialog", { name: "Learner profile" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("heading", { name: "Avery Lin" })).toBeVisible();
  await expect(drawer.getByText("184.5")).toBeVisible();
  await expect(drawer.getByText("Nature Architecture")).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Profile & settings" })).toHaveAttribute("href", "/settings");

  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
});
