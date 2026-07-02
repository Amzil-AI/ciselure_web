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
      {/* Hero — enough top padding to clear the fixed 56px header */}
      <section className="flex flex-col items-center justify-center px-6 pb-12 pt-40 text-center sm:pt-44 md:pt-52">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em]" style={{ color: "var(--faint)" }}>
          AI Art Gallery
        </p>
        <h1
          className="mb-5 text-4xl font-thin tracking-[0.2em] uppercase sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ color: "var(--text)" }}
        >
          Ciselure
        </h1>
        <div className="mb-6 h-px w-10" style={{ background: "var(--border)" }} />
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
