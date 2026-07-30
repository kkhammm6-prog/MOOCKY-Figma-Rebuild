import { NextRequest } from "next/server";
import { buildInputPayload, fallbackCardsForMode, fallbackCourseResponse, fallbackResponse, getKimiThinkingMode, loadSystemPrompt, normalizeResponseForMode, parseEnvelope, responseSchema, type AiRequest } from "../shared";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type StreamEventType = "reasoning_delta" | "answer_delta" | "cards_ready" | "content_delta" | "done" | "error";

function sse(eventType: StreamEventType, payload: Record<string, unknown> = {}) {
  return `data: ${JSON.stringify({ type: eventType, ...payload })}\n\n`;
}

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

function getDelta(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return {};
  }

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return {};
  }

  const first = choices[0];
  if (typeof first !== "object" || first === null) {
    return {};
  }

  const delta = (first as { delta?: unknown }).delta;
  return typeof delta === "object" && delta !== null ? (delta as Record<string, unknown>) : {};
}

function cleanReasoningDelta(value: string) {
  return value.replace(/\[DONE\]/g, "").replace(/<\|[^|]+?\|>/g, "");
}

function readJsonStringToken(input: string, startIndex: number) {
  let value = "";
  let index = startIndex + 1;

  while (index < input.length) {
    const char = input[index];

    if (char === '"') {
      return { complete: true, endIndex: index + 1, value };
    }

    if (char !== "\\") {
      value += char;
      index += 1;
      continue;
    }

    const escaped = input[index + 1];

    if (!escaped) {
      return { complete: false, endIndex: index, value };
    }

    if (escaped === "u") {
      const hex = input.slice(index + 2, index + 6);

      if (hex.length < 4 || !/^[0-9a-fA-F]{4}$/.test(hex)) {
        return { complete: false, endIndex: index, value };
      }

      value += String.fromCharCode(Number.parseInt(hex, 16));
      index += 6;
      continue;
    }

    const replacements: Record<string, string> = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "\t",
    };

    value += replacements[escaped] ?? escaped;
    index += 2;
  }

  return { complete: false, endIndex: index, value };
}

function skipJsonWhitespace(input: string, startIndex: number) {
  let index = startIndex;

  while (index < input.length && /\s/.test(input[index])) {
    index += 1;
  }

  return index;
}

function extractJsonStringValuePrefix(input: string, fieldName: string) {
  let index = 0;

  while (index < input.length) {
    if (input[index] !== '"') {
      index += 1;
      continue;
    }

    const keyToken = readJsonStringToken(input, index);

    if (!keyToken.complete) {
      return null;
    }

    index = skipJsonWhitespace(input, keyToken.endIndex);

    if (input[index] !== ":") {
      continue;
    }

    if (keyToken.value !== fieldName) {
      index += 1;
      continue;
    }

    index = skipJsonWhitespace(input, index + 1);

    if (input[index] !== '"') {
      return null;
    }

    return readJsonStringToken(input, index);
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as AiRequest;
  const userMessage = body.userMessage?.trim();
  const conversationMode = body.conversationMode ?? "newChat";
  const encoder = new TextEncoder();

  if (!userMessage) {
    const fallback = fallbackResponse("Ask a concise learning question and MOOCKY AI can help route you toward useful course context.");
    return new Response(encoder.encode(sse("done", { response: fallback })), {
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
      status: 400,
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (eventType: StreamEventType, payload: Record<string, unknown> = {}) => {
        controller.enqueue(encoder.encode(sse(eventType, payload)));
      };

      try {
        const provider = process.env.AI_PROVIDER ?? (process.env.MOONSHOT_API_KEY ? "kimi" : "openai");
        const apiKey = provider === "kimi" ? process.env.MOONSHOT_API_KEY : process.env.OPENAI_API_KEY;

        if (!apiKey) {
          if (body.surface === "courseRail" || body.courseContext) {
            write("done", { response: fallbackCourseResponse(body, userMessage) });
            controller.close();
            return;
          }

          const fallback = fallbackResponse(
            `MOOCKY AI is wired for the ${provider === "kimi" ? "Kimi" : "OpenAI"} API, but this local prototype is missing the server API key. Add the key and retry this question.`,
          );
          write("done", {
            response: normalizeResponseForMode(fallback, conversationMode),
          });
          controller.close();
          return;
        }

        const systemPrompt = await loadSystemPrompt();
        const inputPayload = buildInputPayload(body, userMessage);

        if (provider !== "kimi") {
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
            write("done", { response: fallbackResponse("MOOCKY AI could not complete this request. Check the API configuration and try again.") });
            controller.close();
            return;
          }

          const responsePayload = await openAiResponse.json();
          const content = extractOutputText(responsePayload);
          const parsed = parseEnvelope(content) ?? fallbackResponse("MOOCKY AI returned an unreadable prototype response. Try asking again with a shorter prompt.");
          const response = normalizeResponseForMode(parsed, conversationMode);

          if (response.answerMarkdown) {
            write("answer_delta", { delta: response.answerMarkdown });
          }
          write("content_delta", { delta: JSON.stringify(response) });
          write("done", { response });
          controller.close();
          return;
        }

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
            stream: true,
            max_tokens: 3200,
          }),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (!kimiResponse.ok || !kimiResponse.body) {
          const detail = await kimiResponse.text().catch(() => "");
          console.error("Kimi stream request failed", { status: kimiResponse.status, detail: detail.slice(0, 500) });
          write("error", { message: `Kimi API request failed with status ${kimiResponse.status}.` });
          controller.close();
          return;
        }

        const reader = kimiResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let content = "";
        let streamedAnswer = "";
        let streamedCards = false;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed.startsWith("data:")) {
              continue;
            }

            const data = trimmed.slice(5).trim();

            if (!data || data === "[DONE]") {
              continue;
            }

            let payload: unknown;

            try {
              payload = JSON.parse(data);
            } catch {
              continue;
            }

            const delta = getDelta(payload);
            const reasoning = typeof delta.reasoning_content === "string" ? cleanReasoningDelta(delta.reasoning_content) : "";
            const contentDelta = typeof delta.content === "string" ? delta.content : "";

            if (kimiThinkingMode === "enabled" && reasoning) {
              write("reasoning_delta", { delta: reasoning });
            }

            if (contentDelta) {
              content += contentDelta;

              const answerToken = extractJsonStringValuePrefix(content, "answerMarkdown");

              if (answerToken && answerToken.value.length > streamedAnswer.length) {
                write("answer_delta", { delta: answerToken.value.slice(streamedAnswer.length) });
                streamedAnswer = answerToken.value;
              }

              if (answerToken?.complete && !streamedCards && conversationMode === "personalizedSuggestion") {
                const answerKindToken = extractJsonStringValuePrefix(content, "answerKind");

                if (answerKindToken?.value === "answer") {
                  write("cards_ready", { cards: fallbackCardsForMode(conversationMode) });
                  streamedCards = true;
                }
              }

              write("content_delta", { delta: contentDelta });
            }
          }
        }

        const parsed = parseEnvelope(content) ?? fallbackResponse("MOOCKY AI returned an unreadable Kimi response. Try asking again with a shorter prompt.");
        const response = normalizeResponseForMode(parsed, conversationMode);
        write("done", { response });
        controller.close();
      } catch (error) {
        console.error("MOOCKY AI stream route failed", { message: error instanceof Error ? error.message : String(error) });
        write("error", { message: "MOOCKY AI could not complete this request. Try again from the composer." });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
