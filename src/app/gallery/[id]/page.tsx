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
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
        if (data.id) {
          setImage(data);
          setComments(data.comments ?? []);
        }
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
      setName("");
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to post feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-white/5 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        <p className="text-stone-500 text-xl">Image not found.</p>
        <Link href="/" className="mt-4 inline-block text-stone-400 hover:text-white transition-colors">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-white transition-colors text-sm mb-10 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to gallery
      </Link>

      {/* Image + Info */}
      <div className="grid md:grid-cols-5 gap-12 mb-16">
        {/* Image */}
        <div className="md:col-span-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
            <Image
              src={`/uploads/${image.filename}`}
              alt={image.title}
              width={1200}
              height={1200}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col">
          <div className="mb-2">
            <p className="text-xs tracking-[0.3em] text-stone-500 uppercase mb-3">
              {formatDate(image.createdAt)}
            </p>
            <h1 className="text-3xl md:text-4xl font-light text-white leading-tight mb-4">
              {image.title}
            </h1>
            {image.description && (
              <p className="text-stone-400 leading-relaxed text-base">{image.description}</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Comments</p>
            <p className="text-2xl font-light text-white">{comments.length}</p>
          </div>

          {/* Feedback Form */}
          <div className="mt-auto pt-10">
            <h2 className="text-sm uppercase tracking-[0.2em] text-stone-400 mb-5">
              Leave Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
              <textarea
                placeholder="Share your thoughts on this piece…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={4}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors text-sm resize-none"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              {success && (
                <p className="text-emerald-400 text-xs">Feedback posted! Thank you.</p>
              )}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
                className="w-full py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting…" : "Post Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-8">
            All Feedback ({comments.length})
          </h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center text-xs font-medium text-stone-300">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm">{comment.name}</span>
                  </div>
                  <span className="text-stone-600 text-xs">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
