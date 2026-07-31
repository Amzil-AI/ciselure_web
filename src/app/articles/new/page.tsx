import Link from "next/link";
import CreateArticleForm from "../CreateArticleForm";

export default function NewArticlePage() {
  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "96px" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
        <Link
          href="/articles"
          style={{
            display: "inline-block",
            marginBottom: "24px",
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
            letterSpacing: "0.35em",
            color: "var(--faint)",
            marginBottom: "8px",
          }}
        >
          Create
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 200,
            letterSpacing: "0.12em",
            color: "var(--text)",
            marginBottom: "28px",
          }}
        >
          New post
        </h1>

        <CreateArticleForm />
      </div>
    </div>
  );
}
