import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import process from "node:process";
import pino from "pino";

let logger = null;

const config = {
  production: {
    level: "info",
    transport: {
      target: "pino/file",
      options: {},
    },
  },
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        singleLine: true,
      },
    },
  },
};

function createLogger(pathToLog) {
  if (logger) {
    return logger;
  }

  const env = process.env.NODE_ENV || "development";

  const envConfig = config[env];
  if (!envConfig) {
    console.error(`Unknown NODE_ENV: ${env}`);
    process.exit(1);
  }

  if (!String(pathToLog)) {
    console.error("Undefined log directory");
    process.exit(1);
  }

  if (env === "production") {
    const dirToLog = dirname(pathToLog);

    if (!existsSync(dirToLog)) {
      mkdirSync(dirToLog, { recursive: true });
    }

    envConfig.transport.options.destination = pathToLog;
  }
  logger = pino(
    {
      level: envConfig.level,
    },
    pino.transport(envConfig.transport),
  );

  return logger;
}

export default createLogger;
