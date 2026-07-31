"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/image-url";
import {
  isDirectCloudinaryUploadEnabled,
  uploadImageToCloudinary,
} from "@/lib/upload-client";

interface GalleryImage {
  id: number;
  title: string;
  filename: string;
}

interface UploadedPicture {
  id: string;
  preview: string;
  url: string;
  name: string;
}

const inp =
  "w-full border px-4 py-3 text-sm font-light outline-none transition-colors focus:border-[var(--text)] rounded-none";
const inpStyle = {
  background: "var(--bg)",
  borderColor: "var(--border)",
  color: "var(--text)",
};

export default function CreateArticleForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [article, setArticle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [uploadedPictures, setUploadedPictures] = useState<UploadedPicture[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setGalleryImages(Array.isArray(data) ? data : []))
      .catch(() => setGalleryImages([]));
  }, []);

  function toggleImage(id: number) {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function removeUploaded(id: string) {
    setUploadedPictures((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (!isDirectCloudinaryUploadEnabled()) {
      setError("Le téléversement d’images n’est pas encore configuré.");
      return;
    }

    setUploadingFiles(true);
    setError("");
    try {
      const next: UploadedPicture[] = [];
      for (const file of files.slice(0, 8)) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadImageToCloudinary(file);
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          preview: URL.createObjectURL(file),
          url,
          name: file.name,
        });
      }
      setUploadedPictures((prev) => [...prev, ...next].slice(0, 8));
      setSuccess(`${next.length} image${next.length === 1 ? "" : "s"} ajoutée${next.length === 1 ? "" : "s"}.`);
    } catch {
      setError("Impossible d’ajouter les images. Réessayez.");
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function generateDraft() {
    if (!topic.trim()) {
      setError("Indiquez d’abord un sujet (ex. Hydrafacial).");
      return;
    }
    setGenerating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/posts/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTitle(data.title ?? "");
      setCaption(data.caption ?? "");
      setArticle(data.article ?? "");
      setHashtags(data.hashtags ?? "");
      setSuccess("Brouillon prêt — modifiez-le, ajoutez des photos, puis publiez.");
    } catch {
      setError("Impossible de générer le brouillon. Réessayez.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !title.trim() || !caption.trim() || !article.trim()) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          title: title.trim(),
          caption: caption.trim(),
          article: article.trim(),
          hashtags: hashtags.trim() || null,
          imageIds: selectedImageIds,
          newImages: uploadedPictures.map((p) => ({
            title: title.trim() || topic.trim(),
            imageUrl: p.url,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(`/articles/${data.id}`);
    } catch {
      setError("Impossible de publier. Réessayez.");
      setSaving(false);
    }
  }

  const pictureCount = selectedImageIds.length + uploadedPictures.length;

  return (
    <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "8px" }}>
        Indiquez un soin ou une idée (ex. Hydrafacial), générez une légende + un article en français avec l’IA,
        puis ajoutez vos photos ou choisissez-en dans la galerie.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Sujet — ex. Hydrafacial"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className={inp}
          style={inpStyle}
        />
        <button
          type="button"
          onClick={generateDraft}
          disabled={generating}
          style={{
            border: "1px solid var(--text)",
            color: "var(--text)",
            background: "transparent",
            padding: "12px",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            cursor: "pointer",
            opacity: generating ? 0.4 : 1,
          }}
        >
          {generating ? "Génération…" : "Générer avec l’IA"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={inp}
        style={inpStyle}
      />

      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--faint)", marginBottom: "8px" }}>
          Légende réseaux sociaux
        </p>
        <textarea
          placeholder="Légende pour Instagram / LinkedIn…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          rows={4}
          className={`${inp} resize-none`}
          style={inpStyle}
        />
      </div>

      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--faint)", marginBottom: "8px" }}>
          Article
        </p>
        <textarea
          placeholder="Article plus long…"
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          required
          rows={8}
          className={`${inp} resize-none`}
          style={inpStyle}
        />
      </div>

      <input
        type="text"
        placeholder="Hashtags — #hydrafacial #soin"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        className={inp}
        style={inpStyle}
      />

      {/* Upload new pictures */}
      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)", marginBottom: "10px" }}>
          Ajouter des images ({pictureCount})
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingFiles || uploadedPictures.length >= 8}
          style={{
            width: "100%",
            border: "1px dashed var(--border)",
            background: "var(--bg-card)",
            padding: "28px 16px",
            cursor: "pointer",
            marginBottom: "12px",
            opacity: uploadingFiles ? 0.5 : 1,
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            {uploadingFiles ? "Téléversement…" : "Cliquez pour ajouter des images"}
          </p>
          <p style={{ fontSize: "11px", color: "var(--faint)", marginTop: "4px" }}>
            JPG · PNG · WEBP · GIF — jusqu’à 8
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          style={{ display: "none" }}
        />

        {uploadedPictures.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
            {uploadedPictures.map((pic) => (
              <div
                key={pic.id}
                style={{
                  position: "relative",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pic.preview}
                  alt={pic.name}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(pic.id)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    border: "none",
                    background: "rgba(44,37,32,0.75)",
                    color: "#fff",
                    fontSize: "10px",
                    padding: "4px 6px",
                    cursor: "pointer",
                  }}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--faint)", marginBottom: "10px" }}>
          Ou choisir dans la galerie
        </p>
        {galleryImages.length === 0 ? (
          <p style={{ fontSize: "12px", color: "var(--faint)" }}>Pas encore d’images dans la galerie.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {galleryImages.map((img) => {
              const selected = selectedImageIds.includes(img.id);
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => toggleImage(img.id)}
                  style={{
                    border: selected ? "2px solid var(--text)" : "1px solid var(--border)",
                    padding: 0,
                    background: "var(--bg)",
                    cursor: "pointer",
                    overflow: "hidden",
                    textAlign: "left",
                  }}
                >
                  <Image
                    src={getImageUrl(img.filename)}
                    alt={img.title}
                    width={200}
                    height={200}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                  />
                  <span
                    style={{
                      display: "block",
                      fontSize: "9px",
                      padding: "4px 6px",
                      color: "var(--muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {img.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <p style={{ fontSize: "12px", color: "red" }}>{error}</p>}
      {success && <p style={{ fontSize: "12px", color: "green" }}>{success}</p>}

      <button
        type="submit"
        disabled={saving || uploadingFiles}
        style={{
          border: "1px solid var(--text)",
          color: "var(--text)",
          background: "transparent",
          padding: "12px",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          cursor: "pointer",
          opacity: saving || uploadingFiles ? 0.4 : 1,
        }}
      >
        {saving ? "Publication…" : "Publier"}
      </button>
    </form>
  );
}
