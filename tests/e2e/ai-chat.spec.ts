import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test, type Page, type Route, type TestInfo } from "@playwright/test";

const mockResponse = {
  answerKind: "answer",
  surface: "heroPrompt",
  conversationTitle: "Designer Life",
  answerMarkdown:
    "A good path is to connect your current interests with a concrete learning outcome.\n\n## Recommended starting point\n\nStart with **Nature Architecture** because it links systems thinking, biological patterns, and design practice.",
  contextTags: [
    {
      type: "courseTitle",
      label: "Course",
      value: "Nature Architecture",
    },
  ],
  followUpChips: ["How should I start?", "Compare these courses", "Make a weekly plan"],
  courseRecommendationCards: [
    {
      id: "nature-architecture",
      title: "Nature Architecture",
      description:
        "A masterclass in Cognitive Synthesis. Bridge the gap between biological neural networks and synthetic intelligence through immersive structural design.",
      provider: "Offered By MIT",
      rating: "4.5/5.0",
      reviews: "682 Reviews",
      href: "/course?course=nature-architecture",
    },
  ],
};
const mockPersonalizedCards = [
  mockResponse.courseRecommendationCards[0],
  {
    ...mockResponse.courseRecommendationCards[0],
    id: "quantum-computing-fundamentals",
    title: "Quantum Computing Fundamentals",
  },
  {
    ...mockResponse.courseRecommendationCards[0],
    id: "cognitive-interface-architecture",
    title: "Cognitive Interface Architecture",
  },
  {
    ...mockResponse.courseRecommendationCards[0],
    id: "ethics-adaptive-algorithms",
    title: "Ethics of Adaptive Algorithms",
  },
];

async function mockAiStream(page: Page, options: { includeReasoning?: boolean; response?: typeof mockResponse; responseDelayMs?: number } = {}) {
  await page.route("**/api/moocky-ai/stream", async (route: Route) => {
    if (options.responseDelayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.responseDelayMs));
    }

    const includeReasoning = options.includeReasoning ?? true;
    const response = options.response ?? mockResponse;
    const body = [
      ...(includeReasoning
        ? [
            { type: "reasoning_delta", delta: "Inspecting the learner goal. " },
            { type: "reasoning_delta", delta: "Choosing a course recommendation path. " },
          ]
        : []),
      { type: "content_delta", delta: JSON.stringify(response) },
      { type: "done", response },
    ]
      .map((event) => `data: ${JSON.stringify(event)}\n\n`)
      .join("");

    await route.fulfill({
      body,
      contentType: "text/event-stream; charset=utf-8",
      status: 200,
    });
  });
}

async function captureAiScreenshots(page: Page, testInfo: TestInfo, theme: "light" | "dark") {
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath(`ai-chat-${theme}-${width}.png`),
    });
  }
}

async function startSlowFinalizingStream(delayMs = 1200): Promise<{ server: Server; url: string }> {
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    });
    response.write(`data: ${JSON.stringify({ type: "content_delta", delta: JSON.stringify(mockResponse) })}\n\n`);
    setTimeout(() => {
      response.write(`data: ${JSON.stringify({ type: "done", response: mockResponse })}\n\n`);
      response.end();
    }, delayMs);
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;

  return { server, url: `http://127.0.0.1:${address.port}/stream` };
}

async function startSlowAnswerDeltaStream(options: { delayMs?: number; response?: typeof mockResponse; sendCardsReady?: boolean } = {}): Promise<{ server: Server; url: string }> {
  const delayMs = options.delayMs ?? 1200;
  const responseEnvelope = options.response ?? mockResponse;
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    });
    response.write(`data: ${JSON.stringify({ type: "answer_delta", delta: "A good path is to connect your current interests " })}\n\n`);
    response.write(`data: ${JSON.stringify({ type: "answer_delta", delta: "with a concrete learning outcome." })}\n\n`);
    if (options.sendCardsReady) {
      response.write(`data: ${JSON.stringify({ type: "cards_ready", cards: mockPersonalizedCards })}\n\n`);
    }
    setTimeout(() => {
      response.write(`data: ${JSON.stringify({ type: "done", response: responseEnvelope })}\n\n`);
      response.end();
    }, delayMs);
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;

  return { server, url: `http://127.0.0.1:${address.port}/stream` };
}

test("ai chat workspace supports default, streaming reasoning, cards, follow-ups, and sidebar collapse", async ({ page }, testInfo) => {
  await mockAiStream(page, { responseDelayMs: 1000 });
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ai");

  await expect(page.locator(".ai-default-prompt-chips")).toBeVisible();
  await expect(page.locator(".prompt-chip", { hasText: "What is transformer?" })).toBeVisible();
  await expect(page.locator(".ai-sidebar-records button")).toHaveCount(0);
  await expect(page.locator(".ai-sidebar")).toHaveCSS("width", "350px");
  await expect(page.locator(".ai-conversation")).toHaveCSS("width", "720px");
  await expect(page.locator(".ai-composer")).toHaveCSS("width", "720px");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" }).locator("svg")).toHaveClass(/lucide-chess-pawn/);
  await page.getByRole("button", { name: "Personalized Suggestion" }).hover();
  await expect(page.getByRole("button", { name: "Personalized Suggestion" })).toHaveCSS("background-color", "rgb(249, 249, 251)");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" }).locator(".mode-icon-shell")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" }).locator(".mode-icon-shell")).toHaveCSS("width", "28px");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" })).toHaveCSS("font-size", "14px");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" })).toHaveCSS("line-height", "16px");

  await page.getByLabel("Collapse sidebar").click();
  await expect(page.locator(".ai-sidebar")).toHaveCSS("width", "60px");
  await expect(page.locator(".ai-sidebar")).toHaveCSS("height", "100px");
  await expect(page.locator(".ai-sidebar")).toHaveCSS("min-height", "100px");
  await expect(page.locator(".ai-sidebar")).toHaveCSS("align-items", "flex-start");
  await expect(page.locator(".ai-sidebar-head")).toHaveCSS("flex-direction", "column");
  await expect(page.locator(".ai-sidebar-head")).toHaveCSS("width", "36px");
  await expect(page.locator(".ai-sidebar-head")).toHaveCSS("height", "76px");
  await expect(page.locator(".ai-sidebar-head")).toHaveCSS("gap", "8px");
  await expect(page.locator(".ai-sidebar-modes")).toHaveCSS("visibility", "hidden");
  await expect(page.locator(".ai-sidebar-records")).toHaveCSS("visibility", "hidden");
  const collapsedTransition = await page.locator(".ai-sidebar").evaluate((element) => getComputedStyle(element).transitionProperty);
  expect(collapsedTransition).toContain("height");
  expect(collapsedTransition).toContain("width");
  expect(collapsedTransition).toContain("flex-basis");
  await page.getByLabel("Expand sidebar").click();
  await expect(page.locator(".ai-sidebar")).toHaveCSS("width", "350px");

  await page.getByRole("button", { name: "Personalized Suggestion" }).click();
  const activeRecord = page.locator(".ai-sidebar-records button").first();
  await expect(activeRecord).toHaveCSS("height", "32px");
  await expect(activeRecord).toHaveCSS("padding", "12px");
  await expect(activeRecord).toHaveCSS("gap", "12px");
  await expect(activeRecord).toHaveCSS("border-radius", "12px");
  await expect(activeRecord).toHaveCSS("font-size", "14px");
  await expect(activeRecord).toHaveCSS("line-height", "16px");
  await expect(activeRecord).toHaveCSS("background-color", "rgb(249, 249, 251)");
  await expect(activeRecord.locator(".record-mode-icon")).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(activeRecord.locator(".record-mode-icon")).toHaveCSS("opacity", "0.27");
  await expect(page.locator(".ai-sidebar-records")).toHaveCSS("gap", "0px");
  const longPrompt =
    "Recommend courses for becoming an AI designer while I am transitioning from architecture, product strategy, and creative coding into machine learning systems.";
  await page.locator("#ai-composer-input").fill(longPrompt);
  await page.getByLabel("Send message").click();

  const submittedBubble = page.locator(".user-question-bubble", { hasText: "transitioning from architecture" });
  await expect(submittedBubble).toBeVisible();
  const bubbleHeight = await submittedBubble.evaluate((element) => element.getBoundingClientRect().height);
  expect(bubbleHeight).toBeGreaterThan(40);
  await expect(page.locator(".reasoning-live")).toBeVisible();
  await expect(page.locator(".thinking-status")).toHaveText("Thinking...");
  await expect(page.locator(".reasoning-live .reasoning-body")).toHaveText("Checking Context...");
  const thinkingMetrics = await page.locator(".thinking-glyph.is-active").evaluate((element) => {
    const glyph = getComputedStyle(element);
    const spark = element.querySelector(".thinking-spark-shell");
    const glow = element.querySelector(".thinking-glow");

    if (!spark || !glow) {
      throw new Error("Thinking glyph internals are missing.");
    }

    const sparkStyle = getComputedStyle(spark);
    const glowStyle = getComputedStyle(glow);

    return {
      glyphHeight: Number.parseFloat(glyph.height),
      glyphWidth: Number.parseFloat(glyph.width),
      glowHeight: Number.parseFloat(glowStyle.height),
      glowWidth: Number.parseFloat(glowStyle.width),
      sparkAnimation: sparkStyle.animationName,
      sparkHeight: Number.parseFloat(sparkStyle.height),
      sparkWidth: Number.parseFloat(sparkStyle.width),
    };
  });
  expect(thinkingMetrics.glyphWidth).toBe(32);
  expect(thinkingMetrics.glyphHeight).toBe(32);
  expect(thinkingMetrics.glowWidth).toBe(30);
  expect(thinkingMetrics.glowHeight).toBe(30);
  expect(thinkingMetrics.sparkWidth).toBeGreaterThan(13);
  expect(thinkingMetrics.sparkWidth).toBeLessThan(14);
  expect(thinkingMetrics.sparkHeight).toBeGreaterThan(13);
  expect(thinkingMetrics.sparkHeight).toBeLessThan(14);
  expect(thinkingMetrics.sparkAnimation).toBe("ai-thinking-spark");
  await expect(page.locator(".reasoning-summary", { hasText: /Reasoning|Thinking/ })).toBeVisible();
  await expect(page.locator(".thinking-glyph.is-active")).toHaveCount(0);
  await expect(page.locator(".answer-static-sparkle")).toBeVisible();
  const staticSparkleMetrics = await page.locator(".answer-static-sparkle").evaluate((element) => {
    const icon = element.querySelector(".icon");

    if (!icon) {
      throw new Error("Answered static sparkle icon is missing.");
    }

    const elementStyle = getComputedStyle(element);
    const iconStyle = getComputedStyle(icon);

    return {
      animationName: iconStyle.animationName,
      height: Number.parseFloat(elementStyle.height),
      iconHeight: Number.parseFloat(iconStyle.height),
      iconWidth: Number.parseFloat(iconStyle.width),
      width: Number.parseFloat(elementStyle.width),
    };
  });
  expect(staticSparkleMetrics.width).toBe(32);
  expect(staticSparkleMetrics.height).toBe(32);
  expect(staticSparkleMetrics.iconWidth).toBeGreaterThan(13);
  expect(staticSparkleMetrics.iconWidth).toBeLessThan(14);
  expect(staticSparkleMetrics.iconHeight).toBeGreaterThan(13);
  expect(staticSparkleMetrics.iconHeight).toBeLessThan(14);
  expect(staticSparkleMetrics.animationName).toBe("none");
  await expect(page.locator(".ai-answer-meta .reasoning-panel")).toBeVisible();
  await expect(page.locator(".ai-answer-meta .thought-line", { hasText: "Thought for" })).toHaveCount(0);
  await expect(page.locator(".ai-markdown-view", { hasText: "Recommended starting point" })).toBeVisible();
  await expect(page.locator(".ai-markdown-view")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".ai-course-card", { hasText: "Nature Architecture" })).toBeVisible();
  await expect(page.locator(".ai-course-card")).toHaveCount(4);
  await expect(page.locator(".ai-course-card", { hasText: "Quantum Computing Fundamentals" })).toBeVisible();
  await expect(page.locator(".answer-followups")).toHaveCSS("column-gap", "4px");
  await expect(page.locator(".answer-followups")).toHaveCSS("row-gap", "4px");
  await expect(page.locator(".answer-action-bar")).toHaveCSS("margin-top", "0px");
  await expect(page.locator(".answer-action-bar")).toHaveCSS("padding", "2px");
  const answeredAlignment = await page.locator(".ai-answer-content").evaluate((element) => {
    const body = element.querySelector(".answer-body")?.getBoundingClientRect();
    const followups = element.querySelector(".answer-followups")?.getBoundingClientRect();
    const actions = element.querySelector(".answer-action-bar")?.getBoundingClientRect();

    if (!body || !followups || !actions) {
      throw new Error("Answered alignment nodes are missing.");
    }

    return {
      actionsLeft: actions.left,
      bodyLeft: body.left,
      followupsLeft: followups.left,
    };
  });
  expect(Math.abs(answeredAlignment.followupsLeft - answeredAlignment.bodyLeft)).toBeLessThanOrEqual(1);
  expect(Math.abs(answeredAlignment.actionsLeft - answeredAlignment.bodyLeft)).toBeLessThanOrEqual(1);
  await page.locator(".ai-course-card-carousel").hover();
  await expect(page.getByLabel("Browse next course recommendations")).toHaveCSS("opacity", "1");
  await expect(page.getByLabel("Browse previous course recommendations")).toHaveCount(0);
  await page.getByLabel("Browse next course recommendations").click();
  await expect(page.getByLabel("Browse previous course recommendations")).toBeVisible();
  await expect(page.getByLabel("Browse previous course recommendations")).toHaveCSS("opacity", "1");
  await expect(page.getByLabel("Browse next course recommendations")).toHaveCSS("opacity", "1");
  await expect(page.locator(".ai-course-card", { hasText: "Nature Architecture" })).toHaveAttribute("href", "/course?course=nature-architecture");

  await page.getByLabel("Copy answer").click();
  await expect(page.locator(".answer-action-feedback", { hasText: "Copied" })).toBeVisible();

  await page.getByRole("button", { name: "How should I start?" }).click();
  await expect(page.locator(".user-question-bubble", { hasText: "How should I start?" })).toBeVisible();

  await captureAiScreenshots(page, testInfo, "light");
  await page.getByLabel("Switch to dark mode").click();
  await expect(page.locator(".prototype-page")).toHaveClass(/theme-dark/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Personalized Suggestion" }).hover();
  await expect(page.getByRole("button", { name: "Personalized Suggestion" })).toHaveCSS("background-color", "rgb(24, 25, 27)");
  await expect(page.getByRole("button", { name: "Personalized Suggestion" }).locator(".mode-icon-shell")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await captureAiScreenshots(page, testInfo, "dark");
});

test("ai chat auto-sends URL question", async ({ page }) => {
  await mockAiStream(page, { includeReasoning: false });
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto("/ai?question=What%20is%20transformer%3F");

  await expect(page.locator(".user-question-bubble", { hasText: "What is transformer?" })).toBeVisible();
  await expect(page.locator(".ai-markdown-view", { hasText: "Nature Architecture" })).toBeVisible();
  await expect(page.locator(".ai-course-card")).toHaveCount(0);
  await expect(page.locator(".ai-answer-meta .reasoning-panel")).toHaveCount(0);
  await expect(page.locator(".ai-answer-meta .thought-line", { hasText: "Thought for" })).toBeVisible();
});

test("ai chat reveals answer text before personalized cards", async ({ page }) => {
  const finalMarker = "The final typewriter marker is visible only after the reveal completes.";
  const longResponse = {
    ...mockResponse,
    answerMarkdown: `${Array(20)
      .fill("This answer paragraph is intentionally long so the typewriter reveal remains observable during automated inspection.")
      .join(" ")}\n\n## Final marker\n\n${finalMarker}`,
  };

  await mockAiStream(page, { includeReasoning: false, response: longResponse });
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto("/ai");
  await page.getByRole("button", { name: "Personalized Suggestion" }).click();
  await page.locator("#ai-composer-input").fill("Show the typewriter reveal.");
  await page.getByLabel("Send message").click();

  await expect(page.locator(".ai-markdown-view[aria-busy='true']")).toBeVisible();
  await expect(page.locator(".ai-course-card")).toHaveCount(0);
  await expect(page.locator(".ai-markdown-view", { hasText: finalMarker })).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".ai-markdown-view")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".ai-course-card", { hasText: "Nature Architecture" })).toBeVisible();
  await expect(page.locator(".ai-course-card")).toHaveCount(4);
});

test("ai chat streams visible answer text before the final envelope", async ({ page }) => {
  const finalMarker = "The final streamed-answer marker should appear without replaying the typewriter.";
  const longResponse = {
    ...mockResponse,
    answerMarkdown: `${Array(20)
      .fill("This final answer is intentionally long so a replayed typewriter would noticeably delay cards and the final marker.")
      .join(" ")}\n\n## Final marker\n\n${finalMarker}`,
  };
  const stream = await startSlowAnswerDeltaStream({ delayMs: 1200, response: longResponse, sendCardsReady: true });

  await page.route("**/api/moocky-ai/stream", (route) => route.continue({ url: stream.url }));
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  try {
    await page.goto("/ai");
    await page.getByRole("button", { name: "Personalized Suggestion" }).click();
    await page.locator("#ai-composer-input").fill("Stream the answer body first.");
    await page.getByLabel("Send message").click();

    await expect(page.locator(".ai-markdown-view[aria-busy='true']", { hasText: "connect your current interests" })).toBeVisible();
    await expect(page.locator(".ai-course-card", { hasText: "Nature Architecture" })).toBeVisible({ timeout: 1000 });
    await expect(page.locator(".ai-course-card")).toHaveCount(4);
    const carouselHandle = await page.locator(".ai-course-card-carousel").elementHandle();
    if (!carouselHandle) {
      throw new Error("Streaming card carousel did not mount.");
    }
    await expect(page.locator(".answer-followups")).toHaveCount(0);
    await expect(page.locator(".answer-action-bar")).toHaveCount(0);
    await expect(page.locator(".thinking-glyph.is-active")).toBeVisible();

    await expect(page.locator(".ai-markdown-view", { hasText: finalMarker })).toBeVisible({ timeout: 2000 });
    await expect(page.locator(".ai-markdown-view")).toHaveAttribute("aria-busy", "false");
    expect(
      await page.evaluate((carousel) => document.querySelector(".ai-course-card-carousel") === carousel, carouselHandle),
    ).toBe(true);
    await expect(page.locator(".answer-followups")).toBeVisible();
    await expect(page.locator(".answer-action-bar")).toBeVisible();
  } finally {
    await new Promise<void>((resolve, reject) => {
      stream.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});

test("ai chat keeps the thinking surface while finalizing", async ({ page }) => {
  const stream = await startSlowFinalizingStream();

  await page.route("**/api/moocky-ai/stream", (route) => route.continue({ url: stream.url }));
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  try {
    await page.goto("/ai");
    await page.locator("#ai-composer-input").fill("Show a short recommendation while finalizing.");
    await page.getByLabel("Send message").click();

    await expect(page.locator(".reasoning-live")).toBeVisible();
    await expect(page.locator(".thinking-status")).toHaveText("Thinking...");
    await expect(page.locator(".ai-answer-meta .thought-line", { hasText: "Finalizing answer..." })).toHaveCount(0);
    await expect(page.locator(".thinking-glyph.is-active")).toBeVisible();
    await expect(page.locator(".answer-static-sparkle")).toHaveCount(0);

    await expect(page.locator(".ai-markdown-view", { hasText: "Recommended starting point" })).toBeVisible();
    await expect(page.locator(".thinking-glyph.is-active")).toHaveCount(0);
    await expect(page.locator(".answer-static-sparkle")).toBeVisible();
  } finally {
    await new Promise<void>((resolve, reject) => {
      stream.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});
