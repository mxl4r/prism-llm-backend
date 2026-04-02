import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 8080),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",

  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ?? "",

  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? "",

  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT ?? "",
  GOOGLE_CLOUD_LOCATION: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "",
  VERTEX_MODEL: process.env.VERTEX_MODEL ?? "gemini-1.5-flash",

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL ?? "qwen2.5:3b"
};
