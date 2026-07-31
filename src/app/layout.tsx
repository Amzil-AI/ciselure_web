import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SuggestionPopup from "./SuggestionPopup";
import { CLINIC } from "@/lib/clinic";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: `${CLINIC.name} — Galerie & contenu`,
  description: `Outil galerie et création de contenu pour le Centre de ${CLINIC.name} à ${CLINIC.city}. Images, articles et posts réseaux sociaux.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} antialiased min-h-screen`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        <header
          className="fixed left-0 right-0 top-0 z-50 border-b"
          style={{ background: "rgba(247,243,238,0.93)", borderColor: "var(--border)", backdropFilter: "blur(10px)" }}
        >
          <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:h-14 sm:px-6">
            <Link
              href="/"
              className="text-[10px] font-light tracking-[0.35em] uppercase transition-opacity hover:opacity-50 sm:text-xs"
              style={{ color: "var(--text)" }}
            >
              {CLINIC.shortName}
            </Link>
            <nav className="flex items-center gap-4 text-[10px] tracking-widest uppercase sm:gap-7 sm:text-xs" style={{ color: "var(--muted)" }}>
              <Link href="/" className="transition-opacity hover:opacity-70">Galerie</Link>
              <Link href="/articles" className="transition-opacity hover:opacity-70">Articles</Link>
              <Link href="/articles/new" className="transition-opacity hover:opacity-70">Créer</Link>
              <a
                href={CLINIC.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                Site
              </a>
              <Link href="/admin" className="transition-opacity hover:opacity-70">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="w-full">{children}</main>

        <footer
          className="mt-4 border-t py-8 text-center sm:py-10"
          style={{ borderColor: "var(--border)", color: "var(--faint)" }}
        >
          <p className="text-[10px] tracking-widest uppercase sm:text-[11px]">
            © {new Date().getFullYear()} {CLINIC.name}
          </p>
          <p className="mt-2 text-[10px] sm:text-[11px]" style={{ color: "var(--muted)" }}>
            {CLINIC.address} · {CLINIC.phone}
          </p>
          <a
            href={CLINIC.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[10px] uppercase tracking-widest underline sm:text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            medecinesthetiqueciselure.fr
          </a>
        </footer>

        <SuggestionPopup />
      </body>
    </html>
  );
}
