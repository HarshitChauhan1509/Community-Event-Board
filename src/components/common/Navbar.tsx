'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold tracking-tight hover:opacity-80 transition-opacity">
          Gather<span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Events
          </Link>
          <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
            My Feed
          </Link>
          {user?.isAdmin && (
            <Link href="/admin" className="text-accent hover:opacity-80 font-semibold transition-colors">
              Admin Portal
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          {loading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hidden sm:inline text-xs">
                {user.email} {user.isAdmin && <span className="text-accent font-semibold">(Admin)</span>}
              </span>
              <button
                onClick={() => logout()}
                className="border border-border px-3.5 py-1.5 rounded-md hover:bg-muted transition-colors text-xs cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-foreground hover:text-accent transition-colors px-2 py-1"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-xs"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
