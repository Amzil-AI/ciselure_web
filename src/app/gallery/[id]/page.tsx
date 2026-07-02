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

const inputClass = "w-full rounded-none border px-4 py-3 text-sm font-light outline-none transition-colors focus:border-[var(--text)]";
const inputStyle = { background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" };

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
      if (!res.ok) throw new Error("Failed");
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
      <div className="mx-auto max-w-6xl animate-pulse px-6 py-32">
        <div className="h-4 w-24 rounded" style={{ background: "var(--border)" }} />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-32 text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>Image not found.</p>
        <Link href="/" className="mt-4 inline-block text-xs uppercase tracking-widest underline" style={{ color: "var(--muted)" }}>
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity hover:opacity-60" style={{ color: "var(--muted)" }}>
        ← Gallery
      </Link>

      {/* Image + Info */}
      <div className="grid gap-12 md:grid-cols-5 mb-20">
        {/* Image */}
        <div className="md:col-span-3">
          <div className="overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <Image
              src={`/api/uploads/${image.filename}`}
              alt={image.title}
              width={1200}
              height={1200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--faint)" }}>
              {formatDate(image.createdAt)}
            </p>
            <h1 className="mb-4 text-2xl font-thin tracking-wide md:text-3xl" style={{ color: "var(--text)" }}>
              {image.title}
            </h1>
            {image.description && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{image.description}</p>
            )}
          </div>

          <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
            <p className="mb-1 text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>Impressions</p>
            <p className="text-3xl font-thin" style={{ color: "var(--text)" }}>{comments.length}</p>
          </div>

          {/* Feedback Form */}
          <div className="mt-auto">
            <p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>Leave a note</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className={inputClass}
                style={inputStyle}
              />
              <textarea
                placeholder="Share your thoughts…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={4}
                required
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && <p className="text-xs text-green-700">Note posted. Thank you.</p>}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
                className="border py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--text)", color: "var(--text)", background: "transparent" }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "var(--text)"; (e.target as HTMLButtonElement).style.color = "var(--bg)"; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "transparent"; (e.target as HTMLButtonElement).style.color = "var(--text)"; }}
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
          <p className="mb-8 text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--faint)" }}>
            All Notes ({comments.length})
          </p>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {comments.map((comment) => (
              <div key={comment.id} className="py-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{comment.name}</span>
                  <span className="text-xs" style={{ color: "var(--faint)" }}>{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
