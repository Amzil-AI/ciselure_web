import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:pt-14">
      <section className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-stone-500">
          AI Art Gallery
        </p>
        <h1 className="mb-5 text-4xl font-extralight tracking-tight text-white md:text-5xl">
          Ciselure
        </h1>
        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-stone-400 md:text-lg">
          A collection of AI-generated imagery. Browse the gallery and leave your impressions.
        </p>
      </section>

      <GalleryGrid images={images} />
    </div>
  );
}
