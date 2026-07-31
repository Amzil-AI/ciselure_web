"use client";

import { useState } from "react";

export default function CopyShareButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        border: "1px solid var(--text)",
        color: "var(--text)",
        background: "transparent",
        padding: "10px 20px",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        cursor: "pointer",
      }}
    >
      {copied ? "Copied!" : "Copy caption for social"}
    </button>
  );
}
