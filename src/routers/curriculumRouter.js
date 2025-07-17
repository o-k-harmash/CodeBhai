import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import NotFoundError from "../errors/notFoundError.js";
import remarkFabric from "../utils/remark.js";

let router = null;

function Router(db, logger, cache) {
  this.db = db;
  this.logger = logger;
  this.cache = cache;

  this.mapRoutes = (fastify) => {
    fastify.get("/", {
      preHandler: this.identifyUser,
      handler: this.getCurriculumsView,
    });

    fastify.get("/:curriculumId/units", {
      preHandler: this.identifyUser,
      handler: this.getUnitsView,
    });

    fastify.get("/:curriculumId/units/:articleId", {
      preHandler: this.identifyUser,
      handler: this.getArticleView,
    });
  };

  this.identifyUser = (req, reply, done) => {
    const { user_id: userId, avatar } = req.cookies;

    const userAgent = req.headers["user-agent"] || "";
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );

    req.user = {
      id: userId ?? null,
      avatar,
      isAuthenticated: Boolean(userId),
      userAgent,
      isMobile,
    };

    if (!userId) {
      return reply.redirect("/auth/github");
    }

    done();
  };

  this.getUnitsView = async (request, reply) => {
    const { curriculumId } = request.params;
    const viewModel = await this.db.curriculum.findUnique({
      where: { id: curriculumId },
      include: {
        articles: {},
      },
    });

    return reply.viewAsync("unit.hbs", {
      data: viewModel,
      user: request.user,
    });
  };

  this.getCurriculumsView = async (request, reply) => {
    const viewModel = await this.db.curriculum.findMany();

    return reply.viewAsync("curriculum.hbs", {
      data: viewModel,
      user: request.user,
    });
  };

  this.getArticleView = async (request, reply) => {
    const { curriculumId, articleId } = request.params;
    const cacheKey = `article:view:${articleId}`;

    const cached = await this.cache.get(cacheKey);
    let dataView;

    if (cached) {
      dataView = JSON.parse(cached);
    } else {
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
      if (!currentArticle) {
        throw new NotFoundError(
          `Article: ${articleId} not found in curriculum`,
        );
      }

      const filePath = join("markdown", curriculumId, `${articleId}.md`);
      if (!existsSync(filePath)) {
        throw new NotFoundError(`Article: ${articleId} not found`);
      }

      const md = readFileSync(filePath, "utf-8");
      const remark = remarkFabric();
      const mainViewModel = await remark(md);
      const nextArticleId = articles.find(
        (a) => a.order > currentArticle.order,
      )?.id;

      dataView = {
        ...mainViewModel,
        curriculum,
        currentArticle,
        nextArticleId,
      };

      await this.cache.set(cacheKey, JSON.stringify(dataView), { EX: 3600 });
    }

    return reply.viewAsync("article.hbs", {
      user: request.user,
      data: dataView,
    });
  };
}

function createCurriculumRouter(logger, db, cache) {
  if (router) {
    return router;
  }
  router = new Router(db, logger, cache);
  Object.freeze(router);
  return router;
}

export default createCurriculumRouter;
