'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatEventDate, formatIndianPrice } from '@/lib/utils/format';
import { Spinner } from '@/components/common/LoadingState';
import { Sparkles, Check, AlertCircle, X, Palette, Lock } from 'lucide-react';
import Link from 'next/link';

export type CardTheme = 'editorial-cream' | 'midnight-ink' | 'terracotta-glow';

export interface StickerOption {
  id: string;
  emoji: string;
  label: string;
}

export const AVAILABLE_THEMES: { id: CardTheme; name: string; bgClass: string; textClass: string; borderClass: string }[] = [
  {
    id: 'editorial-cream',
    name: 'Editorial Cream',
    bgClass: 'bg-[#FAF8F5]',
    textClass: 'text-[#1E1E1E]',
    borderClass: 'border-[#E6E1DA]',
  },
  {
    id: 'midnight-ink',
    name: 'Midnight Ink',
    bgClass: 'bg-[#121214]',
    textClass: 'text-[#F5F5F7]',
    borderClass: 'border-[#2A2A2E]',
  },
  {
    id: 'terracotta-glow',
    name: 'Terracotta Glow',
    bgClass: 'bg-[#A34326]',
    textClass: 'text-[#FFF8F5]',
    borderClass: 'border-[#8B351C]',
  },
];

export const AVAILABLE_STICKERS: StickerOption[] = [
  { id: 'music', emoji: '🎵', label: 'Music Note' },
  { id: 'coffee', emoji: '☕', label: 'Coffee Cup' },
  { id: 'art', emoji: '🎨', label: 'Art Palette' },
  { id: 'spark', emoji: '⚡', label: 'Energy Spark' },
  { id: 'festival', emoji: '🎪', label: 'Gathering Tent' },
];

interface EventCardDesignerProps {
  eventId: string;
  event: {
    title: string;
    city: string;
    date: string;
    time: string;
    price: number;
    category: string;
    imageUrl: string;
  };
}

export function EventCardDesigner({ eventId, event }: EventCardDesignerProps) {
  const { user } = useAuth();

  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('editorial-cream');
  const [stickers, setStickers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [limitNotice, setLimitNotice] = useState<string | null>(null);

  // Restore saved design on mount
  useEffect(() => {
    async function loadSavedDesign() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/events/${eventId}/card-design`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setSelectedTheme(json.data.theme as CardTheme);
            setStickers(json.data.stickers || []);
          }
        }
      } catch (err) {
        console.error('Failed to load card design:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSavedDesign();
  }, [eventId, user]);

  const handleAddSticker = (emoji: string) => {
    setLimitNotice(null);
    setSaveStatus('idle');

    if (stickers.length >= 3) {
      setLimitNotice('Maximum 3 stickers allowed on your card.');
      setTimeout(() => setLimitNotice(null), 3000);
      return;
    }

    setStickers((prev) => [...prev, emoji]);
  };

  const handleRemoveSticker = (index: number) => {
    setLimitNotice(null);
    setSaveStatus('idle');
    setStickers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDesign = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setSaveStatus('saving');
      setStatusMessage('Saving...');

      const res = await fetch(`/api/events/${eventId}/card-design`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme,
          stickers,
        }),
      });

      if (!res.ok) {
        throw new Error('Unable to save design');
      }

      setSaveStatus('saved');
      setStatusMessage('Saved');
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Unable to save design');
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage(null);
      }, 4000);
    } finally {
      setSaving(false);
    }
  };

  const currentThemeConfig =
    AVAILABLE_THEMES.find((t) => t.id === selectedTheme) || AVAILABLE_THEMES[0];

  return (
    <section id="designer" className="w-full pt-16 pb-12 border-t border-border scroll-mt-20">
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Palette className="w-3.5 h-3.5" />
          Interactive Customization
        </div>
        <h2 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Design your card
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Personalize this event badge with custom editorial themes and collectible stickers.
          Live changes are previewed instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-6 space-y-8">
          {/* Theme Selector (Exactly 3 Themes) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Background Theme (3 Options)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setSaveStatus('idle');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'ring-2 ring-accent border-accent shadow-sm'
                        : 'border-border bg-surface hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-5 h-5 rounded-full border border-black/10 shadow-inner ${theme.bgClass}`}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium text-foreground leading-tight">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticker Selector (Exactly 5 Stickers, max 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Add Stickers ({stickers.length}/3)
              </label>
              <span className="text-xs text-muted-foreground">Tap sticker to add</span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {AVAILABLE_STICKERS.map((sticker) => {
                const isMax = stickers.length >= 3;
                return (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => handleAddSticker(sticker.emoji)}
                    disabled={isMax}
                    title={sticker.label}
                    className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isMax
                        ? 'opacity-40 cursor-not-allowed border-border bg-muted/40'
                        : 'border-border bg-surface hover:scale-105 hover:border-accent active:scale-95 shadow-xs'
                    }`}
                  >
                    <span className="text-2xl leading-none select-none">{sticker.emoji}</span>
                  </button>
                );
              })}
            </div>

            {/* Sticker limit notice */}
            {limitNotice && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" />
                {limitNotice}
              </p>
            )}

            {/* Placed Stickers Manager */}
            {stickers.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-muted-foreground block mb-2 font-medium">
                  Applied Stickers (tap to remove):
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {stickers.map((stk, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRemoveSticker(index)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 transition-all text-sm cursor-pointer group"
                    >
                      <span>{stk}</span>
                      <X className="w-3 h-3 text-muted-foreground group-hover:text-red-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar & Feedback */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {!user ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-4 h-4 text-accent shrink-0" />
                <span>
                  <Link href="/login" className="text-accent underline font-semibold">
                    Sign in
                  </Link>{' '}
                  to persist your customized card design across devices.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDesign}
                  disabled={saving || loading}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {saving ? <Spinner className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {saveStatus === 'saving'
                    ? 'Saving...'
                    : saveStatus === 'saved'
                    ? 'Saved'
                    : 'Save Design'}
                </button>

                {saveStatus === 'saved' && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Saved
                  </span>
                )}

                {saveStatus === 'error' && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {statusMessage || 'Unable to save design'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Interactive Card Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live Card Preview
              </span>
              <span className="text-[11px] text-accent font-medium">Real-time render</span>
            </div>

            {/* Customized Card Container with subtle animated transitions */}
            <div
              className={`w-full rounded-2xl p-6 border shadow-lg transition-all duration-500 relative overflow-hidden ${currentThemeConfig.bgClass} ${currentThemeConfig.textClass} ${currentThemeConfig.borderClass}`}
            >
              {/* Floating Live Stickers */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                {stickers.map((stk, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md shadow-xs flex items-center justify-center text-lg animate-in zoom-in-75 duration-300"
                  >
                    {stk}
                  </div>
                ))}
              </div>

              {/* Card Header Pill */}
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/10 dark:bg-white/10 backdrop-blur-xs mb-6">
                {event.category}
              </div>

              {/* Event Title & Metadata */}
              <div className="space-y-4 mb-6">
                <h3 className="text-2xl font-display font-bold leading-snug tracking-tight">
                  {event.title}
                </h3>
                <p className="text-xs opacity-80 font-medium">
                  {event.city} • {formatEventDate(event.date, event.time)}
                </p>
              </div>

              {/* Price & Gathering Badge */}
              <div className="pt-4 border-t border-current/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-70 block">
                    Access Pass
                  </span>
                  <span className="text-xl font-bold font-display">
                    {formatIndianPrice(event.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider opacity-70 block">
                    Platform
                  </span>
                  <span className="text-xs font-semibold tracking-wider">Gather.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
