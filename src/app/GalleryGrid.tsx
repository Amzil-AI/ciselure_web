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
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
          Gallery Coming Soon
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group block"
        >
          {/* Image */}
          <div
            className="relative w-full overflow-hidden border"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              width={800}
              height={800}
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority={img.id <= 2}
            />
          </div>

          {/* Caption */}
          <div className="mt-3 flex items-start justify-between gap-4 px-1">
            <div>
              <p className="text-sm font-light" style={{ color: "var(--text)" }}>{img.title}</p>
              {img.description && (
                <p className="mt-0.5 text-xs font-light leading-relaxed" style={{ color: "var(--muted)" }}>
                  {img.description}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px]" style={{ color: "var(--faint)" }}>{formatDate(img.createdAt)}</p>
              <p className="mt-0.5 text-[10px]" style={{ color: "var(--faint)" }}>
                {img._count.comments} {img._count.comments === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
