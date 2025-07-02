import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import Fastify from "fastify";
import handlebars from "handlebars";
import lessonRoutes from "./routes/lesson.routes.js";
import modulesRoutes from "./routes/modules.routes.js";
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
      unit: "unit.hbs",
      curriculum: "curriculum.hbs",
      500: "500.hbs",
      article: "article.hbs",
      404: "404.hbs",
    },
  },
  layout: "main.hbs",
  root: path.join(__dirname, "views"),
});

app.register(lessonRoutes, { prefix: "/units" });
app.register(modulesRoutes, { prefix: "/curriculums" });

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
