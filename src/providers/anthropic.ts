import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";
import { ChatRequest, ChatResponse } from "../types/chat.js";

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function chatAnthropic(payload: ChatRequest): Promise<ChatResponse> {
  const model = payload.model ?? "claude-3-5-sonnet-latest";
  const system = payload.messages.find(m => m.role === "system")?.content;
  const messages = payload.messages
    .filter(m => m.role !== "system")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  const res = await client.messages.create({
    model,
    max_tokens: payload.maxTokens ?? 1024,
    temperature: payload.temperature ?? 0.7,
    system,
    messages
  });

  const outputText = res.content
    .filter(c => c.type === "text")
    .map(c => c.text)
    .join("\n");

  return { provider: "anthropic", model, outputText };
}
