import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-lg px-6">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24" />

      {/* Gallery */}
      <section className="pb-24">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
