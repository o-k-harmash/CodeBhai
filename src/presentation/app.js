import process from "node:process";
import Fastify from "fastify";
import { findFreePort } from "../shared/netstat.js";
import routeMapper from "./api/base.js";

export default class App {
  _server;

  constructor() {
    this._server = Fastify({
      logger: true,
    });
  }

  configureRouter() {
    this._server.register(routeMapper, { prefix: "v1/base/" });
  }

  gracefullShutdown(){
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
