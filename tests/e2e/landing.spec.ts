import { expect, test, type Page, type TestInfo } from "@playwright/test";

const REFERENCE = {
  light: {
    actionBg: "rgba(0, 5, 9, 0.89)",
    actionColor: "rgba(255, 255, 255, 0.9)",
    actionHoverBg: "rgba(0, 7, 20, 0.62)",
    categoryCopy: "rgb(134, 129, 125)",
    categoryText: "rgba(0, 7, 20, 0.62)",
    courseStripSurface: "rgba(255, 255, 255, 0.8)",
    courseStripText: "rgb(28, 32, 36)",
    pageColor: "rgb(62, 51, 46)",
    recommendationBody: "rgb(96, 100, 108)",
    recommendationPanel: "rgb(255, 255, 255)",
    recommendationTitle: "rgb(62, 51, 46)",
  },
  dark: {
    actionBg: "rgba(252, 253, 255, 0.937)",
    actionColor: "rgba(0, 0, 0, 0.84)",
    actionHoverBg: "rgba(241, 247, 254, 0.71)",
    categoryCopy: "rgb(123, 117, 113)",
    categoryText: "rgba(241, 247, 254, 0.71)",
    courseStripSurface: "rgba(29, 29, 33, 0.78)",
    courseStripText: "rgb(237, 238, 240)",
    pageColor: "rgb(237, 232, 225)",
    recommendationBody: "rgb(176, 180, 186)",
    recommendationPanel: "rgb(0, 0, 0)",
    recommendationTitle: "rgb(237, 232, 225)",
  },
} as const;

type ThemeName = keyof typeof REFERENCE;

async function expectButtonIconsInheritCurrentColor(page: Page) {
  const violations = await page.locator("button, a.lumen-button").evaluateAll((controls) =>
    controls.flatMap((control, index) => {
      const controlColor = window.getComputedStyle(control).color;
      const label = control.getAttribute("aria-label") ?? control.textContent?.trim() ?? `control-${index}`;
      const imageIcons = Array.from(control.querySelectorAll<HTMLImageElement>("img.icon, .lumen-button-icon img, img[src$='.svg']"));
      const svgIcons = Array.from(control.querySelectorAll<SVGElement>("svg.icon, .lumen-button-icon svg"));
      const iconProblems = svgIcons
        .map((icon, iconIndex) => ({
          controlColor,
          iconColor: window.getComputedStyle(icon).color,
          iconIndex,
          label,
          stroke: icon.getAttribute("stroke"),
        }))
        .filter(({ controlColor, iconColor, stroke }) => iconColor !== controlColor || (stroke !== null && stroke !== "currentColor"));

      if (imageIcons.length > 0) {
        return [
          {
            imageIconCount: imageIcons.length,
            label,
            problem: "button-icon-image-asset",
          },
          ...iconProblems,
        ];
      }

      return iconProblems;
    }),
  );

  expect(violations).toEqual([]);
}

async function expectActionControlColor(page: Page, selector: string, expectedColor: string, expectedBackgroundColor: string) {
  const sendButton = page.locator(selector).first();
  await expect(sendButton).toHaveCSS("color", expectedColor);
  await expect(sendButton).toHaveCSS("background-color", expectedBackgroundColor);

  const sendIcon = await sendButton.evaluate((button) => {
    const icon = button.querySelector<SVGElement>("svg.icon");

    return {
      buttonColor: window.getComputedStyle(button).color,
      iconColor: icon ? window.getComputedStyle(icon).color : null,
      stroke: icon?.getAttribute("stroke"),
    };
  });

  expect(sendIcon.iconColor).toBe(sendIcon.buttonColor);
  expect(sendIcon.stroke).toBe("currentColor");
}

async function expectActionHoverColor(page: Page, selector: string, expectedBackgroundColor: string) {
  const control = page.locator(selector).first();
  await control.hover();
  await expect(control).toHaveCSS("background-color", expectedBackgroundColor);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);
}

async function expectParentHoverLeavesActionDefault(page: Page, parentSelector: string, actionSelector: string, expectedBackgroundColor: string) {
  const parent = page.locator(parentSelector).first();
  const action = parent.locator(actionSelector);
  await parent.hover({ position: { x: 12, y: 12 } });
  await expect(action).toHaveCSS("background-color", expectedBackgroundColor);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);
}

async function expectChatboxSendColor(page: Page, expectedColor: string, expectedBackgroundColor: string) {
  const sendButton = page.locator(".chatbox .chatbox-send");
  await expect(sendButton).toHaveCSS("color", expectedColor);
  await expect(sendButton).toHaveCSS("background-color", expectedBackgroundColor);

  const sendIcon = await sendButton.evaluate((button) => {
    const icon = button.querySelector<SVGElement>("svg.icon");

    return {
      buttonColor: window.getComputedStyle(button).color,
      iconColor: icon ? window.getComputedStyle(icon).color : null,
      stroke: icon?.getAttribute("stroke"),
    };
  });

  expect(sendIcon.iconColor).toBe(sendIcon.buttonColor);
  expect(sendIcon.stroke).toBe("currentColor");
}

async function expectLandingThemeMatchesReference(page: Page, theme: ThemeName, options: { chatReady: boolean }) {
  const reference = REFERENCE[theme];

  await expect(page.locator(".prototype-page")).toHaveClass(new RegExp(`theme-${theme}`));
  await expect(page.locator(".prototype-page")).toHaveCSS("color", reference.pageColor);
  await expect(page.locator(".logo-lockup .logo-mark")).toHaveCSS("color", reference.pageColor);
  await expectChatboxSendColor(page, reference.actionColor, options.chatReady ? reference.actionBg : reference.actionHoverBg);

  if (options.chatReady) {
    await expect(page.locator(".chatbox .chatbox-send")).toBeEnabled();
    await expectActionHoverColor(page, ".chatbox .chatbox-send", reference.actionHoverBg);
  } else {
    await expect(page.locator(".chatbox .chatbox-send")).toBeDisabled();
  }

  const firstNeutralButton = page.locator(".lumen-button-neutralAction").first();
  await expect(firstNeutralButton).toHaveCSS("color", reference.actionColor);
  await expect(firstNeutralButton).toHaveCSS("background-color", reference.actionBg);
  await expectActionHoverColor(page, ".lumen-button-neutralAction", reference.actionHoverBg);

  const firstPopular = page.locator(".popular-course-strip").first();
  await expect(firstPopular).toHaveAttribute("href", "/courses/ethics-of-adaptive-algorithms");
  const firstPopularPanel = firstPopular.locator(".popular-course-strip-panel");
  await expect(firstPopularPanel).toHaveCSS("background-color", reference.courseStripSurface);
  await expect(firstPopularPanel).toHaveCSS("height", "60px");
  await expect(firstPopularPanel).toHaveCSS("gap", "16px");
  await expect(firstPopularPanel).toHaveCSS("padding-top", "16px");
  await expect(firstPopularPanel).toHaveCSS("padding-right", "16px");
  await expect(firstPopularPanel).toHaveCSS("padding-bottom", "16px");
  await expect(firstPopularPanel).toHaveCSS("padding-left", "20px");
  await expect(firstPopular.locator(".popular-course-strip-title")).toHaveCSS("color", reference.courseStripText);
  await expect(firstPopular.locator("button")).toHaveCount(0);
  await expectActionControlColor(page, ".popular-course-strip-action", reference.actionColor, reference.actionBg);
  await expectParentHoverLeavesActionDefault(page, ".popular-course-strip", ".popular-course-strip-action", reference.actionBg);
  await expectActionHoverColor(page, ".popular-course-strip-action", reference.actionHoverBg);

  const featuredPopularPill = page.locator(".featured-popular-pill");
  await expect(featuredPopularPill).toHaveCSS("background-color", reference.courseStripSurface);
  await expect(featuredPopularPill).toHaveCSS("backdrop-filter", "blur(8px)");
  await expect(featuredPopularPill.locator("h3")).toHaveCSS("color", reference.courseStripText);
  await expect(featuredPopularPill.locator("p")).toHaveCSS("color", reference.courseStripText);
  await expect(featuredPopularPill.locator("p")).toHaveText("Explore the intersection of design and the natural world.");

  const firstDomain = page.locator(".domain-tile").first();
  await expect(firstDomain.locator("svg.domain-icon")).toHaveCount(1);
  await expect(firstDomain.locator("img")).toHaveCount(0);
  await expect(firstDomain).toHaveCSS("padding-top", "28px");
  await expect(firstDomain.locator("h3")).toHaveCSS("color", reference.categoryText);
  await expect(firstDomain.locator("p")).toHaveCSS("color", reference.categoryCopy);
  await firstDomain.hover();
  const hoverBackgroundFilter = await firstDomain.evaluate((element) => window.getComputedStyle(element, "::before").filter);
  expect(hoverBackgroundFilter).toBe("blur(12px)");
  await expect(firstDomain.locator("h3")).toHaveCSS("color", "rgba(255, 255, 255, 0.9)");
  await expect(firstDomain.locator("h3")).toHaveCSS("text-shadow", "rgba(0, 0, 0, 0.2) 0px 0px 4px");
  await expect(firstDomain.locator("p")).toHaveCSS("color", "rgba(255, 255, 255, 0.9)");
  await page.mouse.move(0, 0);

  const firstRecommendation = page.locator(".recommendation-card").first();
  const firstRecommendationPanel = firstRecommendation.locator(".recommendation-panel");
  await expect(firstRecommendation).toHaveAttribute("href", "/courses/nature-architecture");
  await expect(firstRecommendation.locator("button")).toHaveCount(0);
  await expect(firstRecommendationPanel).toHaveCSS("background-color", reference.recommendationPanel);
  await expect(firstRecommendation.locator(".recommendation-title-default")).toHaveCSS("color", reference.recommendationTitle);
  await expectActionControlColor(page, ".recommendation-action", reference.actionColor, reference.actionBg);
  await firstRecommendation.hover();
  await expect(firstRecommendationPanel).toHaveCSS("height", "280px");
  await expect(firstRecommendation.locator(".recommendation-title-expanded")).toHaveCSS("color", reference.recommendationTitle);
  await expect(firstRecommendation.locator(".recommendation-copy p")).toHaveCSS("color", reference.recommendationBody);
  await expect(firstRecommendation.locator(".recommendation-copy strong")).toHaveCSS("color", reference.recommendationTitle);
  await expect(firstRecommendation.locator(".recommendation-meta")).toHaveCSS("color", reference.recommendationTitle);
  await expect(firstRecommendation.locator(".recommendation-action")).toHaveCSS("background-color", reference.actionBg);
  await firstRecommendation.locator(".recommendation-action").hover();
  await expect(firstRecommendation.locator(".recommendation-action")).toHaveCSS("background-color", reference.actionHoverBg);
  await page.mouse.move(0, 0);
  await expectParentHoverLeavesActionDefault(page, ".recommendation-card", ".recommendation-action", reference.actionBg);

  await expectButtonIconsInheritCurrentColor(page);
}

async function captureThemeReferenceScreenshots(page: Page, testInfo: TestInfo, theme: ThemeName) {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);

  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 1200 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.mouse.move(0, 0);
    await page.waitForTimeout(220);
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath(`landing-${theme}-${width}.png`),
    });
  }

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.locator(".recommendation-card").first().hover();
  await page.waitForTimeout(220);
  await page.screenshot({
    fullPage: true,
    path: testInfo.outputPath(`landing-${theme}-recommendation-hover-1440.png`),
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);
}

test("landing page renders core design-system interactions", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto("/");

  await expect(page.locator(".marketing-header")).toBeVisible();
  const logo = page.locator(".logo-lockup .logo-mark");
  await expect(logo).toHaveCount(1);
  await expect(logo).toHaveAttribute("viewBox", "0 0 97 32");
  await expect(logo).toHaveCSS("width", "97px");
  await expect(logo).toHaveCSS("height", "32px");
  await expect(page.locator(".logo-lockup img, .logo-lockup span")).toHaveCount(0);
  await expect(page.locator(".display-title-first").first()).toHaveText("Design");
  await expect(page.locator(".hero-copy")).toHaveClass(/is-visible/);
  await expect(page.locator(".hero-prompt")).toHaveClass(/is-visible/);
  const heroRevealDelays = await page.locator(".hero-section .reveal-on-view").evaluateAll((items) =>
    items.map((item) => window.getComputedStyle(item).getPropertyValue("--reveal-delay").trim()),
  );
  expect(heroRevealDelays).toEqual(["0ms", "160ms"]);
  await expect(page.locator("#popular-title")).toHaveText("Most Popular This Week");
  await expect(page.locator(".popular-course-strip")).toHaveCount(6);
  await expect(page.getByRole("button", { name: "Boost My Career Path" }).locator("svg.icon")).toHaveClass(/lucide-route/);
  await expect(page.getByRole("button", { name: "Analyze my course" }).locator("svg.icon")).toHaveClass(/lucide-book-open-check/);
  await expect(page.locator(".domain-tile")).toHaveCount(6);
  await expect(page.locator(".recommendation-card")).toHaveCount(3);
  await expect(page.locator(".faq-item")).toHaveCount(4);
  await expect(page.locator(".site-footer")).not.toHaveClass(/reveal-on-view/);
  await expect(page.locator(".recommendation-card.is-expanded")).toHaveCount(0);
  const faqChevron = page.locator(".faq-item button .icon").first();
  await expect(faqChevron).toHaveCSS("width", "24px");
  await expect(faqChevron).toHaveCSS("height", "24px");
  await expect(faqChevron).toHaveAttribute("stroke", "currentColor");

  await expect(page.locator(".popular-sticky")).toHaveCSS("position", "sticky");
  await expect(page.locator(".popular-sticky")).toHaveCSS("top", "0px");
  await expect(page.locator(".section-shell").nth(1)).toHaveCSS("margin-top", "100px");
  await expect(page.locator(".recommendation-panel").first()).toHaveCSS("height", "60px");
  await expect(page.locator(".recommendation-panel").first()).toHaveCSS("width", "264px");
  await expect(page.locator(".recommendation-panel").first()).toHaveCSS("border-radius", "30px");
  const longTitlePanelWidth = await page.locator(".recommendation-panel").nth(2).evaluate((element) => element.getBoundingClientRect().width);
  expect(longTitlePanelWidth).toBeGreaterThan(264);
  await expect(page.locator(".recommendation-title-default").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".recommendation-title-expanded").first()).toHaveCSS("opacity", "0");
  await expect(page.locator(".recommendation-copy p").first()).toHaveCSS("opacity", "0");
  await expectLandingThemeMatchesReference(page, "light", { chatReady: false });

  await page.locator(".chatbox").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });
  await expect(page).toHaveURL("/");

  await page.locator("#landing-chatbox-input").fill("design systems");
  await expect(page.locator(".chatbox")).toHaveClass(/is-ready/);
  await expect(page.locator(".chatbox .chatbox-send")).toBeEnabled();
  await expectChatboxSendColor(page, REFERENCE.light.actionColor, REFERENCE.light.actionBg);

  await page.locator(".recommendation-card").first().hover();
  await expect(page.locator(".recommendation-panel").first()).toHaveCSS("height", "280px");
  await expect(page.locator(".recommendation-panel").first()).toHaveCSS("border-radius", "0px");
  await expect(page.locator(".recommendation-title-default").first()).toHaveCSS("opacity", "0");
  await expect(page.locator(".recommendation-title-expanded").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".recommendation-copy p").first()).toHaveCSS("opacity", "1");

  const loginArrow = await page.locator(".marketing-header .login-action").evaluate((element) => {
    const icon = element.querySelector<SVGElement>(".lumen-button-action-icon");
    const button = window.getComputedStyle(element);

    return {
      buttonColor: button.color,
      iconColor: icon ? window.getComputedStyle(icon).color : null,
      stroke: icon?.getAttribute("stroke"),
      strokeWidth: icon?.getAttribute("stroke-width"),
    };
  });

  expect(loginArrow.iconColor).toBe(loginArrow.buttonColor);
  expect(loginArrow.stroke).toBe("currentColor");
  expect(loginArrow.strokeWidth).toBe("1.5");
  await expect(page.locator(".lumen-button-primaryAction")).toHaveCount(1);
  await expect(page.locator(".lumen-button-neutralAction")).toHaveCount(4);
  await expectButtonIconsInheritCurrentColor(page);

  await expect(page.getByRole("button", { name: "Explore more" }).locator(".lumen-button-action-icon")).toBeVisible();
  const moreButtons = page.getByRole("button", { name: "More" });
  await expect(moreButtons.first().locator(".lumen-button-action-icon")).toBeVisible();
  await expect(moreButtons.nth(1).locator(".lumen-button-action-icon")).toBeVisible();
  await expect(moreButtons.first()).toHaveCSS("background-color", REFERENCE.light.actionBg);
  await expect(page.locator('img[src*="arrow-up-right"]')).toHaveCount(0);

  await captureThemeReferenceScreenshots(page, testInfo, "light");
  await page.setViewportSize({ width: 1440, height: 1200 });

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expectLandingThemeMatchesReference(page, "dark", { chatReady: true });
  await captureThemeReferenceScreenshots(page, testInfo, "dark");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("landing nav demo switches from guest to authenticated preview", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.locator(".marketing-header")).toHaveClass(/is-guest/);
  await expect(page.locator(".login-action")).toBeVisible();

  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);
  await expect(page.locator(".login-action")).toHaveCount(0);
  await expect(page.locator(".header-search-form")).toHaveCSS("width", "300px");
  await expect(page.locator(".header-search-form input")).toHaveAttribute("placeholder", "Tell us what you want to achieve");
  await expect(page.locator(".header-search-icon svg.icon")).toHaveClass(/lucide-search/);
  await expect(page.getByRole("button", { name: "Notifications" }).locator("svg.icon")).toHaveClass(/lucide-bell/);
  await expect(page.getByRole("link", { name: "MOOCKY coins" }).locator("svg.icon")).toHaveClass(/lucide-coins/);
  await expect(page.getByRole("link", { name: "MOOCKY coins" })).toHaveAttribute("href", "/redeem");
  await expect(page.getByRole("button", { name: "Open learner profile" }).locator("svg.icon")).toHaveClass(/lucide-circle-user/);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);

  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator(".header-search-form")).toHaveCSS("width", "32px");
  await expect(page.locator(".header-search-form input")).toHaveCSS("opacity", "0");
});

test("landing nav demo keeps login reachable on narrow guest preview", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  await expect(page.locator(".marketing-header")).toHaveClass(/is-guest/);
  await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  await expect(page.locator(".marketing-header .lumen-button-primaryAction")).toHaveCSS("display", "none");

  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.locator(".marketing-header")).toHaveClass(/is-authenticated/);
  await expect(page.locator(".header-search-form")).toHaveCSS("width", "32px");
});

test("landing nav search activates as an input and submits to AI", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.locator(".header-search-form")).toHaveCSS("width", "32px");

  await page.locator(".header-search-form").click();
  await expect(page.locator(".marketing-header")).toHaveClass(/is-searching/);
  await expect(page.locator(".header-search-form")).toHaveCSS("width", "232px");
  await expect(page.locator(".header-utility-panel")).toHaveCSS("display", "none");

  await page.getByLabel("Tell us what you want to achieve").fill("career growth");
  await page.getByLabel("Tell us what you want to achieve").press("Enter");
  await expect(page).toHaveURL(/\/ai\?question=career%20growth$/);
});

test("landing chatbox submits with Enter only when ready", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto("/");

  const input = page.locator("#landing-chatbox-input");
  const sendButton = page.locator(".chatbox .chatbox-send");

  await expect(sendButton).toBeDisabled();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/$/);

  await input.fill("design systems");
  await expect(sendButton).toBeEnabled();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/ai\?question=design%20systems$/);
});
