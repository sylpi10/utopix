import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Utopix — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="fr">
      <body className={`${inter.variable} bg-paper font-sans text-ink antialiased`}>
        {session && (
          <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/admin" className="font-semibold tracking-wide">
                Utopix — Administration
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-ink-soft">{session.email}</span>
                <LogoutButton />
              </div>
            </div>
          </header>
        )}
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
