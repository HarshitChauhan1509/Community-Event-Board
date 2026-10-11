'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EventFilters } from './EventFilters';
import { EventCard, EventItem } from './EventCard';
import { EventPagination } from './EventPagination';
import { EventGridSkeleton } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';

interface CategoryItem {
  id: string;
  name: string;
  eventCount?: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function EventExplorer() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Status states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  // Fetch filter metadata (categories & cities) once
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/cities'),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data || []);
        }

        if (cityRes.ok) {
          const cityData = await cityRes.json();
          setCities(cityData.data || []);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    }

    fetchMetadata();
  }, []);

  // Fetch events based on current active filters
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '9');

      if (selectedCategory && selectedCategory !== 'All') {
        params.set('category', selectedCategory);
      }

      if (selectedCity && selectedCity !== 'All') {
        params.set('city', selectedCity);
      }

      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch events from server');
      }

      const json = await res.json();
      setEvents(json.data || []);
      setPagination(json.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while loading events');
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, selectedCity, searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCity('All');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <section id="events" className="w-full py-16 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-2 block">
              Curated Discovery
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Upcoming Events
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Showing verified community events across top cities. Sort by nearest date first.
          </p>
        </div>

        {/* Filter Controls */}
        <EventFilters
          categories={categories}
          cities={cities}
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onCityChange={handleCityChange}
          onSearchChange={handleSearchChange}
          onResetFilters={handleResetFilters}
        />

        {/* Main Content Area: Loading, Error, Empty, or Grid */}
        {loading ? (
          <EventGridSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEvents} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events match your criteria"
            description="We couldn’t find any active events satisfying this combination of category, city, and search query. Try clearing your filters."
            actionText="Clear All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            <EventPagination pagination={pagination} onPageChange={(p) => setPage(p)} />
          </>
        )}
      </div>
    </section>
  );
}
