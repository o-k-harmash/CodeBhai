import process from "node:process";
import { createClient } from "redis";

export class CacheClient {
  static instance = null;

  constructor(logger) {
    if (CacheClient.instance) return CacheClient.instance;

    if (!logger) {
      throw new Error("Logger is required for CacheClient");
    }

    this.logger = logger;

    this.client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            return new Error("Redis reconnect retries exhausted");
          }
          return Math.min(100 * retries, 3000);
        },
      },
    });

    this._registerEvents();
    CacheClient.instance = this;

    return this.client;
  }

  _registerEvents() {
    this.client.on("error", (err) => this.logger.error(err));
    this.client.on("connect", () =>
      this.logger.info("Redis client connecting"),
    );
    this.client.on("ready", () => this.logger.info("Redis client ready"));
    this.client.on("reconnecting", () =>
      this.logger.warn("Redis client reconnecting"),
    );
    this.client.on("end", () => this.logger.info("Redis client disconnected"));
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.quit();
  }
}
