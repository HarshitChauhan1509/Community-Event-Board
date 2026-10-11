'use client';

import React, { useState, useEffect } from 'react';
import { AdminEventModal, AdminEventData } from './AdminEventModal';
import { formatEventDate, formatIndianPrice } from '@/lib/utils/format';
import { Spinner } from '@/components/common/LoadingState';
import { Plus, Edit2, Calendar, MapPin, Power, Bell } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

export function AdminEventList() {
  const [events, setEvents] = useState<AdminEventData[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventData | null>(null);

  // Toggling status in flight
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchEventsAndCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, catRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/categories'),
      ]);

      if (!eventsRes.ok) {
        throw new Error('Failed to fetch events from admin endpoint');
      }

      const eventsJson = await eventsRes.json();
      setEvents(eventsJson.data || []);

      if (catRes.ok) {
        const catJson = await catRes.json();
        setCategories(catJson.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndCategories();
  }, []);

  const handleToggleStatus = async (event: AdminEventData) => {
    if (togglingId) return;

    const newStatus = !event.isActive;

    // Optimistic UI update
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, isActive: newStatus } : e))
    );
    setTogglingId(event.id || null);

    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      // Revert state
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, isActive: event.isActive } : e))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: AdminEventData) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
            Administration
          </span>
          <h1 className="text-3xl font-display font-semibold text-foreground tracking-tight">
            Event Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and toggle visibility for community events. (Events cannot be deleted).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner className="w-8 h-8 text-accent" />
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          No events created yet. Click "Add Event" to create the first one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm divide-y divide-border">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-semibold text-foreground font-display line-clamp-1 max-w-xs">
                        {event.title}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-muted border border-border">
                      {event.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{event.city}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-accent" />
                      <span>{formatEventDate(event.date, event.time)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-foreground">
                    {formatIndianPrice(event.price)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(event)}
                      disabled={togglingId === event.id}
                      title="Click to toggle Active/Inactive"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        event.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500/20'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{event.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleOpenEdit(event)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchEventsAndCategories}
        initialEvent={editingEvent}
        categories={categories}
      />
    </div>
  );
}
