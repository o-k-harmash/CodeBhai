import { readFile } from "node:fs/promises";
import path from "node:path";
import remarkFabric from "../utils/remark.js";

export async function getLessonViewModel(id) {
  const md = await readFile(path.join("markdown", `${id}.md`), "utf-8");
  const remark = remarkFabric();
  return remark(md);
}
