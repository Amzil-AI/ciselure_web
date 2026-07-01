"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  createdAt: string;
  _count: { comments: number };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-20 text-center">
        <p className="text-xs tracking-[0.4em] text-stone-500 uppercase mb-4">AI Art Gallery</p>
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white mb-6">
          Ciselure
        </h1>
        <p className="text-stone-400 text-lg font-light max-w-xl mx-auto leading-relaxed">
          A collection of AI-generated imagery. Browse the gallery and leave your impressions.
        </p>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-32">
          <div className="text-6xl mb-6 opacity-20">◻</div>
          <p className="text-stone-500 text-lg font-light">No images yet.</p>
          <p className="text-stone-600 text-sm mt-2">
            Head to the{" "}
            <Link href="/admin" className="underline hover:text-stone-400 transition-colors">
              admin panel
            </Link>{" "}
            to post your first creation.
          </p>
        </div>
      ) : (
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
                  src={`/uploads/${img.filename}`}
                  alt={img.title}
                  width={800}
                  height={800}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ height: "auto" }}
                  priority={idx < 3}
                />
                {/* Overlay */}
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
              {/* Card footer */}
              <div className="p-4 bg-[#111] group-hover:bg-[#131313] transition-colors">
                <h2 className="text-stone-100 font-medium truncate">{img.title}</h2>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-stone-500 text-xs">{formatDate(img.createdAt)}</span>
                  <span className="text-stone-500 text-xs">
                    💬 {img._count.comments}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
