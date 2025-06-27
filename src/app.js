import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import Fastify from "fastify";
import handlebars from "handlebars";
import lessonRoutes from "./routes/lesson.routes.js";
import { findFreePort } from "./utils/netstat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

app.register(fastifyStatic, {
  prefix: "/static",
  root: path.join(__dirname, "static"),
});

app.register(fastifyView, {
  engine: {
    handlebars,
  },
  options: {
    partials: {
      internalError: "internalError.hbs",
      lesson: "lesson.hbs",
      notFound: "notFound.hbs",
    },
  },
  layout: path.join("layouts", "main.layout.hbs"),
  root: path.join(__dirname, "views"),
});

app.register(lessonRoutes, { prefix: "/lessons" });

(async () => {
  try {
    let port = await findFreePort({});
    port ??= 0;

    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
