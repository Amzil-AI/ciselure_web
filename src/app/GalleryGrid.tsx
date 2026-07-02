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
      <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/[0.02]">
        <p className="text-stone-400 text-lg font-light">Gallery coming soon.</p>
        <p className="text-stone-600 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          New AI-generated work will appear here. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {images.map((img, idx) => (
        <Link
          key={img.id}
          href={`/gallery/${img.id}`}
          className="gallery-card block break-inside-avoid group relative overflow-hidden rounded-xl border border-white/5 hover:border-white/20 transition-all duration-500 fade-up"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <div className="relative w-full overflow-hidden bg-white/5">
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              width={800}
              height={800}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ height: "auto" }}
              priority={idx < 3}
            />
            <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 flex flex-col justify-end p-5">
              <h2 className="text-white font-medium text-lg leading-tight">{img.title}</h2>
              <div className="flex items-center gap-3 mt-2 text-stone-300 text-xs">
                <span>{formatDate(img.createdAt)}</span>
                <span>·</span>
                <span>
                  {img._count.comments}{" "}
                  {img._count.comments === 1 ? "comment" : "comments"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-[#111] group-hover:bg-[#131313] transition-colors">
            <h2 className="text-stone-100 font-medium truncate">{img.title}</h2>
            <div className="flex items-center justify-between mt-1">
              <span className="text-stone-500 text-xs">{formatDate(img.createdAt)}</span>
              <span className="text-stone-500 text-xs">💬 {img._count.comments}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
