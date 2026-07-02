"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

interface Comment {
  id: number;
  name: string;
  content: string;
  createdAt: string;
}

interface ImageDetail {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  createdAt: string;
  comments: Comment[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

const inpClass = "w-full border px-3 py-2.5 text-sm font-light outline-none transition-colors focus:border-[var(--text)] sm:px-4 sm:py-3";
const inpStyle = { background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" };

export default function ImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [image, setImage] = useState<ImageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/images/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) { setImage(data); setComments(data.comments ?? []); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/images/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), content: content.trim() }),
      });
      if (!res.ok) throw new Error();
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setName(""); setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-32 sm:px-6">
        <div className="h-3 w-20 rounded" style={{ background: "var(--border)" }} />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
        <p className="text-sm" style={{ color: "var(--muted)" }}>Image not found.</p>
        <Link href="/" className="mt-4 inline-block text-xs uppercase tracking-widest underline" style={{ color: "var(--muted)" }}>← Back</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Back */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-50 sm:mb-10 sm:text-xs"
        style={{ color: "var(--muted)" }}
      >
        ← Gallery
      </Link>

      {/* Image + Info — stacks on mobile, side-by-side on md+ */}
      <div className="grid gap-8 sm:gap-10 md:grid-cols-5 md:gap-12 mb-16 sm:mb-20">
        {/* Image */}
        <div className="md:col-span-3">
          <div className="overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <Image
              src={`/api/uploads/${image.filename}`}
              alt={image.title}
              width={1200}
              height={1200}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.4em] sm:text-[10px]" style={{ color: "var(--faint)" }}>
              {formatDate(image.createdAt)}
            </p>
            <h1 className="mb-3 text-xl font-thin tracking-wide sm:text-2xl md:text-3xl" style={{ color: "var(--text)" }}>
              {image.title}
            </h1>
            {image.description && (
              <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "var(--muted)" }}>{image.description}</p>
            )}
          </div>

          <div className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
            <p className="mb-1 text-[9px] uppercase tracking-widest sm:text-[10px]" style={{ color: "var(--faint)" }}>Impressions</p>
            <p className="text-2xl font-thin sm:text-3xl" style={{ color: "var(--text)" }}>{comments.length}</p>
          </div>

          {/* Feedback Form */}
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-widest sm:mb-4 sm:text-[10px]" style={{ color: "var(--muted)" }}>
              Leave a note
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className={inpClass}
                style={inpStyle}
              />
              <textarea
                placeholder="Share your thoughts…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={3}
                required
                className={`${inpClass} resize-none`}
                style={inpStyle}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && <p className="text-xs text-green-700">Note posted. Thank you.</p>}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
                className="border py-2.5 text-[10px] uppercase tracking-widest transition-all disabled:opacity-40 sm:py-3 sm:text-xs"
                style={{ borderColor: "var(--text)", color: "var(--text)", background: "transparent" }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = "var(--text)"; b.style.color = "var(--bg)"; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "var(--text)"; }}
              >
                {submitting ? "Posting…" : "Post Note"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div>
          <p className="mb-6 text-[9px] uppercase tracking-[0.4em] sm:mb-8 sm:text-[10px]" style={{ color: "var(--faint)" }}>
            All Notes ({comments.length})
          </p>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {comments.map((comment) => (
              <div key={comment.id} className="py-5 sm:py-6">
                <div className="mb-2 flex items-start justify-between gap-4 sm:mb-3">
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{comment.name}</span>
                  <span className="shrink-0 text-[10px] sm:text-xs" style={{ color: "var(--faint)" }}>{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "var(--muted)" }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
