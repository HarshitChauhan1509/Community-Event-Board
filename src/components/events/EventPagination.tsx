'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EventPaginationProps {
  pagination: PaginationMetadata;
  onPageChange: (newPage: number) => void;
}

export function EventPagination({ pagination, onPageChange }: EventPaginationProps) {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
      <div className="text-xs text-muted-foreground font-medium">
        Showing <span className="text-foreground font-semibold">{startItem}</span> to{' '}
        <span className="text-foreground font-semibold">{endItem}</span> of{' '}
        <span className="text-foreground font-semibold">{total}</span> events
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-border bg-surface hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="p-2 rounded-lg border border-border bg-surface hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
