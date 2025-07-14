import fastifyCookie from "@fastify/cookie";
// plugins/fastifyCookieMiddleware.js
import fp from "fastify-plugin";

function cookiePlugin(fastify, opts, done) {
  fastify.register(fastifyCookie, {
    parseOptions: {}, // твои опции
  });
  done();
}

export default fp(cookiePlugin);
