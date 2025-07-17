import fp from "fastify-plugin";

function notFoundPlugin(fastify, opt, done) {
  fastify.setNotFoundHandler((req, reply) => {
    fastify.log.warn({ req }, "Not found");
    return reply.status(404).viewAsync("404.hbs", { data: "Not found" });
  });
  done();
}

export default fp(notFoundPlugin);
