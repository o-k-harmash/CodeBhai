import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import dotenv from "dotenv";
import Fastify from "fastify";
import handlebars from "handlebars";
// import prisma from "./db/prisma.js";
import curriculumRoutes from "./routes/curriculums.js";
import { findFreePort } from "./utils/netstat.js";

import "./views/helpers/renderUnitsSummary.js";

import "./views/helpers/renderArticleIcon.js";

dotenv.config();

// async function main() {
//   await prisma.curriculum.create({
//     data: {
//       id: "javascript",
//       title: "Getting Started",
//       description: "Introduction to core JavaScript concepts",
//       imgFile: "badge-javascript-43bfdf7b.svg",
//       order: 1,
//       articles: {
//         create: [
//           {
//             id: "javascript-getting-started",
//             title: "Understanding Asynchronous JavaScript",
//             description:
//               "Learn how async code works in JS: callbacks, promises, and async/await.",
//             type: "lesson",
//             order: 1,
//           },
//           {
//             id: "javascript-modules",
//             title: "Introduction to JavaScript Modules",
//             description:
//               "This lesson covers the basics of ES Modules and CommonJS, explaining how to structure and import/export code effectively.",
//             type: "project",
//             order: 2,
//           },
//         ],
//       },
//     },
//   });
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

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

app.register(curriculumRoutes, { prefix: "/curriculums" });

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
