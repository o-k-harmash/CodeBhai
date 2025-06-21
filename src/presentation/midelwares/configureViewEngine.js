import fastifyView from "@fastify/view";
import handlebars from "handlebars";

export default function configureViewEngine(fastify, options = {}) {
  fastify.register(fastifyView, {
    engine: {
      handlebars,
    },
    options: {
      partials: {
        lesson: "lesson.hbs",
      },
    },
    layout: "layouts/main.hbs",
    root: "./src/presentation/views",
    ...options,
  });
}
