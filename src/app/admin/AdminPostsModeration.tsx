"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SocialPost {
  id: number;
  topic: string;
  title: string;
  createdAt: string;
  images: { imageId: number }[];
}

export default function AdminPostsModeration({ password }: { password: string }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);

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

  async function handleDelete(id: number) {
    if (!confirm("Delete this user post?")) return;
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      loadPosts();
    } catch {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="mt-10 sm:mt-14">
      <p className="mb-2 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
        Moderation
      </p>
      <h2 className="mb-2 text-xl font-thin tracking-widest" style={{ color: "var(--text)" }}>
        User posts
      </h2>
      <p className="mb-6 text-xs" style={{ color: "var(--muted)" }}>
        Users create posts on{" "}
        <Link href="/articles/new" className="underline">
          /articles/new
        </Link>
        . You can remove them here.
      </p>

      {loading ? (
        <p className="text-sm" style={{ color: "var(--faint)" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--faint)" }}>No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between gap-4 border p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--faint)" }}>
                  {post.topic}
                </p>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {post.title}
                </p>
                <p className="mt-1 text-[10px]" style={{ color: "var(--faint)" }}>
                  {post.images.length} pictures ·{" "}
                  <Link href={`/articles/${post.id}`} className="underline">
                    View
                  </Link>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="shrink-0 text-[10px] uppercase tracking-widest underline hover:text-red-500"
                style={{ color: "var(--muted)" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
