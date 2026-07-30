"use client";

import type { CSSProperties, FormEvent, KeyboardEvent, RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedHeaderControls } from "../components/AuthenticatedHeaderControls";
import { Button } from "../components/Button";
import { CompactProductFooter } from "../components/CompactProductFooter";
import { LumenIcon, type LumenIconName } from "../components/LumenIcon";
import { LogoMark } from "../components/LogoMark";
import type { AiResponseEnvelope, ThemeName } from "../prototype-data";
import styles from "./course.module.css";

const THEME_KEY = "moocky-theme";
const COURSE_AI_HANDOFF_KEY = "moocky-course-ai-handoff-v1";
const YOUTUBE_VIDEO_ID = "eMlx5fFNoYc";
const YOUTUBE_SOURCE_URL = "https://www.3blue1brown.com/lessons/attention/";
const PAUSED_BANNER_SRC = "/assets/figma/course-paused-banner.png";
const DISPLAY_LESSON_SECONDS = 68 * 60;
const FALLBACK_VIDEO_SECONDS = 26 * 60 + 9;
const CONTEXT_CHIP_SCAN_INTERVAL_MS = 3000;

type PlaybackState = "paused" | "playing";
type RailTab = "progress" | "ai";
type ContentTab = "detail" | "discussion";
type StreamEvent =
  | { type: "reasoning_delta"; delta?: string }
  | { type: "answer_delta"; delta?: string }
  | { type: "content_delta"; delta?: string }
  | { type: "done"; response?: AiResponseEnvelope }
  | { type: "error"; message?: string };
type CourseAiConversation = {
  createdAt: number;
  id: string;
  question: string;
  response: AiResponseEnvelope;
  timestamp: string;
  title: string;
};
type DiscussionMessage = {
  avatar?: string;
  author: string;
  body: string;
  id: string;
  isMine?: boolean;
  likes: number;
  nested?: DiscussionMessage[];
  timestamp?: string;
  timeLabel: string;
  visibility: "public" | "private";
};
type CurriculumItem = {
  duration: string;
  id: string;
  meta: string;
  state: "completed" | "current" | "upcoming";
  title: string;
};
type LessonChunk = {
  chips: string[];
  concepts: string[];
  end: number;
  start: number;
  summary: string;
  title: string;
};
type ContextPromptScan = {
  contextKey: string;
  prompts: string[];
  scanIndex: number;
};
type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};
type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
      };
      playerVars: Record<string, number | string>;
      videoId: string;
    },
  ) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
    PAUSED: number;
    PLAYING: number;
  };
};

function readPlayerCurrentTime(player: YouTubePlayer | null) {
  const maybePlayer = player as Partial<YouTubePlayer> | null;

  if (typeof maybePlayer?.getCurrentTime !== "function") {
    return null;
  }

  try {
    const seconds = maybePlayer.getCurrentTime();
    return typeof seconds === "number" && Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

function readPlayerDuration(player: YouTubePlayer | null) {
  const maybePlayer = player as Partial<YouTubePlayer> | null;

  if (typeof maybePlayer?.getDuration !== "function") {
    return null;
  }

  try {
    const seconds = maybePlayer.getDuration();
    return typeof seconds === "number" && Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

function destroyPlayer(player: YouTubePlayer | null) {
  const maybePlayer = player as Partial<YouTubePlayer> | null;

  if (typeof maybePlayer?.destroy !== "function") {
    return;
  }

  try {
    maybePlayer.destroy();
  } catch {
    // The iframe API can unload while React is tearing down the page.
  }
}
type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

const curriculum: CurriculumItem[] = [
  { id: "backprop", title: "Foundations of Backpropagation", meta: "12:04 - Quiz Passed", duration: "12min", state: "completed" },
  { id: "explainable", title: "Explainable AI Methods", meta: "33:25 - Case Study", duration: "18min", state: "completed" },
  { id: "autonomous", title: "Autonomous Vehicle AI", meta: "42:10 - Simulation Exercise", duration: "22min", state: "completed" },
  { id: "healthcare", title: "AI in Healthcare Innovations", meta: "38:00 - Industry Talk", duration: "14min", state: "completed" },
  { id: "attention", title: "Transformers & Attention", meta: "18:45 - Currently Watching", duration: "10min 24s", state: "current" },
  { id: "gan", title: "Advanced GAN Architecture", meta: "24:10 - Up Next", duration: "24min", state: "upcoming" },
  { id: "rlhf", title: "RLHF Implementation", meta: "45:00 - Lab Required", duration: "45min", state: "upcoming" },
  { id: "nlp", title: "Transformers in NLP", meta: "30:45 - Recommended Reading", duration: "31min", state: "upcoming" },
  { id: "quantum", title: "Quantum Computing Basics", meta: "50:20 - Guest Lecture", duration: "50min", state: "upcoming" },
  { id: "ethics", title: "Ethics in AI Development", meta: "40:15 - Discussion Panel", duration: "40min", state: "upcoming" },
  { id: "style", title: "Neural Style Transfer", meta: "35:30 - Practical Demo", duration: "35min", state: "upcoming" },
  { id: "federated", title: "Federated Learning Techniques", meta: "28:50 - Group Project", duration: "29min", state: "upcoming" },
];

const lessonChunks: LessonChunk[] = [
  {
    start: 0,
    end: 195,
    title: "Why attention matters",
    summary: "The lesson frames attention as the mechanism that lets a model decide which pieces of context matter for a token.",
    concepts: ["attention pattern", "context", "tokens"],
    chips: ["What is attention doing?", "Why not read left to right?", "Summarize the opening"],
  },
  {
    start: 195,
    end: 525,
    title: "Queries and keys",
    summary: "Queries represent what a token is looking for, while keys represent what other tokens offer for matching.",
    concepts: ["queries", "keys", "dot product"],
    chips: ["Explain query vs key", "Give a simple analogy", "Where do scores come from?"],
  },
  {
    start: 525,
    end: 860,
    title: "Softmax attention weights",
    summary: "Raw matching scores become a normalized attention pattern, so relevant tokens receive larger weights.",
    concepts: ["softmax", "attention weights", "normalization"],
    chips: ["Why use softmax?", "What are attention weights?", "Show a tiny example"],
  },
  {
    start: 860,
    end: 1225,
    title: "Values and context mixing",
    summary: "The value vectors carry information that gets blended according to the learned attention weights.",
    concepts: ["values", "weighted sum", "context vector"],
    chips: ["What do values contain?", "How does mixing work?", "Connect this to LLMs"],
  },
  {
    start: 1225,
    end: FALLBACK_VIDEO_SECONDS,
    title: "Multi-head attention",
    summary: "Multiple attention heads let the model track different relationship types at the same time.",
    concepts: ["multi-head attention", "parallel relationships", "representation"],
    chips: ["Why multiple heads?", "What does each head learn?", "Summarize this section"],
  },
];

const whyCards = [
  {
    copy: "See how transformer models move from sequence reading to contextual matching.",
    gradient: "/assets/figma/domain-gradient-01.png",
    icon: "brain",
    title: "Build the mental model",
  },
  {
    copy: "Use the same query/key/value language found in modern LLM papers and tools.",
    gradient: "/assets/figma/domain-gradient-03.png",
    icon: "square-code",
    title: "Decode model diagrams",
  },
  {
    copy: "Turn the lesson into notes, examples, and AI-assisted explanations while you watch.",
    gradient: "/assets/figma/domain-gradient-05.png",
    icon: "sparkle",
    title: "Study with context",
  },
] satisfies { copy: string; gradient: string; icon: LumenIconName; title: string }[];

const seededMessages: DiscussionMessage[] = [
  {
    avatar: "/assets/figma/avatar-01.png",
    author: "Elena Vance",
    body: "This deep dive into self-attention was incredibly helpful. I finally understand the difference between the Query and Key vectors in the context of the attention score matrix.",
    id: "seed-elena",
    likes: 12,
    nested: [
      {
        avatar: "/assets/figma/avatar-08.png",
        author: "Marcus Zhou",
        body: "The filing cabinet analogy for keys and queries really clicked for me too.",
        id: "seed-marcus",
        likes: 3,
        timeLabel: "45 mins ago",
        visibility: "public",
      },
    ],
    timeLabel: "2 hours ago",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-06.png",
    author: "Dr. Sarah L.",
    body: "The section on positional encoding could use a bit more detail regarding the sine and cosine implementation. Does anyone have a recommended paper for that specific math?",
    id: "seed-sarah",
    likes: 8,
    nested: [
      {
        avatar: "/assets/figma/avatar-03.png",
        author: "Ravi Menon",
        body: "The original transformer paper has the exact formula, but Grant's visual framing makes it easier to see why each position gets a unique signal instead of a learned word-like label.",
        id: "seed-ravi-positional",
        likes: 5,
        timeLabel: "4 hours ago",
        visibility: "public",
      },
    ],
    timestamp: "31:42",
    timeLabel: "5 hours ago",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-12.png",
    author: "Nora Patel",
    body: "My takeaway: attention weights are not an explanation by themselves, but they are a useful window into which tokens influence the next representation.",
    id: "seed-nora",
    likes: 6,
    timestamp: "24:18",
    timeLabel: "Yesterday",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-04.png",
    author: "Amir Hassan",
    body: "The moment where the value vectors get mixed back together helped me separate retrieval from output. Keys and queries decide the weights; values carry the content that actually moves forward.",
    id: "seed-amir-values",
    likes: 10,
    nested: [
      {
        avatar: "/assets/figma/avatar-09.png",
        author: "Mei Tan",
        body: "Same here. I wrote it as: query asks, key matches, value contributes. That sentence made the matrix multiplication order feel less abstract.",
        id: "seed-mei-values",
        likes: 4,
        timeLabel: "Yesterday",
        visibility: "public",
      },
    ],
    timestamp: "18:45",
    timeLabel: "Yesterday",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-10.png",
    author: "Priya Shah",
    body: "Quick check: is the square-root scaling mainly there to keep the dot products from getting too large before softmax? My notes say it keeps attention from becoming too peaky too early.",
    id: "seed-priya-scaling",
    likes: 7,
    timestamp: "21:08",
    timeLabel: "Yesterday",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-13.png",
    author: "Jordan Kim",
    body: "Does multi-head attention mean each head learns a different relationship, or is that just a common interpretation after training?",
    id: "seed-jordan-heads",
    likes: 9,
    nested: [
      {
        avatar: "/assets/figma/avatar-06.png",
        author: "Dr. Sarah L.",
        body: "Mostly the latter. The architecture gives each head its own projection space, but the useful interpretation comes from inspecting what it specializes in after learning.",
        id: "seed-sarah-heads",
        likes: 6,
        timeLabel: "Yesterday",
        visibility: "public",
      },
    ],
    timeLabel: "Yesterday",
    visibility: "public",
  },
  {
    avatar: "/assets/figma/avatar-15.png",
    author: "Grace Song",
    body: "I paused at the matrix view and used the AI check on my note. It caught that I wrote 'attention chooses one token,' when the better phrasing is that it forms a weighted mixture over tokens.",
    id: "seed-grace-ai-note",
    likes: 11,
    timestamp: "23:36",
    timeLabel: "2 days ago",
    visibility: "public",
  },
];

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimestamp(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatCourseDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getDisplayedSeconds(actualSeconds: number, actualDuration: number) {
  const duration = actualDuration > 0 ? actualDuration : FALLBACK_VIDEO_SECONDS;
  return Math.min(DISPLAY_LESSON_SECONDS, Math.round((actualSeconds / duration) * DISPLAY_LESSON_SECONDS));
}

function getActiveChunk(seconds: number) {
  return lessonChunks.find((chunk) => seconds >= chunk.start && seconds < chunk.end) ?? lessonChunks[0];
}

function getNextChunk(seconds: number) {
  return lessonChunks.find((chunk) => chunk.start > seconds) ?? null;
}

function getUniquePromptCandidates(chunk: LessonChunk, nextChunk: LessonChunk | null, displayedTimestamp: string, playbackState: PlaybackState) {
  const [primaryConcept = chunk.title, secondaryConcept = primaryConcept, tertiaryConcept = secondaryConcept] = chunk.concepts;
  const statusLead = playbackState === "playing" ? "While this plays" : "Before I continue";
  const nextTitle = nextChunk?.title ?? "the next attention step";

  return [
    `Explain ${primaryConcept} at ${displayedTimestamp}`,
    `Connect ${primaryConcept} to ${secondaryConcept}`,
    `Make a quick note on ${chunk.title}`,
    "What should I watch for next?",
    `${statusLead}, quiz me on ${primaryConcept}`,
    `Give an analogy for ${secondaryConcept}`,
    "Turn this moment into flashcards",
    `Why does ${tertiaryConcept} matter here?`,
    `Compare this with ${nextTitle}`,
    `Summarize ${chunk.title} in 3 bullets`,
    ...chunk.chips,
  ].filter((prompt, index, prompts) => prompts.indexOf(prompt) === index);
}

function buildContextPromptScan(currentScan: ContextPromptScan | null, actualSeconds: number, actualDuration: number, playbackState: PlaybackState): ContextPromptScan {
  const chunk = getActiveChunk(actualSeconds);
  const nextChunk = getNextChunk(actualSeconds);
  const displayedTimestamp = formatTimestamp(getDisplayedSeconds(actualSeconds, actualDuration));
  const scanIndex = (currentScan?.scanIndex ?? -1) + 1;
  const candidates = getUniquePromptCandidates(chunk, nextChunk, displayedTimestamp, playbackState);
  const step = playbackState === "playing" ? 2 : 3;
  const start = scanIndex % candidates.length;
  const prompts = [0, 1, 2].map((slot) => candidates[(start + slot * step) % candidates.length]);

  return {
    contextKey: `${chunk.start}:${Math.floor(actualSeconds / 15)}:${playbackState}:${scanIndex}`,
    prompts,
    scanIndex,
  };
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
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

function streamingCourseResponseFromMarkdown(markdown: string): AiResponseEnvelope {
  return {
    answerKind: "answer",
    surface: "courseRail",
    conversationTitle: "MOOCKY AI",
    answerMarkdown: markdown,
    contextTags: [],
    followUpChips: [],
    courseRecommendationCards: [],
  };
}

function loadYouTubeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API is not available on the server."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise<YouTubeApi>((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        if (window.YT) {
          resolve(window.YT);
        }
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

function getFullscreenElement() {
  const fullscreenDocument = document as FullscreenDocument;
  return fullscreenDocument.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
}

async function requestElementFullscreen(element: HTMLElement) {
  const fullscreenElement = element as FullscreenElement;

  if (fullscreenElement.requestFullscreen) {
    await fullscreenElement.requestFullscreen();
    return;
  }

  await fullscreenElement.webkitRequestFullscreen?.();
}

async function exitDocumentFullscreen() {
  const fullscreenDocument = document as FullscreenDocument;

  if (fullscreenDocument.exitFullscreen) {
    await fullscreenDocument.exitFullscreen();
    return;
  }

  await fullscreenDocument.webkitExitFullscreen?.();
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

function CourseHeader({ theme, onThemeToggle }: { theme: ThemeName; onThemeToggle: () => void }) {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className={`marketing-header is-authenticated ${isSearchActive ? "is-searching" : ""}`}>
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
          <AuthenticatedHeaderControls onSearchActiveChange={setIsSearchActive} onThemeToggle={onThemeToggle} themeToggleLabel={`Switch to ${theme === "light" ? "dark" : "light"} mode`} />
        </div>
      </div>
    </header>
  );
}

function parseTableRow(row: string) {
  return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableBlock(block: string) {
  const lines = block.split("\n").filter(Boolean);
  return lines.length >= 2 && lines[0].includes("|") && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1]);
}

function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={`${keyPrefix}-${partIndex}`}>{part.slice(2, -2)}</strong> : <span key={`${keyPrefix}-${partIndex}`}>{part}</span>,
  );
}

function MarkdownView({ isTyping = false, markdown }: { isTyping?: boolean; markdown: string }) {
  const blocks = markdown.split(/\n{2,}/).filter(Boolean);

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
                    {headers.map((header) => (
                      <th key={header}>{renderInline(header, `th-${index}-${header}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={`${index}-${row.join("-") || rowIndex}`}>
                      {headers.map((header, cellIndex) => (
                        <td key={`${header}-${cellIndex}`}>{renderInline(row[cellIndex] ?? "", `td-${index}-${rowIndex}-${cellIndex}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.startsWith("### ")) {
          return <h4 key={index}>{block.slice(4)}</h4>;
        }

        if (block.startsWith("## ")) {
          return <h3 key={index}>{block.slice(3)}</h3>;
        }

        if (block.includes("\n- ") || block.startsWith("- ")) {
          return (
            <ul key={index}>
              {block
                .split("\n")
                .filter(Boolean)
                .map((line) => (
                  <li key={line}>{line.replace(/^- /, "")}</li>
                ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block, `p-${index}`)}</p>;
      })}
    </div>
  );
}

type NoteCheckTone = "noteCheckToneGood" | "noteCheckToneWarn" | "noteCheckToneBad";

function cleanNoteCheckValue(value: string) {
  return value
    .replace(/^[-*]\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readNoteCheckField(lines: string[], field: "Verdict" | "Why" | "Fix") {
  const pattern = new RegExp(`^\\*\\*${field}:\\*\\*\\s*(.+)$`, "i");
  const fallbackPattern = new RegExp(`^${field}:\\s*(.+)$`, "i");

  for (const line of lines) {
    const match = line.match(pattern) ?? line.match(fallbackPattern);

    if (match?.[1]) {
      return cleanNoteCheckValue(match[1]);
    }
  }

  return "";
}

function splitCompactSentences(value: string) {
  return (value.replace(/\*\*/g, "").match(/[^.!?。！？]+[.!?。！？]?/g) ?? []).map((sentence) => sentence.trim()).filter(Boolean);
}

function parseNoteCheck(markdown: string) {
  const lines = markdown.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const compactText = cleanNoteCheckValue(markdown.replace(/\n+/g, " "));
  const sentences = splitCompactSentences(compactText);
  const verdict = readNoteCheckField(lines, "Verdict") || "Review";
  const why = readNoteCheckField(lines, "Why") || sentences[0] || "MOOCKY AI checked this note against the current lesson context.";
  const fix = readNoteCheckField(lines, "Fix") || sentences.slice(1, 3).join(" ") || "Add the most relevant course term before posting.";
  const extra = lines.find((line) => /^[-*]\s+/.test(line));
  const lowerVerdict = verdict.toLowerCase();
  const tone: NoteCheckTone = lowerVerdict.includes("correct")
    ? "noteCheckToneGood"
    : lowerVerdict.includes("misconception") || lowerVerdict.includes("wrong")
      ? "noteCheckToneBad"
      : "noteCheckToneWarn";

  return {
    extra: extra ? cleanNoteCheckValue(extra) : "",
    fix,
    tone,
    verdict,
    why,
  };
}

function NoteCheckResult({ markdown }: { markdown: string }) {
  const feedback = parseNoteCheck(markdown);

  return (
    <aside className={styles.noteCheckResult} role="status">
      <div className={styles.noteCheckHeader}>
        <span className={`${styles.noteCheckBadge} ${styles[feedback.tone]}`}>{feedback.verdict}</span>
        <span>AI check</span>
      </div>
      <div className={styles.noteCheckBody}>
        <p>
          <strong>Why</strong>
          <span>{feedback.why}</span>
        </p>
        <p>
          <strong>Fix</strong>
          <span>{feedback.fix}</span>
        </p>
        {feedback.extra ? <p className={styles.noteCheckExtra}>{feedback.extra}</p> : null}
      </div>
    </aside>
  );
}

function ThinkingMarker({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="thinking-glyph is-active" aria-hidden="true">
        <span className="thinking-glow" />
        <span className="thinking-spark-shell">
          <LumenIcon name="sparkle" />
        </span>
      </span>
    );
  }

  return (
    <span className="answer-static-sparkle" aria-hidden="true">
      <LumenIcon name="sparkle" size={13.337} />
    </span>
  );
}

function ContextTags({ response }: { response: AiResponseEnvelope }) {
  if (response.contextTags.length === 0) {
    return null;
  }

  return (
    <div className="context-tags">
      {response.contextTags.map((tag) => (
        <a href={`/course?context=${encodeURIComponent(tag.type)}&value=${encodeURIComponent(tag.value)}`} key={`${tag.type}-${tag.value}`}>
          {tag.label}: {tag.value}
        </a>
      ))}
    </div>
  );
}

function LessonMedia({
  actualDuration,
  compact,
  currentTime,
  displaySeconds,
  hasStarted,
  onPlay,
  onToggle,
  playbackState,
  playerReady,
  playerTargetRef,
}: {
  actualDuration: number;
  compact: boolean;
  currentTime: number;
  displaySeconds: number;
  hasStarted: boolean;
  onPlay: () => void;
  onToggle: () => void;
  playbackState: PlaybackState;
  playerReady: boolean;
  playerTargetRef: RefObject<HTMLDivElement | null>;
}) {
  const progress = Math.min(100, (displaySeconds / DISPLAY_LESSON_SECONDS) * 100);
  const isPlaying = playbackState === "playing";
  const posterSrc = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
  const showPoster = !playerReady;
  const videoShellRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [youtubeFrameSize, setYoutubeFrameSize] = useState<{ height: number; width: number } | null>(null);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(getFullscreenElement() === videoShellRef.current);
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("webkitfullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("webkitfullscreenchange", syncFullscreenState);
    };
  }, []);

  useLayoutEffect(() => {
    const shell = videoShellRef.current;

    if (!shell) {
      return;
    }

    const updateFrameSize = () => {
      const height = shell.clientHeight;
      const width = shell.clientWidth;

      if (!height || !width) {
        return;
      }

      const videoAspect = 16 / 9;
      const shellAspect = width / height;
      const nextSize =
        shellAspect >= videoAspect
          ? { height: Math.ceil(width / videoAspect), width: Math.ceil(width) }
          : { height: Math.ceil(height), width: Math.ceil(height * videoAspect) };

      setYoutubeFrameSize((current) => {
        if (current?.height === nextSize.height && current.width === nextSize.width) {
          return current;
        }

        return nextSize;
      });
    };

    updateFrameSize();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateFrameSize) : null;
    observer?.observe(shell);
    window.addEventListener("resize", updateFrameSize);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateFrameSize);
    };
  }, [compact]);

  const requestPlay = () => {
    onPlay();
  };
  const requestToggle = () => {
    onToggle();
  };
  const requestFullscreenToggle = async () => {
    const shell = videoShellRef.current;

    if (!shell) {
      return;
    }

    try {
      if (getFullscreenElement() === shell) {
        await exitDocumentFullscreen();
        return;
      }

      await requestElementFullscreen(shell);
    } catch {
      setIsFullscreen(false);
    }
  };

  return (
    <section className={`${styles.mediaPanel} ${compact ? styles.isCompactMedia : ""} ${isPlaying ? styles.isPlayingMedia : ""}`} aria-label="Lesson video">
      <div
        className={styles.videoShell}
        ref={videoShellRef}
        style={
          youtubeFrameSize
            ? ({
                "--youtube-frame-height": `${youtubeFrameSize.height}px`,
                "--youtube-frame-width": `${youtubeFrameSize.width}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <div className={styles.youtubeTarget} ref={playerTargetRef} />
        {showPoster ? <img className={styles.videoPoster} src={posterSrc} alt="" /> : null}
        {compact && !isPlaying ? <span className={styles.compactVideoMask} aria-hidden="true" /> : null}
        {!compact ? <span className={styles.youtubeChromeMask} aria-hidden="true" /> : null}
        {!compact && hasStarted && !isPlaying ? <span className={styles.youtubePausedMask} aria-hidden="true" /> : null}
        {!hasStarted && !isPlaying ? (
          <div className={styles.videoOverlay}>
            <Button
              aria-label="Play lesson"
              className={styles.resumeButton}
              icon="circle-play"
              kind="floatingResume"
              onClick={requestPlay}
              type="button"
            />
          </div>
        ) : null}
        {!compact ? (
          <div className={styles.videoControls}>
            <div className={styles.videoControlLeft}>
              <button aria-label={isPlaying ? "Pause video" : "Play video"} onClick={requestToggle} type="button">
                <LumenIcon name={isPlaying ? "circle-pause" : "circle-play"} />
              </button>
              <button aria-label="Volume" type="button">
                <LumenIcon name="volume-1" />
              </button>
            </div>
            <div className={styles.videoProgress}>
              <span style={{ "--video-progress": `${progress}%` } as CSSProperties} />
            </div>
            <div className={styles.videoTime}>
              <span>{formatTimestamp(displaySeconds)}</span>
              <span>{formatCourseDuration(DISPLAY_LESSON_SECONDS)}</span>
            </div>
            <div className={styles.videoControlRight}>
              <button aria-label="Closed captions" type="button">
                <LumenIcon name="closed-caption" />
              </button>
              <button aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={requestFullscreenToggle} type="button">
                <LumenIcon name={isFullscreen ? "minimize" : "scan"} />
              </button>
              <button aria-label="Video settings" type="button">
                <LumenIcon name="settings" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {!compact ? (
        <>
          <a className={styles.videoSource} href={YOUTUBE_SOURCE_URL} target="_blank" rel="noreferrer">
            3Blue1Brown lesson source
            <LumenIcon name="arrow-up-right" />
          </a>
          <span className={styles.actualVideoTime}>{formatTimestamp(currentTime)} real video time / {formatTimestamp(actualDuration || FALLBACK_VIDEO_SECONDS)}</span>
        </>
      ) : null}
    </section>
  );
}

function LessonCopy({ activeChunk, liveCount, variant }: { activeChunk: LessonChunk; liveCount: number; variant: "paused" | "playing" }) {
  return (
    <section className={styles.lessonCopy} aria-labelledby="course-title">
      <div className={styles.lessonTitleBlock}>
        <h1 className={styles.displayTitle} id="course-title">
          <span>Neural</span>
          <span>Architecture</span>
        </h1>
        {variant === "playing" ? <p className={styles.lessonSubtitle}>Transformers & Attention</p> : null}
      </div>
      <div className={styles.liveRow}>
        <span className={styles.liveIcon}>
          <LumenIcon name="radio" />
        </span>
        <span>{liveCount.toLocaleString("en-US")} Students Learning Live</span>
      </div>
      <p className={styles.lessonDescription}>
        In this deep dive, we explore the foundational blocks of modern Large Language Models. Understanding the transformer architecture isn't just about math; it's about the conceptual shift from sequential processing to parallel attention.
      </p>
      {variant === "playing" ? (
        <div className={styles.currentContext}>
          <strong>{activeChunk.title}</strong>
          <span>{activeChunk.summary}</span>
        </div>
      ) : null}
    </section>
  );
}

function CourseRailTabs({ activeTab, onTabChange }: { activeTab: RailTab; onTabChange: (tab: RailTab) => void }) {
  return (
    <div className={styles.railTabs} data-active-tab={activeTab}>
      <button className={activeTab === "progress" ? styles.isActive : ""} onClick={() => onTabChange("progress")} type="button">
        <LumenIcon name="loader" />
        <span>Course Progress</span>
      </button>
      <button className={activeTab === "ai" ? styles.isActive : ""} onClick={() => onTabChange("ai")} type="button">
        <LumenIcon name="sparkle" />
        <span>MOOCKY AI</span>
      </button>
      <span className={styles.railTabIndicator} />
      <span className={styles.railCompactIcon} aria-hidden="true">
        <LumenIcon name="chevrons-right-left" />
      </span>
    </div>
  );
}

function CurriculumRail({ expanded, onExpandedChange }: { expanded: boolean; onExpandedChange: (expanded: boolean) => void }) {
  const visibleItems = expanded ? curriculum : curriculum.slice(0, 6);

  return (
    <div className={styles.curriculumRail}>
      <div className={styles.courseProgressTrack}>
        <span />
      </div>
      <div className={styles.curriculumHeader}>
        <h2>Curriculum</h2>
        <span>4/12 Completed</span>
      </div>
      <div className={styles.curriculumList}>
        {visibleItems.map((item) => (
          <article className={`${styles.curriculumItem} ${styles[item.state]}`} key={item.id}>
            <span className={styles.lessonStatusIcon}>
              <LumenIcon name="badge-check" />
            </span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </div>
            {item.state === "current" ? <em>{item.duration}</em> : null}
          </article>
        ))}
      </div>
      <button className={styles.expandButton} onClick={() => onExpandedChange(!expanded)} type="button">
        <span>{expanded ? "Collapse" : "Expand"}</span>
        <LumenIcon name={expanded ? "arrow-up" : "arrow-down"} />
      </button>
    </div>
  );
}

function AiRail({
  aiAnswer,
  aiBusy,
  aiInput,
  aiQuestion,
  aiReasoning,
  aiStreamingAnswer,
  conversations,
  contextPromptKey,
  contextPrompts,
  displayedTimestamp,
  onExpandAnswer,
  onInputChange,
  onNewConversation,
  onPrompt,
  onSelectConversation,
  onSubmit,
  playbackState,
}: {
  aiAnswer: AiResponseEnvelope | null;
  aiBusy: boolean;
  aiInput: string;
  aiQuestion: string;
  aiReasoning: string;
  aiStreamingAnswer: string;
  conversations: CourseAiConversation[];
  contextPromptKey: string;
  contextPrompts: string[];
  displayedTimestamp: string;
  onExpandAnswer: () => void;
  onInputChange: (value: string) => void;
  onNewConversation: () => void;
  onPrompt: (prompt: string) => void;
  onSelectConversation: (conversation: CourseAiConversation) => void;
  onSubmit: () => void;
  playbackState: PlaybackState;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const visibleAiAnswer = aiAnswer ?? (aiStreamingAnswer.trim() ? streamingCourseResponseFromMarkdown(aiStreamingAnswer) : null);
  const canSubmit = aiInput.trim().length > 0 && !aiBusy;
  const canShowContextPrompts = !aiInput.trim() && !aiQuestion && !visibleAiAnswer && !aiBusy;
  const headerLabel = aiAnswer ? aiAnswer.conversationTitle : playbackState === "playing" ? "Watching with you" : "Questions?";

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
    <div className={styles.aiRail}>
      <div className={styles.aiRailHeader}>
        <button aria-expanded={historyOpen} aria-label="Conversation history" onClick={() => setHistoryOpen((open) => !open)} type="button">
          <LumenIcon name="history" />
        </button>
        <h2>
          {headerLabel}
          {playbackState === "playing" && !aiAnswer ? (
            <span className={styles.watchingDots} aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : null}
        </h2>
        <div className={styles.aiRailActions}>
          <button aria-label="Start new conversation" onClick={onNewConversation} type="button">
            <LumenIcon name="pencil-line" />
          </button>
          {aiAnswer ? (
            <button aria-label="Open answer in AI Chat" onClick={onExpandAnswer} type="button">
              <LumenIcon name="chevrons-right-left" />
            </button>
          ) : null}
        </div>
        {historyOpen ? (
          <div className={styles.historyPopover}>
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    onSelectConversation(conversation);
                    setHistoryOpen(false);
                  }}
                  type="button"
                >
                  <span>{conversation.title}</span>
                  <em>{conversation.timestamp}</em>
                </button>
              ))
            ) : (
              <span>No previous course questions</span>
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.aiRailBody}>
        {canShowContextPrompts ? (
          <div className={styles.contextChipStack} key={contextPromptKey} aria-label="Context prompts">
            {contextPrompts.map((chip) => (
              <button key={chip} onClick={() => onPrompt(chip)} type="button">
                {chip}
              </button>
            ))}
          </div>
        ) : null}

        {aiQuestion ? (
          <div className={styles.aiQuestionBubble}>
            <span>{aiQuestion}</span>
          </div>
        ) : null}

        {aiBusy || visibleAiAnswer ? (
          <div className={`ai-answer-block ${styles.courseAnswerBlock}`}>
            <ThinkingMarker active={aiBusy} />
            <div className="ai-answer-content">
              <div className="ai-answer-meta">
                {aiBusy ? (
                  <div className="reasoning-live" aria-live="polite">
                    <div className="thinking-status">Thinking...</div>
                    <pre className="reasoning-body">{aiReasoning || `Checking ${displayedTimestamp} context...`}</pre>
                  </div>
                ) : (
                  <div className="thought-line">Thought for 1s</div>
                )}
              </div>
              {visibleAiAnswer ? (
                <>
                  <ContextTags response={visibleAiAnswer} />
                  <div className="answer-body">
                    <MarkdownView isTyping={!aiAnswer && Boolean(aiStreamingAnswer.trim())} markdown={visibleAiAnswer.answerMarkdown} />
                  </div>
                  {aiAnswer && aiAnswer.followUpChips.length > 0 ? (
                    <div className="answer-followups">
                      {aiAnswer.followUpChips.slice(0, 3).map((chip) => (
                        <button disabled={aiBusy} key={chip} onClick={() => onPrompt(chip)} type="button">
                          {chip}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <form className={`${styles.aiComposer} ${canSubmit ? styles.isReady : ""}`} onSubmit={submit}>
        <label className="sr-only" htmlFor="course-ai-composer">
          Ask MOOCKY AI about this lesson
        </label>
        <textarea
          disabled={aiBusy}
          id="course-ai-composer"
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={submitFromKeyboard}
          placeholder="Ask anything you are curious about in this context..."
          value={aiInput}
        />
        <button aria-label="Send question" disabled={!canSubmit} type="submit">
          <LumenIcon name="arrow-right" />
        </button>
      </form>
    </div>
  );
}

function CourseRail(props: {
  activeTab: RailTab;
  aiAnswer: AiResponseEnvelope | null;
  aiBusy: boolean;
  aiInput: string;
  aiQuestion: string;
  aiReasoning: string;
  aiStreamingAnswer: string;
  conversations: CourseAiConversation[];
  contextPromptKey: string;
  contextPrompts: string[];
  displayedTimestamp: string;
  expanded: boolean;
  onAiInputChange: (value: string) => void;
  onAiNewConversation: () => void;
  onAiPrompt: (prompt: string) => void;
  onAiSelectConversation: (conversation: CourseAiConversation) => void;
  onAiSubmit: () => void;
  onExpandAnswer: () => void;
  onExpandedChange: (expanded: boolean) => void;
  onTabChange: (tab: RailTab) => void;
  playbackState: PlaybackState;
}) {
  const railRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    let animationFrame = 0;

    const updateRailHeight = () => {
      animationFrame = 0;
      const topGap = Math.max(12, Math.ceil(rail.getBoundingClientRect().top));
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const availableHeight = Math.max(0, Math.floor(viewportHeight - topGap - 12));
      rail.style.setProperty("--course-rail-available-height", `${availableHeight}px`);
    };

    const scheduleRailHeightUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateRailHeight);
    };

    updateRailHeight();
    window.addEventListener("resize", scheduleRailHeightUpdate);
    window.addEventListener("scroll", scheduleRailHeightUpdate, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleRailHeightUpdate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      rail.style.removeProperty("--course-rail-available-height");
      window.removeEventListener("resize", scheduleRailHeightUpdate);
      window.removeEventListener("scroll", scheduleRailHeightUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleRailHeightUpdate);
    };
  }, [props.activeTab, props.expanded]);

  return (
    <aside ref={railRef} className={styles.courseRail} data-active-tab={props.activeTab} data-expanded={props.expanded}>
      <CourseRailTabs activeTab={props.activeTab} onTabChange={props.onTabChange} />
      {props.activeTab === "progress" ? (
        <CurriculumRail expanded={props.expanded} onExpandedChange={props.onExpandedChange} />
      ) : (
        <AiRail
          aiAnswer={props.aiAnswer}
          aiBusy={props.aiBusy}
          aiInput={props.aiInput}
          aiQuestion={props.aiQuestion}
          aiReasoning={props.aiReasoning}
          aiStreamingAnswer={props.aiStreamingAnswer}
          conversations={props.conversations}
          contextPromptKey={props.contextPromptKey}
          contextPrompts={props.contextPrompts}
          displayedTimestamp={props.displayedTimestamp}
          onExpandAnswer={props.onExpandAnswer}
          onInputChange={props.onAiInputChange}
          onNewConversation={props.onAiNewConversation}
          onPrompt={props.onAiPrompt}
          onSelectConversation={props.onAiSelectConversation}
          onSubmit={props.onAiSubmit}
          playbackState={props.playbackState}
        />
      )}
    </aside>
  );
}

function DetailTab({ activeChunk, liveCount, showLessonSummary }: { activeChunk: LessonChunk; liveCount: number; showLessonSummary: boolean }) {
  const instructorName = "Grant Sanderson";

  return (
    <div className={styles.detailStack}>
      {showLessonSummary ? <LessonCopy activeChunk={activeChunk} liveCount={liveCount} variant="playing" /> : null}
      <section className={styles.instructorPanel} aria-labelledby="instructor-title">
        <div className={styles.sectionHeading}>
          <h2 id="instructor-title">Instructor</h2>
        </div>
        <article className={styles.instructorCard}>
          <div className={styles.instructorInfo}>
            <div className={styles.instructorIdentity}>
              <span className={styles.instructorInitials} aria-hidden="true">{getInitials(instructorName)}</span>
              <div className={styles.instructorNameBlock}>
                <strong>Grant Sanderson</strong>
                <span>Mathematics educator</span>
              </div>
            </div>
            <ul className={styles.instructorFacts}>
              <li>Studied mathematics and computer science at Stanford</li>
              <li>Creates visual math lessons and Manim animations for deep understanding</li>
            </ul>
          </div>
          <div className={styles.instructorActions}>
            <a className={styles.instructorSecondaryAction} href="https://www.3blue1brown.com/about/" target="_blank" rel="noreferrer">
              <span>Website</span>
              <LumenIcon name="arrow-up-right" />
            </a>
            <a className={styles.instructorPrimaryAction} href={YOUTUBE_SOURCE_URL} target="_blank" rel="noreferrer">
              <span>Lesson</span>
              <LumenIcon name="arrow-up-right" />
            </a>
          </div>
        </article>
      </section>
      <section className={styles.whySection} aria-labelledby="why-title">
        <div className={styles.sectionHeading}>
          <h2 id="why-title">Why Take This Course?</h2>
          <Button kind="auxiliaryAction" label="More" />
        </div>
        <div className={styles.whyGrid}>
          {whyCards.map((card) => (
            <article className={styles.whyCard} key={card.title} style={{ "--hover-gradient": `url(${card.gradient})` } as CSSProperties}>
              <span>
                <LumenIcon name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TimestampCard({ timestamp }: { timestamp: string }) {
  return (
    <button className={styles.timestampCard} type="button">
      <img src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`} alt="" />
      <span>{timestamp}</span>
    </button>
  );
}

function DiscussionComment({ message, nested = false }: { message: DiscussionMessage; nested?: boolean }) {
  return (
    <article className={`${styles.comment} ${nested ? styles.isNestedComment : ""}`}>
      {message.avatar ? (
        <img className={styles.commentAvatar} src={message.avatar} alt="" />
      ) : (
        <span className={`${styles.commentAvatar} ${styles.avatarPlaceholder}`} aria-hidden="true">
          <LumenIcon name="circle-user" />
        </span>
      )}
      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <strong>{message.author}</strong>
          <span>{message.timeLabel}</span>
          {message.visibility === "private" ? <em>Private</em> : null}
        </div>
        {message.timestamp ? <TimestampCard timestamp={message.timestamp} /> : null}
        <p>{message.body}</p>
        <div className={styles.commentActions}>
          <button type="button">
            <LumenIcon name="thumbs-up" />
            <span>{message.likes}</span>
          </button>
          <button className={styles.commentReplyButton} type="button">
            Reply
          </button>
        </div>
        {message.nested?.length ? (
          <div className={styles.nestedReplies}>
            {message.nested.map((reply) => (
              <DiscussionComment key={reply.id} message={reply} nested />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ComposerAvatarPlaceholder() {
  return (
    <span className={styles.composerAvatarPlaceholder} aria-hidden="true">
      <LumenIcon name="circle-user" />
    </span>
  );
}

function DiscussionTab({
  displayedTimestamp,
  messages,
  noteCheck,
  noteCheckBusy,
  notePublic,
  noteText,
  onCheckNote,
  onClearNoteCheck,
  onNotePublicChange,
  onNoteTextChange,
  onSend,
  onTimestampChange,
  onToggleMineOnly,
  timestampEnabled,
  showMineOnly,
}: {
  displayedTimestamp: string;
  messages: DiscussionMessage[];
  noteCheck: string;
  noteCheckBusy: boolean;
  notePublic: boolean;
  noteText: string;
  onCheckNote: () => void;
  onClearNoteCheck: () => void;
  onNotePublicChange: (value: boolean) => void;
  onNoteTextChange: (value: string) => void;
  onSend: () => void;
  onTimestampChange: (value: boolean) => void;
  onToggleMineOnly: () => void;
  showMineOnly: boolean;
  timestampEnabled: boolean;
}) {
  const visibleMessages = showMineOnly ? messages.filter((message) => message.isMine) : messages;
  const canSend = noteText.trim().length > 0;
  const hasNoteCheck = Boolean(noteCheck);
  const aiCheckClassName = `${styles.aiCheckButton} ${noteCheckBusy ? styles.isThinking : ""} ${hasNoteCheck ? styles.isAnswered : ""}`;
  const aiCheckLabel = noteCheckBusy ? "Checking note with AI" : hasNoteCheck ? "Close AI check result" : "Check note with AI";
  const handleAiCheckAction = hasNoteCheck && !noteCheckBusy ? onClearNoteCheck : onCheckNote;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend();
  };

  return (
    <section className={styles.discussionTab} aria-labelledby="discussion-title">
      <div className={styles.discussionComposerDock}>
        <form className={styles.discussionComposer} onSubmit={submit}>
          <ComposerAvatarPlaceholder />
          <div className={styles.composerMain}>
            <label className="sr-only" htmlFor="discussion-note">
              Discussion note
            </label>
            <textarea
              id="discussion-note"
              onChange={(event) => onNoteTextChange(event.target.value)}
              placeholder="Join the discussion or ask a question..."
              value={noteText}
            />
            <div className={styles.composerControls}>
              <div className={styles.composerButtonGroup}>
                <button aria-label="Attach screenshot" type="button">
                  <LumenIcon name="camera" />
                </button>
                <button aria-label="Upload file" type="button">
                  <LumenIcon name="upload" />
                </button>
                <button
                  aria-label={aiCheckLabel}
                  className={aiCheckClassName}
                  disabled={noteCheckBusy || (!hasNoteCheck && !canSend)}
                  onClick={handleAiCheckAction}
                  type="button"
                >
                  <LumenIcon name={hasNoteCheck && !noteCheckBusy ? "x" : "sparkle"} />
                  {noteCheckBusy ? <span>Thinking</span> : null}
                </button>
              </div>
              <label className={styles.checkboxControl}>
                <input checked={notePublic} onChange={(event) => onNotePublicChange(event.target.checked)} type="checkbox" />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxLabel}>Public</span>
              </label>
              <label className={styles.checkboxControl}>
                <input checked={timestampEnabled} onChange={(event) => onTimestampChange(event.target.checked)} type="checkbox" />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxLabel}>{displayedTimestamp}</span>
              </label>
              <button className={styles.discussionSend} disabled={!canSend} type="submit" aria-label="Send discussion message">
                <LumenIcon name="arrow-right" />
              </button>
            </div>
            {noteCheck ? <NoteCheckResult markdown={noteCheck} /> : null}
          </div>
        </form>
        <div className={styles.notesToggleRow}>
          <button className={showMineOnly ? styles.isActive : ""} onClick={onToggleMineOnly} type="button">
            <LumenIcon name={showMineOnly ? "circle-user" : "circle"} />
            <span>My Notes</span>
          </button>
        </div>
      </div>
      <div className={styles.commentsList}>
        {visibleMessages.length > 0 ? (
          visibleMessages.map((message) => <DiscussionComment key={message.id} message={message} />)
        ) : (
          <p className={styles.emptyNotes}>No personal notes yet. Add one with My Notes turned on or post privately.</p>
        )}
      </div>
    </section>
  );
}

export function CoursePageClient() {
  const [theme, setTheme] = useThemeState();
  const [playbackState, setPlaybackState] = useState<PlaybackState>("paused");
  const [hasStarted, setHasStarted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(FALLBACK_VIDEO_SECONDS);
  const [liveCount, setLiveCount] = useState(1240);
  const [railTab, setRailTab] = useState<RailTab>("progress");
  const [curriculumExpanded, setCurriculumExpanded] = useState(false);
  const [contentTab, setContentTab] = useState<ContentTab>("discussion");
  const [aiInput, setAiInput] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<AiResponseEnvelope | null>(null);
  const [aiReasoning, setAiReasoning] = useState("");
  const [aiStreamingAnswer, setAiStreamingAnswer] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiConversations, setAiConversations] = useState<CourseAiConversation[]>([]);
  const [contextPromptScan, setContextPromptScan] = useState<ContextPromptScan>(() => buildContextPromptScan(null, 0, FALLBACK_VIDEO_SECONDS, "paused"));
  const [sessionMessages, setSessionMessages] = useState<DiscussionMessage[]>([]);
  const [noteText, setNoteText] = useState("");
  const [notePublic, setNotePublic] = useState(false);
  const [timestampEnabled, setTimestampEnabled] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [noteCheck, setNoteCheck] = useState("");
  const [noteCheckBusy, setNoteCheckBusy] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const contextScanInputRef = useRef({
    actualDuration: FALLBACK_VIDEO_SECONDS,
    currentTime: 0,
    playbackState: "paused" as PlaybackState,
  });
  const router = useRouter();
  const displaySeconds = getDisplayedSeconds(currentTime, actualDuration);
  const displayedTimestamp = formatTimestamp(displaySeconds);
  const activeChunk = getActiveChunk(currentTime);
  const isIntroFocus = !hasStarted;
  const discussionMessages = useMemo(() => [...sessionMessages, ...seededMessages], [sessionMessages]);

  useEffect(() => {
    contextScanInputRef.current = {
      actualDuration,
      currentTime,
      playbackState,
    };
  }, [actualDuration, currentTime, playbackState]);

  useEffect(() => {
    const scanCourseContext = () => {
      setContextPromptScan((currentScan) => {
        const latest = contextScanInputRef.current;
        const actualSeconds = readPlayerCurrentTime(playerRef.current) ?? latest.currentTime;

        return buildContextPromptScan(currentScan, actualSeconds, latest.actualDuration, latest.playbackState);
      });
    };

    scanCourseContext();
    const timer = window.setInterval(scanCourseContext, CONTEXT_CHIP_SCAN_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let disposed = false;

    if (!playerContainerRef.current) {
      return;
    }

    void loadYouTubeApi().then((YT) => {
      if (disposed || !playerContainerRef.current) {
        return;
      }

      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (disposed) {
              return;
            }
            setPlayerReady(true);
            const duration = readPlayerDuration(playerRef.current) ?? FALLBACK_VIDEO_SECONDS;
            setActualDuration(duration);
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setPlaybackState("playing");
              setHasStarted(true);
              setRailTab("ai");
            }
            if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              setPlaybackState("paused");
              setRailTab("ai");
            }
          },
        },
      });
    });

    return () => {
      disposed = true;
      destroyPlayer(playerRef.current);
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (playbackState !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      const nextTime = readPlayerCurrentTime(playerRef.current) ?? currentTime;
      setCurrentTime(nextTime);
      const duration = readPlayerDuration(playerRef.current) ?? FALLBACK_VIDEO_SECONDS;
      setActualDuration(duration);
    }, 600);

    return () => window.clearInterval(timer);
  }, [currentTime, playbackState]);

  useEffect(() => {
    let timer: number | null = null;
    const tick = () => {
      setLiveCount((count) => Math.min(1288, Math.max(1216, count + Math.floor(Math.random() * 7) - 3)));
      timer = window.setTimeout(tick, 500 + Math.random() * 1000);
    };

    timer = window.setTimeout(tick, 700);

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const playVideo = () => {
    try {
      playerRef.current?.playVideo();
    } catch {
      // The iframe API can briefly reject while it is still negotiating origin.
    }
    setHasStarted(true);
    setPlaybackState("playing");
    setRailTab("ai");
  };

  const pauseVideo = () => {
    try {
      playerRef.current?.pauseVideo();
    } catch {
      // Keep the lesson UI responsive even if the iframe is mid-initialization.
    }
    setPlaybackState("paused");
    setRailTab("ai");
  };
  const toggleVideo = () => {
    let playerIsPlaying = playbackState === "playing";

    try {
      playerIsPlaying = playerRef.current?.getPlayerState() === 1 || playerIsPlaying;
    } catch {
      playerIsPlaying = playbackState === "playing";
    }

    if (playerIsPlaying) {
      pauseVideo();
      return;
    }

    playVideo();
  };

  const runAiPrompt = useCallback(
    async (prompt: string) => {
      const cleanPrompt = prompt.trim();

      if (!cleanPrompt || aiBusy) {
        return;
      }

      const startedAt = Date.now();
      setAiBusy(true);
      setAiInput("");
      setAiQuestion(cleanPrompt);
      setAiAnswer(null);
      setAiReasoning("");
      setAiStreamingAnswer("");
      setRailTab("ai");

      try {
        const response = await fetch("/api/moocky-ai/stream", {
          body: JSON.stringify({
            courseContext: {
              courseTitle: "Neural Architecture",
              currentLesson: "Transformers & Attention",
              displayedTimestamp,
              lessonDuration: formatCourseDuration(DISPLAY_LESSON_SECONDS),
              lessonSource: YOUTUBE_SOURCE_URL,
              transcriptExcerpt: activeChunk.summary,
            },
            conversationMode: "newChat",
            entrySource: "direct",
            lessonContext: {
              activeChapter: activeChunk.title,
              nearbyConcepts: activeChunk.concepts,
              summary: activeChunk.summary,
              transcriptChunks: lessonChunks.map((chunk) => ({
                end: formatTimestamp(getDisplayedSeconds(chunk.end, FALLBACK_VIDEO_SECONDS)),
                start: formatTimestamp(getDisplayedSeconds(chunk.start, FALLBACK_VIDEO_SECONDS)),
                text: chunk.summary,
                title: chunk.title,
              })),
            },
            surface: "courseRail",
            task: "courseQuestion",
            userMessage: cleanPrompt,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok || !response.body) {
          throw new Error("Course AI stream unavailable.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalContent = "";
        let finalResponse: AiResponseEnvelope | null = null;

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
              setAiReasoning((reasoning) => `${reasoning}${event.delta}`);
            }

            if (event.type === "answer_delta" && event.delta) {
              setAiStreamingAnswer((answer) => `${answer}${event.delta}`);
            }

            if (event.type === "content_delta" && event.delta) {
              finalContent += event.delta;
            }

            if (event.type === "done") {
              finalResponse = event.response ?? null;
            }

            if (event.type === "error") {
              throw new Error(event.message || "Course AI failed.");
            }
          }
        }

        if (!finalResponse && finalContent) {
          finalResponse = JSON.parse(finalContent) as AiResponseEnvelope;
        }

        if (!finalResponse) {
          throw new Error("Course AI returned no answer.");
        }

        const answer = finalResponse;
        setAiAnswer(answer);
        setAiConversations((current) => [
          {
            createdAt: startedAt,
            id: createId("course-ai"),
            question: cleanPrompt,
            response: answer,
            timestamp: displayedTimestamp,
            title: answer.conversationTitle || cleanPrompt,
          },
          ...current,
        ].slice(0, 8));
      } catch {
        const fallback: AiResponseEnvelope = {
          answerKind: "answer",
          answerMarkdown:
            "From the current lesson, attention is the transformer's way of deciding which tokens should influence the current representation. Try tracking the query/key/value split: the query asks what this token needs, keys are matched against it, and values carry the information that gets mixed in.",
          contextTags: [
            { type: "currentLesson", label: "Current lesson", value: "Transformers & Attention" },
            { type: "timestamp", label: "Timestamp", value: displayedTimestamp },
            { type: "courseTitle", label: "Course", value: "Neural Architecture" },
          ],
          conversationTitle: "Attention Context",
          courseRecommendationCards: [],
          followUpChips: ["Explain query/key/value", "Give an analogy", "Summarize this timestamp"],
          surface: "courseRail",
        };
        setAiAnswer(fallback);
      } finally {
        setAiStreamingAnswer("");
        setAiBusy(false);
      }
    },
    [activeChunk, aiBusy, displayedTimestamp],
  );

  const checkNote = async () => {
    const cleanNote = noteText.trim();

    if (!cleanNote || noteCheckBusy) {
      return;
    }

    setNoteCheckBusy(true);
    setNoteCheck("");

    try {
      const response = await fetch("/api/moocky-ai", {
        body: JSON.stringify({
          courseContext: {
            courseTitle: "Neural Architecture",
            currentLesson: "Transformers & Attention",
            displayedTimestamp,
            transcriptExcerpt: activeChunk.summary,
          },
          surface: "courseRail",
          task: "noteCheck",
          userMessage: cleanNote,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as AiResponseEnvelope;
      setNoteCheck(payload.answerMarkdown || "This note is directionally useful. Add query, key, and value language for more precision.");
    } catch {
      setNoteCheck("This note is directionally useful. Add query, key, and value language for more precision.");
    } finally {
      setNoteCheckBusy(false);
    }
  };

  const sendDiscussionMessage = () => {
    const cleanNote = noteText.trim();

    if (!cleanNote) {
      return;
    }

    setSessionMessages((current) => [
      {
        author: "You",
        body: cleanNote,
        id: createId("note"),
        isMine: true,
        likes: 0,
        timestamp: timestampEnabled ? displayedTimestamp : undefined,
        timeLabel: "Just now",
        visibility: notePublic ? "public" : "private",
      },
      ...current,
    ]);
    setNoteText("");
    setNoteCheck("");
  };

  const expandAiAnswer = () => {
    if (!aiAnswer || !aiQuestion) {
      return;
    }

    window.sessionStorage.setItem(
      COURSE_AI_HANDOFF_KEY,
      JSON.stringify({
        answer: aiAnswer,
        createdAt: Date.now(),
        question: aiQuestion,
        returnUrl: "/course",
        timestamp: displayedTimestamp,
      }),
    );
    router.push("/ai");
  };

  return (
    <main className={`prototype-page ${styles.coursePage} theme-${theme}`}>
      <CourseHeader theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
      <div className={styles.shell}>
        <p className={styles.breadcrumb}>My Progress &gt; Neural Architecture &gt; Transformers & Attention</p>
        <div className={`${styles.studyGrid} ${hasStarted ? styles.isPlayingLayout : ""}`}>
          <div className={styles.mainColumn}>
            <div className={`${styles.lessonHero} ${isIntroFocus ? styles.isIntroFocus : styles.isEngagedLayout}`}>
              <div className={styles.pausedHeroBanner} aria-hidden="true">
                <img src={PAUSED_BANNER_SRC} alt="" />
              </div>
              <LessonMedia
                actualDuration={actualDuration}
                compact={isIntroFocus}
                currentTime={currentTime}
                displaySeconds={displaySeconds}
                hasStarted={hasStarted}
                onPlay={playVideo}
                onToggle={toggleVideo}
                playbackState={playbackState}
                playerReady={playerReady}
                playerTargetRef={playerContainerRef}
              />
              {isIntroFocus ? <LessonCopy activeChunk={activeChunk} liveCount={liveCount} variant="paused" /> : null}
            </div>

            <div className={styles.mainDivider} />

            <section className={styles.contentTabs} aria-label="Course content">
              <div className={styles.tabSwitcher} data-active-tab={contentTab}>
                <span className={styles.tabPill} />
                <button className={contentTab === "detail" ? styles.isActive : ""} onClick={() => setContentTab("detail")} type="button">
                  <LumenIcon name="info" />
                  <span>Course Detail</span>
                </button>
                <button className={contentTab === "discussion" ? styles.isActive : ""} onClick={() => setContentTab("discussion")} type="button">
                  <LumenIcon name="bubbles" />
                  <span>Discussion</span>
                </button>
              </div>
              {contentTab === "detail" ? (
                <DetailTab activeChunk={activeChunk} liveCount={liveCount} showLessonSummary={hasStarted} />
              ) : (
                <DiscussionTab
                  displayedTimestamp={displayedTimestamp}
                  messages={discussionMessages}
                  noteCheck={noteCheck}
                  noteCheckBusy={noteCheckBusy}
                  notePublic={notePublic}
                  noteText={noteText}
                  onCheckNote={checkNote}
                  onClearNoteCheck={() => setNoteCheck("")}
                  onNotePublicChange={setNotePublic}
                  onNoteTextChange={setNoteText}
                  onSend={sendDiscussionMessage}
                  onTimestampChange={setTimestampEnabled}
                  onToggleMineOnly={() => setShowMineOnly((value) => !value)}
                  showMineOnly={showMineOnly}
                  timestampEnabled={timestampEnabled}
                />
              )}
            </section>
          </div>
          <CourseRail
            activeTab={railTab}
            aiAnswer={aiAnswer}
            aiBusy={aiBusy}
            aiInput={aiInput}
            aiQuestion={aiQuestion}
            aiReasoning={aiReasoning}
            aiStreamingAnswer={aiStreamingAnswer}
            conversations={aiConversations}
            contextPromptKey={contextPromptScan.contextKey}
            contextPrompts={contextPromptScan.prompts}
            displayedTimestamp={displayedTimestamp}
            expanded={curriculumExpanded}
            onAiInputChange={setAiInput}
            onAiNewConversation={() => {
              setAiQuestion("");
              setAiAnswer(null);
              setAiReasoning("");
              setAiStreamingAnswer("");
              setAiInput("");
            }}
            onAiPrompt={(prompt) => void runAiPrompt(prompt)}
            onAiSelectConversation={(conversation) => {
              setAiQuestion(conversation.question);
              setAiAnswer(conversation.response);
              setAiReasoning("");
              setAiStreamingAnswer("");
            }}
            onAiSubmit={() => void runAiPrompt(aiInput)}
            onExpandAnswer={expandAiAnswer}
            onExpandedChange={setCurriculumExpanded}
            onTabChange={setRailTab}
            playbackState={playbackState}
          />
        </div>
      </div>
      <CompactProductFooter />
    </main>
  );
}
