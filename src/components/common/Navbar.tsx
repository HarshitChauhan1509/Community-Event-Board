'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Sparkles, Shield, Compass, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="w-full border-b border-border bg-surface/85 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="text-2xl font-display font-bold tracking-tight hover:opacity-85 transition-opacity"
        >
          Gather<span className="text-accent">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Events
          </Link>
          <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
            My Feed
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-accent hover:opacity-80 font-semibold transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Desktop User Status & Actions */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {loading ? (
            <div className="w-24 h-8 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-xs">
                {user.email} {user.isAdmin && <span className="text-accent font-semibold ml-1">(Admin)</span>}
              </span>
              <button
                onClick={() => logout()}
                className="border border-border px-3.5 py-1.5 rounded-md hover:bg-muted transition-colors text-xs cursor-pointer font-medium"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-foreground hover:text-accent transition-colors px-2 py-1 text-xs font-semibold uppercase tracking-wider"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-xs font-semibold uppercase tracking-wider"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-2 text-base font-medium text-foreground hover:text-accent transition-colors"
            >
              <Compass className="w-4 h-4 text-accent" />
              Discover Events
            </Link>
            <Link
              href="/feed"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 py-2 text-base font-medium text-foreground hover:text-accent transition-colors"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              My Feed
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-2 text-base font-semibold text-accent hover:opacity-85 transition-opacity"
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col space-y-3">
            {user ? (
              <>
                <div className="text-xs text-muted-foreground">
                  Signed in as <span className="text-foreground font-semibold">{user.email}</span>
                  {user.isAdmin && <span className="text-accent font-bold ml-1">(Admin)</span>}
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full py-2.5 rounded-lg border border-border text-center text-xs font-semibold uppercase tracking-wider hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-center text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
