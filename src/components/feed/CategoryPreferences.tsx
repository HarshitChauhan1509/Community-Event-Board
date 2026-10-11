'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { Spinner } from '@/components/common/LoadingState';

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryPreferencesProps {
  onSaved?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function CategoryPreferences({ onSaved, onClose, isModal = false }: CategoryPreferencesProps) {
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, favRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/me/favourites'),
        ]);

        if (catRes.ok) {
          const catJson = await catRes.json();
          setAllCategories(catJson.data || []);
        }

        if (favRes.ok) {
          const favJson = await favRes.json();
          const ids = (favJson.data || []).map((c: CategoryItem) => c.id);
          setSelectedIds(ids);
        }
      } catch (err) {
        console.error('Failed to load category preferences:', err);
        setError('Could not load categories.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch('/api/me/favourites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedIds }),
      });

      if (!res.ok) {
        throw new Error('Failed to save preferences');
      }

      setSuccessMessage('Your preferences have been saved!');
      if (onSaved) {
        onSaved();
      }
    } catch (err: any) {
      setError(err.message || 'Error updating preferences');
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Personalize Your Experience
          </div>
          <h3 className="text-2xl font-display font-semibold tracking-tight text-foreground">
            Favourite Categories
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select the types of events you care about most to curate your private feed.
          </p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="py-8 flex justify-center">
          <Spinner className="w-6 h-6 text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allCategories.map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/5 text-foreground shadow-xs'
                    : 'border-border bg-surface hover:border-zinc-400 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="font-medium text-sm text-foreground">{cat.name}</span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-accent text-white'
                      : 'border border-border bg-background'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {selectedIds.length} {selectedIds.length === 1 ? 'category' : 'categories'} selected
        </span>
        <div className="flex items-center gap-3">
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Spinner className="w-3.5 h-3.5" /> : null}
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-xs">
      {content}
    </div>
  );
}
