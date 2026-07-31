import { NextRequest, NextResponse } from "next/server";
import { buildInputPayload, fallbackCourseResponse, fallbackResponse, getAiProviderConfig, getChatCompletionsUrl, getKimiThinkingMode, getNvidiaRequestOptions, loadSystemPrompt, normalizeResponseForMode, parseEnvelope, providerDisplayName, responseSchema, type AiRequest } from "./shared";

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

  const providerConfig = getAiProviderConfig();
  const { apiKey, provider } = providerConfig;

  if (!apiKey) {
    if (body.surface === "courseRail" || body.courseContext) {
      return NextResponse.json(fallbackCourseResponse(body, userMessage), { status: 200 });
    }

    const fallback = fallbackResponse(`MOOCKY AI is wired for the ${providerDisplayName(provider)} API, but this deployment is missing the server API key. Add the key and retry this question.`);
    return NextResponse.json(normalizeResponseForMode(fallback, conversationMode), { status: 200 });
  }

  try {
    const systemPrompt = await loadSystemPrompt();
    const inputPayload = buildInputPayload(body, userMessage);

  if (provider !== "openai") {
    const kimiThinkingMode = getKimiThinkingMode();
    const compatibleRequest: Record<string, unknown> = {
        model: providerConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(inputPayload) },
        ],
        max_tokens: 2400,
    };

    if (provider === "kimi" || provider === "openrouter") {
      compatibleRequest.response_format = { type: "json_object" };
    }

    if (provider === "kimi") {
      compatibleRequest.thinking = { type: kimiThinkingMode };
    }

    if (provider === "nvidia") {
      Object.assign(compatibleRequest, getNvidiaRequestOptions(providerConfig.model));
    }

    const compatibleResponse = await fetch(getChatCompletionsUrl(providerConfig.baseUrl), {
      body: JSON.stringify(compatibleRequest),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!compatibleResponse.ok) {
      const detail = await compatibleResponse.text().catch(() => "");
      console.error(`${providerDisplayName(provider)} request failed`, { status: compatibleResponse.status, detail: detail.slice(0, 500) });
      return NextResponse.json(fallbackResponse(`MOOCKY AI could not complete this request through ${providerDisplayName(provider)}. API status: ${compatibleResponse.status}.`), { status: 200 });
    }

    const responsePayload = await compatibleResponse.json();
    const parsed = parseEnvelope(extractChatCompletionText(responsePayload));
    const payload = parsed ?? fallbackResponse(`MOOCKY AI returned an unreadable ${providerDisplayName(provider)} response. Try asking again with a shorter prompt.`);
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
