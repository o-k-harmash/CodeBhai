import {
  getArticleView,
  getCurriculumsView,
  getUnitsView,
} from "../handlers/curriculums.js";

export default function curriculumRoutes(fastify) {
  fastify.get("/", getCurriculumsView);
  fastify.get("/:curriculumId/units", getUnitsView);
  fastify.get("/:curriculumId/units/:articleId", getArticleView);
}
