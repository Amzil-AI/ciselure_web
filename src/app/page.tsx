import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <p className="mb-5 text-[10px] uppercase tracking-[0.45em] text-stone-600">
          AI Art Gallery
        </p>
        <h1 className="mb-6 text-6xl font-thin tracking-widest text-white md:text-8xl">
          CISELURE
        </h1>
        <div className="mb-8 h-px w-16 bg-white/10" />
        <p className="max-w-lg text-sm font-light leading-loose tracking-wide text-stone-500">
          A curated collection of AI-generated imagery.<br />
          Browse the works and leave your impressions.
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
