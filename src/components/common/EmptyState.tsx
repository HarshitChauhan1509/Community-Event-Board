import React from 'react';
import { CalendarX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No events found',
  description = 'We couldn’t find any events matching your selected filters. Try broadening your search or resetting filters.',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-surface/50">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        <CalendarX className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-border bg-surface hover:bg-muted transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionText}
        </button>
      )}
    </div>
  );
}
