export class CurriculumRouter {
  constructor(curriculumService, logger) {
    this.curriculumService = curriculumService;
    this.logger = logger;
  }

  mapRoutes = (fastify) => {
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
  }

  identifyUser = (req, reply, done) => {
    const { id } = req.cookies;
    req.user = { id };
    if (!id) return reply.redirect("/auth/github");
    done();
  }

  getCurriculumsView = async (req, reply) => {
    const data = await this.curriculumService.getCurriculumsView();
    return reply.viewAsync("curriculum.hbs", { data });
  }

  getUnitsView = async (req, reply) => {
    const { curriculumId } = req.params;
    const data = await this.curriculumService.getUnitsView(curriculumId);
    return reply.viewAsync("unit.hbs", { data });
  }

  getArticleView = async (req, reply) => {
    const { curriculumId, articleId } = req.params;
    const data = await this.curriculumService.getArticleView(curriculumId, articleId);
    return reply.viewAsync("article.hbs", { ...data });
  }
}