import { PrismaClient } from "@prisma/client";

export class DatabaseClient {
  static instance = null;

  constructor(logger) {
    if (DatabaseClient.instance) return DatabaseClient.instance;

    if (!logger) {
      throw new Error("Logger is required for DatabaseClient");
    }

    this.logger = logger;
    this.client = new PrismaClient({
      log: [
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" },
      ],
    });

    this._registerEvents();
    DatabaseClient.instance = this;

    return this.client;
  }

  _registerEvents() {
    this.client.$on("query", (e) => {
      this.logger.debug(
        {
          type: "query",
          query: e.query,
          params: e.params,
          duration: e.duration,
        },
        "Prisma query",
      );
    });

    this.client.$on("info", (e) => {
      this.logger.info({ message: e.message }, "Prisma info");
    });

    this.client.$on("warn", (e) => {
      this.logger.warn({ message: e.message }, "Prisma warning");
    });

    this.client.$on("error", (e) => {
      this.logger.error({ message: e.message }, "Prisma error");
    });
  }

  async disconnect() {
    await this.client.$disconnect();
  }
}
