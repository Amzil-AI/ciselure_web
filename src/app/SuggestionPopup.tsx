"use client";

import { useState } from "react";

export default function SuggestionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || null, content: content.trim() }),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      setName("");
      setContent("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch {
      setError("error");
    } finally {
      setSubmitting(false);
    }
  }

  const inpClass = "w-full border px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--text)]";
  const inpStyle = { background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "var(--text)",
          color: "var(--bg)",
          border: "1px solid var(--text)",
          padding: "12px 20px",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          cursor: "pointer",
          zIndex: 40,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        Suggérer une image
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "24px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              maxWidth: "400px",
              width: "100%",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted)" }}>
                Des idées pour de nouvelles images ?
              </p>
              <button
                onClick={() => setIsOpen(false)}
                style={{ fontSize: "18px", color: "var(--muted)", cursor: "pointer", border: "none", background: "transparent" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Votre nom (optionnel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                className={inpClass}
                style={inpStyle}
              />
              <textarea
                placeholder="Décrivez ce que vous aimeriez voir..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                rows={4}
                required
                className={`${inpClass} resize-none`}
                style={inpStyle}
              />
              {error && <p style={{ fontSize: "11px", color: "red" }}>Échec de l'envoi. Veuillez réessayer.</p>}
              {success && <p style={{ fontSize: "11px", color: "green" }}>Merci pour votre suggestion !</p>}
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                style={{
                  border: "1px solid var(--text)",
                  color: "var(--text)",
                  background: "transparent",
                  padding: "10px",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  opacity: (submitting || !content.trim()) ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting && content.trim()) {
                    e.currentTarget.style.background = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
