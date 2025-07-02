import Article from "../models/Article.js";
import Curriculum from "../models/Curriculum.js";

const curriculums = [
  new Curriculum(
    1,
    "JavaScript Fundamentals",
    "Learn the building blocks of JavaScript: variables, functions, loops, and control flow.",
    "badge-javascript-43bfdf7b.svg",
    [
      new Article(
        "lesson-1",
        "Intermediate",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Article(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
    ],
  ),
  new Curriculum(
    2,
    "Asynchronous Programming",
    "Understand asynchronous behavior in JavaScript using callbacks, promises, and async/await.",
    "badge-javascript-43bfdf7b.svg",
    [
      new Article(
        "lesson-1",
        "Intermediate",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Article(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
    ],
  ),
  new Curriculum(
    3,
    "DOM & Events",
    "Manipulate the DOM, listen to user events, and build interactive pages.",
    "badge-javascript-43bfdf7b.svg",
    [
      new Article(
        "lesson-1",
        "Intermediate",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Article(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Article(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Article(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
    ],
  ),
];

export async function getCurriculumsView(request, reply) {
  try {
    const viewModel = curriculums;

    return reply.viewAsync("curriculum.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  }
}

export async function getUnitsView(request, reply) {
  try {
    const { id } = request.params;
    const viewModel = curriculums[id - 1];

    return reply.viewAsync("unit.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  }
}
