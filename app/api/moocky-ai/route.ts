import { NextRequest, NextResponse } from "next/server";
import { buildInputPayload, fallbackCourseResponse, fallbackResponse, getKimiThinkingMode, loadSystemPrompt, normalizeResponseForMode, parseEnvelope, responseSchema, type AiRequest } from "./shared";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extractOutputText(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "";
  }

  const record = payload as { output_text?: unknown; output?: unknown };

  if (typeof record.output_text === "string") {
    return record.output_text;
  }

  if (!Array.isArray(record.output)) {
    return "";
  }

  return record.output
    .flatMap((item) => {
      if (typeof item !== "object" || item === null) {
        return [];
      }

      const content = (item as { content?: unknown }).content;

      if (!Array.isArray(content)) {
        return [];
      }

      return content.flatMap((part) => {
        if (typeof part !== "object" || part === null) {
          return [];
        }

        const text = (part as { text?: unknown }).text;
        return typeof text === "string" ? [text] : [];
      });
    })
    .join("\n");
}

function extractChatCompletionText(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "";
  }

  const choices = (payload as { choices?: unknown }).choices;

  if (!Array.isArray(choices)) {
    return "";
  }

  const firstChoice = choices[0];

  if (typeof firstChoice !== "object" || firstChoice === null) {
    return "";
  }

  const message = (firstChoice as { message?: unknown }).message;

  if (typeof message !== "object" || message === null) {
    return "";
  }

  const content = (message as { content?: unknown }).content;
  return typeof content === "string" ? content : "";
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as AiRequest;
  const userMessage = body.userMessage?.trim();
  const conversationMode = body.conversationMode ?? "newChat";

  if (!userMessage) {
    return NextResponse.json(fallbackResponse("Ask a concise learning question and MOOCKY AI can help route you toward useful course context."), { status: 400 });
  }

  const provider = process.env.AI_PROVIDER ?? (process.env.MOONSHOT_API_KEY ? "kimi" : "openai");
  const apiKey = provider === "kimi" ? process.env.MOONSHOT_API_KEY : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    if (body.surface === "courseRail" || body.courseContext) {
      return NextResponse.json(fallbackCourseResponse(body, userMessage), { status: 200 });
    }

    const fallback = fallbackResponse(`MOOCKY AI is wired for the ${provider === "kimi" ? "Kimi" : "OpenAI"} API, but this local prototype is missing the server API key. Add the key and retry this question.`);
    return NextResponse.json(normalizeResponseForMode(fallback, conversationMode), { status: 200 });
  }

  try {
    const systemPrompt = await loadSystemPrompt();
    const inputPayload = buildInputPayload(body, userMessage);

  if (provider === "kimi") {
    const kimiBaseUrl = (process.env.MOONSHOT_BASE_URL ?? "https://api.moonshot.ai/v1").replace(/\/$/, "");
    const kimiThinkingMode = getKimiThinkingMode();
    const kimiResponse = await fetch(`${kimiBaseUrl}/chat/completions`, {
      body: JSON.stringify({
        model: process.env.MOONSHOT_MODEL ?? "kimi-k2.5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(inputPayload) },
        ],
        response_format: { type: "json_object" },
        thinking: { type: kimiThinkingMode },
        max_tokens: 2400,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!kimiResponse.ok) {
      const detail = await kimiResponse.text().catch(() => "");
      console.error("Kimi request failed", { status: kimiResponse.status, detail: detail.slice(0, 500) });
      return NextResponse.json(fallbackResponse(`MOOCKY AI could not complete this request through Kimi. API status: ${kimiResponse.status}.`), { status: 200 });
    }

    const responsePayload = await kimiResponse.json();
    const parsed = parseEnvelope(extractChatCompletionText(responsePayload));
    const payload = parsed ?? fallbackResponse("MOOCKY AI returned an unreadable Kimi response. Try asking again with a shorter prompt.");
    return NextResponse.json(normalizeResponseForMode(payload, conversationMode), { status: 200 });
  }

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5.5",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(inputPayload) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "moocky_ai_response",
          strict: true,
          schema: responseSchema,
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!openAiResponse.ok) {
    return NextResponse.json(fallbackResponse("MOOCKY AI could not complete this request. Check the API configuration and try again."), { status: 200 });
  }

  const responsePayload = await openAiResponse.json();
  const parsed = parseEnvelope(extractOutputText(responsePayload));
  const payload = parsed ?? fallbackResponse("MOOCKY AI returned an unreadable prototype response. Try asking again with a shorter prompt.");
    return NextResponse.json(normalizeResponseForMode(payload, conversationMode), { status: 200 });
  } catch (error) {
    console.error("MOOCKY AI route failed", { message: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(fallbackResponse("MOOCKY AI could not complete this request. Check the API configuration and try again."), { status: 200 });
  }
}
