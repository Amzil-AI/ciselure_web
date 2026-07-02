"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id: number;
  title: string;
  filename: string;
  createdAt: string;
  _count: { comments: number };
}


export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

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

      if (!res.ok) {
        setAuthError("Incorrect password.");
        return;
      }

      setAuthenticated(true);
    } catch {
      setAuthError("Could not verify password. Please try again.");
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

  useEffect(() => {
    if (authenticated) loadImages();
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
      if (!res.ok) throw new Error("Upload failed");
      setUploadSuccess("Image uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadImages();
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this image and all its comments?")) return;
    try {
      await fetch(`/api/images/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert("Failed to delete image.");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-[0.4em] text-stone-500 uppercase text-center mb-2">
            Admin Access
          </p>
          <h1 className="text-3xl font-light text-white text-center mb-8">
            Ciselure Studio
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
              autoFocus
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="w-full py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-stone-100 transition-colors disabled:opacity-40"
            >
              {loggingIn ? "Checking…" : "Enter Studio"}
            </button>
          </form>
          <p className="text-stone-700 text-xs text-center mt-6">
            Use the admin password set in your Railway environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.4em] text-stone-500 uppercase mb-1">Admin</p>
          <h1 className="text-3xl font-light text-white">Studio</h1>
        </div>
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-white transition-colors"
        >
          ← View gallery
        </Link>
      </div>

      {/* Upload Form */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 mb-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-stone-400 mb-6">
          Upload New Image
        </h2>
        <form onSubmit={handleUpload} className="space-y-5">
          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-white/20 transition-colors relative"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="max-h-56 w-auto object-contain rounded-lg"
                />
                <p className="text-stone-500 text-sm">{file?.name}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-stone-600 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-3 opacity-20">⊕</div>
                <p className="text-stone-500 text-sm">
                  Drag & drop an image, or click to browse
                </p>
                <p className="text-stone-700 text-xs mt-1">JPG, PNG, WEBP, GIF</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Image title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
            />
          </div>

          {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
          {uploadSuccess && <p className="text-emerald-400 text-xs">{uploadSuccess}</p>}

          <button
            type="submit"
            disabled={uploading || !file || !title.trim()}
            className="px-8 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading…" : "Upload to Gallery"}
          </button>
        </form>
      </div>

      {/* Existing Images */}
      <div>
        <h2 className="text-sm uppercase tracking-[0.2em] text-stone-400 mb-6">
          Manage Images ({images.length})
        </h2>
        {loadingImages ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="text-stone-600 text-sm">No images uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden"
              >
                <Link href={`/gallery/${img.id}`}>
                  <Image
                    src={`/api/uploads/${img.filename}`}
                    alt={img.title}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover group-hover:opacity-75 transition-opacity"
                  />
                </Link>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate">{img.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-stone-500 text-xs">
                      💬 {img._count.comments} comments
                    </span>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="text-xs text-stone-700 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
