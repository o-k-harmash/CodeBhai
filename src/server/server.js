import process from "node:process";
import Fastify from "fastify";
import authPlugin from "../middlewares/authPlugin.js";
import cookiePlugin from "../middlewares/cookiePlugin.js";
import staticPlugin from "../middlewares/staticPlugin.js";
import viewPlugin from "../middlewares/viewPlugin.js";
import findFreePort from "./findFreePort.js";

let server = null;

function Server(fastify) {
  this.fastify = fastify;
}

Server.prototype.listen = async function listen(config = {}) {
  try {
    const port = (await findFreePort({ range: config.portRange })) || 0;

    await this.fastify.listen({ port, host: config.host ?? "0.0.0.0" });
    const addresses = this.fastify.addresses();
    this.fastify.port = addresses[0].port;
  } catch (err) {
    this.fastify.log.error(err);
    process.exit(1);
  }
};

function createServer(logger, router, { dirname }) {
  if (server) {
    return server;
  }

  if (!logger) {
    console.error("Logger is required");
    process.exit(1);
  }

  const fastify = Fastify({ loggerInstance: logger });

  fastify.register(cookiePlugin);
  fastify.register(staticPlugin, { dirname });
  fastify.register(viewPlugin, { dirname });
  fastify.register(authPlugin, {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "auth/github/callback",
    client_secret: process.env.GITHUB_CLIENT_SECRET,
  });

  fastify.register(router.mapRoutes, { prefix: "curriculums" });

  server = new Server(fastify);

  return server;
}

export default createServer;
