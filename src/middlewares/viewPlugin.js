import { join } from "node:path";
import fastifyView from "@fastify/view";
// plugins/fastifyViewMiddleware.js
import fp from "fastify-plugin";
import handlebars from "handlebars";

function viewPlugin(fastify, opts, done) {
  fastify.register(fastifyView, {
    engine: { handlebars },
    options: {
      partials: {
        unit: "unit.hbs",
        curriculum: "curriculum.hbs",
        500: "500.hbs",
        article: "article.hbs",
        404: "404.hbs",
        community: "community.hbs",
        support: "support.hbs",
        home: "home.hbs",
      },
    },
    layout: "main.hbs",
    root: join(opts.dirname, "views"),
  });
  done();
}

export default fp(viewPlugin);
