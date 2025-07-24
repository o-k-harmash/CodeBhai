import process from "node:process";
import Fastify from "fastify";
import authPlugin from "../middlewares/authPlugin.js";
import cookiePlugin from "../middlewares/cookiePlugin.js";
import errorHandlerPlugin from "../middlewares/errorHandlerPlugin.js";
import notFoundPlugin from "../middlewares/notFoundPlugin.js";
import staticPlugin from "../middlewares/staticPlugin.js";
import viewPlugin from "../middlewares/viewPlugin.js";
import portTaken from "./portTaken.js";

let server = null;

function Server(fastify) {
  this.fastify = fastify;
}

Server.prototype.listen = async function listen() {
  try {
    const port = process.env.NODE_PORT;
    if (!port) {
      throw new Error("Port is undefined.");
    }

    const taken = await portTaken(port);
    if (taken) {
      throw new Error("Port is taken.");
    }

    // сделать порт по конфигу если свободен если нет тогда искать
    await this.fastify.listen({
      port,
      host: "0.0.0.0",
    });
    const addresses = this.fastify.addresses();
    this.fastify.port = addresses[0].port;
  } catch (err) {
    this.fastify.log.error(err);
    process.exit(1);
  }
};

function createServer(logger, router, { dirname, publicDir, viewsDir }) {
  if (server) {
    return server;
  }

  if (!logger) {
    console.error("Logger is required");
    process.exit(1);
  }

  const fastify = Fastify({
    loggerInstance: logger,
    disableRequestLogging: true,
  });

  fastify.register(cookiePlugin);
  fastify.register(staticPlugin, { dirname, publicDir });
  fastify.register(viewPlugin, { dirname, viewsDir });
  fastify.register(notFoundPlugin);
  fastify.register(errorHandlerPlugin);

  fastify.register(authPlugin, {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "auth/github/callback",
    client_secret: process.env.GITHUB_CLIENT_SECRET,
  });

  fastify.register(router.mapRoutes, {
    prefix: "curriculums",
  });

  fastify.get("/community", async (req, reply) => {
    return reply.viewAsync("community.hbs");
  });

  fastify.get("/support", async (req, reply) => {
    return reply.viewAsync("support.hbs");
  });

  fastify.get("/", async (req, reply) => {
    return reply.viewAsync("home.hbs");
  });

  server = new Server(fastify);
  Object.freeze(server);
  return server;
}

export default createServer;
