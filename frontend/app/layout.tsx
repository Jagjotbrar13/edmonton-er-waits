import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { NavLinks } from "@/components/NavLinks";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Edmonton ER Waits",
  description: "Current and predicted ER wait times for Edmonton hospitals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <header className="sticky top-0 z-10 bg-white/82 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-[-0.01em] text-slate-950">
              <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
                ER
              </span>
              Edmonton ER Waits
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
