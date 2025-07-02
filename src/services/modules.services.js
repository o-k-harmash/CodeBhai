import Lesson from "../models/lesson.model.js";
import Module from "../models/module.model.js";

export async function getModulesViewModel() {
  return [
    new Module(
      1,
      "Intermediate HTML and CSS",
      "Let's learn a little more about what you can do with HTML and CSS.",
      "badge-javascript-43bfdf7b.svg",
    ),
    new Module(
      2,
      "JavaScript",
      "Make your websites dynamic and interactive with JavaScript! You'll create features and stand-alone applications. This module includes projects where you will learn how to manipulate the DOM, use object-oriented programming principles, and fetch real-world data using APIs.",
      "badge-javascript-43bfdf7b.svg",
    ),
    new Module(
      3,
      "Advanced HTML and CSS",
      "It's time to dig in and become the CSS expert you deserve to be. After this course you'll be equipped to create web projects that look beautiful on any device!",
      "badge-javascript-43bfdf7b.svg",
    ),
  ];
}

export async function getContentViewModel() {
  return new Module(
    1,
    "Intermediate HTML and CSS",
    "Let's learn a little more about what you can do with HTML and CSS.",
    "badge-javascript-43bfdf7b.svg",
    [
      new Lesson(
        "lesson-1",
        "Intermediate",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
      new Lesson(
        "lesson-2",
        "Asynchronous JavaScript",
        "Let's",
        "badge-javascript-43bfdf7b.svg",
        "lesson",
      ),
    ],
  );
}
