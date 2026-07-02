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
      <section className="flex flex-col items-center justify-center px-6 pb-16 pt-36 text-center">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: "var(--faint)" }}>
          AI Art Gallery
        </p>
        <h1 className="mb-5 text-5xl font-thin tracking-[0.25em] uppercase md:text-7xl" style={{ color: "var(--text)" }}>
          Ciselure
        </h1>
        <div className="mb-7 h-px w-12" style={{ background: "var(--border)" }} />
        <p className="max-w-md text-sm font-light leading-loose" style={{ color: "var(--muted)" }}>
          A curated collection of AI-generated imagery.<br />
          Browse the works and leave your impressions.
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
