import { join } from "node:path";
import fastifyStatic from "@fastify/static";
// plugins/fastifyStaticMiddleware.js
import fp from "fastify-plugin";

function staticPlugin(fastify, opts, done) {
  fastify.register(fastifyStatic, {
    prefix: "/static",
    root: join(opts.dirname, "static"),
  });
  done();
}

export default fp(staticPlugin);
