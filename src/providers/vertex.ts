import { VertexAI } from "@google-cloud/vertexai";
import { env } from "../config/env.js";
import { ChatRequest, ChatResponse } from "../types/chat.js";

const vertex = new VertexAI({
  project: env.GOOGLE_CLOUD_PROJECT,
  location: env.GOOGLE_CLOUD_LOCATION
});

export async function chatVertex(payload: ChatRequest): Promise<ChatResponse> {
  const model = payload.model ?? env.VERTEX_MODEL;
  const generativeModel = vertex.getGenerativeModel({ model });

  const prompt = payload.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
  const result = await generativeModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: payload.temperature ?? 0.7,
      maxOutputTokens: payload.maxTokens ?? 1024
    }
  });

  const outputText = result.response.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";
  return { provider: "vertex", model, outputText };
}
