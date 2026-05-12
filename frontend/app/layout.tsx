import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edmonton ER Waits",
  description: "Current and predicted ER wait times for Edmonton hospitals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
              <span className="flex size-9 items-center justify-center rounded-md bg-rose-600 text-sm font-bold text-white">
                ER
              </span>
              Edmonton ER Waits
            </Link>
            <div className="flex gap-2 text-sm text-slate-600">
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/compare">Compare</Link>
              <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/insights">Insights</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
