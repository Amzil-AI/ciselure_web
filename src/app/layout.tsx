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
      <body className={`${geist.variable} antialiased bg-[#0a0a0a] text-stone-100 min-h-screen`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/[0.04]">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="text-xs font-light tracking-[0.35em] text-stone-400 hover:text-white transition-colors uppercase"
            >
              Ciselure
            </Link>
            <nav className="flex items-center gap-8 text-xs tracking-widest text-stone-600 uppercase">
              <Link href="/" className="hover:text-white transition-colors">Gallery</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-white/[0.04] py-8 text-center text-[11px] tracking-widest text-stone-700 uppercase">
          © {new Date().getFullYear()} Ciselure
        </footer>
      </body>
    </html>
  );
}
