"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-url";

interface GalleryImage {
  id: number;
  title: string;
  filename: string;
  createdAt: string;
  _count: { comments: number };
}

interface Suggestion {
  id: number;
  name: string | null;
  content: string;
  createdAt: string;
}

const inp = "w-full border px-4 py-3 text-sm font-light outline-none transition-colors focus:border-[var(--text)] rounded-none";
const inpStyle = { background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setAuthError("Access denied."); return; }
      setAuthenticated(true);
    } catch {
      setAuthError("Could not verify. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  async function loadImages() {
    setLoadingImages(true);
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } finally {
      setLoadingImages(false);
    }
  }

  async function loadSuggestions() {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/suggestions", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadImages();
      loadSuggestions();
    }
  }, [authenticated]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    if (description.trim()) formData.append("description", description.trim());
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });
      if (!res.ok) throw new Error();
      setUploadSuccess("Uploaded successfully.");
      setTitle(""); setDescription(""); setFile(null); setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadImages();
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this image and all its notes?")) return;
    try {
      await fetch(`/api/images/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch { alert("Failed to delete."); }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: "320px", width: "100%", margin: "0 auto" }}>
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--faint)" }}>
            Admin Access
          </p>
          <h1 className="mb-8 text-center text-2xl font-thin tracking-widest" style={{ color: "var(--text)" }}>
            Ciselure Studio
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Studio access"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inp}
              style={inpStyle}
              autoFocus
            />
            {authError && <p className="text-xs text-red-500">{authError}</p>}
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="border py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--text)", color: "var(--text)" }}
            >
              {loggingIn ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
      <div className="mb-10 flex items-center justify-between border-b pb-6" style={{ borderColor: "var(--border)" }}>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--faint)" }}>Admin</p>
          <h1 className="text-2xl font-thin tracking-widest" style={{ color: "var(--text)" }}>Studio</h1>
        </div>
        <Link href="/" className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60" style={{ color: "var(--muted)" }}>
          ← Gallery
        </Link>
      </div>

      {/* Upload */}
      <div className="mb-10 border p-4 sm:mb-14 sm:p-8" style={{ borderColor: "var(--border)" }}>
        <p className="mb-6 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>Upload New Image</p>
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div
            className="cursor-pointer border-2 border-dashed p-8 text-center transition-colors"
            style={{ borderColor: "var(--border)" }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <Image src={preview} alt="Preview" width={400} height={300} className="max-h-52 w-auto object-contain" />
                <p className="text-xs" style={{ color: "var(--muted)" }}>{file?.name}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-xs underline" style={{ color: "var(--faint)" }}
                >Remove</button>
              </div>
            ) : (
              <>
                <p className="text-sm font-light" style={{ color: "var(--muted)" }}>Drag & drop or click to browse</p>
                <p className="mt-1 text-xs" style={{ color: "var(--faint)" }}>JPG · PNG · WEBP · GIF</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <input type="text" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} required className={inp} style={inpStyle} />
            <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className={inp} style={inpStyle} />
          </div>

          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          {uploadSuccess && <p className="text-xs text-green-700">{uploadSuccess}</p>}

          <div>
            <button
              type="submit"
              disabled={uploading || !file || !title.trim()}
              className="border px-10 py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--text)", color: "var(--text)" }}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </div>

      {/* Manage */}
      <div>
        <p className="mb-6 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
          Manage Images ({images.length})
        </p>
        {loadingImages ? (
          <div className="grid grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse" style={{ background: "var(--bg-card)" }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--faint)" }}>No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 md:grid-cols-4" style={{ background: "var(--border)" }}>
            {images.map((img) => (
              <div key={img.id} className="group relative" style={{ background: "var(--bg)" }}>
                <Link href={`/gallery/${img.id}`}>
                  <Image
                    src={getImageUrl(img.filename)}
                    alt={img.title}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </Link>
                <div className="px-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="truncate text-xs font-light" style={{ color: "var(--text)" }}>{img.title}</p>
                  <div className="mt-1 flex justify-between text-xs" style={{ color: "var(--faint)" }}>
                    <span>{img._count.comments} notes</span>
                    <button onClick={() => handleDelete(img.id)} className="underline hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Suggestions */}
      <div className="mt-10 sm:mt-14">
        <p className="mb-6 text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
          User Suggestions ({suggestions.length})
        </p>
        {loadingSuggestions ? (
          <div style={{ padding: "16px", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--faint)" }}>Loading...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--faint)" }}>No suggestions yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                style={{
                  border: "1px solid var(--border)",
                  padding: "16px",
                  background: "var(--bg-card)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)" }}>
                    {suggestion.name || "Anonymous"}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--faint)" }}>
                    {new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
                  {suggestion.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
