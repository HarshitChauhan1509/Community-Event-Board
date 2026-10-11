import React, { Suspense } from 'react';
import { requireAdminSession } from '@/lib/auth';
import { AdminEventList } from '@/components/admin/AdminEventList';
import { Spinner } from '@/components/common/LoadingState';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | Gather',
  description: 'Manage community events, categories, and visibility status.',
};

async function AdminProtectedContent() {
  const admin = await requireAdminSession();

  if (!admin) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center">
        <div className="p-10 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7 stroke-[1.75]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              403 — Admin Access Required
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This area is strictly restricted to platform administrators. Please sign in with an
              authorized administrator account.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Admin Sign In
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-muted text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminEventList />;
}

export default function AdminPage() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <Suspense
          fallback={
            <div className="py-24 flex flex-col items-center justify-center">
              <Spinner className="w-8 h-8 text-accent" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 font-semibold">
                Verifying administrative authorization...
              </p>
            </div>
          }
        >
          <AdminProtectedContent />
        </Suspense>
      </div>
    </div>
  );
}
