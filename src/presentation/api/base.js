export default async function mapRoutes(server) {
  server.get("/", helloWorldHandler);
}

async function helloWorldHandler() {
  return { hello: "world" };
}
