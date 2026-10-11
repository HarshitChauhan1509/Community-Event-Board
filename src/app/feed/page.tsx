'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { EventCard, EventItem } from '@/components/events/EventCard';
import { CategoryPreferences } from '@/components/feed/CategoryPreferences';
import { EventGridSkeleton, Spinner } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Sparkles, SlidersHorizontal, LogIn } from 'lucide-react';

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [favouriteCategories, setFavouriteCategories] = useState<string[]>([]);
  const [hasFavourites, setHasFavourites] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const fetchFeed = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/feed');
      if (!res.ok) {
        throw new Error('Failed to load your personal feed');
      }

      const json = await res.json();
      setEvents(json.data || []);
      setHasFavourites(Boolean(json.hasFavourites));
      setFavouriteCategories(json.favouriteCategories || []);
    } catch (err: any) {
      setError(err.message || 'Error loading personalized feed');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFeed();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchFeed]);

  // State 1: Authentication is loading
  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-28">
        <Spinner className="w-8 h-8 text-accent" />
      </div>
    );
  }

  // State 2: Visitor is not signed in
  if (!user) {
    return (
      <div className="container mx-auto px-4 md:px-8 max-w-xl py-24 text-center">
        <div className="p-10 rounded-2xl border border-border bg-surface shadow-xs space-y-6">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Sign in to view your feed
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personalized feed curates upcoming events based on your favourite categories.
              Sign in or create a free account to continue.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border hover:bg-muted font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Feed Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored For You
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight">
              My Feed
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Upcoming events matching your favourite categories, sorted nearest date first.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-muted text-xs font-semibold uppercase tracking-wider text-foreground transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
              Edit Preferences
            </button>
          </div>
        </div>

        {/* Selected Categories Indicator */}
        {hasFavourites && favouriteCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-muted-foreground">
            <span className="font-medium">Curating by:</span>
            {favouriteCategories.map((name) => (
              <span
                key={name}
                className="px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-xs border border-accent/20"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Feed Content States */}
        {loading ? (
          <EventGridSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFeed} />
        ) : !hasFavourites ? (
          // State 3: User has no favourite categories selected
          <div className="max-w-2xl mx-auto py-8">
            <EmptyState
              title="Choose your favourite categories"
              description="You haven’t selected any favourite categories yet. Select at least one category to curate your personalized event feed."
              actionText="Choose Categories"
              onAction={() => setShowPreferencesModal(true)}
            />
          </div>
        ) : events.length === 0 ? (
          // State 4: User has favourite categories, but no upcoming events match
          <div className="max-w-2xl mx-auto py-8">
            <EmptyState
              title="No upcoming events match your preferences"
              description={`There are currently no upcoming events scheduled for your selected categories (${favouriteCategories.join(
                ', '
              )}). Check back soon or add more categories to your preferences.`}
              actionText="Adjust Preferences"
              onAction={() => setShowPreferencesModal(true)}
            />
          </div>
        ) : (
          // State 5: Displaying curated events
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Preferences Modal */}
        {showPreferencesModal && (
          <CategoryPreferences
            isModal
            onClose={() => setShowPreferencesModal(false)}
            onSaved={() => {
              setShowPreferencesModal(false);
              fetchFeed();
            }}
          />
        )}
      </div>
    </div>
  );
}
