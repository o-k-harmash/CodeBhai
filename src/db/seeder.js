import { execSync } from "node:child_process";
import fs from "node:fs/promises";

async function seeder(db) {
  execSync("npx prisma migrate deploy --schema=./src/db/schema.prisma", {
    stdio: "inherit",
  });

  const seedDataRaw = await fs.readFile("./src/db/seed.json", "utf-8");
  const seedData = JSON.parse(seedDataRaw);

  for (const curriculum of seedData.curriculums) {
    await db.curriculum.upsert({
      where: { id: curriculum.id },
      update: {},
      create: {
        id: curriculum.id,
        title: curriculum.title,
        description: curriculum.description,
        imgFile: curriculum.imgFile,
        order: curriculum.order,
        articles: {
          create: curriculum.articles.map((article) => ({
            id: article.id,
            title: article.title,
            description: article.description,
            type: article.type,
            order: article.order,
          })),
        },
      },
    });
  }
}

export default seeder;
