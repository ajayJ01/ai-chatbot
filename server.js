import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import staticPlugin from "@fastify/static";
import db from "./db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const fastify = Fastify({ logger: true });

// Enable CORS
await fastify.register(cors, {
  origin: "*"
});

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
await fastify.register(staticPlugin, {
  root: path.join(__dirname, "public"),
  prefix: "/"
});

// 🔥 Attach DB correctly
fastify.decorate("db", db);

// Register routes
await fastify.register(chatRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();