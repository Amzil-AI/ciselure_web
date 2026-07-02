import Image from "next/image";
import Link from "next/link";

export interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  createdAt: Date;
  _count: { comments: number };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <div className="h-px w-10" style={{ background: "var(--border)" }} />
        <p className="text-xs uppercase tracking-widest" style={{ color: "var(--faint)" }}>
          Gallery Coming Soon
        </p>
      </div>
    );
  }

  const gridClass =
    images.length === 1
      ? "mx-auto grid max-w-sm grid-cols-1 gap-px"
      : images.length === 2
        ? "mx-auto grid max-w-2xl grid-cols-2 gap-px"
        : "grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass} style={{ background: "var(--border)" }}>
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group relative block overflow-hidden"
          style={{ background: "var(--bg)" }}
        >
          {/* Square image crop */}
          <div className="relative aspect-square w-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={img.id <= 3}
            />
            {/* Hover overlay */}
            <div
              className="gallery-overlay absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300"
              style={{ background: "linear-gradient(to top, rgba(44,37,32,0.75) 0%, transparent 60%)" }}
            >
              <p className="text-sm font-light text-white">{img.title}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="truncate text-sm font-light" style={{ color: "var(--text)" }}>{img.title}</p>
            <div className="mt-1 flex items-center justify-between text-xs" style={{ color: "var(--faint)" }}>
              <span>{formatDate(img.createdAt)}</span>
              <span>{img._count.comments} {img._count.comments === 1 ? "note" : "notes"}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
