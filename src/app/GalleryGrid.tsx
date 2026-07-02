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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center sm:py-32">
        <div className="h-px w-10" style={{ background: "var(--border)" }} />
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
          Gallery Coming Soon
        </p>
      </div>
    );
  }

  // 1 image → centered single col, 2 → 2 col max, 3+ → responsive 1/2/3
  const cols =
    images.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : images.length === 2
        ? "grid-cols-2 max-w-2xl mx-auto"
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={`grid gap-px ${cols}`}
      style={{ background: "var(--border)" }}
    >
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group relative block overflow-hidden"
          style={{ background: "var(--bg)" }}
        >
          {/* Square crop */}
          <div className="relative aspect-square w-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={img.id <= 4}
            />
            {/* Hover overlay */}
            <div
              className="gallery-overlay absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 sm:p-5"
              style={{ background: "linear-gradient(to top, rgba(44,37,32,0.78) 0%, transparent 60%)" }}
            >
              <p className="text-xs font-light text-white sm:text-sm">{img.title}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-2 sm:px-4 sm:py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="truncate text-xs font-light sm:text-sm" style={{ color: "var(--text)" }}>
              {img.title}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs" style={{ color: "var(--faint)" }}>
              <span className="hidden sm:inline">{formatDate(img.createdAt)}</span>
              <span className="sm:hidden">{img._count.comments} notes</span>
              <span className="hidden sm:inline">{img._count.comments} {img._count.comments === 1 ? "note" : "notes"}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
