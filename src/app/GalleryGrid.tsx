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
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <div className="h-px w-12 bg-white/10" />
        <p className="text-sm font-light tracking-widest text-stone-600 uppercase">
          Gallery Coming Soon
        </p>
        <p className="text-xs text-stone-700 max-w-xs leading-relaxed">
          New work will appear here. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card group relative block overflow-hidden bg-[#0d0d0d]"
        >
          {/* Image — fixed square crop */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={img.id <= 3}
            />
            {/* Hover overlay */}
            <div className="gallery-overlay absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 opacity-0 transition-opacity duration-400">
              <div>
                <p className="text-base font-light text-white">{img.title}</p>
                <p className="mt-1 text-xs text-stone-400">{formatDate(img.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div className="border-t border-white/5 px-5 py-4">
            <p className="truncate text-sm font-light text-stone-300">{img.title}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-stone-600">
              <span>{formatDate(img.createdAt)}</span>
              <span>
                {img._count.comments}{" "}
                {img._count.comments === 1 ? "comment" : "comments"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
