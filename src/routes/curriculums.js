import { getCurriculumsView, getUnitsView } from "../handlers/curriculums.js";

export default function curriculumRoutes(fastify) {
  fastify.get("/", getCurriculumsView);
  fastify.get("/:id/units", getUnitsView);
}
