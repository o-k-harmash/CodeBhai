import {
  getContentView,
  getModulesView,
} from "../handlers/modules.handlers.js";

export default function modulesRoutes(fastify) {
  fastify.get("/", getModulesView);
  fastify.get("/units", getContentView);
}
