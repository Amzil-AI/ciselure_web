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
      <div style={{ display: "flex", justifyContent: "center", padding: "128px 24px" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>
          <div style={{ height: "12px", width: "80px", borderRadius: "4px", background: "var(--border)" }} />
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: "16px" }}>
        <p style={{ fontSize: "13px", color: "var(--muted)" }}>Image not found.</p>
        <Link href="/" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)", textDecoration: "underline" }}>← Back</Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
      {/* Back */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-50 sm:mb-10 sm:text-xs"
        style={{ color: "var(--muted)" }}
      >
        ← Gallery
      </Link>

      {/* Image */}
      <div style={{ width: "100%", border: "1px solid var(--border)", overflow: "hidden", marginBottom: "20px" }}>
        <Image
          src={`/api/uploads/${image.filename}`}
          alt={image.title}
          width={800}
          height={800}
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </div>

      {/* Title + meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--text)" }}>{image.title}</p>
          {image.description && (
            <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px", lineHeight: 1.6 }}>{image.description}</p>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "10px", color: "var(--faint)" }}>{formatDate(image.createdAt)}</p>
          <p style={{ fontSize: "10px", color: "var(--faint)", marginTop: "2px" }}>{comments.length} {comments.length === 1 ? "note" : "notes"}</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />

      {/* Feedback Form */}
      <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)", marginBottom: "12px" }}>Leave a note</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
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
        {error && <p style={{ fontSize: "11px", color: "red" }}>{error}</p>}
        {success && <p style={{ fontSize: "11px", color: "green" }}>Note posted. Thank you.</p>}
        <button
          type="submit"
          disabled={submitting || !name.trim() || !content.trim()}
          style={{ border: "1px solid var(--text)", color: "var(--text)", background: "transparent", padding: "10px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", cursor: "pointer", opacity: (submitting || !name.trim() || !content.trim()) ? 0.4 : 1 }}
          onMouseEnter={e => { const b = e.currentTarget; b.style.background = "var(--text)"; b.style.color = "var(--bg)"; }}
          onMouseLeave={e => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "var(--text)"; }}
        >
          {submitting ? "Posting…" : "Post Note"}
        </button>
      </form>

      {/* Comments */}
      {comments.length > 0 && (
        <div>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--faint)", marginBottom: "16px" }}>
            All Notes ({comments.length})
          </p>
          {comments.map((comment, i) => (
            <div key={comment.id} style={{ borderTop: i === 0 ? "1px solid var(--border)" : undefined, paddingTop: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>{comment.name}</span>
                <span style={{ fontSize: "10px", color: "var(--faint)", flexShrink: 0 }}>{formatTime(comment.createdAt)}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7 }}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
