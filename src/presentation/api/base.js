export default async function mapRoutes(server) {
  server.get("/", helloWorldHandler);
}

async function helloWorldHandler(request, reply) {
  const data = { name: "World" };
  return reply.viewAsync("lesson.hbs", data);
}
