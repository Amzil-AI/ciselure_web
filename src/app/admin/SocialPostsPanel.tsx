"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-url";
import { draftFromTopic } from "@/lib/social-draft";

interface GalleryImage {
  id: number;
  title: string;
  filename: string;
}

interface SocialPost {
  id: number;
  topic: string;
  title: string;
  caption: string;
  article: string;
  hashtags: string | null;
  createdAt: string;
  images: { imageId: number; sortOrder: number; image: GalleryImage }[];
}

const inp =
  "w-full border px-4 py-3 text-sm font-light outline-none transition-colors focus:border-[var(--text)] rounded-none";
const inpStyle = {
  background: "var(--bg)",
  borderColor: "var(--border)",
  color: "var(--text)",
};

export default function SocialPostsPanel({
  password,
  galleryImages,
}: {
  password: string;
  galleryImages: GalleryImage[];
}) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [article, setArticle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState("");

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTopic("");
    setTitle("");
    setCaption("");
    setArticle("");
    setHashtags("");
    setSelectedImageIds([]);
    setError("");
    setSuccess("");
  }

  function fillDraft() {
    if (!topic.trim()) {
      setError("Enter a topic first (e.g. Hydrafacial).");
      return;
    }
    const draft = draftFromTopic(topic);
    setTitle(draft.title);
    setCaption(draft.caption);
    setArticle(draft.article);
    setHashtags(draft.hashtags);
    setError("");
    setSuccess("Draft filled — edit it, pick pictures, then save.");
  }

  function toggleImage(id: number) {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function startEdit(post: SocialPost) {
    setEditingId(post.id);
    setTopic(post.topic);
    setTitle(post.title);
    setCaption(post.caption);
    setArticle(post.article);
    setHashtags(post.hashtags ?? "");
    setSelectedImageIds(post.images.map((i) => i.imageId));
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !title.trim() || !caption.trim() || !article.trim()) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const body = {
      topic: topic.trim(),
      title: title.trim(),
      caption: caption.trim(),
      article: article.trim(),
      hashtags: hashtags.trim() || null,
      imageIds: selectedImageIds,
    };

    try {
      const res = await fetch(editingId ? `/api/posts/${editingId}` : "/api/posts", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setSuccess(editingId ? "Post updated." : "Post created.");
      resetForm();
      loadPosts();
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this social post?")) return;
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      if (editingId === id) resetForm();
      loadPosts();
    } catch {
      alert("Failed to delete.");
    }
  }

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setError("Could not copy.");
    }
  }

  return (
    <div className="mt-10 sm:mt-14">
      <div className="mb-6 flex items-end justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
            Social
          </p>
          <h2 className="text-xl font-thin tracking-widest" style={{ color: "var(--text)" }}>
            Posts & Articles
          </h2>
        </div>
        <Link
          href="/articles"
          className="text-[10px] uppercase tracking-widest transition-opacity hover:opacity-60"
          style={{ color: "var(--muted)" }}
        >
          View public →
        </Link>
      </div>

      <p className="mb-6 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        Create content around a treatment (e.g. Hydrafacial): generate a draft article + social caption,
        attach gallery pictures, then share or copy for Instagram / LinkedIn.
      </p>

      <form
        onSubmit={handleSave}
        className="mb-10 border p-4 sm:p-6"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <p className="mb-4 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
          {editingId ? `Editing #${editingId}` : "New post"}
        </p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Topic — e.g. Hydrafacial"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className={inp}
            style={inpStyle}
          />
          <button
            type="button"
            onClick={fillDraft}
            className="shrink-0 border px-4 py-3 text-[10px] uppercase tracking-widest transition-colors"
            style={{ borderColor: "var(--text)", color: "var(--text)" }}
          >
            Fill draft
          </button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inp}
            style={inpStyle}
          />
        </div>

        <div className="mb-3">
          <label className="mb-2 block text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
            Social caption
          </label>
          <textarea
            placeholder="Short caption for Instagram / LinkedIn…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
            rows={4}
            className={`${inp} resize-none`}
            style={inpStyle}
          />
        </div>

        <div className="mb-3">
          <label className="mb-2 block text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
            Article
          </label>
          <textarea
            placeholder="Longer article text…"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            required
            rows={8}
            className={`${inp} resize-none`}
            style={inpStyle}
          />
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Hashtags — #hydrafacial #skincare"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className={inp}
            style={inpStyle}
          />
        </div>

        <p className="mb-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Link pictures ({selectedImageIds.length} selected)
        </p>
        {galleryImages.length === 0 ? (
          <p className="mb-5 text-xs" style={{ color: "var(--faint)" }}>
            Upload images above first, then link them here.
          </p>
        ) : (
          <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {galleryImages.map((img) => {
              const selected = selectedImageIds.includes(img.id);
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => toggleImage(img.id)}
                  className="relative overflow-hidden border text-left"
                  style={{
                    borderColor: selected ? "var(--text)" : "var(--border)",
                    outline: selected ? "2px solid var(--text)" : "none",
                    outlineOffset: "-2px",
                  }}
                >
                  <Image
                    src={getImageUrl(img.filename)}
                    alt={img.title}
                    width={200}
                    height={200}
                    className="aspect-square w-full object-cover"
                  />
                  <span
                    className="block truncate px-1.5 py-1 text-[9px]"
                    style={{ color: "var(--muted)", background: "var(--bg)" }}
                  >
                    {img.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
        {success && <p className="mb-3 text-xs text-green-700">{success}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="border px-8 py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
            style={{ borderColor: "var(--text)", color: "var(--text)" }}
          >
            {saving ? "Saving…" : editingId ? "Update post" : "Publish post"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 text-xs uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <p className="mb-4 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
        Your posts ({posts.length})
      </p>

      {loading ? (
        <p className="text-sm" style={{ color: "var(--faint)" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--faint)" }}>No social posts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border p-4"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
                    {post.topic}
                  </p>
                  <p className="text-sm font-light" style={{ color: "var(--text)" }}>
                    {post.title}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                  <Link href={`/articles/${post.id}`} className="underline hover:opacity-60">
                    Open
                  </Link>
                  <button type="button" onClick={() => startEdit(post)} className="underline hover:opacity-60">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        `cap-${post.id}`,
                        `${post.caption}\n\n${post.hashtags ?? ""}`.trim()
                      )
                    }
                    className="underline hover:opacity-60"
                  >
                    {copied === `cap-${post.id}` ? "Copied!" : "Copy caption"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="underline hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {post.caption}
              </p>
              {post.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {post.images.map((item) => (
                    <Image
                      key={item.imageId}
                      src={getImageUrl(item.image.filename)}
                      alt={item.image.title}
                      width={72}
                      height={72}
                      className="h-16 w-16 shrink-0 object-cover"
                      style={{ border: "1px solid var(--border)" }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
