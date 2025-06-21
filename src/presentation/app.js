import process from "node:process";
import Fastify from "fastify";
import { findFreePort } from "../shared/netstat.js";
import routeMapper from "./api/root.js";
import configureStaticAssets from "./midelwares/configureStaticAssets.js";
import configureViewEngine from "./midelwares/configureViewEngine.js";

export default class App {
  _server;

  constructor() {
    this._server = Fastify({
      logger: true,
    });
  }

  configureMiddlewares() {
    configureStaticAssets(this._server);
    configureViewEngine(this._server);
  }

  configureEndpoints() {
    this._server.register(routeMapper, { prefix: "v1/root/" });
  }

  gracefullShutdown() {
    process.exit(1);
  }

  async listen() {
    let port = await findFreePort({});
    port ??= 0;

    this._server.listen({ port }, (err) => {
      if (err) {
        this._server.log.error(err);
        this.gracefullShutdown();
      }
    });
  }
}
