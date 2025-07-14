import process from "node:process";
import { PrismaClient } from "@prisma/client";

let db = null;

function createDb(logger) {
  if (db) {
    return db;
  }

  if (!logger) {
    console.error("Logger is required");
    process.exit(1);
  }

  db = new PrismaClient({
    log: ["query", "info", "warn", "error"], // какие события логировать
  });

  // Проксируем Prisma события в свой логгер
  db.$on("query", (e) => {
    logger.debug(
      {
        type: "query",
        query: e.query,
        params: e.params,
        duration: e.duration,
      },
      "Prisma query",
    );
  });

  db.$on("info", (e) => {
    logger.info({ message: e.message }, "Prisma info");
  });

  db.$on("warn", (e) => {
    logger.warn({ message: e.message }, "Prisma warning");
  });

  db.$on("error", (e) => {
    logger.error({ message: e.message }, "Prisma error");
  });

  return db;
}

export default createDb;
