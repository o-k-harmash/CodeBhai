export default class LessonController {
  _lessonService;
  _server;
  constructor(lessonService, server) {
    this._server = server;
    this._server.log.error("dsadsasd\n\n\n\n\n");
    this._lessonService = lessonService;
  }

  mapEndpoints = async (server) => {
    server.get("/", this.getLessonPage);
  };

  getLessonPage = async (request, reply) => {
    try {
      const data = await this._lessonService.prepareLesson();
      return reply.viewAsync("lesson", { data });
    } catch (err) {
      this._server.log.error(err);
      return reply.viewAsync("internalError");
    }
  };
}
