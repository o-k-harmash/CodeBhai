import { getLessonView } from "../handlers/lesson.handlers.js";

export default function lessonRoutes(fastify) {
  fastify.get("/:id", getLessonView);
}
