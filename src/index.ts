import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { healthRoutes } from "./routes/health.js";
import { chatRoutes } from "./routes/chat.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: env.CORS_ORIGIN });
await app.register(healthRoutes);
await app.register(chatRoutes);

app.listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`Server running on :${env.PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
