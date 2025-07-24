import process from "node:process";
import createCache from "./db/cache/redis.js";
import createDb from "./db/prisma.js";
import seeder from "./db/seeder.js";
import { Logger } from "./logger.js";
import { CurriculumRouter } from "./routers/СurriculumRouter.js";
import { Server } from "./server/server.js";
import { ArticleCacheService } from "./services/ArticleCacheService.js";
import { CurriculumService } from "./services/CurriculumService.js";

export class App {
  static instance;

  constructor(config) {
    if (App.instance) return App.instance;
    if (!new.target) throw new Error("App must be instantiated with 'new'");

    this.config = config;
    this.logger = null;
    this.db = null;
    this.cache = null;
    this.router = null;
    this.server = null;

    App.instance = this;

    this._registerShutdownHooks();
  }

  _registerShutdownHooks() {
    const shutdown = async (signalOrError) => {
      this.logger?.info(`🛑 Shutdown initiated: ${signalOrError}`);
      try {
        await this.db?.$disconnect?.();
        this.logger?.info("✅ DB disconnected");
      } catch (err) {
        this.logger?.error("❌ Error during shutdown:", err);
      } finally {
        process.exit(0);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("unhandledRejection", shutdown);
    process.on("uncaughtException", shutdown);
  }

  async run(mode) {
    try {
      const loggerConf = {
        logsDir: this.config.paths.logsDir,
        logsPath: this.config.paths.logsPath,
      };

      await this._initLogger(loggerConf);
      await this._initDb();

      switch (mode) {
        case "seed":
          await seeder(this.db);
          break;

        case "run":
        default:
          await this._initCache();
          await this._initRouter();
          await this._initServer();
          await this.server.listen();
          break;
      }
    } catch (err) {
      this.logger?.error(err);
      process.exit(1);
    }
  }

  async _initLogger(config) {
    this.logger ??= new Logger(config);
    this.logger.info("Logger initialized");
  }

  async _initDb() {
    this.db ??= createDb(this.logger);
    this.logger.info("DB initialized");
  }

  async _initCache() {
    this.cache ??= await createCache(this.logger);
    this.logger.info("Cache initialized");
  }

  async _initRouter() {
    const articleCacheService = new ArticleCacheService(this.cache);
    const curriculumService = new CurriculumService(
      this.db,
      articleCacheService,
    );
    this.router ??= new CurriculumRouter(curriculumService, this.logger);
    this.logger.info("Router initialized");
  }

  async _initServer() {
    this.server ??= new Server({
      logger: this.logger,
      router: this.router,
      dirname: this.config.paths.root,
      publicDir: this.config.paths.public,
      viewsDir: this.config.paths.views,
    });
    this.logger.info("Server initialized");
  }
}
