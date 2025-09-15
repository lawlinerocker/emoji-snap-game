import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Emoji Snap Game",
  description:
    "Snap a pose that matches the emoji using your webcam or uploads",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200/50 sticky top-0 backdrop-blur bg-white/60 dark:bg-gray-900/60 z-10">
          <div className="container flex items-center gap-3 py-3">
            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
            <Link href="/" className="text-lg font-semibold">
              Emoji Snap Game
            </Link>
            <nav className="ml-auto flex items-center gap-2">
              <Link className="btn btn-ghost" href="/play">
                Play
              </Link>
              <Link className="btn btn-ghost" href="/history">
                History
              </Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
