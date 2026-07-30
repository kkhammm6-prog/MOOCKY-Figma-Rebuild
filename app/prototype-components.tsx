"use client";

import { CSSProperties, FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthenticatedHeaderControls } from "./components/AuthenticatedHeaderControls";
import { Button } from "./components/Button";
import { PopularCourseStrip, RecommendedCourseCard } from "./components/CourseCards";
import { LumenIcon } from "./components/LumenIcon";
import { LogoMark } from "./components/LogoMark";
import { SiteFooter } from "./components/SiteFooter";
import { Text } from "./components/Text";
import { useDemoAuthState } from "./hooks/useDemoAuthState";
import { useRevealOnView } from "./hooks/useRevealOnView";
import {
  AiResponseEnvelope,
  asset,
  avatarFiles,
  chatChips,
  domains,
  fallbackAiResponse,
  faqItems,
  popularCourses,
  recommendations,
  starterChats,
  ThemeName,
} from "./prototype-data";

const THEME_KEY = "moocky-theme";
const CHATS_KEY = "moocky-chat-titles";

type DisplayTitleSize = "large" | "medium" | "compact" | "mobile";

function useThemeState() {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }
  }, []);

  const updateTheme = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return [theme, updateTheme] as const;
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <LumenIcon className={className} name={name} />;
}

function DisplayTitle({
  firstWord,
  remainder,
  className = "",
  firstSizePx,
  size = "large",
}: {
  firstWord: string;
  remainder: string;
  className?: string;
  firstSizePx?: number;
  size?: DisplayTitleSize;
}) {
  const safeFirstSize = firstSizePx === undefined ? undefined : Math.max(firstSizePx, 50);
  const style =
    safeFirstSize === undefined
      ? undefined
      : ({
          "--display-first-size": `${safeFirstSize}px`,
          "--display-rest-size": `${Math.round(safeFirstSize * 0.85 * 100) / 100}px`,
          "--display-first-tracking": `${Math.round(safeFirstSize * -0.05 * 100) / 100}px`,
          "--display-rest-tracking": `${Math.round(safeFirstSize * 0.85 * -0.015 * 100) / 100}px`,
          "--display-rest-gap": `${Math.round(Math.max(10, safeFirstSize * 0.125) * 100) / 100}px`,
        } as CSSProperties);

  return (
    <h1 className={`display-title display-title-size-${size} ${className}`} style={style}>
      <span className="display-title-first">{firstWord}</span>
      <span className="display-title-rest">{remainder}</span>
    </h1>
  );
}

function MarketingHeader({
  theme,
  onThemeToggle,
}: {
  theme: ThemeName;
  onThemeToggle: () => void;
}) {
  const [isAuthenticated, setIsAuthenticated] = useDemoAuthState();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const themeToggleLabel = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <header className={`marketing-header ${isAuthenticated ? "is-authenticated" : "is-guest"} ${isAuthenticated && isSearchActive ? "is-searching" : ""}`}>
      <div className="marketing-header-inner">
        <div className="header-left">
          <a className="logo-lockup" href="/" aria-label="MOOCKY home">
            <LogoMark />
          </a>
          {isAuthenticated ? (
            <a className="prototype-button prototype-button-ghost" href="/my-progress">
              <Icon name="loader.svg" />
              <span>MyProgress</span>
            </a>
          ) : (
            <button className="prototype-button prototype-button-ghost" type="button">
              <Icon name="loader.svg" />
              <span>MyProgress</span>
            </button>
          )}
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <AuthenticatedHeaderControls onSearchActiveChange={setIsSearchActive} onThemeToggle={onThemeToggle} themeToggleLabel={themeToggleLabel} />
          ) : (
            <>
              <button className="prototype-button prototype-button-standalone" onClick={onThemeToggle} type="button" aria-label={themeToggleLabel}>
                <Icon name="eclipse.svg" />
              </button>
              <Button
                className="login-action"
                kind="auxiliaryAction"
                label="Log In"
                onClick={() => {
                  setIsAuthenticated(true);
                  setIsSearchActive(false);
                }}
              />
              <Button kind="primaryAction" label="Explore MOOCKY" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Chatbox({ initialLabel = "The best course for my career" }: { initialLabel?: string }) {
  const [value, setValue] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const trimmedValue = value.trim();
  const ready = trimmedValue.length > 0;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ready) {
      return;
    }

    window.location.href = `/ai?question=${encodeURIComponent(trimmedValue)}`;
  };
  const submitFromKeyboard = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <form className={`chatbox ${ready ? "is-ready" : ""} ${importOpen ? "is-import-open" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor="landing-chatbox-input">
        Ask MOOCKY AI
      </label>
      <textarea
        id="landing-chatbox-input"
        aria-label="Ask MOOCKY AI"
        onChange={(event) => setValue(event.currentTarget.value)}
        onInput={(event) => setValue(event.currentTarget.value)}
        onKeyDown={submitFromKeyboard}
        placeholder={initialLabel}
        value={value}
      />
      <div className="chatbox-bottom">
        <div className="chatbox-import-row">
          <button
            aria-expanded={importOpen}
            aria-label={importOpen ? "Close import menu" : "Open import menu"}
            className="chatbox-plus"
            onClick={() => setImportOpen((open) => !open)}
            type="button"
          >
            <Icon name="plus.svg" />
          </button>
          <div className="chatbox-import-menu" aria-hidden={!importOpen}>
            <button type="button">
              <Icon name="image.svg" />
              Image
            </button>
            <button type="button">
              <Icon name="video.svg" />
              Video
            </button>
            <button type="button">
              <Icon name="file.svg" />
              File
            </button>
          </div>
        </div>
        {/* Empty Chatbox send stays in the lighter hover-tone disabled state until real text is present. */}
        <Button aria-label="Send message" className="chatbox-send" disabled={!ready} kind="cardGuideAction" type="submit" />
      </div>
    </form>
  );
}

function PromptChips() {
  return (
    <div className="prompt-chips">
      {chatChips.map((chip) => (
        <button className="prompt-chip" key={chip.label} type="button">
          <Icon name={chip.icon} />
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}

function MostPopular() {
  return (
    <section className="section-shell popular-section reveal-on-view" aria-labelledby="popular-title">
      <div className="popular-grid">
        <div className="popular-sticky">
          <div className="section-heading-row popular-heading-row">
            <Text as="h2" id="popular-title" tone="muted" variant="label-16">
              Most Popular This Week
            </Text>
          </div>
          <div className="social-proof-card">
            <Text tone="primary" variant="module-statement-20">
              We have over 1 millions learners around the world See how others are improving with MOOCKY.
            </Text>
            <div className="social-proof-footer">
              <div className="avatar-stack" aria-hidden="true">
                {avatarFiles.map((avatar) => (
                  <img alt="" key={avatar} src={asset(avatar)} />
                ))}
                <span>+</span>
              </div>
              <Button className="small-action" kind="neutralAction" label="Explore more" />
            </div>
          </div>
          <div className="featured-popular-card">
            <img alt="" src={asset("popular-feature.png")} />
            <div className="featured-popular-pill">
              <div>
                <Text as="h3" tone="primary" variant="module-title-40-italic">
                  Nature Architecture
                </Text>
                <Text tone="muted" variant="body-12">
                  Explore the intersection of design and the natural world.
                </Text>
              </div>
              <Button className="small-action" href="/courses/nature-architecture" kind="neutralAction" label="Register Now" />
            </div>
          </div>
        </div>
        <div className="popular-list" aria-label="Popular course list">
          {popularCourses.map((course) => (
            <PopularCourseStrip href={course.href} imageSrc={asset(course.image)} key={course.title} title={course.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExploreDomains() {
  return (
    <section className="section-shell reveal-on-view" aria-labelledby="domains-title">
      <div className="section-heading-row">
        <Text as="h2" id="domains-title" tone="muted" variant="label-16">
          Explore Domains
        </Text>
        <Button className="small-action" kind="neutralAction" label="More" />
      </div>
      <div className="domain-grid">
        {domains.map((domain) => (
          <article
            aria-label={`Explore ${domain.title}`}
            className="domain-tile"
            key={domain.title}
            role="button"
            style={{ "--domain-hover-image": `url(${asset(domain.hoverAsset)})` } as CSSProperties}
            tabIndex={0}
          >
            <Icon name={domain.icon} className="domain-icon" />
            <Text as="h3" tone="inherit" variant="module-title-16">
              {domain.title}
            </Text>
            <Text tone="muted" variant="body-12">
              {domain.copy}
            </Text>
          </article>
        ))}
      </div>
    </section>
  );
}

function Recommended() {
  return (
    <section className="section-shell reveal-on-view" aria-labelledby="recommended-title">
      <div className="section-heading-row">
        <Text as="h2" id="recommended-title" tone="muted" variant="label-16">
          Recommended For You
        </Text>
        <Button className="small-action" kind="neutralAction" label="More" />
      </div>
      <div className="recommendation-grid">
        {recommendations.map((course) => (
          <RecommendedCourseCard
            description={course.description}
            imageSrc={asset(course.image)}
            key={course.id}
            provider={course.provider}
            rating={course.rating}
            reviews={course.reviews}
            href={course.href}
            title={course.title}
          />
        ))}
      </div>
    </section>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section reveal-on-view" aria-labelledby="faq-title">
      <DisplayTitle firstWord="Frequently" remainder="Asked Questions" className="faq-title" size="compact" />
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const open = index === openIndex;
          return (
            <article className={`faq-item ${open ? "is-open" : ""}`} key={item.question}>
              <button
                aria-expanded={open}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpenIndex(open ? -1 : index)}
                type="button"
              >
                <Text as="span" tone="primary" variant="module-title-20">
                  {item.question}
                </Text>
                <Icon name="faq-chevron.svg" />
              </button>
              <div className="faq-answer" id={`faq-answer-${index}`}>
                <Text tone="body" variant="body-14">
                  {item.answer}
                </Text>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LandingPage() {
  const [theme, setTheme] = useThemeState();
  useRevealOnView();

  return (
    <main className={`prototype-page landing-page theme-${theme}`}>
      <MarketingHeader theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
      <section className="hero-section">
        <div className="hero-copy reveal-on-view">
          <DisplayTitle firstWord="Design" remainder="Your Knowledge" />
          <p>MOOCKY is ready to help you synthesize complex concepts and accelerate your growth.</p>
        </div>
        <div className="hero-prompt reveal-on-view">
          <Chatbox />
          <PromptChips />
        </div>
      </section>
      <MostPopular />
      <ExploreDomains />
      <Recommended />
      <FAQAccordion />
      <SiteFooter />
    </main>
  );
}

function loadChats() {
  if (typeof window === "undefined") {
    return starterChats;
  }
  const saved = window.localStorage.getItem(CHATS_KEY);
  if (!saved) {
    return starterChats;
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : starterChats;
  } catch {
    return starterChats;
  }
}

function saveChats(chats: string[]) {
  window.localStorage.setItem(CHATS_KEY, JSON.stringify(chats.slice(0, 12)));
}

function titleFromQuestion(question: string) {
  return question.length > 34 ? `${question.slice(0, 31)}...` : question;
}

function parseInline(text: string) {
  const pieces = text.split(/(\*\*[^*]+\*\*)/g);
  return pieces.map((piece, index) => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={`${piece}-${index}`}>{piece.slice(2, -2)}</strong>;
    }
    return <span key={`${piece}-${index}`}>{piece}</span>;
  });
}

function MarkdownView({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="markdown-view">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return <h4 key={index}>{parseInline(block.slice(4))}</h4>;
        }
        if (block.startsWith("## ")) {
          return <h3 key={index}>{parseInline(block.slice(3))}</h3>;
        }
        if (block.startsWith("# ")) {
          return <h3 key={index}>{parseInline(block.slice(2))}</h3>;
        }
        if (block.includes("\n- ") || block.startsWith("- ")) {
          const lines = block.split("\n").filter(Boolean);
          return (
            <ul key={index}>
              {lines.map((line) => (
                <li key={line}>{parseInline(line.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{parseInline(block)}</p>;
      })}
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="thinking-indicator">
      <Icon name="ai-sparkle.svg" />
      <span>Thinking</span>
    </div>
  );
}

function AIAnswerBlock({
  response,
  thoughtLabel,
}: {
  response: AiResponseEnvelope;
  thoughtLabel: string;
}) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isOverlong, setIsOverlong] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bodyRef.current;
    if (node) {
      setIsOverlong(node.scrollHeight > 520);
    }
  }, [response.answerMarkdown]);

  return (
    <div className={`ai-answer-block answer-kind-${response.answerKind}`}>
      <Icon name="ai-sparkle.svg" className="answer-sparkle" />
      <div className="ai-answer-content">
        <div className="thought-line">{thoughtLabel}</div>
        {response.contextTags.length > 0 ? (
          <div className="context-tags">
            {response.contextTags.map((tag) => (
              <span key={`${tag.type}-${tag.value}`}>
                {tag.label}: {tag.value}
              </span>
            ))}
          </div>
        ) : null}
        <div className="answer-body" ref={bodyRef}>
          <MarkdownView markdown={response.answerMarkdown} />
        </div>
        {response.followUpChips.length > 0 ? (
          <div className="answer-followups">
            {response.followUpChips.slice(0, 3).map((chip) => (
              <button key={chip} type="button">
                {chip}
              </button>
            ))}
          </div>
        ) : null}
        <div className="answer-actions">
          <button aria-label="Save answer" type="button">
            <Icon name="save.svg" />
          </button>
          <button aria-label="Copy answer" onClick={() => navigator.clipboard?.writeText(response.answerMarkdown)} type="button">
            <Icon name="copy.svg" />
          </button>
          <button aria-label="Helpful" className={feedback === "up" ? "is-selected" : ""} onClick={() => setFeedback(feedback === "up" ? null : "up")} type="button">
            <Icon name="thumbs-up.svg" />
          </button>
          <button aria-label="Not helpful" className={feedback === "down" ? "is-selected" : ""} onClick={() => setFeedback(feedback === "down" ? null : "down")} type="button">
            <Icon name="thumbs-down.svg" />
          </button>
          {isOverlong ? (
            <button aria-label="Open full screen answer" type="button">
              <Icon name="chevrons-right-left.svg" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

async function askMoocky(question: string): Promise<AiResponseEnvelope> {
  const response = await fetch("/api/moocky-ai", {
    body: JSON.stringify({ surface: "heroPrompt", userMessage: question }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("MOOCKY AI could not answer right now.");
  }

  const payload = (await response.json()) as AiResponseEnvelope;
  return payload;
}

export function AiPage() {
  const [theme, setTheme] = useThemeState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<string[]>(starterChats);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("What is transformer?");
  const [response, setResponse] = useState<AiResponseEnvelope | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "streaming" | "answered" | "error">("idle");
  const [thoughtLabel, setThoughtLabel] = useState("Thought for 0s");
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  useEffect(() => {
    setChats(loadChats());
  }, []);

  const runQuestion = useCallback(
    async (nextQuestion: string) => {
      const cleanQuestion = nextQuestion.trim();
      if (!cleanQuestion) {
        return;
      }

      setQuestion(cleanQuestion);
      setInput("");
      setResponse(null);
      setStatus("sending");

      const title = titleFromQuestion(cleanQuestion);
      setChats((current) => {
        const next = [title, ...current.filter((item) => item !== title)];
        saveChats(next);
        return next;
      });

      const startedAt = Date.now();
      const streamingTimer = window.setTimeout(() => setStatus("streaming"), 240);

      try {
        const payload = await askMoocky(cleanQuestion);
        const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        setThoughtLabel(`Thought for ${seconds}s`);
        setResponse(payload);
        setStatus("answered");
      } catch {
        setThoughtLabel("Thought for 1s");
        setResponse({
          ...fallbackAiResponse,
          answerKind: "refusal",
          answerMarkdown:
            "I could not reach the MOOCKY AI service from this prototype session. Check the API key and try again, then I can continue from this same question.",
          followUpChips: ["Check API setup", "Try another question"],
          courseRecommendationChips: [],
        });
        setStatus("error");
      } finally {
        window.clearTimeout(streamingTimer);
      }
    },
    [],
  );

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    const queryQuestion = searchParams.get("question");
    void runQuestion(queryQuestion || "What is transformer?");
  }, [runQuestion, searchParams]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runQuestion(input);
  };

  return (
    <main className={`prototype-page ai-page theme-${theme}`}>
      <MarketingHeader theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
      <div className="ai-workspace">
        <aside className={`ai-sidebar ${sidebarCollapsed ? "is-collapsed" : ""}`}>
          <div className="ai-sidebar-head">
            <div className="ai-sidebar-brand">
              <button type="button">
                <Icon name="chevrons-right-left.svg" />
              </button>
              <span>
                <Icon name="sparkle.svg" />
                MOOCKY AI
              </span>
            </div>
            <button aria-label="Collapse sidebar" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} type="button">
              <Icon name="chevrons-right-left.svg" />
            </button>
          </div>
          <div className="ai-sidebar-list">
            <button className="is-active" type="button">
              <Icon name="badge-check.svg" />
              <span>New Chat</span>
            </button>
            {chats.map((chat) => (
              <button key={chat} onClick={() => setQuestion(chat)} type="button">
                <Icon name="badge-check.svg" />
                <span>{chat}</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="ai-conversation" aria-live="polite">
          <div className="user-question-bubble">{question}</div>
          {status === "sending" || status === "streaming" ? <ThinkingIndicator /> : null}
          {response ? <AIAnswerBlock response={response} thoughtLabel={thoughtLabel} /> : null}
          <form className="ai-composer" onSubmit={submit}>
            <label className="sr-only" htmlFor="ai-composer-input">
              Ask MOOCKY AI
            </label>
            <textarea
              id="ai-composer-input"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Keep Asking"
              value={input}
            />
            <div className="ai-composer-bottom">
              <button className="chatbox-plus" type="button" aria-label="Open import menu">
                <Icon name="plus.svg" />
              </button>
              <button className={`chatbox-send ${input.trim() ? "is-ready" : ""}`} type="submit" aria-label="Send message">
                <Icon name="arrow-right.svg" />
              </button>
            </div>
          </form>
          <PromptChips />
          <p className="ai-disclaimer">
            MOOCKY AI can make mistakes, check <a href="#">links</a> for detail.
          </p>
        </section>
      </div>
    </main>
  );
}
