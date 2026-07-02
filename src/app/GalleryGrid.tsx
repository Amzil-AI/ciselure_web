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
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--faint)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Gallery coming soon.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {images.map((img) => (
        <Link key={img.id} href={`/gallery/${img.id}`} style={{ display: "block", textDecoration: "none" }} className="gallery-card group">
          {/* Image */}
          <div style={{ width: "100%", border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg-card)" }}>
            <Image
              src={`/api/uploads/${img.filename}`}
              alt={img.title}
              width={800}
              height={800}
              style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s ease" }}
              className="group-hover:scale-[1.02]"
              priority={img.id <= 2}
            />
          </div>

          {/* Caption */}
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--text)" }}>{img.title}</p>
              {img.description && (
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "3px", lineHeight: 1.6 }}>{img.description}</p>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "10px", color: "var(--faint)" }}>{formatDate(img.createdAt)}</p>
              <p style={{ fontSize: "10px", color: "var(--faint)", marginTop: "2px" }}>
                {img._count.comments} {img._count.comments === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
