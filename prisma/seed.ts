import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.image.count();
  if (count > 0) {
    console.log("Database already has images, skipping seed.");
    return;
  }

  await prisma.image.createMany({
    data: [
      {
        title: "Ethereal Bloom",
        description: "A dreamlike floral composition generated with diffusion models.",
        filename: "sample-1.jpeg",
      },
      {
        title: "Urban Mirage",
        description: "Cityscapes reimagined through the lens of generative AI.",
        filename: "sample-2.jpeg",
      },
    ],
  });

  console.log("Seeded 2 sample images.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
