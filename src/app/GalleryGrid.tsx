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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-24 text-center">
        <p className="text-lg font-light text-stone-400">Gallery coming soon.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600">
          New AI-generated work will appear here. Check back soon.
        </p>
      </div>
    );
  }

  const gridClass =
    images.length === 1
      ? "mx-auto grid max-w-md grid-cols-1 gap-8"
      : images.length === 2
        ? "mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2"
        : "mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group overflow-hidden rounded-2xl border border-white/5 bg-[#111] transition-all duration-300 hover:border-white/20 hover:bg-[#131313]"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={img.id <= 3}
            />
            <div className="gallery-overlay absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-500">
              <h2 className="text-lg font-medium leading-tight text-white">{img.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-xs text-stone-300">
                <span>{formatDate(img.createdAt)}</span>
                <span>·</span>
                <span>
                  {img._count.comments}{" "}
                  {img._count.comments === 1 ? "comment" : "comments"}
                </span>
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <h2 className="truncate font-medium text-stone-100">{img.title}</h2>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
              <span>{formatDate(img.createdAt)}</span>
              <span>💬 {img._count.comments}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
