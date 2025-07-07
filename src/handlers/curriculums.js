import { readFile } from "node:fs/promises";
import path from "node:path";
import prisma from "../db/prisma.js";
import remarkFabric from "../utils/remark.js";

export async function getCurriculumsView(request, reply) {
  try {
    const viewModel = await prisma.curriculum.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        articles: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return reply.viewAsync("curriculum.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUnitsView(request, reply) {
  try {
    const { curriculumId } = request.params;
    const viewModel = await prisma.curriculum.findUnique({
      where: { id: curriculumId },
      include: {
        articles: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return reply.viewAsync("unit.hbs", { data: viewModel });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getArticleView(request, reply) {
  try {
    const { curriculumId, articleId } = request.params;
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: curriculumId },
      include: {
        articles: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!curriculum) throw new Error("Curriculum not found");

    const articles = curriculum.articles;
    const currentArticle = articles.find((a) => a.id === articleId);

    const md = await readFile(
      path.join("markdown", curriculumId, `${articleId}.md`),
      "utf-8",
    );
    const remark = remarkFabric();
    const viewModel = await remark(md);
    return reply.viewAsync("article.hbs", {
      data: {
        ...viewModel,
        curriculum,
        currentArticle,
        nextArticleId: articles.find((a) => a.order > currentArticle.order)?.id,
      },
    });
  } catch (err) {
    return reply.viewAsync("500.hbs", { data: err.message });
  }
}
