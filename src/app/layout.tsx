import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Ciselure — AI Art Gallery",
  description: "A curated gallery of AI-generated artwork. Share your thoughts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-stone-100 min-h-screen`}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-light tracking-[0.2em] text-stone-100 hover:text-white transition-colors uppercase">
              Ciselure
            </Link>
            <nav className="flex items-center gap-8 text-sm text-stone-400">
              <Link href="/" className="hover:text-white transition-colors tracking-wide">
                Gallery
              </Link>
            </nav>
          </div>
        </header>
        <main className="pt-16">
          {children}
        </main>
        <footer className="border-t border-white/5 mt-24 py-10 text-center text-stone-600 text-sm">
          <p>© {new Date().getFullYear()} Ciselure · AI-generated art</p>
        </footer>
      </body>
    </html>
  );
}
