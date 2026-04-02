export type Provider = "anthropic" | "vertex" | "openai_local";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  provider: Provider;
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type ChatResponse = {
  provider: Provider;
  model: string;
  outputText: string;
};
