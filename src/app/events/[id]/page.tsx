'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Bell, Check, Sparkles } from 'lucide-react';
import { formatEventDate, formatIndianPrice } from '@/lib/utils/format';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

interface EventDetails {
  id: string;
  title: string;
  city: string;
  date: string;
  time: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  category: string;
  categoryId: string;
  hasReminder: boolean;
  remindersCount: number;
  customDesign?: {
    theme: string;
    stickers: string[];
  } | null;
}

function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReminder, setHasReminder] = useState(false);
  const [isTogglingReminder, setIsTogglingReminder] = useState(false);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('This event does not exist or has been removed.');
          }
          throw new Error('Failed to load event details.');
        }

        const data = await res.json();
        setEvent(data.data);
        setHasReminder(Boolean(data.data.hasReminder));
      } catch (err: any) {
        setError(err.message || 'Error loading event.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    }
  }, [id]);

  const handleReminderToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isTogglingReminder || !event) return;

    const previousState = hasReminder;
    const nextState = !previousState;

    // 1. Immediate optimistic UI update
    setHasReminder(nextState);
    setIsTogglingReminder(true);
    setReminderError(null);

    try {
      const res = await fetch(`/api/events/${event.id}/reminder`, {
        method: nextState ? 'POST' : 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Unable to save reminder');
      }
    } catch (err: any) {
      console.error(err);
      // 2. Revert optimistic state on failure
      setHasReminder(previousState);
      setReminderError(err.message || 'Unable to save reminder');
      setTimeout(() => setReminderError(null), 3500);
    } finally {
      setIsTogglingReminder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-28">
        <Spinner className="w-8 h-8 text-accent" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 font-semibold">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl">
        <ErrorState
          title="Event Not Found"
          message={error || 'We could not find the event you are looking for.'}
          onRetry={() => router.push('/')}
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      {/* Top Navigation */}
      <div className="border-b border-border bg-surface/50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all events
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Visual Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
              {imgError ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                  <span className="text-2xl font-display">{event.category}</span>
                  <span className="text-sm mt-1">{event.city}</span>
                </div>
              ) : (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-foreground border border-border/60">
                {event.category}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold tracking-tight">About this Experience</h2>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Details & Actions Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl border border-border bg-surface shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {event.city} • {event.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground leading-tight">
                  {event.title}
                </h1>
              </div>

              <div className="text-3xl font-display font-semibold text-foreground pt-2">
                {formatIndianPrice(event.price)}
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{formatEventDate(event.date)}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{event.city}</div>
                    <div className="text-xs text-muted-foreground">Local venue / Gathering spot</div>
                  </div>
                </div>
              </div>

              {/* Reminder Action */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleReminderToggle}
                  disabled={isTogglingReminder}
                  className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    hasReminder
                      ? 'bg-accent text-white hover:opacity-90'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {isTogglingReminder ? (
                    <>
                      <Spinner className="w-4 h-4" />
                      Reminding...
                    </>
                  ) : hasReminder ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      Reminder set
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Remind me
                    </>
                  )}
                </button>

                {reminderError && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center mt-2.5">
                    {reminderError}
                  </p>
                )}

                <p className="text-[11px] text-muted-foreground text-center mt-2.5">
                  {hasReminder
                    ? 'Reminder saved! You can view this on your personal feed.'
                    : 'Save this event to your personal reminders list.'}
                </p>
              </div>

              {/* Card Designer CTA anchor */}
              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs font-medium">Design your custom event card</span>
                </div>
                <Link
                  href={`/events/${event.id}#designer`}
                  className="text-xs font-semibold text-accent hover:underline shrink-0"
                >
                  Customize →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-28">
          <Spinner className="w-8 h-8 text-accent" />
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}
