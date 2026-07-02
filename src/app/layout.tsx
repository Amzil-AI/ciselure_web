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
        <header
          className="fixed left-0 right-0 top-0 z-50 border-b"
          style={{ background: "rgba(247,243,238,0.93)", borderColor: "var(--border)", backdropFilter: "blur(10px)" }}
        >
          <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:h-14 sm:px-6">
            <Link
              href="/"
              className="text-[10px] font-light tracking-[0.4em] uppercase transition-opacity hover:opacity-50 sm:text-xs"
              style={{ color: "var(--text)" }}
            >
              Ciselure
            </Link>
            <nav className="flex items-center gap-5 text-[10px] tracking-widest uppercase sm:gap-8 sm:text-xs" style={{ color: "var(--muted)" }}>
              <Link href="/" className="transition-opacity hover:opacity-70">Gallery</Link>
              <Link href="/admin" className="transition-opacity hover:opacity-70">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="w-full">{children}</main>

        <footer
          className="mt-4 border-t py-8 text-center text-[10px] tracking-widest uppercase sm:py-10 sm:text-[11px]"
          style={{ borderColor: "var(--border)", color: "var(--faint)" }}
        >
          © {new Date().getFullYear()} Ciselure
        </footer>
      </body>
    </html>
  );
}
