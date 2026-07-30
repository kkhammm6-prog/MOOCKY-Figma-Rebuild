import { NextRequest, NextResponse } from "next/server";
import { getKimiThinkingMode, loadSystemPrompt } from "../shared";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function providerConfig() {
  const provider = process.env.AI_PROVIDER ?? (process.env.MOONSHOT_API_KEY ? "kimi" : "openai");
  const kimiBaseUrl = (process.env.MOONSHOT_BASE_URL ?? "https://api.moonshot.ai/v1").replace(/\/$/, "");

  return {
    provider,
    kimiBaseUrl,
    kimiHost: new URL(kimiBaseUrl).host,
    kimiModel: process.env.MOONSHOT_MODEL ?? "kimi-k2.5",
    kimiThinkingMode: getKimiThinkingMode(),
    hasMoonshotApiKey: Boolean(process.env.MOONSHOT_API_KEY),
    hasOpenAiApiKey: Boolean(process.env.OPENAI_API_KEY),
  };
}

export async function GET(request: NextRequest) {
  const config = providerConfig();
  const shouldProbeKimi = request.nextUrl.searchParams.get("probe") === "kimi";
  let promptLoaded = false;
  let promptLength = 0;
  let kimiProbe: { ok: boolean; status?: number; parsed?: boolean; detail?: string } | undefined;

  try {
    const prompt = await loadSystemPrompt();
    promptLoaded = true;
    promptLength = prompt.length;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        ...config,
        promptLoaded,
        promptLength,
        error: error instanceof Error ? error.message : String(error),
      },
      { headers: { "Cache-Control": "no-store" }, status: 500 },
    );
  }

  if (shouldProbeKimi) {
    if (!process.env.MOONSHOT_API_KEY) {
      kimiProbe = { ok: false, detail: "MOONSHOT_API_KEY is missing." };
    } else {
      try {
        const response = await fetch(`${config.kimiBaseUrl}/chat/completions`, {
          body: JSON.stringify({
            model: config.kimiModel,
            messages: [
              { role: "system", content: "Return only valid JSON." },
              { role: "user", content: "Return {\"ok\":true}" },
            ],
            response_format: { type: "json_object" },
            thinking: { type: config.kimiThinkingMode },
            max_tokens: 80,
          }),
          headers: {
            Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const text = await response.text();
        let parsed = false;

        if (response.ok) {
          try {
            const payload = JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> };
            const content = payload.choices?.[0]?.message?.content ?? "";
            parsed = JSON.parse(content).ok === true;
          } catch {
            parsed = false;
          }
        }

        kimiProbe = {
          ok: response.ok,
          status: response.status,
          parsed,
          detail: response.ok ? undefined : text.slice(0, 240),
        };
      } catch (error) {
        kimiProbe = {
          ok: false,
          detail: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  return NextResponse.json(
    {
      ok: promptLoaded && (!shouldProbeKimi || Boolean(kimiProbe?.ok)),
      ...config,
      promptLoaded,
      promptLength,
      kimiProbe,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
