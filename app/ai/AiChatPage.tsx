"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthenticatedHeaderControls } from "../components/AuthenticatedHeaderControls";
import { Button } from "../components/Button";
import { LumenIcon } from "../components/LumenIcon";
import { LogoMark } from "../components/LogoMark";
import { useDemoAuthState } from "../hooks/useDemoAuthState";
import type { AiConversationMode, AiResponseEnvelope, ThemeName } from "../prototype-data";
import { demoPersonalizedSuggestionCards, fallbackAiResponse } from "../prototype-data";

const THEME_KEY = "moocky-theme";
const WORKSPACE_KEY = "moocky-ai-chat-workspace-session-v1";
const COURSE_AI_HANDOFF_KEY = "moocky-course-ai-handoff-v1";
const ANSWER_TYPEWRITER_TICK_MS = 8;
const ANSWER_TYPEWRITER_MAX_DURATION_MS = 3200;
const revealedAnswerMessageIds = new Set<string>();

type AiChatStatus = "idle" | "promptSuggested" | "composing" | "sending" | "streaming" | "finalizing" | "answered" | "error";
type AiMessage = {
  content?: string;
  elapsedMs?: number;
  id: string;
  reasoning?: string;
  response?: AiResponseEnvelope;
  role: "user" | "assistant";
  hadStreamingAnswer?: boolean;
  streamingAnswer?: string;
  streamingCards?: AiResponseEnvelope["courseRecommendationCards"];
};
type AiConversation = {
  createdAt: number;
  id: string;
  messages: AiMessage[];
  mode: AiConversationMode;
  title: string;
  updatedAt: number;
};
type WorkspaceStore = {
  activeConversationId: string | null;
  conversations: AiConversation[];
  version: 1;
};
type CourseAiHandoff = {
  answer: AiResponseEnvelope;
  createdAt: number;
  question: string;
  returnUrl: string;
  timestamp: string;
};
type StreamEvent =
  | { type: "reasoning_delta"; delta?: string }
  | { type: "answer_delta"; delta?: string }
  | { type: "cards_ready"; cards?: AiResponseEnvelope["courseRecommendationCards"] }
  | { type: "content_delta"; delta?: string }
  | { type: "done"; response?: AiResponseEnvelope }
  | { type: "error"; message?: string };

const modeLabels: Record<AiConversationMode, string> = {
  careerPath: "Career Path",
  newChat: "New Chat",
  personalizedSuggestion: "Personalized Suggestion",
};

const modeIcons: Record<AiConversationMode, string> = {
  careerPath: "road",
  newChat: "badge-plus",
  personalizedSuggestion: "chess-pawn",
};
const conversationModes: AiConversationMode[] = ["newChat", "personalizedSuggestion", "careerPath"];

const starterPromptChips: Record<AiConversationMode, string[]> = {
  careerPath: [
    "I am a product designer. What should I learn next?",
    "Help me become an AI product strategist.",
    "What career path fits my current skills?",
    "Build a 6-month learning plan for me.",
  ],
  newChat: ["What is transformer?", "How to understand attention?", "I want some transformers example.", "Inspire me how I could apply this to my research."],
  personalizedSuggestion: [
    "Recommend courses for becoming an AI designer.",
    "I want to study nature-inspired architecture.",
    "Find courses for creative technology.",
    "Build my learning path from interests.",
  ],
};

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

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

function createConversation(mode: AiConversationMode, title = modeLabels[mode]): AiConversation {
  const now = Date.now();

  return {
    createdAt: now,
    id: createId("conversation"),
    messages: [],
    mode,
    title,
    updatedAt: now,
  };
}

function uniqueRecommendationCards(cards: AiResponseEnvelope["courseRecommendationCards"]) {
  const seen = new Set<string>();

  return cards.filter((card) => {
    const key = card.id || card.title;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function normalizeResponseForConversationMode(response: AiResponseEnvelope, mode: AiConversationMode): AiResponseEnvelope {
  if (response.answerKind !== "answer" || mode !== "personalizedSuggestion") {
    return {
      ...response,
      courseRecommendationCards: [],
    };
  }

  return {
    ...response,
    courseRecommendationCards: uniqueRecommendationCards([...response.courseRecommendationCards, ...demoPersonalizedSuggestionCards]).slice(0, 4),
  };
}

function streamingResponseFromMarkdown(markdown: string): AiResponseEnvelope {
  return {
    answerKind: "answer",
    surface: "heroPrompt",
    conversationTitle: "MOOCKY AI",
    answerMarkdown: markdown,
    contextTags: [],
    followUpChips: [],
    courseRecommendationCards: [],
  };
}

function seedWorkspace(): WorkspaceStore {
  return {
    activeConversationId: null,
    conversations: [],
    version: 1,
  };
}

function loadWorkspace(): WorkspaceStore {
  if (typeof window === "undefined") {
    return seedWorkspace();
  }

  const saved = window.sessionStorage.getItem(WORKSPACE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved) as WorkspaceStore;

      if (parsed.version === 1 && Array.isArray(parsed.conversations)) {
        const conversations = parsed.conversations.slice(0, 12).map((conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.response
              ? {
                  ...message,
                  response: normalizeResponseForConversationMode(message.response, conversation.mode),
                }
              : message,
          ),
        }));

        conversations.forEach((conversation) => {
          conversation.messages.forEach((message) => {
            if (message.role === "assistant" && message.response?.answerMarkdown) {
              revealedAnswerMessageIds.add(message.id);
            }
          });
        });

        return {
          activeConversationId: parsed.activeConversationId ?? null,
          conversations,
          version: 1,
        };
      }
    } catch {
      return seedWorkspace();
    }
  }

  return seedWorkspace();
}

function loadCourseHandoff(): CourseAiHandoff | null {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = window.sessionStorage.getItem(COURSE_AI_HANDOFF_KEY);

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<CourseAiHandoff>;

    if (parsed.question && parsed.answer?.answerMarkdown && parsed.returnUrl) {
      return {
        answer: parsed.answer,
        createdAt: parsed.createdAt ?? Date.now(),
        question: parsed.question,
        returnUrl: parsed.returnUrl,
        timestamp: parsed.timestamp ?? "",
      };
    }
  } catch {
    return null;
  }

  return null;
}

function conversationFromCourseHandoff(handoff: CourseAiHandoff): AiConversation {
  const now = Date.now();
  const assistantId = createId("assistant");
  revealedAnswerMessageIds.add(assistantId);

  return {
    createdAt: handoff.createdAt,
    id: createId("course-handoff"),
    messages: [
      { content: handoff.question, id: createId("user"), role: "user" },
      { elapsedMs: 1000, id: assistantId, response: handoff.answer, role: "assistant" },
    ],
    mode: "newChat",
    title: handoff.answer.conversationTitle || titleFromQuestion(handoff.question),
    updatedAt: now,
  };
}

function saveWorkspace(activeConversationId: string | null, conversations: AiConversation[]) {
  window.sessionStorage.setItem(
    WORKSPACE_KEY,
    JSON.stringify({
      activeConversationId,
      conversations: conversations.slice(0, 12),
      version: 1,
    } satisfies WorkspaceStore),
  );
}

function titleFromQuestion(question: string) {
  return question.length > 34 ? `${question.slice(0, 31)}...` : question;
}

function getReadableInlineLength(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").length;
}

function getReadableBlockLength(block: string) {
  if (isTableBlock(block)) {
    return block
      .split("\n")
      .filter((line, index) => Boolean(line.trim()) && index !== 1)
      .reduce((length, line) => length + parseTableRow(line).reduce((cellLength, cell) => cellLength + getReadableInlineLength(cell), 0), 0);
  }

  if (block.startsWith("### ")) {
    return getReadableInlineLength(block.slice(4));
  }
  if (block.startsWith("## ")) {
    return getReadableInlineLength(block.slice(3));
  }
  if (block.startsWith("# ")) {
    return getReadableInlineLength(block.slice(2));
  }
  if (block.includes("\n- ") || block.startsWith("- ")) {
    return block
      .split("\n")
      .filter(Boolean)
      .reduce((length, line) => length + getReadableInlineLength(line.replace(/^- /, "")), 0);
  }

  return getReadableInlineLength(block);
}

function getMarkdownReadableLength(markdown: string) {
  return markdown.split(/\n{2,}/).filter(Boolean).reduce((length, block) => length + getReadableBlockLength(block), 0);
}

function renderInlineWithBudget(text: string, keyPrefix: string, budget: { remaining: number }) {
  const pieces = text.split(/(\*\*[^*]+\*\*)/g);

  return pieces.flatMap((piece, index) => {
    if (budget.remaining <= 0) {
      return [];
    }

    const isStrong = piece.startsWith("**") && piece.endsWith("**");
    const content = isStrong ? piece.slice(2, -2) : piece;
    const visible = content.slice(0, budget.remaining);

    if (!visible) {
      return [];
    }

    budget.remaining -= visible.length;

    return isStrong ? [<strong key={`${keyPrefix}-${index}`}>{visible}</strong>] : [<span key={`${keyPrefix}-${index}`}>{visible}</span>];
  });
}

function parseTableRow(row: string) {
  return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableBlock(block: string) {
  const lines = block.split("\n").filter(Boolean);
  return lines.length >= 2 && lines[0].includes("|") && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1]);
}

function MarkdownView({
  isTyping = false,
  markdown,
  visibleCharacters,
}: {
  isTyping?: boolean;
  markdown: string;
  visibleCharacters?: number;
}) {
  const blocks = markdown.split(/\n{2,}/).filter(Boolean);
  const budget = { remaining: visibleCharacters ?? getMarkdownReadableLength(markdown) };

  return (
    <div aria-busy={isTyping} className={`markdown-view ai-markdown-view ${isTyping ? "is-typing" : ""}`.trim()}>
      {blocks.map((block, index) => {
        if (isTableBlock(block)) {
          const lines = block.split("\n").filter(Boolean);
          const headers = parseTableRow(lines[0]);
          const rows = lines.slice(2).map(parseTableRow);

          return (
            <div className="markdown-table-wrap" key={index}>
              <table>
                <thead>
                  <tr>
                    {headers.map((header) => {
                      const children = renderInlineWithBudget(header, `th-${index}-${header}`, budget);
                      return children.length > 0 ? <th key={header}>{children}</th> : null;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={`${index}-${row.join("-") || rowIndex}`}>
                      {headers.map((header, cellIndex) => {
                        const children = renderInlineWithBudget(row[cellIndex] ?? "", `td-${index}-${rowIndex}-${cellIndex}`, budget);
                        return children.length > 0 ? <td key={`${header}-${cellIndex}`}>{children}</td> : null;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.startsWith("### ")) {
          const children = renderInlineWithBudget(block.slice(4), `h4-${index}`, budget);
          return children.length > 0 ? <h4 key={index}>{children}</h4> : null;
        }
        if (block.startsWith("## ")) {
          const children = renderInlineWithBudget(block.slice(3), `h3-${index}`, budget);
          return children.length > 0 ? <h3 key={index}>{children}</h3> : null;
        }
        if (block.startsWith("# ")) {
          const children = renderInlineWithBudget(block.slice(2), `h3-${index}`, budget);
          return children.length > 0 ? <h3 key={index}>{children}</h3> : null;
        }
        if (block.includes("\n- ") || block.startsWith("- ")) {
          const lines = block.split("\n").filter(Boolean);
          const items = lines.flatMap((line) => {
            const children = renderInlineWithBudget(line.replace(/^- /, ""), line, budget);
            return children.length > 0 ? [<li key={line}>{children}</li>] : [];
          });

          if (items.length === 0) {
            return null;
          }

          return <ul key={index}>{items}</ul>;
        }

        const children = renderInlineWithBudget(block, `p-${index}`, budget);

        if (children.length === 0) {
          return null;
        }

        return <p key={index}>{children}</p>;
      })}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function AnimatedMarkdownView({
  markdown,
  messageId,
  onRevealComplete,
  shouldAnimate,
}: {
  markdown: string;
  messageId: string;
  onRevealComplete?: () => void;
  shouldAnimate: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const readableLength = getMarkdownReadableLength(markdown);
  const [visibleCharacters, setVisibleCharacters] = useState(() => (shouldAnimate && !revealedAnswerMessageIds.has(messageId) ? 0 : readableLength));

  const markRevealComplete = useCallback(() => {
    revealedAnswerMessageIds.add(messageId);
    onRevealComplete?.();
  }, [messageId, onRevealComplete]);

  useEffect(() => {
    const canAnimate = shouldAnimate && !prefersReducedMotion && !revealedAnswerMessageIds.has(messageId) && readableLength > 0;

    if (!canAnimate) {
      setVisibleCharacters(readableLength);

      markRevealComplete();

      return;
    }

    let current = 0;
    const step = Math.max(1, Math.ceil(readableLength / (ANSWER_TYPEWRITER_MAX_DURATION_MS / ANSWER_TYPEWRITER_TICK_MS)));

    setVisibleCharacters(0);

    const timer = window.setInterval(() => {
      current = Math.min(readableLength, current + step);
      setVisibleCharacters(current);

      if (current >= readableLength) {
        markRevealComplete();
        window.clearInterval(timer);
      }
    }, ANSWER_TYPEWRITER_TICK_MS);

    return () => window.clearInterval(timer);
  }, [markdown, markRevealComplete, messageId, prefersReducedMotion, readableLength, shouldAnimate]);

  return <MarkdownView isTyping={visibleCharacters < readableLength} markdown={markdown} visibleCharacters={visibleCharacters} />;
}

function AiHeader({ theme, onThemeToggle }: { theme: ThemeName; onThemeToggle: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useDemoAuthState();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const themeToggleLabel = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <header className={`marketing-header ai-chat-header ${isAuthenticated ? "is-authenticated" : "is-guest"} ${isAuthenticated && isSearchActive ? "is-searching" : ""}`}>
      <div className="marketing-header-inner">
        <div className="header-left">
          <a className="logo-lockup" href="/" aria-label="MOOCKY home">
            <LogoMark />
          </a>
          <a className="prototype-button prototype-button-ghost" href="/my-progress">
            <LumenIcon name="loader" />
            <span>MyProgress</span>
          </a>
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <AuthenticatedHeaderControls onSearchActiveChange={setIsSearchActive} onThemeToggle={onThemeToggle} themeToggleLabel={themeToggleLabel} />
          ) : (
            <>
              <button className="prototype-button prototype-button-standalone" onClick={onThemeToggle} type="button" aria-label={themeToggleLabel}>
                <LumenIcon name="eclipse" />
              </button>
              <Button className="login-action" kind="auxiliaryAction" label="Log In" onClick={() => setIsAuthenticated(true)} />
              <Button kind="primaryAction" label="Explore MOOCKY" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  activeConversationId,
  activeMode,
  canGoBack,
  collapsed,
  conversations,
  onBack,
  onCreateConversation,
  onSelectConversation,
  onToggleCollapsed,
}: {
  activeConversationId: string | null;
  activeMode: AiConversationMode;
  canGoBack: boolean;
  collapsed: boolean;
  conversations: AiConversation[];
  onBack: () => void;
  onCreateConversation: (mode: AiConversationMode) => void;
  onSelectConversation: (id: string) => void;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside className={`ai-sidebar ai-chat-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="ai-sidebar-head">
        <div className="ai-sidebar-brand">
          <button aria-label="Back" className="ai-sidebar-icon-control" data-has-history={canGoBack ? "true" : "false"} onClick={onBack} type="button">
            <LumenIcon name="arrow-left" />
          </button>
          <span>
            <LumenIcon name="sparkle" />
            MOOCKY AI
          </span>
        </div>
        <button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="ai-sidebar-icon-control" onClick={onToggleCollapsed} type="button">
          <LumenIcon name={collapsed ? "panel-left-open" : "panel-left-close"} />
        </button>
      </div>
      <div className="ai-sidebar-list ai-sidebar-modes" aria-label="Start a conversation">
        {conversationModes.map((mode) => (
          <button
            aria-current={mode === activeMode ? "page" : undefined}
            className={`mode-item mode-${mode} ${mode === activeMode ? "is-active" : ""}`}
            key={mode}
            onClick={() => onCreateConversation(mode)}
            type="button"
          >
            <span className="mode-icon-shell">
              <LumenIcon name={modeIcons[mode]} />
            </span>
            <span>{modeLabels[mode]}</span>
          </button>
        ))}
      </div>
      <div className="ai-sidebar-list ai-sidebar-records" aria-label="Conversation records">
        {conversations.map((conversation) => (
          <button className={conversation.id === activeConversationId ? "is-active" : ""} key={conversation.id} onClick={() => onSelectConversation(conversation.id)} type="button">
            <span>{conversation.title}</span>
            {conversation.mode !== "newChat" ? <LumenIcon className="record-mode-icon" name={modeIcons[conversation.mode]} /> : null}
          </button>
        ))}
      </div>
    </aside>
  );
}

function ThinkingGlyph({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span className="answer-static-sparkle" aria-hidden="true">
        <LumenIcon name="sparkle" size={13.337} />
      </span>
    );
  }

  return (
    <span className="thinking-glyph is-active" aria-hidden="true">
      <span className="thinking-glow" />
      <span className="thinking-spark-shell">
        <LumenIcon name="sparkle" />
      </span>
    </span>
  );
}

function ReasoningPanel({
  elapsedLabel,
  isThinking,
  reasoning,
}: {
  elapsedLabel: string;
  isThinking: boolean;
  reasoning: string;
}) {
  const [open, setOpen] = useState(isThinking);

  useEffect(() => {
    setOpen(isThinking);
  }, [isThinking]);

  if (!reasoning && !isThinking) {
    return null;
  }

  if (isThinking) {
    return (
      <div className="reasoning-live" aria-live="polite">
        <div className="thinking-status">Thinking...</div>
        <pre className="reasoning-body">{reasoning || "Checking Context..."}</pre>
      </div>
    );
  }

  return (
    <div className={`reasoning-panel ${open ? "is-open" : ""}`}>
      <button aria-expanded={open} className="reasoning-summary" onClick={() => setOpen((value) => !value)} type="button">
        <span>{isThinking ? "Thinking..." : `Reasoning · ${elapsedLabel}`}</span>
        <LumenIcon name="faq-chevron" />
      </button>
      {open ? <pre className="reasoning-body">{reasoning || "Checking Context..."}</pre> : null}
    </div>
  );
}

function RecommendationCards({ cards }: { cards: AiResponseEnvelope["courseRecommendationCards"] }) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    setCanScrollLeft(strip.scrollLeft > 2);
    setCanScrollRight(strip.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);

    return () => window.removeEventListener("resize", updateScrollState);
  }, [cards.length, updateScrollState]);

  const browseCards = (direction: "left" | "right") => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    strip.scrollBy({
      behavior: "smooth",
      left: direction === "right" ? 312 : -312,
    });
    window.setTimeout(updateScrollState, 180);
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="ai-course-card-carousel">
      {canScrollLeft ? (
        <button className="ai-course-card-nav ai-course-card-nav-left" onClick={() => browseCards("left")} type="button" aria-label="Browse previous course recommendations">
          <LumenIcon name="arrow-left" />
        </button>
      ) : null}
      <div className="ai-course-card-strip" onScroll={updateScrollState} ref={stripRef} aria-label="Course recommendations">
        {cards.map((card) => (
          <a className="ai-course-card" href={card.href} key={card.id}>
            <div className="ai-course-card-copy">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <strong>{card.provider}</strong>
            </div>
            <div className="ai-course-card-footer">
              <div>
                <span>{card.rating}</span>
                <span>{card.reviews}</span>
              </div>
              <span className="ai-course-card-action" aria-hidden="true">
                <LumenIcon name="arrow-up-right" />
              </span>
            </div>
          </a>
        ))}
      </div>
      {canScrollRight ? (
        <button className="ai-course-card-nav ai-course-card-nav-right" onClick={() => browseCards("right")} type="button" aria-label="Browse next course recommendations">
          <LumenIcon name="arrow-right" />
        </button>
      ) : null}
    </div>
  );
}

function ContextTags({ tags }: { tags: AiResponseEnvelope["contextTags"] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="context-tags">
      {tags.map((tag) => (
        <a href={tag.href || `/course?context=${encodeURIComponent(tag.type)}&value=${encodeURIComponent(tag.value)}`} key={`${tag.type}-${tag.value}`}>
          {tag.label}: {tag.value}
        </a>
      ))}
    </div>
  );
}

function AnswerActionBar({ answer }: { answer: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = window.setTimeout(() => setNotice(""), 1300);
  };

  useEffect(
    () => () => {
      if (noticeTimer.current) {
        window.clearTimeout(noticeTimer.current);
      }
    },
    [],
  );

  const copyAnswer = async () => {
    try {
      await navigator.clipboard?.writeText(answer);
    } catch {
      // The visual feedback is still useful in restricted browser contexts.
    }
    showNotice("Copied");
  };

  return (
    <div className="answer-actions answer-action-bar" aria-label="Answer actions">
      <button aria-label="Save answer" onClick={() => showNotice("Saved")} type="button">
        <LumenIcon name="save" />
      </button>
      <button aria-label="Copy answer" onClick={copyAnswer} type="button">
        <LumenIcon name="copy" />
      </button>
      <button
        aria-label="Helpful"
        className={feedback === "up" ? "is-selected" : ""}
        onClick={() => {
          setFeedback(feedback === "up" ? null : "up");
          showNotice(feedback === "up" ? "Cleared" : "Marked helpful");
        }}
        type="button"
      >
        <LumenIcon name="thumbs-up" />
      </button>
      <button
        aria-label="Not helpful"
        className={feedback === "down" ? "is-selected" : ""}
        onClick={() => {
          setFeedback(feedback === "down" ? null : "down");
          showNotice(feedback === "down" ? "Cleared" : "Feedback saved");
        }}
        type="button"
      >
        <LumenIcon name="thumbs-down" />
      </button>
      {answer.length > 1600 ? (
        <button aria-label="Open full screen answer" onClick={() => showNotice("Expanded")} type="button">
          <LumenIcon name="chevrons-right-left" />
        </button>
      ) : null}
      {notice ? <span className="answer-action-feedback">{notice}</span> : null}
    </div>
  );
}

function AssistantMessage({
  conversationMode,
  disabled,
  elapsedLabel,
  isCurrent,
  message,
  onFollowUp,
  status,
}: {
  conversationMode: AiConversationMode;
  disabled: boolean;
  elapsedLabel: string;
  isCurrent: boolean;
  message: AiMessage;
  onFollowUp: (prompt: string) => void;
  status: AiChatStatus;
}) {
  const hasFinalResponse = Boolean(message.response);
  const streamingAnswer = !hasFinalResponse ? message.streamingAnswer?.trim() : "";
  const hadStreamingAnswer = Boolean(message.hadStreamingAnswer || streamingAnswer);
  const response = message.response ? normalizeResponseForConversationMode(message.response, conversationMode) : streamingAnswer ? streamingResponseFromMarkdown(message.streamingAnswer ?? "") : undefined;
  const isStreamingAnswer = isCurrent && !hasFinalResponse && Boolean(streamingAnswer);
  const streamingCards = !hasFinalResponse ? message.streamingCards ?? [] : [];
  const visibleCards = hasFinalResponse ? response?.courseRecommendationCards ?? [] : streamingCards;
  const isThinking = isCurrent && !response && (status === "sending" || status === "streaming");
  const isFinalizing = isCurrent && !response && status === "finalizing";
  const isWaitingForAnswer = isThinking || isFinalizing;
  const hasReasoning = Boolean(message.reasoning?.trim());
  const showThinkingSurface = isThinking || isFinalizing;
  const showReasoningPanel = showThinkingSurface || hasReasoning;
  const showThoughtDuration = hasFinalResponse && Boolean(response) && !hasReasoning;
  const showReservedThoughtDuration = isStreamingAnswer && !hasReasoning;
  const showAnswerMeta = showReasoningPanel || showThoughtDuration || showReservedThoughtDuration;
  const isRevealAlreadyComplete = hasFinalResponse && (!isCurrent || revealedAnswerMessageIds.has(message.id) || hadStreamingAnswer);
  const [answerRevealComplete, setAnswerRevealComplete] = useState(() => isRevealAlreadyComplete);
  const effectiveRevealComplete = answerRevealComplete || isRevealAlreadyComplete;
  const shouldRenderPlainBody = isStreamingAnswer || (hasFinalResponse && hadStreamingAnswer);
  const showCards = visibleCards.length > 0 && (!hasFinalResponse || effectiveRevealComplete);

  useEffect(() => {
    setAnswerRevealComplete(isRevealAlreadyComplete);
  }, [isRevealAlreadyComplete]);

  const handleAnswerRevealComplete = useCallback(() => {
    setAnswerRevealComplete(true);
  }, []);

  return (
    <div className={`ai-answer-block answer-kind-${response?.answerKind ?? "answer"}`}>
      <ThinkingGlyph active={isWaitingForAnswer || isStreamingAnswer} />
      <div className="ai-answer-content">
        {showAnswerMeta ? (
          <div className="ai-answer-meta">
            {showReasoningPanel ? <ReasoningPanel elapsedLabel={elapsedLabel} isThinking={showThinkingSurface} reasoning={message.reasoning ?? ""} /> : null}
            {showThoughtDuration ? <div className="thought-line">{`Thought for ${elapsedLabel}`}</div> : null}
            {showReservedThoughtDuration ? <div className="thought-line is-reserved">{`Thought for ${elapsedLabel}`}</div> : null}
          </div>
        ) : null}
        {response ? (
          <>
            <ContextTags tags={response.contextTags} />
            <div className="answer-body">
              {shouldRenderPlainBody ? (
                <MarkdownView isTyping={isStreamingAnswer} markdown={response.answerMarkdown} />
              ) : (
                <AnimatedMarkdownView markdown={response.answerMarkdown} messageId={message.id} onRevealComplete={handleAnswerRevealComplete} shouldAnimate={isCurrent} />
              )}
            </div>
            {showCards ? <RecommendationCards cards={visibleCards} /> : null}
            {hasFinalResponse && effectiveRevealComplete ? (
              <>
                {response.followUpChips.length > 0 ? (
                  <div className="answer-followups">
                    {response.followUpChips.slice(0, 4).map((chip) => (
                      <button disabled={disabled} key={chip} onClick={() => onFollowUp(chip)} type="button">
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}
                <AnswerActionBar answer={response.answerMarkdown} />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

function PromptChips({
  disabled,
  mode,
  onPrompt,
}: {
  disabled: boolean;
  mode: AiConversationMode;
  onPrompt: (prompt: string) => void;
}) {
  return (
    <div className="prompt-chips ai-default-prompt-chips">
      {starterPromptChips[mode].map((chip) => (
        <button className="prompt-chip" disabled={disabled} key={chip} onClick={() => onPrompt(chip)} type="button">
          <span>{chip}</span>
        </button>
      ))}
    </div>
  );
}

function Composer({
  disabled,
  hasConversation,
  input,
  onInput,
  onSubmit,
}: {
  disabled: boolean;
  hasConversation: boolean;
  input: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
}) {
  const ready = input.trim().length > 0 && !disabled;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const submitFromKeyboard = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <form className={`ai-composer ${ready ? "is-ready" : ""} ${disabled ? "is-disabled" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor="ai-composer-input">
        Ask MOOCKY AI
      </label>
      <textarea
        disabled={disabled}
        id="ai-composer-input"
        onChange={(event) => onInput(event.target.value)}
        onKeyDown={submitFromKeyboard}
        placeholder={hasConversation ? "Keep Asking..." : "Tell me anything..."}
        value={input}
      />
      <div className="ai-composer-bottom">
        <button className="chatbox-plus" disabled={disabled} type="button" aria-label="Open import menu">
          <LumenIcon name="plus" />
        </button>
        <button className={`chatbox-send ${ready ? "is-ready" : ""}`} disabled={!ready} type="submit" aria-label="Send message">
          <LumenIcon name="arrow-right" />
        </button>
      </div>
    </form>
  );
}

function parseStreamEvent(line: string): StreamEvent | null {
  const trimmed = line.trim();

  if (!trimmed.startsWith("data:")) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(5).trim()) as StreamEvent;
  } catch {
    return null;
  }
}

export function AiChatPage() {
  const [theme, setTheme] = useThemeState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AiChatStatus>("idle");
  const [canGoBack, setCanGoBack] = useState(false);
  const [handoffReturnUrl, setHandoffReturnUrl] = useState<string | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
  const activeMode = activeConversation?.mode ?? "newChat";
  const busy = status === "sending" || status === "streaming" || status === "finalizing";
  const latestAssistantId = activeConversation?.messages.filter((message) => message.role === "assistant").at(-1)?.id ?? null;
  const latestElapsedMs = activeConversation?.messages.find((message) => message.id === latestAssistantId)?.elapsedMs ?? 0;
  const elapsedLabel = latestElapsedMs >= 1000 ? `${Math.round(latestElapsedMs / 1000)}s` : "0s";

  useEffect(() => {
    const courseHandoff = loadCourseHandoff();

    if (courseHandoff) {
      const handoffConversation = conversationFromCourseHandoff(courseHandoff);
      setConversations([handoffConversation]);
      setActiveConversationId(handoffConversation.id);
      setStatus("answered");
      setCanGoBack(true);
      setHandoffReturnUrl(courseHandoff.returnUrl);
      setWorkspaceReady(true);
      return;
    }

    const workspace = loadWorkspace();
    setConversations(workspace.conversations);
    setActiveConversationId(workspace.activeConversationId);
    setStatus(workspace.activeConversationId ? "answered" : "promptSuggested");
    setCanGoBack(Boolean(document.referrer) || window.history.length > 1);
    setWorkspaceReady(true);
  }, []);

  useEffect(() => {
    if (workspaceReady && conversations.length > 0) {
      saveWorkspace(activeConversationId, conversations);
    }
  }, [activeConversationId, conversations, workspaceReady]);

  const upsertConversation = useCallback((nextConversation: AiConversation) => {
    setConversations((current) => [nextConversation, ...current.filter((conversation) => conversation.id !== nextConversation.id)].slice(0, 12));
    setActiveConversationId(nextConversation.id);
  }, []);

  const createAndSelectConversation = useCallback(
    (mode: AiConversationMode) => {
      const conversation = createConversation(mode);
      upsertConversation(conversation);
      setStatus("promptSuggested");
    },
    [upsertConversation],
  );

  const updateConversation = useCallback((conversationId: string, updater: (conversation: AiConversation) => AiConversation) => {
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return updater(conversation);
      }),
    );
  }, []);

  const runPrompt = useCallback(
    async (prompt: string, requestedMode?: AiConversationMode) => {
      const cleanPrompt = prompt.trim();

      if (!cleanPrompt || busy) {
        return;
      }

      const baseConversation = activeConversation ?? createConversation(requestedMode ?? "newChat");
      const mode = requestedMode ?? baseConversation.mode;
      const conversation = baseConversation.mode === mode ? baseConversation : { ...baseConversation, mode, title: modeLabels[mode] };
      const userMessage: AiMessage = { content: cleanPrompt, id: createId("user"), role: "user" };
      const assistantMessage: AiMessage = { elapsedMs: 0, id: createId("assistant"), reasoning: "", role: "assistant" };
      const startedAt = Date.now();
      const runConversation: AiConversation = {
        ...conversation,
        messages: [...conversation.messages, userMessage, assistantMessage],
        title: conversation.messages.length === 0 && conversation.title === modeLabels[mode] ? modeLabels[mode] : conversation.title,
        updatedAt: startedAt,
      };

      upsertConversation(runConversation);
      setInput("");
      setStatus("sending");

      const messageHistory = conversation.messages.reduce<{ role: "user" | "assistant"; content: string }[]>((history, message) => {
        if (message.role === "user" && message.content) {
          history.push({ role: "user", content: message.content });
        }
        if (message.role === "assistant" && message.response?.answerMarkdown) {
          history.push({ role: "assistant", content: message.response.answerMarkdown });
        }
        return history;
      }, []);

      try {
        const response = await fetch("/api/moocky-ai/stream", {
          body: JSON.stringify({
            conversationId: runConversation.id,
            conversationMode: mode,
            entrySource: requestedMode ? "sidebar" : "direct",
            messageHistory,
            surface: "heroPrompt",
            userMessage: cleanPrompt,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok || !response.body) {
          throw new Error("MOOCKY AI could not answer right now.");
        }

        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("MOOCKY AI stream was unavailable.");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let finalContent = "";
        let finalResponse: AiResponseEnvelope | null = null;
        let hasVisibleAnswerDelta = false;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const event = parseStreamEvent(line);

            if (!event) {
              continue;
            }

            if (event.type === "reasoning_delta" && event.delta) {
              setStatus("streaming");
              updateConversation(runConversation.id, (current) => ({
                ...current,
                messages: current.messages.map((message) =>
                  message.id === assistantMessage.id
                    ? {
                        ...message,
                        elapsedMs: Date.now() - startedAt,
                        reasoning: `${message.reasoning ?? ""}${event.delta}`,
                      }
                    : message,
                ),
                updatedAt: Date.now(),
              }));
            }

            if (event.type === "answer_delta" && event.delta) {
              hasVisibleAnswerDelta = true;
              setStatus("streaming");
              updateConversation(runConversation.id, (current) => ({
                ...current,
                messages: current.messages.map((message) =>
                  message.id === assistantMessage.id
                    ? {
                        ...message,
                        hadStreamingAnswer: true,
                        elapsedMs: Date.now() - startedAt,
                        streamingAnswer: `${message.streamingAnswer ?? ""}${event.delta}`,
                      }
                    : message,
                ),
                updatedAt: Date.now(),
              }));
            }

            if (event.type === "cards_ready" && event.cards?.length) {
              updateConversation(runConversation.id, (current) => ({
                ...current,
                messages: current.messages.map((message) =>
                  message.id === assistantMessage.id
                    ? {
                        ...message,
                        elapsedMs: Date.now() - startedAt,
                        streamingCards: event.cards,
                      }
                    : message,
                ),
                updatedAt: Date.now(),
              }));
            }

            if (event.type === "content_delta" && event.delta) {
              finalContent += event.delta;
              setStatus("finalizing");
            }

            if (event.type === "done") {
              finalResponse = event.response ?? null;
            }

            if (event.type === "error") {
              throw new Error(event.message || "MOOCKY AI could not answer right now.");
            }
          }
        }

        if (!finalResponse && finalContent) {
          finalResponse = JSON.parse(finalContent) as AiResponseEnvelope;
        }

        const resolvedResponse = normalizeResponseForConversationMode(finalResponse ?? {
          ...fallbackAiResponse,
          answerKind: "refusal" as const,
          answerMarkdown: "MOOCKY AI returned an unreadable prototype response. Try asking again with a shorter prompt.",
          courseRecommendationCards: [],
          followUpChips: ["Try another prompt", "Explore course paths"],
        }, mode);
        const elapsedMs = Date.now() - startedAt;

        if (hasVisibleAnswerDelta) {
          revealedAnswerMessageIds.add(assistantMessage.id);
        }

        updateConversation(runConversation.id, (current) => ({
          ...current,
          messages: current.messages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  elapsedMs,
                  hadStreamingAnswer: hasVisibleAnswerDelta || message.hadStreamingAnswer,
                  response: resolvedResponse,
                  streamingAnswer: undefined,
                  streamingCards: undefined,
                }
              : message,
          ),
          title: resolvedResponse.conversationTitle || titleFromQuestion(cleanPrompt),
          updatedAt: Date.now(),
        }));
        setStatus("answered");
      } catch {
        const elapsedMs = Date.now() - startedAt;
        const errorResponse: AiResponseEnvelope = {
          ...fallbackAiResponse,
          answerKind: "refusal",
          conversationTitle: titleFromQuestion(cleanPrompt),
          answerMarkdown: "I could not reach the MOOCKY AI service from this prototype session. Check the API key and try again, then I can continue from this same question.",
          courseRecommendationCards: [],
          followUpChips: ["Check API setup", "Try another question"],
        };

        updateConversation(runConversation.id, (current) => ({
          ...current,
          messages: current.messages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, elapsedMs, hadStreamingAnswer: message.hadStreamingAnswer, response: errorResponse, streamingAnswer: undefined, streamingCards: undefined }
              : message,
          ),
          title: titleFromQuestion(cleanPrompt),
          updatedAt: Date.now(),
        }));
        setStatus("error");
      }
    },
    [activeConversation, busy, updateConversation, upsertConversation],
  );

  useEffect(() => {
    if (startedRef.current || !workspaceReady) {
      return;
    }

    startedRef.current = true;
    const queryQuestion = searchParams.get("question") || searchParams.get("prompt");

    if (queryQuestion) {
      void runPrompt(queryQuestion, "newChat");
    }
  }, [runPrompt, searchParams, workspaceReady]);

  const submitComposer = () => {
    void runPrompt(input);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const selected = conversations.find((conversation) => conversation.id === id);
    setStatus(selected && selected.messages.length > 0 ? "answered" : "promptSuggested");
  };

  const visibleMessages = activeConversation?.messages ?? [];
  const hasInteraction = visibleMessages.length > 0;

  return (
    <main className={`prototype-page ai-page ai-chat-page theme-${theme}`}>
      <AiHeader theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
      <div className="ai-workspace">
        <Sidebar
          activeConversationId={activeConversationId}
          canGoBack={canGoBack}
          collapsed={sidebarCollapsed}
          conversations={conversations}
          activeMode={activeMode}
          onBack={() => {
            if (handoffReturnUrl) {
              router.push(handoffReturnUrl);
              return;
            }

            if (window.history.length > 1) {
              router.back();
              return;
            }

            router.push("/");
          }}
          onCreateConversation={createAndSelectConversation}
          onSelectConversation={handleSelectConversation}
          onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <section className="ai-conversation" aria-live="polite">
          <div className="ai-conversation-scroll">
            {!hasInteraction ? <PromptChips disabled={busy} mode={activeMode} onPrompt={(prompt) => void runPrompt(prompt)} /> : null}
            {visibleMessages.map((message) =>
              message.role === "user" ? (
                <div className="user-question-bubble" key={message.id}>
                  {message.content}
                </div>
              ) : (
                <AssistantMessage
                  conversationMode={activeConversation?.mode ?? activeMode}
                  disabled={busy}
                  elapsedLabel={message.elapsedMs ? `${Math.max(1, Math.round(message.elapsedMs / 1000))}s` : elapsedLabel}
                  isCurrent={message.id === latestAssistantId}
                  key={message.id}
                  message={message}
                  onFollowUp={(prompt) => void runPrompt(prompt)}
                  status={status}
                />
              ),
            )}
          </div>
          <Composer disabled={busy} hasConversation={hasInteraction} input={input} onInput={setInput} onSubmit={submitComposer} />
          <p className="ai-disclaimer">
            MOOCKY AI can make mistakes, check <a href="#">links</a> for detail.
          </p>
        </section>
      </div>
    </main>
  );
}
