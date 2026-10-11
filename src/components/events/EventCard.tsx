'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Bell, Check } from 'lucide-react';
import { formatEventDate, formatIndianPrice } from '@/lib/utils/format';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export interface EventItem {
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
  hasReminder?: boolean;
  remindersCount?: number;
}

interface EventCardProps {
  event: EventItem;
  onReminderToggle?: (eventId: string, nextState: boolean) => Promise<void>;
}

export function EventCard({ event, onReminderToggle }: EventCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [imgError, setImgError] = useState(false);
  const [isReminderSet, setIsReminderSet] = useState(Boolean(event.hasReminder));
  const [isTogglingReminder, setIsTogglingReminder] = useState(false);

  const handleReminderClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    if (isTogglingReminder) return;

    const previousState = isReminderSet;
    const nextState = !previousState;

    // Optimistic UI update
    setIsReminderSet(nextState);
    setIsTogglingReminder(true);

    try {
      if (onReminderToggle) {
        await onReminderToggle(event.id, nextState);
      } else {
        const res = await fetch(`/api/events/${event.id}/reminder`, {
          method: nextState ? 'POST' : 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to update reminder');
        }
      }
    } catch (err) {
      // Revert optimistic state on failure
      console.error('Reminder update error:', err);
      setIsReminderSet(previousState);
    } finally {
      setIsTogglingReminder(false);
    }
  };

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden border border-border bg-surface hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-md">
      <Link href={`/events/${event.id}`} className="block relative aspect-[16/10] overflow-hidden bg-muted">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-muted-foreground p-4 text-center">
            <span className="font-display font-medium text-lg">{event.category}</span>
            <span className="text-xs mt-1 text-muted-foreground/80">{event.city}</span>
          </div>
        ) : (
          <img
            src={event.imageUrl}
            alt={event.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        )}

        <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-foreground z-10 shadow-sm border border-border/50">
          {event.category}
        </div>

        <button
          onClick={handleReminderClick}
          disabled={isTogglingReminder}
          title={isReminderSet ? 'Remove reminder' : 'Set reminder'}
          aria-label={isReminderSet ? 'Remove reminder' : 'Set reminder'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer shadow-sm ${
            isReminderSet
              ? 'bg-accent text-white border border-accent'
              : 'bg-surface/85 text-muted-foreground hover:text-foreground border border-border/50 hover:bg-surface'
          }`}
        >
          {isReminderSet ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Bell className="w-3.5 h-3.5" />
          )}
        </button>
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-accent transition-colors leading-snug line-clamp-1">
              <Link href={`/events/${event.id}`}>
                {event.title}
              </Link>
            </h3>
            <span className="text-base font-semibold text-foreground shrink-0">
              {formatIndianPrice(event.price)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>{formatEventDate(event.date, event.time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{event.city}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
