import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import createDb from "./db/prisma.js";
import createLogger from "./logger.js";
import createCurriculumRouter from "./routes/curriculumRouter.js";
import createServer from "./server/server.js";
import "./views/helpers/renderUnitsSummary.js";
import "./views/helpers/renderArticleIcon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger(join(__dirname, "logs", "app.log"));
logger.info("Logger initialized");

const db = createDb(logger);
logger.info("Db initialized");

const router = createCurriculumRouter(logger, db);
logger.info("Router initialized");

const server = createServer(logger, router, { dirname: __dirname });
logger.info("Server prepared for listening");

server.listen();
