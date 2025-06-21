export default async function mapEndpoints(server) {
  server.get("/", getHomePage);
}

async function getHomePage(request, reply) {
  const data = { name: "World" };
  return reply.viewAsync("lesson.hbs", data);
}
