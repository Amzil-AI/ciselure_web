import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/lib/image-url";
import CopyShareButton from "./CopyShareButton";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.socialPost.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        include: { image: true },
      },
    },
  });

  if (!post) notFound();

  const shareText = `${post.caption}\n\n${post.hashtags ?? ""}`.trim();

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
        <Link
          href="/articles"
          style={{
            display: "inline-block",
            marginBottom: "28px",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          ← Articles
        </Link>

        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--faint)",
            marginBottom: "8px",
          }}
        >
          {post.topic}
        </p>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 200,
            letterSpacing: "0.06em",
            color: "var(--text)",
            marginBottom: "24px",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h1>

        {post.images.map((item) => (
          <div
            key={item.imageId}
            style={{
              width: "100%",
              border: "1px solid var(--border)",
              overflow: "hidden",
              marginBottom: "16px",
              background: "var(--bg-card)",
            }}
          >
            <Image
              src={getImageUrl(item.image.filename)}
              alt={item.image.title}
              width={800}
              height={800}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>{item.image.title}</span>
              <Link
                href={`/gallery/${item.image.id}`}
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--faint)",
                  textDecoration: "underline",
                }}
              >
                Gallery
              </Link>
            </div>
          </div>
        ))}

        <div
          style={{
            height: "1px",
            background: "var(--border)",
            margin: "28px 0",
          }}
        />

        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--faint)",
            marginBottom: "12px",
          }}
        >
          Caption
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text)",
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
            marginBottom: "16px",
          }}
        >
          {post.caption}
        </p>
        {post.hashtags && (
          <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "20px" }}>
            {post.hashtags}
          </p>
        )}

        <CopyShareButton text={shareText} />

        <div
          style={{
            height: "1px",
            background: "var(--border)",
            margin: "32px 0",
          }}
        />

        <p
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--faint)",
            marginBottom: "16px",
          }}
        >
          Article
        </p>
        <div
          style={{
            fontSize: "14px",
            color: "var(--text)",
            lineHeight: 1.85,
            whiteSpace: "pre-wrap",
          }}
        >
          {post.article}
        </div>
      </div>
    </div>
  );
}
