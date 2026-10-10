import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Events Board",
  description: "Discover local events in your community.",
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
        <header className="w-full border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            <div className="text-xl font-display font-bold tracking-tight">
              Gather.
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#" className="text-foreground hover:text-accent transition-colors">Events</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">My Feed</a>
            </nav>
            <div className="flex items-center gap-4 text-sm font-medium">
              <button className="text-foreground hover:text-accent transition-colors">Log In</button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Sign Up
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="w-full border-t border-border bg-surface py-12 mt-auto">
          <div className="container mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
            &copy; 2026 Gather. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
