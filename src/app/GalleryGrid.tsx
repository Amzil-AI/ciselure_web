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
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <div className="h-px w-10" style={{ background: "var(--border)" }} />
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
          Gallery Coming Soon
        </p>
      </div>
    );
  }

  const cols =
    images.length === 1
      ? "grid-cols-1 max-w-xs mx-auto"
      : images.length === 2
        ? "grid-cols-1 max-w-md mx-auto sm:grid-cols-2 sm:max-w-2xl"
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-4 sm:gap-6 ${cols}`}>
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group block overflow-hidden border transition-all duration-300 hover:shadow-md"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
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
              className="gallery-overlay absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 sm:p-4"
              style={{ background: "linear-gradient(to top, rgba(44,37,32,0.78) 0%, transparent 60%)" }}
            >
              <p className="text-xs font-light text-white sm:text-sm leading-snug">{img.title}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-3 sm:px-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="truncate text-xs font-light sm:text-sm" style={{ color: "var(--text)" }}>
              {img.title}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px]" style={{ color: "var(--faint)" }}>
                {formatDate(img.createdAt)}
              </span>
              <span className="shrink-0 text-[10px]" style={{ color: "var(--faint)" }}>
                {img._count.comments} {img._count.comments === 1 ? "note" : "notes"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
