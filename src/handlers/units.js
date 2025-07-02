import { readFile } from "node:fs/promises";
import path from "node:path";
import remarkFabric from "../utils/remark.js";

export async function getArticleView(request, reply) {
  try {
    const { id } = request.params;
    const md = await readFile(path.join("markdown", `${id}.md`), "utf-8");
    const remark = remarkFabric();
    const viewModel = await remark(md);
    return reply.viewAsync("article.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  }
}
