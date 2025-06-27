import fs from "node:fs";

export default class LessonService {
  _unified;

  constructor(unified) {
    this._unified = unified;
  }

  async prepareLesson() {
    const md = fs.readFileSync("./lesson.md");
    return this._unified.process(md);
  }
}
