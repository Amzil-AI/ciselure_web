import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-url";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const posts = await prisma.socialPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        include: { image: true },
        take: 1,
      },
    },
  });

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                color: "var(--faint)",
                marginBottom: "8px",
              }}
            >
              Social & editorial
            </p>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 200,
                letterSpacing: "0.12em",
                color: "var(--text)",
              }}
            >
              Articles
            </h1>
          </div>
          <Link
            href="/articles/new"
            style={{
              border: "1px solid var(--text)",
              color: "var(--text)",
              padding: "10px 14px",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Create
          </Link>
        </div>

        <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "40px" }}>
          Create a post around a treatment, generate a caption + article, and link pictures to share.
        </p>

        {posts.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--faint)" }}>
            No articles yet.{" "}
            <Link href="/articles/new" style={{ color: "var(--muted)", textDecoration: "underline" }}>
              Create the first one
            </Link>
            .
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {posts.map((post) => {
              const cover = post.images[0]?.image;
              return (
                <Link
                  key={post.id}
                  href={`/articles/${post.id}`}
                  style={{ display: "block", textDecoration: "none" }}
                >
                  {cover && (
                    <div
                      style={{
                        width: "100%",
                        border: "1px solid var(--border)",
                        overflow: "hidden",
                        marginBottom: "14px",
                        background: "var(--bg-card)",
                      }}
                    >
                      <Image
                        src={getImageUrl(cover.filename)}
                        alt={post.title}
                        width={800}
                        height={800}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "var(--faint)",
                      marginBottom: "4px",
                    }}
                  >
                    {post.topic}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 300, color: "var(--text)" }}>{post.title}</p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginTop: "6px",
                      lineHeight: 1.6,
                    }}
                  >
                    {post.caption.slice(0, 140)}
                    {post.caption.length > 140 ? "…" : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
