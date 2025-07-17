import path, { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import createCache from "./db/cache/redis.js";
import createDb from "./db/prisma.js";
import createLogger from "./logger.js";
import createCurriculumRouter from "./routers/curriculumRouter.js";
import createServer from "./server/server.js";
import "./views/helpers/renderUnitsSummary.js";
import "./views/helpers/renderArticleIcon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger(join(__dirname, "logs", "app.log"));
logger.info("Logger initialized");

const cache = await createCache(logger);
logger.info("cache initialized");

const db = createDb(logger);
logger.info("Db initialized");

const router = createCurriculumRouter(logger, db, cache);
logger.info("Router initialized");

const server = createServer(logger, router, { dirname: __dirname });
logger.info("Server prepared for listening");

server.listen();

process.on("SIGINT", async () => {
  logger.info("🛑 SIGINT received, shutting down...");
  try {
    await db.$disconnect();
    logger.info("✅ DB disconnected");
  } catch (err) {
    logger.info("❌ Error disconnecting DB:", err);
  } finally {
    process.exit(0);
  }
});
