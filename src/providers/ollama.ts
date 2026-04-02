import { ChatRequest, ChatResponse } from "../types/chat.js";
import { env } from "../config/env.js";

export async function chatOllama(payload: ChatRequest): Promise<ChatResponse> {
  const model = payload.model ?? env.OLLAMA_MODEL;
  const res = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: payload.messages,
      stream: false,
      options: {
        temperature: payload.temperature ?? 0.7,
        num_predict: payload.maxTokens ?? 1024
      }
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Ollama error: ${t}`);
  }

  const json = await res.json();
  return {
    provider: "openai_local",
    model,
    outputText: json?.message?.content ?? ""
  };
}
