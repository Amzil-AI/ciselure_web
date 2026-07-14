import { createPrismaClient } from "../src/lib/create-prisma-client";
import { storeLocalFile } from "../src/lib/storage";

const prisma = createPrismaClient();

async function main() {
  const count = await prisma.image.count();
  if (count > 0) {
    console.log("Database already has images, skipping seed.");
    return;
  }

  const sample1 = await storeLocalFile("public/uploads/sample-1.jpeg");
  const sample2 = await storeLocalFile("public/uploads/sample-2.jpeg");

  await prisma.image.createMany({
    data: [
      {
        title: "Ethereal Bloom",
        description: "A dreamlike floral composition generated with diffusion models.",
        filename: sample1,
      },
      {
        title: "Urban Mirage",
        description: "Cityscapes reimagined through the lens of generative AI.",
        filename: sample2,
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
