import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configureStaticAssets(fastify, options = {}) {
  fastify.register(fastifyStatic, {
    prefix: "/static",
    root: path.join(__dirname, "../wwwroot"),
    ...options,
  });
}
