import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to load events',
  message = 'An unexpected error occurred while fetching data. Please check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center rounded-2xl border border-red-500/20 bg-red-500/5">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
        <AlertCircle className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
