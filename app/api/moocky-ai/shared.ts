import { readFile } from "node:fs/promises";
import path from "node:path";
import { demoPersonalizedSuggestionCards, type AiConversationMode, type AiResponseEnvelope } from "../../prototype-data";

export type KimiThinkingMode = "disabled" | "enabled";
export type AiProvider = "openai" | "kimi" | "nvidia" | "openrouter";

export type AiProviderConfig = {
  apiKey?: string;
  baseUrl: string;
  model: string;
  provider: AiProvider;
};
export type AiRequest = {
  courseContext?: {
    courseTitle?: string;
    currentLesson?: string;
    displayedTimestamp?: string;
    lessonDuration?: string;
    lessonSource?: string;
    transcriptExcerpt?: string;
  };
  conversationId?: string;
  conversationMode?: AiConversationMode;
  entrySource?: "direct" | "landing" | "sidebar" | "followUp";
  lessonContext?: {
    activeChapter?: string;
    nearbyConcepts?: string[];
    summary?: string;
    transcriptChunks?: {
      end: string;
      start: string;
      text: string;
      title: string;
    }[];
  };
  messageHistory?: {
    role: "user" | "assistant";
    content: string;
  }[];
  surface?: "courseRail" | "heroPrompt" | "headerSearch" | "futureSurface";
  task?: "courseQuestion" | "noteCheck";
  userMessage?: string;
};

const cardSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "title", "description", "provider", "rating", "reviews", "href"],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    provider: { type: "string" },
    rating: { type: "string" },
    reviews: { type: "string" },
    href: { type: "string" },
  },
};

export const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answerKind", "surface", "conversationTitle", "answerMarkdown", "contextTags", "followUpChips", "courseRecommendationCards"],
  properties: {
    answerKind: { type: "string", enum: ["answer", "refusal", "clarification"] },
    surface: { type: "string", enum: ["courseRail", "heroPrompt", "headerSearch", "futureSurface"] },
    conversationTitle: { type: "string" },
    answerMarkdown: { type: "string" },
    contextTags: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "label", "value"],
        properties: {
          type: { type: "string", enum: ["currentLesson", "timestamp", "courseTitle"] },
          label: { type: "string" },
          value: { type: "string" },
        },
      },
    },
    followUpChips: {
      type: "array",
      items: { type: "string" },
      maxItems: 4,
    },
    courseRecommendationCards: {
      type: "array",
      maxItems: 4,
      items: cardSchema,
    },
  },
};

export function fallbackResponse(message: string, conversationTitle = "MOOCKY AI"): AiResponseEnvelope {
  return {
    answerKind: "refusal",
    surface: "heroPrompt",
    conversationTitle,
    answerMarkdown: message,
    contextTags: [],
    followUpChips: ["Try another prompt", "Explore course paths"],
    courseRecommendationCards: [],
  };
}

function courseContextTags(body: AiRequest): AiResponseEnvelope["contextTags"] {
  const tags: AiResponseEnvelope["contextTags"] = [];

  if (body.courseContext?.currentLesson) {
    tags.push({ type: "currentLesson", label: "Current lesson", value: body.courseContext.currentLesson });
  }

  if (body.courseContext?.displayedTimestamp) {
    tags.push({ type: "timestamp", label: "Timestamp", value: body.courseContext.displayedTimestamp });
  }

  if (body.courseContext?.courseTitle) {
    tags.push({ type: "courseTitle", label: "Course", value: body.courseContext.courseTitle });
  }

  return tags;
}

export function fallbackCourseResponse(body: AiRequest, userMessage: string): AiResponseEnvelope {
  const isNoteCheck = body.task === "noteCheck";
  const currentLesson = body.courseContext?.currentLesson ?? "Transformers & Attention";
  const transcriptExcerpt = body.courseContext?.transcriptExcerpt?.trim();

  if (isNoteCheck) {
    return {
      answerKind: "answer",
      surface: "courseRail",
      conversationTitle: "Note Check",
      answerMarkdown:
        "**Verdict:** Needs revision\n**Why:** The note pushes against transformers, but the lesson frames attention as central to modern sequence modeling.\n**Fix:** Mention query, key, value, and why attention helps tokens use context.",
      contextTags: courseContextTags(body),
      followUpChips: ["Improve my note", "Give me an example", "Check terminology"],
      courseRecommendationCards: [],
    };
  }

  return {
    answerKind: "answer",
    surface: "courseRail",
    conversationTitle: "Transformer Context",
    answerMarkdown: transcriptExcerpt
      ? `From **${currentLesson}**, the key idea is that attention lets each token decide which other tokens are relevant before the model updates its representation.\n\nIn this part of the lesson, use the current context this way:\n\n- **Queries** ask what a token is looking for.\n- **Keys** describe what each token offers for matching.\n- **Attention weights** decide which relationships matter most.\n- **Values** carry the information that gets mixed back into the token representation.\n\nA compact mental model: attention is not one word \"looking\" at every word equally. It is a learned matching system that builds a weighted blend of relevant context.`
      : `In **${currentLesson}**, a transformer is a neural architecture built around attention. Instead of reading a sequence strictly left to right, it compares tokens in parallel and learns which relationships matter.\n\nThe smallest useful map is: **query** asks, **key** matches, **value** contributes information, and the attention pattern decides how much each contribution should count.`,
    contextTags: courseContextTags(body),
    followUpChips: ["Explain query/key/value", "Give a simple analogy", "Summarize this timestamp"],
    courseRecommendationCards: [],
  };
}

function taskInstructions(task: AiRequest["task"]) {
  if (task !== "noteCheck") {
    return "";
  }

  return [
    "Evaluate the learner's note for correctness against the provided course context.",
    "Keep the answer compact for a sticky discussion composer: 45 to 70 words maximum.",
    "Return answerMarkdown in exactly this format, with no heading and no extra paragraphs:",
    "**Verdict:** Correct | Needs revision | Misconception",
    "**Why:** one concise sentence.",
    "**Fix:** one concise sentence.",
    "If the learner is wrong, be direct and calm. If partly right, say what is usable before the correction.",
    "Do not write an essay. Do not include more than one optional bullet.",
  ].join("\n");
}

export function getKimiThinkingMode(): KimiThinkingMode {
  const configuredMode = (process.env.MOONSHOT_THINKING_MODE ?? process.env.MOONSHOT_THINKING ?? "").toLowerCase();

  return configuredMode === "enabled" || configuredMode === "true" || configuredMode === "1" ? "enabled" : "disabled";
}

export const natureArchitectureRecommendation = demoPersonalizedSuggestionCards.find((card) => card.id === "nature-architecture")!;

export function getAiProvider(): AiProvider {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();

  if (configuredProvider === "nvidia" || configuredProvider === "kimi" || configuredProvider === "openai" || configuredProvider === "openrouter") {
    return configuredProvider;
  }

  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter";
  }

  return process.env.MOONSHOT_API_KEY ? "kimi" : "openai";
}

export function getAiProviderConfig(): AiProviderConfig {
  const provider = getAiProvider();

  if (provider === "nvidia") {
    return {
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: (process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1").replace(/\/$/, ""),
      model: process.env.NVIDIA_MODEL ?? "moonshotai/kimi-k2.6",
      provider,
    };
  }

  if (provider === "openrouter") {
    return {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: (process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1").replace(/\/$/, ""),
      model: process.env.OPENROUTER_MODEL ?? "google/gemma-4-26b-a4b-it:free",
      provider,
    };
  }

  if (provider === "kimi") {
    return {
      apiKey: process.env.MOONSHOT_API_KEY,
      baseUrl: (process.env.MOONSHOT_BASE_URL ?? "https://api.moonshot.ai/v1").replace(/\/$/, ""),
      model: process.env.MOONSHOT_MODEL ?? "kimi-k2.5",
      provider,
    };
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL ?? "gpt-5.5",
    provider,
  };
}

/** Accept either an API base URL or the full OpenAI-compatible chat endpoint. */
export function getChatCompletionsUrl(baseUrl: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/chat\/completions\/?$/, "");
  return `${normalizedBaseUrl}/chat/completions`;
}

export function getNvidiaRequestOptions(model: string): Record<string, unknown> {
  // Gemma 4 can spend its entire request window reasoning before emitting text.
  // The learning-assistant UI needs a responsive answer by default.
  if (model.startsWith("google/gemma-4-")) {
    return { chat_template_kwargs: { enable_thinking: false } };
  }

  return {};
}

export function providerDisplayName(provider: AiProvider) {
  if (provider === "nvidia") {
    return "NVIDIA NIM";
  }

  if (provider === "openrouter") {
    return "OpenRouter";
  }

  return provider === "kimi" ? "Kimi" : "OpenAI";
}

export async function loadSystemPrompt() {
  const promptPath = path.join(process.cwd(), "docs", "ai-system-prompt.md");
  const markdown = await readFile(promptPath, "utf8");
  const match = markdown.match(/```text\n([\s\S]*?)\n```/);
  return match?.[1] ?? markdown;
}

export function parseEnvelope(outputText: string): AiResponseEnvelope | null {
  const trimmed = outputText.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const jsonText = fenced?.[1] ?? trimmed;
  const candidates = [jsonText];

  // Free providers can prepend a short note or <think> block despite the JSON instruction.
  // Recover the first balanced JSON object instead of discarding an otherwise usable answer.
  const objectStart = jsonText.indexOf("{");
  if (objectStart > 0) {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = objectStart; index < jsonText.length; index += 1) {
      const character = jsonText[index];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          inString = false;
        }
        continue;
      }

      if (character === '"') {
        inString = true;
      } else if (character === "{") {
        depth += 1;
      } else if (character === "}") {
        depth -= 1;
        if (depth === 0) {
          candidates.push(jsonText.slice(objectStart, index + 1));
          break;
        }
      }
    }
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<AiResponseEnvelope> & {
        courseRecommendationChips?: unknown;
      };

      if (typeof parsed.answerMarkdown !== "string") {
        continue;
      }

      return {
        answerKind: parsed.answerKind ?? "answer",
        surface: parsed.surface ?? "heroPrompt",
        conversationTitle: parsed.conversationTitle || "MOOCKY AI",
        answerMarkdown: parsed.answerMarkdown,
        contextTags: parsed.contextTags ?? [],
        followUpChips: parsed.followUpChips ?? [],
        courseRecommendationCards: parsed.courseRecommendationCards ?? [],
      };
    } catch {
      // Try the next recovered candidate.
    }
  }

  return null;
}

export function buildInputPayload(body: AiRequest, userMessage: string) {
  const conversationMode = body.conversationMode ?? "newChat";
  const surface = body.surface ?? "heroPrompt";

  return {
    surface,
    conversationId: body.conversationId ?? "",
    conversationMode,
    entrySource: body.entrySource ?? "direct",
    userMessage,
    messageHistory: body.messageHistory?.slice(-8) ?? [],
    modeInstructions: modeInstructions[conversationMode],
    task: body.task ?? "courseQuestion",
    taskInstructions: taskInstructions(body.task),
    courseContext: {
      courseTitle: body.courseContext?.courseTitle ?? "MOOCKY Course Discovery",
      currentLesson: body.courseContext?.currentLesson ?? "AI course discovery workspace",
      timestamp: body.courseContext?.displayedTimestamp ?? "00:00",
      lessonDuration: body.courseContext?.lessonDuration ?? "",
      lessonSource: body.courseContext?.lessonSource ?? "",
      transcriptExcerpt: body.courseContext?.transcriptExcerpt ?? "",
      lessonContext: body.lessonContext ?? null,
    },
    learnerContext: {
      learnerGoal: "Discover relevant courses and learning paths",
      learnerProgress: "Prototype visitor",
      learnerInterests: ["AI", "design systems", "course discovery"],
      careerDirection: "AI-enhanced learning",
    },
    availableCourses: [
      ...demoPersonalizedSuggestionCards.map((card) => ({
        id: card.id,
        title: card.title,
        summary: card.description,
        provider: card.provider,
        rating: card.rating,
        reviews: card.reviews,
        href: card.href,
      })),
    ],
  };
}

export const modeInstructions: Record<AiConversationMode, string> = {
  newChat:
    "Use the default MOOCKY AI behavior. Answer freely, stay oriented around learning, create a concise conversationTitle after the first meaningful user message, and recommend Nature Architecture as the fixed demonstration course.",
  personalizedSuggestion:
    "Run a purpose-driven course discovery conversation. Break down the learner's goal, connect it to Nature Architecture, and recommend Nature Architecture as the fixed demonstration course.",
  careerPath:
    "Guide a career-path conversation. Ask or infer the learner's current work or study state, clarify the kind of person they want to become, provide practical learning guidance, and recommend Nature Architecture as the fixed demonstration course.",
};

function uniqueCards(cards: AiResponseEnvelope["courseRecommendationCards"]) {
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

export function fallbackCardsForMode(_conversationMode: AiConversationMode) {
  return [natureArchitectureRecommendation];
}

export function normalizeResponseForMode(response: AiResponseEnvelope, _conversationMode: AiConversationMode): AiResponseEnvelope {
  return {
    ...response,
    courseRecommendationCards: [natureArchitectureRecommendation],
  };
}
