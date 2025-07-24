import process from "node:process";
import Fastify from "fastify";
import authPlugin from "../middlewares/authPlugin.js";
import cookiePlugin from "../middlewares/cookiePlugin.js";
import errorHandlerPlugin from "../middlewares/errorHandlerPlugin.js";
import notFoundPlugin from "../middlewares/notFoundPlugin.js";
import staticPlugin from "../middlewares/staticPlugin.js";
import viewPlugin from "../middlewares/viewPlugin.js";
import portTaken from "./portTaken.js";

export class Server {
  constructor({ logger, router, dirname, publicDir, viewsDir }) {
    if (
      !logger ||
      !router ||
      !String(dirname) ||
      !String(publicDir) ||
      !String(viewsDir)
    ) {
      throw new Error("Config is broken");
    }

    this.fastify = Fastify({
      loggerInstance: logger,
      disableRequestLogging: true,
    });

    this.fastify.register(cookiePlugin);
    this.fastify.register(staticPlugin, { dirname, publicDir });
    this.fastify.register(viewPlugin, { dirname, viewsDir });
    this.fastify.register(notFoundPlugin);
    this.fastify.register(errorHandlerPlugin);

    this.fastify.register(authPlugin, {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: "auth/github/callback",
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    });

    this.fastify.register(router.mapRoutes, {
      prefix: "curriculums",
    });

    this.fastify.get("/community", async (req, reply) => {
      return reply.viewAsync("community.hbs");
    });

    this.fastify.get("/support", async (req, reply) => {
      return reply.viewAsync("support.hbs");
    });

    this.fastify.get("/", async (req, reply) => {
      return reply.viewAsync("home.hbs");
    });
  }

  async listen() {
    const port = process.env.NODE_PORT;

    if (!port) {
      throw new Error("Port is undefined.");
    }

    const taken = await portTaken(port);
    if (taken) {
      throw new Error("Port is taken.");
    }

    await this.fastify.listen({ port, host: "0.0.0.0" });

    const addresses = this.fastify.addresses?.() || [];
    this.fastify.port = addresses[0]?.port || port;

    this.fastify.log.info(`Server started on port ${this.fastify.port}`);
  }
}
