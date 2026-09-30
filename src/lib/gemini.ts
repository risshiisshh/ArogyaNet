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
export async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
      console.warn(`Gemini API returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.warn("Gemini API call failed, falling back to local reasoning:", err);
    return null;
  }
}

/**
 * Streaming Gemini call with multi-turn conversation history.
 * Yields text chunks as they arrive via SSE.
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

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

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
      console.warn(`Gemini streaming API returned status ${res.status}`);
      return null;
    }

    const reader = res.body?.getReader();
    if (!reader) return null;

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
            const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (chunk) {
              fullText += chunk;
              onChunk?.(chunk);
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    }

    return fullText || null;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      // User cancelled — not an error
      return null;
    }
    console.warn("Gemini streaming call failed:", err);
    return null;
  }
}
