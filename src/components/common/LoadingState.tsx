import React from 'react';

export function EventGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 animate-pulse">
          <div className="aspect-[4/3] w-full bg-muted rounded-xl" />
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded-md w-3/4" />
            <div className="h-4 bg-muted rounded-md w-1/2" />
            <div className="h-4 bg-muted rounded-md w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <div
      className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
