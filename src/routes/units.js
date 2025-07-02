import { getArticleView } from "../handlers/units.js";

export default function unitRoutes(fastify) {
  fastify.get("/:id", getArticleView);
}
