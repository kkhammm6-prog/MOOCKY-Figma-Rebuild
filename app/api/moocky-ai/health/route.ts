import { NextRequest, NextResponse } from "next/server";
import { getAiProviderConfig, getKimiThinkingMode, loadSystemPrompt, providerDisplayName } from "../shared";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function providerConfig() {
  const config = getAiProviderConfig();

  return {
    provider: config.provider,
    providerName: providerDisplayName(config.provider),
    providerBaseUrl: config.baseUrl,
    providerHost: new URL(config.baseUrl).host,
    providerModel: config.model,
    kimiThinkingMode: getKimiThinkingMode(),
    hasMoonshotApiKey: Boolean(process.env.MOONSHOT_API_KEY),
    hasNvidiaApiKey: Boolean(process.env.NVIDIA_API_KEY),
    hasOpenAiApiKey: Boolean(process.env.OPENAI_API_KEY),
  };
}

export async function GET(request: NextRequest) {
  const config = providerConfig();
  const probeProvider = request.nextUrl.searchParams.get("probe");
  const shouldProbeProvider = probeProvider === config.provider && config.provider !== "openai";
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

  if (shouldProbeProvider) {
    const providerConfig = getAiProviderConfig();

    if (!providerConfig.apiKey) {
      kimiProbe = { ok: false, detail: `${providerDisplayName(providerConfig.provider)} API key is missing.` };
    } else {
      try {
        const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
          body: JSON.stringify({
            model: providerConfig.model,
            messages: [
              { role: "system", content: "Return only valid JSON." },
              { role: "user", content: "Return {\"ok\":true}" },
            ],
            response_format: { type: "json_object" },
            max_tokens: 80,
          }),
          headers: {
            Authorization: `Bearer ${providerConfig.apiKey}`,
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
      ok: promptLoaded && (!shouldProbeProvider || Boolean(kimiProbe?.ok)),
      ...config,
      promptLoaded,
      promptLength,
      kimiProbe,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
