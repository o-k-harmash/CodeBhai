import path, { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import createCache from "./db/cache/redis.js";
import createDb from "./db/prisma.js";
import createLogger from "./logger.js";
import createCurriculumRouter from "./routers/curriculumRouter.js";
import createServer from "./server/server.js";
import seeder from "./db/seeder.js";
import "./views/helpers/renderUnitsSummary.js";
import "./views/helpers/renderArticleIcon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, "..");
const __logsPath = path.join(__rootDir, "logs");
const __publicPath = path.join(__rootDir, "public");
const __viewsDir = path.join(__dirname, "views");

let logger, db, cache, router, server;

process.on("SIGINT", async () => {
  logger.info("🛑 SIGINT received, shutting down...");
  try {
    await db?.$disconnect();
    logger.info("✅ DB disconnected");
  } catch (err) {
    logger.info("❌ Error disconnecting DB:", err);
  } finally {
    process.exit(0);
  }
});

(async function () {
  try {
    logger = createLogger(__logsPath);
    logger.info("Logger initialized");

    db = createDb(logger);
    logger.info("Db initialized");

    const arg = process.argv[2];
    if (arg === "seed") {
      await seeder(db);
      process.exit(0);
    }

    cache = await createCache(logger);
    logger.info("cache initialized");

    router = createCurriculumRouter(logger, db, cache);
    logger.info("Router initialized");

    server = createServer(logger, router, { dirname: __rootDir, publicDir: __publicPath, viewsDir: __viewsDir });
    await server.listen();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();