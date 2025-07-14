import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fastifyAuthentificateMiddleware from "../middlewares/fastifyAuthentificateMiddleware.js"; // путь к миддлваре, если ты так сделал
import remarkFabric from "../utils/remark.js";

let router = null;
function Router(db, logger) {
  this.db = db;
  this.logger = logger;

  this.mapRoutes = (fastify) => {
    const auth = { preValidation: fastifyAuthentificateMiddleware };
    fastify.get("/", auth, this.getCurriculumsView);
    fastify.get("/:curriculumId/units", auth, this.getUnitsView);
    fastify.get("/:curriculumId/units/:articleId", auth, this.getArticleView);
  };

  this.getUnitsView = async (request, reply) => {
    try {
      const { curriculumId } = request.params;
      const viewModel = await this.db.curriculum.findUnique({
        where: { id: curriculumId },
        include: {
          articles: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return reply.viewAsync("unit.hbs", { data: viewModel });
    } catch (err) {
      return reply.viewAsync("500.hbs", { data: err.message });
    } finally {
      await this.db.$disconnect();
    }
  };

  this.getCurriculumsView = async (request, reply) => {
    try {
      const viewModel = await this.db.curriculum.findMany({
        orderBy: {
          order: "asc",
        },
        include: {
          articles: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return reply.viewAsync("curriculum.hbs", { data: viewModel });
    } catch (err) {
      return reply.viewAsync("500.hbs", { data: err.message });
    } finally {
      await this.db.$disconnect();
    }
  };

  this.getArticleView = async (request, reply) => {
    try {
      const { curriculumId, articleId } = request.params;
      const curriculum = await this.db.curriculum.findUnique({
        where: { id: curriculumId },
        include: {
          articles: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!curriculum) {
        throw new Error("Curriculum not found");
      }

      const articles = curriculum.articles;
      const currentArticle = articles.find((a) => a.id === articleId);

      const md = await readFile(
        join("markdown", curriculumId, `${articleId}.md`),
        "utf-8",
      );
      const remark = remarkFabric();
      const viewModel = await remark(md);
      return reply.viewAsync("article.hbs", {
        data: {
          ...viewModel,
          curriculum,
          currentArticle,
          nextArticleId: articles.find((a) => a.order > currentArticle.order)
            ?.id,
        },
      });
    } catch (err) {
      return reply.viewAsync("500.hbs", { data: err.message });
    } finally {
      await this.db.$disconnect();
    }
  };
}

function createCurriculumRouter(logger, db) {
  if (router) {
    return router;
  }

  return (router = new Router(db, logger));
}

export default createCurriculumRouter;
