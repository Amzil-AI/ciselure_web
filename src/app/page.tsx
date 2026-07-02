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
      {/* Hero */}
      <section className="flex flex-col items-center pb-12 pt-40 text-center sm:pt-44 md:pt-52">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: "var(--faint)" }}>
          AI Art Gallery
        </p>
        <h1
          className="mb-5 text-4xl font-thin tracking-[0.2em] uppercase sm:text-5xl md:text-6xl"
          style={{ color: "var(--text)" }}
        >
          Ciselure
        </h1>
        <div className="h-px w-10" style={{ background: "var(--border)" }} />
      </section>

      {/* Gallery */}
      <section className="pb-24">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
