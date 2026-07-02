import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pb-10 pt-28 text-center sm:px-6 sm:pb-14 sm:pt-32 md:pt-36">
        <p className="mb-3 text-[9px] uppercase tracking-[0.5em] sm:mb-4 sm:text-[10px]" style={{ color: "var(--faint)" }}>
          AI Art Gallery
        </p>
        <h1
          className="mb-4 text-4xl font-thin tracking-[0.2em] uppercase sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ color: "var(--text)" }}
        >
          Ciselure
        </h1>
        <div className="mb-5 h-px w-10 sm:mb-6 sm:w-12" style={{ background: "var(--border)" }} />
        <p
          className="max-w-xs text-xs font-light leading-loose sm:max-w-md sm:text-sm"
          style={{ color: "var(--muted)" }}
        >
          A curated collection of AI-generated imagery.{" "}
          <span className="hidden sm:inline"><br /></span>
          Browse the works and leave your impressions.
        </p>
      </section>

      {/* Gallery */}
      <section className="w-full pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-6">
          <GalleryGrid images={images} />
        </div>
      </section>
    </div>
  );
}
