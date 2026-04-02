import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { chatAnthropic } from "../providers/anthropic.js";
import { chatVertex } from "../providers/vertex.js";
import { chatOllama } from "../providers/ollama.js";
import { ChatRequest } from "../types/chat.js";

const schema = z.object({
  provider: z.enum(["anthropic", "vertex", "openai_local"]),
  model: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string()
  })),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional()
});

async function routeChat(payload: ChatRequest) {
  if (payload.provider === "anthropic") return chatAnthropic(payload);
  if (payload.provider === "vertex") return chatVertex(payload);
  return chatOllama(payload);
}

export async function chatRoutes(app: FastifyInstance) {
  app.post("/v1/chat", { preHandler: requireAuth }, async (req, reply) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const result = await routeChat(parsed.data);
    return reply.send(result);
  });

  app.post("/v1/chat/stream", { preHandler: requireAuth }, async (req, reply) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const result = await routeChat(parsed.data);
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.write(`data: ${JSON.stringify(result)}\n\n`);
    reply.raw.write("event: done\ndata: [DONE]\n\n");
    reply.raw.end();
  });
}
