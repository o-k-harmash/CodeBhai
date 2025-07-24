import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises"; // fs/promises for readFile
import { join } from "node:path";
import NotFoundError from "../errors/NotFoundError.js"; // или свой класс ошибки
import { RemarkService } from "./RemarkService.js"; // рендер markdown

export class CurriculumService {
  constructor(db, cacheService) {
    this.db = db;
    this.cacheService = cacheService;
  }

  async getCurriculumsView() {
    return this.db.curriculum.findMany();
  }

  async getUnitsView(curriculumId) {
    return this.db.curriculum.findUnique({
      where: { id: curriculumId },
      include: { articles: {} },
    });
  }

  async getArticleView(curriculumId, articleId) {
    let dataView = await this.cacheService.get(articleId);

    if (dataView) return dataView;

    const curriculum = await this.db.curriculum.findUnique({
      where: { id: curriculumId },
      include: {
        articles: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!curriculum) {
      throw new NotFoundError("Curriculum not found");
    }

    const articles = curriculum.articles;
    const currentArticle = articles.find((a) => a.id === articleId);
    if (!currentArticle) {
      throw new NotFoundError(`Article: ${articleId} not found in curriculum`);
    }

    const filePath = join("markdown", curriculumId, `${articleId}.md`);
    if (!existsSync(filePath)) {
      throw new NotFoundError(`Article: ${articleId} not found`);
    }

    const md = await readFile(filePath, "utf-8");
    const mainViewModel = await new RemarkService().render(md);

    const nextArticleId = articles.find(
      (a) => a.order > currentArticle.order,
    )?.id;

    dataView = {
      imgFile: curriculum.imgFile,
      curriculumId: curriculum.id,
      title: currentArticle.title,
      subTitle: curriculum.id,
      nextArticleId,
      sideNav: mainViewModel.h3Ids,
      content: mainViewModel.rawHtml,
    };

    await this.cacheService.set(articleId, dataView);
    return dataView;
  }
}
