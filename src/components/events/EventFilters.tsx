'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface EventFiltersProps {
  categories: { id: string; name: string; eventCount?: number }[];
  cities: string[];
  selectedCategory: string;
  selectedCity: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onCityChange: (city: string) => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}

export function EventFilters({
  categories,
  cities,
  selectedCategory,
  selectedCity,
  searchQuery,
  onCategoryChange,
  onCityChange,
  onSearchChange,
  onResetFilters,
}: EventFiltersProps) {
  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'All') ||
    (selectedCity && selectedCity !== 'All') ||
    searchQuery.trim().length > 0;

  return (
    <div className="w-full space-y-6 mb-10">
      {/* Search Bar & City Selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events by title, keyword, or artist..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="sm:w-56">
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer"
          >
            <option value="All">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'All' || !selectedCategory
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border bg-surface text-muted-foreground hover:border-zinc-400 hover:text-foreground'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id || cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-surface text-muted-foreground hover:border-zinc-400 hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <SlidersHorizontal className="w-3 h-3 text-accent" />
            Active filters:
          </span>
          {selectedCategory && selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-medium">
              Category: {selectedCategory}
              <button onClick={() => onCategoryChange('All')} className="hover:text-red-500 ml-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCity && selectedCity !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-medium">
              City: {selectedCity}
              <button onClick={() => onCityChange('All')} className="hover:text-red-500 ml-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery.trim().length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => onSearchChange('')} className="hover:text-red-500 ml-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
