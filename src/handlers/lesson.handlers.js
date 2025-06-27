import { getLessonViewModel } from "../services/lesson.services.js";

export async function getLessonView(request, reply) {
  try {
    const { id } = request.params;
    const viewModel = await getLessonViewModel(id);
    return reply.viewAsync("lesson.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("internalError.hbs", { data: err.message });
  }
}
