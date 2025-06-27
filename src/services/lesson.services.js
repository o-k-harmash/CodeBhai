import { readFile } from "node:fs/promises";
import path from "node:path";
import remark from "./remark/remark.js";

export async function getLessonViewModel(id) {
  const md = await readFile(path.join("markdown", `${id}.md`), "utf-8");
  return remark.process(md);
}
