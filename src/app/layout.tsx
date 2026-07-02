import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Ciselure — AI Art Gallery",
  description: "A curated gallery of AI-generated artwork. Share your thoughts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased min-h-screen`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(247,243,238,0.92)", borderColor: "var(--border)", backdropFilter: "blur(8px)" }}>
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-xs font-light tracking-[0.35em] uppercase transition-opacity hover:opacity-60" style={{ color: "var(--text)" }}>
              Ciselure
            </Link>
            <nav className="flex items-center gap-8 text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>
              <Link href="/" className="transition-colors hover:text-[var(--text)]">Gallery</Link>
              <Link href="/admin" className="transition-colors hover:text-[var(--text)]">Admin</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="py-10 text-center text-[11px] tracking-widest uppercase border-t" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
          © {new Date().getFullYear()} Ciselure
        </footer>
      </body>
    </html>
  );
}
