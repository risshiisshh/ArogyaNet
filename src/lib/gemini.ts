// Gemini API client helper with streaming support and graceful fallback
// Uses VITE_GEMINI_API_KEY if present, else falls back cleanly

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Check if a Gemini API key is configured.
 */
export function hasGeminiKey(): boolean {
  const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY);
  return Boolean(apiKey && apiKey.trim().length > 0);
}

function getApiKey(): string | null {
  const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY);
  if (!apiKey || apiKey.trim().length === 0) return null;
  return apiKey;
}

/**
 * Non-streaming Gemini call (legacy, kept for backwards compat).
 */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
];

export async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        ...(systemInstruction
          ? {
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
            }
          : {}),
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`Gemini model ${model} returned status ${res.status}, trying fallback...`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn(`Gemini model ${model} failed:`, err);
    }
  }

  console.warn("All Gemini models failed, falling back to local reasoning");
  return null;
}

/**
 * Streaming Gemini call with multi-turn conversation history.
 * Yields text chunks as they arrive via SSE.
 * Cascades across active models if one is unavailable or overloaded.
 *
 * @param history - Full conversation history (user/model turns)
 * @param systemInstruction - System prompt
 * @param onChunk - Callback invoked with each text chunk as it streams in
 * @param signal - Optional AbortSignal to cancel the stream
 * @returns The complete assembled response text, or null on failure
 */
export async function callGeminiStream(
  history: GeminiMessage[],
  systemInstruction?: string,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      const payload = {
        contents: history,
        ...(systemInstruction
          ? {
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
            }
          : {}),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });

      if (!res.ok) {
        console.warn(`Gemini streaming model ${model} returned ${res.status}, trying fallback...`);
        continue;
      }

      const reader = res.body?.getReader();
      if (!reader) continue;

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const parts = json.candidates?.[0]?.content?.parts;
              if (parts && parts.length > 0) {
                for (const part of parts) {
                  if (part.text) {
                    fullText += part.text;
                    onChunk?.(part.text);
                  }
                }
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }

      if (fullText.trim().length > 0) {
        return fullText;
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        // User cancelled — not an error
        return null;
      }
      console.warn(`Gemini streaming failed with ${model}:`, err);
    }
  }

  console.warn("All Gemini streaming models failed or returned empty; using local fallback");
  return null;
}

