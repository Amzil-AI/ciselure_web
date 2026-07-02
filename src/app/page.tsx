import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
        <p className="text-xs tracking-[0.4em] text-stone-500 uppercase mb-4">
          AI Art Gallery
        </p>
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white mb-6">
          Ciselure
        </h1>
        <p className="text-stone-400 text-lg font-light max-w-xl mx-auto leading-relaxed">
          A collection of AI-generated imagery. Browse the gallery and leave your impressions.
        </p>
      </div>

      <GalleryGrid images={images} />
    </div>
  );
}
