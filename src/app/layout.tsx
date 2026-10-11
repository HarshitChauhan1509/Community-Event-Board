import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/common/Navbar";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gather — Community Events Discovery",
  description: "Curated local events, workshops, and gatherings in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="w-full border-t border-border bg-surface py-16 mt-auto">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
              <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-12 border-b border-border">
                <div className="space-y-3 max-w-sm">
                  <div className="text-2xl font-display font-bold tracking-tight">
                    Gather<span className="text-accent">.</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A digital town square for local music, culture, and creative workshops across
                    India. Discover, customize, and never miss a gathering.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
                  <div className="space-y-3">
                    <span className="font-semibold uppercase tracking-wider text-foreground">
                      Explore
                    </span>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <Link href="/" className="hover:text-accent transition-colors">
                          Upcoming Events
                        </Link>
                      </li>
                      <li>
                        <Link href="/feed" className="hover:text-accent transition-colors">
                          Personalized Feed
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin" className="hover:text-accent transition-colors">
                          Admin Portal
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="font-semibold uppercase tracking-wider text-foreground">
                      Categories
                    </span>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <Link href="/?category=Music" className="hover:text-accent transition-colors">
                          Live Music
                        </Link>
                      </li>
                      <li>
                        <Link href="/?category=Workshop" className="hover:text-accent transition-colors">
                          Workshops
                        </Link>
                      </li>
                      <li>
                        <Link href="/?category=Food" className="hover:text-accent transition-colors">
                          Food & Tastings
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <span className="font-semibold uppercase tracking-wider text-foreground">
                      Account
                    </span>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <Link href="/login" className="hover:text-accent transition-colors">
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link href="/signup" className="hover:text-accent transition-colors">
                          Create Account
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
                <div>&copy; 2026 Gather Platform. Crafted with intentional editorial design.</div>
                <div className="flex items-center gap-6">
                  <span>Mumbai</span>
                  <span>Delhi</span>
                  <span>Bangalore</span>
                  <span>Pune</span>
                  <span>Chennai</span>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
