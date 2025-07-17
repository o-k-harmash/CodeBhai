import fp from "fastify-plugin";

function errorHandlerPlugin(fastify, opt, done) {
  fastify.setErrorHandler((err, req, reply) => {
    const status = err.statusCode || 500;
    fastify.log.error({ req, err, status }, "message");
    return reply
      .status(status)
      .viewAsync(`${status}.hbs`, { data: "Internal server error" });
  });
  done();
}

export default fp(errorHandlerPlugin);
