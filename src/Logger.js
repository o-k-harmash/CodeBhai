import { existsSync, mkdirSync } from "node:fs";
import process from "node:process";
import pino from "pino";

export class Logger {
  static instance = null;

  static configs = {
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

  constructor({ logsDir, logsPath }) {
    if (Logger.instance) {
      return Logger.instance;
    }

    if (!String(logsDir) || !String(logsPath)) {
      console.error("Undefined log directory config");
      process.exit(1);
    }

    const env = process.env.NODE_ENV || "development";

    const config = this._getConfig(env);

    if (env === "production") {
      if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true });
      }
      config.transport.options.destination = logsPath;
    }

    this.pino = pino({ level: config.level }, pino.transport(config.transport));

    return this.pino;
  }

  _getConfig(env) {
    const selected = Logger.configs[env];
    if (!selected) {
      console.error(`Unknown NODE_ENV: ${env}`);
      process.exit(1);
    }

    return selected;
  }
}
